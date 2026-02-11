import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
]

const DatePicker = ({ isOpen, onClose, value = null, onChange }) => {
	const [viewDate, setViewDate] = useState(() => {
		if (value instanceof Date) return new Date(value.getFullYear(), value.getMonth(), 1)
		if (value) {
			const d = new Date(value)
			if (!isNaN(d.getTime())) return new Date(d.getFullYear(), d.getMonth(), 1)
		}
		return new Date(new Date().getFullYear(), new Date().getMonth(), 1)
	})

	const selectedDate = useMemo(() => {
		if (!value) return null
		const d = value instanceof Date ? value : new Date(value)
		return isNaN(d.getTime()) ? null : d
	}, [value])

	const calendarDays = useMemo(() => {
		const year = viewDate.getFullYear()
		const month = viewDate.getMonth()
		const first = new Date(year, month, 1)
		const last = new Date(year, month + 1, 0)
		const startPad = first.getDay()
		const endPad = 6 - last.getDay()
		const days = []
		// Previous month
		const prevLast = new Date(year, month, 0).getDate()
		for (let i = startPad - 1; i >= 0; i--) {
			days.push({ day: prevLast - i, isCurrentMonth: false, date: new Date(year, month - 1, prevLast - i) })
		}
		for (let d = 1; d <= last.getDate(); d++) {
			days.push({ day: d, isCurrentMonth: true, date: new Date(year, month, d) })
		}
		for (let d = 1; d <= endPad; d++) {
			days.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) })
		}
		return days
	}, [viewDate])

	const prevMonth = () => {
		setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
	}
	const nextMonth = () => {
		setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
	}

	const isSameDay = (a, b) => {
		if (!a || !b) return false
		return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
	}

	const handleSelect = (item) => {
		if (onChange) onChange(item.date)
		if (onClose) onClose()
	}

	if (!isOpen) return null

	return (
		<div className='absolute z-[60] mt-1 left-0 bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-[280px]'>
			<div className='flex items-center justify-between mb-4'>
				<button type='button' onClick={prevMonth} className='p-1 rounded-lg hover:bg-gray-100'>
					<ChevronLeft className='w-5 h-5 text-gray-700' />
				</button>
				<span className='text-[16px] font-semibold text-gray-900'>
					{MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
				</span>
				<button type='button' onClick={nextMonth} className='p-1 rounded-lg hover:bg-gray-100'>
					<ChevronRight className='w-5 h-5 text-gray-700' />
				</button>
			</div>
			<div className='grid grid-cols-7 gap-1 mb-2'>
				{DAY_LABELS.map((label) => (
					<div key={label} className='text-center text-[12px] font-medium text-gray-500 py-1'>
						{label}
					</div>
				))}
			</div>
			<div className='grid grid-cols-7 gap-1'>
				{calendarDays.map((item, idx) => (
					<button
						key={idx}
						type='button'
						onClick={() => handleSelect(item)}
						className={`w-9 h-9 flex items-center justify-center rounded-full text-[14px] ${
							!item.isCurrentMonth ? 'text-gray-300' : 'text-gray-900'
						} ${
							isSameDay(item.date, selectedDate)
								? 'bg-primary text-white'
								: 'hover:bg-gray-100'
						}`}
					>
						{item.day}
					</button>
				))}
			</div>
		</div>
	)
}

export default DatePicker
