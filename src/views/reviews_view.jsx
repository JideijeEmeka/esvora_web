import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronLeft, ChevronRight, Star, Home } from 'lucide-react'
import propertyController from '../controllers/property_controller'
import {
	selectProperties,
	selectLandlordProperties
} from '../redux/slices/propertySlice'
import { selectCurrentAccount } from '../redux/slices/accountSlice'
import { normalizeProperty } from '../lib/propertyUtils'

/**
 * Get display title for a property
 */
function getPropertyTitle(p) {
	if (!p) return 'Property'
	if (p.title) return p.title
	const pt = p.property_type ?? p.propertyType
	if (typeof pt === 'object' && pt?.name) return pt.name
	if (typeof pt === 'string') return pt
	return 'Property'
}

const ReviewsView = ({ onBack }) => {
	const navigate = useNavigate()
	const account = useSelector(selectCurrentAccount)
	const apiProperties = useSelector(selectProperties)
	const landlordPropertiesRaw = useSelector(selectLandlordProperties)

	const isPropertyOwner = account?.landlord_dashboard === true

	// Dedupe by id, filter those with reviews. Property owner: landlord listings only. Renter: properties + landlord
	const propertiesWithReviews = useMemo(() => {
		const seen = new Set()
		const list = []

		const fromProps = Array.isArray(apiProperties) ? apiProperties : []
		const fromLandlord = Array.isArray(landlordPropertiesRaw) ? landlordPropertiesRaw : []
		const sourceList = isPropertyOwner ? fromLandlord : [...fromProps, ...fromLandlord]

		for (const p of sourceList) {
			const id = p?.id ?? p?.uuid ?? p?.property_id
			if (!id || seen.has(String(id))) continue

			const normalized = normalizeProperty(p)
			const reviews = normalized?.reviews ?? p?.reviews ?? []
			if (!Array.isArray(reviews) || reviews.length === 0) continue

			seen.add(String(id))
			list.push({
				...normalized,
				reviews: reviews
			})
		}
		return list
	}, [apiProperties, landlordPropertiesRaw, isPropertyOwner])

	useEffect(() => {
		propertyController.listLandlordProperties({ onError: () => {} })
		if (!isPropertyOwner) {
			propertyController.getAllProperties({ onError: () => {} })
		}
	}, [isPropertyOwner])

	const handlePropertyClick = (property) => {
		navigate('/all-reviews', {
			state: {
				reviews: property.reviews ?? [],
				propertyTitle: getPropertyTitle(property)
			}
		})
	}

	const renderStars = (rating) => {
		const r = Number(rating) || 0
		const full = Math.floor(r)
		return (
			<div className="flex items-center gap-0.5">
				{[1, 2, 3, 4, 5].map((i) => (
					<Star
						key={i}
						className={`w-3.5 h-3.5 ${
							i <= full ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
						}`}
					/>
				))}
			</div>
		)
	}

	return (
		<div className="pt-10">
			{onBack && (
				<button
					type="button"
					onClick={onBack}
					className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
				>
					<ChevronLeft className="w-4 h-4" />
					Back
				</button>
			)}

			<h2 className="text-[24px] font-semibold text-gray-900 mb-6">Reviews & Ratings</h2>

			{propertiesWithReviews.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white rounded-2xl border border-gray-200">
					<Home className="w-12 h-12 text-gray-300 mb-4" />
					<p className="text-[14px] font-medium">
						{isPropertyOwner ? 'No reviews on your listings yet.' : 'No properties with reviews yet.'}
					</p>
				</div>
			) : (
				<div className="space-y-3">
					{propertiesWithReviews.map((p) => {
						const reviews = p.reviews ?? []
						const avgRating =
							reviews.length === 0
								? 0
								: reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0) / reviews.length
						const image =
							p.image ?? p.images?.[0] ?? (Array.isArray(p.images) ? p.images[0] : null)

						return (
							<button
								key={p.id ?? p.uuid}
								type="button"
								onClick={() => handlePropertyClick(p)}
								className="w-full flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-left"
							>
								<div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
									{image ? (
										<img
											src={image}
											alt=""
											className="w-full h-full object-cover"
											onError={(e) => {
												e.target.style.display = 'none'
												e.target.nextElementSibling?.classList.remove('hidden')
											}}
										/>
									) : null}
									<Home
										className={`w-7 h-7 text-gray-400 ${image ? 'hidden' : ''}`}
									/>
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-[16px] font-semibold text-gray-900 truncate">
										{getPropertyTitle(p)}
									</p>
									<div className="flex items-center gap-2 mt-1">
										<span className="text-[14px] font-semibold text-gray-900">
											{avgRating.toFixed(1)}
										</span>
										{renderStars(avgRating)}
										<span className="text-[13px] text-gray-500">
											{reviews.length} review{reviews.length === 1 ? '' : 's'}
										</span>
									</div>
								</div>
								<ChevronRight className="w-5 h-5 text-gray-400 shrink-0" />
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default ReviewsView
