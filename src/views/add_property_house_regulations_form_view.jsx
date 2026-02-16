import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { Plus, Minus } from 'lucide-react'

const AddPropertyHouseRegulationsFormView = () => {
	const navigate = useNavigate()
	const [regulations, setRegulations] = useState([
		{ id: 1, text: 'Check in at 10:00PM' },
		{ id: 2, text: 'No fighting' }
	])

	const handleAddRegulation = () => {
		const newRegulation = {
			id: Date.now(),
			text: ''
		}
		setRegulations([...regulations, newRegulation])
	}

	const handleRemoveRegulation = (id) => {
		if (regulations.length > 1) {
			setRegulations(regulations.filter((regulation) => regulation.id !== id))
		}
	}

	const handleRegulationChange = (id, value) => {
		setRegulations(
			regulations.map((regulation) =>
				regulation.id === id ? { ...regulation, text: value } : regulation
			)
		)
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleSaveAndContinue = () => {
		// Handle form submission
		console.log('Regulations:', regulations)
		navigate('/property-owner/add-property/bedrooms')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content - Centered Form */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full'>
					{/* Form Container */}
					<div className='w-full'>
						{/* Progress Indicator */}
						<div className='flex items-center gap-2 mb-8'>
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-primary rounded-full' />
						</div>

						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
							House regulations
						</h1>

						{/* Regulations List */}
						<div className='space-y-3 mb-6'>
							{regulations.map((regulation) => (
								<div
									key={regulation.id}
									className='flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full'
								>
									<input
										type='text'
										value={regulation.text}
										onChange={(e) => handleRegulationChange(regulation.id, e.target.value)}
										placeholder='Enter regulation'
										className='flex-1 bg-transparent border-none outline-none text-[16px] text-gray-900 placeholder-gray-400'
									/>
									<button
										type='button'
										onClick={() => handleRemoveRegulation(regulation.id)}
										disabled={regulations.length === 1}
										className='w-6 h-6 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors shrink-0'
									>
										<Minus className='w-4 h-4 text-gray-600' />
									</button>
								</div>
							))}
						</div>

						{/* Add Regulation Button */}
						<button
							type='button'
							onClick={handleAddRegulation}
							className='flex items-center gap-2 text-primary hover:text-purple-700 transition-colors text-[16px] font-medium mb-8'
						>
							<Plus className='w-5 h-5' />
							<span>Add +</span>
						</button>

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

export default AddPropertyHouseRegulationsFormView
