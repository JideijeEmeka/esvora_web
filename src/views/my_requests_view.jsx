import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import propertyController from '../controllers/property_controller'
import { selectMyRequests } from '../redux/slices/propertySlice'
import { normalizeMyRequest } from '../lib/propertyUtils'
import SortRequestsBottomSheet from '../components/sort_requests_bottom_sheet'
import Loader from '../components/loader'
import { SlidersHorizontal } from 'lucide-react'

const TABS = [
	{ id: 'all', label: 'All' },
	{ id: 'scheduled', label: 'Scheduled' },
	{ id: 'reservation', label: 'Reservation' }
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

	// Filter by status if a status sort is selected
	if (sortBy === 'status_pending') {
		arr = arr.filter((r) => getStatusKey(r.status) === 'pending')
	} else if (sortBy === 'status_approved') {
		arr = arr.filter((r) => getStatusKey(r.status) === 'approved')
	} else if (sortBy === 'status_declined') {
		arr = arr.filter((r) => getStatusKey(r.status) === 'declined')
	}

	// Then apply date/price sort
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
		// Within status filter, sort by newest first
		arr.sort((a, b) => {
			const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
			const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
			return bDate - aDate
		})
	}
	return arr
}

const MyRequestsView = () => {
	const navigate = useNavigate()
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('all')
	const [sortBy, setSortBy] = useState('newest')
	const [isSortOpen, setIsSortOpen] = useState(false)
	const myRequestsRaw = useSelector(selectMyRequests)

	const allRequests = useMemo(
		() => (myRequestsRaw ?? []).map(normalizeMyRequest).filter(Boolean),
		[myRequestsRaw]
	)

	const filteredRequests = useMemo(() => {
		let list = allRequests
		if (activeTab === 'scheduled') {
			list = list.filter((r) => r.type === 'schedule')
		} else if (activeTab === 'reservation') {
			list = list.filter((r) => r.type === 'reservation')
		}
		return filterAndSortRequests(list, sortBy)
	}, [allRequests, activeTab, sortBy])

	useEffect(() => {
		setIsLoading(true)
		propertyController.listMyRequests({
			onSuccess: () => setIsLoading(false),
			onError: () => setIsLoading(false)
		})
	}, [])

	const handleCardClick = (req, e) => {
		if (e?.target?.closest('button')) return
		if (req?.propertyId) {
			navigate(`/property-details/${req.propertyId}`, {
				state: {
					requestStatus: req.status,
					requestId: req.id,
					requestAmount: req.totalAmount
				}
			})
		}
	}

	const handleCheckProperty = (req, e) => {
		e?.stopPropagation?.()
		if (req?.propertyId) {
			navigate(`/property-details/${req.propertyId}`, {
				state: {
					requestStatus: req.status,
					requestId: req.id,
					requestAmount: req.totalAmount
				}
			})
		}
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

	return (
		<div className="pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white">
			<div className="max-w-4xl mx-auto w-full">
				<h1 className="text-[28px] md:text-[32px] font-bold text-gray-900 mb-6">
					My Requests
				</h1>

				{/* Tabs: All, Scheduled, Reservation */}
				<div className="flex items-center justify-between gap-4 mb-6">
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
					{!isLoading && allRequests.length > 0 && (
						<button
							type="button"
							onClick={() => setIsSortOpen(true)}
							className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[14px] font-medium transition-colors"
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

				{/* Request list */}
				<div className="space-y-4">
					{isLoading ? (
						<div className="flex justify-center py-12">
							<Loader />
						</div>
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
