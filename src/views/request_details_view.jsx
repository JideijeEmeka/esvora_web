import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'

const REQUEST_DETAILS_BY_ID = {
	1: {
		property: {
			image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
			price: '€120,500',
			description: '4 bedroom modern bungalow apartment',
			location: 'Ikoyi, Lagos, Nigeria'
		},
		from: 'Osaite Emmanuel',
		userInfo: {
			fullName: 'Osaite Emmanuel',
			email: 'emmanuelosaite@gmail.com',
			phoneNumber: '090 5247 1033',
			urgency: 'Urgent'
		},
		message:
			'This is a test sample message from Nathan James. kindly proceed to do the needful a',
		scheduleDate: 'Tuesday 24 Dec, 2025'
	},
	2: {
		property: {
			image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
			price: '€150,000',
			description: '5 bedroom detached house',
			location: 'Lekki, Lagos, Nigeria'
		},
		from: 'John Nathan',
		userInfo: {
			fullName: 'John Nathan',
			email: 'johnnathan@example.com',
			phoneNumber: '080 1234 5678',
			urgency: 'Normal'
		},
		message: 'I am interested in scheduling a visit for this property. Please confirm availability.',
		scheduleDate: 'Thursday 26 Dec, 2025'
	},
	3: {
		property: {
			image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
			price: '€95,000',
			description: '3 bedroom luxury apartment',
			location: 'Victoria Island, Lagos, Nigeria'
		},
		from: 'Osaite Emmanuel',
		userInfo: {
			fullName: 'Osaite Emmanuel',
			email: 'emmanuelosaite@gmail.com',
			phoneNumber: '090 5247 1033',
			urgency: 'Urgent'
		},
		message: 'Reservation request for the dates indicated. Kindly confirm.',
		scheduleDate: 'Jan 25 - 28 2025'
	}
}

const RequestDetailsView = () => {
	const navigate = useNavigate()
	const { id } = useParams()
	const request = id ? REQUEST_DETAILS_BY_ID[Number(id)] : null

	useEffect(() => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'requests')
	}, [])

	const handleBack = () => {
		navigate('/property-owner/requests')
	}

	const handleDecline = () => {
		console.log('Decline request', id)
		navigate('/property-owner/requests')
	}

	const handleAccept = () => {
		console.log('Accept request', id)
		navigate('/property-owner/requests')
	}

	if (!request) {
		return (
			<>
				<PropertyOwnerNavbar />
				<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col items-center justify-center bg-white'>
					<p className='text-gray-600 mb-4'>Request not found.</p>
					<button
						type='button'
						onClick={handleBack}
						className='text-primary font-medium hover:underline'
					>
						Back to Requests
					</button>
				</div>
			</>
		)
	}

	const { property, from, userInfo, message, scheduleDate } = request
	const isUrgent = userInfo.urgency === 'Urgent'

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				<div className='max-w-5xl mx-auto w-full'>
					{/* Action buttons - top right */}
					<div className='flex flex-wrap items-center justify-end gap-2 mb-8'>
						<button
							type='button'
							onClick={handleDecline}
							className='px-5 py-2.5 rounded-full text-[14px] font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors'
						>
							Decline
						</button>
						<button
							type='button'
							onClick={handleAccept}
							className='px-5 py-2.5 rounded-full text-[14px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors'
						>
							Accept
						</button>
					</div>

					{/* Two columns */}
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'>
						{/* Left: Property */}
						<div>
							<div className='rounded-xl overflow-hidden mb-4'>
								<img
									src={property.image}
									alt={property.description}
									className='w-full aspect-4/3 object-cover'
								/>
							</div>
							<p className='text-[24px] font-bold text-gray-900 mb-2'>
								{property.price}
							</p>
							<p className='text-[16px] font-medium text-gray-800 mb-2'>
								{property.description}
							</p>
							<p className='text-[14px] text-gray-600'>
								{property.location}
							</p>
						</div>

						{/* Right: Request details */}
						<div className='space-y-6'>
							<div>
								<p className='text-[14px] font-semibold text-gray-500 uppercase tracking-wide mb-1'>
									From
								</p>
								<p className='text-[18px] font-semibold text-gray-900'>
									{from}
								</p>
							</div>

							<div>
								<h2 className='text-[18px] font-semibold text-gray-900 mb-3'>
									User information
								</h2>
								<div className='bg-white border border-gray-200 rounded-xl p-5 space-y-4'>
									<div>
										<label className='block text-[12px] font-medium text-gray-500 mb-1'>
											Full name
										</label>
										<div className='px-4 py-3 border border-gray-200 rounded-lg text-[15px] text-gray-900 bg-gray-50/50'>
											{userInfo.fullName}
										</div>
									</div>
									<div>
										<label className='block text-[12px] font-medium text-gray-500 mb-1'>
											Email
										</label>
										<div className='px-4 py-3 border border-gray-200 rounded-lg text-[15px] text-gray-900 bg-gray-50/50'>
											{userInfo.email}
										</div>
									</div>
									<div>
										<label className='block text-[12px] font-medium text-gray-500 mb-1'>
											Phone number
										</label>
										<div className='px-4 py-3 border border-gray-200 rounded-lg text-[15px] text-gray-900 bg-gray-50/50'>
											{userInfo.phoneNumber}
										</div>
									</div>
									<div>
										<label className='block text-[12px] font-medium text-gray-500 mb-1'>
											Urgency
										</label>
										<span
											className={`inline-block px-3 py-1.5 rounded-full text-[13px] font-medium ${
												isUrgent
													? 'bg-red-500 text-white'
													: 'bg-gray-100 text-gray-700'
											}`}
										>
											{userInfo.urgency}
										</span>
									</div>
								</div>
							</div>

							<div>
								<h2 className='text-[18px] font-semibold text-gray-900 mb-2'>
									Message
								</h2>
								<p className='text-[15px] text-gray-700 leading-relaxed'>
									{message}
								</p>
							</div>

							<div>
								<h2 className='text-[18px] font-semibold text-gray-900 mb-2'>
									Schedule date
								</h2>
								<p className='text-[15px] text-gray-800'>
									{scheduleDate}
								</p>
							</div>
						</div>
					</div>

					{/* Back link */}
					<div className='mt-10'>
						<button
							type='button'
							onClick={handleBack}
							className='text-primary font-medium hover:underline'
						>
							← Back to Requests
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default RequestDetailsView
