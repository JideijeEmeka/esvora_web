import React, { useState } from 'react'
import { ChevronLeft, Eye, EyeOff } from 'lucide-react'
import { validateCreatePassword } from '../lib/validation'
import toast from 'react-hot-toast'

const ChangePasswordView = ({ onBack, onSubmit, isLoading }) => {
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [showCurrent, setShowCurrent] = useState(false)
	const [showNew, setShowNew] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)

	const handleSubmit = (e) => {
		e.preventDefault()
		const curr = (currentPassword ?? '').trim()
		if (!curr) {
			toast.error('Current password is required')
			return
		}
		if (curr.length < 6) {
			toast.error('Current password must be at least 6 characters')
			return
		}
		const newValidation = validateCreatePassword(newPassword, confirmPassword)
		if (!newValidation.valid) {
			toast.error(newValidation.message)
			return
		}
		if (curr === newPassword.trim()) {
			toast.error('Current and new passwords cannot be the same')
			return
		}
		if (onSubmit) onSubmit(curr, newPassword.trim(), confirmPassword.trim())
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
						htmlFor='change-password-current'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Current password
					</label>
					<div className='relative'>
						<input
							id='change-password-current'
							type={showCurrent ? 'text' : 'password'}
							value={currentPassword}
							onChange={(e) => setCurrentPassword(e.target.value)}
							placeholder='********'
							className='w-full px-4 py-3 pr-12 rounded-full border border-gray-300 
							  text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none 
							  focus:ring-2 focus:ring-primary/20 focus:border-primary'
							autoComplete='current-password'
						/>
						<button
							type='button'
							onClick={() => setShowCurrent(!showCurrent)}
							className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors'
							title={showCurrent ? 'Hide password' : 'Show password'}
						>
							{showCurrent ? (
								<EyeOff className='w-5 h-5' />
							) : (
								<Eye className='w-5 h-5' />
							)}
						</button>
					</div>
				</div>

				<div>
					<label
						htmlFor='change-password-new'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						New password
					</label>
					<div className='relative'>
						<input
							id='change-password-new'
							type={showNew ? 'text' : 'password'}
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							placeholder='********'
							className='w-full px-4 py-3 pr-12 rounded-full border border-gray-300 
							  text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none 
							  focus:ring-2 focus:ring-primary/20 focus:border-primary'
							autoComplete='new-password'
						/>
						<button
							type='button'
							onClick={() => setShowNew(!showNew)}
							className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors'
							title={showNew ? 'Hide password' : 'Show password'}
						>
							{showNew ? (
								<EyeOff className='w-5 h-5' />
							) : (
								<Eye className='w-5 h-5' />
							)}
						</button>
					</div>
				</div>

				<div>
					<label
						htmlFor='change-password-confirm'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Re-enter new password
					</label>
					<div className='relative'>
						<input
							id='change-password-confirm'
							type={showConfirm ? 'text' : 'password'}
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder='********'
							className='w-full px-4 py-3 pr-12 rounded-full border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							autoComplete='new-password'
						/>
						<button
							type='button'
							onClick={() => setShowConfirm(!showConfirm)}
							className='absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors'
							title={showConfirm ? 'Hide password' : 'Show password'}
						>
							{showConfirm ? (
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
					disabled={isLoading}
					className='w-full py-3 rounded-full bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
				>
					{isLoading ? 'Sending verification code...' : 'Continue'}
				</button>
			</form>
		</div>
	)
}

export default ChangePasswordView
