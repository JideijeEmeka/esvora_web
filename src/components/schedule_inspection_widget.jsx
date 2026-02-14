import React, { useEffect, useState } from 'react'
import { X, ChevronDown } from 'lucide-react'

const TIME_SLOTS = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM']
const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
]
const DAYS_IN_MONTH = 31

const ScheduleInspectionWidget = ({ isOpen, onClose, property, onScheduleSubmitted }) => {
	const [selectedTime, setSelectedTime] = useState('09:00 AM')
	const [selectedDate, setSelectedDate] = useState('')
	const [selectedMonth, setSelectedMonth] = useState('')

	// Prevent body scroll when modal is open (same pattern as filter_properties_widget)
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

	const image = property?.images?.[0] ?? property?.image ?? ''
	const price = property?.price ?? ''
	const description = property?.title ?? property?.description ?? ''
	const location = property?.location ?? property?.fullAddress ?? ''

	const handleSchedule = () => {
		// Optional: pass selected time/date/month to parent or API
		if (onClose) onClose()
		if (onScheduleSubmitted) onScheduleSubmitted()
	}

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl shadow-2xl w-[821px] overflow-hidden max-h-[90vh] overflow-y-auto'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6 border-b border-gray-200'>
					<h2 className='text-[24px] font-bold text-gray-900'>Schedule inspection</h2>
					<button
						type='button'
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors'
					>
						<X className='w-5 h-5 text-gray-700' />
					</button>
				</div>

				{/* Property preview */}
				<div className='p-6'>
					<div className='flex gap-4 mb-6'>
						<div className='shrink-0 w-[200px] h-[120px] rounded-lg overflow-hidden bg-gray-100'>
							{image ? (
								<img
									src={image}
									alt={description}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-400 text-[12px]'>
									No image
								</div>
							)}
						</div>
						<div className='min-w-0 flex-1 flex flex-col justify-center'>
							<p className='text-[20px] font-bold text-gray-900'>{price}</p>
							<p className='text-[14px] text-gray-600 mt-1'>{description}</p>
							<p className='text-[14px] text-gray-500 mt-1'>{location}</p>
						</div>
					</div>

					{/* Pick time */}
					<div className='mb-6'>
						<label className='block text-[16px] font-bold text-gray-900 mb-3'>
							Pick time
						</label>
						<div className='flex flex-wrap gap-2'>
							{TIME_SLOTS.map((time) => (
								<button
									key={time}
									type='button'
									onClick={() => setSelectedTime(time)}
									className={`px-4 py-3 rounded-full text-[14px] font-medium transition-colors ${
										selectedTime === time
											? 'bg-primary text-white'
											: 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-50'
									}`}
								>
									{time}
								</button>
							))}
						</div>
					</div>

					{/* Available days */}
					<div className='mb-6'>
						<span className='text-[16px] font-bold text-gray-900'>Available: </span>
						<span className='text-[14px] text-gray-600'>
							Mondays, Wednesdays and Saturdays
						</span>
					</div>

					{/* Date and Month */}
					<div className='flex gap-4 mb-10'>
						{/* Date */}
						<div className='w-[300px]'>
							<label className='block text-[14px] font-medium text-gray-700 mb-2'>
								Date
							</label>
							<div className='relative'>
								<select
									value={selectedDate}
									onChange={(e) => setSelectedDate(e.target.value)}
									className='w-full px-4 py-3 pr-10 text-[14px] border border-gray-300 
									 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none'
								>
									<option value=''>0</option>
									{[...Array(DAYS_IN_MONTH)].map((_, i) => (
										<option key={i + 1} value={i + 1}>
											{i + 1}
										</option>
									))}
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
							</div>
						</div>
						{/* Month */}
						<div className='w-full'>
							<label className='block text-[14px] font-medium text-gray-700 mb-2'>
								Month
							</label>
							<div className='relative'>
								<select
									value={selectedMonth}
									onChange={(e) => setSelectedMonth(e.target.value)}
									className='w-full px-4 py-3 pr-10 text-[14px] border border-gray-300 
									 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none'
								>
									<option value=''>Select month</option>
									{MONTHS.map((month, i) => (
										<option key={month} value={month}>
											{month}
										</option>
									))}
								</select>
								<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
							</div>
						</div>
					</div>

					{/* Action buttons */}
					<div className='flex gap-3 pt-2'>
						<button
							type='button'
							onClick={onClose}
							className='flex-1 px-4 py-3 rounded-full border border-gray-300 bg-white
							   text-gray-700 font-medium text-[16px] hover:bg-gray-50 transition-colors'
						>
							Cancel
						</button>
						<button
							type='button'
							onClick={handleSchedule}
							className='flex-1 px-4 py-3 rounded-full bg-primary text-white 
							  font-medium text-[16px] hover:bg-primary/90 transition-colors'
						>
							Schedule inspection
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ScheduleInspectionWidget
