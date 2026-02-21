import React, { useState, useMemo } from 'react'
import { X, ChevronLeft, MapPin, Check } from 'lucide-react'
import { NIGERIAN_STATES_SORTED } from '../lib/constants'

const SetLocationView = ({ onBack, onSave, initialLocation = null }) => {
	const [search, setSearch] = useState('')
	const [selectedLocation, setSelectedLocation] = useState(initialLocation)

	const filteredLocations = useMemo(() => {
		if (!search.trim()) return NIGERIAN_STATES_SORTED
		const q = search.trim().toLowerCase()
		return NIGERIAN_STATES_SORTED.filter(
			(item) => item.label.toLowerCase().includes(q)
		)
	}, [search])

	const handleSave = () => {
		if (onSave && selectedLocation) onSave(selectedLocation)
		else if (onBack) onBack()
	}

	const handleCancel = () => {
		if (onBack) onBack()
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 flex flex-col max-h-[85vh]'>
			{/* Header: title + X back */}
			<div className='flex items-start justify-between gap-4 shrink-0'>
				<div className='min-w-0'>
					{onBack && (
						<div className='md:hidden mb-4'>
							<button
								type='button'
								onClick={onBack}
								className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 transition-colors'
							>
								<ChevronLeft className='w-4 h-4' />
								Back to Privacy & Security
							</button>
						</div>
					)}
					<h2 className='text-[24px] font-bold text-gray-900'>
						Select location
					</h2>
				</div>
			</div>

			{/* Search */}
			<div className='mt-6 shrink-0'>
				<label htmlFor='set-location-search' className='block text-[14px] font-medium text-gray-700 mb-2'>
					Search for a location
				</label>
				<div className='relative'>
					<input
						id='set-location-search'
						type='text'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder='Enter location'
						className='w-full px-4 py-3 pr-12 rounded-full border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
						autoComplete='off'
					/>
					<div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400'>
						<MapPin className='w-5 h-5' />
					</div>
				</div>
			</div>

			{/* Scrollable list */}
			<div className='mt-4 overflow-y-auto flex-1 min-h-0 -mx-1 px-1'>
				<ul className='space-y-0.5'>
					{filteredLocations.map((item) => {
						const letter = item.label.charAt(0).toUpperCase()
						const isSelected =
							selectedLocation?.value === item.value ||
							selectedLocation === item.label
						return (
							<li key={item.value}>
								<button
									type='button'
									onClick={() => setSelectedLocation(item)}
									className={`w-full flex items-center gap-4 py-3 px-3 rounded-xl text-left transition-colors ${
										isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
									}`}
								>
									<div className='shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[16px] font-semibold text-gray-700'>
										{letter}
									</div>
									<span className='flex-1 min-w-0 text-[16px] font-medium text-gray-900'>
										{item.label}
									</span>
									{isSelected && (
										<Check className='w-5 h-5 text-gray-900 shrink-0' />
									)}
								</button>
							</li>
						)
					})}
				</ul>
				{filteredLocations.length === 0 && (
					<p className='py-8 text-center text-gray-500 text-[14px]'>
						No locations match your search.
					</p>
				)}
			</div>

			{/* Footer: Cancel + Save */}
			<div className='flex gap-3 mt-0 shrink-0 pt-4 border-t border-gray-100'>
				<button
					type='button'
					onClick={handleCancel}
					className='flex-1 py-3 rounded-full border border-gray-300 text-[16px] font-semibold text-gray-900 bg-white hover:bg-gray-50 transition-colors'
				>
					Cancel
				</button>
				<button
					type='button'
					onClick={handleSave}
					className='flex-1 py-3 rounded-full bg-primary text-white text-[16px] font-semibold hover:bg-primary/90 transition-colors'
				>
					Save
				</button>
			</div>
		</div>
	)
}

export default SetLocationView
