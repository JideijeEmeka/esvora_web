import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import PropertyCardWidget from '../components/property_card_widget'
import FilterPropertiesWidget from '../components/filter_properties_widget'
import propertyController from '../controllers/property_controller'
import { selectProperties } from '../redux/slices/propertySlice'
import { normalizeProperties } from '../lib/propertyUtils'
import { Search, Filter } from 'lucide-react'
import Loader from '../components/loader'
import { getStateLabel } from '../lib/constants'

const MyPropertiesView = () => {
	const [isLoading, setIsLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [activeFilters, setActiveFilters] = useState(null)
	const [favorites, setFavorites] = useState(new Set())
	const navigate = useNavigate()
	const apiProperties = useSelector(selectProperties)
	const allProperties = normalizeProperties(apiProperties) ?? []

	useEffect(() => {
		setIsLoading(true)
		propertyController.getAllProperties({
			onSuccess: () => setIsLoading(false),
			onError: () => setIsLoading(false)
		})
	}, [])

	const handleSearch = () => {
		if (searchQuery.trim()) {
			propertyController.searchProperties(searchQuery.trim(), { onError: () => {} })
		} else {
			propertyController.getAllProperties({ forceRefetch: true, onError: () => {} })
		}
	}

	const handleFilterApply = (filters) => {
		if (!filters || Object.keys(filters).length === 0) {
			setActiveFilters(null)
			propertyController.getAllProperties({ forceRefetch: true, onError: () => {} })
			return
		}
		setActiveFilters(filters)
		const params = {}
		if (filters.priceRange?.length === 2) {
			params.min_price = filters.priceRange[0]
			params.max_price = filters.priceRange[1]
		}
		if (filters.state) params.state = getStateLabel(filters.state) || filters.state
		if (filters.bedrooms > 0) params.bedrooms = filters.bedrooms
		if (filters.bathrooms > 0) params.bathrooms = filters.bathrooms
		if (filters.furnishing) params.furnishing = filters.furnishing
		if (filters.propertyType) params.property_range = filters.propertyType
		propertyController.filterProperties(params, { onError: () => {} })
	}

	const toggleFavorite = (propertyId) => {
		setFavorites((prev) => {
			const next = new Set(prev)
			if (next.has(propertyId)) next.delete(propertyId)
			else next.add(propertyId)
			return next
		})
	}

	return (
		<>
			<Navbar />
			<FilterPropertiesWidget
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				onApply={handleFilterApply}
			/>
			<div className='pt-30 px-6 md:px-16 lg:px-20 min-h-screen pb-10 overflow-x-hidden'>
				<div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
					<div>
						<h1 className='text-[28px] font-semibold text-gray-900'>Properties</h1>
						<p className='text-[16px] text-gray-600 mt-1'>
							Browse all available properties
						</p>
					</div>
					<div className='flex-1 w-full max-w-[280px] md:max-w-md relative'>
						<Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600' />
						<input
							type='text'
							placeholder='Search properties'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
							className='w-full pl-12 pr-12 py-3 text-[16px] border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20'
						/>
						<button
							type='button'
							onClick={() => setIsFilterOpen(true)}
							className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors'
							title='Filter'
							aria-label='Filter'
						>
							<Filter className='w-5 h-5 text-gray-600' />
						</button>
					</div>
				</div>
				{isLoading ? (
					<div className='flex justify-center py-12'>
						<Loader />
					</div>
				) : allProperties.length === 0 ? (
					<div className='text-center py-16'>
						<p className='text-[16px] text-gray-600'>No properties found</p>
					</div>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{allProperties.map((property) => (
							<PropertyCardWidget
								key={property.id}
								property={property}
								isFavorite={favorites.has(property.id)}
								onFavoriteToggle={toggleFavorite}
								onViewDetails={() => navigate(`/property-details/${property.id}`)}
								fillWidth
							/>
						))}
					</div>
				)}
			</div>
			<Footer />
		</>
	)
}

export default MyPropertiesView
