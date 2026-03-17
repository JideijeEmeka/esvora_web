import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, Check, User, Copy } from 'lucide-react'
import agreementsController from '../controllers/agreements_controller'
import Loader from '../components/loader'
import { selectAgreementDetails } from '../redux/slices/agreementSlice'
import toast from 'react-hot-toast'

const DetailCard = ({ title, children }) => (
	<div className='bg-gray-50 rounded-xl border border-gray-200 p-4'>
		{title && (
			<h3 className='text-[14px] font-semibold text-gray-600 mb-3'>{title}</h3>
		)}
		{children}
	</div>
)

const DetailRow = ({ label, value }) =>
	value != null && value !== '' ? (
		<div className='flex justify-between gap-4 py-2 border-b border-gray-100 last:border-0'>
			<span className='text-[14px] text-gray-600'>{label}</span>
			<span className='text-[14px] font-medium text-gray-900 text-right'>
				{value}
			</span>
		</div>
	) : null

const PartyBlock = ({ party, title }) => {
	if (!party) return <DetailCard title={title}><p className='text-gray-500'>—</p></DetailCard>
	return (
		<DetailCard title={title}>
			<div className='flex items-center gap-3 mb-3'>
				{party.avatar ? (
					<img
						src={party.avatar}
						alt={party.name}
						className='w-12 h-12 rounded-full object-cover'
					/>
				) : (
					<div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center'>
						<User className='w-6 h-6 text-gray-500' />
					</div>
				)}
				<div className='flex-1 min-w-0'>
					<p className='text-[16px] font-semibold text-gray-900'>
						{party.name ?? '—'}
					</p>
					{party.id && (
						<p className='text-[12px] text-gray-500'>ID: {party.id}</p>
					)}
				</div>
				{party.verified === true && (
					<Check className='w-5 h-5 text-primary shrink-0' />
				)}
				{party.verified === false && (
					<span className='text-[12px] text-gray-500'>Unverified</span>
				)}
			</div>
			<DetailRow label='Party ID' value={party.id} />
			<DetailRow label='Name' value={party.name} />
			<DetailRow label='Verified' value={party.verified === true ? 'Yes' : 'No'} />
		</DetailCard>
	)
}

const AgreementDetailsView = ({ agreementId, onBack }) => {
	const [details, setDetails] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(false)

	const loadDetails = () => {
		if (!agreementId) return
		setError(false)
		agreementsController.getAgreementDetails(agreementId, {
			setLoading: setIsLoading,
			onSuccess: (data) => setDetails(data),
			onError: () => setError(true)
		})
	}

	useEffect(() => {
		loadDetails()
	}, [agreementId])

	const handleCopy = (text, label) => {
		if (navigator?.clipboard) {
			navigator.clipboard.writeText(text)
			toast.success(`${label} copied`)
		}
	}

	if (isLoading && !details) {
		return (
			<div className='space-y-6'>
				{onBack && (
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				)}
				<h2 className='text-[22px] font-semibold text-gray-900'>
					Agreement details
				</h2>
				<div className='flex justify-center py-12'>
					<Loader />
				</div>
			</div>
		)
	}

	if (error || !details || details?.id !== agreementId) {
		return (
			<div className='space-y-6'>
				{onBack && (
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				)}
				<h2 className='text-[22px] font-semibold text-gray-900'>
					Agreement details
				</h2>
				<div className='flex justify-center py-12'>
					<Loader />
				</div>
			</div>
		)
	}

	const d = details
	const property = d.property
	const terms = d.terms

	return (
		<div className='space-y-6'>
			{onBack && (
				<button
					type='button'
					onClick={onBack}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900'
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</button>
			)}
			<h2 className='text-[22px] font-semibold text-gray-900'>
				Agreement details
			</h2>

			<div className='space-y-4'>
				<DetailCard title='Agreement'>
					{d.id && (
						<div className='flex items-center justify-between gap-2 py-2 border-b border-gray-100'>
							<span className='text-[14px] text-gray-600'>Agreement ID</span>
							<div className='flex items-center gap-2'>
								<span className='text-[14px] font-medium text-gray-900'>
									{d.id}
								</span>
								<button
									type='button'
									onClick={() => handleCopy(d.id, 'Agreement ID')}
									className='text-primary hover:opacity-80'
									aria-label='Copy'
								>
									<Copy className='w-4 h-4' />
								</button>
							</div>
						</div>
					)}
					<DetailRow label='Type' value={d.agreement_type} />
					{d.status && (
						<div className='flex items-center gap-2 py-2'>
							<span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 font-medium text-[12px] border border-green-200'>
								<Check className='w-3.5 h-3.5' />
								{d.status}
							</span>
						</div>
					)}
					<DetailRow label='Completed at' value={d.completed_at} />
				</DetailCard>

				<PartyBlock party={d.party_one} title='Party one' />
				<PartyBlock party={d.party_two} title='Party two' />

				{property && (
					<DetailCard title='Property'>
						<DetailRow label='Property ID' value={property.id} />
						<DetailRow label='Title' value={property.title} />
						<DetailRow label='Location' value={property.location} />
						<DetailRow label='Property type' value={property.property_type} />
						{property.image && (
							<div className='pt-3'>
								<p className='text-[12px] font-semibold text-gray-600 mb-2'>
									Image
								</p>
								<img
									src={property.image}
									alt={property.title}
									className='rounded-lg w-full h-40 object-cover'
								/>
							</div>
						)}
						{property.images?.length > 0 && (
							<div className='pt-3'>
								<p className='text-[12px] font-semibold text-gray-600 mb-2'>
									Images ({property.images.length})
								</p>
								<div className='flex gap-2 overflow-x-auto pb-2'>
									{property.images.map((url, i) => (
										<img
											key={i}
											src={url}
											alt={`Property ${i + 1}`}
											className='w-24 h-24 rounded-lg object-cover shrink-0'
										/>
									))}
								</div>
							</div>
						)}
					</DetailCard>
				)}

				{terms && (
					<DetailCard title='Terms'>
						<DetailRow label='Amount' value={terms.amount} />
						<DetailRow label='Duration' value={terms.duration} />
					</DetailCard>
				)}
			</div>
		</div>
	)
}

export default AgreementDetailsView
