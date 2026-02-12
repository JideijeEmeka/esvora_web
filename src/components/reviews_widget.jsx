import React, { useRef } from 'react'
import { ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const ReviewsWidget = ({ rating, reviewCount, reviews }) => {
	const reviewsRef = useRef(null)

	const scrollCarousel = (ref, direction) => {
		if (!ref.current) return
		const scrollAmount = 300
		if (direction === 'right') {
			ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
		} else {
			ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
		}
	}

	const renderStars = (rating) => {
		const fullStars = Math.floor(rating)
		const hasHalfStar = rating % 1 !== 0
		return (
			<div className='flex items-center gap-1'>
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`w-4 h-4 ${
							i < fullStars
								? 'fill-yellow-400 text-yellow-400'
								: i === fullStars && hasHalfStar
								? 'fill-yellow-400/50 text-yellow-400'
								: 'text-gray-300'
						}`}
					/>
				))}
			</div>
		)
	}

	return (
		<div className='mb-8'>
			<div className='flex items-center justify-between gap-2 py-2'>
				<p className='text-[16px] text-gray-700'>
					Most recent reviews ({reviewCount})
				</p>
				<div className='flex items-center gap-2'>
					<button
							onClick={() => scrollCarousel(reviewsRef, 'left')}
							className='w-10 h-10 rounded-full border border-gray-200 
							flex items-center justify-center hover:bg-gray-50 transition-colors'
						>
							<ChevronLeft className='w-5 h-5 text-gray-700' />
						</button>
						<button
							onClick={() => scrollCarousel(reviewsRef, 'right')}
							className='w-10 h-10 rounded-full border border-gray-200 
							  flex items-center justify-center hover:bg-gray-50 transition-colors'
						>
							<ChevronRight className='w-5 h-5 text-gray-700' />
						</button>
				</div>
			</div>
			<div className='relative'>
				<div ref={reviewsRef} className='flex gap-4 overflow-x-auto pb-4 mt-10 scrollbar-hide'>
					{reviews.map((review) => (
						<div
							key={review.id}
							className='shrink-0 w-[320px] bg-white border border-gray-200 rounded-lg p-6'
						>
							<div className='flex items-start justify-between mb-4'>
								<div>
								<img
									src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100"
									alt={review.name}
									className='w-10 h-10 rounded-full object-cover'
								/>
									<p className='text-[16px] font-semibold text-gray-900 mb-1 mt-2'>
										{review.name}
									</p>
									<div className='flex items-center gap-2'>
										{renderStars(review.rating)}
										<span className='text-[12px] text-gray-500'>{review.date}</span>
									</div>
								</div>
							</div>
							<p className='text-[14px] text-gray-700 leading-relaxed'>
								{review.comment}
							</p>
						</div>
					))}
				</div>
			</div>
			<div className='flex justify-center mt-4'>
				<Link
					to='#'
					className='w-[200px] h-[40px] text-gray-600 hover:underline text-[16px] 
					 flex items-center justify-center gap-2 font-medium cursor-pointer hover:text-gray-900 
					 transition-colors border border-gray-200 rounded-full px-1.5 py-1.5'
				>
					See all {reviewCount} reviews <ArrowRight className='w-4 h-4' />
				</Link>
			</div>
		</div>
	)
}

export default ReviewsWidget
