import React from 'react'
import {
	UserCircle2,
	Mail,
	Phone,
	Bell,
	ChevronRight,
	ChevronLeft
} from 'lucide-react'

const ACCOUNT_SETTING_ITEMS = [
	{
		id: 'account_type',
		label: 'Account type',
		description: 'Manage your account type',
		icon: UserCircle2,
		onClick: null
	},
	{
		id: 'change_email',
		label: 'Change email',
		description: 'Change email and manage verification',
		icon: Mail,
		onClick: null
	},
	{
		id: 'phone_preference',
		label: 'Phone preference',
		description: 'Manage your phone number',
		icon: Phone,
		onClick: null
	},
	{
		id: 'notification',
		label: 'Notification',
		description: 'Manage your notification preference',
		icon: Bell,
		onClick: null
	}
]

const AccountSettingsView = ({
	onAccountTypeClick,
	onChangeEmailClick,
	onPhonePreferenceClick,
	onNotificationClick,
	onBack,
	clickedSection
}) => {
	const handleItemClick = (id) => {
		if (id === 'account_type' && onAccountTypeClick) onAccountTypeClick()
		if (id === 'change_email' && onChangeEmailClick) onChangeEmailClick()
		if (id === 'phone_preference' && onPhonePreferenceClick) onPhonePreferenceClick()
		if (id === 'notification' && onNotificationClick) onNotificationClick()
	}

	return (
		<div className={`bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 ${clickedSection === false ? 'max-md:hidden' : ''}`}>
			{onBack && (
				<div className='md:hidden'>
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				</div>
			)}
			<h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
				Account setting
			</h2>
			<ul className='space-y-0'>
				{ACCOUNT_SETTING_ITEMS.map((item) => {
					const Icon = item.icon
					const hasAction =
						(item.id === 'account_type' && onAccountTypeClick) ||
						(item.id === 'change_email' && onChangeEmailClick) ||
						(item.id === 'phone_preference' && onPhonePreferenceClick) ||
						(item.id === 'notification' && onNotificationClick)
					return (
						<li key={item.id}>
							<button
								type='button'
								onClick={() => handleItemClick(item.id)}
								className='w-full flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0 text-left hover:bg-gray-50 rounded-lg transition-colors group'
							>
								<div className='shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors'>
									<Icon className='w-5 h-5 text-gray-700' />
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-[16px] font-medium text-gray-900'>
										{item.label}
									</p>
									<p className='text-[14px] text-gray-500'>
										{item.description}
									</p>
								</div>
								{hasAction && (
									<ChevronRight className='w-5 h-5 text-gray-400 shrink-0' />
								)}
							</button>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default AccountSettingsView
