import React, { useState } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { kTicketEmail } from '../lib/constants'
import { validateEmail, validateRequired, validateMinLength } from '../lib/validation'
import { selectCurrentAccount } from '../redux/slices/accountSlice'

const CreateTicketView = ({ onBack }) => {
	const account = useSelector(selectCurrentAccount)
	const [name, setName] = useState(account?.fullname ?? '')
	const [email, setEmail] = useState(account?.email ?? '')
	const [subject, setSubject] = useState('')
	const [message, setMessage] = useState('')
	const [errors, setErrors] = useState({})

	const handleSubmit = (e) => {
		e.preventDefault()
		const nameResult = validateRequired(name, 'Name')
		const emailResult = validateEmail(email)
		const subjectResult = validateRequired(subject, 'Subject')
		const messageResult = validateMinLength(message, 10, 'Message')

		const newErrors = {
			name: nameResult.valid ? '' : nameResult.message,
			email: emailResult.valid ? '' : emailResult.message,
			subject: subjectResult.valid ? '' : subjectResult.message,
			message: messageResult.valid ? '' : messageResult.message
		}
		setErrors(newErrors)

		if (!nameResult.valid || !emailResult.valid || !subjectResult.valid || !messageResult.valid) {
			toast.error('Please fix the errors before submitting')
			return
		}

		const body = `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`
		const mailtoUrl = `mailto:${kTicketEmail}?subject=${encodeURIComponent(subject.trim())}&body=${encodeURIComponent(body)}`
		window.open(mailtoUrl, '_blank')
		toast.success('Opening your email app to send the ticket')
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
			{onBack && (
				<button
					type='button'
					onClick={onBack}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</button>
			)}

			<h2 className='text-[22px] font-semibold text-gray-900 mb-2'>Create a ticket</h2>
			<p className='text-[16px] text-gray-600 mb-6'>
				Fill in the form below and we&apos;ll get back to you as soon as possible.
			</p>

			<form onSubmit={handleSubmit} className='space-y-5'>
				<div>
					<label htmlFor='ticket-name' className='block text-[14px] font-medium text-gray-700 mb-2'>
						Name
					</label>
					<input
						id='ticket-name'
						type='text'
						value={name}
						onChange={(e) => {
							setName(e.target.value)
							if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
						}}
						placeholder='Your name'
						className={`w-full px-4 py-3 rounded-lg border text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
					/>
					{errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name}</p>}
				</div>

				<div>
					<label htmlFor='ticket-email' className='block text-[14px] font-medium text-gray-700 mb-2'>
						Email
					</label>
					<input
						id='ticket-email'
						type='email'
						value={email}
						onChange={(e) => {
							setEmail(e.target.value)
							if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
						}}
						placeholder='your@email.com'
						className={`w-full px-4 py-3 rounded-lg border text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
					/>
					{errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email}</p>}
				</div>

				<div>
					<label htmlFor='ticket-subject' className='block text-[14px] font-medium text-gray-700 mb-2'>
						Subject
					</label>
					<input
						id='ticket-subject'
						type='text'
						value={subject}
						onChange={(e) => {
							setSubject(e.target.value)
							if (errors.subject) setErrors((prev) => ({ ...prev, subject: '' }))
						}}
						placeholder='Brief subject'
						className={`w-full px-4 py-3 rounded-lg border text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
					/>
					{errors.subject && <p className='text-red-500 text-sm mt-1'>{errors.subject}</p>}
				</div>

				<div>
					<label htmlFor='ticket-message' className='block text-[14px] font-medium text-gray-700 mb-2'>
						Message
					</label>
					<textarea
						id='ticket-message'
						value={message}
						onChange={(e) => {
							setMessage(e.target.value)
							if (errors.message) setErrors((prev) => ({ ...prev, message: '' }))
						}}
						placeholder='Describe your issue or request...'
						rows={5}
						className={`w-full px-4 py-3 rounded-lg border text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-y ${errors.message ? 'border-red-500' : 'border-gray-300'}`}
					/>
					{errors.message && <p className='text-red-500 text-sm mt-1'>{errors.message}</p>}
				</div>

				<button
					type='submit'
					className='w-full h-12 rounded-full bg-primary text-white text-[16px] font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center'
				>
					Submit ticket
				</button>
			</form>
		</div>
	)
}

export default CreateTicketView
