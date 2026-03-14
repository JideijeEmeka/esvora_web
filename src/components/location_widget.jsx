import React from 'react'
import { MapPin, Maximize2 } from 'lucide-react'

const LocationWidget = ({ property }) => {
	const state = property?.state ?? ''
	const city = property?.city ?? ''
	const address = property?.address ?? ''
	const postalCode = property?.postal_code ?? ''
	const hasLocationDetails = state || city || address || postalCode

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
				<div className='w-full h-full bg-gray-100 flex items-center justify-center'>
					<div className='text-center'>
						<MapPin className='w-16 h-16 text-gray-400 mx-auto mb-4' />
						<p className='text-gray-600'>Map view will be displayed here</p>
						<p className='text-[14px] text-gray-500 mt-2'>
							Integration with Google Maps or similar service
						</p>
					</div>
				</div>
				<div className='absolute top-4 right-4 flex flex-col gap-2'>
					<button className='w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'>
						<span className='text-[18px] font-semibold'>+</span>
					</button>
					<button className='w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'>
						<span className='text-[18px] font-semibold'>-</span>
					</button>
					<button className='w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'>
						<Maximize2 className='w-4 h-4 text-gray-700' />
					</button>
				</div>
			</div>
		</div>
	)
}

export default LocationWidget
