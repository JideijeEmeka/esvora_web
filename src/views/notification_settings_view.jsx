import React, { useState } from 'react'
import { ChevronLeft, Home, MessageCircle, Monitor, Bell } from 'lucide-react'

const NOTIFICATION_OPTIONS = [
	{
		id: 'push_notification',
		label: 'Enable push notification',
		icon: Bell
	}
]

const NotificationSettingsView = ({ onBack, onToggle, initialValues = {} }) => {
	const [toggles, setToggles] = useState(() => ({
		new_property: initialValues.new_property ?? false,
		new_message: initialValues.new_message ?? false,
		email_updates: initialValues.email_updates ?? false,
		push_notification: initialValues.push_notification ?? false
	}))

	const handleToggle = (id) => {
		setToggles((prev) => ({ ...prev, [id]: !prev[id] }))
		if (onToggle) onToggle(id, !toggles[id])
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
			{/* Back link */}
			<button
				type='button'
				onClick={onBack}
				className='flex items-center gap-2 text-[14px] font-medium text-gray-600
				 hover:text-gray-900 mb-6 transition-colors'
			>
				<ChevronLeft className='w-4 h-4' />
				Back
			</button>

			<h2 className='text-[22px] font-semibold text-gray-900 mb-6'>
				Notification
			</h2>

			<p className='text-[14px] text-gray-600 mb-6'>
				Manage your notification preference.
			</p>

			<div className='space-y-0'>
				{NOTIFICATION_OPTIONS.map((option) => {
					const Icon = option.icon
					const isOn = toggles[option.id]
					return (
						<div
							key={option.id}
							className='flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0'
						>
							<div className='shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center'>
								<Icon className='w-5 h-5 text-gray-700' />
							</div>
							<p className='flex-1 min-w-0 text-[16px] font-medium text-gray-900'>
								{option.label}
							</p>
							<button
								type='button'
								role='switch'
								aria-checked={isOn}
								onClick={() => handleToggle(option.id)}
								className={`shrink-0 w-12 h-7 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
									isOn
										? 'bg-primary border-primary'
										: 'bg-gray-200 border-gray-200'
								}`}
							>
								<span
									className={`block w-5 h-5 rounded-full bg-white border border-gray-200 shadow-sm transform transition-transform ${
										isOn ? 'translate-x-[22px]' : 'translate-x-0.5'
									}`}
								/>
							</button>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default NotificationSettingsView
