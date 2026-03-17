import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const AccountTypeView = ({
	account,
	onBack,
	onSwitch,
	isLoading,
	clickedSection,
}) => {
	const isLandlord = account?.is_landlord === true
	const landlordDashboard = account?.landlord_dashboard === true

	const accountTypeMessage = landlordDashboard
		? 'You are currently using this app as a landlord!'
		: 'You are currently using this app as a renter!'

	const switchButtonText = !isLandlord
		? 'Become a landlord'
		: !landlordDashboard
			? 'Switch to a landlord'
			: 'Switch to a renter'

	const displayName = (account?.fullname ?? '').trim() || '—'
	const displayEmail = (account?.email ?? '') || '—'

	const handleSwitch = () => {
		if (!onSwitch) return
		if (!isLandlord) {
			onSwitch('becomeLandlord')
			return
		}
		onSwitch('switchDashboard', !landlordDashboard)
	}

	return (
		<div
			className={`bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 ${
				clickedSection === false ? 'max-md:hidden' : ''
			}`}
		>
			{onBack && (
				<div className='md:hidden'>
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back to Account setting
					</button>
				</div>
			)}

			<h2 className='text-[22px] font-semibold text-gray-900 mb-2'>
				Account type
			</h2>
			<p className='text-[14px] text-gray-600 mb-6'>
				{isLandlord
					? 'Your account type is Landlord. Manage your properties and tenants.'
					: 'Your account type is Renter. Browse and rent properties.'}
			</p>

			{/* User info card */}
			<div className='rounded-xl border border-gray-200 p-5 mb-6'>
				<p className='text-[20px] font-semibold text-gray-900'>
					{displayName}
				</p>
				<p className='text-[14px] text-gray-600 mt-2'>
					{displayEmail}
				</p>
				<div className='border-t border-gray-100 my-4' />
				<p className='text-[16px] text-gray-900'>
					{accountTypeMessage}
				</p>
				<div className='flex justify-center mt-6'>
					<button
						type='button'
						onClick={handleSwitch}
						disabled={isLoading}
						className='flex items-center gap-2 px-5 py-3.5 rounded-full border border-gray-200 text-[16px] font-medium text-gray-900 hover:bg-gray-50 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
					>
						{isLoading ? 'Switching...' : switchButtonText}
						<ChevronRight className='w-5 h-5 text-gray-500' />
					</button>
				</div>
			</div>
		</div>
	)
}

export default AccountTypeView
