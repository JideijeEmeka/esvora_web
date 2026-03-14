import React, { useEffect, useState } from 'react'
import { Eye, EyeOff, HelpCircle } from 'lucide-react'

const DeleteAccountWidget = ({
	isOpen,
	onClose,
	onConfirm,
	userName = '',
	isLoading,
}) => {
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	useEffect(() => {
		if (isOpen) {
			const originalOverflow = document.body.style.overflow
			const originalPosition = document.body.style.position
			const originalTop = document.body.style.top
			const scrollY = window.scrollY

			document.body.style.overflow = 'hidden'
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'

			return () => {
				document.body.style.overflow = originalOverflow || ''
				document.body.style.position = originalPosition || ''
				document.body.style.top = originalTop || ''
				document.body.style.width = ''
				window.scrollTo(0, scrollY)
			}
		}
	}, [isOpen])

	useEffect(() => {
		if (!isOpen) setPassword('')
	}, [isOpen])

	if (!isOpen) return null

	const handleConfirm = () => {
		const p = (password ?? '').trim()
		if (!p) return
		onConfirm?.(p)
	}

	const displayName = userName ? userName.charAt(0).toLowerCase() + userName.slice(1) : 'there'

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden p-8 text-center'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Icon: purple circle + question mark */}
				<div className='flex justify-center mb-6'>
					<div className='w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center bg-primary'>
						<HelpCircle className='w-7 h-7 text-white stroke-2' />
					</div>
				</div>

				<h2 className='text-[22px] font-bold text-gray-900 mb-3'>
					Hey! {displayName}, we hate to see you go
				</h2>

				<p className='text-[15px] text-gray-600 leading-relaxed mb-6'>
					Are you sure you want to proceed with this? once done you cannot recover your account.
				</p>

				<div className='mb-6'>
					<label
						htmlFor='delete-account-password'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Enter your password
					</label>
					<div className='relative'>
						<input
							id='delete-account-password'
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder='Enter password'
							className='w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
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

				<div className='flex gap-3'>
					<button
						type='button'
						onClick={onClose}
						className='flex-1 py-3 px-6 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium text-[16px] hover:bg-gray-50 transition-colors'
					>
						No, Cancel
					</button>
					<button
						type='button'
						disabled={isLoading || !password.trim()}
						onClick={handleConfirm}
						className='flex-1 py-3 px-6 rounded-xl bg-red-600 text-white font-medium text-[16px] hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
					>
						{isLoading ? 'Deleting...' : 'Delete account'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default DeleteAccountWidget
