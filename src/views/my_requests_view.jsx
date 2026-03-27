import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import propertyController from '../controllers/property_controller'
import { selectMyRequests, selectProperties } from '../redux/slices/propertySlice'
import { normalizeMyRequest, normalizeProperties } from '../lib/propertyUtils'
import SortRequestsBottomSheet from '../components/sort_requests_bottom_sheet'
import Loader from '../components/loader'
import { SlidersHorizontal } from 'lucide-react'

const TABS = [
	{ id: 'all', label: 'All' },
	{ id: 'scheduled', label: 'Scheduled' },
	{ id: 'reservation', label: 'Reservation' }
]

/** Matches Flutter sort_inspection_schedule_bottom_sheet: All, Rent, Sales, Shortlet */
const INSPECTION_TYPE_FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'rent', label: 'Rent' },
	{ id: 'sales', label: 'Sales' },
	{ id: 'shortlet', label: 'Shortlet' }
]

function getStatusDisplay(status) {
	const s = (status ?? '').toLowerCase()
	if (s === 'accepted' || s === 'approved' || s === 'rented') return { label: 'Approved', key: 'approved' }
	if (s === 'declined' || s === 'rejected') return { label: 'Declined', key: 'declined' }
	return { label: 'Pending', key: 'pending' }
}

function getStatusKey(status) {
	return getStatusDisplay(status).key
}

function filterAndSortRequests(list, sortBy) {
	let arr = [...list]

	if (sortBy === 'status_pending') {
		arr = arr.filter((r) => getStatusKey(r.status) === 'pending')
	} else if (sortBy === 'status_approved') {
		arr = arr.filter((r) => getStatusKey(r.status) === 'approved')
	} else if (sortBy === 'status_declined') {
		arr = arr.filter((r) => getStatusKey(r.status) === 'declined')
	}

	if (sortBy === 'newest' || sortBy === 'oldest') {
		arr.sort((a, b) => {
			const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
			const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
			return sortBy === 'newest' ? bDate - aDate : aDate - bDate
		})
	} else if (sortBy === 'price_low' || sortBy === 'price_high') {
		arr.sort((a, b) => {
			const aVal = a.totalAmount ?? 0
			const bVal = b.totalAmount ?? 0
			return sortBy === 'price_low' ? aVal - bVal : bVal - aVal
		})
	} else if (sortBy === 'status_pending' || sortBy === 'status_approved' || sortBy === 'status_declined') {
		arr.sort((a, b) => {
			const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
			const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
			return bDate - aDate
		})
	}
	return arr
}

const requestNavState = (req) => ({
	requestStatus: req.status,
	requestId: req.id,
	requestAmount: req.totalAmount,
	requestPropertySchedules: req.schedules ?? []
})

const MyRequestsView = () => {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('all')
	const [sortBy, setSortBy] = useState('newest')
	const [isSortOpen, setIsSortOpen] = useState(false)
	const [inspectionTypeFilter, setInspectionTypeFilter] = useState('all')
	const myRequestsRaw = useSelector(selectMyRequests)
	const apiProperties = useSelector(selectProperties)

	const allProperties = useMemo(
		() => normalizeProperties(apiProperties) ?? [],
		[apiProperties]
	)

	const scheduledProperties = useMemo(
		() => allProperties.filter((p) => Array.isArray(p.schedules) && p.schedules.length > 0),
		[allProperties]
	)

	const scheduledForTab = useMemo(() => {
		if (inspectionTypeFilter === 'all') return scheduledProperties
		const needle = inspectionTypeFilter.toLowerCase()
		return scheduledProperties.filter((p) => {
			const t = (p.propertyType ?? '').toString().trim().toLowerCase()
			return t === needle || t.includes(needle)
		})
	}, [scheduledProperties, inspectionTypeFilter])

	const allRequests = useMemo(
		() => (myRequestsRaw ?? []).map(normalizeMyRequest).filter(Boolean),
		[myRequestsRaw]
	)

	const filteredRequests = useMemo(() => {
		let list = allRequests
		if (activeTab === 'reservation') {
			list = list.filter((r) => r.type === 'reservation')
		}
		return filterAndSortRequests(list, sortBy)
	}, [allRequests, activeTab, sortBy])

	useEffect(() => {
		let pending = 2
		const done = () => {
			pending -= 1
			if (pending <= 0) setIsLoading(false)
		}
		propertyController.listMyRequests({
			onSuccess: done,
			onError: done
		})
		propertyController.getAllProperties({
			onSuccess: done,
			onError: done
		})
	}, [])

	const handleCardClick = (req, e) => {
		if (e?.target?.closest('button')) return
		if (req?.propertyId) {
			navigate(`/property-details/${req.propertyId}`, {
				state: requestNavState(req)
			})
		}
	}

	const handleCheckProperty = (req, e) => {
		e?.stopPropagation?.()
		if (req?.propertyId) {
			navigate(`/property-details/${req.propertyId}`, {
				state: requestNavState(req)
			})
		}
	}

	const goToPropertySchedules = (property) => {
		navigate(`/property-schedules/${property.id}`, {
			state: {
				schedules: property.schedules ?? [],
				propertyTitle: property.description ?? property.title ?? ''
			}
		})
	}

	const getSortLabel = () => {
		switch (sortBy) {
			case 'oldest': return 'Oldest first'
			case 'price_low': return 'Lowest to Highest'
			case 'price_high': return 'Highest to Lowest'
			case 'status_pending': return 'Pending'
			case 'status_approved': return 'Approved'
			case 'status_declined': return 'Declined'
			default: return 'Newest first'
		}
	}

	const showRequestSort = activeTab !== 'scheduled' && !isLoading && allRequests.length > 0
	const isScheduledTab = activeTab === 'scheduled'

	return (
		<div className="pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white">
			<div className="max-w-4xl mx-auto w-full">
				<h1 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-6">
					My Requests
				</h1>

				<div className="flex flex-wrap items-center justify-between gap-4 mb-6">
					<div className="flex bg-gray-100 rounded-full p-1 w-fit">
						{TABS.map((tab) => (
							<button
								key={tab.id}
								type="button"
								onClick={() => setActiveTab(tab.id)}
								className={`px-5 py-2.5 rounded-full text-[14px] font-semibold transition-colors ${
									activeTab === tab.id ? 'bg-primary text-white' : 'text-gray-600 hover:text-gray-800'
								}`}
							>
								{tab.label}
							</button>
						))}
					</div>
					{isScheduledTab && scheduledForTab.length > 0 && (
						<div className="flex items-center gap-2">
							<SlidersHorizontal className="w-4 h-4 text-gray-600" />
							<select
								value={inspectionTypeFilter}
								onChange={(e) => setInspectionTypeFilter(e.target.value)}
								className="text-[14px] font-medium border border-gray-300 rounded-full px-4 py-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/20"
								aria-label="Filter inspection schedules by property type"
							>
								{INSPECTION_TYPE_FILTERS.map((o) => (
									<option key={o.id} value={o.id}>
										{o.label}
									</option>
								))}
							</select>
						</div>
					)}
					{showRequestSort && (
						<button
							type="button"
							onClick={() => setIsSortOpen(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[14px] font-medium transition-colors ml-auto"
						>
							<SlidersHorizontal className="w-4 h-4" />
							{getSortLabel()}
						</button>
					)}
				</div>

				<SortRequestsBottomSheet
					isOpen={isSortOpen}
					onClose={() => setIsSortOpen(false)}
					value={sortBy}
					onChange={setSortBy}
				/>

				<div className="space-y-4">
					{isLoading ? (
						<div className="flex justify-center py-12">
							<Loader />
						</div>
					) : isScheduledTab ? (
						<>
							<h2 className="text-[20px] font-semibold text-gray-900 mb-2">Inspection schedule</h2>
							{scheduledForTab.length === 0 ? (
								<p className="text-gray-600 py-8">
									No properties with inspection schedules
									{inspectionTypeFilter !== 'all' ? ` (${inspectionTypeFilter})` : ''}.
								</p>
							) : (
								<div className="space-y-4">
									{scheduledForTab.map((property) => {
										const scheduleCount = property.schedules?.length ?? 0
										const img = property.image ?? property.images?.[0]
										return (
											<button
												key={property.id}
												type="button"
												onClick={() => goToPropertySchedules(property)}
												className="w-full text-left rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden"
											>
												<div className="px-4 pt-4 pb-2">
													<span className="inline-block px-3 py-1.5 rounded-full text-[14px] font-semibold bg-primary/15 text-primary">
														{scheduleCount} {scheduleCount === 1 ? 'schedule' : 'schedules'}
													</span>
												</div>
												<div className="flex gap-3 px-4 pb-4 pt-1">
													<div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-gray-100">
														{img ? (
															<img src={img} alt="" className="w-full h-full object-cover" />
														) : null}
													</div>
													<div className="min-w-0 flex-1">
														<p className="text-[18px] font-semibold text-gray-900">{property.price}</p>
														<p className="text-[14px] text-gray-700 line-clamp-2 mt-1">{property.description}</p>
														<p className="text-[13px] text-gray-500 mt-1 line-clamp-1">{property.location}</p>
													</div>
												</div>
											</button>
										)
									})}
								</div>
							)}
						</>
					) : filteredRequests.length === 0 ? (
						<p className="text-gray-600 py-8">
							{activeTab === 'all'
								? 'No requests yet. Browse properties and submit a request to see them here.'
								: `No ${activeTab} requests.`}
						</p>
					) : (
						filteredRequests.map((req) => {
							const statusD = getStatusDisplay(req.status)
							const isReservation = req.type === 'reservation'
							return (
								<div
									key={req.id}
									role="button"
									tabIndex={0}
									onClick={(e) => handleCardClick(req, e)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault()
											handleCardClick(req, e)
										}
									}}
									className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
								>
									<div className="flex items-stretch">
										<div className="relative shrink-0 w-32 min-h-full overflow-hidden rounded-l-xl">
											<img
												src={req.image || 'https://placehold.co/80x120?text=—'}
												alt=""
												className="absolute inset-0 w-full h-full object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
											<div>
												<div className="flex items-center gap-2 mb-2">
													<span className={`inline-block px-2 py-1 rounded-md text-[12px] font-medium ${
														statusD.key === 'approved' ? 'bg-green-100 text-green-800' : statusD.key === 'declined' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'
													}`}>
														{statusD.label}
													</span>
													{req.timeAgo && (
														<span className="text-[12px] text-gray-500">
															{req.timeAgo}
														</span>
													)}
												</div>
												<p className="text-[16px] font-semibold text-gray-900 mb-1">
													{req.summaryTitle ?? req.title ?? 'Request'}
												</p>
												{req.summarySubtitle && (
													<p className="text-[12px] text-gray-600 mb-1 line-clamp-2">
														{req.summarySubtitle}
													</p>
												)}
												{req.landlordName && (
													<p className="text-[12px] text-gray-500">
														Landlord: {req.landlordName}
													</p>
												)}
												{req.priceFormatted && (
													<p className="text-[14px] font-semibold text-primary mt-1">
														{req.priceFormatted}
													</p>
												)}
											</div>
											{isReservation && (
												<button
													type="button"
													onClick={(e) => handleCheckProperty(req, e)}
													className="mt-3 w-full py-2.5 rounded-lg border border-gray-300 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors"
												>
													Check property information
												</button>
											)}
										</div>
									</div>
								</div>
							)
						})
					)}
				</div>
			</div>
		</div>
	)
}

export default MyRequestsView
