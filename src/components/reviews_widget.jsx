import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'

/**
 * Format review time (e.g. "12:32pm")
 */
function formatReviewTime(dateStr) {
	if (!dateStr) return ''
	const dt = new Date(typeof dateStr === 'string' ? dateStr : dateStr)
	if (Number.isNaN(dt.getTime())) return ''
	const hour = dt.getHours()
	const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
	const amPm = hour >= 12 ? 'pm' : 'am'
	const min = String(dt.getMinutes()).padStart(2, '0')
	return `${h}:${min}${amPm}`
}

/**
 * Avatar for review - uses user.avatar or placeholder with initials
 */
function ReviewAvatar({ review }) {
	const user = review?.user
	const fullname = user?.fullname ?? 'Anonymous'
	const avatar = user?.avatar

	if (avatar) {
		return (
			<img
				src={avatar}
				alt={fullname}
				className="w-10 h-10 rounded-full object-cover shrink-0"
			/>
		)
	}
	const seed = user?.id ?? fullname
	const hue = (String(seed).split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360)
	const initials = fullname.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '?'

	return (
		<div
			className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-semibold"
			style={{ backgroundColor: `hsl(${hue}, 60%, 45%)` }}
		>
			{initials}
		</div>
	)
}

const ReviewsWidget = ({ rating, reviewCount, reviews, propertyTitle }) => {
	const navigate = useNavigate()
	const reviewsList = Array.isArray(reviews) ? reviews : []
	const displayReviews = reviewsList.slice(0, 2)

	const renderStars = (r) => {
		const val = Number(r) || 0
		const full = Math.floor(val)
		const half = val % 1 !== 0
		return (
			<div className="flex items-center gap-1">
				{[1, 2, 3, 4, 5].map((i) => (
					<Star
						key={i}
						className={`w-4 h-4 ${
							i < full
								? 'fill-yellow-400 text-yellow-400'
								: i === full && half
								? 'fill-yellow-400/50 text-yellow-400'
								: 'text-gray-300'
						}`}
					/>
				))}
			</div>
		)
	}

	const handleSeeAll = () => {
		navigate('/all-reviews', {
			state: { reviews: reviewsList, propertyTitle }
		})
	}

	if (reviewsList.length === 0) {
		return (
			<div className="mb-8">
				<h3 className="text-[16px] font-semibold text-gray-900 mb-2">Reviews</h3>
				<p className="text-[14px] text-gray-600">No reviews yet for this property.</p>
			</div>
		)
	}

	return (
		<div className="mb-8">
			<div className="flex items-center justify-between gap-2 py-2 mb-4">
				<p className="text-[16px] font-semibold text-gray-900">Reviews</p>
				<div className="flex items-center gap-2">
					<span className="text-[20px] font-bold text-gray-900">{Number(rating || 0).toFixed(1)}</span>
					{renderStars(rating)}
					<span className="text-[14px] text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
						Based on reviews from verified users
					</span>
				</div>
			</div>

			<div className="space-y-4">
				{displayReviews.map((review) => (
					<div
						key={review.id ?? review.created_at ?? Math.random()}
						className="flex gap-4 p-4 bg-white border border-gray-200 rounded-xl"
					>
						<ReviewAvatar review={review} />
						<div className="min-w-0 flex-1">
							<div className="flex items-start justify-between gap-2">
								<p className="text-[16px] font-semibold text-gray-900">
									{review?.user?.fullname ?? 'Anonymous user'}
								</p>
								<span className="text-[13px] text-gray-500 shrink-0">
									{formatReviewTime(review?.created_at ?? review?.createdAt)}
								</span>
							</div>
							<div className="flex items-center gap-2 mt-1">
								<span className="text-[14px] font-semibold text-gray-900">
									{(review.rating ?? 0).toFixed(1)}
								</span>
								{renderStars(review.rating)}
							</div>
							<p className="text-[14px] text-gray-700 mt-2 leading-relaxed">
								{review.comment?.trim() || 'No comment'}
							</p>
							{review.tags && review.tags.length > 0 && (
								<p className="text-[14px] text-gray-600 mt-1">
									{Array.isArray(review.tags) ? review.tags.join(', ') : review.tags}
								</p>
							)}
						</div>
					</div>
				))}
			</div>

			{reviewsList.length > 0 && (
				<div className="flex justify-center mt-4">
					<button
						type="button"
						onClick={handleSeeAll}
						className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full
							text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
					>
						See all {reviewsList.length} reviews
						<ArrowRight className="w-4 h-4" />
					</button>
				</div>
			)}
		</div>
	)
}

export default ReviewsWidget
