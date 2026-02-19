import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import ManageScheduleWidget from '../components/manage_schedule_widget'
import { Settings, ChevronRight } from 'lucide-react'

const SAMPLE_REQUESTS = [
	{
		id: 1,
		type: 'schedule',
		propertyType: 'Rent',
		image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
		title: 'Schedule Request',
		timeAgo: '12 min',
		message: 'You have a request schedule from',
		requesterName: 'Osaite Emmanuel',
		suffix: 'for one of your properties.',
		participants: ['Osaite E', 'John Nathan', 'Giveon'],
		participantsExtra: 3
	},
	{
		id: 2,
		type: 'schedule',
		propertyType: 'Sale',
		image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
		title: 'Schedule Request',
		timeAgo: '1 hr',
		message: 'You have a request schedule from',
		requesterName: 'John Nathan',
		suffix: 'for one of your properties.',
		participants: ['John Nathan', 'Giveon'],
		participantsExtra: 2
	},
	{
		id: 3,
		type: 'reservation',
		propertyType: 'Shortlet',
		image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
		title: 'Reservation',
		timeAgo: '2 hr',
		message: 'You have a reservation from',
		requesterName: 'Osaite Emmanuel',
		dateRange: 'Jan 25 - 28 2025'
	}
]

const FILTERS = ['New', 'Pending', 'Approved']

const RequestsView = () => {
	const navigate = useNavigate()
	const [activeFilter, setActiveFilter] = useState('New')
	const [isManageScheduleOpen, setIsManageScheduleOpen] = useState(false)

	useEffect(() => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'requests')
	}, [])

	const handleDecline = (id) => {
		console.log('Decline request', id)
	}

	const handleAccept = (id) => {
		console.log('Accept request', id)
	}

	const handleCheckProperty = (id) => {
		console.log('Check property', id)
	}

	const handleViewParticipants = (request) => {
		console.log('View participants', request)
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
						<button
							type='button'
							onClick={() => setIsManageScheduleOpen(true)}
							className='flex items-center gap-2 text-gray-500 hover:text-gray-700 text-[14px] font-medium transition-colors'
						>
							<Settings className='w-4 h-4' />
							Manage
						</button>
					</div>

					<ManageScheduleWidget
						isOpen={isManageScheduleOpen}
						onClose={() => setIsManageScheduleOpen(false)}
						onSave={(slots) => {
							console.log('Schedule saved', slots)
						}}
					/>

					{/* Status filters */}
					<div className='flex flex-wrap gap-2 mb-8'>
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
					</div>

					{/* Request list */}
					<div className='space-y-4'>
						{SAMPLE_REQUESTS.map((request) => (
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

										{request.type === 'schedule' && activeFilter !== 'Approved' && (
											<>
												<div className='flex flex-wrap gap-2 mb-3'>
													<button
														type='button'
														onClick={(e) => {
															e.stopPropagation()
															handleDecline(request.id)
														}}
														className='px-4 py-2 rounded-full text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
													>
														Decline
													</button>
													<button
														type='button'
														onClick={(e) => {
															e.stopPropagation()
															handleAccept(request.id)
														}}
														className='px-4 py-2 rounded-full text-[14px] font-medium bg-primary text-white hover:bg-primary/90 transition-colors'
													>
														Accept
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

										{request.type === 'schedule' && activeFilter === 'Approved' && (
											<span className='inline-block px-4 py-2 rounded-full text-[14px] font-medium bg-gray-100 text-gray-700'>
												{request.propertyType === 'Sale' ? 'Sold out' : 'Checked in'}
											</span>
										)}

										{request.type === 'reservation' && (
											<button
												type='button'
												onClick={(e) => {
													e.stopPropagation()
													handleCheckProperty(request.id)
												}}
												className='px-4 py-2 rounded-full text-[14px] font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
											>
												Check property information
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
	)
}

export default RequestsView
