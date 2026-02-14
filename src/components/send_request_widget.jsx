import React, { useEffect, useState } from 'react'
import { X, ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import Divider from './divider'

const URGENCY_OPTIONS = [
	{ value: '', label: 'Select choice' },
	{ value: 'low', label: 'Low' },
	{ value: 'medium', label: 'Medium' },
	{ value: 'high', label: 'High' }
]

const SendRequestWidget = ({ isOpen, onClose, property, onSubmit }) => {
	const [fullName, setFullName] = useState('Osaite Emmanuel')
	const [email, setEmail] = useState('emmanuelosaite@gmail.com')
	const [phone, setPhone] = useState('09025471033')
	const [urgency, setUrgency] = useState('')
	const [message, setMessage] = useState('Hello')

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

	const image = property?.images?.[0] ?? property?.image ?? ''
	const price = property?.price ?? ''
	const title = property?.title ?? property?.description ?? ''
	const location = property?.location ?? property?.fullAddress ?? ''
	const about = property?.about ?? 'A modern 3-bedroom home with spacious living areas, a fully equipped kitchen, and two bathrooms. Features include ample natural light, tiled floors, and built-in wardrobes.'

	const handleSubmit = (e) => {
		e.preventDefault()
		if (onSubmit) onSubmit({ fullName, email, phone, urgency, message })
		if (onClose) onClose()
	}

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6'>
					<h2 className='text-[24px] font-bold text-gray-900'>Send request</h2>
					<button
						type='button'
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
					>
						<X className='w-5 h-5 text-gray-700' />
					</button>
				</div>

				<div className='px-6 mb-6'>
					{/* Property section */}
					<div className='flex gap-4 mb-6'>
						<div className='shrink-0 w-[200px] h-[120px] rounded-lg overflow-hidden bg-gray-100'>
							{image ? (
								<img src={image} alt={title} className='w-full h-full object-cover' />
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-400 text-[12px]'>No image</div>
							)}
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-[20px] font-bold text-gray-900'>{price}</p>
							<p className='text-[14px] text-gray-700 mt-1'>{title}</p>
							<p className='text-[14px] text-gray-500 mt-1'>{location}</p>
						</div>
					</div>

					<div className='mb-6'>
						<Divider />
					   <p className='text-[14px] text-gray-600 py-4 leading-relaxed'>{about}</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-[14px] font-medium text-gray-700 mb-2'>Full name</label>
								<input
									type='text'
									value={fullName}
									onChange={(e) => setFullName(e.target.value)}
									className='w-full px-4 py-3 border border-gray-300 
									   rounded-full bg-gray-50 text-[14px] focus:outline-none 
									   focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>
							<div>
								<label className='block text-[14px] font-medium text-gray-700 mb-2'>Email address</label>
								<input
									type='email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									className='w-full px-4 py-3 border border-gray-300 
									   rounded-full bg-gray-50 text-[14px] focus:outline-none 
									   focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>
						</div>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-[14px] font-medium text-gray-700 mb-2'>Phone number</label>
								<input
									type='tel'
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									className='w-full px-4 py-3 border border-gray-300 
									   rounded-full bg-gray-50 text-[14px] focus:outline-none 
									   focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>
							<div>
								<label className='block text-[14px] font-medium text-gray-700 mb-2'>How urgent?</label>
								<div className='relative'>
									<select
										value={urgency}
										onChange={(e) => setUrgency(e.target.value)}
										className='w-full px-4 py-3 pr-10 border border-gray-300 r
										 ounded-full bg-gray-50 text-[14px] focus:outline-none 
										 focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none'
									>
										{URGENCY_OPTIONS.map((opt) => (
											<option key={opt.value || 'placeholder'} value={opt.value}>{opt.label}</option>
										))}
									</select>
									<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
								</div>
							</div>
						</div>
						<div>
							<label className='block text-[14px] font-medium text-gray-700 mb-2'>Message</label>
							<textarea
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								rows={4}
								className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none'
							/>
						</div>

						{/* Terms */}
						<p className='text-[14px] text-gray-600'>
							By submitting this information, you agree to Esvora&apos;s{' '}
							<Link to='#' className='text-primary underline hover:no-underline'>Terms of Service</Link>
							{' '}and{' '}
							<Link to='#' className='text-primary underline hover:no-underline'>Privacy Policy</Link>.
						</p>

						{/* Actions */}
						<div className='flex gap-3 pt-4'>
							<button
								type='button'
								onClick={onClose}
								className='flex-1 px-4 py-3 rounded-full border-2 border-primary
								    bg-white text-primary font-medium text-[16px] hover:bg-primary/5 transition-colors'
							>
								Cancel
							</button>
							<button
								type='submit'
								className='flex-1 px-4 py-3 rounded-full bg-primary text-white 
								font-medium text-[16px] hover:bg-primary/90 transition-colors'
							>
								Send request
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default SendRequestWidget
