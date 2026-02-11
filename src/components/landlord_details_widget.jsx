import React, { useState, useRef } from 'react'
import { Star, Phone, Mail, CheckCircle, ChevronLeft, ChevronRight, Search, Filter, ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PropertyCardWidget from './property_card_widget'
import ReviewsFilterWidget from './reviews_filter_widget'
import ReviewsAllWidget from './reviews_all_widget'
import DateAndTimeWidget from './date_and_time_widget'
import Divider from './divider'

const DEFAULT_LISTINGS = [
	{ id: 1, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 2, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', price: '€95,000', description: '3 bedroom luxury apartment', location: 'Victoria Island, Lagos, Nigeria', available: true },
	{ id: 3, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400', price: '€150,000', description: '5 bedroom detached house', location: 'Lekki, Lagos, Nigeria', available: true },
	{ id: 4, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', price: '€80,000', description: '2 bedroom cozy apartment', location: 'Surulere, Lagos, Nigeria', available: true }
]

const SAMPLE_REVIEWS = [
	{ id: 1, name: 'Christiana Emeka', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80', rating: 4.0, time: '12:32pm', day: 'Tue', comment: 'The apartment was clean, cozy, and exactly as advertised. Perfect short stay would definitely book again!' },
	{ id: 2, name: 'Efe Oghene', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80', rating: 4.5, time: '10:15am', day: 'Mon', comment: 'Great property with excellent amenities. The landlord is very responsive and helpful.' },
	{ id: 3, name: 'John Doe', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80', rating: 5.0, time: '3:45pm', day: 'Wed', comment: 'Amazing property! Everything was perfect. Would definitely book again.' },
	{ id: 4, name: 'Ada Okafor', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80', rating: 3.5, time: '9:00am', day: 'Thu', comment: 'Good value for money. Location was convenient. Minor issues with hot water.' }
]

const LandlordDetailsWidget = ({
	landlord = {
		name: 'Osaite Emmanuel',
		email: 'emmanuelosaite@gmail.com',
		location: 'Lagos, Nigeria',
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
		rating: 4.6,
		verified: true,
		dateJoined: '24th March, 2025',
		propertyTypes: 'Apartments, Duplexes, Studios, Lodges, etc.',
		responseTime: 'Responds within 2 hours',
		paymentPolicies: 'Refundable',
		paymentOptions: 'Cash - Bank transfer',
		listingsCount: 32,
		listings: DEFAULT_LISTINGS
	},
	onContact,
	onSendMessage
}) => {
	const navigate = useNavigate()
	const [favorites, setFavorites] = useState(new Set())
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [isAllOpen, setIsAllOpen] = useState(false)
	const [isDateAndTimeOpen, setIsDateAndTimeOpen] = useState(false)
	const [selectedRatingFilter, setSelectedRatingFilter] = useState('excellent')
	const [selectedFilter, setSelectedFilter] = useState('none')
	const [fromDate, setFromDate] = useState(null)
	const [toDate, setToDate] = useState(null)
	const [searchQuery, setSearchQuery] = useState('')
	const propertiesRef = useRef(null)

	const overallRating = 4.3
	const totalReviews = 230
	const listings = (landlord.listings && landlord.listings.length > 0)
		? landlord.listings.map((p) => ({
			...p,
			image: p.images?.[0] ?? p.image,
			id: p.id
		  }))
		: DEFAULT_LISTINGS

	const renderStars = (rating) => {
		const fullStars = Math.floor(rating)
		const hasHalfStar = rating % 1 !== 0
		return (
			<div className='flex items-center gap-0.5'>
				{[...Array(5)].map((_, i) => (
					<Star
						key={i}
						className={`w-2.5 h-2.5 ${i < fullStars ? 'fill-primary text-primary' : i === fullStars && hasHalfStar ? 'fill-primary/50 text-primary' : 'text-gray-300'}`}
					/>
				))}
			</div>
		)
	}

	const scrollCarousel = (ref, direction) => {
		if (!ref?.current) return
		const amount = 296
		ref.current.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
	}

	const toggleFavorite = (id) => {
		setFavorites((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	return (
		<div className='space-y-10 mt-10'>
			{/* Top: Profile + Details */}
			<div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
				{/* Landlord profile & contact */}
				<div className='lg:col-span-1 bg-white rounded-2xl h-[400px] border border-gray-200 p-6'>
					<div className='flex flex-col items-center gap-4'>
						<img
							src={landlord.avatar}
							alt={landlord.name}
							className='w-12 h-12 rounded-full object-cover shrink-0'
						/>
						<div className='flex flex-col items-center'>
							<p className='text-[18px] font-bold text-gray-900'>{landlord.name}</p>
							<p className='text-[14px] text-gray-600'>{landlord.email}</p>
							<p className='text-[14px] text-gray-500 mt-1'>{landlord.location}</p>
							<div className='flex items-center gap-2 mt-2'>
								<span className='text-[14px] text-gray-700'>Excellent</span>
								{renderStars(landlord.rating ?? 4.6)} 4.6
							</div>
							{landlord.verified && (
								<div className='flex items-center bg-green-50 border border-green-200 
								   rounded-xl px-2 py-1 gap-1 mt-2 text-green-600'>
									<CheckCircle className='w-4 h-4' />
									<span className='text-[14px] font-medium'>Verified</span>
								</div>
							)}
						</div>
					</div>
					<div className='flex flex-col gap-3 mt-6'>
						<button
							type='button'
							onClick={onContact}
							className='flex-1 flex items-center justify-center gap-2 py-3 
							 rounded-full border-2 border-gray-300 text-g
							 ray-700 font-medium text-[14px] hover:bg-gray-50'
						>
							<Phone className='w-4 h-4' />
							Contact
						</button>
						<button
							type='button'
							onClick={onSendMessage}
							className='flex-1 flex items-center justify-center gap-2 py-3 
							rounded-full bg-primary text-white font-medium 
							text-[14px] hover:bg-primary/90'
						>
							<Mail className='w-4 h-4' />
							Send message
						</button>
					</div>
				</div>

				{/* Details & additional info */}
				<div className='lg:col-span-2 space-y-6'>
				   <h3 className='text-[18px] font-bold text-gray-900 mb-4'>Details</h3>
					<div className='bg-white rounded-2xl border border-gray-200 p-6'>
						<ul className='space-y-2 text-[14px] text-gray-700'>
							<li><span className='font-medium'>Date Joined:</span> {landlord.dateJoined}</li>
							<p className='text-[16px] text-gray-600 font-medium'>24th March, 2025</p>
							<Divider className='my-6'/>
							<li><span className='font-medium'>Property types:</span> {landlord.propertyTypes}</li>
							<p className='text-[16px] text-gray-600 font-medium'>Apartments, Duplexes, Studios, Lodges, etc.</p>
							<Divider className='my-6'/>
							<li><span className='font-medium'>Response time:</span> {landlord.responseTime}</li>
							<p className='text-[16px] text-gray-600 font-medium'>Responds within 2 hours</p>
						</ul>
					</div>
					<h3 className='text-[18px] font-bold text-gray-900 mb-4'>Additional information</h3>
					<div className='bg-white rounded-2xl border border-gray-200 p-6'>
						<ul className='space-y-2 text-[14px] text-gray-700'>
							<li><span className='font-medium'>Payment policies:</span> {landlord.paymentPolicies}</li>
							<p className='text-[16px] text-gray-600 font-medium'>Refundable</p>
							<Divider className='my-6'/>
							<li><span className='font-medium'>Payment options:</span> {landlord.paymentOptions}</li>
							<p className='text-[16px] text-gray-600 font-medium'>Cash - Bank transfer</p>
						</ul>
					</div>
				</div>
			</div>

			{/* Properties listed by this user */}
			<div>
				<div className='flex items-center justify-between mb-4'>
					<h2 className='text-[24px] font-semibold text-gray-900'>
						Properties listed by this user ({landlord.listingsCount ?? listings.length})
					</h2>
					<div className='flex gap-2'>
						<button
							type='button'
							onClick={() => scrollCarousel(propertiesRef, 'left')}
							className='w-10 h-10 rounded-full border border-gray-300 
							flex items-center justify-center hover:bg-gray-50'
						>
							<ChevronLeft className='w-5 h-5 text-gray-700' />
						</button>
						<button
							type='button'
							onClick={() => scrollCarousel(propertiesRef, 'right')}
							className='w-10 h-10 rounded-full border border-gray-300 
							flex items-center justify-center hover:bg-gray-50'
						>
							<ChevronRight className='w-5 h-5 text-gray-700' />
						</button>
					</div>
				</div>
				<div
					ref={propertiesRef}
					className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
				>
					{listings.map((property) => (
						<PropertyCardWidget
							key={property.id}
							property={property}
							isFavorite={favorites.has(property.id)}
							onFavoriteToggle={toggleFavorite}
							onViewDetails={() => navigate(`/property-details/${property.id}`)}
						/>
					))}
				</div>
			</div>

			{/* Reviews section - same pattern as reviews_view */}
			<div>
				<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Reviews</h2>
				<div className='flex items-baseline gap-2 mb-2'>
					<span className='text-[36px] font-bold text-gray-900'>{overallRating}</span>
					{renderStars(overallRating)}
				</div>
				<p className='text-[14px] text-gray-600 mb-12'>Based on reviews from verified users</p>

				{/* Control bar: Search, All, Filter (reviews_view pattern) */}
				<div className='flex flex-wrap md:w-[900px] max-md:flex-col items-center gap-3 mb-6 relative'>
				 <p className='text-[16px] font-medium text-gray-700'>Most recents review</p>
					<div className='flex-1 min-w-[200px] max-md:w-[300px] relative ml-10 max-md:ml-0'>
						<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
						<input
							type='text'
							placeholder='Search'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20'
						/>
					</div>
					<div className='max-md:flex flex gap-4'>
					<div className='relative'>
						<button
							type='button'
							onClick={() => { setIsAllOpen(!isAllOpen); setIsFilterOpen(false); setIsDateAndTimeOpen(false); }}
							className='flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-full bg-white text-[14px] font-medium text-gray-700 hover:bg-gray-50'
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
					<div className='relative'>
						<button
							type='button'
							onClick={() => { setIsFilterOpen(!isFilterOpen); setIsAllOpen(false); setIsDateAndTimeOpen(false); }}
							className='flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-full bg-white text-[14px] font-medium text-gray-700 hover:bg-gray-50'
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
				</div>

				{/* Review cards - two columns on md+ */}
				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					{SAMPLE_REVIEWS.map((review) => (
						<div key={review.id} className='flex gap-4 p-4 bg-white rounded-xl border border-gray-200'>
							<img src={review.avatar} alt={review.name} className='w-12 h-12 rounded-full object-cover shrink-0' />
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
						className='flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full bg-white text-[16px] font-medium text-gray-700 hover:bg-gray-50'
					>
						Load more
						<ChevronDown className='w-5 h-5' />
					</button>
				</div>
			</div>
		</div>
	)
}

export default LandlordDetailsWidget
