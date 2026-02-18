import React, { useState, useRef, useMemo } from 'react'
import Navbar from '../components/navbar'
import FilterPropertiesWidget from '../components/filter_properties_widget'
import Footer from '../components/footer'
import PropertyCardWidget from '../components/property_card_widget'
import { Search, Filter, ChevronLeft, ChevronRight, X, MapIcon } from 'lucide-react'
import { getPropertyTypeLabel, getStateLabel, getFurnishingLabel } from '../lib/constants'
import { useNavigate } from 'react-router-dom'

const ExploreView = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState(new Set())
  const [selectedCategory, setSelectedCategory] = useState('Popular apartments')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(null)
  const firstRowRef = useRef(null)
  const secondRowRef = useRef(null)
  const thirdRowRef = useRef(null)
  const categoryRef = useRef(null)
  const filteredResultsRef = useRef(null)
  const navigate = useNavigate()

  // Sample property data - expanded for pagination
  const allProperties = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      price: '€120,500',
      priceValue: 120500,
      description: '4 bedroom modern bungalow apartment',
      location: 'Ikoyi, Lagos, Nigeria',
      propertyType: 'bungalow',
      bedrooms: 4,
      bathrooms: 3,
      furnishing: 'furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      price: '€95,000',
      priceValue: 95000,
      description: '3 bedroom luxury apartment',
      location: 'Victoria Island, Lagos, Nigeria',
      propertyType: 'apartment',
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      price: '€150,000',
      priceValue: 150000,
      description: '5 bedroom detached house',
      location: 'Lekki, Lagos, Nigeria',
      propertyType: 'house',
      bedrooms: 5,
      bathrooms: 4,
      furnishing: 'semi-furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      price: '€80,000',
      priceValue: 80000,
      description: '2 bedroom cozy apartment',
      location: 'Surulere, Lagos, Nigeria',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      furnishing: 'unfurnished',
      state: 'lagos',
      available: true
    },
    {
      id: 5,
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
      price: '€110,000',
      priceValue: 110000,
      description: '3 bedroom modern townhouse',
      location: 'Gbagada, Lagos, Nigeria',
      propertyType: 'townhouse',
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 6,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      price: '€135,000',
      priceValue: 135000,
      description: '4 bedroom contemporary villa',
      location: 'Banana Island, Lagos, Nigeria',
      propertyType: 'villa',
      bedrooms: 4,
      bathrooms: 3,
      furnishing: 'furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 7,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
      price: '€105,000',
      priceValue: 105000,
      description: '3 bedroom penthouse apartment',
      location: 'Yaba, Lagos, Nigeria',
      propertyType: 'penthouse',
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 8,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
      price: '€90,000',
      priceValue: 90000,
      description: '2 bedroom studio apartment',
      location: 'Ikeja, Lagos, Nigeria',
      propertyType: 'studio',
      bedrooms: 2,
      bathrooms: 1,
      furnishing: 'semi-furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 9,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
      price: '€125,000',
      priceValue: 125000,
      description: '4 bedroom duplex',
      location: 'Magodo, Lagos, Nigeria',
      propertyType: 'duplex',
      bedrooms: 4,
      bathrooms: 3,
      furnishing: 'furnished',
      state: 'lagos',
      available: true
    },
    {
      id: 10,
      image: 'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=400',
      price: '€115,000',
      priceValue: 115000,
      description: '3 bedroom bungalow',
      location: 'Isolo, Lagos, Nigeria',
      propertyType: 'bungalow',
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'unfurnished',
      state: 'lagos',
      available: true
    },
    {
      id: 11,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      price: '€200,000',
      priceValue: 200000,
      description: '5 bedroom luxury duplex',
      location: 'Wuse, Abuja, Nigeria',
      propertyType: 'duplex',
      bedrooms: 5,
      bathrooms: 4,
      furnishing: 'furnished',
      state: 'fct',
      available: true
    },
    {
      id: 12,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      price: '€75,000',
      priceValue: 75000,
      description: '2 bedroom apartment',
      location: 'Port Harcourt, Rivers, Nigeria',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      furnishing: 'semi-furnished',
      state: 'rivers',
      available: true
    },
    {
      id: 13,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      price: '€180,000',
      priceValue: 180000,
      description: '4 bedroom modern house',
      location: 'Kano, Kano, Nigeria',
      propertyType: 'house',
      bedrooms: 4,
      bathrooms: 3,
      furnishing: 'furnished',
      state: 'kano',
      available: true
    },
    {
      id: 14,
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
      price: '€65,000',
      priceValue: 65000,
      description: '1 bedroom studio',
      location: 'Ibadan, Oyo, Nigeria',
      propertyType: 'studio',
      bedrooms: 1,
      bathrooms: 1,
      furnishing: 'unfurnished',
      state: 'oyo',
      available: true
    },
    {
      id: 15,
      image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
      price: '€140,000',
      priceValue: 140000,
      description: '3 bedroom bungalow',
      location: 'Benin City, Edo, Nigeria',
      propertyType: 'bungalow',
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'furnished',
      state: 'edo',
      available: true
    },
    {
      id: 16,
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      price: '€220,000',
      priceValue: 220000,
      description: '6 bedroom mansion',
      location: 'Asokoro, Abuja, Nigeria',
      propertyType: 'house',
      bedrooms: 6,
      bathrooms: 5,
      furnishing: 'furnished',
      state: 'fct',
      available: true
    },
    {
      id: 17,
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
      price: '€85,000',
      priceValue: 85000,
      description: '2 bedroom apartment',
      location: 'Kaduna, Kaduna, Nigeria',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      furnishing: 'semi-furnished',
      state: 'kaduna',
      available: true
    },
    {
      id: 18,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
      price: '€95,000',
      priceValue: 95000,
      description: '3 bedroom townhouse',
      location: 'Enugu, Enugu, Nigeria',
      propertyType: 'townhouse',
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'furnished',
      state: 'enugu',
      available: true
    },
    {
      id: 19,
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
      price: '€100,000',
      priceValue: 100000,
      description: '3 bedroom duplex',
      location: 'Awka, Anambra, Nigeria',
      propertyType: 'duplex',
      bedrooms: 3,
      bathrooms: 2,
      furnishing: 'furnished',
      state: 'anambra',
      available: true
    },
    {
      id: 20,
      image: 'https://images.unsplash.com/photo-1600585154526-990dbe4eb5a3?w=400',
      price: '€70,000',
      priceValue: 70000,
      description: '2 bedroom bungalow',
      location: 'Calabar, Cross River, Nigeria',
      propertyType: 'bungalow',
      bedrooms: 2,
      bathrooms: 1,
      furnishing: 'unfurnished',
      state: 'cross-river',
      available: true
    },
    {
      id: 21,
      image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      price: '€160,000',
      priceValue: 160000,
      description: '4 bedroom villa',
      location: 'Maitama, Abuja, Nigeria',
      propertyType: 'villa',
      bedrooms: 4,
      bathrooms: 3,
      furnishing: 'furnished',
      state: 'fct',
      available: true
    },
    {
      id: 22,
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      price: '€88,000',
      priceValue: 88000,
      description: '2 bedroom apartment',
      location: 'Jos, Plateau, Nigeria',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      furnishing: 'semi-furnished',
      state: 'plateau',
      available: true
    },
    {
      id: 23,
      image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      price: '€130,000',
      priceValue: 130000,
      description: '4 bedroom duplex',
      location: 'Onitsha, Anambra, Nigeria',
      propertyType: 'duplex',
      bedrooms: 4,
      bathrooms: 3,
      furnishing: 'furnished',
      state: 'anambra',
      available: true
    }
  ]

  const scrollProperties = (ref, direction) => {
    if (!ref.current) return
    
    const cardWidth = 280 // Width of each card
    const gap = 16 // Gap between cards (gap-4 = 16px)
    const cardWithGap = cardWidth + gap
    
    // Check if mobile view (window width < 768px)
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
    setActiveFilters(filters)
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
  }

  const handleClearAllFilters = () => {
    setActiveFilters(null)
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

      // Property type filter
      if (activeFilters.propertyType && property.propertyType !== activeFilters.propertyType) {
        return false
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

      // State filter
      if (activeFilters.state && property.state !== activeFilters.state) {
        return false
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
            backgroundImage: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200)',
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
                  className='flex items-center gap-2 px-4 py-3 bg-white/95 cursor-pointer
                    backdrop-blur-sm border border-gray-300 rounded-full hover:bg-white transition-colors'
                >
                <Filter className='w-5 h-5 text-gray-700' />
                <span className='text-[16px] font-medium text-gray-700'>Filter</span>
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
            <button
              onClick={handleClearAllFilters}
              className='px-4 py-2 text-[14px] font-medium text-gray-600 hover:text-primary transition-colors'
            >
              Clear all
            </button>
          </div>
        )}

        {/* Filtered Results Section */}
        {activeFilters && (
          <div className='mb-12'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-[24px] font-semibold text-gray-900'>
                Showing results for {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'}
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
            {filteredProperties.length > 0 ? (
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

        {/* Property Listings */}
        <div className='mb-12'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-[24px] font-semibold text-gray-900'>Popular near your location</h2>
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
          <div ref={firstRowRef} className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'>
            {allProperties.map((property) => (
              <PropertyCardWidget 
                key={property.id}
                property={property}
                isFavorite={favorites.has(property.id)}
                onFavoriteToggle={toggleFavorite}
                onViewDetails={() => navigate(`/property-details/${property.id}`)}
              />
            ))}
          </div>
        </div>

        {/* Second Row of Property Listings */}
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
              {allProperties.map((property) => (
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

        {/* Third Row of Property Listings */}
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
              {allProperties.map((property) => (
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

        {/* Category Buttons Section */}
        <div className='mb-12 mt-12'>
          <div className='flex items-center justify-between mb-6'>
            <h2 className='text-[24px] font-semibold text-gray-900'>Find affordable properties near you!</h2>
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