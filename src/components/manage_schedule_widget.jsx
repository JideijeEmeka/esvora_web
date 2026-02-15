import React, { useState, useEffect } from 'react'
import { X, Plus, Trash2, ChevronDown } from 'lucide-react'

const DAYS = [
	'Mondays',
	'Tuesdays',
	'Wednesdays',
	'Thursdays',
	'Fridays',
	'Saturdays',
	'Sundays'
]

const TIMES = [
	'9:00 AM',
	'9:30 AM',
	'10:00 AM',
	'10:30 AM',
	'11:00 AM',
	'11:30 AM',
	'12:00 PM',
	'12:30 PM',
	'1:00 PM',
	'1:30 PM',
	'2:00 PM',
	'2:30 PM',
	'3:00 PM',
	'3:30 PM',
	'4:00 PM',
	'4:30 PM',
	'5:00 PM'
]

const formatChipLabel = (day, time) => `${day} ${time}`

const ManageScheduleWidget = ({ isOpen, onClose, onSave }) => {
	const [slots, setSlots] = useState([
		{ id: 1, day: 'Saturdays', time: '12:30 PM', enabled: true },
		{ id: 2, day: 'Mondays', time: '12:30 PM', enabled: true },
		{ id: 3, day: 'Tuesdays', time: '12:00 PM', enabled: false },
		{ id: 4, day: 'Mondays', time: '12:30 PM', enabled: false }
	])
	const [nextId, setNextId] = useState(5)

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

	const enabledSlots = slots.filter((s) => s.enabled)

	const handleAddSlot = () => {
		setSlots((prev) => [
			...prev,
			{ id: nextId, day: DAYS[0], time: TIMES[0], enabled: false }
		])
		setNextId((id) => id + 1)
	}

	const handleRemoveSlot = (id) => {
		setSlots((prev) => prev.filter((s) => s.id !== id))
	}

	const handleSlotChange = (id, field, value) => {
		setSlots((prev) =>
			prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
		)
	}

	const handleToggleEnabled = (id) => {
		setSlots((prev) =>
			prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
		)
	}

	const handleSave = () => {
		if (onSave) onSave(slots.filter((s) => s.enabled))
		if (onClose) onClose()
	}

	const handleCancel = () => {
		if (onClose) onClose()
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
					<button
						type='button'
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors shrink-0'
						aria-label='Close'
					>
						<X className='w-5 h-5 text-gray-600' />
					</button>
				</div>

				<div className='px-6 pb-6'>
					{/* Existing schedule chips */}
					{enabledSlots.length > 0 && (
						<div className='flex flex-wrap gap-2 mb-6'>
							{enabledSlots.map((slot) => (
								<span
									key={slot.id}
									className='inline-flex px-3 py-1.5 rounded-full text-[13px] font-medium bg-gray-100 text-gray-800'
								>
									{formatChipLabel(slot.day, slot.time)}
								</span>
							))}
						</div>
					)}

					{/* Slot cards */}
					<div className='space-y-4 mb-4'>
						{slots.map((slot) => (
							<div
								key={slot.id}
								className='bg-gray-50 border border-gray-200 rounded-xl p-4'
							>
								<div className='flex flex-wrap items-center gap-3'>
									<select
										value={slot.day}
										onChange={(e) =>
											handleSlotChange(slot.id, 'day', e.target.value)
										}
										className='flex-1 min-w-[100px] px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer'
										style={{
											backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
											backgroundRepeat: 'no-repeat',
											backgroundPosition: 'right 0.5rem center',
											backgroundSize: '1.25rem',
											paddingRight: '2rem'
										}}
									>
										{DAYS.map((d) => (
											<option key={d} value={d}>
												{d}
											</option>
										))}
									</select>
									<select
										value={slot.time}
										onChange={(e) =>
											handleSlotChange(slot.id, 'time', e.target.value)
										}
										className='flex-1 min-w-[100px] px-3 py-2.5 text-[14px] border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer'
										style={{
											backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236b7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
											backgroundRepeat: 'no-repeat',
											backgroundPosition: 'right 0.5rem center',
											backgroundSize: '1.25rem',
											paddingRight: '2rem'
										}}
									>
										{TIMES.map((t) => (
											<option key={t} value={t}>
												{t}
											</option>
										))}
									</select>
									<button
										type='button'
										onClick={() => handleRemoveSlot(slot.id)}
										className='w-9 h-9 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors'
										aria-label='Remove slot'
									>
										<Trash2 className='w-4 h-4' />
									</button>
									{/* Toggle */}
									<button
										type='button'
										role='switch'
										aria-checked={slot.enabled}
										onClick={() => handleToggleEnabled(slot.id)}
										className={`relative w-11 h-6 rounded-full transition-colors ${
											slot.enabled ? 'bg-primary' : 'bg-gray-300'
										}`}
									>
										<span
											className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
												slot.enabled ? 'left-6' : 'left-1'
											}`}
										/>
									</button>
								</div>
							</div>
						))}
					</div>

					{/* New slot button */}
					<button
						type='button'
						onClick={handleAddSlot}
						className='flex items-center gap-2 text-[14px] font-medium text-primary hover:text-purple-700 transition-colors mb-6'
					>
						<Plus className='w-4 h-4' />
						New
					</button>

					{/* Footer actions */}
					<div className='flex justify-end gap-3 pt-2'>
						<button
							type='button'
							onClick={handleCancel}
							className='px-5 py-2.5 rounded-full text-[14px] font-semibold bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={handleSave}
							className='px-5 py-2.5 rounded-full text-[14px] font-semibold bg-primary text-white hover:bg-primary/90 transition-colors'
						>
							Save
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ManageScheduleWidget
