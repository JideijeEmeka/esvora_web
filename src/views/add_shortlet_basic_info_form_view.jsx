import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { ChevronDown } from 'lucide-react'
import { NIGERIAN_STATES_SORTED, getLocalGovernmentsByState } from '../lib/constants'
import AddressInputWithMap from '../components/address_input_with_map'
import { saveAddListingDraft } from '../lib/localStorage'

const AddShortletBasicInfoFormView = () => {
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		state: '',
		city: '',
		houseAddress: '',
		postalCode: '',
		latitude: -42.22,
		longitude: 33.636
	})
	const [availableLocalGovernments, setAvailableLocalGovernments] = useState([])
	const [errors, setErrors] = useState({})

	// Load local governments when state is selected
	useEffect(() => {
		if (formData.state) {
			const localGovernments = getLocalGovernmentsByState(formData.state)
			setAvailableLocalGovernments(localGovernments)
		} else {
			setAvailableLocalGovernments([])
			setFormData((prev) => ({ ...prev, city: '' }))
		}
	}, [formData.state])

	const handleInputChange = (field, value) => {
		setFormData((prev) => ({
			...prev,
			[field]: value
		}))
		setErrors((prev) => ({ ...prev, [field]: '' }))
	}

	const validate = () => {
		const nextErrors = {}
		if (!formData.title.trim()) nextErrors.title = 'Title is required'
		if (!formData.description.trim()) nextErrors.description = 'Description is required'
		if (!formData.state) nextErrors.state = 'State is required'
		if (!formData.city) nextErrors.city = 'City is required'
		if (!formData.houseAddress.trim()) nextErrors.houseAddress = 'House address is required'
		if (!formData.postalCode.trim()) nextErrors.postalCode = 'Postal code is required'
		setErrors(nextErrors)
		return Object.keys(nextErrors).length === 0
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleSaveAndContinue = () => {
		if (!validate()) return
		saveAddListingDraft('shortlet', { basicInfo: formData })
		navigate('/property-owner/add-shortlet/features')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content - Centered Form */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full'>
					{/* Form Container */}
					<div className='w-full'>
						{/* Progress Indicator */}
						<div className='flex items-center gap-2 mb-8'>
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-gray-200 rounded-full' />
							<div className='h-2 flex-1 bg-gray-200 rounded-full' />
						</div>

						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
							Basic Information
						</h1>

						{/* Form Fields */}
						<div className='space-y-6'>
							{/* Title */}
							<div>
								<label htmlFor='title' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Title
								</label>
								<input
									type='text'
									id='title'
									value={formData.title}
									onChange={(e) => handleInputChange('title', e.target.value)}
									placeholder='Enter property title'
									className={`w-full px-4 py-3 border rounded-full text-[16px] focus:outline-none focus:ring-2 ${
										errors.title ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
									}`}
								/>
								{errors.title ? <p className='mt-1 text-sm text-red-500'>{errors.title}</p> : null}
							</div>

							{/* Description */}
							<div>
								<label htmlFor='description' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Description
								</label>
								<input
									type='text'
									id='description'
									value={formData.description}
									onChange={(e) => handleInputChange('description', e.target.value)}
									placeholder='Describe property'
									className={`w-full px-4 py-3 border rounded-full text-[16px] focus:outline-none focus:ring-2 ${
										errors.description ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
									}`}
								/>
								{errors.description ? <p className='mt-1 text-sm text-red-500'>{errors.description}</p> : null}
							</div>

							{/* State */}
							<div>
								<label htmlFor='state' className='block text-[16px] font-medium text-gray-900 mb-2'>
									State
								</label>
								<div className='relative'>
									<select
										id='state'
										value={formData.state}
										onChange={(e) => handleInputChange('state', e.target.value)}
										className={`w-full px-4 py-3 pr-10 border rounded-full text-[16px] bg-white focus:outline-none focus:ring-2 appearance-none cursor-pointer ${
											errors.state ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
										}`}
									>
										<option value=''>Select state</option>
										{NIGERIAN_STATES_SORTED.map((stateOption) => (
											<option key={stateOption.value} value={stateOption.value}>
												{stateOption.label}
											</option>
										))}
									</select>
									<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
								</div>
								{errors.state ? <p className='mt-1 text-sm text-red-500'>{errors.state}</p> : null}
							</div>

							{/* City */}
							<div>
								<label htmlFor='city' className='block text-[16px] font-medium text-gray-900 mb-2'>
									City
								</label>
								<div className='relative'>
									<select
										id='city'
										value={formData.city}
										onChange={(e) => handleInputChange('city', e.target.value)}
										disabled={!formData.state}
										className={`w-full px-4 py-3 pr-10 border rounded-full text-[16px] bg-white focus:outline-none focus:ring-2 appearance-none cursor-pointer disabled:bg-gray-100 disabled:cursor-not-allowed ${
											errors.city ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
										}`}
									>
										<option value=''>Select city</option>
										{availableLocalGovernments.map((lgaOption) => (
											<option key={lgaOption.value} value={lgaOption.value}>
												{lgaOption.label}
											</option>
										))}
									</select>
									<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
								</div>
								{errors.city ? <p className='mt-1 text-sm text-red-500'>{errors.city}</p> : null}
							</div>

							{/* House Address */}
							<div>
								<label htmlFor='houseAddress' className='block text-[16px] font-medium text-gray-900 mb-2'>
									House address
								</label>
								<AddressInputWithMap
									value={formData.houseAddress}
									onChangeAddress={(address) => handleInputChange('houseAddress', address)}
									onChangePostalCode={(postalCode) => handleInputChange('postalCode', postalCode)}
									onLocationChange={({ latitude, longitude }) => {
										setFormData((prev) => ({ ...prev, latitude, longitude }))
									}}
								/>
								{errors.houseAddress ? <p className='mt-1 text-sm text-red-500'>{errors.houseAddress}</p> : null}
							</div>

							{/* Postal Code */}
							<div>
								<label htmlFor='postalCode' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Postal code
								</label>
								<input
									type='text'
									id='postalCode'
									value={formData.postalCode}
									onChange={(e) => handleInputChange('postalCode', e.target.value)}
									placeholder='Enter postal code'
									className={`w-full px-4 py-3 border rounded-full text-[16px] focus:outline-none focus:ring-2 ${
										errors.postalCode ? 'border-red-500 focus:ring-red-200 focus:border-red-500' : 'border-gray-300 focus:ring-primary/20 focus:border-primary'
									}`}
								/>
								{errors.postalCode ? <p className='mt-1 text-sm text-red-500'>{errors.postalCode}</p> : null}
							</div>
						</div>

						{/* Action Buttons */}
						<div className='flex gap-4 mt-8'>
							<button
								type='button'
								onClick={handleBack}
								className='flex-1 bg-white border-2 border-primary text-gray-700 px-8 py-4 rounded-full text-[18px] font-semibold hover:bg-gray-50 hover:border-purple-600 transition-all'
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
		</>
	)
}

export default AddShortletBasicInfoFormView
