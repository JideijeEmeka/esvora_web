import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { ChevronDown } from 'lucide-react'

const DURATION_OPTIONS = [
	{ value: 'per-night', label: 'Per night' },
	{ value: 'per-week', label: 'Per week' },
	{ value: 'per-month', label: 'Per month' }
]

const AddForSalePriceView = () => {
	const navigate = useNavigate()
	const [price, setPrice] = useState('')
	const [duration, setDuration] = useState('')
	const [fromDate, setFromDate] = useState('')
	const [toDate, setToDate] = useState('')

	const handleBack = () => {
		navigate(-1)
	}

	const handleSaveAndContinue = () => {
		console.log('Sale price data:', {
			price,
			duration,
			fromDate,
			toDate
		})
		navigate('/property-owner/add-sale/documents')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				<div className='flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full'>
					<div className='w-full'>
						<div className='flex items-center gap-2 mb-8'>
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-primary rounded-full' />
						</div>

						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
							Fees
						</h1>

						<div className='space-y-6 mb-8'>
							<div>
								<label htmlFor='price' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Price
								</label>
								<input
									type='text'
									id='price'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
									placeholder='Enter fee'
									className='w-full px-4 py-3 border border-gray-300 rounded-full text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
								/>
							</div>

							<div>
								<label htmlFor='duration' className='block text-[16px] font-medium text-gray-900 mb-2'>
									Duration
								</label>
								<div className='relative'>
									<select
										id='duration'
										value={duration}
										onChange={(e) => setDuration(e.target.value)}
										className='w-full px-4 py-3 pr-10 border border-gray-300 rounded-full text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer'
									>
										<option value=''>e.g per night</option>
										{DURATION_OPTIONS.map((option) => (
											<option key={option.value} value={option.value}>
												{option.label}
											</option>
										))}
									</select>
									<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
								</div>
							</div>

							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label htmlFor='fromDate' className='block text-[16px] font-medium text-gray-900 mb-2'>
										From
									</label>
									<div className='relative'>
										<input
											type='date'
											id='fromDate'
											value={fromDate}
											onChange={(e) => setFromDate(e.target.value)}
											className='w-full px-4 py-3 pr-10 border border-gray-300 rounded-full text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer'
										/>
										<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
									</div>
								</div>

								<div>
									<label htmlFor='toDate' className='block text-[16px] font-medium text-gray-900 mb-2'>
										To
									</label>
									<div className='relative'>
										<input
											type='date'
											id='toDate'
											value={toDate}
											onChange={(e) => setToDate(e.target.value)}
											className='w-full px-4 py-3 pr-10 border border-gray-300 rounded-full text-[16px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer'
										/>
										<ChevronDown className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none' />
									</div>
								</div>
							</div>
						</div>

						<div className='flex gap-4 mt-12'>
							<button
								type='button'
								onClick={handleBack}
								className='flex-1 bg-white border-2 border-primary text-gray-700 px-8 py-4 rounded-full text-[18px] font-semibold hover:bg-gray-50 hover:border-purple-600 transition-all'
							>
								Back
							</button>
							<button
								type='button'
								onClick={handleSaveAndContinue}
								className='flex-1 bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
							>
								Save & continue
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddForSalePriceView
