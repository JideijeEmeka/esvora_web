import React, { useEffect } from 'react'
import { X, Heart } from 'lucide-react'
import Divider from './divider'

const AddToFavoriteWidget = ({ isOpen, onClose, property }) => {
	// Prevent body scroll when modal is open (same pattern as filter_properties_widget)
	useEffect(() => {
		if (isOpen) {
			const originalOverflow = document.body.style.overflow
			const originalPosition = document.body.style.position
			const originalTop = document.body.style.top
			const scrollY = window.scrollY

			document.body.style.overflow = 'hidden'
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'

			return () => {
				document.body.style.overflow = originalOverflow || ''
				document.body.style.position = originalPosition || ''
				document.body.style.top = originalTop || ''
				document.body.style.width = ''
				window.scrollTo(0, scrollY)
			}
		}
	}, [isOpen])

	const image = property?.images?.[0] ?? property?.image ?? ''
	const price = property?.price ?? ''
	const description = property?.title ?? property?.description ?? ''
	const location = property?.location ?? property?.fullAddress ?? ''

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6'>
					<h2 className='text-[24px] font-bold text-gray-900'>Add to favourite</h2>
					<button
						type='button'
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
					>
						<X className='w-5 h-5 text-gray-700' />
					</button>
				</div>

				{/* Property preview */}
				<div className='px-6 pb-6'>
					<div className='flex gap-4 mb-6'>
						<div className='shrink-0 w-[200px] h-[120px] rounded-lg overflow-hidden bg-gray-100'>
							{image ? (
								<img
									src={image}
									alt={description}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-400 text-[12px]'>
									No image
								</div>
							)}
						</div>
						<div className='min-w-0 flex-1 flex flex-col justify-center'>
							<p className='text-[20px] font-bold text-gray-900'>{price}</p>
							<p className='text-[14px] text-gray-600 mt-1'>{description}</p>
							<p className='text-[14px] text-gray-500 mt-1'>{location}</p>
						</div>
					</div>

					<Divider className='my-4' />

					{/* Confirmation message */}
					<div className='flex items-center gap-2'>
						<span className='text-[16px] text-gray-600'>
							Added to your list of favorites
						</span>
						<Heart className='w-5 h-5 fill-red-500 text-red-500 shrink-0' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default AddToFavoriteWidget
