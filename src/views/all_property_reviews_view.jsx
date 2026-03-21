import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Star, Home } from 'lucide-react'

/**
 * Format review time (e.g. "12:32pm")
 */
function formatReviewTime(dateStr) {
	if (!dateStr || typeof dateStr !== 'string') return ''
	const dt = new Date(dateStr)
	if (Number.isNaN(dt.getTime())) return dateStr
	const hour = dt.getHours()
	const h = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
	const amPm = hour >= 12 ? 'pm' : 'am'
	const min = String(dt.getMinutes()).padStart(2, '0')
	return `${h}:${min}${amPm}`
}

/**
 * Avatar placeholder using initials or a default
 */
function AvatarPlaceholder({ review }) {
	const user = review?.user
	const fullname = user?.fullname ?? 'Anonymous'
	const avatar = user?.avatar
	const seed = user?.id ?? fullname

	if (avatar) {
		return (
			<img
				src={avatar}
				alt={fullname}
				className="w-10 h-10 rounded-full object-cover shrink-0"
			/>
		)
	}
	// DiceBear-style placeholder: use a deterministic color from seed
	const hue = (seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 360)
	const bg = `hsl(${hue}, 60%, 45%)`
	const initials = fullname.split(/\s+/).map((s) => s[0]).join('').slice(0, 2).toUpperCase() || '?'

	return (
		<div
			className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white text-sm font-semibold"
			style={{ backgroundColor: bg }}
		>
			{initials}
		</div>
	)
}

const AllPropertyReviewsView = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const { reviews = [], propertyTitle } = location.state ?? {}

	const averageRating =
		reviews.length === 0
			? 0
			: reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length

	return (
		<div className="pt-30 pb-10 px-6 md:px-16 lg:px-20">
			<button
				type="button"
				onClick={() => navigate(-1)}
				className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors py-1 hover:bg-gray-50"
			>
				<ChevronLeft className="w-4 h-4 shrink-0" />
				Back
			</button>

			<h1 className="text-[24px] font-semibold text-gray-900 mb-6">
				{propertyTitle ? `Reviews - ${propertyTitle}` : 'All Reviews'}
			</h1>

			{reviews.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-gray-600">
					<Home className="w-12 h-12 text-gray-300 mb-4" />
					<p className="text-[14px] font-medium">No reviews yet for this property.</p>
				</div>
			) : (
				<>
					{/* Summary header */}
					<div className="flex flex-col items-center mb-8 p-6 bg-white rounded-2xl border border-gray-200">
						<span className="text-[28px] font-bold text-gray-900">
							{averageRating.toFixed(1)}
						</span>
						<div className="flex items-center gap-1 mt-2">
							{[1, 2, 3, 4, 5].map((i) => (
								<Star
									key={i}
									className={`w-4 h-4 ${
										i <= Math.floor(averageRating)
											? 'fill-yellow-400 text-yellow-400'
											: i - 0.5 <= averageRating
											? 'fill-yellow-400/50 text-yellow-400'
											: 'text-gray-300'
									}`}
								/>
							))}
						</div>
						<p className="text-[14px] text-gray-600 mt-2">
							{reviews.length} review{reviews.length === 1 ? '' : 's'}
						</p>
					</div>

					{/* Review list */}
					<div className="space-y-6">
						{reviews.map((review) => (
							<div
								key={review.id ?? review.created_at ?? Math.random()}
								className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200"
							>
								<AvatarPlaceholder review={review} />
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-4">
										<p className="text-[16px] font-semibold text-gray-900">
											{review?.user?.fullname ?? 'Anonymous user'}
										</p>
										<span className="text-[13px] text-gray-500 shrink-0">
											{formatReviewTime(review?.created_at ?? review?.createdAt)}
										</span>
									</div>
									<div className="flex items-center gap-2 mt-1">
										<span className="text-[16px] font-semibold text-gray-900">
											{(review.rating ?? 0).toFixed(1)}
										</span>
										<div className="flex items-center gap-0.5">
											{[1, 2, 3, 4, 5].map((i) => (
												<Star
													key={i}
													className={`w-3 h-3 ${
														i <= (review.rating ?? 0)
															? 'fill-yellow-400 text-yellow-400'
															: 'text-gray-300'
													}`}
												/>
											))}
										</div>
									</div>
									<p className="text-[16px] font-semibold text-gray-900 mt-2">
										{review.comment?.trim() || 'No comment'}
									</p>
									{review.tags && review.tags.length > 0 && (
										<p className="text-[14px] text-gray-600 mt-2">
											{Array.isArray(review.tags) ? review.tags.join(', ') : review.tags}
										</p>
									)}
								</div>
							</div>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default AllPropertyReviewsView
