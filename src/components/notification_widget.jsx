import React, { useEffect } from 'react'
import { Home, X } from 'lucide-react'

const SAMPLE_NOTIFICATIONS = [
	{
		id: 1,
		type: 'request_checkout',
		title: 'Request checkout',
		time: '12 min',
		description: 'You have a request schedule from Osaite Emmanuel for one of your properties',
		thumbnail: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=200',
		showActions: true
	},
	{
		id: 2,
		type: 'request_checkout',
		title: 'Request checkout',
		time: 'Wed',
		description: 'You have a request schedule from Osaite Emmanuel for one of your properties',
		thumbnail: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200',
		showActions: false
	},
	{
		id: 3,
		type: 'request_checkout',
		title: 'Request checkout',
		time: 'Wed',
		description: 'You have a request schedule from Osaite Emmanuel for one of your properties',
		thumbnail: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200',
		showActions: false
	},
	{
		id: 4,
		type: 'newly_listed',
		title: 'Newly Listed',
		time: 'Yesterday',
		description: 'A new property has just been listed near you. Check it out before it\'s gone!',
		linkText: 'Check it out',
		showActions: false
	}
]

const NotificationWidget = ({ isOpen, onClose }) => {
	// Prevent background from scrolling when widget is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
		return () => {
			document.body.style.overflow = ''
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<>
			{/* Backdrop - same as filter widget */}
			<div
				className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm'
				onClick={onClose}
				aria-hidden='true'
			/>
			{/* Panel - shifted from top and right, fully rounded */}
			<div
				className='fixed top-35 right-20 z-[51] w-full max-w-[420px] max-h-[85vh] bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='shrink-0 px-6 py-4 border-b border-gray-100 flex items-center justify-between'>
					<h2 className='text-[20px] font-bold text-gray-900'>Notification</h2>
					<button
						type='button'
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600'
						aria-label='Close notifications'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				{/* Scrollable list - min-h-0 so flex child can shrink and scroll */}
				<div className='overflow-y-auto scrollbar-hide flex-1 min-h-0'>
					{SAMPLE_NOTIFICATIONS.map((notification) => (
						<div
							key={notification.id}
							className='px-6 py-4 border-b border-gray-100 last:border-b-0'
						>
							<div className='flex gap-3'>
								{notification.type === 'request_checkout' ? (
									<img
										src={notification.thumbnail}
										alt=''
										className='w-14 h-14 rounded-lg object-cover shrink-0'
									/>
								) : (
									<div className='w-14 h-14 rounded-full bg-primary flex items-center justify-center shrink-0'>
										<Home className='w-7 h-7 text-white' />
									</div>
								)}
								<div className='min-w-0 flex-1'>
									<div className='flex items-start justify-between gap-2'>
										<h3 className='text-[16px] font-semibold text-gray-900'>
											{notification.title}
										</h3>
										<span className='text-[14px] text-gray-500 shrink-0'>
											{notification.time}
										</span>
									</div>
									<p className='text-[14px] text-gray-600 mt-1 leading-snug'>
										{notification.linkText
											? (
												<>
													{notification.description.split(notification.linkText)[0]}
													<button
														type='button'
														onClick={() => {}}
														className='text-primary font-medium hover:underline'
													>
														{notification.linkText}
													</button>
													{notification.description.split(notification.linkText)[1]}
												</>
											)
											: notification.description
										}
									</p>
									{notification.showActions && (
										<div className='flex gap-2 mt-3'>
											<button
												type='button'
												onClick={() => {}}
												className='px-4 py-2 text-[14px] font-medium text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50'
											>
												Decline
											</button>
											<button
												type='button'
												onClick={() => {}}
												className='px-4 py-2 text-[14px] font-medium text-white bg-primary rounded-full hover:bg-primary/90'
											>
												Accept
											</button>
										</div>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</>
	)
}

export default NotificationWidget
