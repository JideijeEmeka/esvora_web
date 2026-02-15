import React, { useState, useMemo } from 'react'
import { ChevronLeft, User, Home, Check } from 'lucide-react'

const AccountTypeView = ({ currentType = 'renter', onBack, onSelectType, clickedSection }) => {
	const [selectedType, setSelectedType] = useState(currentType)

	// Determine if user is landlord or renter, and show appropriate account type
	const isLandlord = currentType === 'landlord'
	
	const accountType = useMemo(() => {
		if (isLandlord) {
			return {
				id: 'landlord',
				label: 'Landlord',
				description: 'List your properties, manage tenants and agreements.',
				icon: Home
			}
		}
		return {
			id: 'renter',
			label: 'Renter',
			description: 'Browse and rent properties. Manage your tenancy and requests.',
			icon: User
		}
	}, [isLandlord])

	const handleSelect = (id) => {
		setSelectedType(id)
		if (onSelectType) onSelectType(id)
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
						Back to Account setting
					</button>
				</div>
			)}

			<h2 className='text-[22px] font-semibold text-gray-900 mb-2'>
				Account type
			</h2>
			<p className='text-[14px] text-gray-600 mb-8'>
				{isLandlord 
					? 'Your account type is Landlord. Manage your properties and tenants.'
					: 'Your account type is Renter. Browse and rent properties.'
				}
			</p>

			<div className='space-y-4'>
				{(() => {
					const Icon = accountType.icon
					const isActive = currentType === accountType.id
					return (
						<button
							type='button'
							onClick={() => handleSelect(accountType.id)}
							className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-colors ${
								'border-primary bg-primary/5'
							}`}
						>
							<div className='shrink-0 w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center'>
								<Icon className='w-6 h-6 text-gray-700' />
							</div>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-2'>
									<p className='text-[16px] font-semibold text-gray-900'>
										{accountType.label}
									</p>
									{isActive && (
										<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[12px] font-medium'>
											<Check className='w-3 h-3' />
											Current
										</span>
									)}
								</div>
								<p className='text-[14px] text-gray-600 mt-1'>
									{accountType.description}
								</p>
							</div>
						</button>
					)
				})()}
			</div>
		</div>
	)
}

export default AccountTypeView
