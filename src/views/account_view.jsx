import React from 'react'
import { Camera, Info, ChevronLeft } from 'lucide-react'

const DEFAULT_USER = {
	name: 'Osaite Emmanuel',
	avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
	userId: 'E12509sec45679kod9-929',
	email: 'emmanuelosaite@gmail.com',
	gender: 'Male',
	country: 'Nigeria',
	phone: '09052471033',
	dateCreated: '24 November, 2025'
}

const AccountView = ({ user = DEFAULT_USER, onBack, clickedSection }) => {
	return (
		<div className={`bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 
		     ${clickedSection === false ? 'max-md:hidden' : ''}`}>
			<div className="md:hidden" onClick={onBack}>
				<button
					type='button'
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</button>
			</div>
			{/* Profile picture with camera overlay */}
			<div className='flex flex-col items-start mb-8'>
				<div className='relative'>
					<img
						src={user.avatar}
						alt={user.name}
						className='w-24 h-24 rounded-full object-cover border-2 border-gray-200'
					/>
					<button
						type='button'
						className='absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors'
						title='Edit photo'
					>
						<Camera className='w-4 h-4 text-white' />
					</button>
				</div>
				<h1 className='text-[22px] font-semibold text-gray-900 mt-4'>
					{user.name}
				</h1>
			</div>

			{/* Personal information list */}
			<div className='space-y-0 border-t border-gray-200'>
				{[
					{ label: 'User ID', value: user.userId },
					{ label: 'Email address', value: user.email },
					{ label: 'Gender', value: user.gender },
					{ label: 'Country', value: user.country },
					{ label: 'Phone number', value: user.phone, showInfo: true },
					{ label: 'Date created', value: user.dateCreated }
				].map(({ label, value, showInfo }) => (
					<div
						key={label}
						className='flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0'
					>
						<div className='flex items-center gap-2'>
							<span className='text-[14px] font-medium text-gray-600'>
								{label}
							</span>
							{showInfo && (
								<button
									type='button'
									className='w-4 h-4 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors'
									title='More info'
								>
									<Info className='w-4 h-4' />
								</button>
							)}
						</div>
						<span className='text-[14px] font-medium text-gray-900'>
							{value}
						</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default AccountView
