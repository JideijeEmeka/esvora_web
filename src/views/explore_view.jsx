import React, { useState, useRef, useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Navbar from '../components/navbar'
import FilterPropertiesWidget from '../components/filter_properties_widget'
import Footer from '../components/footer'
import PropertyCardWidget from '../components/property_card_widget'
import Loader from '../components/loader'
import { Search, Filter, ChevronLeft, ChevronRight, X, MapIcon } from 'lucide-react'
import { getPropertyTypeLabel, getStateLabel, getFurnishingLabel } from '../lib/constants'
import { useNavigate } from 'react-router-dom'
import { store } from '../redux/store'
import { authApi } from '../repository/auth_repository'
import { updateAccount } from '../redux/slices/accountSlice'
import { selectProperties } from '../redux/slices/propertySlice'
import agreementsController from '../controllers/agreements_controller'
import walletController from '../controllers/wallet_controller'
import propertyController from '../controllers/property_controller'
import notificationController from '../controllers/notification_controller'
import tenantController from '../controllers/tenant_controller'
import { normalizeProperties } from '../lib/propertyUtils'
import { getToken } from '../lib/localStorage'

const ExploreView = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoadingProperties, setIsLoadingProperties] = useState(false)
  const apiProperties = useSelector(selectProperties)

  useEffect(() => {
    // Discover: load properties for all visitors (public)
    propertyController
      .getAllProperties({ onError: () => {} })
      .catch(() => {})

    if (!getToken()) return
    store.dispatch(authApi.endpoints.getProfile.initiate()).then((res) => {
      if (res.error) return
      const data = res.data
      const user = data?.data?.user ?? data?.user
      if (user) store.dispatch(updateAccount(user))
    }).catch(() => {})
    agreementsController.listAgreements({ onError: () => {} }).catch(() => {})
    walletController.getWalletBalance({ onError: () => {} }).catch(() => {})
    notificationController.getNotifications({ onError: () => {} }).catch(() => {})
    tenantController.listTenancies({ onError: () => {} }).catch(() => {})
  }, [])

  const [favorites, setFavorites] = useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(null)
  const [isFilterLoading, setIsFilterLoading] = useState(false)
  const firstRowRef = useRef(null)
  const secondRowRef = useRef(null)
  const thirdRowRef = useRef(null)
  const categoryRef = useRef(null)
  const filteredResultsRef = useRef(null)
  const navigate = useNavigate()

  const allProperties = useMemo(() => normalizeProperties(apiProperties), [apiProperties])

  // Map filter propertyType to API slug (backend uses rent/shortlet/sales)
  const PROPERTY_TYPE_TO_SLUG = {
    shortlet: 'shortlet',
    rent: 'rent',
    sales: 'sales',
    apartment: 'rent',
    house: 'rent',
    bungalow: 'rent',
    duplex: 'rent',
    penthouse: 'rent',
    studio: 'rent',
    townhouse: 'rent',
    villa: 'rent',
    shop: 'rent',
    flats: 'rent',
    'room-parlor': 'rent',
    'event-hall': 'rent',
    'shopping-hall': 'rent',
    selfcon: 'rent',
    store: 'rent'
  }

  const fetchWithFilters = (filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      propertyController.getAllProperties({ forceRefetch: true, onError: () => {} })
      return
    }
    setIsFilterLoading(true)
    const done = () => setIsFilterLoading(false)
    const params = {}
    if (filters.priceRange?.length === 2) {
      params.min_price = filters.priceRange[0]
      params.max_price = filters.priceRange[1]
    }
    if (filters.state) params.state = getStateLabel(filters.state) || filters.state
    if (filters.bedrooms > 0) params.bedrooms = filters.bedrooms
    if (filters.bathrooms > 0) params.bathrooms = filters.bathrooms
    if (filters.furnishing) params.furnishing = filters.furnishing
    if (filters.propertyType) {
      params.property_range = filters.propertyType
      const slug = PROPERTY_TYPE_TO_SLUG[filters.propertyType] ?? filters.propertyType
      params.property_type = slug
    }
    propertyController.filterProperties(params, {
      onSuccess: done,
      onError: done
    })
  }

  const handleSearchClick = () => {
    if (searchQuery.trim()) {
      propertyController.searchProperties(searchQuery.trim(), { onError: () => {} })
    } else {
      propertyController.getAllProperties({ forceRefetch: true, onError: () => {} })
    }
  }

  const scrollProperties = (ref, direction) => {
    if (!ref.current) return
    const cardWidth = 280
    const gap = 16
    const cardWithGap = cardWidth + gap
    const isMobile = window.innerWidth < 768
    const scrollAmount = isMobile ? cardWithGap * 1 : cardWithGap * 4
    if (direction === 'right') {
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    } else {
      ref.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }


  const categories = [
    'All',
    'Popular apartments',
    'Shop',
    'Shortlet',
    'Duplex',
    'Bungalow',
    'Flats',
    'Room & Parlor',
    'Event hall',
    'Shopping mall',
    'Selfcon',
    'Store'
  ]

  // Map category label to property type value (from constants)
  const CATEGORY_TO_PROPERTY_TYPE = {
    All: null, // show all
    'Popular apartments': null, // show all
    Shop: 'shop',
    Shortlet: 'shortlet',
    Duplex: 'duplex',
    Bungalow: 'bungalow',
    Flats: 'flats',
    'Room & Parlor': 'room-parlor',
    'Event hall': 'event-hall',
    'Shopping mall': 'shopping-mall',
    Selfcon: 'selfcon',
    Store: 'store'
  }

  const categoryFilteredProperties = useMemo(() => {
    const typeValue = CATEGORY_TO_PROPERTY_TYPE[selectedCategory]
    if (!typeValue) return allProperties
    const typeLower = typeValue.toLowerCase()
    return allProperties.filter((p) => {
      const pType = (p.propertyType ?? p.property_type ?? '').toString().toLowerCase()
      const desc = (p.description ?? p.property_type_summary ?? '').toString().toLowerCase()
      return pType === typeLower || pType.includes(typeLower) || desc.includes(typeLower)
    })
  }, [selectedCategory, allProperties])

  const popularLocations = [
    'Lagos', 'Benin', 'Kano', 'Abeokuta', 'Akure', 'Calabar',
    'Abuja', 'Enugu', 'Maiduguri', 'Asaba', 'Illorin',
    'Portharcout', 'Ibadan', 'Jos', 'Onitsha', 'Warri', 'Uyo'
  ]

  const scrollCategories = (direction) => {
    if (!categoryRef.current) return
    const scrollAmount = 200
    if (direction === 'right') {
      categoryRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    } else {
      categoryRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
    }
  }

  const handleFilterApply = (filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      setActiveFilters(null)
    } else {
      setActiveFilters(filters)
    }
    fetchWithFilters(filters)
  }

  const handleRemoveFilter = (filterKey) => {
    if (!activeFilters) return
    const newFilters = { ...activeFilters }
    if (filterKey === 'priceRange') {
      newFilters.priceRange = [0, 1000000]
    } else {
      newFilters[filterKey] = filterKey === 'bedrooms' || filterKey === 'bathrooms' ? 0 : ''
    }
    setActiveFilters(newFilters)
    fetchWithFilters(newFilters)
  }

  const handleClearAllFilters = () => {
    setActiveFilters(null)
    fetchWithFilters(null)
  }

  // Filter properties based on active filters
  const filteredProperties = useMemo(() => {
    if (!activeFilters) return allProperties

    return allProperties.filter(property => {
      // Price range filter
      if (activeFilters.priceRange) {
        const [minPrice, maxPrice] = activeFilters.priceRange
        if (property.priceValue < minPrice || property.priceValue > maxPrice) {
          return false
        }
      }

      // Property type filter (case-insensitive; API returns "Shortlet", "Rent", "Sales")
      if (activeFilters.propertyType) {
        const pType = (property.propertyType ?? property.property_type ?? '').toString().toLowerCase()
        const filterType = activeFilters.propertyType.toString().toLowerCase()
        if (pType !== filterType && !pType.includes(filterType)) return false
      }

      // Bedrooms filter
      if (activeFilters.bedrooms && activeFilters.bedrooms > 0 && property.bedrooms < activeFilters.bedrooms) {
        return false
      }

      // Bathrooms filter
      if (activeFilters.bathrooms && activeFilters.bathrooms > 0 && property.bathrooms < activeFilters.bathrooms) {
        return false
      }

      // Furnishing filter
      if (activeFilters.furnishing && property.furnishing !== activeFilters.furnishing) {
        return false
      }

      // State filter (API may return "Lagos"/"Akwa Ibom"; filter stores slug "lagos"/"akwa-ibom")
      if (activeFilters.state) {
        const filterSlug = (activeFilters.state || '').toString().toLowerCase()
        const filterLabel = (getStateLabel(activeFilters.state) || '').toLowerCase()
        const propState = (property.state ?? property.State ?? '').toString().toLowerCase()
        const propNormalized = propState.replace(/\s+/g, '-')
        const matches = propState === filterLabel || propNormalized === filterSlug || propState.includes(filterSlug)
        if (!matches) return false
      }

      return true
    })
  }, [activeFilters, allProperties])

  // Filtered properties are used only in the filtered results section
  // Popular sections always use allProperties

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
            backgroundImage: `url(${allProperties[0]?.image ?? allProperties[0]?.images?.[0] ?? 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200'})`,
            filter: 'blur(2px)',
            transform: 'scale(1.1)'
          }}
        />
        <div className='absolute inset-0 bg-black/40' />
        <div className='relative z-10 h-full flex flex-col items-center justify-center px-6'>
          <h1 className='text-[48px] max-md:text-[32px] font-bold text-white mb-8 text-center'>
            Find affordable properties near you!
          </h1>
          <div className='flex flex-col md:flex-row items-center border border-gray-300
               px-4 py-3 bg-white rounded-full gap-4 w-full max-w-4xl max-md:rounded-md'>
            <div className='flex-1 relative w-full'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600 z-10' />
              <input
                type="text"
                placeholder="Search properties"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-12 pr-4 py-3 text-[16px] bg-white/95 backdrop-blur-sm
                  border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/20 relative z-0'
              />
            </div>
            <div className='flex items-center gap-2'>
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className='flex items-center gap-2 px-4 py-3 max-md:px-3 max-md:py-2.5 max-md:gap-1.5 bg-white/95 cursor-pointer
                    backdrop-blur-sm border border-gray-300 rounded-full hover:bg-white transition-colors'
                >
                <Filter className='w-5 h-5 max-md:w-4 max-md:h-4 text-gray-700' />
                <span className='text-[16px] max-md:text-[14px] font-medium text-gray-700'>Filter</span>
                </button>
                <button className='flex items-center gap-2 px-4 py-3 max-md:px-3 max-md:py-2.5 max-md:gap-1.5 bg-white/95 backdrop-blur-sm border border-gray-300 rounded-full hover:bg-white transition-colors'>
                <MapIcon className='w-5 h-5 max-md:w-4 max-md:h-4 text-gray-700' />
                <span className='text-[16px] max-md:text-[14px] font-medium text-gray-700'>Map</span>
                </button>
                <button
                  type='button'
                  onClick={handleSearchClick}
                  className='bg-primary text-white px-6 py-3 max-md:px-4 max-md:py-2.5 max-md:gap-1.5 rounded-full hover:bg-primary/80 transition-colors font-medium flex items-center gap-2'
                >
                  <Search className='w-5 h-5 max-md:w-4 max-md:h-4' />
                  <span className='max-md:text-[14px]'>Search</span>
                </button>
            </div>
          </div>
        </div>
      </div>

      <div className='pb-10 px-6 md:px-16 lg:px-20 mt-10'>
        {/* Active Filter Tags */}
        {activeFilters && (
          <div className='mb-6 flex flex-wrap items-center gap-2'>
            {activeFilters.priceRange && activeFilters.priceRange[0] !== 0 && activeFilters.priceRange[1] !== 1000000 && (
              <div className='flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full'>
                <span className='text-[14px] font-medium text-primary'>
                  Price: ₦{activeFilters.priceRange[0].toLocaleString()} - ₦{activeFilters.priceRange[1].toLocaleString()}
                </span>
                <button
                  onClick={() => handleRemoveFilter('priceRange')}
                  className='w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors'
                >
                  <X className='w-3 h-3 text-primary' />
                </button>
              </div>
            )}
            {activeFilters.propertyType && (
              <div className='flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full'>
                <span className='text-[14px] font-medium text-primary'>
                  Category: {getPropertyTypeLabel(activeFilters.propertyType)}
                </span>
                <button
                  onClick={() => handleRemoveFilter('propertyType')}
                  className='w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors'
                >
                  <X className='w-3 h-3 text-primary' />
                </button>
              </div>
            )}
            {activeFilters.bedrooms !== undefined && activeFilters.bedrooms > 0 && (
              <div className='flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full'>
                <span className='text-[14px] font-medium text-primary'>
                  Bedrooms: {activeFilters.bedrooms}+
                </span>
                <button
                  onClick={() => handleRemoveFilter('bedrooms')}
                  className='w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors'
                >
                  <X className='w-3 h-3 text-primary' />
                </button>
              </div>
            )}
            {activeFilters.bathrooms !== undefined && activeFilters.bathrooms > 0 && (
              <div className='flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full'>
                <span className='text-[14px] font-medium text-primary'>
                  Bathrooms: {activeFilters.bathrooms}+
                </span>
                <button
                  onClick={() => handleRemoveFilter('bathrooms')}
                  className='w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors'
                >
                  <X className='w-3 h-3 text-primary' />
                </button>
              </div>
            )}
            {activeFilters.furnishing && (
              <div className='flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full'>
                <span className='text-[14px] font-medium text-primary'>
                  Furnishing: {getFurnishingLabel(activeFilters.furnishing)}
                </span>
                <button
                  onClick={() => handleRemoveFilter('furnishing')}
                  className='w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors'
                >
                  <X className='w-3 h-3 text-primary' />
                </button>
              </div>
            )}
            {activeFilters.state && (
              <div className='flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full'>
                <span className='text-[14px] font-medium text-primary'>
                  State: {getStateLabel(activeFilters.state)}
                </span>
                <button
                  onClick={() => handleRemoveFilter('state')}
                  className='w-4 h-4 flex items-center justify-center rounded-full hover:bg-primary/20 transition-colors'
                >
                  <X className='w-3 h-3 text-primary' />
                </button>
              </div>
            )}
            {(activeFilters.priceRange && activeFilters.priceRange[0] !== 0 && activeFilters.priceRange[1] !== 1000000) ||
            activeFilters.propertyType ||
            (activeFilters.bedrooms !== undefined && activeFilters.bedrooms > 0) ||
            (activeFilters.bathrooms !== undefined && activeFilters.bathrooms > 0) ||
            activeFilters.furnishing ||
            activeFilters.state ? (
              <button
                onClick={handleClearAllFilters}
                className='px-4 py-2 text-[14px] font-medium text-gray-600 hover:text-primary transition-colors'
              >
                Clear all
              </button>
            ) : null}
          </div>
        )}

        {/* Filtered Results Section */}
        {activeFilters && (
          <div className='mb-12'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-[24px] font-semibold text-gray-900'>
                {isFilterLoading
                  ? ''
                  : `Showing results for ${filteredProperties.length} ${filteredProperties.length === 1 ? 'property' : 'properties'}`}
              </h2>
              {filteredProperties.length < 1 ? (
                <div></div>
              ) : (
                <div className='flex items-center gap-2'>
                <button 
                  onClick={() => scrollProperties(filteredResultsRef, 'left')}
                  className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
                >
                  <ChevronLeft className='w-5 h-5 text-gray-700' />
                </button>
                <button 
                  onClick={() => scrollProperties(filteredResultsRef, 'right')}
                  className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
                >
                  <ChevronRight className='w-5 h-5 text-gray-700' />
                </button>
              </div>
              )}
            </div>
            {isFilterLoading ? (
              <div className='flex justify-center items-center py-16'>
                <Loader />
              </div>
            ) : filteredProperties.length > 0 ? (
              <div ref={filteredResultsRef} className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
                {filteredProperties.map((property) => (
                  <PropertyCardWidget 
                    key={property.id} 
                    property={property}
                    isFavorite={favorites.has(property.id)}
                    onFavoriteToggle={toggleFavorite}
                    onViewDetails={() => navigate(`/property-details/${property.id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <p className='text-[18px] font-medium text-gray-600 mb-2'>No properties found</p>
                <p className='text-[14px] text-gray-500'>Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        )}

        {/* Category Buttons Section */}
        <div className='mb-12'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-[24px] font-semibold text-gray-900'>Affordable properties</h2>
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
          <div ref={categoryRef} className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide'>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`shrink-0 px-6 py-3 rounded-full font-medium text-[16px] transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Property Listings */}
        <div className='mb-12'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-[24px] font-semibold text-gray-900'>All Properties</h2>
            {categoryFilteredProperties.length > 0 && (
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
            )}
          </div>
          {categoryFilteredProperties.length === 0 ? (
            <div className='py-12 text-center'>
              <p className='text-[16px] font-medium text-gray-600 mb-1'>
                No {selectedCategory} properties found
              </p>
              <p className='text-[14px] text-gray-500'>
                Try selecting a different category or browse all properties
              </p>
            </div>
          ) : (
          <>
            <div ref={firstRowRef} className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
              {categoryFilteredProperties.map((property) => (
                <PropertyCardWidget 
                  key={property.id}
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onFavoriteToggle={toggleFavorite}
                  onViewDetails={() => navigate(`/property-details/${property.id}`)}
                />
              ))}
            </div>
            <div className='mt-2 mr-2 flex justify-end'>
              <button
                type='button'
                onClick={() => navigate('/my-properties')}
                className='text-[14px] font-medium text-primary hover:underline'
              >
                See all
              </button>
            </div>
          </>
          )}
        </div>

        {/* Second Row of Property Listings */}
        {categoryFilteredProperties.length > 0 && (
        <div className='mb-12'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-[24px] font-semibold text-gray-900'>Popular near your location</h2>
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
            <div ref={secondRowRef} className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
              {categoryFilteredProperties.map((property) => (
                <PropertyCardWidget 
                  key={`second-${property.id}`} 
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onFavoriteToggle={toggleFavorite}
                  onViewDetails={() => navigate(`/property-details/${property.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Third Row of Property Listings */}
        {categoryFilteredProperties.length > 0 && (
        <div className='mb-12'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-[24px] font-semibold text-gray-900'>Popular near your location</h2>
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
            <div ref={thirdRowRef} className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
              {categoryFilteredProperties.map((property) => (
                <PropertyCardWidget 
                  key={`third-${property.id}`} 
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onFavoriteToggle={toggleFavorite}
                  onViewDetails={() => navigate(`/property-details/${property.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Popular Locations Section */}
        <div className='mb-1'>
          <h2 className='text-[24px] font-semibold text-gray-900 mb-6'>Popular locations</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
            {popularLocations.map((location, index) => (
              <button
                key={index}
                className='text-left px-4 py-3 hover:bg-gray-100 
                   rounded-lg text-[16px] font-medium text-gray-700 transition-colors'
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

export default ExploreView