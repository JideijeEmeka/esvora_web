import React from 'react'
import { X } from 'lucide-react'

const formatAmount = (num) => {
	if (num == null || isNaN(Number(num))) return '—'
	return `₦${Number(num).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const WithdrawalTransactionDetailsView = ({ withdrawal, onClose, elevated }) => {
	if (!withdrawal) return null

	const w = withdrawal
	const method = w.withdrawal_method ?? w.withdrawalMethod ?? {}
	const bank = w.bank_details ?? method ?? {}
	const amount = formatAmount(w.amount ?? w.net_amount ?? w.netAmount)
	const status = (w.status ?? '').charAt(0).toUpperCase() + (w.status ?? '').slice(1)
	const s = (w.status ?? '').toLowerCase()
	const isSuccess = s.includes('success') || s === 'completed'

	return (
		<>
			<div
				className={`fixed inset-0 bg-black/20 transition-opacity ${elevated ? 'z-[60]' : 'z-40'}`}
				onClick={onClose}
			/>
			<div className={`fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${elevated ? 'z-[70]' : 'z-50'}`}>
				<div className='p-6'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[20px] font-semibold text-gray-900'>Withdrawal details</h2>
						<button type='button' onClick={onClose} className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100' aria-label='Close'>
							<X className='w-5 h-5 text-gray-600' />
						</button>
					</div>

					<div className='mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100'>
						<p className='text-[28px] font-bold text-gray-900'>{amount}</p>
						<span className={`inline-flex mt-2 px-3 py-1 rounded-full text-[12px] font-medium ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
							{status}
						</span>
					</div>

					<div className='space-y-4'>
						<div>
							<h3 className='text-[14px] font-semibold text-gray-900 mb-2'>Withdrawal information</h3>
							<dl className='space-y-2 text-[14px]'>
								<div className='flex justify-between'><dt className='text-gray-500'>Fee</dt><dd className='font-medium'>{formatAmount(w.fee)}</dd></div>
								<div className='flex justify-between'><dt className='text-gray-500'>Net amount</dt><dd className='font-medium'>{formatAmount(w.net_amount ?? w.netAmount)}</dd></div>
								{w.reference && <div className='flex justify-between'><dt className='text-gray-500'>Reference</dt><dd className='font-medium'>{w.reference}</dd></div>}
								{w.estimated_arrival && <div className='flex justify-between'><dt className='text-gray-500'>Est. arrival</dt><dd className='font-medium'>{w.estimated_arrival}</dd></div>}
							</dl>
						</div>

						<div>
							<h3 className='text-[14px] font-semibold text-gray-900 mb-2'>Bank details</h3>
							<dl className='space-y-2 text-[14px]'>
								<div className='flex justify-between'><dt className='text-gray-500'>Account</dt><dd className='font-medium'>{bank.account_number ?? bank.accountNumber ?? '—'}</dd></div>
								<div className='flex justify-between'><dt className='text-gray-500'>Bank</dt><dd className='font-medium'>{bank.bank_name ?? bank.bankName ?? method.bank_name ?? method.bankName ?? '—'}</dd></div>
								<div className='flex justify-between'><dt className='text-gray-500'>Name</dt><dd className='font-medium'>{bank.account_name ?? bank.accountName ?? method.account_name ?? method.accountName ?? '—'}</dd></div>
							</dl>
						</div>

						{(w.created_at || w.updated_at) && (
							<div>
								<h3 className='text-[14px] font-semibold text-gray-900 mb-2'>Date</h3>
								<p className='text-[14px] text-gray-600'>{w.created_at || w.updated_at}</p>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default WithdrawalTransactionDetailsView
