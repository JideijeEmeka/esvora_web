import React, { useState, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '../components/footer'
import ReviewSubmittedWidget from '../components/review_submitted_widget'

const CATEGORIES = [
	'Popular apartments',
	'Shop',
	'Shortlet',
	'Duplex',
	'Bungalow',
	'Flats',
	'Room & Parlor',
	'Event hall',
	'Shopping hall',
	'Selfcon',
	'Store'
]

const POPULAR_LOCATIONS = [
	'Lagos', 'Benin', 'Kano', 'Abeokuta', 'Akure', 'Calabar',
	'Abuja', 'Enugu', 'Maiduguri', 'Asaba', 'Ilorin',
	'Portharcout', 'Ibadan', 'Jos', 'Onitsha', 'Warri', 'Uyo'
]

const SENTIMENT_OPTIONS = [
	{ key: 'poor', label: 'Poor', emoji: '😠' },
	{ key: 'fair', label: 'Fair', emoji: '😐' },
	{ key: 'good', label: 'Good', emoji: '🙂' },
	{ key: 'excellent', label: 'Excellent', emoji: '😍' },
	{ key: 'dope', label: 'Dope', emoji: '😎' }
]

const QUICK_TAGS = ['It is amazing', 'I love it', 'Looks super great', 'Greate agent']

const DEFAULT_PROPERTY = {
	id: 1,
	image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
	price: '€120,500',
	description: '4 bedroom modern bungalow apartment',
	location: 'Ikoyi, Lagos, Nigeria'
}

const MAX_COMMENT_LENGTH = 200

const RatePropertyView = () => {
	const { id } = useParams()
	const [starRating, setStarRating] = useState(0)
	const [hoverStar, setHoverStar] = useState(0)
	const [selectedSentiment, setSelectedSentiment] = useState('poor')
	const [comment, setComment] = useState('')
	const [selectedTags, setSelectedTags] = useState([])
	const [selectedCategory, setSelectedCategory] = useState('Popular apartments')
	const [isReviewSubmittedOpen, setIsReviewSubmittedOpen] = useState(false)
	const categoryRef = useRef(null)

	const property = { ...DEFAULT_PROPERTY, id: id || DEFAULT_PROPERTY.id }

	const toggleTag = (tag) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		)
	}

	const scrollCategories = (direction) => {
		if (!categoryRef?.current) return
		const amount = 200
		categoryRef.current.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		})
	}

	const displayStars = hoverStar || starRating
	const commentCount = comment.length

	return (
		<>
			<ReviewSubmittedWidget
				isOpen={isReviewSubmittedOpen}
				onClose={() => setIsReviewSubmittedOpen(false)}
			/>
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20'>

				{/* Two-column: Property card + Rating form */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16'>
					{/* Left: Property details card */}
					<div className='bg-white rounded-2xl h-[400px] border border-gray-200 overflow-hidden'>
						<img
							src={property.image}
							alt={property.description}
							className='w-full h-[240px] object-cover'
						/>
						<div className='p-6'>
							<p className='text-[24px] font-semibold text-gray-900 mb-2'>
								{property.price}
							</p>
							<p className='text-[16px] font-medium text-gray-700 mb-2'>
								{property.description}
							</p>
							<p className='text-[14px] text-gray-500'>{property.location}</p>
						</div>
					</div>

					{/* Right: Rating interface */}
					<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
						<h2 className='text-[22px] font-semibold text-gray-900 mb-6'>
							Tell us what you think about this property
						</h2>

						{/* Star rating */}
						<div className='flex items-center gap-1 mb-6'>
							{[1, 2, 3, 4, 5].map((value) => (
								<button
									key={value}
									type='button'
									onClick={() => setStarRating(value)}
									onMouseEnter={() => setHoverStar(value)}
									onMouseLeave={() => setHoverStar(0)}
									className='p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary/30'
								>
									<Star
										className={`w-8 h-8 transition-colors ${
											value <= displayStars
												? 'fill-primary text-primary'
												: 'text-gray-300'
										}`}
									/>
								</button>
							))}
						</div>

						{/* Sentiment emojis */}
						<div className='flex flex-wrap gap-4 mb-6'>
							{SENTIMENT_OPTIONS.map(({ key, label, emoji }) => (
								<button
									key={key}
									type='button'
									onClick={() => setSelectedSentiment(key)}
									className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors ${
										selectedSentiment === key
											? 'border-primary bg-primary/5'
											: 'border-gray-200 hover:border-gray-300'
									}`}
								>
									<span className='text-[28px]'>{emoji}</span>
									<span className='text-[12px] font-medium text-gray-700'>
										{label}
									</span>
								</button>
							))}
						</div>

						{/* Quick tags */}
						<div className='flex flex-wrap gap-2 mb-6'>
							{QUICK_TAGS.map((tag) => (
								<button
									key={tag}
									type='button'
									onClick={() => toggleTag(tag)}
									className={`px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
										selectedTags.includes(tag)
											? 'bg-primary text-white'
											: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
									}`}
								>
									{tag}
								</button>
							))}
						</div>

						{/* Comment textarea */}
						<div>
							<label htmlFor='rate-comment' className='sr-only'>
								Add comment
							</label>
							<textarea
								id='rate-comment'
								value={comment}
								onChange={(e) =>
									setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))
								}
								placeholder='Add comment'
								rows={5}
								className='w-full px-4 py-3 border border-gray-200 rounded-xl text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none'
							/>
							<div className='flex justify-end mt-1'>
								<span
									className={`text-[12px] ${
										commentCount >= MAX_COMMENT_LENGTH
											? 'text-red-500'
											: 'text-gray-500'
									}`}
								>
									{commentCount}/{MAX_COMMENT_LENGTH}
								</span>
							</div>
						</div>

						<button
							type='button'
							onClick={() => setIsReviewSubmittedOpen(true)}
							className='mt-6 w-full py-3 rounded-full bg-primary 
							    text-white font-semibold text-[16px] hover:bg-primary/90 transition-colors'
						>
							Submit rating
						</button>
					</div>
				</div>

				{/* Find affordable properties */}
				<div className='mb-12 mt-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							Find affordable properties near you!
						</h2>
						<div className='flex items-center gap-2 max-md:hidden'>
							<button
								type='button'
								onClick={() => scrollCategories('left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								type='button'
								onClick={() => scrollCategories('right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={categoryRef}
						className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide'
					>
						{CATEGORIES.map((category) => (
							<button
								key={category}
								type='button'
								onClick={() => setSelectedCategory(category)}
								className={`shrink-0 px-6 py-3 rounded-full font-medium text-[16px] transition-colors ${
									selectedCategory === category
										? 'bg-gray-800 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				{/* Popular locations */}
				<div className='mb-1'>
					<h2 className='text-[24px] font-semibold text-gray-900 mb-6'>
						Popular locations
					</h2>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{POPULAR_LOCATIONS.map((location, index) => (
							<button
								key={index}
								type='button'
								className='text-left px-4 py-3 hover:bg-gray-100 rounded-lg text-[16px] font-medium text-gray-700 transition-colors'
							>
								{location}
							</button>
						))}
					</div>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default RatePropertyView
