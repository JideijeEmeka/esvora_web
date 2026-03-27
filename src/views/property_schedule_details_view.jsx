import React, { useMemo, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatScheduleTime } from '../lib/scheduleUtils'

const PropertyScheduleDetailsView = () => {
	const navigate = useNavigate()
	const { propertyId, scheduleId } = useParams()
	const location = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [location.pathname])

	const schedule = useMemo(() => {
		const direct = location.state?.schedule
		if (direct && String(direct.id) === String(scheduleId)) return direct
		const list = location.state?.schedules ?? []
		return list.find((s) => String(s.id) === String(scheduleId))
	}, [location.state, scheduleId])

	const copyId = async () => {
		const sid = schedule?.id
		if (!sid) return
		try {
			await navigator.clipboard.writeText(String(sid))
			toast.success('Copied')
		} catch {
			toast.error('Could not copy')
		}
	}

	const startDisp =
		formatScheduleTime(schedule?.startTime, schedule?.startTimeFormatted) ?? schedule?.startTime ?? '—'
	const endDisp =
		formatScheduleTime(schedule?.endTime, schedule?.endTimeFormatted) ?? schedule?.endTime ?? '—'

	return (
		<>
			<Navbar />
			<div className="pt-28 pb-16 px-6 md:px-16 min-h-screen bg-white">
				<div className="max-w-xl mx-auto">
					<button
						type="button"
						onClick={() => {
							// Pop to the existing list entry. Pushing the list URL again created […, list, detail, list], so Back on the list returned to detail.
							if (location.state?.fromPropertyScheduleList) {
								navigate(-1)
								return
							}
							navigate(`/property-schedules/${propertyId}`, {
								state: {
									schedules: location.state?.schedules ?? [],
									propertyTitle: location.state?.propertyTitle ?? ''
								}
							})
						}}
						className="flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-6 text-[15px] font-medium"
					>
						<ChevronLeft className="w-5 h-5" />
						Back
					</button>
					<h1 className="text-[22px] font-bold text-gray-900 text-center mb-8">Schedule details</h1>

					{!schedule ? (
						<p className="text-[15px] text-gray-600 text-center">
							This schedule could not be loaded. Go back and open it from the list again.
						</p>
					) : (
						<div className="rounded-xl border border-gray-200 bg-gray-50 p-6 space-y-4">
							<Row
								label="Schedule ID"
								value={schedule.id ?? '—'}
								valueIsButton
								onValueClick={schedule.id ? copyId : undefined}
							/>
							<Row label="Day" value={schedule.dayOfWeekLabel ?? schedule.dayOfWeek ?? '—'} />
							<Row label="Start time" value={startDisp} />
							<Row label="End time" value={endDisp} />
							<Row label="Active" value={schedule.isActive ? 'Yes' : 'No'} />
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	)
}

function Row({ label, value, valueIsButton, onValueClick }) {
	return (
		<div className="flex gap-4 text-[14px]">
			<div className="w-[120px] shrink-0 font-semibold text-gray-500">{label}</div>
			<div className="flex-1 min-w-0">
				{valueIsButton && onValueClick ? (
					<button
						type="button"
						onClick={onValueClick}
						className="text-left font-medium text-gray-900 underline decoration-gray-400 hover:decoration-primary break-all"
					>
						{value}
					</button>
				) : (
					<span className="font-medium text-gray-900 break-words">{value}</span>
				)}
			</div>
		</div>
	)
}

export default PropertyScheduleDetailsView
