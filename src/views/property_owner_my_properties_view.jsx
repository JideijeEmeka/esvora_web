import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import Loader from '../components/loader'
import PropertyCardWidget from '../components/property_card_widget'
import FilterPropertiesWidget from '../components/filter_properties_widget'
import propertyController from '../controllers/property_controller'
import { selectLandlordProperties } from '../redux/slices/propertySlice'
import { normalizeProperties } from '../lib/propertyUtils'
import { Search, Filter, RefreshCw, X } from 'lucide-react'

const PropertyOwnerMyPropertiesView = () => {
	const navigate = useNavigate()
	const landlordPropertiesRaw = useSelector(selectLandlordProperties)
	const hasCachedData = Array.isArray(landlordPropertiesRaw) && landlordPropertiesRaw.length > 0
	const [isLoading, setIsLoading] = useState(!hasCachedData)
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [isFilterOpen, setIsFilterOpen] = useState(false)
	const [activeFilters, setActiveFilters] = useState(null)
	const properties = useMemo(
		() => normalizeProperties(landlordPropertiesRaw ?? []).filter(Boolean),
		[landlordPropertiesRaw]
	)
	const filteredProperties = useMemo(() => {
		const query = searchQuery.trim().toLowerCase()
		return properties.filter((p) => {
			if (query) {
				const haystack = [
					p.title,
					p.description,
					p.location,
					p.address,
					p.city,
					p.state,
					p.propertyType
				].filter(Boolean).join(' ').toLowerCase()
				if (!haystack.includes(query)) return false
			}

			if (!activeFilters) return true

			const [minPrice, maxPrice] = activeFilters.priceRange ?? []
			if (minPrice != null && maxPrice != null) {
				const price = Number(p.priceValue ?? 0)
				if (price < minPrice || price > maxPrice) return false
			}
			if (activeFilters.state) {
				const st = (p.state ?? '').toLowerCase()
				if (!st.includes(String(activeFilters.state).toLowerCase())) return false
			}
			if (activeFilters.bedrooms > 0 && Number(p.bedrooms ?? 0) < Number(activeFilters.bedrooms)) return false
			if (activeFilters.bathrooms > 0 && Number(p.bathrooms ?? 0) < Number(activeFilters.bathrooms)) return false
			if (activeFilters.furnishing) {
				const furnishing = (p.furnishing ?? '').toLowerCase()
				if (furnishing !== String(activeFilters.furnishing).toLowerCase()) return false
			}
			if (activeFilters.propertyType) {
				const propertyType = (p.propertyType ?? '').toLowerCase()
				if (!propertyType.includes(String(activeFilters.propertyType).toLowerCase())) return false
			}
			return true
		})
	}, [properties, searchQuery, activeFilters])

	useEffect(() => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'my-properties')
	}, [])

	useEffect(() => {
		if (!hasCachedData) setIsLoading(true)
		propertyController.listLandlordProperties({
			forceRefetch: false,
			onSuccess: () => setIsLoading(false),
			onError: () => setIsLoading(false)
		})
	}, [])

	const handleRefresh = () => {
		setIsRefreshing(true)
		propertyController.listLandlordProperties({
			forceRefetch: true,
			onSuccess: () => setIsRefreshing(false),
			onError: () => setIsRefreshing(false)
		})
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<FilterPropertiesWidget
				isOpen={isFilterOpen}
				onClose={() => setIsFilterOpen(false)}
				onApply={(filters) => setActiveFilters(filters && Object.keys(filters).length > 0 ? filters : null)}
			/>
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen bg-white'>
				<div className='max-w-6xl mx-auto w-full'>
					<div className='mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
						<div>
							<h1 className='text-[28px] md:text-[32px] font-bold text-gray-900'>
								My Properties
							</h1>
							<p className='text-[15px] text-gray-600 mt-1'>
								Manage all properties listed on your landlord account.
							</p>
						</div>
						<div className='flex items-center gap-2 w-full md:w-auto'>
							<div className='relative flex-1 md:w-[320px]'>
								<Search className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500' />
								<input
									type='text'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder='Search properties'
									className='w-full pl-11 pr-10 py-2.5 border border-gray-300 rounded-full text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20'
								/>
								{searchQuery.trim().length > 0 && (
									<button
										type='button'
										onClick={() => setSearchQuery('')}
										className='absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors'
										aria-label='Clear search'
										title='Clear search'
									>
										<X className='w-4 h-4' />
									</button>
								)}
							</div>
							<button
								type='button'
								onClick={() => setIsFilterOpen(true)}
								className='p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors'
								title='Filter properties'
								aria-label='Filter properties'
							>
								<Filter className='w-4 h-4' />
							</button>
							<button
								type='button'
								onClick={handleRefresh}
								disabled={isLoading || isRefreshing}
								className='p-2.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed'
								title='Refresh properties'
								aria-label='Refresh properties'
							>
								<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
							</button>
						</div>
					</div>

					{isLoading ? (
						<div className='flex justify-center py-12'>
							<Loader />
						</div>
					) : filteredProperties.length === 0 ? (
						<div className='text-center py-16'>
							<p className='text-[16px] text-gray-600 mb-4'>
								{properties.length === 0 ? 'No properties found.' : 'No properties match your search/filter.'}
							</p>
							<button
								type='button'
								onClick={() => navigate('/property-owner/listings')}
								className='px-5 py-2.5 rounded-full bg-primary text-white text-[14px] font-medium hover:bg-primary/90 transition-colors'
							>
								Add property
							</button>
						</div>
					) : (
						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
							{filteredProperties.map((property) => (
								<PropertyCardWidget
									key={property.id}
									property={property}
									onViewDetails={() => navigate(`/property-owner/my-property-details/${property.id}`)}
								/>
							))}
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	)
}

export default PropertyOwnerMyPropertiesView
