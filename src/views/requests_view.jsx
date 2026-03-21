import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Loader from '../components/loader'
import Footer from '../components/footer'
import ManageScheduleWidget from '../components/manage_schedule_widget'
import { Settings, ChevronRight, RefreshCw } from 'lucide-react'

import propertyController from '../controllers/property_controller'
import { selectLandlordRequests } from '../redux/slices/propertySlice'
import { normalizeLandlordRequest } from '../lib/propertyUtils'


const FILTERS = ['New', 'Pending', 'Approved']

const RequestsView = () => {
	const navigate = useNavigate()
	const [activeFilter, setActiveFilter] = useState('New')
	const [isManageScheduleOpen, setIsManageScheduleOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [pendingAction, setPendingAction] = useState({ requestId: null, type: null })
	const landlordRequestsRaw = useSelector(selectLandlordRequests)
	const allRequests = (landlordRequestsRaw ?? []).map(normalizeLandlordRequest).filter(Boolean)
	const statusMap = {
		New: ['new', 'pending'],
		Pending: ['new', 'pending'],
		Approved: ['accepted', 'approved']
	}
	const requests = allRequests.filter((r) => {
		const s = (r?.status ?? r?.raw?.status ?? '').toLowerCase()
		const allowed = statusMap[activeFilter]
		return allowed ? allowed.includes(s) : true
	})

	useEffect(() => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'requests')
	}, [])

	useEffect(() => {
		setIsLoading(true)
		propertyController.listLandlordRequests({
			onSuccess: () => setIsLoading(false),
			onError: () => setIsLoading(false)
		})
	}, [])

	const handleRefreshRequests = () => {
		setIsRefreshing(true)
		propertyController.listLandlordRequests({
			forceRefetch: true,
			onSuccess: () => setIsRefreshing(false),
			onError: () => setIsRefreshing(false)
		})
	}

	const handleDecline = (requestId) => {
		setPendingAction({ requestId, type: 'decline' })
		propertyController.declineRequest(requestId, {
			onSuccess: () => {
				propertyController.listLandlordRequests({ forceRefetch: true })
				setPendingAction({ requestId: null, type: null })
			},
			onError: () => {
				setPendingAction({ requestId: null, type: null })
			}
		})
	}

	const handleAccept = (requestId) => {
		setPendingAction({ requestId, type: 'accept' })
		propertyController.acceptRequest(requestId, {
			onSuccess: () => {
				propertyController.listLandlordRequests({ forceRefetch: true })
				setPendingAction({ requestId: null, type: null })
			},
			onError: () => {
				setPendingAction({ requestId: null, type: null })
			}
		})
	}

	const handleCheckProperty = (propId) => {
		if (propId) navigate(`/property-details/${propId}`)
	}

	const handleViewParticipants = (request) => {
		// Could open a modal or navigate; for now navigate to details
		if (request?.id) navigate(`/property-owner/requests/${request.id}`)
	}

	const handleCardClick = (requestId, e) => {
		if (e.target.closest('button')) return
		navigate(`/property-owner/requests/${requestId}`)
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				<div className='max-w-4xl mx-auto w-full'>
					{/* Header */}
					<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6'>
						<h1 className='text-[28px] md:text-[32px] font-bold text-gray-900'>
							Requests
						</h1>
						<div className='flex items-center gap-3'>
							<button
								type='button'
								onClick={() => setIsManageScheduleOpen(true)}
								className='flex items-center gap-2 text-gray-500 hover:text-gray-700 text-[14px] font-medium transition-colors'
							>
								<Settings className='w-4 h-4' />
								Manage
							</button>
						</div>
					</div>

					<ManageScheduleWidget
						isOpen={isManageScheduleOpen}
						onClose={() => setIsManageScheduleOpen(false)}
						onSave={(slots) => {
							console.log('Schedule saved', slots)
						}}
					/>

					{/* Status filters */}
					<div className='flex flex-wrap items-center gap-2 mb-8'>
						{FILTERS.map((filter) => (
							<button
								key={filter}
								type='button'
								onClick={() => setActiveFilter(filter)}
								className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-colors ${
									activeFilter === filter
										? 'bg-primary text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{filter}
							</button>
						))}
						<button
							type='button'
							onClick={handleRefreshRequests}
							disabled={isLoading || isRefreshing}
							aria-label='Refresh requests'
							title='Refresh requests'
							className='p-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
						>
							<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
						</button>
					</div>

					{/* Request list */}
					<div className='space-y-4'>
						{isLoading ? (
							<div className='flex justify-center py-12'>
								<Loader />
							</div>
						) : requests.length === 0 ? (
							<p className='text-gray-600 py-8'>No requests yet.</p>
						) : requests.map((request) => {
							const requestStatus = (request?.status ?? request?.raw?.status ?? '').toLowerCase()
							const isApprovedRequest = requestStatus === 'accepted' || requestStatus === 'approved'
							const isDeclining = pendingAction.requestId === request.id && pendingAction.type === 'decline'
							const isAccepting = pendingAction.requestId === request.id && pendingAction.type === 'accept'
							const isActionLoading = isDeclining || isAccepting
							return (
							<div
								key={request.id}
								role='button'
								tabIndex={0}
								onClick={(e) => handleCardClick(request.id, e)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										handleCardClick(request.id, e)
									}
								}}
								className='bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer'
							>
								<div className='flex gap-4'>
									{/* Thumbnail + type tag */}
									<div className='relative shrink-0 w-24 h-24 rounded-lg overflow-hidden'>
										<img
											src={request.image}
											alt=''
											className='w-full h-full object-cover'
										/>
										<span className='absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-800'>
											{request.propertyType}
										</span>
									</div>

									<div className='flex-1 min-w-0'>
										<div className='flex flex-wrap items-center gap-2 mb-1'>
											<span className='text-[16px] font-semibold text-gray-900'>
												{request.title}
											</span>
											<span className='text-[14px] text-gray-500'>
												{request.timeAgo}
											</span>
											<span className='text-gray-300'>•</span>
										</div>
										<p className='text-[14px] text-gray-700 mb-3'>
											{request.message}{' '}
											<span className='font-semibold text-gray-900'>
												{request.requesterName}
											</span>
											{request.dateRange
												? `. for ${request.dateRange}`
												: ` ${request.suffix}`}
										</p>

										{request.type === 'schedule' && !isApprovedRequest && (
											<>
												<div className='flex flex-wrap gap-2 mb-3'>
													<button
														type='button'
														onClick={(e) => {
															e.stopPropagation()
															handleDecline(request.id)
														}}
														disabled={isActionLoading}
														className='px-4 py-2 rounded-full text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
													>
														{isDeclining ? 'Declining...' : 'Decline'}
													</button>
													<button
														type='button'
														onClick={(e) => {
															e.stopPropagation()
															handleAccept(request.id)
														}}
														disabled={isActionLoading}
														className='px-4 py-2 rounded-full text-[14px] font-medium bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed'
													>
														{isAccepting ? 'Accepting...' : 'Accept'}
													</button>
												</div>
												{request.participants && (
													<button
														type='button'
														onClick={(e) => {
															e.stopPropagation()
															handleViewParticipants(request)
														}}
														className='flex items-center gap-1 text-[14px] text-gray-600 hover:text-gray-900'
													>
														{request.participants.join(', ')}
														{request.participantsExtra
															? `... +${request.participantsExtra} others`
															: ''}{' '}
														<ChevronRight className='w-4 h-4' />
													</button>
												)}
											</>
										)}

										{request.type === 'schedule' && isApprovedRequest && (
											<span className='inline-block px-4 py-2 rounded-full text-[14px] font-medium bg-gray-100 text-gray-700'>
												{request.propertyType === 'Sale' ? 'Sold out' : 'Checked in'}
											</span>
										)}

										{request.type === 'reservation' && (
											<button
												type='button'
												onClick={(e) => {
													e.stopPropagation()
													handleCheckProperty(request?.raw?.property?.id ?? request?.raw?.property?.uuid)
												}}
												className='px-4 py-2 rounded-full text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
											>
												Check property information
											</button>
										)}
									</div>
								</div>
							</div>
							)
						})}
					</div>
				</div>
			</div>
		</>
	)
}

export default RequestsView
