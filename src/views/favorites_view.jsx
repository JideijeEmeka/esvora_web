import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import PropertyCardWidget from '../components/property_card_widget'
import Footer from '../components/footer'

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
	'Lagos', 'Benin', 'Kano', 'Abeokuta', 'Akure', 'Calabar',
	'Abuja', 'Enugu', 'Maiduguri', 'Asaba', 'Illorin',
	'Portharcout', 'Ibadan', 'Jos', 'Onitsha', 'Warri', 'Uyo'
]

const RECENTLY_FAVORITES = [
	{ id: 1, image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 2, image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 3, image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 4, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 5, image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true }
]

const YESTERDAY_FAVORITES = [
	{ id: 6, image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 7, image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 8, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 9, image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true },
	{ id: 10, image: 'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=400', price: '€120,500', description: '4 bedroom modern bungalow apartment', location: 'Ikoyi, Lagos, Nigeria', available: true }
]

const FavoritesView = () => {
	const navigate = useNavigate()
	const [selectedCategory, setSelectedCategory] = useState('Popular apartments')
	const [recentlyFavorites, setRecentlyFavorites] = useState(RECENTLY_FAVORITES)
	const [yesterdayFavorites, setYesterdayFavorites] = useState(YESTERDAY_FAVORITES)
	const recentlyRef = useRef(null)
	const yesterdayRef = useRef(null)
	const categoryRef = useRef(null)

	const scrollProperties = (ref, direction) => {
		if (!ref?.current) return
		const amount = 296
		ref.current.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
	}

	const scrollCategories = (direction) => {
		if (!categoryRef?.current) return
		const amount = 200
		categoryRef.current.scrollBy({ left: direction === 'right' ? amount : -amount, behavior: 'smooth' })
	}

	const removeFavorite = (id, setter) => {
		setter((prev) => prev.filter((p) => p.id !== id))
	}

	return (
		<>
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20'>

				{/* Recently */}
				<div className='mb-12 mt-10'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>Recently</h2>
						<div className='flex items-center gap-2'>
							<button
								type='button'
								onClick={() => scrollProperties(recentlyRef, 'left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								type='button'
								onClick={() => scrollProperties(recentlyRef, 'right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div ref={recentlyRef} className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
						{recentlyFavorites.map((property) => (
							<PropertyCardWidget
								key={property.id}
								property={property}
								isFavorite
								onFavoriteToggle={() => removeFavorite(property.id, setRecentlyFavorites)}
								onViewDetails={() => navigate(`/property-details/${property.id}`)}
							/>
						))}
					</div>
				</div>

				{/* Yesterday */}
				<div className='mb-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>Yesterday</h2>
						<div className='flex items-center gap-2'>
							<button
								type='button'
								onClick={() => scrollProperties(yesterdayRef, 'left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								type='button'
								onClick={() => scrollProperties(yesterdayRef, 'right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div ref={yesterdayRef} className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
						{yesterdayFavorites.map((property) => (
							<PropertyCardWidget
								key={property.id}
								property={property}
								isFavorite
								onFavoriteToggle={() => removeFavorite(property.id, setYesterdayFavorites)}
								onViewDetails={() => navigate(`/property-details/${property.id}`)}
							/>
						))}
					</div>
				</div>

				{/* Load more */}
				<div className='flex justify-center mb-12'>
					<button
						type='button'
						className='flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full bg-white text-[16px] font-medium text-gray-700 hover:bg-gray-50 transition-colors'
					>
						Load more
						<ChevronDown className='w-5 h-5' />
					</button>
				</div>

				{/* Find affordable properties */}
				<div className='mb-12 mt-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>Find affordable properties near you!</h2>
						<div className='flex items-center gap-2 max-md:hidden'>
							<button
								type='button'
								onClick={() => scrollCategories('left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								type='button'
								onClick={() => scrollCategories('right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div ref={categoryRef} className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide'>
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
					<h2 className='text-[24px] font-semibold text-gray-900 mb-6'>Popular locations</h2>
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

export default FavoritesView
