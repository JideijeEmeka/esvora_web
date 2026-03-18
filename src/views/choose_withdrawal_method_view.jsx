import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, Building2, Plus, RefreshCw, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { selectWithdrawalMethods } from '../redux/slices/walletSlice'
import walletController from '../controllers/wallet_controller'
import Loader from '../components/loader'

const ChooseWithdrawalMethodView = ({ onBack, onSelectMethod, onAddNew, onEditMethod }) => {
	const methods = useSelector(selectWithdrawalMethods)
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		walletController.getWithdrawalMethods({
			setLoading: setIsLoading,
			forceRefetch: true,
			onError: () => {}
		})
	}, [])

	const handleRefresh = () => {
		setIsLoading(true)
		walletController.getWithdrawalMethods({
			setLoading: setIsLoading,
			forceRefetch: true,
			onError: () => {}
		})
	}

	const [deleteMethod, setDeleteMethod] = useState(null)

	const handleDeleteClick = (method, e) => {
		e.stopPropagation()
		setDeleteMethod(method)
	}

	const handleEditClick = (method, e) => {
		e.stopPropagation()
		onEditMethod?.(method)
	}

	const handleConfirmDelete = () => {
		const methodId = deleteMethod?.id ?? deleteMethod?.uuid
		if (!methodId) return
		const toDelete = deleteMethod
		setDeleteMethod(null)
		walletController.deleteWithdrawalMethod({
			methodId,
			onSuccess: () => toast.success('Withdrawal method deleted'),
			onError: (m) => toast.error(m ?? 'Failed to delete withdrawal method')
		})
	}

	const handleCancelDelete = () => setDeleteMethod(null)

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

			<div className='flex items-start justify-between gap-4 mb-8'>
				<div>
					<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900 mb-2'>
						Choose withdrawal method
					</h2>
					<p className='text-[14px] text-gray-500'>
						Select a saved bank account or add a new one
					</p>
				</div>
				<button
					type='button'
					onClick={handleRefresh}
					disabled={isLoading}
					className='p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors shrink-0'
					aria-label='Refresh'
				>
					<RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
				</button>
			</div>

			{isLoading && methods.length === 0 ? (
				<div className='flex justify-center py-16'>
					<Loader />
				</div>
			) : methods.length === 0 ? (
				<div className='text-center py-12 mb-6'>
					<p className='text-[14px] text-gray-500 mb-6'>
						You don&apos;t have any withdrawal methods yet.<br />
						Add one below to get started.
					</p>
				</div>
			) : (
				<div className='space-y-3 mb-8'>
					{methods.map((method) => (
						<div
							key={method.id ?? method.uuid}
							className='w-full flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-colors'
						>
							<button
								type='button'
								onClick={() => onSelectMethod?.(method)}
								className='flex-1 flex items-center gap-4 min-w-0 text-left'
							>
								<div className='w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0'>
									<Building2 className='w-6 h-6 text-primary' />
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-[16px] font-semibold text-gray-900'>
										Bank transfer
									</p>
									<p className='text-[13px] text-gray-500 truncate'>
										{method.account_number ?? method.accountNumber ?? '••••'} · {method.bank_name ?? method.bankName ?? ''} · {method.account_name ?? method.accountName ?? ''}
									</p>
									<p className='text-[13px] text-gray-500'>
										Arrives in &lt;24hrs
									</p>
								</div>
							</button>
							<div className='flex items-center gap-1 shrink-0'>
								{onEditMethod && (
									<button
										type='button'
										onClick={(e) => handleEditClick(method, e)}
										className='p-2 rounded-lg hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors'
										aria-label='Edit'
									>
										<Pencil className='w-4 h-4' />
									</button>
								)}
								<button
									type='button'
									onClick={(e) => handleDeleteClick(method, e)}
									className='p-2 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 transition-colors'
									aria-label='Delete'
								>
									<Trash2 className='w-4 h-4' />
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Delete confirmation modal */}
			{deleteMethod && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40'>
					<div className='bg-white rounded-2xl p-6 max-w-md w-full shadow-xl'>
						<h3 className='text-[18px] font-semibold text-gray-900 mb-2'>
							Delete withdrawal method
						</h3>
						<p className='text-[14px] text-gray-600 mb-6'>
							Are you sure you want to delete this withdrawal method?
						</p>
						<div className='flex gap-3 justify-end'>
							<button
								type='button'
								onClick={handleCancelDelete}
								className='px-4 py-2 rounded-xl text-[14px] font-medium text-gray-700 hover:bg-gray-100 transition-colors'
							>
								Cancel
							</button>
							<button
								type='button'
								onClick={handleConfirmDelete}
								className='px-4 py-2 rounded-xl text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-colors'
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}

			<button
				type='button'
				onClick={onAddNew}
				className='w-full flex items-center justify-center gap-2 py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors font-medium'
			>
				<Plus className='w-5 h-5' />
				Add new
			</button>
		</div>
	)
}

export default ChooseWithdrawalMethodView
