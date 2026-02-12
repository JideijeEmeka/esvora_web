import React from 'react'
import { Filter, Check, ChevronRight } from 'lucide-react'

const ReviewsFilterWidget = ({ isOpen, onClose, selectedFilter = 'none', onSelectNone, onSelectRating, onSelectDate }) => {
	if (!isOpen) return null

	return (
		<div className='absolute z-[55] mt-1 right-0 w-[240px] bg-white rounded-xl shadow-xl border border-gray-200 py-2'>
			<div className='flex items-center gap-2 px-4 py-2 border-b border-gray-100'>
				<Filter className='w-5 h-5 text-gray-700' />
				<span className='text-[16px] font-semibold text-gray-900'>Filter</span>
			</div>
			<button
				type='button'
				onClick={() => { if (onSelectNone) onSelectNone(); if (onClose) onClose() }}
				className='w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[14px] text-gray-700'
			>
				None
				{selectedFilter === 'none' && <Check className='w-5 h-5 text-primary' />}
			</button>
			<button
				type='button'
				onClick={() => { if (onSelectRating) onSelectRating(); if (onClose) onClose() }}
				className='w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[14px] text-gray-700'
			>
				Rating
				<ChevronRight className='w-5 h-5 text-gray-500' />
			</button>
			<button
				type='button'
				onClick={() => { if (onSelectDate) onSelectDate(); if (onClose) onClose() }}
				className='w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 text-[14px] text-gray-700'
			>
				Date
				<ChevronRight className='w-5 h-5 text-gray-500' />
			</button>
		</div>
	)
}

export default ReviewsFilterWidget
