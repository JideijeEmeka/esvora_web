import React from 'react'
import { CreditCard, ChevronLeft, ChevronRight } from 'lucide-react'

const PaymentsView = ({ onBack, onPaymentMethodClick }) => {
	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
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

			<h2 className='text-[22px] font-semibold text-gray-900 mb-6'>
				Payments
			</h2>

			<button
				type='button'
				onClick={() => onPaymentMethodClick?.()}
				className='w-full flex items-center gap-4 py-4 px-4 rounded-xl bg-gray-50 border border-gray-100 text-left hover:bg-gray-100 transition-colors group'
			>
				<div className='shrink-0 w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors'>
					<CreditCard className='w-5 h-5 text-gray-700' />
				</div>
				<div className='flex-1 min-w-0'>
					<p className='text-[16px] font-medium text-gray-900'>
						Payment Method
					</p>
					<p className='text-[14px] text-gray-500'>
						Manage payment method
					</p>
				</div>
				<ChevronRight className='w-5 h-5 text-gray-400 shrink-0' />
			</button>
		</div>
	)
}

export default PaymentsView
