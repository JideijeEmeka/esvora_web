import React from 'react'
import { Heart, MapIcon } from 'lucide-react'

const PropertyCardWidget = ({ property, isFavorite = false, onFavoriteToggle, onViewDetails }) => {
	return (
		<div 
			className='shrink-0 w-[280px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow'
			onClick={onViewDetails}
		>
			<div className='relative'>
				<img 
					src={property.image} 
					alt={property.description}
					className='w-full h-[200px] object-cover'
				/>
				{property.available && (
					<div className='absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full'>
						<span className='text-[12px] font-medium text-gray-700'>Available</span>
					</div>
				)}
				{onFavoriteToggle && (
					<button
						onClick={() => onFavoriteToggle(property.id)}
						className='absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors'
					>
						<Heart 
							className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'}`}
						/>
					</button>
				)}
			</div>
			<div className='p-4'>
				<p className='text-[20px] font-semibold text-gray-900 mb-2'>{property.price}</p>
				<p className='text-[14px] font-medium text-gray-700 mb-2'>{property.description}</p>
				<div className='flex items-center gap-1'>
					<MapIcon className='w-4 h-4 text-gray-500' />
					<p className='text-[14px] text-gray-500'>{property.location}</p>
				</div>
			</div>
		</div>
	)
}

export default PropertyCardWidget
