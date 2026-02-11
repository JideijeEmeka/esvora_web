import React, { useState, useRef, useEffect } from 'react'
import { X, Plus, Minus } from 'lucide-react'
import { NIGERIAN_STATES_SORTED, PROPERTY_TYPES_SORTED, FURNISHING_TYPES_SORTED } from '../lib/constants'

const FilterPropertiesWidget = ({ isOpen, onClose, onApply }) => {
	const [priceRange, setPriceRange] = useState([0, 1000000])
	const [propertyType, setPropertyType] = useState('')
	const [bedrooms, setBedrooms] = useState(0)
	const [bathrooms, setBathrooms] = useState(0)
	const [furnishing, setFurnishing] = useState('')
	const [state, setState] = useState('')
	const [propertyRange, setPropertyRange] = useState('')
	
	const minPriceRef = useRef(null)
	const maxPriceRef = useRef(null)
	const sliderRef = useRef(null)
	const isDraggingRef = useRef(false)
	const dragTypeRef = useRef(null) // 'min' or 'max'

	// Format currency
	const formatCurrency = (value) => {
		// Format as whole number (no decimals) for better readability
		return `₦${value.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
	}

	// Handle price range slider drag
	const handleMinDragStart = (e) => {
		e.preventDefault()
		isDraggingRef.current = true
		dragTypeRef.current = 'min'
		
		const handleMouseMove = (e) => {
			if (!sliderRef.current) return
			const rect = sliderRef.current.getBoundingClientRect()
			const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
			const value = Math.round((percentage / 100) * 1000000)

			setPriceRange((prev) => {
				const newMin = Math.min(value, prev[1] - 10000)
				return [newMin, prev[1]]
			})
		}

		const handleMouseUp = () => {
			isDraggingRef.current = false
			dragTypeRef.current = null
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	const handleMaxDragStart = (e) => {
		e.preventDefault()
		isDraggingRef.current = true
		dragTypeRef.current = 'max'
		
		const handleMouseMove = (e) => {
			if (!sliderRef.current) return
			const rect = sliderRef.current.getBoundingClientRect()
			const percentage = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100))
			const value = Math.round((percentage / 100) * 1000000)

			setPriceRange((prev) => {
				const newMax = Math.max(value, prev[0] + 10000)
				return [prev[0], newMax]
			})
		}

		const handleMouseUp = () => {
			isDraggingRef.current = false
			dragTypeRef.current = null
			document.removeEventListener('mousemove', handleMouseMove)
			document.removeEventListener('mouseup', handleMouseUp)
		}

		document.addEventListener('mousemove', handleMouseMove)
		document.addEventListener('mouseup', handleMouseUp)
	}

	const minPercentage = (priceRange[0] / 1000000) * 100
	const maxPercentage = (priceRange[1] / 1000000) * 100

	const handleApply = () => {
		const filters = {
			...(priceRange[0] !== 0 || priceRange[1] !== 1000000 ? { priceRange } : {}),
			...(propertyType && { propertyType }),
			...(bedrooms > 0 && { bedrooms }),
			...(bathrooms > 0 && { bathrooms }),
			...(furnishing && { furnishing }),
			...(state && { state }),
			...(propertyRange && { propertyRange })
		}
		if (onApply) {
			onApply(filters)
		}
		if (onClose) {
			onClose()
		}
	}

	const handleReset = () => {
		setPriceRange([0, 1000000])
		setPropertyType('')
		setBedrooms(0)
		setBathrooms(0)
		setFurnishing('')
		setState('')
		setPropertyRange('')
		if (onClose) {
			onClose()
		}
	}

	// Prevent body scroll when modal is open
	useEffect(() => {
		if (isOpen) {
			// Store the original styles
			const originalOverflow = document.body.style.overflow
			const originalPosition = document.body.style.position
			const originalTop = document.body.style.top
			const scrollY = window.scrollY
			
			// Prevent scrolling
			document.body.style.overflow = 'hidden'
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'
			
			return () => {
				// Restore original styles
				document.body.style.overflow = originalOverflow || ''
				document.body.style.position = originalPosition || ''
				document.body.style.top = originalTop || ''
				document.body.style.width = ''
				// Restore scroll position
				window.scrollTo(0, scrollY)
			}
		}
	}, [isOpen])

	if (!isOpen) return null

	return (
		<div 
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div 
				className='bg-white rounded-4xl shadow-2xl w-[90%] scrollbar-hide max-w-4xl max-h-[90vh] overflow-y-auto'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<h2 className='text-[24px] font-semibold text-gray-900'>Filter</h2>
					<button
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
					>
						<X className='w-5 h-5 text-gray-700' />
					</button>
				</div>

				{/* Content */}
				<div className='p-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
						{/* Left Column */}
						<div className='space-y-6'>
							{/* Price */}
							<div>
								<label className='block text-[16px] font-medium text-gray-700 mb-3'>
									Price
								</label>
								<div className='mb-4'>
									<input
										type='text'
										value={`${formatCurrency(priceRange[0])} - ${formatCurrency(priceRange[1])}`}
										readOnly
										className='w-full px-4 py-3 text-[16px] border border-gray-300 font-medium text-gray-500
										    rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'
									/>
								</div>
								<div className='relative h-2 bg-gray-200 rounded-full' ref={sliderRef}>
									{/* Track */}
									<div 
										className='absolute h-full bg-primary rounded-full'
										style={{
											left: `${minPercentage}%`,
											width: `${maxPercentage - minPercentage}%`
										}}
									/>
									{/* Min Handle */}
									<div
										className='absolute w-5 h-5 bg-primary rounded-full cursor-grab 
										   active:cursor-grabbing shadow-md transform -translate-x-1/2 
										   -translate-y-1/2 top-1/2 hover:scale-110 transition-transform'
										style={{ left: `${minPercentage}%` }}
										onMouseDown={handleMinDragStart}
									/>
									{/* Max Handle */}
									<div
										className='absolute w-5 h-5 bg-primary rounded-full cursor-grab 
										  active:cursor-grabbing shadow-md transform -translate-x-1/2 
										  -translate-y-1/2 top-1/2 hover:scale-110 transition-transform'
										style={{ left: `${maxPercentage}%` }}
										onMouseDown={handleMaxDragStart}
									/>
								</div>
								<div className='flex justify-between mt-2 text-[14px] text-gray-500'>
									<span>₦0</span>
									<span>₦1,000,000 +</span>
								</div>
							</div>

							{/* Property Type */}
							<div>
							    <label className='block text-[20px] font-semibold text-gray-900 mb-3'>
									Property
								</label>
								<label className='block text-[16px] font-medium text-gray-700 mb-3'>
									Property type
								</label>
								<select
									value={propertyType}
									onChange={(e) => setPropertyType(e.target.value)}
									className='w-full px-4 py-3 text-[16px] border border-gray-300 rounded-lg 
									bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'
								>
									<option value=''>Select the category of property</option>
									{PROPERTY_TYPES_SORTED.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</select>
							</div>

							{/* Bedrooms */}
							<div>
								<label className='block text-[16px] font-medium text-gray-700 mb-3'>
									Bedrooms
								</label>
								<div className='flex items-center justify-between gap-4 border border-gray-300 rounded-full p-2'>
									<button
										onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
										className='w-10 h-10 rounded-full border border-gray-300 flex items-center 
										justify-center hover:bg-gray-200 transition-colors
										disabled:cursor-not-allowed bg-gray-300' 
										disabled={bedrooms === 0}
									>
										<Minus className='w-5 h-5 text-gray-700' />
									</button>
									<input
										type='number'
										value={bedrooms}
										onChange={(e) => {
											const value = parseInt(e.target.value) || 0
											setBedrooms(Math.max(0, value))
										}}
										className='w-20 text-center text-[18px] font-medium text-gray-900 border-0 focus:outline-none appearance-none'
									/>
									<button
										onClick={() => setBedrooms(bedrooms + 1)}
										className='w-10 h-10 rounded-full border border-gray-300 flex items-center 
										justify-center hover:bg-gray-200 transition-colors bg-gray-300'
									>
										<Plus className='w-5 h-5 text-gray-700' />
									</button>
								</div>
							</div>

							{/* Bathrooms */}
							<div>
								<label className='block text-[16px] font-medium text-gray-700 mb-3'>
									Bathrooms
								</label>
								<div className='flex items-center gap-4 border border-gray-300 rounded-full p-2 justify-between'>
									<button
										onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}
										className='w-10 h-10 rounded-full border border-gray-300 flex 
										items-center justify-center hover:bg-gray-200 transition-colors 
										disabled:cursor-not-allowed bg-gray-300'
										disabled={bathrooms === 0}
									>
										<Minus className='w-5 h-5 text-gray-700' />
									</button>
									<input
										type='number'
										value={bathrooms}
										onChange={(e) => {
											const value = parseInt(e.target.value) || 0
											setBathrooms(Math.max(0, value))
										}}
										className='w-20 text-center text-[18px] font-medium text-gray-900 
										border-0 focus:outline-none appearance-none'
									/>
									<button
										onClick={() => setBathrooms(bathrooms + 1)}
										className='w-10 h-10 rounded-full border border-gray-300 flex 
										  items-center justify-center hover:bg-gray-200 transition-colors bg-gray-300'
									>
										<Plus className='w-5 h-5 text-gray-700' />
									</button>
								</div>
							</div>

							{/* Furnishing */}
							<div>
								<label className='block text-[16px] font-medium text-gray-700 mb-3'>
									Furnishing
								</label>
								<select
									value={furnishing}
									onChange={(e) => setFurnishing(e.target.value)}
									className='w-full px-4 py-3 text-[16px] border border-gray-300 rounded-lg 
									    bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'
								>
									<option value=''>Select category</option>
									{FURNISHING_TYPES_SORTED.map((type) => (
										<option key={type.value} value={type.value}>
											{type.label}
										</option>
									))}
								</select>
							</div>
						</div>

						{/* Right Column */}
						<div className='space-y-6'>
							{/* State */}
							<div>
								<label className='block text-[16px] font-medium text-gray-700 mb-3'>
									Location
								</label>
								<label className='block text-[16px] font-medium text-gray-700 mb-2'>
									State
								</label>
								<select
									value={state}
									onChange={(e) => setState(e.target.value)}
									className='w-full px-4 py-3 text-[16px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'
								>
									<option value=''>Select state</option>
									{NIGERIAN_STATES_SORTED.map((stateOption) => (
										<option key={stateOption.value} value={stateOption.value}>
											{stateOption.label}
										</option>
									))}
								</select>
							</div>

							{/* Property Range */}
							<div>
								<label className='block text-[16px] font-medium text-gray-700 mb-3'>
									Property range
								</label>
								<select
									value={propertyRange}
									onChange={(e) => setPropertyRange(e.target.value)}
									className='w-full px-4 py-3 text-[16px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20'
								>
									<option value=''>Select range</option>
									<option value='0-50000'>₦0 - ₦50,000</option>
									<option value='50000-100000'>₦50,000 - ₦100,000</option>
									<option value='100000-200000'>₦100,000 - ₦200,000</option>
									<option value='200000-500000'>₦200,000 - ₦500,000</option>
									<option value='500000-1000000'>₦500,000 - ₦1,000,000</option>
									<option value='1000000+'>₦1,000,000 +</option>
								</select>
							</div>
						</div>
					</div>
				</div>

				{/* Footer Actions */}
				<div className='p-6 border-t border-gray-200 flex items-center justify-end gap-4'>
					<button
						type='button'
						onClick={handleReset}
						className='px-6 py-3 text-[16px] font-medium text-primary border border-primary 
						  rounded-lg hover:bg-primary/5 transition-colors'
					>
						Reset
					</button>
					<button
						type='button'
						onClick={handleApply}
						className='px-8 py-3 bg-primary text-white text-[16px] font-medium 
						   rounded-lg hover:bg-primary/90 transition-colors'
					>
						Apply
					</button>
				</div>
			</div>
		</div>
	)
}

export default FilterPropertiesWidget
