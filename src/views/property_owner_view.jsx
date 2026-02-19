import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { Home, Clock, FileText, ChevronLeft, ChevronRight, MapIcon, Pencil } from 'lucide-react'

const SAMPLE_PROPERTIES = [
	{
		id: 1,
		image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
		price: '€120,500',
		description: '4 bedroom modern bungalow apartment',
		location: 'Ikoyi, Lagos, Nigeria',
		status: 'Rent'
	},
	{
		id: 2,
		image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
		price: '€95,000',
		description: '3 bedroom luxury apartment',
		location: 'Victoria Island, Lagos, Nigeria',
		status: 'Shortlet'
	},
	{
		id: 3,
		image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
		price: '€150,000',
		description: '5 bedroom detached house',
		location: 'Lekki, Lagos, Nigeria',
		status: 'Sale'
	},
	{
		id: 4,
		image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
		price: '€80,000',
		description: '2 bedroom cozy apartment',
		location: 'Surulere, Lagos, Nigeria',
		status: 'Rent'
	},
	{
		id: 5,
		image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
		price: '€110,000',
		description: '3 bedroom modern townhouse',
		location: 'Gbagada, Lagos, Nigeria',
		status: 'Shortlet'
	}
]

const PropertyOwnerCard = ({ property, onViewDetails, onEdit }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case 'Rent':
				return 'bg-blue-100 text-blue-700'
			case 'Shortlet':
				return 'bg-purple-100 text-purple-700'
			case 'Sale':
				return 'bg-green-100 text-green-700'
			default:
				return 'bg-gray-100 text-gray-700'
		}
	}

	return (
		<div
			className='shrink-0 w-[280px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative'
			onClick={onViewDetails}
		>
			<div className='relative'>
				<img
					src={property.image}
					alt={property.description}
					className='w-full h-[200px] object-cover'
				/>
				{property.status && (
					<div
						className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-medium ${getStatusColor(
							property.status
						)}`}
					>
						{property.status}
					</div>
				)}
				{onEdit && (
					<button
						type='button'
						onClick={(e) => {
							e.stopPropagation()
							onEdit(property.id)
						}}
						className='absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors'
						aria-label='Edit listing'
					>
						<Pencil className='w-4 h-4' />
					</button>
				)}
			</div>
			<div className='p-4'>
				<p className='text-[20px] font-semibold text-gray-900 mb-2'>
					{property.price}
				</p>
				<p className='text-[14px] font-medium text-gray-700 mb-2 line-clamp-2'>
					{property.description}
				</p>
				<div className='flex items-center gap-1'>
					<MapIcon className='w-4 h-4 text-gray-500' />
					<p className='text-[14px] text-gray-500'>{property.location}</p>
				</div>
			</div>
		</div>
	)
}

const PropertyOwnerView = () => {
	const navigate = useNavigate()
	const propertiesRef = useRef(null)

	const scrollProperties = (ref, direction) => {
		if (!ref?.current) return
		const amount = 296
		ref.current.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		})
	}

	const handleViewDetails = (propertyId) => {
		sessionStorage.setItem('activeTab', 'property-owner')
		navigate(`/property-details/${propertyId}`)
	}

	const handleEditListing = (propertyId) => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'listings')
		navigate(`/property-owner/listings/edit/${propertyId}`)
	}

	// Set active tab to 'property-owner' when component mounts
	useEffect(() => {
		sessionStorage.setItem('activeTab', 'property-owner')
	}, [])

		return (
		<>
			<PropertyOwnerNavbar />
			{/* Hero Section - no overflow-hidden so cards below can show */}
			<div className='relative w-full mt-20'>
				<div className='relative w-full h-[420px] max-md:h-[360px] overflow-hidden'>
					<div
						className='absolute inset-0 bg-cover bg-center'
						style={{
							backgroundImage:
								'url(https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200)',
							filter: 'brightness(0.7)'
						}}
					/>
					<div className='absolute inset-0 bg-black/30' />
					<div className='relative z-10 h-full flex flex-col items-center justify-center px-6'>
						<h1 className='text-[48px] max-md:text-[36px] font-bold text-white mb-8 text-center'>
							List your properties and make money
						</h1>
					</div>
				</div>

				{/* Property Type Cards - Below hero, overlapping with negative margin */}
				<div className='relative z-20 -mt-16 max-md:-mt-12 px-6 md:px-16 lg:px-20'>
					<div className='flex flex-wrap justify-center gap-6'>
						<button
							type='button'
							onClick={() => navigate('/property-owner/listings')}
							className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-[280px] w-full hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center gap-4'
						>
							<div className='w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0'>
								<Home className='w-10 h-10 text-primary' />
							</div>
							<span className='text-[18px] font-medium text-gray-900'>
								For Rent
							</span>
						</button>
						<button
							type='button'
							onClick={() => navigate('/property-owner/shortlet')}
							className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-[280px] w-full hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center gap-4'
						>
							<div className='w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0'>
								<Clock className='w-10 h-10 text-primary' />
							</div>
							<span className='text-[18px] font-medium text-gray-900'>
								Shortlet
							</span>
						</button>
						<button
							type='button'
							onClick={() => navigate('/property-owner/sale')}
							className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-[280px] w-full hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center gap-4'
						>
							<div className='w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0'>
								<FileText className='w-10 h-10 text-primary' />
							</div>
							<span className='text-[18px] font-medium text-gray-900'>
								For Sale
							</span>
						</button>
					</div>
				</div>
			</div>

			<div className='pb-10 px-6 md:px-16 lg:px-20 mt-24 max-md:mt-20'>
				{/* My Properties Section */}
				<div className='mb-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							My properties
						</h2>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => scrollProperties(propertiesRef, 'left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								onClick={() => scrollProperties(propertiesRef, 'right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={propertiesRef}
						className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
					>
						{SAMPLE_PROPERTIES.map((property) => (
							<PropertyOwnerCard
								key={property.id}
								property={property}
								onViewDetails={() => handleViewDetails(property.id)}
								onEdit={handleEditListing}
							/>
						))}
					</div>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default PropertyOwnerView
