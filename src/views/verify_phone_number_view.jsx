import React, { useState, useRef, useEffect } from 'react'
import { ChevronLeft } from 'lucide-react'
import SuccessWidget from '../components/success_widget'

const DEFAULT_CODE_LENGTH = 4
const TIMER_SECONDS = 60

const DEFAULT_SUCCESS = {
	title: 'Change successful',
	subtitle: 'Your phone number has been successfully changed',
	buttonText: 'Close'
}

const VerifyPhoneNumberView = ({
	onBack,
	onSubmit,
	onResendCode,
	onSubmitLoading,
	onResendLoading,
	backLabel = 'Back',
	codeLength = DEFAULT_CODE_LENGTH,
	verificationTitle = 'Verify phone number',
	verificationSubtitle,
	successTitle = DEFAULT_SUCCESS.title,
	successSubtitle = DEFAULT_SUCCESS.subtitle,
	successButtonText = DEFAULT_SUCCESS.buttonText,
	onSuccessClose,
	showTimer = false,
}) => {
	const [code, setCode] = useState(Array(codeLength).fill(''))
	const [isSuccessOpen, setIsSuccessOpen] = useState(false)
	const [timerSeconds, setTimerSeconds] = useState(showTimer ? TIMER_SECONDS : 0)
	const inputRefs = useRef([])

	useEffect(() => {
		if (!showTimer || timerSeconds <= 0) return
		const id = setInterval(() => {
			setTimerSeconds((s) => (s <= 1 ? 0 : s - 1))
		}, 1000)
		return () => clearInterval(id)
	}, [showTimer, timerSeconds])

	const canResend = timerSeconds === 0 && !onResendLoading

	const handleChange = (index, value) => {
		if (value.length > 1) {
			const digits = value.replace(/\D/g, '').slice(0, codeLength).split('')
			const newCode = [...code]
			digits.forEach((d, i) => {
				if (index + i < codeLength) newCode[index + i] = d
			})
			setCode(newCode)
			const next = Math.min(index + digits.length, codeLength - 1)
			inputRefs.current[next]?.focus()
			return
		}
		const digit = value.replace(/\D/g, '')
		const newCode = [...code]
		newCode[index] = digit
		setCode(newCode)
		if (digit && index < codeLength - 1) {
			inputRefs.current[index + 1]?.focus()
		}
	}

	const handleKeyDown = (index, e) => {
		if (e.key === 'Backspace' && !code[index] && index > 0) {
			inputRefs.current[index - 1]?.focus()
		}
	}

	const handleResendClick = () => {
		if (!canResend || !onResendCode) return
		onResendCode()
		if (showTimer) setTimerSeconds(TIMER_SECONDS)
	}

	const handleSubmit = async (e) => {
		e.preventDefault()
		const fullCode = code.join('')
		if (fullCode.length !== codeLength) return
		try {
			const result = onSubmit?.(fullCode)
			if (result && typeof result.then === 'function') {
				await result
			}
			setIsSuccessOpen(true)
		} catch {
			// Error already shown by parent - clear invalid OTP
			setCode(Array(codeLength).fill(''))
			inputRefs.current[0]?.focus()
		}
	}

	const fullCode = code.join('')
	const canSubmit = fullCode.length === codeLength

	return (
		<>
			<SuccessWidget
				isOpen={isSuccessOpen}
				onClose={() => {
					setIsSuccessOpen(false)
					onSuccessClose?.()
				}}
				title={successTitle}
				subtitle={successSubtitle}
				buttonText={successButtonText}
			/>
			<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
				{onBack && (
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						{backLabel}
					</button>
				)}

				<h2 className='text-[22px] font-semibold text-gray-900 mb-2'>
					{verificationTitle}
				</h2>
				<p className='text-[14px] text-gray-600 mb-6'>
					{verificationSubtitle ?? `Kindly enter the ${codeLength} digit code sent to the phone number you provided to complete this change.`}
				</p>

				{showTimer && (
					<p className='text-[14px] text-gray-600 mb-4'>
						{timerSeconds > 0
							? `Resend code in ${timerSeconds}s`
							: 'You can resend the code now'}
					</p>
				)}

				<form onSubmit={handleSubmit} className='space-y-6'>
					<div className='flex gap-2 sm:gap-3 justify-center flex-wrap'>
						{code.map((digit, index) => (
							<input
								key={index}
								ref={(el) => (inputRefs.current[index] = el)}
								type='text'
								inputMode='numeric'
								maxLength={1}
								value={digit}
								onChange={(e) => handleChange(index, e.target.value)}
								onKeyDown={(e) => handleKeyDown(index, e)}
								placeholder=''
								className={`${codeLength > 4 ? 'w-11 h-12 sm:w-12 sm:h-12' : 'w-14 h-14'} text-center text-[18px] sm:text-[20px] font-semibold rounded-xl border border-gray-300 text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary`}
								aria-label={`Digit ${index + 1}`}
							/>
						))}
					</div>

					<p className='text-[14px] text-gray-600 text-center'>
						Didn&apos;t receive any code?{' '}
						<button
							type='button'
							disabled={!canResend}
							onClick={handleResendClick}
							className='text-primary font-medium underline hover:no-underline focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline'
						>
							{onResendLoading ? 'Resending...' : 'Resend code'}
						</button>
					</p>

					<button
						type='submit'
						disabled={!canSubmit || onSubmitLoading}
						className='w-full py-3 rounded-full bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
					>
						{onSubmitLoading ? 'Submitting...' : 'Submit'}
					</button>
				</form>
			</div>
		</>
	)
}

export default VerifyPhoneNumberView
