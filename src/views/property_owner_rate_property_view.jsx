import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronLeft, Star } from 'lucide-react'
import toast from 'react-hot-toast'
import Footer from '../components/footer'
import ReviewSubmittedWidget from '../components/review_submitted_widget'
import propertyController from '../controllers/property_controller'
import Loader from '../components/loader'
import { selectPropertyDetails } from '../redux/slices/propertySlice'
import { normalizePropertyDetails } from '../lib/propertyUtils'

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
	price: '₦120,500',
	description: '4 bedroom modern bungalow apartment',
	location: 'Ikoyi, Lagos, Nigeria'
}

const MAX_COMMENT_LENGTH = 200

const PropertyOwnerRatePropertyView = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const apiDetails = useSelector(selectPropertyDetails)
	const [starRating, setStarRating] = useState(0)
	const [hoverStar, setHoverStar] = useState(0)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [selectedSentiment, setSelectedSentiment] = useState('poor')
	const [comment, setComment] = useState('')
	const [selectedTags, setSelectedTags] = useState([])
	const [isReviewSubmittedOpen, setIsReviewSubmittedOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(null)

	useEffect(() => {
		if (!id) {
			setIsLoading(false)
			setLoadError('Property not found')
			return
		}
		setIsLoading(true)
		setLoadError(null)
		propertyController.getPropertyDetails(id, {
			onSuccess: () => setIsLoading(false),
			onError: (msg) => {
				setLoadError(msg ?? 'Failed to load property')
				setIsLoading(false)
			}
		})
	}, [id])

	const rawProperty = apiDetails && String(apiDetails?.id ?? apiDetails?.uuid) === String(id) ? apiDetails : null
	const normalized = normalizePropertyDetails(rawProperty)
	const property = normalized
		? {
				id: normalized.id,
				image: normalized.image || DEFAULT_PROPERTY.image,
				price: normalized.price || DEFAULT_PROPERTY.price,
				description: normalized.description || DEFAULT_PROPERTY.description,
				location: normalized.location || DEFAULT_PROPERTY.location
			}
		: { ...DEFAULT_PROPERTY, id: id || DEFAULT_PROPERTY.id }

	const toggleTag = (tag) => {
		setSelectedTags((prev) =>
			prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
		)
	}

	const displayStars = hoverStar || starRating
	const commentCount = comment.length
	const propertyId = id || property.id

	if (isLoading) {
		return (
			<>
				<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-[50vh] flex items-center justify-center'>
					<Loader />
				</div>
				<Footer />
			</>
		)
	}

	if (loadError || !id) {
		return (
			<>
				<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-[50vh] flex items-center justify-center'>
					<p className='text-gray-600'>{loadError ?? 'Property not found'}</p>
				</div>
				<Footer />
			</>
		)
	}

	const handleSubmitRating = () => {
		if (!propertyId) {
			toast.error('Property is required to submit review')
			return
		}
		const rating = starRating || 0
		if (rating < 1) {
			toast.error('Please select a rating')
			return
		}
		propertyController.addReview(
			{
				propertyId,
				rating,
				sentiment: selectedSentiment,
				tags: selectedTags,
				comment: comment.trim() || 'No comment'
			},
			{
				setLoading: setIsSubmitting,
				onSuccess: () => setIsReviewSubmittedOpen(true),
				onError: (msg) => toast.error(msg ?? 'Failed to submit review')
			}
		)
	}

	return (
		<>
			<ReviewSubmittedWidget
				isOpen={isReviewSubmittedOpen}
				onClose={() => setIsReviewSubmittedOpen(false)}
			/>
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20'>
				<button
					type='button'
					onClick={() => navigate(-1)}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors'
				>
					<ChevronLeft className='w-5 h-5' />
					Back
				</button>

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

						{/* Star rating - full stars only */}
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
							onClick={handleSubmitRating}
							disabled={isSubmitting || starRating < 1}
							className='mt-6 w-full py-3 rounded-full bg-primary 
							    text-white font-semibold text-[16px] hover:bg-primary/90 disabled:opacity-50 transition-colors'
						>
							{isSubmitting ? 'Submitting...' : 'Submit rating'}
						</button>
					</div>
				</div>

				{/* Popular locations */}
				<div className='mb-1 mt-30'>
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

export default PropertyOwnerRatePropertyView
