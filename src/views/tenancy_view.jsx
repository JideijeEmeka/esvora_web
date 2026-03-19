import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, Home, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import { selectTenancies, selectIsLoadingTenancies } from '../redux/slices/tenantSlice'
import tenantController from '../controllers/tenant_controller'
import TenancyDetailsView from './tenancy_details_view'
import Loader from '../components/loader'

const TABS = [
	{ index: 0, label: 'All' },
	{ index: 1, label: 'On-going' },
	{ index: 2, label: 'Terminated' }
]

const TenancyView = ({ onBack }) => {
	const tenancies = useSelector(selectTenancies)
	const isLoading = useSelector(selectIsLoadingTenancies)
	const [selectedTabIndex, setSelectedTabIndex] = useState(1)
	const [selectedTenancyId, setSelectedTenancyId] = useState(null)

	const filteredTenancies = useMemo(() => {
		if (selectedTabIndex === 0) return tenancies
		if (selectedTabIndex === 1) {
			return tenancies.filter(
				(t) =>
					(t.status ?? '').toLowerCase() === 'on-going' ||
					(t.status ?? '').toLowerCase() === 'ongoing'
			)
		}
		return tenancies.filter((t) => (t.status ?? '').toLowerCase() === 'terminated')
	}, [tenancies, selectedTabIndex])

	useEffect(() => {
		tenantController.listTenancies({
			forceRefetch: true,
			onError: () => toast.error('Failed to load tenancies')
		})
	}, [])

	const handleRefresh = async () => {
		await tenantController.listTenancies({
			forceRefetch: true,
			onError: () => toast.error('Failed to load tenancies')
		})
	}

	const getPropertyData = (tenancy) => {
		const p = tenancy?.property
		if (!p) return { imageUrl: null, price: '—', description: '—', location: '—' }
		const imageUrl = p.image ?? (p.images?.[0] ?? null)
		const price =
			p.price_formatted ?? p.priceFormatted ?? p.amount ?? (p.price != null ? String(p.price) : '—')
		const description = p.property_type_summary ?? p.propertyTypeSummary ?? '—'
		const location = p.location ?? '—'
		return { imageUrl, price, description, location }
	}

	if (selectedTenancyId) {
		return (
			<TenancyDetailsView
				tenancyId={selectedTenancyId}
				onBack={() => setSelectedTenancyId(null)}
			/>
		)
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
			<div className='flex items-center justify-between gap-4 mb-6'>
				{onBack && (
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				)}
				<h2 className='text-[24px] font-bold text-gray-900'>
					Tenancy
				</h2>
				<button
					type='button'
					onClick={handleRefresh}
					disabled={isLoading}
					className='p-2 rounded-full hover:bg-gray-100 text-gray-500 disabled:opacity-50 transition-colors shrink-0 ml-auto'
					aria-label='Refresh'
				>
					<RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
				</button>
			</div>

			{/* Filter tabs */}
			<div className='flex gap-2 p-1.5 rounded-[30px] bg-gray-100 w-fit mb-6'>
				{TABS.map((tab) => {
					const isSelected = selectedTabIndex === tab.index
					return (
						<button
							key={tab.index}
							type='button'
							onClick={() => setSelectedTabIndex(tab.index)}
							className={`px-4 py-2 rounded-[30px] text-[14px] font-medium transition-colors ${
								isSelected ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-200'
							}`}
						>
							{tab.label}
						</button>
					)
				})}
			</div>

			{isLoading && tenancies.length === 0 ? (
				<div className='flex justify-center py-16'>
					<Loader />
				</div>
			) : filteredTenancies.length === 0 ? (
				<div className='text-center py-16'>
					<p className='text-[14px] text-gray-500'>No tenancies</p>
				</div>
			) : (
				<div className='space-y-4'>
					{filteredTenancies.map((tenancy) => {
						const id = tenancy.id ?? tenancy.uuid
						if (!id) return null
						const { imageUrl, price, description, location } = getPropertyData(tenancy)
						return (
							<button
								key={id}
								type='button'
								onClick={() => setSelectedTenancyId(id)}
								className='w-full flex gap-3 p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-colors text-left'
							>
								{imageUrl ? (
									<img
										src={imageUrl}
										alt=''
										className='w-20 h-20 shrink-0 rounded-lg object-cover'
									/>
								) : (
									<div className='w-20 h-20 shrink-0 rounded-lg bg-gray-100 flex items-center justify-center'>
										<Home className='w-8 h-8 text-gray-400' />
									</div>
								)}
								<div className='flex-1 min-w-0'>
									<p className='text-[20px] font-bold text-gray-900 truncate'>
										{price}
									</p>
									<p className='text-[14px] text-gray-600 truncate mt-1'>
										{description}
									</p>
									<p className='text-[12px] text-gray-500 truncate mt-1'>
										{location}
									</p>
								</div>
							</button>
						)
					})}
				</div>
			)}
		</div>
	)
}

export default TenancyView
