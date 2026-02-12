import React, { useEffect } from 'react'
import { Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const RequestSubmittedWidget = ({ isOpen, onClose, onContinue }) => {
	const navigate = useNavigate()

	// Prevent body scroll when modal is open (same pattern as filter_properties_widget)
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

	const handleContinue = () => {
		if (onContinue) onContinue()
		if (onClose) onClose()
		navigate('/')
	}

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
				{/* Success icon: two-tone purple circles + checkmark */}
				<div className='flex justify-center mb-6'>
					<div className='w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center'>
						<div className='w-12 h-12 rounded-full bg-primary flex items-center justify-center'>
							<Check className='w-7 h-7 text-white stroke-3' />
						</div>
					</div>
				</div>

				<h2 className='text-[24px] font-bold text-gray-900 mb-4'>
					Request submitted
				</h2>

				<p className='text-[16px] text-gray-600 leading-relaxed mb-8'>
					Your request has been successfully submitted. Once approved, you&apos;ll be notified.
				</p>

				<button
					type='button'
					onClick={handleContinue}
					className='w-full py-3 px-6 rounded-full border border-gray-300 bg-white text-gray-900 font-medium text-[16px] hover:bg-gray-50 transition-colors'
				>
					Continue to home
				</button>
			</div>
		</div>
	)
}

export default RequestSubmittedWidget
