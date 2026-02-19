import React, { useState, useRef, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import Footer from '../components/footer'
import ScheduleCreatedWidget from '../components/schedule_created_widget'

const TIME_SLOTS = ['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM']
const MONTHS = [
	'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December'
]
const DAYS_IN_MONTH = 31

const CATEGORIES = [
	'Popular apartments',
	'Shop',
	'Shortlet',
	'Duplex',
	'Bungalow',
	'Flats',
	'Room & Parlor',
	'Event hall',
	'Shopping hall',
	'Selfcon',
	'Store'
]

const POPULAR_LOCATIONS = [
	'Lagos', 'Abuja', 'Portharcourt', 'Benin', 'Ibadan', 'Kano',
	'Enugu', 'Jos', 'Abeokuta', 'Maiduguri', 'Onitsha', 'Akure',
	'Asaba', 'Warri', 'Calabar', 'Ilorin', 'Uyo'
]

const DEFAULT_PROPERTY = {
	id: 1,
	image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
	price: '€120,500',
	description: '4 bedroom modern bungalow apartment',
	location: 'Ikoyi, Lagos, Nigeria'
}

const getOrdinal = (n) => {
	const v = n % 100
	if (v >= 11 && v <= 13) return `${n}th`
	const s = ['th', 'st', 'nd', 'rd']
	return n + (s[(v - 20) % 10] || s[v] || 'th')
}

const ScheduleInspectionView = () => {
	const { id } = useParams()
	const [selectedTime, setSelectedTime] = useState('09:00 AM')
	const [selectedDay, setSelectedDay] = useState('')
	const [selectedMonth, setSelectedMonth] = useState('')
	const [selectedCategory, setSelectedCategory] = useState('Popular apartments')
	const [isSubmittedOpen, setIsSubmittedOpen] = useState(false)
	const categoryRef = useRef(null)

	const property = { ...DEFAULT_PROPERTY, id: id || DEFAULT_PROPERTY.id }

	const displayDateTime = useMemo(() => {
		if (!selectedDay || !selectedMonth) return null
		const monthIndex = MONTHS.indexOf(selectedMonth)
		if (monthIndex === -1) return null
		const day = parseInt(selectedDay, 10)
		if (day < 1 || day > 31) return null
		const dateStr = `${getOrdinal(day)} ${selectedMonth} ${new Date().getFullYear()}`
		return `${selectedTime}, ${dateStr}`
	}, [selectedTime, selectedDay, selectedMonth])

	const handleSchedule = () => {
		setIsSubmittedOpen(true)
	}

	const scrollCategories = (direction) => {
		if (!categoryRef?.current) return
		const amount = 200
		categoryRef.current.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		})
	}

	return (
		<>
			<ScheduleCreatedWidget
				isOpen={isSubmittedOpen}
				onClose={() => setIsSubmittedOpen(false)}
				contactName='Osaite Emmanuel'
				onCheckStatus={() => setIsSubmittedOpen(false)}
			/>
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20'>

				{/* Two-column: Property summary + Schedule form */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16'>
					{/* Left: Property summary card */}
					<div className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
						<img
							src={property.image}
							alt={property.description}
							className='w-full h-[240px] object-cover'
						/>
						<div className='p-6'>
							<p className='text-[24px] font-semibold text-gray-900 mb-2'>
								{property.price}
							</p>
							<p className='text-[16px] font-medium text-gray-700 mb-2'>
								{property.description}
							</p>
							<p className='text-[14px] text-gray-500'>{property.location}</p>
						</div>
					</div>

					{/* Right: Schedule inspection form */}
					<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
						<h2 className='text-[22px] font-semibold text-gray-900 mb-2'>
							Schedule an inspection for this property
						</h2>
						{displayDateTime && (
							<p className='text-[16px] text-gray-600 w-fit mb-6 
							text-center bg-gray-100 rounded-full px-4 py-2'>
								{displayDateTime}
							</p>
						)}

						{/* Pick time */}
						<div className='mb-6'>
							<label className='block text-[16px] font-semibold text-gray-900 mb-3'>
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
							<span className='text-[16px] font-semibold text-gray-900'>
								Available:{' '}
							</span>
							<span className='text-[14px] text-gray-600'>
								Mondays, Wednesdays and Saturdays
							</span>
						</div>

						{/* Date: Day + Month dropdowns */}
						<div className='flex gap-4 mb-8'>
							<div className='w-24 shrink-0'>
								<label className='block text-[14px] font-medium text-gray-700 mb-2'>
									Date
								</label>
								<div className='relative'>
									<select
										value={selectedDay}
										onChange={(e) => setSelectedDay(e.target.value)}
										className='w-full px-4 py-3 pr-10 text-[14px] border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none'
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
							<div className='flex-1 min-w-0'>
								<label className='block text-[14px] font-medium text-gray-700 mb-2'>
									Month
								</label>
								<div className='relative'>
									<select
										value={selectedMonth}
										onChange={(e) => setSelectedMonth(e.target.value)}
										className='w-full px-4 py-3 pr-10 text-[14px] border border-gray-300 rounded-full bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 appearance-none'
									>
										<option value=''>Select month</option>
										{MONTHS.map((month) => (
											<option key={month} value={month}>
												{month}
											</option>
										))}
									</select>
									<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
								</div>
							</div>
						</div>

						{/* Schedule inspection button */}
						<button
							type='button'
							onClick={handleSchedule}
							className='w-full py-3 rounded-full bg-linear-to-r from-primary to-primary/80 text-white font-semibold text-[16px] hover:opacity-95 transition-opacity'
						>
							Schedule inspection
						</button>
					</div>
				</div>

				{/* Find affordable properties */}
				<div className='mb-12 mt-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							Find affordable properties near you!
						</h2>
						<div className='flex items-center gap-2 max-md:hidden'>
							<button
								type='button'
								onClick={() => scrollCategories('left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								type='button'
								onClick={() => scrollCategories('right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={categoryRef}
						className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide'
					>
						{CATEGORIES.map((category) => (
							<button
								key={category}
								type='button'
								onClick={() => setSelectedCategory(category)}
								className={`shrink-0 px-6 py-3 rounded-full font-medium text-[16px] transition-colors ${
									selectedCategory === category
										? 'bg-gray-800 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				{/* Popular locations */}
				<div className='mb-1'>
					<h2 className='text-[24px] font-semibold text-gray-900 mb-6'>
						Popular locations
					</h2>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{POPULAR_LOCATIONS.map((location, index) => (
							<button
								key={index}
								type='button'
								className='text-left px-4 py-3 hover:bg-gray-100 rounded-lg text-[16px] font-medium text-gray-700 transition-colors'
							>
								{location}
							</button>
						))}
					</div>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default ScheduleInspectionView
