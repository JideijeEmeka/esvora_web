import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { Wifi, Home, Droplets, Car, Zap, Pen, Plus, Minus } from 'lucide-react'

const AddShortletFeaturesView = () => {
	const navigate = useNavigate()
	const [selectedFeatures, setSelectedFeatures] = useState(['Wifi', 'Furniture'])

	// Available feature options with icons
	const availableFeatures = [
		{ id: 'wifi', name: 'Wifi', icon: Wifi },
		{ id: 'furniture', name: 'Furniture', icon: Home },
		{ id: 'water', name: 'Water', icon: Droplets },
		{ id: 'parking', name: 'Parking space', icon: Car },
		{ id: 'electricity', name: 'Electricity', icon: Zap },
		{ id: 'custom', name: 'Custom', icon: Pen }
	]

	const handleAddFeature = (featureName) => {
		if (!selectedFeatures.includes(featureName)) {
			setSelectedFeatures([...selectedFeatures, featureName])
		}
	}

	const handleRemoveFeature = (featureName) => {
		setSelectedFeatures(selectedFeatures.filter((f) => f !== featureName))
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleSaveAndContinue = () => {
		// Handle form submission
		console.log('Selected features:', selectedFeatures)
		navigate('/property-owner/add-shortlet/price')
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
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-gray-200 rounded-full' />
						</div>

						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
							Property features
						</h1>

						{/* Selected Features */}
						{selectedFeatures.length > 0 && (
							<div className='space-y-3 mb-8'>
								{selectedFeatures.map((featureName) => {
									const feature = availableFeatures.find((f) => f.name === featureName)
									const Icon = feature?.icon || Home
									return (
										<div
											key={featureName}
											className='flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-full'
										>
											<span className='text-[16px] text-gray-900 font-medium'>{featureName}</span>
											<button
												type='button'
												onClick={() => handleRemoveFeature(featureName)}
												className='w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors'
											>
												<Minus className='w-4 h-4 text-gray-600' />
											</button>
										</div>
									)
								})}
							</div>
						)}

						{/* Suggested Features */}
						<div className='mb-8'>
							<div className='flex flex-wrap gap-3'>
								{availableFeatures.map((feature) => {
									const isSelected = selectedFeatures.includes(feature.name)
									const Icon = feature.icon
									return (
										<button
											key={feature.id}
											type='button'
											onClick={() => handleAddFeature(feature.name)}
											disabled={isSelected}
											className={`flex items-center gap-2 px-4 py-2 rounded-full text-[16px] font-medium transition-all ${
												isSelected
													? 'bg-gray-100 text-gray-400 cursor-not-allowed'
													: 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
											}`}
										>
											<Icon className='w-5 h-5' />
											<span>{feature.name}</span>
											{!isSelected && (
												<Plus className='w-4 h-4 text-gray-500' />
											)}
										</button>
									)
								})}
							</div>
						</div>

						{/* Action Buttons */}
						<div className='flex gap-4 mt-12'>
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

export default AddShortletFeaturesView
