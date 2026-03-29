import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useSelector } from 'react-redux'
import { Loader2, MapPin, Search, X, LocateFixed } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { selectDeviceLocationSnapshot } from '../redux/slices/deviceLocationSlice'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
})

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const NIGERIA_CENTER = [9.082, 8.6753]

async function searchAddress(query) {
	if (!query || query.trim().length < 2) return []
	try {
		const res = await fetch(
			`${NOMINATIM_BASE}/search?q=${encodeURIComponent(query.trim())}&format=json&addressdetails=1&limit=8&countrycodes=ng`
		)
		if (!res.ok) return []
		return await res.json()
	} catch {
		return []
	}
}

async function reverseGeocode(lat, lng) {
	try {
		const res = await fetch(
			`${NOMINATIM_BASE}/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`
		)
		if (!res.ok) return null
		return await res.json()
	} catch {
		return null
	}
}

function extractPostalCode(addressDetails) {
	return addressDetails?.postcode || ''
}

function UpdateMapView({ position }) {
	const map = useMap()
	useEffect(() => {
		if (position) map.setView(position, 16)
	}, [position, map])
	return null
}

function MapClickHandler({ onMapClick }) {
	useMapEvents({
		click(e) {
			onMapClick([e.latlng.lat, e.latlng.lng])
		},
	})
	return null
}

const AddressInputWithMap = ({
	value,
	onChangeAddress,
	onChangePostalCode,
	onLocationChange,
	placeholder = 'Enter address',
}) => {
	const deviceLocation = useSelector(selectDeviceLocationSnapshot)
	const [predictions, setPredictions] = useState([])
	const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
	const [isMapOpen, setIsMapOpen] = useState(false)
	const [isResolvingAddress, setIsResolvingAddress] = useState(false)
	const [mapSearch, setMapSearch] = useState('')
	const [mapSearchResults, setMapSearchResults] = useState([])
	const [isSearchingMap, setIsSearchingMap] = useState(false)
	const [selectedPosition, setSelectedPosition] = useState(null)
	const debounceRef = useRef(null)
	const mapDebounceRef = useRef(null)

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
			if (mapDebounceRef.current) clearTimeout(mapDebounceRef.current)
		}
	}, [])

	const getInitialCenter = useCallback(() => {
		if (selectedPosition) return selectedPosition
		if (deviceLocation?.latitude && deviceLocation?.longitude) {
			return [deviceLocation.latitude, deviceLocation.longitude]
		}
		return NIGERIA_CENTER
	}, [selectedPosition, deviceLocation])

	const handleAddressInputChange = (nextValue) => {
		onChangeAddress(nextValue)
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(async () => {
			if (nextValue.trim().length < 2) {
				setPredictions([])
				setIsLoadingPredictions(false)
				return
			}
			setIsLoadingPredictions(true)
			const results = await searchAddress(nextValue)
			setPredictions(results)
			setIsLoadingPredictions(false)
		}, 400)
	}

	const handleSelectPrediction = (item) => {
		const address = item.display_name || ''
		onChangeAddress(address)
		const postalCode = extractPostalCode(item.address)
		if (postalCode) onChangePostalCode?.(postalCode)
		if (item.lat && item.lon) {
			const lat = parseFloat(item.lat)
			const lng = parseFloat(item.lon)
			onLocationChange?.({ latitude: lat, longitude: lng })
			setSelectedPosition([lat, lng])
		}
		setPredictions([])
	}

	const openMap = () => {
		setIsMapOpen(true)
		setMapSearch(value || '')
		setMapSearchResults([])
	}

	const handleMapSearchChange = (nextValue) => {
		setMapSearch(nextValue)
		if (mapDebounceRef.current) clearTimeout(mapDebounceRef.current)
		mapDebounceRef.current = setTimeout(async () => {
			if (nextValue.trim().length < 2) {
				setMapSearchResults([])
				setIsSearchingMap(false)
				return
			}
			setIsSearchingMap(true)
			const results = await searchAddress(nextValue)
			setMapSearchResults(results)
			setIsSearchingMap(false)
		}, 400)
	}

	const handleSelectMapResult = (item) => {
		if (!item.lat || !item.lon) return
		const lat = parseFloat(item.lat)
		const lng = parseFloat(item.lon)
		setSelectedPosition([lat, lng])
		setMapSearch(item.display_name || '')
		setMapSearchResults([])
	}

	const handleMapClick = (pos) => {
		setSelectedPosition(pos)
	}

	const handleLocateMe = () => {
		if (!navigator.geolocation) return
		navigator.geolocation.getCurrentPosition(
			(loc) => setSelectedPosition([loc.coords.latitude, loc.coords.longitude]),
			() => {},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
		)
	}

	const handleUseMapLocation = async () => {
		if (!selectedPosition) {
			setIsMapOpen(false)
			return
		}
		setIsResolvingAddress(true)
		try {
			const result = await reverseGeocode(selectedPosition[0], selectedPosition[1])
			if (result?.display_name) onChangeAddress(result.display_name)
			const postalCode = extractPostalCode(result?.address)
			if (postalCode) onChangePostalCode?.(postalCode)
			onLocationChange?.({
				latitude: selectedPosition[0],
				longitude: selectedPosition[1],
			})
		} catch {
			// Silently fail
		} finally {
			setIsResolvingAddress(false)
			setIsMapOpen(false)
		}
	}

	return (
		<>
			<div className='relative'>
				<input
					type='text'
					value={value}
					onChange={(e) => handleAddressInputChange(e.target.value)}
					placeholder={placeholder}
					className='w-full px-4 py-3 pr-12 border border-gray-300 rounded-full text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
				/>
				<button
					type='button'
					onClick={openMap}
					className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-primary transition-colors'
					aria-label='Open map picker'
				>
					<MapPin className='w-5 h-5' />
				</button>
			</div>

			{isLoadingPredictions && (
				<div className='mt-2 flex items-center gap-2 text-sm text-gray-500'>
					<Loader2 className='w-4 h-4 animate-spin' />
					<span>Loading suggestions...</span>
				</div>
			)}

			{predictions.length > 0 && (
				<div className='mt-2 border border-gray-200 rounded-xl bg-white shadow-sm max-h-64 overflow-y-auto'>
					{predictions.map((item) => (
						<button
							key={item.place_id}
							type='button'
							onClick={() => handleSelectPrediction(item)}
							className='w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
						>
							<div className='text-[14px] text-gray-900'>{item.display_name}</div>
						</button>
					))}
				</div>
			)}

			{isMapOpen && (
				<div className='fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4'>
					<div className='w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col max-h-[90vh]'>
						<div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between shrink-0'>
							<h3 className='text-[18px] font-semibold text-gray-900'>Pick location on map</h3>
							<button
								type='button'
								onClick={() => setIsMapOpen(false)}
								className='text-gray-500 hover:text-gray-700'
							>
								<X className='w-5 h-5' />
							</button>
						</div>

						<div className='p-4 flex-1 overflow-y-auto'>
							<div className='relative mb-3'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
								<input
									type='text'
									value={mapSearch}
									onChange={(e) => handleMapSearchChange(e.target.value)}
									placeholder='Search address'
									className='w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>

							{isSearchingMap && (
								<div className='mb-2 flex items-center gap-2 text-sm text-gray-500'>
									<Loader2 className='w-4 h-4 animate-spin' />
									<span>Searching...</span>
								</div>
							)}

							{mapSearchResults.length > 0 && (
								<div className='mb-3 border border-gray-200 rounded-xl bg-white shadow-sm max-h-48 overflow-y-auto'>
									{mapSearchResults.map((item) => (
										<button
											key={item.place_id}
											type='button'
											onClick={() => handleSelectMapResult(item)}
											className='w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
										>
											<div className='text-[13px] text-gray-900'>{item.display_name}</div>
										</button>
									))}
								</div>
							)}

							<div className='relative w-full h-[360px] rounded-xl border border-gray-200 overflow-hidden'>
								<MapContainer
									center={getInitialCenter()}
									zoom={selectedPosition ? 16 : 6}
									scrollWheelZoom={true}
									style={{ height: '100%', width: '100%' }}
								>
									<TileLayer
										attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
										url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
									/>
									<MapClickHandler onMapClick={handleMapClick} />
									{selectedPosition && (
										<>
											<UpdateMapView position={selectedPosition} />
											<Marker position={selectedPosition}>
												<Popup>Selected location</Popup>
											</Marker>
										</>
									)}
								</MapContainer>

								<button
									type='button'
									onClick={handleLocateMe}
									title='Use my current location'
									className='absolute bottom-3 right-3 z-1000 w-10 h-10 bg-white rounded-full shadow-lg
										flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200'
								>
									<LocateFixed className='w-4 h-4 text-primary' />
								</button>
							</div>

							<div className='mt-4 flex justify-end'>
								<button
									type='button'
									onClick={handleUseMapLocation}
									disabled={isResolvingAddress || !selectedPosition}
									className='bg-primary text-white px-6 py-2.5 rounded-full text-[15px] font-medium disabled:opacity-70'
								>
									{isResolvingAddress ? 'Resolving address...' : 'Use selected location'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default AddressInputWithMap
