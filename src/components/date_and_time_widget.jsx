import React, { useState } from 'react'
import { Calendar } from 'lucide-react'
import DatePicker from './date_picker'

const formatDate = (d) => {
	if (!d) return ''
	const date = d instanceof Date ? d : new Date(d)
	return isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const DateAndTimeWidget = ({ isOpen, onClose, fromDate, toDate, onFromChange, onToChange }) => {
	const [pickerOpen, setPickerOpen] = useState(null) // 'from' | 'to' | null

	if (!isOpen) return null

	return (
		<div className='absolute z-[55] mt-1 right-0 w-[320px] bg-white rounded-xl shadow-xl border border-gray-200 p-4'>
			<div className='flex items-center gap-2 mb-4'>
				<Calendar className='w-5 h-5 text-gray-700' />
				<span className='text-[16px] font-semibold text-gray-900'>Date and time</span>
			</div>
			<div className='space-y-4'>
				<div className='relative'>
					<label className='block text-[14px] font-medium text-gray-700 mb-2'>From</label>
					<button
						type='button'
						onClick={() => setPickerOpen((p) => (p === 'from' ? null : 'from'))}
						className='w-full flex items-center justify-between px-4 py-3 
						  border border-gray-300 rounded-full bg-white text-left text-[14px] text-gray-600'
					>
						{fromDate ? formatDate(fromDate) : 'Select date'}
						<Calendar className='w-4 h-4 text-gray-500' />
					</button>
					{pickerOpen === 'from' && (
						<div className='absolute left-0 top-full mt-1 z-10'>
							<DatePicker
								isOpen
								value={fromDate}
								onChange={(d) => {
									if (onFromChange) onFromChange(d)
									setPickerOpen(null)
								}}
								onClose={() => setPickerOpen(null)}
							/>
						</div>
					)}
				</div>
				<div className='relative'>
					<label className='block text-[14px] font-medium text-gray-700 mb-2'>To</label>
					<button
						type='button'
						onClick={() => setPickerOpen((p) => (p === 'to' ? null : 'to'))}
						className='w-full flex items-center justify-between px-4 py-3 
						   border border-gray-300 rounded-full bg-white text-left text-[14px] text-gray-600'
					>
						{toDate ? formatDate(toDate) : 'Select date'}
						<Calendar className='w-4 h-4 text-gray-500' />
					</button>
					{pickerOpen === 'to' && (
						<div className='absolute left-0 top-full mt-1 z-10'>
							<DatePicker
								isOpen
								value={toDate}
								onChange={(d) => {
									if (onToChange) onToChange(d)
									setPickerOpen(null)
								}}
								onClose={() => setPickerOpen(null)}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default DateAndTimeWidget
