import React, { useState } from 'react'
import { ChevronLeft, CreditCard } from 'lucide-react'
import { Country } from 'country-state-city'
import paymentController from '../controllers/payment_controller'
import toast from 'react-hot-toast'

const formatCardNumber = (value) => {
	const digits = value.replace(/\D/g, '')
	const parts = []
	for (let i = 0; i < digits.length && i < 16; i++) {
		if (i > 0 && i % 4 === 0) parts.push(' ')
		parts.push(digits[i])
	}
	return parts.join('')
}

const formatExpiry = (value) => {
	const digits = value.replace(/\D/g, '')
	if (digits.length <= 2) return digits
	const mm = digits.slice(0, 2)
	const yy = digits.slice(2, 4)
	return `${mm}/${yy}`
}

const AddCardPaymentMethodView = ({ onBack, onSuccess }) => {
	const [name, setName] = useState('')
	const [number, setNumber] = useState('')
	const [expiry, setExpiry] = useState('')
	const [cvv, setCvv] = useState('')
	const [country, setCountry] = useState('')
	const [isLoading, setIsLoading] = useState(false)

	const countries = Country.getAllCountries()

	const handleNumberChange = (e) => setNumber(formatCardNumber(e.target.value))
	const handleExpiryChange = (e) => setExpiry(formatExpiry(e.target.value))
	const handleCvvChange = (e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))

	const canSubmit =
		name.trim().length > 0 &&
		number.replace(/\s/g, '').length >= 15 &&
		expiry.length >= 5 &&
		cvv.length >= 3 &&
		country.trim().length > 0

	const handleSubmit = () => {
		if (!canSubmit) return
		const cardNumber = number.replace(/\s/g, '')
		paymentController.createPaymentMethod({
			cardNumber,
			expiryDate: expiry.trim(),
			cvv: cvv.trim(),
			cardholderName: name.trim(),
			country: country.trim(),
			isDefault: true,
			setLoading: setIsLoading,
			onSuccess: () => {
				toast.success('Payment method added successfully.')
				onSuccess?.()
			},
			onError: (m) => toast.error(m ?? 'Failed to add payment method')
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

			<h2 className='text-[24px] font-bold text-gray-900 mb-2'>Add card</h2>
			<p className='text-[14px] text-gray-500 mb-8'>
				Add your card for easy payments
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
						Number
					</label>
					<div className='relative'>
						<CreditCard className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
						<input
							type='text'
							value={number}
							onChange={handleNumberChange}
							placeholder='0000 0000 0000 0000'
							maxLength={19}
							className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors'
						/>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-4'>
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
					<div>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>
							CVV
						</label>
						<input
							type='password'
							value={cvv}
							onChange={handleCvvChange}
							placeholder='000'
							maxLength={4}
							className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors'
						/>
					</div>
				</div>

				<div>
					<label className='block text-[14px] font-medium text-gray-700 mb-2'>
						Country
					</label>
					<select
						value={country}
						onChange={(e) => setCountry(e.target.value)}
						className='w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors'
					>
						<option value=''>Select country</option>
						{countries.map((c) => (
							<option key={c.isoCode} value={c.name}>
								{c.name}
							</option>
						))}
					</select>
				</div>
			</div>

			<button
				type='button'
				onClick={handleSubmit}
				disabled={!canSubmit || isLoading}
				className='w-full mt-8 py-4 rounded-xl bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
			>
				{isLoading ? 'Adding...' : 'Add card'}
			</button>
		</div>
	)
}

export default AddCardPaymentMethodView
