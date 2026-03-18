import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { kPayStack, kFlutterWave } from '../lib/constants'
import walletController from '../controllers/wallet_controller'

const ChooseDepositServiceView = ({ amount, onBack, onComplete }) => {
	const [isLoading, setIsLoading] = useState(false)

	const handleSelectGateway = (gateway) => {
		const numAmount = Number(String(amount).replace(/[^\d.]/g, ''))
		if (!numAmount || numAmount <= 0) {
			toast.error('Please enter a valid amount')
			return
		}
		setIsLoading(true)
		walletController.initializeDeposit({
			amount: numAmount,
			gateway,
			setLoading: setIsLoading,
			onSuccess: ({ paymentUrl }) => {
				window.open(paymentUrl, '_blank', 'noopener,noreferrer')
				onComplete?.()
			},
			onError: (m) => toast.error(m ?? 'Failed to initialize deposit')
		})
	}

	const services = [
		{ id: kPayStack, title: 'Paystack' },
		{ id: kFlutterWave, title: 'Flutterwave' }
	]

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

			<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900 mb-2'>
				Choose deposit service
			</h2>
			<p className='text-[14px] text-gray-500 mb-8'>
				Select a payment gateway to add ₦{Number(amount).toLocaleString()} to your wallet
			</p>

			<div className='space-y-3 mb-8'>
				{services.map((service) => (
					<button
						key={service.id}
						type='button'
						onClick={() => handleSelectGateway(service.id)}
						disabled={isLoading}
						className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed'
					>
						<span className='text-[16px] font-semibold text-gray-900'>
							{service.title}
						</span>
						<ChevronRight className='w-5 h-5 text-gray-400 shrink-0' />
					</button>
				))}
			</div>

			<p className='text-[12px] text-gray-500'>
				You will be redirected to the payment page in a new tab. Complete the payment there.
			</p>
		</div>
	)
}

export default ChooseDepositServiceView
