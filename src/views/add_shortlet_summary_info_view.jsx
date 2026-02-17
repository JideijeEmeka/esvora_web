import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'

const AddShortletSummaryInfoView = () => {
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
			price: '$250,000.00',
			duration: '2 nights',
			from: 'Tue, Dec 25',
			to: 'Thurs, Dec 28'
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
		navigate('/property-owner/add-shortlet/basic-info')
	}

	const handleEditFeatures = () => {
		navigate('/property-owner/add-shortlet/features')
	}

	const handleEditFees = () => {
		navigate('/property-owner/add-shortlet/price')
	}

	const handleEditRegulations = () => {
		navigate('/property-owner/add-shortlet/house-regulations')
	}

	const handleEditBeddings = () => {
		navigate('/property-owner/add-shortlet/bedrooms')
	}

	const handleChangeImages = () => {
		navigate('/property-owner/add-shortlet/images')
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
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors underline'
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
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2 underline'
							>
								Edit
							</button>
						</div>

						{/* Fees Section */}
						<div>
							<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>Fees</h2>
							<InfoField label='Price' value={summaryData.fees.price} />
							<InfoField label='Duration' value={summaryData.fees.duration} />
							<div className='grid grid-cols-2 gap-4 mb-4'>
								<div>
									<label className='block text-[14px] font-medium text-gray-700 mb-2'>From</label>
									<div className='px-4 py-3 border border-primary rounded-full bg-white text-[16px] text-gray-900'>
										{summaryData.fees.from}
									</div>
								</div>
								<div>
									<label className='block text-[14px] font-medium text-gray-700 mb-2'>To</label>
									<div className='px-4 py-3 border border-primary rounded-full bg-white text-[16px] text-gray-900'>
										{summaryData.fees.to}
									</div>
								</div>
							</div>
							<button
								type='button'
								onClick={handleEditFees}
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2 underline'
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
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2 underline'
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
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors mt-2 underline'
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
											alt={`Shortlet ${index + 1}`}
											className='w-full h-full object-cover'
										/>
									</div>
								))}
							</div>
							<button
								type='button'
								onClick={handleChangeImages}
								className='text-primary hover:text-purple-700 text-[16px] font-medium transition-colors underline'
							>
								Change
							</button>
						</div>
					</div>

					{/* Navigation Buttons */}
					<div className='mt-10 flex justify-between items-center mx-auto gap-4'>
						<button
							type='button'
							onClick={handleBack}
							className='bg-white border-2 border-primary text-gray-700 px-12 py-4 rounded-full text-[18px] font-semibold hover:bg-gray-50 hover:border-purple-600 transition-all'
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

export default AddShortletSummaryInfoView
