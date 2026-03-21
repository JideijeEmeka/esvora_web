import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Loader from '../components/loader'
import Footer from '../components/footer'
import propertyController from '../controllers/property_controller'
import { selectShowRequest } from '../redux/slices/propertySlice'
import { normalizeShowRequest } from '../lib/propertyUtils'

const RequestDetailsView = () => {
	const navigate = useNavigate()
	const { id } = useParams()
	const [isLoading, setIsLoading] = useState(true)
	const [loadError, setLoadError] = useState(null)
	const [pendingAction, setPendingAction] = useState(null)
	const showRequestRaw = useSelector(selectShowRequest)
	const rawMatches = showRequestRaw && String(showRequestRaw?.id ?? showRequestRaw?.uuid) === String(id)
	const request = rawMatches ? normalizeShowRequest(showRequestRaw) : null

	useEffect(() => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'requests')
	}, [])

	useEffect(() => {
		if (!id) {
			setIsLoading(false)
			setLoadError('Request not found')
			return
		}
		setIsLoading(true)
		setLoadError(null)
		propertyController.showRequest(id, {
			onSuccess: () => setIsLoading(false),
			onError: (msg) => {
				setLoadError(msg ?? 'Failed to load request')
				setIsLoading(false)
			}
		})
	}, [id])

	const handleBack = () => {
		navigate('/property-owner/requests')
	}

	const handleDecline = () => {
		setPendingAction('decline')
		propertyController.declineRequest(id, {
			onSuccess: () => navigate('/property-owner/requests'),
			onError: () => setPendingAction(null)
		})
	}

	const handleAccept = () => {
		setPendingAction('accept')
		propertyController.acceptRequest(id, {
			onSuccess: () => navigate('/property-owner/requests'),
			onError: () => setPendingAction(null)
		})
	}

	if (isLoading) {
		return (
			<>
				<PropertyOwnerNavbar />
				<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex justify-center items-center bg-white'>
					<Loader />
				</div>
			</>
		)
	}

	if (loadError || !request) {
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
	const requestStatus = (request?.status ?? '').toLowerCase()
	const isApprovedRequest = requestStatus === 'accepted' || requestStatus === 'approved'
	const isDeclining = pendingAction === 'decline'
	const isAccepting = pendingAction === 'accept'
	const isActionLoading = isDeclining || isAccepting

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				<div className='max-w-5xl mx-auto w-full'>
					<div className='flex flex-wrap items-center justify-between gap-3 mb-8'>
						<button
							type='button'
							onClick={handleBack}
							className='text-primary font-medium hover:underline cursor-pointer'
						>
							← Back to Requests
						</button>

						{/* Action buttons */}
						{!isApprovedRequest && (
							<div className='flex flex-wrap items-center gap-2'>
								<button
									type='button'
									onClick={handleDecline}
									disabled={isActionLoading}
									className='px-5 py-2.5 rounded-full text-[14px] font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
								>
									{isDeclining ? 'Declining...' : 'Decline'}
								</button>
								<button
									type='button'
									onClick={handleAccept}
									disabled={isActionLoading}
									className='px-5 py-2.5 rounded-full text-[14px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
								>
									{isAccepting ? 'Accepting...' : 'Accept'}
								</button>
							</div>
						)}
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

				</div>
			</div>
		</>
	)
}

export default RequestDetailsView
