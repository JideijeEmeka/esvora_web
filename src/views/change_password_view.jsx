import React, { useState } from 'react'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'

const ChangePasswordView = ({ onBack, onSubmit }) => {
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		if (onSubmit) onSubmit({ password, confirmPassword })
	}

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
						Back to Privacy & Security
					</button>
				</div>
			)}

			<h2 className='text-[20px] font-semibold text-gray-900 mb-6'>
				Change password
			</h2>

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div>
					<label
						htmlFor='change-password-enter'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Enter password
					</label>
					<div className='relative'>
						<input
							id='change-password-enter'
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='********'
							className='w-full px-4 py-3 pr-12 rounded-full border border-gray-300 
							  text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none 
							  focus:ring-2 focus:ring-primary/20 focus:border-primary'
							autoComplete='new-password'
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

				<div>
					<label
						htmlFor='change-password-reenter'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Re-enter password
					</label>
					<div className='relative'>
						<input
							id='change-password-reenter'
							type={showConfirmPassword ? 'text' : 'password'}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder='********'
							className='w-full px-4 py-3 pr-12 rounded-full border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							autoComplete='new-password'
						/>
						<button
							type='button'
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors'
							title={showConfirmPassword ? 'Hide password' : 'Show password'}
						>
							{showConfirmPassword ? (
								<EyeOff className='w-5 h-5' />
							) : (
								<Eye className='w-5 h-5' />
							)}
						</button>
					</div>
				</div>

				<p className='text-[14px] text-gray-600'>
					Kindly note that changing your password will automatically log you out
					of all devices signed into.
				</p>

				<button
					type='submit'
					className='w-full py-3 rounded-full bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 transition-colors'
				>
					Continue / log out all devices
				</button>
			</form>
		</div>
	)
}

export default ChangePasswordView
