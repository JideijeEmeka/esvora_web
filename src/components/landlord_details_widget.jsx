import React, { useState, useRef } from 'react'
import { Star, Phone, Mail, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import PropertyCardWidget from './property_card_widget'
import Divider from './divider'

const DEFAULT_LISTINGS = [
	{ id: 1, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400', price: '₦120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 2, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', price: '₦95,000', description: '3 bedroom luxury apartment', location: 'Victoria Island, Lagos, Nigeria', available: true },
	{ id: 3, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400', price: '₦150,000', description: '5 bedroom detached house', location: 'Lekki, Lagos, Nigeria', available: true },
	{ id: 4, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', price: '₦80,000', description: '2 bedroom cozy apartment', location: 'Surulere, Lagos, Nigeria', available: true }
]

const DICEBEAR_ADVENTURER = 'https://api.dicebear.com/9.x/adventurer/svg'

function getReviewAvatarSrc(avatar, fallbackSeed = '') {
	const seed = (fallbackSeed ?? '').trim() || `review-${Math.random().toString(36).slice(2)}`
	if (avatar && typeof avatar === 'string' && avatar.trim()) {
		if (avatar.startsWith('data:') || avatar.startsWith('http')) return avatar
		return `${DICEBEAR_ADVENTURER}?seed=${encodeURIComponent(avatar)}`
	}
	return `${DICEBEAR_ADVENTURER}?seed=${encodeURIComponent(seed)}`
}

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
		paymentOptions: 'Cash - Bank transfer - Card',
		listingsCount: 32,
		listings: DEFAULT_LISTINGS
	},
	propertiesWithReviews = [],
	onContact,
	onSendMessage
}) => {
	const navigate = useNavigate()
	const [favorites, setFavorites] = useState(new Set())
	const propertiesRef = useRef(null)
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
							<p className='text-[16px] text-gray-600 font-medium'>{landlord.paymentOptions || 'Cash - Bank transfer - Card'}</p>
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

			{/* Reviews section - properties with reviews */}
			<div>
				<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Reviews</h2>
				{propertiesWithReviews.length > 0 ? (
					<div className='space-y-10'>
						{propertiesWithReviews.map((prop) => {
							const reviews = Array.isArray(prop.reviews) ? prop.reviews : []
							const totalReviewsForProp = prop.reviewCount ?? reviews.length
							const avgRating = reviews.length > 0
								? reviews.reduce((s, r) => s + (Number(r?.rating) || 0), 0) / reviews.length
								: 0
							return (
								<div key={prop.id} className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
									<button
										type='button'
										onClick={() => navigate(`/property-details/${prop.id}`)}
										className='w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left'
									>
										{prop.image ? (
											<img src={prop.image} alt={prop.title} className='w-20 h-20 rounded-xl object-cover shrink-0' />
										) : (
											<div className='w-20 h-20 rounded-xl bg-gray-200 shrink-0 flex items-center justify-center'>
												<span className='text-gray-400 text-sm'>No image</span>
											</div>
										)}
										<div className='min-w-0 flex-1'>
											<p className='text-[16px] font-semibold text-gray-900 truncate'>{prop.title ?? 'Property'}</p>
											{prop.location && <p className='text-[14px] text-gray-500 truncate'>{prop.location}</p>}
											<div className='flex items-center gap-2 mt-1'>
												{renderStars(avgRating)}
												<span className='text-[14px] text-gray-600'>{totalReviewsForProp} {totalReviewsForProp === 1 ? 'review' : 'reviews'}</span>
											</div>
										</div>
									</button>
									<div className='border-t border-gray-100 px-4 py-4 space-y-4'>
										{reviews.slice(0, 3).map((review, idx) => {
											const userName = review?.user?.fullname ?? review?.user?.full_name ?? 'Anonymous'
											const userAvatar = review?.user?.avatar ?? review?.user?.profile_image
											const avatarSrc = getReviewAvatarSrc(userAvatar, userName)
											const rating = Number(review?.rating) || 0
											const comment = review?.comment?.trim() || 'No comment'
											const createdAt = review?.created_at ?? review?.createdAt ?? ''
											const timeStr = createdAt ? new Date(createdAt).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : ''
											const dayStr = createdAt ? new Date(createdAt).toLocaleDateString('en-US', { weekday: 'short' }) : ''
											return (
												<div key={review?.id ?? idx} className='flex gap-4 p-4 bg-gray-50 rounded-xl'>
													<img src={avatarSrc} alt={userName} className='w-10 h-10 rounded-full object-cover shrink-0' />
													<div className='min-w-0 flex-1'>
														<p className='text-[14px] font-semibold text-gray-900'>{userName}</p>
														<div className='flex items-center gap-2 mt-1 text-[13px] text-gray-500'>
															<span>{rating.toFixed(1)}</span>
															{renderStars(rating)}
															{timeStr && <span>{timeStr}</span>}
															{dayStr && <span>{dayStr}</span>}
														</div>
														<p className='text-[14px] text-gray-700 mt-2 leading-relaxed'>{comment}</p>
													</div>
												</div>
											)
										})}
										{reviews.length > 3 && (
											<p className='text-[14px] text-gray-500 text-center'>+ {reviews.length - 3} more reviews</p>
										)}
									</div>
								</div>
							)
						})}
					</div>
				) : (
					<div className='bg-white rounded-2xl border border-gray-200 p-8 text-center'>
						<p className='text-[16px] text-gray-600'>No reviews yet for this landlord&apos;s properties.</p>
					</div>
				)}
			</div>
		</div>
	)
}

export default LandlordDetailsWidget
