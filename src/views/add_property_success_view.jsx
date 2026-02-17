import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { Check } from 'lucide-react'
import confettiImage from '../assets/confetti.png'

const AddPropertySuccessView = () => {
	const navigate = useNavigate()

	const handleViewListing = () => {
		// Navigate to property listing/view
		navigate('/property-owner')
	}

	const handleGoHome = () => {
		navigate('/property-owner')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-6 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content - Centered */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full'>
					{/* Success Card */}
					<div className='w-[500px] h-[500px] bg-white rounded-2xl shadow-lg p-4 md:p-4 relative overflow-hidden'>
						{/* Confetti Background */}
						<div className='absolute top-0 left-0 right-0 h-30 md:h-40 overflow-hidden'>
							<img
								src={confettiImage}
								alt='Confetti'
								className='w-full h-full object-cover opacity-90'
							/>
						</div>

						{/* Content */}
						<div className='relative z-10 flex flex-col items-center pt-10 md:pt-10 pb-8'>
							{/* Success Icon */}
							<div className='w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg border-2 border-white'>
								<Check className='w-12 h-12 md:w-14 md:h-14 text-white' />
							</div>

							{/* Title */}
							<h1 className='text-[28px] md:text-[36px] font-bold text-gray-900 mb-4 text-center'>
								Submission successful
							</h1>

							{/* Descriptive Text */}
							<p className='text-[16px] md:text-[18px] text-gray-600 text-center mb-8 max-w-md leading-relaxed'>
								Your property has been successfully submitted and its live.
							</p>

							{/* Action Buttons */}
							<div className='w-full max-w-md space-y-4'>
								{/* View Listing Button */}
								<button
									type='button'
									onClick={handleViewListing}
									className='w-full bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
								>
									View listing
								</button>

								{/* Go Home Button */}
								<button
									type='button'
									onClick={handleGoHome}
									className='w-full bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-[18px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md'
								>
									Go home
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddPropertySuccessView
