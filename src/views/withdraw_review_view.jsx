import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Building2 } from 'lucide-react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import walletController from '../controllers/wallet_controller'
import { selectCurrentAccount } from '../redux/slices/accountSlice'

const formatAmount = (num) => {
	if (num == null || isNaN(Number(num))) return '0.00'
	return Number(num).toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const WithdrawReviewView = ({
	onBack,
	onChangeAccount,
	onWithdraw,
	preview,
	withdrawalMethod
}) => {
	const account = useSelector(selectCurrentAccount)
	const [isSubmitting, setIsSubmitting] = useState(false)

	const method = withdrawalMethod ?? {}
	const accNumber = method.account_number ?? method.accountNumber ?? '—'
	const bank = method.bank_name ?? method.bankName ?? '—'
	const accountHolderName = method.account_name ?? method.accountName ?? account?.fullname ?? '—'
	const youGet = preview?.net_amount ?? preview?.netAmount ?? 0
	const fee = preview?.fee ?? 0
	const timeText = preview?.estimated_arrival ?? preview?.estimatedArrival ?? 'Arrives in ≈24hrs'
	const amountToSubmit = preview?.net_amount ?? preview?.netAmount
	const methodId = method.id ?? method.uuid

	const handleWithdraw = () => {
		if (!methodId || !amountToSubmit || amountToSubmit <= 0 || isSubmitting) return
		setIsSubmitting(true)
		walletController.createWithdrawal({
			amount: amountToSubmit,
			withdrawalMethodUuid: methodId,
			setLoading: setIsSubmitting,
			onSuccess: () => {
				onWithdraw?.()
			},
			onError: (m) => toast.error(m ?? 'Withdrawal failed')
		})
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
			{onBack && (
				<button
					type='button'
					onClick={onBack}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</button>
			)}

			<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900 mb-8'>
				Withdrawal review
			</h2>

			{/* Account number */}
			<div className='mb-6'>
				<label className='block text-[14px] font-medium text-gray-500 mb-2'>
					Account number
				</label>
				<div className='flex items-center justify-between gap-2'>
					<div className='flex items-center gap-2'>
						<span className='text-[16px] font-medium text-gray-900'>
							{accNumber} • {bank}
						</span>
						<Building2 className='w-5 h-5 text-gray-400 shrink-0' />
					</div>
					{onChangeAccount && (
						<button
							type='button'
							onClick={onChangeAccount}
							className='flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 text-gray-700 text-[14px] font-medium hover:bg-gray-200 transition-colors'
						>
							Change
							<ChevronRight className='w-4 h-4' />
						</button>
					)}
				</div>
			</div>

			{/* Account Information */}
			<div className='mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100'>
				<h3 className='text-[14px] font-semibold text-gray-900 mb-3'>
					Account Information
				</h3>
				<dl className='space-y-2'>
					<div className='flex justify-between text-[14px]'>
						<dt className='text-gray-500'>Name</dt>
						<dd className='font-medium text-gray-900'>{accountHolderName}</dd>
					</div>
					<div className='flex justify-between text-[14px]'>
						<dt className='text-gray-500'>Service</dt>
						<dd className='font-medium text-gray-900'>Withdrawal</dd>
					</div>
				</dl>
			</div>

			{/* Payment Information */}
			<div className='mb-6 p-4 rounded-xl bg-gray-50 border border-gray-100'>
				<h3 className='text-[14px] font-semibold text-gray-900 mb-3'>
					Payment Information
				</h3>
				<dl className='space-y-2'>
					<div className='flex justify-between text-[14px]'>
						<dt className='text-gray-500'>You&apos;ll receive</dt>
						<dd className='font-medium text-gray-900'>NGN {formatAmount(youGet)}</dd>
					</div>
					<div className='flex justify-between text-[14px]'>
						<dt className='text-gray-500'>Fee</dt>
						<dd className='font-medium text-gray-900'>NGN {formatAmount(fee)}</dd>
					</div>
					<div className='flex justify-between text-[14px]'>
						<dt className='text-gray-500'>Time</dt>
						<dd className='font-medium text-gray-900'>{timeText}</dd>
					</div>
				</dl>
			</div>

			<button
				type='button'
				onClick={handleWithdraw}
				disabled={isSubmitting || !methodId}
				className='w-full bg-primary text-white px-6 py-4 rounded-xl text-[16px] font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
			>
				{isSubmitting ? 'Processing...' : 'Confirm'}
			</button>
		</div>
	)
}

export default WithdrawReviewView
