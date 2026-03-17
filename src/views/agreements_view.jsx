import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Check, ArrowLeftRight, ChevronLeft, User } from 'lucide-react'
import agreementsController from '../controllers/agreements_controller'
import PullToRefresh from '../components/pull_to_refresh'
import Loader from '../components/loader'
import { selectAgreements } from '../redux/slices/agreementSlice'
import toast from 'react-hot-toast'

const AgreementsView = ({ onBack, onAgreementClick }) => {
	const agreements = useSelector(selectAgreements)
	const [isRefreshing, setIsRefreshing] = useState(false)

	const handleRefresh = () => {
		setIsRefreshing(true)
		agreementsController.listAgreements({
			setLoading: setIsRefreshing,
			onError: (m) => toast.error(m)
		})
	}

	const party1 = (a) => a?.party_one ?? {}
	const party2 = (a) => a?.party_two ?? {}
	const title = (a) => a?.agreement_type ?? 'Agreement'
	const status = (a) => a?.status ?? ''
	const date = (a) => a?.completed_at ?? ''

	return (
		<div className='space-y-6'>
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
			<h2 className='text-[22px] font-semibold text-gray-900'>
				Agreements
			</h2>

			<PullToRefresh onRefresh={handleRefresh}>
				{isRefreshing ? (
					<div className='flex justify-center py-12'>
						<Loader />
					</div>
				) : agreements.length === 0 ? (
					<p className='text-[14px] text-gray-500 py-8'>
						No agreements yet. Click the refresh button to load.
					</p>
				) : (
					<div className='space-y-4'>
						{agreements.map((agreement) => {
							const p1 = party1(agreement)
							const p2 = party2(agreement)
							const isClickable = onAgreementClick && agreement?.id
							return (
								<button
									key={agreement.id}
									type='button'
									onClick={(e) => {
										e.preventDefault()
										e.stopPropagation()
										if (isClickable) onAgreementClick(agreement.id)
									}}
									className={`block w-full text-left bg-gray-50 rounded-2xl border border-gray-200 p-6 transition-colors ${
										isClickable ? 'cursor-pointer hover:bg-gray-50/80' : ''
									}`}
								>
									<div className='flex flex-col sm:flex-row sm:items-center gap-4'>
										<div className='flex shrink-0'>
											{p1?.avatar ? (
												<img src={p1.avatar} alt={p1?.name} className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm -mr-3 z-10' />
											) : (
												<div className='w-12 h-12 rounded-full border-2 border-white shadow-sm -mr-3 z-10 bg-gray-200 flex items-center justify-center'>
													<User className='w-6 h-6 text-gray-500' />
												</div>
											)}
											{p2?.avatar ? (
												<img src={p2.avatar} alt={p2?.name} className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm z-0' />
											) : (
												<div className='w-12 h-12 rounded-full border-2 border-white shadow-sm z-0 bg-gray-200 flex items-center justify-center'>
													<User className='w-6 h-6 text-gray-500' />
												</div>
											)}
										</div>
										<div className='flex-1 min-w-0'>
											<h3 className='text-[18px] font-semibold text-gray-900 mb-2'>{title(agreement)}</h3>
											<div className='flex items-center gap-2 text-[14px] text-gray-600 mb-3'>
												{status(agreement) && (
													<span className='inline-flex items-center gap-1.5 text-green-700 font-medium'>
														<Check className='w-4 h-4 shrink-0' />
														{status(agreement)}
													</span>
												)}
												{date(agreement) && <span>{date(agreement)}</span>}
											</div>
											<div className='flex items-center gap-2 flex-wrap'>
												<span className='text-[14px] font-medium text-gray-900'>{p1?.name ?? '—'}</span>
												<ArrowLeftRight className='w-4 h-4 text-gray-400 shrink-0' />
												<span className='text-[14px] font-medium text-gray-900'>{p2?.name ?? '—'}</span>
											</div>
										</div>
									</div>
								</button>
							)
						})}
					</div>
				)}
			</PullToRefresh>
		</div>
	)
}

export default AgreementsView
