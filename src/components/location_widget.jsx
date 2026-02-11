import React from 'react'
import { MapPin, Maximize2 } from 'lucide-react'

const LocationWidget = () => {
	return (
		<div className='mb-8'>
			<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Your location</h2>
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
