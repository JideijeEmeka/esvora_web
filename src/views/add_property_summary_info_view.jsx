import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'

const AddPropertySummaryInfoView = () => {
	const navigate = useNavigate()

	// Sample data - in a real app, this would come from context/state management
	const summaryData = {
		basicInfo: {
			title: '3 Bedroom Bungalow Apartment',
			description: 'A well furnished modern luxury, 3 bed room apartment',
			state: 'Lagos',
			city: 'Ikeja',
			houseAddress: '23, Nextville Crescent Avenue, Ikeja, Lagos',
			postalCode: '300254'
		},
		features: ['Wifi', 'Furniture'],
		fees: {
			rentageType: 'Annually',
			rentageFee: '$250,000.00',
			otherFees: [
				{ description: 'Rentage fee', amount: '₦ 200,000.00' },
				{ description: 'Security fee', amount: '₦ 2,000.00' },
				{ description: 'Electricity fee', amount: '₦ 10,000.00' }
			],
			total: '$300,000.00'
		},
		regulations: ['Check in at 10:00PM', 'No fighting'],
		beddings: {
			bedrooms: 3,
			bathrooms: 2,
			beds: 2
		},
		images: [
			'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
			'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'
		]
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleContinue = () => {
		navigate('/property-owner/add-property/agreement')
	}

	const handleEditBasicInfo = () => {
		navigate('/property-owner/add-property/basic-info')
	}

	const handleEditFeatures = () => {
		navigate('/property-owner/add-property/features')
	}

	const handleEditFees = () => {
		navigate('/property-owner/add-property/price')
	}

	const handleEditRegulations = () => {
		navigate('/property-owner/add-property/house-regulations')
	}

	const handleEditBeddings = () => {
		navigate('/property-owner/add-property/bedrooms')
	}

	const handleChangeImages = () => {
		navigate('/property-owner/add-property/images')
	}

	const InfoField = ({ label, value }) => (
		<div className='mb-4'>
			<label className='block text-[14px] font-medium text-gray-700 mb-2'>{label}</label>
			<div className='px-4 py-3 border border-primary rounded-full bg-white text-[16px] text-gray-900'>
				{value}
			</div>
		</div>
	)

	const InfoTag = ({ value }) => (
		<div className='px-4 py-3 border border-primary rounded-full bg-white text-[16px] text-gray-900 mb-3'>
			{value}
		</div>
	)

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content */}
				<div className='flex-1 flex flex-col max-w-4xl mx-auto w-full'>
					{/* Heading */}
					<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8 text-center'>
						Summary information
					</h1>

					<div className='space-y-8'>
						{/* Basic Information Section */}
						<div>
							<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>Basic information</h2>
							<InfoField label='Title' value={summaryData.basicInfo.title} />
							<InfoField label='Description' value={summaryData.basicInfo.description} />
							<InfoField label='State' value={summaryData.basicInfo.state} />
							<InfoField label='City' value={summaryData.basicInfo.city} />
							<InfoField label='House address' value={summaryData.basicInfo.houseAddress} />
							<InfoField label='Postal code' value={summaryData.basicInfo.postalCode} />
							<button
								type='button'
								onClick={handleEditBasicInfo}
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors'
							>
								Edit
							</button>
						</div>

						{/* Property Features Section */}
						<div>
							<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>Property features</h2>
							<div className='space-y-3'>
								{summaryData.features.map((feature, index) => (
									<InfoTag key={index} value={feature} />
								))}
							</div>
							<button
								type='button'
								onClick={handleEditFeatures}
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2'
							>
								Edit
							</button>
						</div>

						{/* Fees Section */}
						<div>
							<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>Fees</h2>
							<InfoField label='Rentage type' value={summaryData.fees.rentageType} />
							<InfoField label='Rentage fee' value={summaryData.fees.rentageFee} />
							<div className='mt-4'>
								<div className='flex justify-between items-center mb-3'>
									<h3 className='text-[16px] font-semibold text-gray-900'>Other fees</h3>
									<span className='text-[14px] text-gray-600'>Amount</span>
								</div>
								{summaryData.fees.otherFees.map((fee, index) => (
									<InfoField key={index} label={fee.description} value={fee.amount} />
								))}
							</div>
							<div className='mt-4'>
								<label className='block text-[14px] font-medium text-gray-700 mb-2'>Total</label>
								<div className='px-4 py-3 border border-gray-300 rounded-full bg-gray-100 text-[16px] text-gray-900 font-semibold'>
									{summaryData.fees.total}
								</div>
							</div>
							<button
								type='button'
								onClick={handleEditFees}
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2'
							>
								Edit
							</button>
						</div>

						{/* House Regulations Section */}
						<div>
							<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>House regulations</h2>
							<div className='space-y-3'>
								{summaryData.regulations.map((regulation, index) => (
									<InfoTag key={index} value={regulation} />
								))}
							</div>
							<button
								type='button'
								onClick={handleEditRegulations}
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2'
							>
								Edit
							</button>
						</div>

						{/* Beddings and Fittings Section */}
						<div>
							<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>Beddings and fittings</h2>
							<InfoField label='No of bedrooms' value={summaryData.beddings.bedrooms.toString()} />
							<InfoField label='No of bathrooms' value={summaryData.beddings.bathrooms.toString()} />
							<InfoField label='No of beds' value={summaryData.beddings.beds.toString()} />
							<button
								type='button'
								onClick={handleEditBeddings}
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2'
							>
								Edit
							</button>
						</div>

						{/* Images Section */}
						<div>
							<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>Images</h2>
							<div className='grid grid-cols-3 gap-4 mb-4'>
								{summaryData.images.map((image, index) => (
									<div key={index} className='aspect-square rounded-lg overflow-hidden'>
										<img
											src={image}
											alt={`Property ${index + 1}`}
											className='w-full h-full object-cover'
										/>
									</div>
								))}
							</div>
							<div className='flex items-center justify-between'>
								<button
									type='button'
									onClick={handleChangeImages}
									className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors'
								>
									Change
								</button>
							</div>
						</div>
					</div>

					{/* Continue Button */}
					<div className='mt-10 flex justify-between items-center mx-auto gap-4'>
					<button
									type='button'
									onClick={handleBack}
									className='text-gray-700 hover:text-gray-900 border border-gray-500 px-12 py-4 rounded-full text-[16px] font-medium transition-colors'
								>
									Back
								</button>
						<button
							type='button'
							onClick={handleContinue}
							className='bg-primary text-white px-12 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddPropertySummaryInfoView
