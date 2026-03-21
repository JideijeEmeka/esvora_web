import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, X, BookOpen } from 'lucide-react'
import notificationController from '../controllers/notification_controller'
import propertyController from '../controllers/property_controller'
import Loader from './loader'
import toast from 'react-hot-toast'

const NotificationWidget = ({ isOpen, onClose }) => {
	const navigate = useNavigate()
	const location = useLocation()
	const isOnDetailsPage = location.pathname.startsWith('/notification/')
	const [notifications, setNotifications] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [actioningId, setActioningId] = useState(null)
	const [isMarkingAll, setIsMarkingAll] = useState(false)

	// Fetch notifications when widget opens
	useEffect(() => {
		if (!isOpen) return
		setIsLoading(true)
		notificationController.getNotifications({
			onSuccess: (data) => {
				setNotifications(Array.isArray(data?.all) ? data.all : [])
				setIsLoading(false)
			},
			onError: () => {
				setNotifications([])
				setIsLoading(false)
			}
		})
	}, [isOpen])

	// Prevent background from scrolling when widget overlay is visible (not when on details page)
	useEffect(() => {
		if (isOpen && !isOnDetailsPage) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen, isOnDetailsPage])

	const handleAction = (notification, action) => {
		const requestUuid = notification?.data?.property_request_uuid
		if (!requestUuid) return
		setActioningId(notification.id)
		const callbacks = {
			onSuccess: () => {
				setActioningId(null)
				onClose?.()
				toast.success(action === 'accept' ? 'Request accepted' : 'Request declined')
				navigate('/property-owner/requests')
			},
			onError: (msg) => {
				setActioningId(null)
				toast.error(msg ?? 'Action failed')
			}
		}
		if (action === 'accept') {
			propertyController.acceptRequest(requestUuid, callbacks)
		} else if (action === 'decline') {
			propertyController.declineRequest(requestUuid, callbacks)
		}
	}

	const handleViewRequest = (notification) => {
		const requestId = notification?.data?.property_request_uuid
		if (requestId) {
			onClose?.()
			navigate(`/property-owner/requests/${requestId}`)
		}
	}

	const handleMarkAllAsRead = () => {
		if (!window.confirm('Do you want to mark all notifications as read?')) return
		setIsMarkingAll(true)
		notificationController.markAllAsRead({
			onSuccess: () => {
				setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
				notificationController.getUnreadCount({ forceRefetch: true })
				setIsMarkingAll(false)
				toast.success('All notifications marked as read')
			},
			onError: (msg) => {
				setIsMarkingAll(false)
				toast.error(msg ?? 'Failed to mark all as read')
			}
		})
	}

	const handleNotificationClick = (notification) => {
		// Keep panel "open" via sessionStorage so Back from details restores it (survives navbar remount)
		sessionStorage.setItem('esvora_notifications_panel_open', '1')
		navigate(`/notification/${notification.id}`, {
			state: { notification }
		})
	}

	// Hide overlay when on details page so user sees details; panel stays "open" for Back
	if (!isOpen || isOnDetailsPage) return null

	return (
		<>
			<div
				className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
				aria-hidden='true'
			/>
			<div
				className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] w-full max-w-[420px] max-h-[85vh] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between'>
					<h2 className='text-[20px] font-bold text-gray-900'>Notifications</h2>
					<div className='flex items-center gap-2'>
						<button
							type='button'
							onClick={handleMarkAllAsRead}
							disabled={isMarkingAll || notifications.length === 0}
							className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50'
							aria-label='Mark all as read'
							title='Mark all as read'
						>
							<BookOpen className='w-5 h-5' />
						</button>
						<button
							type='button'
							onClick={onClose}
							className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600'
							aria-label='Close notifications'
						>
							<X className='w-5 h-5' />
						</button>
					</div>
				</div>

				<div className='overflow-y-auto scrollbar-hide flex-1 min-h-0'>
					{isLoading ? (
						<div className='flex flex-col items-center justify-center py-16 px-6'>
							<Loader size={32} />
							<p className='text-[14px] text-gray-500 mt-3'>Loading notifications...</p>
						</div>
					) : notifications.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-16 px-6'>
							<Home className='w-12 h-12 text-gray-300 mb-4' />
							<p className='text-[14px] text-gray-600 font-medium'>No notifications yet</p>
							<p className='text-[13px] text-gray-500 mt-1'>We&apos;ll notify you when something new arrives.</p>
						</div>
					) : (
						notifications.map((notification) => (
							<div
								key={notification.id}
								role="button"
								tabIndex={0}
								onKeyDown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										e.preventDefault()
										handleNotificationClick(notification)
									}
								}}
								onClick={() => handleNotificationClick(notification)}
								className={`px-6 py-4 border-b border-gray-100 last:border-b-0 cursor-pointer ${notification.is_read ? '' : 'bg-primary/5'}`}
							>
								<div className='flex gap-3'>
									{notification.image ? (
										<img
											src={notification.image}
											alt=''
											className='w-14 h-14 rounded-lg object-cover shrink-0'
										/>
									) : (
										<div className='w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0'>
											<Home className='w-7 h-7 text-primary' />
										</div>
									)}
									<div className='min-w-0 flex-1'>
										<div className='flex items-start justify-between gap-2'>
											<h3 className='text-[16px] font-semibold text-gray-900'>
												{notification.title}
											</h3>
											<span className='text-[14px] text-gray-500 shrink-0'>
												{notification.time_ago || 'Just now'}
											</span>
										</div>
										<p className='text-[14px] text-gray-600 mt-1 leading-snug'>
											{notification.body}
										</p>
										{(notification.action_buttons?.length > 0 || notification?.data?.property_request_uuid) && (
											<div className='flex gap-2 mt-3 flex-wrap'>
												{notification.action_buttons?.map((btn) => (
													<button
														key={btn.action}
														type='button'
														disabled={actioningId === notification.id}
														onClick={(e) => {
															e.stopPropagation()
															handleAction(notification, btn.action)
														}}
														className={`px-4 py-2 text-[14px] font-medium rounded-full transition-colors disabled:opacity-60 ${
															btn.action === 'accept'
																? 'text-white bg-primary hover:bg-primary/90'
																: 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
														}`}
													>
														{actioningId === notification.id ? '...' : btn.label}
													</button>
												))}
												{notification?.data?.property_request_uuid && (
													<button
														type='button'
														onClick={(e) => {
															e.stopPropagation()
															handleViewRequest(notification)
														}}
														className='px-4 py-2 text-[14px] font-medium text-primary hover:underline'
													>
														View
													</button>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</>
	)
}

export default NotificationWidget
