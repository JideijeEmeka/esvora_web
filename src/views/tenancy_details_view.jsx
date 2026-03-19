import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, Home, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { selectTenancyDetails, selectIsLoadingDetails } from '../redux/slices/tenantSlice'
import tenantController from '../controllers/tenant_controller'
import Loader from '../components/loader'

const normalizeStatus = (status) => {
	if (!status) return '—'
	const lower = status.toLowerCase()
	if (lower === 'on-going' || lower === 'ongoing') return 'On-going'
	if (lower === 'terminated') return 'Terminated'
	return status
}

const TenancyDetailsView = ({ tenancyId, onBack }) => {
	const details = useSelector(selectTenancyDetails)
	const isLoading = useSelector(selectIsLoadingDetails)
	const isForThisTenancy = !details || details.id === tenancyId || details.uuid === tenancyId

	useEffect(() => {
		if (tenancyId) {
			tenantController.getTenancyDetails({
				id: tenancyId,
				forceRefetch: true,
				onError: () => toast.error('Failed to load tenancy details')
			})
		}
	}, [tenancyId])

	const handleRefresh = () => {
		tenantController.getTenancyDetails({
			id: tenancyId,
			forceRefetch: true,
			onError: () => toast.error('Failed to load tenancy details')
		})
	}

	if (isLoading && !details) {
		return (
			<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
				{onBack && (
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				)}
				<div className='flex justify-center py-16'>
					<Loader />
				</div>
			</div>
		)
	}

	if (!details || !isForThisTenancy) {
		return (
			<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
				{onBack && (
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				)}
				<div className='text-center py-16'>
					<p className='text-[14px] text-gray-500'>Failed to load tenancy details</p>
				</div>
			</div>
		)
	}

	const summary = details.property_summary ?? details.propertySummary
	const info = details.property_information ?? details.propertyInformation
	const landlord = details.landlord
	const status = normalizeStatus(details.status)
	const isTerminated = status.toLowerCase() === 'terminated'

	const imageUrl =
		summary?.image ?? (summary?.images?.[0] ?? null)
	const price = summary?.price_formatted ?? summary?.priceFormatted ?? info?.amount ?? '—'
	const propertyType = summary?.property_type_summary ?? summary?.propertyTypeSummary ?? '—'
	const location = summary?.location ?? '—'

	const InfoRow = ({ label, value }) => (
		<div className='flex justify-between items-start gap-4 py-1.5'>
			<span className='text-[14px] text-gray-600 flex-1'>{label}</span>
			<span className='text-[14px] font-medium text-gray-900 text-right flex-1'>
				{value ?? '—'}
			</span>
		</div>
	)

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
			{onBack && (
				<button
					type='button'
					onClick={onBack}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors'
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</button>
			)}

			<h2 className='text-[24px] font-bold text-gray-900 mb-6'>
				Information
			</h2>

			{/* Property overview card */}
			<div className='p-4 rounded-xl border border-gray-200 bg-gray-50/50 mb-6'>
				<div className='flex items-center gap-2 mb-4'>
					<span
						className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-semibold ${
							isTerminated
								? 'bg-red-100 text-red-700 border border-red-200'
								: 'bg-green-100 text-green-700 border border-green-200'
						}`}
					>
						{isTerminated ? (
							<XCircle className='w-3.5 h-3.5' />
						) : (
							<CheckCircle className='w-3.5 h-3.5' />
						)}
						{status}
					</span>
				</div>
				<div className='flex gap-4'>
					{imageUrl ? (
						<img
							src={imageUrl}
							alt=''
							className='w-20 h-20 shrink-0 rounded-lg object-cover'
						/>
					) : (
						<div className='w-20 h-20 shrink-0 rounded-lg bg-gray-200 flex items-center justify-center'>
							<Home className='w-8 h-8 text-gray-400' />
						</div>
					)}
					<div className='flex-1 min-w-0'>
						<p className='text-[20px] font-bold text-gray-900'>{price}</p>
						<p className='text-[14px] text-gray-600 mt-1'>{propertyType}</p>
						<p className='text-[12px] text-gray-500 mt-1'>{location}</p>
					</div>
				</div>
			</div>

			<h3 className='text-[18px] font-semibold text-gray-900 mb-4'>
				Property information
			</h3>
			<div className='p-4 rounded-xl bg-gray-100 mb-6 space-y-1'>
				<InfoRow label='Property type' value={info?.property_type ?? info?.propertyType} />
				<InfoRow label='Date listed' value={info?.date_listed ?? info?.dateListed} />
				<InfoRow label='Date rented' value={info?.date_rented ?? info?.dateRented} />
				<InfoRow label='Duration' value={info?.duration} />
				<InfoRow label='Rent expires at' value={info?.rent_expires_at ?? info?.rentExpiresAt} />
				<InfoRow label='Booking expires at' value={info?.booking_expires_at ?? info?.bookingExpiresAt} />
				<InfoRow label='Amount' value={info?.amount} />
			</div>

			<h3 className='text-[16px] font-semibold text-gray-900 mb-2 flex items-center gap-2'>
				Landlord
				{landlord?.verified && (
					<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[12px] font-semibold'>
						<CheckCircle className='w-3 h-3' />
						Verified
					</span>
				)}
			</h3>
			<div className='flex items-center gap-4 p-4 rounded-xl border border-gray-200'>
				{landlord?.avatar ? (
					<img
						src={landlord.avatar}
						alt=''
						className='w-12 h-12 rounded-full object-cover'
					/>
				) : (
					<div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
						<span className='text-gray-500 text-lg'>👤</span>
					</div>
				)}
				<div>
					<p className='text-[16px] font-semibold text-gray-900'>
						{landlord?.name ?? '—'}
					</p>
					<p className='text-[14px] text-gray-500'>
						Since {landlord?.member_since ?? landlord?.memberSince ?? '—'}
						<span className='inline-block w-1 h-1 rounded-full bg-gray-400 mx-2 align-middle' />
						{landlord?.listed_properties_count ?? landlord?.listedPropertiesCount ?? 0}{' '}
						Listed properties
					</p>
				</div>
			</div>
		</div>
	)
}

export default TenancyDetailsView
