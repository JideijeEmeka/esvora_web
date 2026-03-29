import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { X, LocateFixed, Loader2 } from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
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

function UpdateMapView({ position }) {
	const map = useMap()

	useEffect(() => {
		if (position) {
			map.setView(position, 15)
		}
	}, [position, map])

	return null
}

const MapModal = ({ isOpen, onClose }) => {
	const deviceLocation = useSelector(selectDeviceLocationSnapshot)
	const [position, setPosition] = useState(null)
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (!isOpen) return

		if (deviceLocation?.latitude && deviceLocation?.longitude) {
			setPosition([deviceLocation.latitude, deviceLocation.longitude])
			setError('')
			setLoading(false)
		} else {
			requestLocation()
		}
	}, [isOpen, deviceLocation])

	const requestLocation = () => {
		if (!navigator.geolocation) {
			setError('Geolocation is not supported by this browser.')
			setLoading(false)
			return
		}

		setLoading(true)
		setError('')

		navigator.geolocation.getCurrentPosition(
			(loc) => {
				const { latitude, longitude } = loc.coords
				setPosition([latitude, longitude])
				setError('')
				setLoading(false)
			},
			(err) => {
				const messages = {
					1: 'Location access denied. Please enable location permissions.',
					2: 'Unable to determine your location.',
					3: 'Location request timed out.',
				}
				setError(messages[err.code] || err.message || 'Unable to get location.')
				setLoading(false)
			},
			{ enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
		)
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4'>
			<div className='w-full max-w-4xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col'>
				<div className='px-5 py-4 border-b border-gray-200 flex items-center justify-between shrink-0'>
					<h3 className='text-[18px] font-semibold text-gray-900'>Your Location</h3>
					<button
						type='button'
						onClick={onClose}
						className='w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors'
					>
						<X className='w-5 h-5 text-gray-600' />
					</button>
				</div>

				<div className='flex-1 relative'>
					{loading && (
						<div className='absolute inset-0 z-1000 bg-white flex items-center justify-center'>
							<div className='flex flex-col items-center gap-3'>
								<Loader2 className='w-8 h-8 text-primary animate-spin' />
								<p className='text-[14px] text-gray-500'>Getting your location...</p>
							</div>
						</div>
					)}

					<MapContainer
						center={position || [9.082, 8.6753]}
						zoom={position ? 15 : 6}
						scrollWheelZoom={true}
						style={{ height: '100%', width: '100%' }}
					>
						<TileLayer
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
						/>
						{position && (
							<>
								<UpdateMapView position={position} />
								<Marker position={position}>
									<Popup>You are here</Popup>
								</Marker>
							</>
						)}
					</MapContainer>

					{!loading && (
						<button
							type='button'
							onClick={requestLocation}
							title='Center on my location'
							className='absolute bottom-6 right-6 z-1000 w-12 h-12 bg-white rounded-full shadow-lg
								flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200'
						>
							<LocateFixed className='w-5 h-5 text-primary' />
						</button>
					)}
				</div>

				{error && (
					<div className='px-5 py-3 border-t border-gray-200 bg-amber-50'>
						<p className='text-[13px] text-amber-700'>{error}</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default MapModal
