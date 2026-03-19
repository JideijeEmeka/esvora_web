import React, { useState, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import paymentController from '../controllers/payment_controller'
import toast from 'react-hot-toast'

const formatExpiry = (value) => {
	const digits = value.replace(/\D/g, '')
	if (digits.length <= 2) return digits
	const mm = digits.slice(0, 2)
	const yy = digits.slice(2, 4)
	return `${mm}/${yy}`
}

const getExpiryDisplay = (method) => {
	if (method?.expiry_date) return method.expiry_date
	if (method?.expiry_month && method?.expiry_year) {
		const mm = String(method.expiry_month).padStart(2, '0')
		const yy = method.expiry_year
		return yy.length >= 4 ? `${mm}/${yy.slice(-2)}` : `${mm}/${yy}`
	}
	return ''
}

const UpdateCardPaymentMethodView = ({ method, onBack, onSuccess }) => {
	const [name, setName] = useState('')
	const [expiry, setExpiry] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	useEffect(() => {
		if (method) {
			setName(method.cardholder_name ?? method.cardholderName ?? '')
			setExpiry(getExpiryDisplay(method))
		}
	}, [method])

	const handleExpiryChange = (e) => setExpiry(formatExpiry(e.target.value))

	const canSubmit = name.trim().length > 0 && expiry.length >= 5

	const handleSubmit = () => {
		if (!canSubmit || !method) return
		const id = method.id ?? method.uuid
		if (!id) return
		paymentController.updatePaymentMethod({
			id,
			expiryDate: expiry.trim(),
			cardholderName: name.trim(),
			isDefault: method.is_default ?? method.isDefault ?? false,
			setLoading: setIsLoading,
			onSuccess: () => {
				toast.success('Payment method updated successfully.')
				onSuccess?.()
			},
			onError: (m) => toast.error(m ?? 'Failed to update payment method')
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

			<h2 className='text-[24px] font-bold text-gray-900 mb-2'>Update card</h2>
			<p className='text-[14px] text-gray-500 mb-8'>
				Update your card details
			</p>

			<div className='space-y-5'>
				<div>
					<label className='block text-[14px] font-medium text-gray-700 mb-2'>
						Name
					</label>
					<input
						type='text'
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder='Name on card'
						className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors'
					/>
				</div>

				<div>
					<label className='block text-[14px] font-medium text-gray-700 mb-2'>
						Expiry date
					</label>
					<input
						type='text'
						value={expiry}
						onChange={handleExpiryChange}
						placeholder='MM/YY'
						maxLength={5}
						className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors'
					/>
				</div>
			</div>

			<button
				type='button'
				onClick={handleSubmit}
				disabled={!canSubmit || isLoading}
				className='w-full mt-8 py-4 rounded-xl bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
			>
				{isLoading ? 'Updating...' : 'Update'}
			</button>
		</div>
	)
}

export default UpdateCardPaymentMethodView
