import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeft, Home, Eye } from 'lucide-react'
import notificationController from '../controllers/notification_controller'
import propertyController from '../controllers/property_controller'
import toast from 'react-hot-toast'

const NotificationDetailsView = () => {
	const navigate = useNavigate()
	const { id } = useParams()
	const location = useLocation()
	const notification = location.state?.notification ?? null
	const [actioningId, setActioningId] = useState(null)

	// Redirect if no notification (e.g. direct URL without state)
	useEffect(() => {
		if (!notification && id) {
			navigate(-1)
		}
	}, [notification, id, navigate])

	// Mark as read on mount if unread
	useEffect(() => {
		if (notification && !notification.is_read) {
			notificationController.markAsRead(notification.id, {})
		}
	}, [notification])

	const handleBack = () => {
		navigate(-1)
	}

	const handleAccept = () => {
		const requestUuid = notification?.data?.property_request_uuid
		if (!requestUuid) {
			toast.error('Cannot accept this notification')
			return
		}
		setActioningId('accept')
		propertyController.acceptRequest(requestUuid, {
			onSuccess: () => {
				setActioningId(null)
				toast.success('Request accepted')
				navigate('/property-owner/requests')
			},
			onError: (msg) => {
				setActioningId(null)
				toast.error(msg ?? 'Failed to accept')
			}
		})
	}

	const handleDecline = () => {
		const requestUuid = notification?.data?.property_request_uuid
		if (!requestUuid) {
			toast.error('Cannot decline this notification')
			return
		}
		setActioningId('decline')
		propertyController.declineRequest(requestUuid, {
			onSuccess: () => {
				setActioningId(null)
				toast.success('Request declined')
				navigate('/property-owner/requests')
			},
			onError: (msg) => {
				setActioningId(null)
				toast.error(msg ?? 'Failed to decline')
			}
		})
	}

	const handleViewRequest = () => {
		const requestId = notification?.data?.property_request_uuid
		if (requestId) navigate(`/property-owner/requests/${requestId}`)
	}

	const handleViewProperty = () => {
		const propertyId = notification?.data?.property_uuid
		if (propertyId) navigate(`/property-details/${propertyId}`)
	}

	if (!notification) {
		return null
	}

	const hasActions = notification.action_buttons?.length > 0
	const requestUuid = notification?.data?.property_request_uuid
	const propertyUuid = notification?.data?.property_uuid

	return (
		<div className='min-h-screen bg-white pt-30 pb-10 px-6 md:px-16 lg:px-20'>
			<div className='max-w-2xl mx-auto'>
				{/* Back button */}
				<button
					type='button'
					onClick={handleBack}
					className='flex items-center gap-2 text-gray-600 hover:text-primary transition-colors mb-6'
				>
					<ArrowLeft className='w-5 h-5' />
					<span className='text-[16px] font-medium'>Back</span>
				</button>

				<h1 className='text-[20px] font-bold text-gray-900 mb-6'>Notification details</h1>

				{/* Image or placeholder */}
				{notification.image ? (
					<div className='w-full h-[200px] rounded-xl overflow-hidden mb-6 bg-gray-100'>
						<img
							src={notification.image}
							alt=''
							className='w-full h-full object-cover'
						/>
					</div>
				) : (
					<div className='w-full h-[120px] bg-primary/10 rounded-xl flex items-center justify-center mb-6'>
						<Home className='w-12 h-12 text-primary' />
					</div>
				)}

				{/* Title */}
				<h2 className='text-[20px] font-bold text-gray-900 mb-2'>{notification.title}</h2>

				{/* Timestamp */}
				<p className='text-[14px] text-gray-500 mb-4'>
					{notification.time_ago || notification.created_at || 'Just now'}
				</p>

				{/* Body */}
				<p className='text-[16px] text-gray-700 leading-relaxed mb-6 whitespace-pre-wrap'>
					{notification.body}
				</p>

				{/* Action buttons */}
				{hasActions && (
					<div className='flex gap-3 mb-4'>
						<button
							type='button'
							onClick={handleDecline}
							disabled={!!actioningId}
							className='flex-1 py-3 px-4 rounded-full border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-60'
						>
							{actioningId === 'decline' ? '...' : 'Decline'}
						</button>
						<button
							type='button'
							onClick={handleAccept}
							disabled={!!actioningId}
							className='flex-1 py-3 px-4 rounded-full bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60'
						>
							{actioningId === 'accept' ? '...' : 'Accept'}
						</button>
					</div>
				)}

				{requestUuid && (
					<button
						type='button'
						onClick={handleViewRequest}
						className='w-full py-3 px-4 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2 mb-4'
					>
						<Eye className='w-5 h-5' />
						View request
					</button>
				)}

				{propertyUuid && (
					<button
						type='button'
						onClick={handleViewProperty}
						className='w-full py-3 px-4 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2'
					>
						<Home className='w-5 h-5' />
						View property
					</button>
				)}
			</div>
		</div>
	)
}

export default NotificationDetailsView
