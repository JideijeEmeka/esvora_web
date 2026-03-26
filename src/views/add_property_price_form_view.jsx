import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { X, ChevronDown, Plus, Minus } from 'lucide-react'
import logo from '../assets/logo.png'
import { saveAddListingDraft } from '../lib/localStorage'

const RENTAGE_TYPES = [
	{ value: 'monthly', label: 'Monthly' },
	{ value: 'yearly', label: 'Yearly' },
	{ value: 'daily', label: 'Daily' },
	{ value: 'weekly', label: 'Weekly' }
]

const AddPropertyPriceFormView = () => {
	const navigate = useNavigate()
	const [rentageType, setRentageType] = useState('')
	const [rentageFee, setRentageFee] = useState('0.00')
	const [errors, setErrors] = useState({})
	const [fees, setFees] = useState([
		{ id: 1, description: 'Rentage fee', amount: '0.00' }
	])

	const handleAddFee = () => {
		const newFee = {
			id: Date.now(),
			description: '',
			amount: '0.00'
		}
		setFees([...fees, newFee])
	}

	const handleRemoveFee = (id) => {
		if (fees.length > 1) {
			setFees(fees.filter((fee) => fee.id !== id))
		}
	}

	const handleFeeChange = (id, field, value) => {
		setFees(
			fees.map((fee) => (fee.id === id ? { ...fee, [field]: value } : fee))
		)
	}

	const formatCurrency = (value) => {
		const cleaned = String(value || '').replace(/,/g, '').replace(/[^\d.]/g, '')
		const [rawInteger = '', ...rest] = cleaned.split('.')
		const integer = rawInteger.replace(/^0+(?=\d)/, '') || '0'
		const decimal = rest.join('').slice(0, 2)
		const hasDot = cleaned.includes('.')
		const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
		if (hasDot) return `${formattedInteger}.${decimal}`
		return formattedInteger
	}

	const handleRentageFeeChange = (e) => {
		const formatted = formatCurrency(e.target.value)
		setRentageFee(formatted)
		setErrors((prev) => ({ ...prev, rentageFee: '' }))
	}

	const handleFeeAmountChange = (id, value) => {
		const formatted = formatCurrency(value)
		handleFeeChange(id, 'amount', formatted)
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleClose = () => {
		navigate('/property-owner')
	}

	const handleSaveAndContinue = () => {
		const nextErrors = {}
		const parsedRentageFee = Number((rentageFee || '0').replace(/,/g, ''))
		if (!rentageType) nextErrors.rentageType = 'Rentage type is required'
		if (!parsedRentageFee || parsedRentageFee <= 0) nextErrors.rentageFee = 'Rentage fee must be greater than 0'
		setErrors(nextErrors)
		if (Object.keys(nextErrors).length > 0) return
		saveAddListingDraft('rent', { price: { rentageType, rentageFee, fees } })
		navigate('/property-owner/add-property/house-regulations')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-gray-100'>
				{/* Main Content - Centered Form */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto w-full'>
					{/* Form Container */}
					<div className='w-full'>

						{/* Form Content */}
						<div className='px-6 py-8'>
							{/* Progress Indicator */}
							<div className='flex items-center gap-2 mb-8'>
								<div className='h-2 flex-1 bg-primary rounded-full' />
								<div className='h-2 flex-1 bg-primary rounded-full' />
								<div className='h-2 flex-1 bg-primary rounded-full' />
							</div>

							{/* Heading */}
							<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
								Fees
							</h1>

							{/* Form Fields */}
							<div className='space-y-6 mb-8'>
								{/* Rentage Type */}
								<div>
									<label htmlFor='rentageType' className='block text-[16px] font-medium text-gray-900 mb-2'>
										Rentage type
									</label>
									<div className='relative'>
										<select
											id='rentageType'
											value={rentageType}
											onChange={(e) => {
												setRentageType(e.target.value)
												setErrors((prev) => ({ ...prev, rentageType: '' }))
											}}
											className={`w-full px-4 py-3 pr-10 border rounded-full text-[16px] focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
												errors.rentageType ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
											}`}
										>
											<option value=''>Select type</option>
											{RENTAGE_TYPES.map((type) => (
												<option key={type.value} value={type.value}>
													{type.label}
												</option>
											))}
										</select>
										<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
									</div>
									{errors.rentageType ? <p className='mt-1 text-sm text-red-500'>{errors.rentageType}</p> : null}
								</div>

								{/* Rentage Fee */}
								<div>
									<label htmlFor='rentageFee' className='block text-[16px] font-medium text-gray-900 mb-2'>
										Rentage fee
									</label>
									<div className='relative'>
										<span className='absolute left-4 top-1/2 -translate-y-1/2 text-[16px] text-gray-600'>
											NGN
										</span>
										<input
											type='text'
											id='rentageFee'
											value={rentageFee}
											onChange={handleRentageFeeChange}
											placeholder='0.00'
											className={`w-full pl-16 pr-4 py-3 border rounded-full text-[16px] focus:outline-none focus:ring-2 ${
												errors.rentageFee ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
											}`}
										/>
									</div>
									{errors.rentageFee ? <p className='mt-1 text-sm text-red-500'>{errors.rentageFee}</p> : null}
								</div>
							</div>

							{/* Fees Table */}
							<div className='mb-6'>
								{/* Table Headers */}
								<div className='hidden md:grid md:grid-cols-[1fr_1fr_auto] gap-4 mb-3'>
									<div className='text-[14px] font-semibold text-gray-700'>Description</div>
									<div className='text-[14px] font-semibold text-gray-700'>Amount</div>
									<div></div>
								</div>

								{/* Fee Rows */}
								<div className='space-y-3'>
									{fees.map((fee) => (
										<div key={fee.id} className='grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 md:gap-4 items-start md:items-center'>
											<div className='md:hidden text-[13px] font-semibold text-gray-700'>Description</div>
											<input
												type='text'
												value={fee.description}
												onChange={(e) => handleFeeChange(fee.id, 'description', e.target.value)}
												placeholder='Rentage fee'
												className='px-4 py-3 border border-gray-300 rounded-full text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
											/>
											<div className='md:hidden text-[13px] font-semibold text-gray-700'>Amount</div>
											<input
												type='text'
												value={fee.amount}
												onChange={(e) => handleFeeAmountChange(fee.id, e.target.value)}
												placeholder='0.00'
												className='px-4 py-3 border border-gray-300 rounded-full text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
											/>
											<div className='flex md:block justify-end'>
												<button
													type='button'
													onClick={() => handleRemoveFee(fee.id)}
													disabled={fees.length === 1}
													className='w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors'
												>
													<Minus className='w-5 h-5' />
												</button>
											</div>
										</div>
									))}
								</div>

								{/* Add Fee Button */}
								<button
									type='button'
									onClick={handleAddFee}
									className='mt-4 flex items-center gap-2 text-primary hover:text-purple-700 transition-colors text-[16px] font-medium'
								>
									<Plus className='w-5 h-5' />
									<span>Add +</span>
								</button>
							</div>

							{/* Action Buttons */}
							<div className='flex flex-col md:flex-row gap-4 mt-8'>
								<button
									type='button'
									onClick={handleBack}
									className='flex-1 border-2 border-gray-200 
									  text-gray-700 px-8 py-4 rounded-full text-[18px] font-semibold 
									  hover:bg-gray-50 hover:border-gray-300 transition-all'
								>
									Back
								</button>
								<button
									type='button'
									onClick={handleSaveAndContinue}
									className='flex-1 bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
								>
									Save & continue
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddPropertyPriceFormView
