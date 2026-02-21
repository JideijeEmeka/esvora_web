import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'

const WithdrawMoneyView = ({
	onBack,
	onContinue,
	availableBalance = '350.00',
	defaultAmount = ''
}) => {
	const [amount, setAmount] = useState(defaultAmount)
	const [isFocused, setIsFocused] = useState(false)
	const inputRef = useRef(null)

	const suggestedAmounts = ['50', '200', '400', '1000']

	const formatAmount = (value) => {
		const cleaned = value.replace(/[^\d,]/g, '')
		const numbers = cleaned.replace(/,/g, '')
		if (numbers === '') return ''
		return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}

	const handleAmountChange = (e) => {
		setAmount(formatAmount(e.target.value))
	}

	const handleSuggestedAmountClick = (suggestedAmount) => {
		setAmount(formatAmount(suggestedAmount))
		inputRef.current?.focus()
	}

	const handleContinue = () => {
		const numericAmount = amount.replace(/,/g, '')
		if (numericAmount && parseFloat(numericAmount) > 0) {
			onContinue?.(numericAmount)
		}
	}

	useEffect(() => {
		inputRef.current?.focus()
	}, [])

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

			<label
				htmlFor='withdraw-amount-input'
				className='block text-[16px] font-semibold text-gray-900 mb-4'
			>
				Enter amount to withdraw
			</label>

			<div className='mb-4'>
				<div className='relative flex items-center'>
					<span className='text-[48px] font-bold text-gray-900 pointer-events-none mr-2'>
						₦
					</span>
					<div className='flex-1 relative'>
						<input
							ref={inputRef}
							id='withdraw-amount-input'
							type='text'
							value={amount}
							onChange={handleAmountChange}
							onFocus={() => setIsFocused(true)}
							onBlur={() => setIsFocused(false)}
							placeholder='0'
							className='w-full py-2 text-[48px] font-bold text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent border-none'
							aria-label='Enter amount to withdraw'
						/>
						{isFocused && (
							<span className='absolute right-0 top-1/2 -translate-y-1/2 text-[48px] font-bold text-gray-400 pointer-events-none animate-pulse'>
								|
							</span>
						)}
					</div>
				</div>
			</div>

			<div className='mb-6'>
				<p className='text-[14px] text-gray-500'>
					Available Bal: <span className='font-medium text-gray-700'>{availableBalance}</span>
				</p>
			</div>

			<div className='flex flex-wrap gap-2 mb-8'>
				{suggestedAmounts.map((suggestedAmount) => (
					<button
						key={suggestedAmount}
						type='button'
						onClick={() => handleSuggestedAmountClick(suggestedAmount)}
						className='px-4 py-2 rounded-lg border border-gray-300 bg-white text-[14px] font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 transition-colors'
					>
						₦{suggestedAmount}
					</button>
				))}
			</div>

			<button
				type='button'
				onClick={handleContinue}
				disabled={!amount || amount.replace(/,/g, '') === '0'}
				className='w-full bg-primary text-white px-6 py-4 rounded-full text-[16px] font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
			>
				Continue
			</button>
		</div>
	)
}

export default WithdrawMoneyView
