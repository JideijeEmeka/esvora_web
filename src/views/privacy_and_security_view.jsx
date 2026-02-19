import React, { useState } from 'react'
import {
	Smartphone,
	MapPin,
	Lock,
	ChevronRight,
	Sun,
	Moon,
	ChevronLeft
} from 'lucide-react'

export const ManageAppView = ({ onBack }) => {
	const [theme, setTheme] = useState('light')
	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
			{onBack && (
				<div className='md:hidden'>
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back to Privacy & Security
					</button>
				</div>
			)}
			<h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
				Manage app
			</h2>
			<div className='flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0'>
				<div className='shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center'>
					<Smartphone className='w-5 h-5 text-gray-700' />
				</div>
				<div className='flex-1 min-w-0'>
					<p className='text-[16px] font-medium text-gray-900'>
						Change theme
					</p>
				</div>
				<button
					type='button'
					role='switch'
					aria-checked={theme === 'dark'}
					aria-label='Toggle theme'
					onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
					className='shrink-0 w-12 h-12 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'
				>
					{theme === 'light' ? (
						<Sun className='w-5 h-5 text-gray-700' />
					) : (
						<Moon className='w-5 h-5 text-gray-700' />
					)}
				</button>
			</div>
		</div>
	)
}

const PRIVACY_ITEMS = [
	{
		id: 'app_setting',
		label: 'App setting',
		description: 'Manage your account type',
		icon: Smartphone
	},
	{
		id: 'set_location',
		label: 'Set location',
		description: 'Set your default location',
		icon: MapPin
	},
	{
		id: 'change_password',
		label: 'Change password',
		description: 'Manage your password',
		icon: Lock
	}
]

const PrivacyAndSecurityView = ({
	onAppSettingClick,
	onSetLocationClick,
	onChangePasswordClick,
	onBack
}) => {
	const handlePrivacyItemClick = (id) => {
		if (id === 'app_setting' && onAppSettingClick) onAppSettingClick()
		if (id === 'set_location' && onSetLocationClick) onSetLocationClick()
		if (id === 'change_password' && onChangePasswordClick) onChangePasswordClick()
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
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
				Privacy & Security
			</h2>
			<ul className='space-y-0'>
				{PRIVACY_ITEMS.map((item) => {
					const Icon = item.icon
					const hasAction =
						(item.id === 'app_setting' && onAppSettingClick) ||
						(item.id === 'set_location' && onSetLocationClick) ||
						(item.id === 'change_password' && onChangePasswordClick)
					return (
						<li key={item.id}>
							<button
								type='button'
								onClick={() => handlePrivacyItemClick(item.id)}
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

export default PrivacyAndSecurityView
