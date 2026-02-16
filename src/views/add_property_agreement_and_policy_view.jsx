import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'

const AddPropertyAgreementAndPolicyView = () => {
	const navigate = useNavigate()
	const [isAgreed, setIsAgreed] = useState(false)

	const handleBack = () => {
		navigate(-1)
	}

	const handleSubmit = () => {
		if (isAgreed) {
			// Handle final submission
			console.log('Property submitted with agreement')
			navigate('/property-owner/add-property/success')
		}
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full'>
					{/* Content Container */}
					<div className='w-full'>
						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8 text-center'>
							Agreement and Policy
						</h1>

						{/* Terms and Conditions Section */}
						<div className='mb-8'>
							<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>
								Terms and condition
							</h2>
							<div className='space-y-4 text-[16px] text-gray-700 leading-relaxed'>
								<p>
									By listing a property for rent, you confirm ownership or authorisation, agree to
									provide accurate details, and comply with local laws.
								</p>
								<p>
									Listings must include truthful information, required images, and may be removed if
									found misleading or violating platform policies.
								</p>
							</div>
						</div>

						{/* Agreement Checkbox */}
						<div className='mb-8'>
							<label className='flex items-start gap-3 cursor-pointer'>
								<input
									type='checkbox'
									checked={isAgreed}
									onChange={(e) => setIsAgreed(e.target.checked)}
									className='mt-1 w-5 h-5 rounded border-gray-300 text-white checked:bg-primary checked:border-primary focus:ring-primary cursor-pointer'
								/>
								<div className='flex-1'>
									<span className='text-[16px] font-medium text-gray-900 block'>
										Agreement policy
									</span>
									<span className='text-[14px] text-gray-500 mt-1 block'>I agree to the Terms and Condition</span>
								</div>
							</label>
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
								onClick={handleSubmit}
								disabled={!isAgreed}
								className='flex-1 bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
							>
								Submit
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddPropertyAgreementAndPolicyView
