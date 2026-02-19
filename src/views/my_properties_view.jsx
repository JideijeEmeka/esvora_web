import React, { useState } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import {
	Heart,
	ChevronLeft,
	ChevronRight,
	MapIcon,
	Share2,
	Calendar,
	Star,
	Check,
	Wifi,
	Home,
	Zap,
	Fence,
	Droplets,
	Car,
	CheckCircle,
	Locate,
	Phone,
	MessageCircle,
	Filter,
	MoreVertical,
	Plus,
	ChevronDown
} from 'lucide-react'
import LocationWidget from '../components/location_widget'
import PaymentWidget from '../components/payment_widget'
import RegulationsWidget from '../components/regulations_widget'
import LandlordDetailsWidget from '../components/landlord_details_widget'
import propertiesEmptyState from '../assets/properties_empty_state.png'

// Toggle this to test empty state vs properties view
// Set to true to show properties, false to show empty state
const HAS_PROPERTIES = true // Change this to false to see empty state

const SAMPLE_PROPERTIES = HAS_PROPERTIES ? [
	{
		id: 1,
		status: 'scheduled',
		statusLabel: 'Scheduled',
		date: '03:00 PM - 28TH November 2025',
		image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
		price: '$3,000',
		description: '3 bedroom duplex apartment',
		location: 'Ikoyi district, lagos',
		title: '3 bed semi-detached house for rent Coronation Avenue, Winsford, Cheshire CW7',
		fullAddress: '3 bed semi-detached house for rent Coronation Avenue, Winsford, Cheshire CW7',
		bedrooms: 3,
		bathrooms: 3,
		images: [
			'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
			'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800',
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
			'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'
		],
		features: [
			{ name: 'WiFi Available', icon: Wifi },
			{ name: 'Furnitures', icon: Home },
			{ name: 'Electricity available', icon: Zap },
			{ name: 'Fenced with gate', icon: Fence },
			{ name: 'Water available', icon: Droplets },
			{ name: 'Parking space', icon: Car }
		],
		landlord: {
			name: 'Osaite Emmanuel',
			email: 'emmanuelosaite@gmail.com',
			location: 'Lagos, Nigeria',
			verified: true,
			joinDate: 'Nov 2025',
			listedProperties: 24,
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
		},
		about: 'A modern 3-bedroom home with spacious living areas, a fully equipped kitchen, and two bathrooms. Features include ample natural light, tiled floors, and built-in wardrobes.',
		paymentInfo: {
			rent: 120000,
			electricity: 1000,
			waste: 120000,
			security: 2500,
			others: 120000,
			maintenance: 0
		},
		regulations: [
			'Check in at most 10:00 PM',
			'No fighting',
			'Proper maintenance of property',
			'Regular cleaning exercise',
			'Proper management of waste'
		],
		dateListed: '24 November, 2025',
		timeListed: '09:32 PM',
		amountListed: 'NGN 120,000',
		approvedForInspection: true
	},
	{
		id: 2,
		status: 'pending',
		statusLabel: 'Pending',
		date: null,
		image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
		price: '$2,500',
		description: '2 bedroom apartment',
		location: 'Victoria Island, Lagos',
		title: '2 bedroom apartment for rent',
		fullAddress: '2 bedroom apartment for rent Victoria Island',
		bedrooms: 2,
		bathrooms: 2,
		images: [
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
			'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
		],
		features: [
			{ name: 'WiFi Available', icon: Wifi },
			{ name: 'Furnitures', icon: Home }
		],
		landlord: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			location: 'Lagos, Nigeria',
			verified: true,
			joinDate: 'Oct 2025',
			listedProperties: 12,
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
		},
		about: 'A cozy 2-bedroom apartment perfect for small families.',
		paymentInfo: {
			rent: 100000,
			electricity: 800,
			waste: 50000,
			security: 2000,
			others: 0,
			maintenance: 0
		},
		regulations: [
			'No pets allowed',
			'No smoking'
		],
		dateListed: '20 November, 2025',
		timeListed: '02:15 PM',
		amountListed: 'NGN 100,000',
		approvedForInspection: false
	}
] : []

const MyPropertiesView = () => {
	const [activeTab, setActiveTab] = useState('scheduled')
	const [selectedProperty, setSelectedProperty] = useState(
		SAMPLE_PROPERTIES.length > 0 ? SAMPLE_PROPERTIES[0] : null
	)
	const [selectedImageIndex, setSelectedImageIndex] = useState(0)
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [selectedFilter, setSelectedFilter] = useState('all')

	const tabs = [
		{ id: 'overview', label: 'Overview' },
		{ id: 'information', label: 'Information' },
		{ id: 'features', label: 'Features' },
		{ id: 'landlord', label: 'Landlord' },
		{ id: 'location', label: 'Location' },
		{ id: 'payment_info', label: 'Payment info' },
		{ id: 'regulations', label: 'Regulations' },
		{ id: 'review', label: 'Review' }
	]

	const [activeDetailTab, setActiveDetailTab] = useState('overview')

	const filteredProperties = SAMPLE_PROPERTIES.filter((prop) => {
		if (activeTab === 'scheduled') {
			return prop.status === 'scheduled'
		}
		return prop.status === 'pending' || prop.status === 'request'
	})

	const hasProperties = SAMPLE_PROPERTIES.length > 0
	const hasFilteredProperties = filteredProperties.length > 0

	const getStatusBadgeStyles = (status) => {
		switch (status) {
			case 'scheduled':
				return 'bg-primary text-white'
			case 'pending':
				return 'bg-amber-100 text-amber-800'
			default:
				return 'bg-gray-100 text-gray-800'
		}
	}

	const filterOptions = [
		{ id: 'all', label: 'All' },
		{ id: 'accepted', label: 'Accepted' },
		{ id: 'declined', label: 'Declined' },
		{ id: 'pending', label: 'Pending' }
	]

	const handleFilterSelect = (filterId) => {
		setSelectedFilter(filterId)
		setIsFilterOpen(false)
	}

	return (
		<>
			<Navbar />
			<div className={`pt-30 px-6 md:px-16 lg:px-20 min-h-screen ${selectedProperty?.approvedForInspection ? 'pb-24' : 'pb-10'}`}>
				{hasProperties ? (
					<div className='flex flex-col lg:flex-row gap-6'>
						{/* Left Sidebar - Properties List */}
						<div className='lg:w-[400px] shrink-0'>
							<div className='bg-white rounded-2xl border border-gray-200 p-6 sticky top-24'>
							{/* Header */}
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-[20px] font-semibold text-gray-900 flex items-center gap-2'>
									Properties
									<Heart className='w-5 h-5 text-gray-400' />
								</h2>
								{/* Filter Dropdown */}
								<div className='relative'>
									<button
										type='button'
										onClick={() => setIsFilterOpen(!isFilterOpen)}
										className='inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 bg-white text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors'
									>
										Sort
										<ChevronDown
											className={`w-4 h-4 transition-transform ${
												isFilterOpen ? 'rotate-180' : ''
											}`}
										/>
									</button>

									{/* Dropdown Menu */}
									{isFilterOpen && (
										<>
											{/* Backdrop */}
											<div
												className='fixed inset-0 z-10'
												onClick={() => setIsFilterOpen(false)}
											/>
											{/* Dropdown Panel */}
											<div className='absolute right-0 top-full mt-2 w-[200px] bg-white rounded-xl border border-gray-200 shadow-lg z-20 overflow-hidden'>
												{/* Header */}
												<div className='flex items-center gap-2 px-4 py-3 border-b border-gray-200'>
													<Filter className='w-4 h-4 text-gray-600' />
													<span className='text-[14px] font-medium text-gray-900'>
														Sort
													</span>
												</div>

												{/* Options */}
												<div className='py-2'>
													{filterOptions.map((option) => (
														<button
															key={option.id}
															type='button'
															onClick={() => handleFilterSelect(option.id)}
															className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-[14px] font-medium transition-colors ${
																selectedFilter === option.id
																	? 'bg-gray-100 text-gray-900'
																	: 'text-gray-700 hover:bg-gray-50'
															}`}
														>
															<span>{option.label}</span>
															{selectedFilter === option.id && (
																<Check className='w-4 h-4 text-gray-900' />
															)}
														</button>
													))}
												</div>
											</div>
										</>
									)}
								</div>
							</div>

								{/* Sub-header */}
								<div className='mb-4'>
									<h3 className='text-[16px] font-medium text-gray-700'>
										Inspection schedule
									</h3>
								</div>

								{/* Tabs */}
								<div className='flex gap-2 mb-6'>
									<button
										type='button'
										onClick={() => setActiveTab('request')}
										className={`flex-1 px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
											activeTab === 'request'
												? 'bg-primary text-white'
												: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
										}`}
									>
										Request
									</button>
									<button
										type='button'
										onClick={() => setActiveTab('scheduled')}
										className={`flex-1 px-4 py-2 rounded-full text-[14px] font-medium transition-colors ${
											activeTab === 'scheduled'
												? 'bg-primary text-white'
												: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
										}`}
									>
										Scheduled
									</button>
								</div>

								{/* Property Cards */}
								{hasFilteredProperties ? (
									<div className='space-y-4 max-h-[600px] overflow-y-auto'>
										{filteredProperties.map((property) => (
											<button
												key={property.id}
												type='button'
												onClick={() => setSelectedProperty(property)}
												className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
													selectedProperty?.id === property.id
														? 'border-primary bg-primary/5'
														: 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
												}`}
											>
										{/* Status Badge */}
										<div className='flex items-start justify-between mb-2'>
											<span
												className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-medium ${getStatusBadgeStyles(
													property.status
												)}`}
											>
												{property.statusLabel}
											</span>
										</div>

										{/* Date/Time (only for scheduled) */}
										{property.date && (
											<p className='text-[12px] font-medium text-primary mb-3'>
												{property.date}
											</p>
										)}

										{/* Property Image */}
										<div className='relative w-full h-[120px] rounded-lg overflow-hidden mb-3'>
											<img
												src={property.image}
												alt={property.description}
												className='w-full h-full object-cover'
											/>
										</div>

										{/* Price */}
										<p className='text-[18px] font-bold text-gray-900 mb-1'>
											{property.price}
										</p>

										{/* Description */}
										<p className='text-[14px] font-medium text-gray-700 mb-2'>
											{property.description}
										</p>

										{/* Location */}
										<div className='flex items-center gap-1'>
											<MapIcon className='w-4 h-4 text-gray-500' />
											<p className='text-[12px] text-gray-500'>
												{property.location}
											</p>
										</div>
											</button>
										))}
									</div>
								) : (
									<div className='text-center py-8'>
										<p className='text-[14px] text-gray-500'>
											No {activeTab === 'scheduled' ? 'scheduled' : 'request'} properties found
										</p>
									</div>
								)}
							</div>
						</div>

						{/* Right Main Section - Property Details */}
						{selectedProperty && (
							<div className='flex-1'>
								<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
							{/* Image Gallery */}
							<div className='mb-8'>
								<div className='relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden mb-4'>
									<img
										src={selectedProperty.images[selectedImageIndex]}
										alt={selectedProperty.title}
										className='w-full h-full object-cover'
									/>
									{selectedProperty.images.length > 4 && (
										<div className='absolute bottom-4 right-4 bg-black/50 text-white px-4 py-2 rounded-full text-[14px] font-medium'>
											+{selectedProperty.images.length - 4} more
										</div>
									)}
								</div>
								<div className='flex gap-3 overflow-x-auto scrollbar-hide'>
									{selectedProperty.images.slice(0, 4).map((image, index) => (
										<button
											key={index}
											onClick={() => setSelectedImageIndex(index)}
											className={`shrink-0 w-[120px] h-[100px] rounded-xl overflow-hidden border-2 transition-all ${
												selectedImageIndex === index
													? 'border-primary'
													: 'border-transparent'
											}`}
										>
											<img
												src={image}
												alt={`Property ${index + 1}`}
												className='w-full h-full object-cover'
											/>
										</button>
									))}
								</div>
							</div>

								{/* Tab Navigation */}
								<div className='border-b border-gray-200 mb-6'>
									<div className='flex gap-6 overflow-x-auto scrollbar-hide'>
										{tabs.map((tab) => (
											<button
												key={tab.id}
												onClick={() => setActiveDetailTab(tab.id)}
												className={`shrink-0 pb-4 text-[16px] font-medium transition-colors ${
													activeDetailTab === tab.id
														? 'text-primary border-b-2 border-primary'
														: 'text-gray-600 hover:text-gray-900'
												}`}
											>
												{tab.label}
											</button>
										))}
									</div>
								</div>

								{/* Tab Content */}
								<div className='mb-8'>
									{activeDetailTab === 'overview' && (
										<>
											<div className='mb-8'>
												<div className='flex items-start justify-between mb-4'>
													<div>
														<p className='text-[36px] md:text-[48px] font-bold text-gray-900 mb-2'>
															{selectedProperty.price}
														</p>
														<p className='text-[16px] text-gray-600 mb-4'>
															{selectedProperty.fullAddress}
														</p>
														<div className='flex flex-wrap items-center gap-4 text-[14px] text-gray-700'>
															<span className='flex items-center gap-1'>
																<Home className='w-4 h-4' />{' '}
																{selectedProperty.bedrooms} Bed
															</span>
															<span className='flex items-center gap-1'>
																<Droplets className='w-4 h-4' />{' '}
																{selectedProperty.bathrooms} Baths
															</span>
															{selectedProperty.features
																.slice(0, 3)
																.map((feature, idx) => {
																	const Icon = feature.icon
																	return (
																		<span
																			key={idx}
																			className='flex items-center gap-1'
																		>
																			<Icon className='w-4 h-4' />{' '}
																			{feature.name}
																		</span>
																	)
																})}
														</div>
														<button className='text-[14px] text-primary font-medium mt-2 hover:underline'>
															Show all &gt;
														</button>
													</div>
												</div>
											</div>

											<div className='mb-8'>
												<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>
													About property
												</h2>
												<p className='text-[16px] text-gray-600 leading-relaxed'>
													{selectedProperty.about}
												</p>
											</div>

											<div className='mb-8'>
												<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>
													Features
												</h2>
												<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
													{selectedProperty.features.map((feature, idx) => {
														const Icon = feature.icon
														return (
															<div
																key={idx}
																className='flex items-center gap-3'
															>
																<Icon className='w-5 h-5 text-gray-600' />
																<span className='text-[16px] text-gray-700'>
																	{feature.name}
																</span>
															</div>
														)
													})}
												</div>
											</div>
										</>
									)}

									{activeDetailTab === 'landlord' && (
										<LandlordDetailsWidget landlord={selectedProperty.landlord} />
									)}

									{activeDetailTab === 'location' && <LocationWidget />}

									{activeDetailTab === 'payment_info' && (
										<PaymentWidget paymentInfo={selectedProperty.paymentInfo} />
									)}

									{activeDetailTab === 'regulations' && (
										<RegulationsWidget
											regulations={selectedProperty.regulations}
										/>
									)}

									{activeDetailTab === 'information' && (
										<div>
											<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>
												Date
											</h2>
											<div className='space-y-2'>
												<p className='text-[16px] text-gray-700'>
													<span className='font-medium'>Listed:</span>{' '}
													{selectedProperty.dateListed}
												</p>
												<p className='text-[16px] text-gray-700'>
													<span className='font-medium'>Time:</span>{' '}
													{selectedProperty.timeListed}
												</p>
												<p className='text-[16px] text-gray-700'>
													<span className='font-medium'>Amount:</span>{' '}
													{selectedProperty.amountListed}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
							</div>
						)}
					</div>
				) : (
					/* Empty State */
					<div className='max-w-2xl mx-auto'>
						<div className='bg-white rounded-2xl border border-gray-200 p-8 md:p-12 text-center'>
							<div className='mb-6'>
								<img
									src={propertiesEmptyState}
									alt='No properties'
									className='w-full max-w-[400px] mx-auto'
								/>
							</div>
							<h2 className='text-[24px] md:text-[28px] font-semibold text-gray-900 mb-3'>
								No properties yet
							</h2>
							<p className='text-[16px] text-gray-600 mb-8 max-w-md mx-auto'>
								You haven't added any properties to your inspection schedule. Start by requesting an inspection for a property you're interested in.
							</p>
							<button
								type='button'
								className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-[16px] font-medium hover:bg-primary/90 transition-colors'
							>
								<Plus className='w-5 h-5' />
								Browse Properties
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Bottom Sticky Bar */}
			{selectedProperty?.approvedForInspection && (
				<div className='fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50'>
					<div className='max-w-7xl mx-auto px-6 md:px-16 lg:px-20 py-4'>
						<div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
							<p className='text-[14px] font-medium text-gray-900'>
								This property has been approved for inspection
							</p>
							<div className='flex gap-3'>
								<button
									type='button'
									className='inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-primary text-primary text-[14px] font-medium hover:bg-primary/5 transition-colors'
								>
									<Phone className='w-4 h-4' />
									Call
								</button>
								<button
									type='button'
									className='inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-[14px] font-medium hover:bg-primary/90 transition-colors'
								>
									<MessageCircle className='w-4 h-4' />
									Send message
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Footer */}
			<Footer />
		</>
	)
}

export default MyPropertiesView
