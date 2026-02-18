import React, { useState } from 'react'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'

const ChangePhoneNumberView = ({ onBack, onSave }) => {
	const [phone, setPhone] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)

	const handleSave = (e) => {
		e.preventDefault()
		if (onSave) onSave({ phone, password })
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
			{/* Back link */}
			<button
				type='button'
				onClick={onBack}
				className='flex items-center gap-2 text-[14px] font-medium text-gray-600
				 hover:text-gray-900 mb-6 transition-colors'
			>
				<ChevronLeft className='w-4 h-4' />
				Back
			</button>

			<h2 className='text-[22px] font-semibold text-gray-900 mb-6'>
				Change phone number
			</h2>

			<form onSubmit={handleSave} className='space-y-6'>
				<div>
					<label
						htmlFor='change-phone-new'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Enter a new phone number
					</label>
					<input
						id='change-phone-new'
						type='tel'
						value={phone}
						onChange={(e) => setPhone(e.target.value)}
						placeholder='Enter phone number'
						className='w-full px-4 py-3 rounded-full border border-gray-300
						text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
						autoComplete='tel'
					/>
				</div>

				<div>
					<label
						htmlFor='change-phone-password'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Enter your password
					</label>
					<div className='relative'>
						<input
							id='change-phone-password'
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Enter password'
							className='w-full px-4 py-3 pr-12 rounded-full border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							autoComplete='current-password'
						/>
						<button
							type='button'
							onClick={() => setShowPassword(!showPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors'
							title={showPassword ? 'Hide password' : 'Show password'}
						>
							{showPassword ? (
								<EyeOff className='w-5 h-5' />
							) : (
								<Eye className='w-5 h-5' />
							)}
						</button>
					</div>
				</div>

				<button
					type='submit'
					className='w-full py-3 rounded-full bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 transition-colors'
				>
					Save changes
				</button>
			</form>
		</div>
	)
}

export default ChangePhoneNumberView
