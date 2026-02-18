import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import PropertyCardWidget from '../components/property_card_widget'
import FilterPropertiesWidget from '../components/filter_properties_widget'
import { Search, Filter, ChevronLeft, ChevronRight, MapIcon } from 'lucide-react'

const CATEGORIES = [
	'Popular apartments',
	'Shop',
	'Shortlet',
	'Duplex',
	'Bungalow',
	'Flats',
	'Room & Parlor',
	'Event hall',
	'Shopping hall',
	'Selfcon',
	'Store'
]

const POPULAR_LOCATIONS = [
	'Lagos',
	'Benin',
	'Kano',
	'Abeokuta',
	'Akure',
	'Calabar',
	'Abuja',
	'Enugu',
	'Maiduguri',
	'Asaba',
	'Ilorin',
	'Portharcout',
	'Ibadan',
	'Jos',
	'Onitsha',
	'Warri',
	'Uyo'
]

const SAMPLE_PROPERTIES = [
	{
		id: 1,
		image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
		price: '€120,500',
		description: '4 bedroom modern bungalow apartment',
		location: 'Ikoyi, Lagos, Nigeria',
		available: true
	},
	{
		id: 2,
		image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
		price: '€120,500',
		description: '4 bedroom modern bungalow apartment',
		location: 'Ikoyi, Lagos, Nigeria',
		available: true
	},
	{
		id: 3,
		image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
		price: '€120,500',
		description: '4 bedroom modern bungalow apartment',
		location: 'Ikoyi, Lagos, Nigeria',
		available: true
	},
	{
		id: 4,
		image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
		price: '€120,500',
		description: '4 bedroom modern bungalow apartment',
		location: 'Ikoyi, Lagos, Nigeria',
		available: true
	},
	{
		id: 5,
		image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
		price: '€120,500',
		description: '4 bedroom modern bungalow apartment',
		location: 'Ikoyi, Lagos, Nigeria',
		available: true
	}
]

const BuyView = () => {
	const navigate = useNavigate()
	const [searchQuery, setSearchQuery] = useState('')
	const [favorites, setFavorites] = useState(new Set())
	const [selectedCategory, setSelectedCategory] = useState('Popular apartments')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [activeFilters, setActiveFilters] = useState(null)
	const firstRowRef = useRef(null)
	const secondRowRef = useRef(null)
	const thirdRowRef = useRef(null)
	const categoryRef = useRef(null)

	const scrollProperties = (ref, direction) => {
		if (!ref?.current) return
		const amount = 296
		ref.current.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		})
	}

	const scrollCategories = (direction) => {
		if (!categoryRef?.current) return
		const amount = 200
		categoryRef.current.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		})
	}

	const toggleFavorite = (propertyId) => {
		setFavorites((prev) => {
			const newFavorites = new Set(prev)
			if (newFavorites.has(propertyId)) {
				newFavorites.delete(propertyId)
			} else {
				newFavorites.add(propertyId)
			}
			return newFavorites
		})
	}

	const handleViewDetails = (propertyId) => {
		sessionStorage.setItem('activeTab', 'buy')
		navigate(`/property-details/${propertyId}`)
	}

	const handleFilterApply = (filters) => {
		setActiveFilters(filters)
		setIsFilterOpen(false)
	}

	// Set active tab to 'buy' when component mounts
	useEffect(() => {
		sessionStorage.setItem('activeTab', 'buy')
	}, [])

	return (
		<>
			<Navbar />
			<FilterPropertiesWidget
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				onApply={handleFilterApply}
			/>

			{/* Hero Section */}
			<div className='relative w-full h-[500px] max-md:h-[400px] mt-20 overflow-hidden'>
				<div
					className='absolute inset-0 bg-cover bg-center'
					style={{
						backgroundImage:
							'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200)',
						filter: 'blur(2px)',
						transform: 'scale(1.1)'
					}}
				/>
				<div className='absolute inset-0 bg-black/40' />
				<div className='relative z-10 h-full flex flex-col items-center justify-center px-6'>
					<h1 className='text-[48px] max-md:text-[32px] font-bold text-white mb-8 text-center'>
						Find affordable properties near you!
					</h1>
					<div className='flex flex-col md:flex-row items-center border border-gray-300 px-4 py-3 bg-white rounded-full gap-4 w-full max-w-4xl max-md:rounded-md'>
						<div className='flex-1 relative w-full'>
							<Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 z-10' />
							<input
								type='text'
								placeholder='Search properties'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full pl-12 pr-4 py-3 text-[16px] bg-white/95 backdrop-blur-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 relative z-0'
							/>
						</div>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => setIsFilterOpen(true)}
								className='flex items-center gap-2 px-4 py-3 bg-white/95 cursor-pointer backdrop-blur-sm border border-gray-300 rounded-full hover:bg-white transition-colors'
							>
								<Filter className='w-5 h-5 text-gray-700' />
								<span className='text-[16px] font-medium text-gray-700'>
									Filter
								</span>
							</button>
							<button className='flex items-center gap-2 px-4 py-3 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-full hover:bg-white transition-colors'>
								<MapIcon className='w-5 h-5 text-gray-700' />
								<span className='text-[16px] font-medium text-gray-700'>Map</span>
							</button>
							<button className='bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/80 transition-colors font-medium flex items-center gap-2'>
								<Search className='w-5 h-5' />
								Search
							</button>
						</div>
					</div>
				</div>
			</div>

			<div className='pb-10 px-6 md:px-16 lg:px-20 mt-10'>
				{/* Property Listings - First Row */}
				<div className='mb-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							Popular near your location!
						</h2>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => scrollProperties(firstRowRef, 'left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								onClick={() => scrollProperties(firstRowRef, 'right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={firstRowRef}
						className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
					>
						{SAMPLE_PROPERTIES.map((property) => (
							<PropertyCardWidget
								key={property.id}
								property={property}
								isFavorite={favorites.has(property.id)}
								onFavoriteToggle={toggleFavorite}
								onViewDetails={() => handleViewDetails(property.id)}
							/>
						))}
					</div>
				</div>

				{/* Property Listings - Second Row */}
				<div className='mb-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							Popular near your location!
						</h2>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => scrollProperties(secondRowRef, 'left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								onClick={() => scrollProperties(secondRowRef, 'right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={secondRowRef}
						className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
					>
						{SAMPLE_PROPERTIES.map((property) => (
							<PropertyCardWidget
								key={`second-${property.id}`}
								property={property}
								isFavorite={favorites.has(property.id)}
								onFavoriteToggle={toggleFavorite}
								onViewDetails={() => handleViewDetails(property.id)}
							/>
						))}
					</div>
				</div>

				{/* Property Listings - Third Row */}
				<div className='mb-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							Popular near your location!
						</h2>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => scrollProperties(thirdRowRef, 'left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								onClick={() => scrollProperties(thirdRowRef, 'right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={thirdRowRef}
						className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
					>
						{SAMPLE_PROPERTIES.map((property) => (
							<PropertyCardWidget
								key={`third-${property.id}`}
								property={property}
								isFavorite={favorites.has(property.id)}
								onFavoriteToggle={toggleFavorite}
								onViewDetails={() => handleViewDetails(property.id)}
							/>
						))}
					</div>
				</div>

				{/* Find affordable properties */}
				<div className='mb-12 mt-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							Find affordable properties near you!
						</h2>
						<div className='flex items-center gap-2 max-md:hidden'>
							<button
								onClick={() => scrollCategories('left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								onClick={() => scrollCategories('right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={categoryRef}
						className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide'
					>
						{CATEGORIES.map((category) => (
							<button
								key={category}
								type='button'
								onClick={() => setSelectedCategory(category)}
								className={`shrink-0 px-6 py-3 rounded-full font-medium text-[16px] transition-colors ${
									selectedCategory === category
										? 'bg-gray-800 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				{/* Popular locations */}
				<div className='mb-1'>
					<h2 className='text-[24px] font-semibold text-gray-900 mb-6'>
						Popular locations
					</h2>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{POPULAR_LOCATIONS.map((location, index) => (
							<button
								key={index}
								type='button'
								className='text-left px-4 py-3 hover:bg-gray-100 rounded-lg text-[16px] font-medium text-gray-700 transition-colors'
							>
								{location}
							</button>
						))}
					</div>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default BuyView
