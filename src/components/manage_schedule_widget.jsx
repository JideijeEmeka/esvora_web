import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, ChevronRight, Copy, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import propertyController from '../controllers/property_controller'

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
const dayLabel = (day) => day ? day.charAt(0).toUpperCase() + day.slice(1) : '—'
const toHourMinute = (v) => (v || '').toString().slice(0, 5)

/** Same idea as Flutter DateFormat('dd MMM yyyy, hh:mm a') in local time. */
const formatScheduleCreatedAt = (iso) => {
	if (iso == null || iso === '') return '—'
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return String(iso)
	const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	const day = String(d.getDate()).padStart(2, '0')
	const mon = months[d.getMonth()]
	const y = d.getFullYear()
	let h = d.getHours()
	const mins = d.getMinutes()
	const ampm = h >= 12 ? 'PM' : 'AM'
	h = h % 12
	if (h === 0) h = 12
	const hh = String(h).padStart(2, '0')
	const mm = String(mins).padStart(2, '0')
	return `${day} ${mon} ${y}, ${hh}:${mm} ${ampm}`
}

const copyScheduleId = async (id) => {
	if (!id) return
	try {
		await navigator.clipboard.writeText(String(id))
		toast.success('Schedule ID copied')
	} catch {
		toast.error('Could not copy ID')
	}
}

const TIMES = Array.from({ length: 48 }, (_, i) => {
	const h = Math.floor(i / 2)
	const m = i % 2 ? '30' : '00'
	return `${String(h).padStart(2, '0')}:${m}`
})

const ManageScheduleWidget = ({ isOpen, onClose, propertyId }) => {
	const [schedules, setSchedules] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [showCreateBox, setShowCreateBox] = useState(false)
	const [createForm, setCreateForm] = useState({
		dayOfWeek: 'sunday',
		startTime: '09:00',
		endTime: '10:00'
	})
	const [selectedSchedule, setSelectedSchedule] = useState(null)
	const [showDetails, setShowDetails] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [editForm, setEditForm] = useState({
		dayOfWeek: 'sunday',
		startTime: '09:00',
		endTime: '10:00'
	})

	useEffect(() => {
		if (isOpen) {
			const originalOverflow = document.body.style.overflow
			const originalPosition = document.body.style.position
			const originalTop = document.body.style.top
			const scrollY = window.scrollY
			document.body.style.overflow = 'hidden'
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'
			return () => {
				document.body.style.overflow = originalOverflow || ''
				document.body.style.position = originalPosition || ''
				document.body.style.top = originalTop || ''
				document.body.style.width = ''
				window.scrollTo(0, scrollY)
			}
		}
	}, [isOpen])

	const fetchSchedules = () => {
		if (!propertyId) return
		setIsLoading(true)
		propertyController.listSchedules(propertyId, {
			forceRefetch: true,
			onSuccess: (list) => {
				setSchedules(list || [])
				setIsLoading(false)
			},
			onError: (msg) => {
				window.alert(msg || 'Failed to load schedules')
				setIsLoading(false)
			}
		})
	}

	useEffect(() => {
		if (isOpen && propertyId) fetchSchedules()
	}, [isOpen, propertyId])

	const handleCreate = () => {
		if (!propertyId) return
		propertyController.createSchedule(
			{
				propertyId,
				startTime: createForm.startTime,
				endTime: createForm.endTime,
				dayOfWeek: createForm.dayOfWeek
			},
			{
				onSuccess: () => {
					setShowCreateBox(false)
					fetchSchedules()
				},
				onError: (msg) => window.alert(msg || 'Failed to create schedule')
			}
		)
	}

	const handleToggle = (schedule) => {
		if (!propertyId || !schedule?.id) return
		propertyController.toggleSchedule(
			{ propertyId, scheduleId: schedule.id },
			{
				onSuccess: (updated) => {
					setSchedules((prev) => prev.map((s) => (s.id === updated?.id ? updated : s)))
					if (selectedSchedule?.id === updated?.id) {
						setSelectedSchedule(updated)
					}
				},
				onError: (msg) => window.alert(msg || 'Failed to toggle schedule')
			}
		)
	}

	const handleDelete = (schedule) => {
		if (!propertyId || !schedule?.id) return
		const ok = window.confirm('Are you sure you want to delete this schedule?')
		if (!ok) return
		propertyController.deleteSchedule(
			{ propertyId, scheduleId: schedule.id },
			{
				onSuccess: () => {
					setSchedules((prev) => prev.filter((s) => s.id !== schedule.id))
					if (selectedSchedule?.id === schedule.id) {
						setShowDetails(false)
						setSelectedSchedule(null)
					}
				},
				onError: (msg) => window.alert(msg || 'Failed to delete schedule')
			}
		)
	}

	const openDetails = (schedule) => {
		if (!propertyId || !schedule?.id) return
		propertyController.showSchedule(
			{ propertyId, scheduleId: schedule.id },
			{
				onSuccess: (data) => {
					setSelectedSchedule(data)
					setEditForm({
						dayOfWeek: data?.day_of_week || 'sunday',
						startTime: toHourMinute(data?.start_time) || '09:00',
						endTime: toHourMinute(data?.end_time) || '10:00'
					})
					setShowDetails(true)
					setIsEditing(false)
				},
				onError: (msg) => window.alert(msg || 'Failed to load schedule details')
			}
		)
	}

	const handleUpdate = () => {
		if (!propertyId || !selectedSchedule?.id) return
		propertyController.updateSchedule(
			{
				propertyId,
				scheduleId: selectedSchedule.id,
				startTime: editForm.startTime,
				endTime: editForm.endTime,
				dayOfWeek: editForm.dayOfWeek
			},
			{
				onSuccess: (updated) => {
					setSelectedSchedule(updated)
					setSchedules((prev) => prev.map((s) => (s.id === updated?.id ? updated : s)))
					setIsEditing(false)
				},
				onError: (msg) => window.alert(msg || 'Failed to update schedule')
			}
		)
	}

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-3xl shadow-2xl w-[90%] max-w-lg max-h-[90vh] overflow-y-auto'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-start justify-between p-6 pb-4'>
					<div>
						<h2 className='text-[22px] font-bold text-gray-900'>
							Manage schedule
						</h2>
						<p className='text-[14px] text-gray-600 mt-1'>
							Set days and times for property viewings.
						</p>
					</div>
					<div className='flex items-center gap-1 shrink-0'>
						<button
							type='button'
							onClick={() => fetchSchedules()}
							disabled={!propertyId || isLoading}
							className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:pointer-events-none text-gray-600'
							aria-label='Refresh schedules'
						>
							<RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
						</button>
						<button
							type='button'
							onClick={onClose}
							className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
							aria-label='Close'
						>
							<X className='w-5 h-5 text-gray-600' />
						</button>
					</div>
				</div>

				<div className='px-6 pb-6'>
					{!propertyId ? (
						<p className='text-[14px] text-gray-600'>
							Choose a request with a property, then open Manage schedule again.
						</p>
					) : isLoading ? (
						<div className='py-6 flex flex-col items-center justify-center gap-2'>
							<RefreshCw className='w-5 h-5 text-primary animate-spin' />
							<p className='text-[14px] text-gray-600'>Loading...</p>
						</div>
					) : (
						<div className='space-y-4 mb-4'>
							{schedules.length === 0 ? (
								<div className='rounded-xl border border-dashed border-gray-200 bg-gray-50/80 px-4 py-6 text-center'>
									<p className='text-[15px] font-medium text-gray-900'>No schedules yet</p>
									<p className='text-[14px] text-gray-600 mt-1'>
										Add viewing windows with <span className='font-medium text-gray-800'>Create schedule</span> below.
									</p>
								</div>
							) : (
								schedules.map((schedule) => (
									<div key={schedule.id} className='bg-gray-50 border border-gray-200 rounded-xl p-4'>
										<div className='flex items-center justify-between gap-3'>
											<p className='text-[16px] font-semibold text-gray-900'>
												{schedule.day_of_week_label || dayLabel(schedule.day_of_week)}, {schedule.start_time_formatted || schedule.start_time} - {schedule.end_time_formatted || schedule.end_time}
											</p>
											<button
												type='button'
												onClick={() => openDetails(schedule)}
												className='w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center'
											>
												<ChevronRight className='w-4 h-4 text-gray-700' />
											</button>
										</div>
										<div className='flex items-center gap-2 mt-2'>
											<span className={`inline-flex px-3 py-1 rounded-full text-[12px] font-medium ${schedule.is_active ? 'bg-primary/15 text-primary' : 'bg-gray-200 text-gray-600'}`}>
												{schedule.is_active ? 'Active' : 'Inactive'}
											</span>
											<div className='ml-auto flex items-center gap-2'>
												<button
													type='button'
													onClick={() => handleDelete(schedule)}
													className='w-9 h-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors'
												>
													<Trash2 className='w-4 h-4' />
												</button>
												<button
													type='button'
													role='switch'
													aria-checked={!!schedule.is_active}
													onClick={() => handleToggle(schedule)}
													className={`relative w-11 h-6 rounded-full transition-colors ${schedule.is_active ? 'bg-primary' : 'bg-gray-300'}`}
												>
													<span
														className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${schedule.is_active ? 'left-6' : 'left-1'}`}
													/>
												</button>
											</div>
										</div>
									</div>
								))
							)}
						</div>
					)}

					{showCreateBox && propertyId && (
						<div className='bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4'>
							<p className='text-[15px] font-semibold text-gray-900 mb-3'>New schedule</p>
							<div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-3'>
								<select
									value={createForm.dayOfWeek}
									onChange={(e) => setCreateForm((p) => ({ ...p, dayOfWeek: e.target.value }))}
									className='px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white'
								>
									{DAYS.map((d) => (
										<option key={d} value={d}>{dayLabel(d)}</option>
									))}
								</select>
								<select
									value={createForm.startTime}
									onChange={(e) => setCreateForm((p) => ({ ...p, startTime: e.target.value }))}
									className='px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white'
								>
									{TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
								</select>
								<select
									value={createForm.endTime}
									onChange={(e) => setCreateForm((p) => ({ ...p, endTime: e.target.value }))}
									className='px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white'
								>
									{TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
								</select>
							</div>
							<button
								type='button'
								onClick={handleCreate}
								className='px-5 py-2.5 rounded-full text-[14px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors'
							>
								Create schedule
							</button>
						</div>
					)}

					{showDetails && selectedSchedule && (
						<div className='fixed inset-0 z-60 flex items-center justify-center bg-black/50 px-4'>
							<div className='bg-white rounded-2xl p-5 w-full max-w-xl'>
								<div className='flex items-center justify-between mb-4'>
									<h3 className='text-[20px] font-semibold'>Schedule details</h3>
									<button type='button' onClick={() => setShowDetails(false)}>
										<X className='w-5 h-5' />
									</button>
								</div>
								<div className='space-y-3 text-[14px]'>
									<div className='flex items-start gap-2'>
										<span className='font-semibold shrink-0'>ID:</span>
										<span className='break-all flex-1 min-w-0'>{selectedSchedule.id}</span>
										<button
											type='button'
											onClick={() => copyScheduleId(selectedSchedule.id)}
											className='shrink-0 p-1.5 rounded-lg text-gray-600 hover:bg-gray-100'
											aria-label='Copy schedule ID'
										>
											<Copy className='w-4 h-4' />
										</button>
									</div>
									<div><span className='font-semibold'>Day:</span> {selectedSchedule.day_of_week_label || dayLabel(selectedSchedule.day_of_week)}</div>
									<div><span className='font-semibold'>Time:</span> {selectedSchedule.start_time_formatted || selectedSchedule.start_time} - {selectedSchedule.end_time_formatted || selectedSchedule.end_time}</div>
									<div><span className='font-semibold'>Start time:</span> {selectedSchedule.start_time}</div>
									<div><span className='font-semibold'>End time:</span> {selectedSchedule.end_time}</div>
									<div><span className='font-semibold'>Status:</span> {selectedSchedule.is_active ? 'Active' : 'Inactive'}</div>
									<div><span className='font-semibold'>Created at:</span> {formatScheduleCreatedAt(selectedSchedule.created_at)}</div>
								</div>
								<div className='mt-5'>
									{isEditing ? (
										<div className='space-y-3'>
											<div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
												<select
													value={editForm.dayOfWeek}
													onChange={(e) => setEditForm((p) => ({ ...p, dayOfWeek: e.target.value }))}
													className='px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white'
												>
													{DAYS.map((d) => <option key={d} value={d}>{dayLabel(d)}</option>)}
												</select>
												<select
													value={editForm.startTime}
													onChange={(e) => setEditForm((p) => ({ ...p, startTime: e.target.value }))}
													className='px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white'
												>
													{TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
												</select>
												<select
													value={editForm.endTime}
													onChange={(e) => setEditForm((p) => ({ ...p, endTime: e.target.value }))}
													className='px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white'
												>
													{TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
												</select>
											</div>
											<div className='flex gap-2'>
												<button
													type='button'
													onClick={() => setIsEditing(false)}
													className='px-4 py-2 rounded-full border border-gray-300 text-gray-700'
												>
													Cancel
												</button>
												<button
													type='button'
													onClick={handleUpdate}
													className='px-4 py-2 rounded-full bg-primary text-white'
												>
													Update
												</button>
											</div>
										</div>
									) : (
										<button
											type='button'
											onClick={() => setIsEditing(true)}
											className='px-4 py-2 rounded-full bg-primary text-white'
										>
											Edit schedule
										</button>
									)}
								</div>
							</div>
						</div>
					)}

					<button
						type='button'
						onClick={() => setShowCreateBox((v) => !v)}
						className='flex items-center gap-2 text-[14px] font-medium text-primary hover:text-purple-700 transition-colors mb-6'
					>
						<Plus className='w-4 h-4' />
						{showCreateBox ? 'Close' : 'Create schedule'}
					</button>
				</div>
			</div>
		</div>
	)
}

export default ManageScheduleWidget
