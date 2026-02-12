import React from 'react'
import { X } from 'lucide-react'

const PaymentDetailsView = ({ transaction, onClose }) => {
	if (!transaction) return null

	const getStatusStyles = (statusVariant) => {
		switch (statusVariant) {
			case 'success':
				return 'bg-green-100 text-green-800'
			case 'processing':
				return 'bg-amber-100 text-amber-800'
			case 'failed':
				return 'bg-red-100 text-red-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	return (
		<>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-black/20 z-40 transition-opacity'
				onClick={onClose}
			/>

			{/* Slide-in panel */}
			<div className='fixed right-0 top-0 bottom-0 w-full max-w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto'>
				<div className='p-6'>
					{/* Header */}
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[20px] font-semibold text-gray-900'>
							Payment details
						</h2>
						<button
							type='button'
							onClick={onClose}
							className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors'
							aria-label='Close payment details'
						>
							<X className='w-5 h-5 text-gray-600' />
						</button>
					</div>

					{/* Amount and Status */}
					<div className='mb-8'>
						<div className='flex items-center justify-between mb-2'>
							<p className='text-[28px] font-bold text-gray-900'>
								{transaction.amount}
							</p>
							<span
								className={`inline-flex px-3 py-1.5 rounded-full text-[12px] font-medium ${getStatusStyles(
									transaction.statusVariant
								)}`}
							>
								{transaction.status}
							</span>
						</div>
					</div>

					{/* Payment Information */}
					<div>
						<h3 className='text-[16px] font-semibold text-gray-900 mb-4'>
							Payment Information
						</h3>

						<div className='space-y-0'>
							{/* Name */}
							<div className='py-4 border-b border-gray-200'>
								<div className='flex items-center gap-3'>
									<div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[14px] font-semibold text-gray-700 shrink-0'>
										{transaction.initials}
									</div>
									<span className='text-[14px] font-medium text-gray-900'>
										{transaction.details}
									</span>
								</div>
							</div>

							{/* Date */}
							<div className='py-4 border-b border-gray-200'>
								<p className='text-[14px] text-gray-600'>
									{transaction.fullDate || transaction.date}
									{transaction.time && `, ${transaction.time}`}
								</p>
							</div>

							{/* Category */}
							<div className='py-4'>
								<p className='text-[14px] text-gray-600'>
									{transaction.category}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default PaymentDetailsView
