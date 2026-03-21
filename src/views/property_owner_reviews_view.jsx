import React from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewsView from './reviews_view'

const PropertyOwnerReviewsView = () => {
	const navigate = useNavigate()

	return (
		<div className="pt-24 pb-10 px-6 md:px-16 lg:px-20 min-h-screen">
			<ReviewsView onBack={() => navigate('/property-owner')} />
		</div>
	)
}

export default PropertyOwnerReviewsView
