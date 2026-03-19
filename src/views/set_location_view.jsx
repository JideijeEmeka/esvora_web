import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import {
	NIGERIAN_STATES_SORTED,
	getLocalGovernmentsByState
} from '../lib/constants'
import toast from 'react-hot-toast'

const SetLocationView = ({
	onBack,
	onSave,
	initialState = null,
	initialCity = null,
	isLoading = false
}) => {
	const [selectedState, setSelectedState] = useState(() => {
		if (initialState) {
			const found = NIGERIAN_STATES_SORTED.find(
				(s) => s.value === initialState || s.label === initialState
			)
			return found ?? null
		}
		return null
	})
	const [selectedCity, setSelectedCity] = useState(() => {
		if (!initialCity) return null
		const stateObj = NIGERIAN_STATES_SORTED.find(
			(s) => s.value === initialState || s.label === initialState
		)
		if (!stateObj) return null
		const lgas = getLocalGovernmentsByState(stateObj.value)
		return lgas.find((l) => l.value === initialCity || l.label === initialCity) ?? null
	})
	const [stateOpen, setStateOpen] = useState(false)
	const [cityOpen, setCityOpen] = useState(false)

	const localGovernments = useMemo(
		() => getLocalGovernmentsByState(selectedState?.value),
		[selectedState?.value]
	)

	const handleStateSelect = (item) => {
		setSelectedState(item)
		setSelectedCity(null)
		setStateOpen(false)
	}

	const handleCitySelect = (item) => {
		setSelectedCity(item)
		setCityOpen(false)
	}

	const handleSave = () => {
		const stateTrim = selectedState?.value?.trim() ?? selectedState?.label?.trim() ?? ''
		const cityTrim = selectedCity?.value?.trim() ?? selectedCity?.label?.trim() ?? ''
		if (!stateTrim) {
			toast.error('Please select a state')
			return
		}
		if (!cityTrim) {
			toast.error('Please select a local government')
			return
		}
		if (onSave) onSave(stateTrim, cityTrim)
		else if (onBack) onBack()
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 flex flex-col max-h-[85vh]'>
			<div className='flex items-start justify-between gap-4 shrink-0'>
				<div className='min-w-0'>
					{onBack && (
						<div className='md:mb-4'>
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
						Set location
					</h2>
					<p className='text-[14px] text-gray-500 mt-1'>
						Set your location to your area of interest
					</p>
				</div>
			</div>

			<div className='mt-6 space-y-6 shrink-0'>
				<div>
					<label className='block text-[14px] font-semibold text-gray-700 mb-2'>
						State
					</label>
					<div className='relative'>
						<button
							type='button'
							onClick={() => {
								setStateOpen(!stateOpen)
								setCityOpen(false)
							}}
							className='w-full flex items-center justify-between px-4 py-3 rounded-full border border-gray-300 text-left text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
						>
							<span className={selectedState ? 'text-gray-900' : 'text-gray-400'}>
								{selectedState?.label ?? 'Select state'}
							</span>
							<ChevronDown className='w-5 h-5 text-gray-500 shrink-0' />
						</button>
						{stateOpen && (
							<ul className='absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1'>
								{NIGERIAN_STATES_SORTED.map((item) => (
									<li key={item.value}>
										<button
											type='button'
											onClick={() => handleStateSelect(item)}
											className={`w-full text-left px-4 py-2.5 text-[16px] hover:bg-gray-50 ${
												selectedState?.value === item.value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-900'
											}`}
										>
											{item.label}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>

				<div>
					<label className='block text-[14px] font-semibold text-gray-700 mb-2'>
						Local government
					</label>
					<div className='relative'>
						<button
							type='button'
							disabled={!selectedState}
							onClick={() => {
								if (selectedState) {
									setCityOpen(!cityOpen)
									setStateOpen(false)
								}
							}}
							className='w-full flex items-center justify-between px-4 py-3 rounded-full border border-gray-300 text-left text-[16px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed'
						>
							<span className={selectedCity ? 'text-gray-900' : 'text-gray-400'}>
								{selectedCity?.label ?? 'Select local government'}
							</span>
							<ChevronDown className='w-5 h-5 text-gray-500 shrink-0' />
						</button>
						{cityOpen && selectedState && (
							<ul className='absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1'>
								{localGovernments.map((item) => (
									<li key={item.value}>
										<button
											type='button'
											onClick={() => handleCitySelect(item)}
											className={`w-full text-left px-4 py-2.5 text-[16px] hover:bg-gray-50 ${
												selectedCity?.value === item.value ? 'bg-primary/10 text-primary font-medium' : 'text-gray-900'
											}`}
										>
											{item.label}
										</button>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</div>

			<div className='flex gap-3 mt-8 shrink-0 pt-4 border-t border-gray-100'>
				<button
					type='button'
					onClick={onBack}
					className='flex-1 py-3 rounded-full border border-gray-300 text-[16px] font-semibold text-gray-900 bg-white hover:bg-gray-50 transition-colors'
				>
					Cancel
				</button>
				<button
					type='button'
					onClick={handleSave}
					disabled={isLoading}
					className='flex-1 py-3 rounded-full bg-primary text-white text-[16px] font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70'
				>
					{isLoading ? 'Saving...' : 'Save'}
				</button>
			</div>
		</div>
	)
}

export default SetLocationView
