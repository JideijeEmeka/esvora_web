import React, { useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

const LogoutWidget = ({ isOpen, onClose, onConfirm }) => {
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

	if (!isOpen) return null

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
					<div className='w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center'>
						<div className='w-12 h-12 rounded-full bg-primary flex items-center justify-center'>
							<HelpCircle className='w-7 h-7 text-white stroke-2' />
						</div>
					</div>
				</div>

				<h2 className='text-[22px] font-bold text-gray-900 mb-3'>
					Are you sure you want to log out?
				</h2>

				<p className='text-[15px] text-gray-600 leading-relaxed mb-8'>
					You will be logged out of this device and required to sign in to use Esvora
				</p>

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
						onClick={() => {
							onConfirm?.()
							onClose?.()
						}}
						className='flex-1 py-3 px-6 rounded-xl bg-primary text-white font-medium text-[16px] hover:bg-primary/90 transition-colors'
					>
						Log out
					</button>
				</div>
			</div>
		</div>
	)
}

export default LogoutWidget
