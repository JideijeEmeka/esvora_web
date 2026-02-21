import React, { useState, useMemo } from 'react'
import { MapPin } from 'lucide-react'
import TenancyDetailsView from './tenancy_details_view'

const TABS = [
	{ id: 'all', label: 'All' },
	{ id: 'on_going', label: 'On-going' },
	{ id: 'terminated', label: 'Terminated' }
]

const SAMPLE_TENANCIES = [
	{
		id: 1,
		status: 'On-going',
		image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
		price: '$3000',
		description: '3 bedroom selfcon apartment',
		location: 'Ikoyi district, lagos',
		propertyType: '3 bedroom detachable',
		dateListed: '24/11/2025',
		dateRented: '24/11/2025',
		duration: '1 Year',
		amount: 'NGN 250,000',
		agent: {
			name: 'Osaite Emmanuel',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
			joiningDate: 'Since Nov 2025'
		}
	},
	{
		id: 2,
		status: 'On-going',
		image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
		price: '$3000',
		description: '3 bedroom selfcon apartment',
		location: 'Ikoyi district, lagos',
		propertyType: '3 bedroom detachable',
		dateListed: '24/11/2025',
		dateRented: '24/11/2025',
		duration: '1 Year',
		amount: 'NGN 250,000',
		agent: {
			name: 'Osaite Emmanuel',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
			joiningDate: 'Since Nov 2025'
		}
	},
	{
		id: 3,
		status: 'On-going',
		image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
		price: '$3000',
		description: '3 bedroom selfcon apartment',
		location: 'Ikoyi district, lagos',
		propertyType: '3 bedroom detachable',
		dateListed: '24/11/2025',
		dateRented: '24/11/2025',
		duration: '1 Year',
		amount: 'NGN 250,000',
		agent: {
			name: 'Osaite Emmanuel',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80',
			joiningDate: 'Since Nov 2025'
		}
	}
]

const TenancyView = () => {
	const [activeTab, setActiveTab] = useState('on_going')
	const [selectedTenancyId, setSelectedTenancyId] = useState(SAMPLE_TENANCIES[0]?.id)

	const filteredTenancies = useMemo(() => {
		if (activeTab === 'all') return SAMPLE_TENANCIES
		if (activeTab === 'on_going') return SAMPLE_TENANCIES.filter((t) => t.status === 'On-going')
		if (activeTab === 'terminated') return SAMPLE_TENANCIES.filter((t) => t.status === 'Terminated')
		return SAMPLE_TENANCIES
	}, [activeTab])

	const selectedTenancy = useMemo(
		() => SAMPLE_TENANCIES.find((t) => t.id === selectedTenancyId) ?? filteredTenancies[0],
		[selectedTenancyId, filteredTenancies]
	)

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 items-start'>
			{/* Left: Tenancy list */}
			<div className='lg:col-span-1 space-y-6'>
				<h2 className='text-[22px] font-semibold text-gray-900'>
					Tenancy
				</h2>

				{/* Filter tabs */}
				<div className='flex gap-2'>
					{TABS.map((tab) => (
						<button
							key={tab.id}
							type='button'
							onClick={() => setActiveTab(tab.id)}
							className={`px-4 py-2.5 rounded-full text-[14px] font-medium transition-colors ${
								activeTab === tab.id
									? 'bg-primary text-white'
									: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
							}`}
						>
							{tab.label}
						</button>
					))}
				</div>

				{/* Tenancy cards list */}
				<div className='space-y-4 max-h-[600px] overflow-y-auto'>
					{filteredTenancies.map((tenancy) => {
						const isSelected = selectedTenancyId === tenancy.id
						return (
							<button
								key={tenancy.id}
								type='button'
								onClick={() => setSelectedTenancyId(tenancy.id)}
								className={`w-full text-left rounded-xl border-2 overflow-hidden transition-colors ${
									isSelected
										? 'border-primary bg-primary/5'
										: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
								}`}
							>
								<div className='flex gap-3 p-3'>
									<img
										src={tenancy.image}
										alt={tenancy.description}
										className='w-20 h-20 shrink-0 rounded-lg object-cover'
									/>
									<div className='flex-1 min-w-0'>
										<p className='text-[16px] font-semibold text-gray-900'>
											{tenancy.price}
										</p>
										<p className='text-[14px] font-medium text-gray-700 truncate'>
											{tenancy.description}
										</p>
										<div className='flex items-center gap-1 text-gray-500 mt-0.5'>
											<MapPin className='w-3.5 h-3.5 shrink-0' />
											<span className='text-[12px] truncate'>
												{tenancy.location}
											</span>
										</div>
									</div>
								</div>
							</button>
						)
					})}
				</div>
			</div>

			{/* Right: Tenancy details */}
			<div className='lg:col-span-2'>
				{selectedTenancy ? (
					<TenancyDetailsView tenancy={selectedTenancy} />
				) : (
					<div className='bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500'>
						Select a tenancy to view details.
					</div>
				)}
			</div>
		</div>
	)
}

export default TenancyView
