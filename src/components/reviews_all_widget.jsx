import React from 'react'
import { Star, Check } from 'lucide-react'

const RATING_OPTIONS = [
	{ id: 'excellent', label: 'Excellent', stars: 5 },
	{ id: 'very_good', label: 'Very good', stars: 4 },
	{ id: 'good', label: 'Good', stars: 3 },
	{ id: 'average', label: 'Average', stars: 2 },
	{ id: 'bad', label: 'Bad', stars: 1 }
]

const ReviewsAllWidget = ({ isOpen, onClose, selectedRating = 'excellent', onSelect }) => {
	const renderStars = (count) => (
		<div className='flex items-center gap-0.5'>
			{[...Array(5)].map((_, i) => (
				<Star
					key={i}
					className={`w-4 h-4 ${i < count ? 'fill-primary text-primary' : 'text-gray-300'}`}
				/>
			))}
		</div>
	)

	if (!isOpen) return null

	return (
		<div className='absolute z-[55] mt-1 right-0 w-[260px] bg-white rounded-xl shadow-xl border border-gray-200 py-2'>
			<div className='flex items-center gap-2 px-4 py-2 border-b border-gray-100'>
				<span className='text-[16px] font-semibold text-gray-900'>All</span>
				<Check className='w-5 h-5 text-primary' />
			</div>
			{RATING_OPTIONS.map((opt) => (
				<button
					key={opt.id}
					type='button'
					onClick={() => { if (onSelect) onSelect(opt.id); if (onClose) onClose() }}
					className='w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[14px] text-gray-700'
				>
					<div className='flex items-center gap-2'>
						{renderStars(opt.stars)}
						<span>{opt.label}</span>
					</div>
					{selectedRating === opt.id && <Check className='w-5 h-5 text-primary shrink-0' />}
				</button>
			))}
		</div>
	)
}

export default ReviewsAllWidget
