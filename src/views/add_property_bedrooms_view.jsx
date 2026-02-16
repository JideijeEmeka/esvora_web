import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { Plus, Minus } from 'lucide-react'

const AddPropertyBedroomsView = () => {
	const navigate = useNavigate()
	const [bedrooms, setBedrooms] = useState(0)
	const [bathrooms, setBathrooms] = useState(0)
	const [beds, setBeds] = useState(0)

	const handleIncrement = (type) => {
		if (type === 'bedrooms') {
			setBedrooms((prev) => prev + 1)
		} else if (type === 'bathrooms') {
			setBathrooms((prev) => prev + 1)
		} else if (type === 'beds') {
			setBeds((prev) => prev + 1)
		}
	}

	const handleDecrement = (type) => {
		if (type === 'bedrooms') {
			setBedrooms((prev) => Math.max(0, prev - 1))
		} else if (type === 'bathrooms') {
			setBathrooms((prev) => Math.max(0, prev - 1))
		} else if (type === 'beds') {
			setBeds((prev) => Math.max(0, prev - 1))
		}
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleSaveAndContinue = () => {
		// Handle form submission
		console.log('Bedrooms data:', {
			bedrooms,
			bathrooms,
			beds
		})
		navigate('/property-owner/add-property/images')
	}

	const Counter = ({ label, value, onIncrement, onDecrement }) => {
		return (
			<div>
				<label className='block text-[16px] font-medium text-gray-900 mb-3'>
					{label}
				</label>
				<div className='flex items-center gap-4 px-4 py-3 bg-gray-50 border border-gray-300 rounded-full'>
					<button
						type='button'
						onClick={onDecrement}
						disabled={value === 0}
						className='w-8 h-8 rounded-full bg-gray-200 border border-gray-300 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors'
					>
						<Minus className='w-4 h-4 text-gray-700' />
					</button>
					<span className='flex-1 text-center text-[18px] font-semibold text-gray-900'>
						{value}
					</span>
					<button
						type='button'
						onClick={onIncrement}
						className='w-8 h-8 rounded-full bg-gray-700 hover:bg-gray-800 text-white flex items-center justify-center transition-colors'
					>
						<Plus className='w-4 h-4' />
					</button>
				</div>
			</div>
		)
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
							<div className='h-2 w-16 bg-primary rounded-full' />
							<div className='h-1 flex-1 bg-gray-200 rounded-full' />
						</div>

						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
							Bedrooms and fittings
						</h1>

						{/* Counters */}
						<div className='space-y-6 mb-8'>
							<Counter
								label='No of bedrooms'
								value={bedrooms}
								onIncrement={() => handleIncrement('bedrooms')}
								onDecrement={() => handleDecrement('bedrooms')}
							/>
							<Counter
								label='No of bathrooms'
								value={bathrooms}
								onIncrement={() => handleIncrement('bathrooms')}
								onDecrement={() => handleDecrement('bathrooms')}
							/>
							<Counter
								label='No of beds'
								value={beds}
								onIncrement={() => handleIncrement('beds')}
								onDecrement={() => handleDecrement('beds')}
							/>
						</div>

						{/* Action Buttons */}
						<div className='flex gap-4 mt-8'>
							<button
								type='button'
								onClick={handleBack}
								className='flex-1 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-[18px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all'
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

export default AddPropertyBedroomsView
