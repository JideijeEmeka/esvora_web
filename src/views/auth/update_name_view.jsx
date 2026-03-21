import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import ButtonWidget from '../../components/button'
import toast from 'react-hot-toast'

const UpdateNameView = () => {
	const navigate = useNavigate()
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [errors, setErrors] = useState({ firstName: '', lastName: '' })

	const handleContinue = (e) => {
		e?.preventDefault()
		const first = firstName.trim()
		const last = lastName.trim()
		const newErrors = {
			firstName: !first ? 'First name is required' : '',
			lastName: !last ? 'Last name is required' : '',
		}
		setErrors(newErrors)
		if (!first || !last) {
			toast.error('Please enter your first and last name')
			return
		}
		navigate('/set-avatar', { state: { firstName: first, lastName: last } })
	}

	return (
		<div className='w-full h-screen md:fixed max-md:items-center max-md:justify-start
			flex items-center justify-center px-6 lg:px-30 pt-4 pb-8 flex-col'>
			<div className='w-[400px] max-md:w-full max-md:px-7 flex items-start justify-start'>
				<button
					type="button"
					className='bg-white text-gray-700 px-3 py-1.5 text-[14px]
						mb-2 flex items-center gap-2 hover:bg-primary/80 hover:scale-105 border border-gray-300
						transition rounded-full font-semibold hover:text-white cursor-pointer'
					onClick={() => navigate(-1)}
				>
					<ArrowLeftIcon className='w-4 h-4' /> Back
				</button>
			</div>

			<h1 className='text-[24px] font-semibold max-md:px-10 w-[400px] py-6'>
				Profile name
			</h1>

			<form
				className='w-[400px] flex flex-col max-md:px-10 max-md:w-full'
				onSubmit={handleContinue}
			>
				<label htmlFor="firstName" className='text-[16px] font-medium text-gray-500'>
					First name
				</label>
				<input
					id="firstName"
					type="text"
					placeholder="Enter first name"
					value={firstName}
					onChange={(e) => {
						setFirstName(e.target.value)
						if (errors.firstName) setErrors((prev) => ({ ...prev, firstName: '' }))
					}}
					className={`max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] mt-1.5 mb-5 border rounded-full ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
				/>
				{errors.firstName && (
					<p className="text-red-500 text-sm -mt-3 mb-2">{errors.firstName}</p>
				)}

				<label htmlFor="lastName" className='text-[16px] font-medium text-gray-500'>
					Last name
				</label>
				<input
					id="lastName"
					type="text"
					placeholder="Enter last name"
					value={lastName}
					onChange={(e) => {
						setLastName(e.target.value)
						if (errors.lastName) setErrors((prev) => ({ ...prev, lastName: '' }))
					}}
					className={`max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] mt-1.5 mb-4 border rounded-full ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
				/>
				{errors.lastName && (
					<p className="text-red-500 text-sm -mt-3 mb-2">{errors.lastName}</p>
				)}

				<ButtonWidget
					text="Continue"
					onClick={() => handleContinue()}
				/>
			</form>

			<p className='text-[16px] text-gray-400 w-[400px] mt-2 font-extralight max-md:px-10 max-md:w-full'>
				By continuing, you agree to Esvora's{' '}
				<Link to="/terms" className='text-primary font-light text-[16px] hover:underline'>
					Terms of Service
				</Link>{' '}
				and{' '}
				<Link to="/privacy" className='text-primary font-light text-[16px] hover:underline'>
					Privacy Policy
				</Link>
			</p>
		</div>
	)
}

export default UpdateNameView
