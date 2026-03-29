import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
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

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const NIGERIA_CENTER = [9.082, 8.6753]

function FlyToPosition({ position }) {
	const map = useMap()
	useEffect(() => {
		if (position) map.flyTo(position, 15)
	}, [position, map])
	return null
}

const LocationWidget = ({ property }) => {
	const deviceLocation = useSelector(selectDeviceLocationSnapshot)
	const state = property?.state ?? ''
	const city = property?.city ?? ''
	const address = property?.address ?? ''
	const postalCode = property?.postal_code ?? ''
	const hasLocationDetails = state || city || address || postalCode

	const [position, setPosition] = useState(null)

	useEffect(() => {
		const lat = property?.latitude ?? property?.lat
		const lng = property?.longitude ?? property?.lng ?? property?.lon
		if (lat && lng) {
			setPosition([parseFloat(lat), parseFloat(lng)])
			return
		}

		const query = address || [city, state].filter(Boolean).join(', ')
		if (query && query !== '—') {
			fetch(`${NOMINATIM_BASE}/search?q=${encodeURIComponent(query)}&format=json&limit=1`)
				.then((res) => res.json())
				.then((results) => {
					if (results?.[0]?.lat && results?.[0]?.lon) {
						setPosition([parseFloat(results[0].lat), parseFloat(results[0].lon)])
					}
				})
				.catch(() => {})
		}
	}, [property])

	const center = position || NIGERIA_CENTER
	const zoom = position ? 15 : 6

	return (
		<div className='mb-8'>
			<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Location</h2>
			{hasLocationDetails && (
				<div className='mb-6 p-6 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3'>
					{address && (
						<div>
							<span className='text-[12px] font-medium text-gray-500 uppercase tracking-wide'>Address</span>
							<p className='text-[16px] text-gray-900 mt-0.5'>{address}</p>
						</div>
					)}
					<div className='flex flex-wrap gap-6'>
						{city && (
							<div>
								<span className='text-[12px] font-medium text-gray-500 uppercase tracking-wide'>City</span>
								<p className='text-[16px] text-gray-900 mt-0.5'>{city}</p>
							</div>
						)}
						{state && (
							<div>
								<span className='text-[12px] font-medium text-gray-500 uppercase tracking-wide'>State</span>
								<p className='text-[16px] text-gray-900 mt-0.5'>{state}</p>
							</div>
						)}
						{postalCode && (
							<div>
								<span className='text-[12px] font-medium text-gray-500 uppercase tracking-wide'>Postal code</span>
								<p className='text-[16px] text-gray-900 mt-0.5'>{postalCode}</p>
							</div>
						)}
					</div>
				</div>
			)}
			<div className='relative w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-gray-200'>
				<MapContainer
					center={center}
					zoom={zoom}
					scrollWheelZoom={true}
					style={{ height: '100%', width: '100%' }}
				>
					<TileLayer
						attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
					/>
					{position && (
						<>
							<FlyToPosition position={position} />
							<Marker position={position}>
								<Popup>{address || 'Property location'}</Popup>
							</Marker>
						</>
					)}
				</MapContainer>
			</div>
		</div>
	)
}

export default LocationWidget
