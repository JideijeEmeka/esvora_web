import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, MapPin, Search, X } from 'lucide-react'
import { kGooglePlacesApiKey } from '../lib/constants'

const GOOGLE_MAPS_SCRIPT_ID = 'esvora-google-maps-script'

const loadGoogleMapsScript = (apiKey) => {
	if (typeof window === 'undefined') return Promise.reject(new Error('No window'))
	if (window.google?.maps?.places) return Promise.resolve(window.google)

	return new Promise((resolve, reject) => {
		const existing = document.getElementById(GOOGLE_MAPS_SCRIPT_ID)
		if (existing) {
			existing.addEventListener('load', () => resolve(window.google), { once: true })
			existing.addEventListener('error', () => reject(new Error('Failed to load Google Maps script')), { once: true })
			return
		}

		const script = document.createElement('script')
		script.id = GOOGLE_MAPS_SCRIPT_ID
		script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places`
		script.async = true
		script.defer = true
		script.onload = () => resolve(window.google)
		script.onerror = () => reject(new Error('Failed to load Google Maps script'))
		document.head.appendChild(script)
	})
}

const extractPostalCodeFromComponents = (components) => {
	if (!Array.isArray(components)) return ''
	for (const component of components) {
		const types = Array.isArray(component?.types) ? component.types : []
		if (types.includes('postal_code')) {
			return String(component.long_name || component.short_name || '')
		}
	}
	return ''
}

const initialCenter = { lat: 9.082, lng: 8.6753 }

const AddressInputWithMapInner = ({
	value,
	onChangeAddress,
	onChangePostalCode,
	onLocationChange,
	placeholder = 'Enter address',
	apiKey
}) => {
	const [apiStatus, setApiStatus] = useState('idle')
	const mapContainerRef = useRef(null)
	const mapRef = useRef(null)
	const markerRef = useRef(null)
	const mapClickListenerRef = useRef(null)
	const placesServiceRef = useRef(null)
	const autocompleteServiceRef = useRef(null)
	const placesServiceContainerRef = useRef(null)
	const [predictions, setPredictions] = useState([])
	const [isLoadingPredictions, setIsLoadingPredictions] = useState(false)
	const [isMapOpen, setIsMapOpen] = useState(false)
	const [isResolvingMapAddress, setIsResolvingMapAddress] = useState(false)
	const [mapSearch, setMapSearch] = useState('')
	const [mapSearchResults, setMapSearchResults] = useState([])
	const [isSearchingMap, setIsSearchingMap] = useState(false)
	const debounceRef = useRef(null)
	const mapDebounceRef = useRef(null)
	const [mapCenter, setMapCenter] = useState(initialCenter)
	const [selectedPosition, setSelectedPosition] = useState(initialCenter)
	const [mapZoom, setMapZoom] = useState(14)

	useEffect(() => {
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
			if (mapDebounceRef.current) clearTimeout(mapDebounceRef.current)
		}
	}, [])

	const ensurePlacesServices = async () => {
		if (!apiKey) return false
		try {
			setApiStatus('loading')
			await loadGoogleMapsScript(apiKey)
			if (!autocompleteServiceRef.current) {
				autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService()
			}
			if (!placesServiceContainerRef.current) {
				placesServiceContainerRef.current = document.createElement('div')
			}
			if (!placesServiceRef.current) {
				placesServiceRef.current = new window.google.maps.places.PlacesService(placesServiceContainerRef.current)
			}
			setApiStatus('loaded')
			return true
		} catch (_) {
			setApiStatus('failed')
			return false
		}
	}

	const initializeMap = async () => {
		const ok = await ensurePlacesServices()
		if (!ok || !mapContainerRef.current) return
		const center = selectedPosition || initialCenter
		mapRef.current = new window.google.maps.Map(mapContainerRef.current, {
			center,
			zoom: mapZoom,
			streetViewControl: false,
			mapTypeControl: false,
			fullscreenControl: false
		})
		markerRef.current = new window.google.maps.Marker({
			map: mapRef.current,
			position: center
		})
		if (mapClickListenerRef.current) {
			window.google.maps.event.removeListener(mapClickListenerRef.current)
		}
		mapClickListenerRef.current = mapRef.current.addListener('click', (event) => {
			const lat = event?.latLng?.lat?.()
			const lng = event?.latLng?.lng?.()
			if (typeof lat !== 'number' || typeof lng !== 'number') return
			const next = { lat, lng }
			setSelectedPosition(next)
			setMapCenter(next)
			markerRef.current?.setPosition(next)
		})
		// Keep PlacesService tied to this map instance.
		placesServiceRef.current = new window.google.maps.places.PlacesService(mapRef.current)
	}

	useEffect(() => {
		if (!isMapOpen) return
		initializeMap()
		return () => {
			if (mapClickListenerRef.current && window.google?.maps?.event) {
				window.google.maps.event.removeListener(mapClickListenerRef.current)
				mapClickListenerRef.current = null
			}
		}
	}, [isMapOpen])

	const fetchAutocompletePredictions = async (query, setTarget, setLoading) => {
		const ok = await ensurePlacesServices()
		if (!ok || query.trim().length < 2) {
			setTarget([])
			setLoading(false)
			return
		}
		if (!placesServiceContainerRef.current) {
			placesServiceContainerRef.current = document.createElement('div')
		}
		setLoading(true)
		autocompleteServiceRef.current.getPlacePredictions(
			{
				input: query.trim(),
				types: ['address']
			},
			(results, status) => {
				if (
					status !== window.google.maps.places.PlacesServiceStatus.OK ||
					!Array.isArray(results)
				) {
					setTarget([])
					setLoading(false)
					return
				}
				setTarget(results.slice(0, 10))
				setLoading(false)
			}
		)
	}

	const handleAddressInputChange = (nextValue) => {
		onChangeAddress(nextValue)
		if (debounceRef.current) clearTimeout(debounceRef.current)
		debounceRef.current = setTimeout(() => {
			fetchAutocompletePredictions(nextValue, setPredictions, setIsLoadingPredictions)
		}, 350)
	}

	const fetchPlaceDetails = (placeId) =>
		new Promise((resolve) => {
			if (!placesServiceRef.current || !placeId) {
				resolve(null)
				return
			}
			placesServiceRef.current.getDetails(
				{
					placeId,
					fields: ['formatted_address', 'address_components', 'geometry']
				},
				(place, status) => {
					if (
						status !== window.google.maps.places.PlacesServiceStatus.OK ||
						!place?.geometry?.location
					) {
						resolve(null)
						return
					}
					resolve({
						address: String(place.formatted_address || ''),
						postalCode: extractPostalCodeFromComponents(place.address_components),
						latitude: place.geometry.location.lat(),
						longitude: place.geometry.location.lng()
					})
				}
			)
		})

	const handleSelectPrediction = async (prediction) => {
		const details = await fetchPlaceDetails(prediction?.place_id)
		if (details) {
			if (details.address) onChangeAddress(details.address)
			if (details.postalCode) onChangePostalCode?.(details.postalCode)
			if (details.latitude != null && details.longitude != null) {
				onLocationChange?.({ latitude: details.latitude, longitude: details.longitude })
			}
		} else {
			onChangeAddress(String(prediction?.description || ''))
		}
		setPredictions([])
	}

	const openMap = () => {
		setIsMapOpen(true)
		setMapSearch(value || '')
		setMapSearchResults([])
		setMapZoom(14)
	}

	const handleMapSearchChange = (nextValue) => {
		setMapSearch(nextValue)
		if (mapDebounceRef.current) clearTimeout(mapDebounceRef.current)
		mapDebounceRef.current = setTimeout(() => {
			fetchAutocompletePredictions(nextValue, setMapSearchResults, setIsSearchingMap)
		}, 350)
	}

	const handleSelectMapResult = async (prediction) => {
		const details = await fetchPlaceDetails(prediction?.place_id)
		if (!details || details.latitude == null || details.longitude == null) return
		const next = { lat: details.latitude, lng: details.longitude }
		setSelectedPosition(next)
		setMapCenter(next)
		setMapZoom(16)
		mapRef.current?.setCenter(next)
		mapRef.current?.setZoom(16)
		markerRef.current?.setPosition(next)
		setMapSearch(details.address || prediction.description || '')
		setMapSearchResults([])
	}

	const handleUseMapLocation = async () => {
		if (!selectedPosition || !window.google?.maps?.Geocoder) {
			setIsMapOpen(false)
			return
		}
		setIsResolvingMapAddress(true)
		try {
			const geocoder = new window.google.maps.Geocoder()
			const results = await geocoder.geocode({ location: selectedPosition })
			const first = Array.isArray(results?.results) ? results.results[0] : null
			if (first?.formatted_address) onChangeAddress(first.formatted_address)

			let postalCode = ''
			for (const result of results?.results || []) {
				postalCode = extractPostalCodeFromComponents(result?.address_components)
				if (postalCode) break
			}
			if (postalCode) onChangePostalCode?.(postalCode)
			onLocationChange?.({
				latitude: selectedPosition.lat,
				longitude: selectedPosition.lng
			})
		} catch (_) {
			setPredictions([])
		} finally {
			setIsResolvingMapAddress(false)
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
							<div className='text-[14px] text-gray-900'>{item.structured_formatting?.main_text || item.description}</div>
							<div className='text-[12px] text-gray-500'>{item.structured_formatting?.secondary_text || ''}</div>
						</button>
					))}
				</div>
			)}

			{isMapOpen && (
				<div className='fixed inset-0 z-100 bg-black/40 flex items-center justify-center p-4'>
					<div className='w-full max-w-3xl bg-white rounded-2xl overflow-hidden shadow-xl'>
						<div className='px-4 py-3 border-b border-gray-200 flex items-center justify-between'>
							<h3 className='text-[18px] font-semibold text-gray-900'>Pick location on map</h3>
							<button
								type='button'
								onClick={() => setIsMapOpen(false)}
								className='text-gray-500 hover:text-gray-700'
							>
								<X className='w-5 h-5' />
							</button>
						</div>

						<div className='p-4'>
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
											<div className='text-[13px] text-gray-900'>{item.description}</div>
										</button>
									))}
								</div>
							)}

							<div className='relative w-full h-[360px] rounded-xl border border-gray-200 overflow-hidden'>
								<div ref={mapContainerRef} className='w-full h-full' />
								{String(apiStatus).toLowerCase().includes('loading') && (
									<div className='absolute inset-0 pointer-events-none flex items-center justify-center text-sm text-gray-500 bg-white/50'>
										<Loader2 className='w-4 h-4 animate-spin mr-2' />
										Loading map...
									</div>
								)}
								{String(apiStatus).toLowerCase().includes('fail') && (
									<div className='absolute inset-0 pointer-events-none flex items-center justify-center px-4 text-sm text-red-500 text-center bg-white/70'>
										Unable to load Google Maps JavaScript API. Check key referrer restrictions, enabled APIs, and billing.
									</div>
								)}
							</div>
							<div className='mt-2 text-[12px] text-gray-500'>
								Map API status: {String(apiStatus)}
							</div>

							<div className='mt-4 flex justify-end'>
								<button
									type='button'
									onClick={handleUseMapLocation}
									disabled={isResolvingMapAddress}
									className='bg-primary text-white px-6 py-2.5 rounded-full text-[15px] font-medium disabled:opacity-70'
								>
									{isResolvingMapAddress ? 'Resolving address...' : 'Use selected location'}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

const AddressInputWithMap = (props) => {
	const apiKey = useMemo(() => (kGooglePlacesApiKey || '').trim(), [])

	if (!apiKey) {
		return (
			<div className='text-[13px] text-red-500'>
				Google Places API key is missing. Set `VITE_GOOGLE_PLACES_API_KEY`.
			</div>
		)
	}

	return <AddressInputWithMapInner {...props} apiKey={apiKey} />
}

export default AddressInputWithMap
