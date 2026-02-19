import React, { useState, useRef } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Link } from 'react-router-dom'
import { Search, Filter, ChevronDown, ChevronDown as LoadMoreIcon, ChevronLeft } from 'lucide-react'
import ReviewsFilterWidget from '../components/reviews_filter_widget'
import ReviewsAllWidget from '../components/reviews_all_widget'
import DateAndTimeWidget from '../components/date_and_time_widget'
import { Star } from 'lucide-react'

const RATING_DISTRIBUTION = [
	{ stars: 5, label: 'Excellent', count: 125 },
	{ stars: 4, label: 'Super good', count: 25 },
	{ stars: 3, label: 'Average', count: 25 },
	{ stars: 2, label: 'Good', count: 10 },
	{ stars: 1, label: 'Poor', count: 2 }
]
const MAX_BAR_COUNT = 125

const SAMPLE_REVIEWS = [
	{ id: 1, name: 'Christiana Emeka', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80', rating: 4.0, time: '12:32pm', day: 'Tue', comment: 'The apartment was clean, cozy, and exactly as advertised. Perfect short stay.' },
	{ id: 2, name: 'Efe Oghene', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', rating: 4.5, time: '10:15am', day: 'Mon', comment: 'Great property with excellent amenities. The landlord is very responsive and helpful.' },
	{ id: 3, name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80', rating: 5.0, time: '3:45pm', day: 'Wed', comment: 'Amazing property! Everything was perfect. Would definitely book again.' },
	{ id: 4, name: 'Ada Okafor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', rating: 3.5, time: '9:00am', day: 'Thu', comment: 'Good value for money. Location was convenient. Minor issues with hot water.' },
	{ id: 5, name: 'Chidi Nwosu', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80', rating: 4.0, time: '11:20am', day: 'Fri', comment: 'Clean and comfortable. Quick check-in process. Recommend for business stays.' }
]

const ReviewsView = ({ onBack }) => {
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [isAllOpen, setIsAllOpen] = useState(false)
	const [isDateAndTimeOpen, setIsDateAndTimeOpen] = useState(false)
	const [selectedRatingFilter, setSelectedRatingFilter] = useState('excellent')
	const [selectedFilter, setSelectedFilter] = useState('none')
	const [fromDate, setFromDate] = useState(null)
	const [toDate, setToDate] = useState(null)
	const [searchQuery, setSearchQuery] = useState('')
	const filterAnchorRef = useRef(null)
	const allAnchorRef = useRef(null)

	const overallRating = 4.3
	const totalReviews = 230

	const renderStars = (rating) => {
		const fullStars = Math.floor(rating)
		const hasHalfStar = rating % 1 !== 0
		return (
			<div className='flex items-center gap-0.5'>
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`w-4 h-4 ${
							i < fullStars ? 'fill-primary text-primary' : i === fullStars && hasHalfStar ? 'fill-primary/50 text-primary' : 'text-gray-300'
						}`}
					/>
				))}
			</div>
		)
	}

	return (
		<div className='pt-10'>
				{onBack && (
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				)}

				<div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
					{/* Left: Review summary */}
					<div className='lg:col-span-1'>
						<div className='bg-white rounded-2xl border border-gray-200 p-6'>
							<div className='flex items-baseline gap-2 mb-1'>
								<span className='text-[48px] font-bold text-gray-900'>{overallRating}</span>
								{renderStars(overallRating)}
							</div>
							<span className='inline-block px-3 py-1 rounded-full bg-gray-100 text-[12px] text-gray-600 mb-6'>
								Based on reviews from verified users
							</span>
							{/* Rating distribution bars */}
							<div className='space-y-4'>
								{RATING_DISTRIBUTION.map(({ stars, label, count }) => (
									<div key={stars} className='flex items-center gap-3'>
										<span className='w-4 text-[14px] font-medium text-gray-700'>{stars}</span>
										<div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
											<div
												className='h-full bg-primary rounded-full'
												style={{ width: `${(count / MAX_BAR_COUNT) * 100}%` }}
											/>
										</div>
									</div>
								))}
							</div>
							<div className='mt-4 space-y-1 text-[14px] text-gray-600'>
								{RATING_DISTRIBUTION.map(({ label, count }) => (
									<div key={label} className='flex justify-between'>{label} 
									 <span className='text-[12px] text-gray-500'>({count})</span>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Right: All reviews + controls */}
					<div className='lg:col-span-2'>
						<h2 className='text-[24px] font-semibold text-gray-900 mb-6'>All reviews ({totalReviews})</h2>

						{/* Control bar: Search, All, Filter */}
						<div className='flex flex-wrap gap-3 mb-6 relative'>
							<div className='flex-1 min-w-[200px] relative'>
								<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
								<input
									type='text'
									placeholder='Search'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className='w-full pl-10 pr-4 py-3 border border-gray-300 
									  rounded-full text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20'
								/>
							</div>
							<div className='relative' ref={allAnchorRef}>
								<button
									type='button'
									onClick={() => { setIsAllOpen(!isAllOpen); setIsFilterOpen(false); setIsDateAndTimeOpen(false); }}
									className='flex items-center gap-2 px-4 py-3 border 
									  border-gray-300 rounded-full bg-white text-[14px] 
									  font-medium text-gray-700 hover:bg-gray-50'
								>
									All
									<ChevronDown className='w-4 h-4' />
								</button>
								<div className='relative'>
									<ReviewsAllWidget
										isOpen={isAllOpen}
										onClose={() => setIsAllOpen(false)}
										selectedRating={selectedRatingFilter}
										onSelect={setSelectedRatingFilter}
									/>
								</div>
							</div>
							<div className='relative' ref={filterAnchorRef}>
								<button
									type='button'
									onClick={() => { setIsFilterOpen(!isFilterOpen); setIsAllOpen(false); setIsDateAndTimeOpen(false); }}
									className='flex items-center gap-2 px-4 py-3 
									  border border-gray-300 rounded-full bg-white text-[14px] 
									  font-medium text-gray-700 hover:bg-gray-50'
								>
									<Filter className='w-4 h-4' />
									Filter
								</button>
								<div className='relative'>
									<ReviewsFilterWidget
										isOpen={isFilterOpen}
										onClose={() => setIsFilterOpen(false)}
										selectedFilter={selectedFilter}
										onSelectNone={() => setSelectedFilter('none')}
										onSelectRating={() => { setSelectedFilter('rating'); setIsFilterOpen(false); setIsAllOpen(true); }}
										onSelectDate={() => { setSelectedFilter('date'); setIsFilterOpen(false); setIsDateAndTimeOpen(true); }}
									/>
									<DateAndTimeWidget
										isOpen={isDateAndTimeOpen}
										onClose={() => setIsDateAndTimeOpen(false)}
										fromDate={fromDate}
										toDate={toDate}
										onFromChange={setFromDate}
										onToChange={setToDate}
									/>
								</div>
							</div>
						</div>

						{/* Review cards */}
						<div className='space-y-6'>
							{SAMPLE_REVIEWS.map((review) => (
								<div key={review.id} className='flex gap-4 p-4 bg-white rounded-xl border border-gray-200'>
									<img
										src={review.avatar}
										alt={review.name}
										className='w-12 h-12 rounded-full object-cover shrink-0'
									/>
									<div className='min-w-0 flex-1'>
										<p className='text-[16px] font-semibold text-gray-900'>{review.name}</p>
										<div className='flex items-center gap-2 mt-1 text-[14px] text-gray-500'>
											<span>{review.rating}</span>
											{renderStars(review.rating)}
											<span>{review.time}</span>
											<span>{review.day}</span>
										</div>
										<p className='text-[14px] text-gray-700 mt-2 leading-relaxed'>{review.comment}</p>
									</div>
								</div>
							))}
						</div>

						<div className='flex justify-center mt-8'>
							<button
								type='button'
								className='flex items-center gap-2 px-6 py-3 border border-gray-300 
								 rounded-full bg-white text-[16px] font-medium text-gray-700 hover:bg-gray-50'
							>
								Load more
								<LoadMoreIcon className='w-5 h-5' />
							</button>
						</div>
					</div>
				</div>
			</div>
	)
}

export default ReviewsView
