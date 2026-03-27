import React, { useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { ChevronLeft } from 'lucide-react'
import { formatScheduleTime } from '../lib/scheduleUtils'

const PropertySchedulesView = () => {
	const navigate = useNavigate()
	const { propertyId } = useParams()
	const location = useLocation()
	const schedules = location.state?.schedules ?? []
	const propertyTitle = location.state?.propertyTitle ?? ''

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	const openDetail = (schedule) => {
		navigate(`/property-schedules/${propertyId}/${encodeURIComponent(String(schedule.id))}`, {
			state: {
				schedules,
				propertyTitle,
				schedule,
				fromPropertyScheduleList: true
			}
		})
	}

	return (
		<>
			<Navbar />
			<div className="pt-28 pb-16 px-6 md:px-16 min-h-screen bg-white">
				<div className="max-w-xl mx-auto">
					<button
						type="button"
						onClick={() => navigate(-1)}
						className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 text-[15px] font-medium"
					>
						<ChevronLeft className="w-5 h-5" />
						Back
					</button>
					<h1 className="text-[22px] font-bold text-gray-900 text-center mb-2">Property schedules</h1>
					{propertyTitle ? (
						<p className="text-[14px] text-gray-600 text-center mb-8 line-clamp-2">{propertyTitle}</p>
					) : (
						<div className="mb-8" />
					)}

					{!Array.isArray(schedules) || schedules.length === 0 ? (
						<p className="text-[15px] text-gray-600 text-center px-4 leading-relaxed">
							There are no inspection schedules for this property.
						</p>
					) : (
						<ul className="space-y-3">
							{schedules.map((s) => {
								const day = s.dayOfWeekLabel ?? s.dayOfWeek ?? '—'
								const start = formatScheduleTime(s.startTime, s.startTimeFormatted) ?? s.startTime ?? '—'
								const end = formatScheduleTime(s.endTime, s.endTimeFormatted) ?? s.endTime ?? '—'
								const title = `${day} • ${start} - ${end}`
								const active = !!s.isActive
								return (
									<li key={s.id ?? title}>
										<button
											type="button"
											onClick={() => openDetail(s)}
											className="w-full text-left rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-primary/40 hover:shadow transition-all flex items-center justify-between gap-3"
										>
											<div>
												<p className="text-[15px] font-semibold text-gray-900">{title}</p>
												<p
													className={`text-[13px] font-medium mt-1 ${
														active ? 'text-primary' : 'text-gray-500'
													}`}
												>
													{active ? 'Active' : 'Inactive'}
												</p>
											</div>
											<span className="text-gray-400 text-lg">›</span>
										</button>
									</li>
								)
							})}
						</ul>
					)}
				</div>
			</div>
			<Footer />
		</>
	)
}

export default PropertySchedulesView
