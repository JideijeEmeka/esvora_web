import React from 'react'
import { ChevronLeft, CreditCard, Plus } from 'lucide-react'

const AddPaymentMethodView = ({ onBack, onAddNewCard }) => {
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
						Back to Payments
					</button>
				</div>
			)}

			<h2 className='text-[22px] font-semibold text-gray-900 mb-8 text-center'>
				Add payment method
			</h2>

			<div className='flex flex-col items-center py-8'>
				<div className='w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6'>
					<CreditCard className='w-10 h-10 text-gray-600' />
				</div>
				<p className='text-[16px] text-gray-600 text-center mb-8 max-w-sm'>
					You have not added a payment method yet,
				</p>
				<button
					type='button'
					onClick={() => onAddNewCard?.()}
					className='inline-flex items-center gap-2 py-3 px-6 rounded-full bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 transition-colors'
				>
					<Plus className='w-5 h-5' />
					Add new card
				</button>
			</div>
		</div>
	)
}

export default AddPaymentMethodView
