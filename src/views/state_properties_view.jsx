import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import PropertyCardWidget from '../components/property_card_widget'
import Loader from '../components/loader'
import { Search, Filter, ChevronLeft, X, RefreshCw } from 'lucide-react'
import { getStateLabel } from '../lib/constants'
import propertyController from '../controllers/property_controller'
import { normalizeProperties } from '../lib/propertyUtils'

const emptyFilters = () => ({
	listingType: '',
	city: '',
	minPrice: '',
	maxPrice: ''
})

const LISTING_OPTIONS = [
	{ value: '', label: 'All' },
	{ value: 'rent', label: 'Rent' },
	{ value: 'shortlet', label: 'Shortlet' },
	{ value: 'sales', label: 'Sales' }
]

/** Keep only digits for filter state / API. */
const priceDigitsOnly = (value) => value.replace(/\D/g, '')

/** Display grouped thousands (e.g. 1,000,000). Empty when no digits. */
const formatPriceDisplay = (digits) => {
	if (!digits) return ''
	const n = Number(digits)
	if (!Number.isFinite(n) || n < 0) return ''
	return n.toLocaleString('en-NG')
}

/**
 * /api/v1/search often ignores `property_type`; infer listing category from API fields
 * so Rent / Shortlet / Sales filters match Buy/Rent/Shortlet views.
 */
function propertyMatchesListingType(property, listingType) {
	if (!listingType) return true

	let pt = property.propertyType ?? property.property_type
	if (pt && typeof pt === 'object') pt = pt.name ?? pt.slug ?? ''
	const typeStr = String(pt ?? '').toLowerCase()

	const text = [
		typeStr,
		String(property.type ?? '').toLowerCase(),
		String(property.listing_type ?? '').toLowerCase(),
		String(property.property_type_summary ?? '').toLowerCase(),
		String(property.title ?? '').toLowerCase()
	].join(' ')

	const isShortlet = text.includes('shortlet')
	const isSales =
		typeStr.includes('sales') ||
		typeStr === 'sale' ||
		text.includes('for sale') ||
		/\bsales\b/.test(text)
	const isRent =
		typeStr === 'rent' ||
		(typeStr.includes('rent') && !isShortlet && !typeStr.includes('sale') && !typeStr.includes('sales')) ||
		/\bfor rent\b/.test(text) ||
		/\bto let\b/.test(text)

	if (listingType === 'shortlet') return isShortlet
	if (listingType === 'sales') return isSales && !isShortlet
	if (listingType === 'rent') return isRent && !isShortlet && !isSales
	return true
}

const StatePropertiesView = () => {
	const { state: stateParam } = useParams()
	const navigate = useNavigate()

	const stateKey = useMemo(() => {
		if (!stateParam) return ''
		try {
			return decodeURIComponent(stateParam)
		} catch {
			return stateParam
		}
	}, [stateParam])

	const displayStateName = useMemo(() => {
		if (!stateKey) return ''
		return getStateLabel(stateKey) || stateKey
	}, [stateKey])

	const [properties, setProperties] = useState([])
	const [loading, setLoading] = useState(true)
	const [searchQuery, setSearchQuery] = useState('')
	const [debouncedSearch, setDebouncedSearch] = useState('')
	const [filterOpen, setFilterOpen] = useState(false)
	const [draftFilters, setDraftFilters] = useState(emptyFilters)
	const [appliedFilters, setAppliedFilters] = useState(emptyFilters)
	const [favorites, setFavorites] = useState(() => new Set())
	const [isRefreshing, setIsRefreshing] = useState(false)
	const [pullPx, setPullPx] = useState(0)
	const fetchListRef = useRef(null)

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [stateParam])

	useEffect(() => {
		const t = setTimeout(() => setDebouncedSearch(searchQuery.trim()), 400)
		return () => clearTimeout(t)
	}, [searchQuery])

	const buildApiParams = useCallback(() => {
		const stateForApi = getStateLabel(stateKey) || stateKey
		const p = { state: stateForApi }
		if (debouncedSearch) p.search = debouncedSearch
		if (appliedFilters.city.trim()) p.city = appliedFilters.city.trim()
		if (appliedFilters.listingType) p.property_type = appliedFilters.listingType
		const min = appliedFilters.minPrice === '' ? NaN : Number(appliedFilters.minPrice)
		const max = appliedFilters.maxPrice === '' ? NaN : Number(appliedFilters.maxPrice)
		if (!Number.isNaN(min) && appliedFilters.minPrice !== '') p.min_price = min
		if (!Number.isNaN(max) && appliedFilters.maxPrice !== '') p.max_price = max
		return p
	}, [stateKey, debouncedSearch, appliedFilters])

	const fetchList = useCallback(
		(opts = {}) => {
			const { silent = false } = opts
			if (!stateKey) return Promise.resolve()
			if (silent) {
				setIsRefreshing(true)
			} else {
				setLoading(true)
			}
			const params = buildApiParams()
			return propertyController
				.filterProperties(params, {
					skipStoreUpdate: true,
					forceRefetch: true,
					onSuccess: (list) => setProperties(Array.isArray(list) ? list : []),
					onError: () => setProperties([])
				})
				.finally(() => {
					if (silent) setIsRefreshing(false)
					else setLoading(false)
				})
		},
		[stateKey, buildApiParams]
	)

	useEffect(() => {
		fetchListRef.current = fetchList
	}, [fetchList])

	useEffect(() => {
		let startY = 0
		let tracking = false
		let lastPull = 0

		const onTouchStart = (e) => {
			if (filterOpen || isRefreshing || loading) return
			if (window.scrollY > 8) return
			startY = e.touches[0].clientY
			tracking = true
			lastPull = 0
		}

		const onTouchMove = (e) => {
			if (!tracking || filterOpen) return
			if (window.scrollY > 8) {
				tracking = false
				setPullPx(0)
				return
			}
			const dy = e.touches[0].clientY - startY
			if (dy > 0) {
				const damped = Math.min(dy * 0.42, 88)
				lastPull = damped
				setPullPx(damped)
				if (damped > 14) e.preventDefault()
			}
		}

		const endPull = () => {
			if (!tracking) return
			tracking = false
			const shouldRun = lastPull > 44
			lastPull = 0
			setPullPx(0)
			if (shouldRun) fetchListRef.current?.({ silent: true })
		}

		const onTouchEnd = () => endPull()
		const onTouchCancel = () => endPull()

		document.documentElement.addEventListener('touchstart', onTouchStart, { passive: true })
		document.documentElement.addEventListener('touchmove', onTouchMove, { passive: false })
		document.documentElement.addEventListener('touchend', onTouchEnd)
		document.documentElement.addEventListener('touchcancel', onTouchCancel)
		return () => {
			document.documentElement.removeEventListener('touchstart', onTouchStart)
			document.documentElement.removeEventListener('touchmove', onTouchMove)
			document.documentElement.removeEventListener('touchend', onTouchEnd)
			document.documentElement.removeEventListener('touchcancel', onTouchCancel)
		}
	}, [filterOpen, isRefreshing, loading])

	const handleManualRefresh = () => {
		if (!stateKey || loading || isRefreshing) return
		fetchList({ silent: true })
	}

	useEffect(() => {
		if (!stateKey) {
			navigate('/explore', { replace: true })
			return
		}
		fetchList()
	}, [stateKey, fetchList, navigate])

	const normalized = useMemo(() => normalizeProperties(properties), [properties])

	const displayProperties = useMemo(() => {
		if (!appliedFilters.listingType) return normalized
		return normalized.filter((p) => propertyMatchesListingType(p, appliedFilters.listingType))
	}, [normalized, appliedFilters.listingType])

	const hasAppliedFilters = Boolean(
		appliedFilters.listingType ||
			appliedFilters.city.trim() ||
			appliedFilters.minPrice !== '' ||
			appliedFilters.maxPrice !== ''
	)

	const openFilter = () => {
		setDraftFilters({ ...appliedFilters })
		setFilterOpen(true)
	}

	const applyFilter = () => {
		setAppliedFilters({ ...draftFilters })
		setFilterOpen(false)
	}

	const clearFilter = () => {
		setDraftFilters(emptyFilters())
		setAppliedFilters(emptyFilters())
		setFilterOpen(false)
	}

	const toggleFavorite = (id) => {
		setFavorites((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	return (
		<>
			<Navbar />
			<div className='min-h-screen bg-gray-50 pb-16 pt-30 px-4 md:px-16 lg:px-20 relative'>
				<div
					className='fixed left-0 right-0 top-0 z-55 h-1 overflow-hidden pointer-events-none'
					aria-hidden={!isRefreshing}
				>
					{isRefreshing && (
						<div
							className='h-full w-full bg-primary/25 relative'
							role='status'
							aria-live='polite'
							aria-busy='true'
						>
							<span className='sr-only'>Refreshing properties</span>
							<div className='absolute inset-y-0 left-0 w-1/2 bg-primary esvora-refresh-shimmer' />
						</div>
					)}
				</div>

				<div
					className='flex justify-center overflow-hidden transition-[height,opacity] duration-150 ease-out pointer-events-none'
					style={{
						height: Math.max(pullPx > 2 ? pullPx : 0, isRefreshing && !loading ? 44 : 0),
						opacity: pullPx > 2 || (isRefreshing && !loading) ? 1 : 0
					}}
					aria-hidden
				>
					<div className='pt-1'>
						<Loader size={28} speedMultiplier={isRefreshing ? 1 : 0.85} />
					</div>
				</div>

				<button
					type='button'
					onClick={() => navigate('/explore')}
					className='flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 text-[15px] font-medium'
				>
					<ChevronLeft className='w-5 h-5' />
					Back to Explore
				</button>

				<h1 className='text-[28px] md:text-[34px] font-bold text-gray-900 mb-2'>
					Properties in {displayStateName}
				</h1>
				<p className='text-gray-500 text-[15px] mb-8'>
					Search and filter listings in this state.
				</p>

				<div className='flex flex-col sm:flex-row gap-3 mb-8 max-w-4xl'>
					<div className='flex-1 relative'>
						<Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500' />
						<input
							type='search'
							placeholder='Search properties…'
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className='w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20'
						/>
					</div>
					<div className='flex gap-3 sm:shrink-0'>
						<button
							type='button'
							onClick={handleManualRefresh}
							disabled={loading || isRefreshing}
							className='inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none'
							aria-label='Refresh list'
							title='Refresh list'
						>
							<RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
							<span className='sm:hidden'>Refresh</span>
						</button>
						<button
							type='button'
							onClick={openFilter}
							className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border font-medium transition-colors flex-1 sm:flex-initial ${
								hasAppliedFilters
									? 'border-primary bg-primary/10 text-primary'
									: 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
							}`}
						>
							<Filter className='w-5 h-5' />
							Filter
							{hasAppliedFilters && (
								<span className='ml-1 w-2 h-2 rounded-full bg-primary' aria-hidden />
							)}
						</button>
					</div>
				</div>

				{loading ? (
					<div className='flex justify-center py-20'>
						<Loader />
					</div>
				) : displayProperties.length === 0 ? (
					<p className='text-gray-500 text-center py-16'>No properties match your criteria.</p>
				) : (
					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
						{displayProperties.map((property) => (
							<PropertyCardWidget
								key={property.id}
								property={property}
								fillWidth
								isFavorite={favorites.has(property.id)}
								onFavoriteToggle={toggleFavorite}
								onViewDetails={() => navigate(`/property-details/${property.id}`)}
							/>
						))}
					</div>
				)}
			</div>

			{filterOpen && (
				<div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40'>
					<div
						className='bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto'
						role='dialog'
						aria-modal='true'
						aria-labelledby='state-filter-title'
					>
						<div className='flex items-center justify-between p-4 border-b border-gray-100'>
							<h2 id='state-filter-title' className='text-lg font-semibold text-gray-900'>
								Filters
							</h2>
							<button
								type='button'
								onClick={() => setFilterOpen(false)}
								className='p-2 rounded-full hover:bg-gray-100 text-gray-600'
								aria-label='Close'
							>
								<X className='w-5 h-5' />
							</button>
						</div>
						<div className='p-4 space-y-6'>
							<div>
								<p className='text-sm font-medium text-gray-700 mb-2'>Listing type</p>
								<div className='flex flex-wrap gap-2'>
									{LISTING_OPTIONS.map((opt) => (
										<button
											key={opt.value || 'all'}
											type='button'
											onClick={() =>
												setDraftFilters((d) => ({ ...d, listingType: opt.value }))
											}
											className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
												draftFilters.listingType === opt.value
													? 'border-primary bg-primary text-white'
													: 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
											}`}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
							<div>
								<label htmlFor='filter-city' className='text-sm font-medium text-gray-700 block mb-2'>
									City
								</label>
								<input
									id='filter-city'
									type='text'
									placeholder='e.g. Wuse'
									value={draftFilters.city}
									onChange={(e) =>
										setDraftFilters((d) => ({ ...d, city: e.target.value }))
									}
									className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20'
								/>
							</div>
							<div className='grid grid-cols-2 gap-3'>
								<div>
									<label htmlFor='filter-min' className='text-sm font-medium text-gray-700 block mb-2'>
										Min price (₦)
									</label>
									<input
										id='filter-min'
										type='text'
										inputMode='numeric'
										autoComplete='off'
										placeholder='e.g. 500,000'
										value={formatPriceDisplay(draftFilters.minPrice)}
										onChange={(e) =>
											setDraftFilters((d) => ({
												...d,
												minPrice: priceDigitsOnly(e.target.value)
											}))
										}
										className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20'
									/>
								</div>
								<div>
									<label htmlFor='filter-max' className='text-sm font-medium text-gray-700 block mb-2'>
										Max price (₦)
									</label>
									<input
										id='filter-max'
										type='text'
										inputMode='numeric'
										autoComplete='off'
										placeholder='e.g. 50,000,000'
										value={formatPriceDisplay(draftFilters.maxPrice)}
										onChange={(e) =>
											setDraftFilters((d) => ({
												...d,
												maxPrice: priceDigitsOnly(e.target.value)
											}))
										}
										className='w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20'
									/>
								</div>
							</div>
						</div>
						<div className='p-4 border-t border-gray-100 flex gap-3'>
							<button
								type='button'
								onClick={clearFilter}
								className='flex-1 py-3 rounded-xl border border-gray-200 font-medium text-gray-700 hover:bg-gray-50'
							>
								Clear all
							</button>
							<button
								type='button'
								onClick={applyFilter}
								className='flex-1 py-3 rounded-xl bg-primary text-white font-medium hover:bg-primary/90'
							>
								Apply
							</button>
						</div>
					</div>
				</div>
			)}

			<Footer />
		</>
	)
}

export default StatePropertiesView
