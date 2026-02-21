import React, { useState, useRef } from 'react'
import { ChevronLeft } from 'lucide-react'
import SuccessWidget from '../components/success_widget'

const CODE_LENGTH = 4

const VerifyEmailView = ({ onBack, onSubmit, onResendCode }) => {
	const [code, setCode] = useState(Array(CODE_LENGTH).fill(''))
	const [isSuccessOpen, setIsSuccessOpen] = useState(false)
	const inputRefs = useRef([])

	const handleChange = (index, value) => {
		if (value.length > 1) {
			// Paste: take first CODE_LENGTH digits
			const digits = value.replace(/\D/g, '').slice(0, CODE_LENGTH).split('')
			const newCode = [...code]
			digits.forEach((d, i) => {
				if (index + i < CODE_LENGTH) newCode[index + i] = d
			})
			setCode(newCode)
			const next = Math.min(index + digits.length, CODE_LENGTH - 1)
			inputRefs.current[next]?.focus()
			return
		}
		const digit = value.replace(/\D/g, '')
		const newCode = [...code]
		newCode[index] = digit
		setCode(newCode)
		if (digit && index < CODE_LENGTH - 1) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		const fullCode = code.join('')
		if (fullCode.length === CODE_LENGTH) {
			if (onSubmit) onSubmit(fullCode)
			setIsSuccessOpen(true)
		}
	}

	const fullCode = code.join('')
	const canSubmit = fullCode.length === CODE_LENGTH

	return (
		<>
			<SuccessWidget
				isOpen={isSuccessOpen}
				onClose={() => setIsSuccessOpen(false)}
				title='Change successful'
				subtitle='Your email address has been successfully changed'
				buttonText='Close'
			/>
			<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
				{/* Back link */}
			<button
				type='button'
				onClick={onBack}
				className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
			>
				<ChevronLeft className='w-4 h-4' />
				Back
			</button>

			<h2 className='text-[22px] font-semibold text-gray-900 mb-2'>
				Verify email
			</h2>
			<p className='text-[14px] text-gray-600 mb-6'>
				Kindly enter the 4 digit code sent to the email you provided to complete this change.
			</p>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div className='flex gap-3 justify-center'>
					{code.map((digit, index) => (
						<input
							key={index}
							ref={(el) => (inputRefs.current[index] = el)}
							type='text'
							inputMode='numeric'
							maxLength={4}
							value={digit}
							onChange={(e) => handleChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							placeholder='--'
							className='w-14 h-14 text-center text-[20px] font-semibold rounded-xl border border-gray-300 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							aria-label={`Digit ${index + 1}`}
						/>
					))}
				</div>

				<p className='text-[14px] text-gray-600 text-center'>
					Didn&apos;t receive any code?{' '}
					<button
						type='button'
						onClick={onResendCode}
						className='text-primary font-medium underline hover:no-underline focus:outline-none'
					>
						Resend code
					</button>
				</p>

				<button
					type='submit'
					disabled={!canSubmit}
					className='w-full py-3 rounded-xl bg-primary text-white font-semibold 
					  text-[16px] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
				>
					Submit
				</button>
			</form>
			</div>
		</>
	)
}

export default VerifyEmailView
