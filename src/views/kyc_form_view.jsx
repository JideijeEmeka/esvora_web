import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { ChevronLeft, ChevronDown } from 'lucide-react'

const KycFormView = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: 'example@gamail.com',
		phoneNumber: '',
		countryCode: '+234'
	})
	const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false)

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}))
	}

	const handleBack = () => {
		navigate('/kyc')
	}

	const handleContinue = () => {
		navigate('/kyc/select-id')
	}

	const formatPhoneNumber = (value) => {
		// Remove all non-digits
		const digits = value.replace(/\D/g, '')
		// Format as: 1234 5678 90
		if (digits.length <= 4) return digits
		if (digits.length <= 8) return `${digits.slice(0, 4)} ${digits.slice(4)}`
		return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8, 10)}`
	}

	const handlePhoneChange = (e) => {
		const formatted = formatPhoneNumber(e.target.value)
		handleInputChange('phoneNumber', formatted)
	}

	return (
		<>
			<Navbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col'>
				{/* Main Content - Centered Form */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full'>
					{/* Form Container */}
					<div className='w-full'>
						{/* Top Navigation */}
						<div className='flex items-center justify-between mb-8'>
							<button
								type='button'
								onClick={handleBack}
								className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors'
							>
								<ChevronLeft className='w-5 h-5' />
								<span className='text-[16px] font-medium'>Back</span>
							</button>
							<span className='text-[16px] text-gray-600'>1 Step 3</span>
						</div>

						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-2'>
							Complete your profile
						</h1>

						{/* Subtitle */}
						<p className='text-[16px] text-gray-600 mb-8'>
							Please provide your correct details
						</p>

						{/* Form Fields */}
						<div className='space-y-6'>
							{/* First Name */}
							<div>
								<label htmlFor='firstName' className='block text-[16px] font-medium text-gray-900 mb-2'>
									First name
								</label>
								<input
									type='text'
									id='firstName'
									value={formData.firstName}
									onChange={(e) => handleInputChange('firstName', e.target.value)}
									placeholder='Enter your first name'
									className='w-full px-4 py-3 border border-gray-300 rounded-full text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>

							{/* Last Name */}
							<div>
								<label htmlFor='lastName' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Last name
								</label>
								<input
									type='text'
									id='lastName'
									value={formData.lastName}
									onChange={(e) => handleInputChange('lastName', e.target.value)}
									placeholder='Enter your last name'
									className='w-full px-4 py-3 border border-gray-300 rounded-full text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>

							{/* Email Address */}
							<div>
								<label htmlFor='email' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Email address
								</label>
								<input
									type='email'
									id='email'
									value={formData.email}
									onChange={(e) => handleInputChange('email', e.target.value)}
									className='w-full px-4 py-3 border border-gray-300 rounded-full text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50'
									readOnly
								/>
							</div>

							{/* Phone Number */}
							<div>
								<label htmlFor='phoneNumber' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Phone number
								</label>
								<div className='flex gap-3'>
									{/* Country Code Dropdown */}
									<div className='relative'>
										<button
											type='button'
											onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
											className='flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-full bg-white hover:bg-gray-50 transition-colors min-w-[120px]'
										>
											<span className='text-2xl'>🇳🇬</span>
											<span className='text-[16px] text-gray-900'>{formData.countryCode}</span>
											<ChevronDown className='w-4 h-4 text-gray-500' />
										</button>
										{isCountryDropdownOpen && (
											<>
												<div
													className='fixed inset-0 z-10'
													onClick={() => setIsCountryDropdownOpen(false)}
													aria-hidden='true'
												/>
												<div className='absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-full shadow-lg z-20 max-h-60 overflow-y-auto'>
													<button
														type='button'
														onClick={() => {
															handleInputChange('countryCode', '+234')
															setIsCountryDropdownOpen(false)
														}}
														className='w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 text-left'
													>
														<span className='text-2xl'>🇳🇬</span>
														<span className='text-[16px] text-gray-900'>+234</span>
													</button>
													{/* Add more country codes as needed */}
												</div>
											</>
										)}
									</div>

									{/* Phone Number Input */}
									<input
										type='tel'
										id='phoneNumber'
										value={formData.phoneNumber}
										onChange={handlePhoneChange}
										placeholder='1234 5678 90'
										className='flex-1 px-4 py-3 border border-gray-300 rounded-full text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
									/>
								</div>
							</div>
						</div>

						{/* Continue Button */}
						<button
							type='button'
							onClick={handleContinue}
							className='w-full mt-8 bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default KycFormView
