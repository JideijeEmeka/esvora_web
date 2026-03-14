import React, { useState, useEffect } from 'react'
import { X, Calendar } from 'lucide-react'

const STATUS_OPTIONS = ['Completed', 'Processing', 'Pending', 'Failed']

const toInputDate = (d) => {
	if (!d) return ''
	const dt = d instanceof Date ? d : new Date(d)
	return dt.toISOString().slice(0, 10)
}

const FilterWalletTransactionsView = ({
	initialTabKey = 'all',
	initialFilter,
	onApply,
	onClose
}) => {
	const [fromDate, setFromDate] = useState(
		initialFilter?.tabKey === initialTabKey && initialFilter?.fromDate
			? toInputDate(initialFilter.fromDate)
			: ''
	)
	const [toDate, setToDate] = useState(
		initialFilter?.tabKey === initialTabKey && initialFilter?.toDate
			? toInputDate(initialFilter.toDate)
			: ''
	)
	const [status, setStatus] = useState(
		initialFilter?.tabKey === initialTabKey ? initialFilter?.status ?? '' : ''
	)
	const [isStatusOpen, setIsStatusOpen] = useState(false)

	const handleClear = () => {
		setFromDate('')
		setToDate('')
		setStatus('')
		onApply?.({
			fromDate: null,
			toDate: null,
			status: null,
			tabKey: initialTabKey
		})
		onClose?.()
	}

	const handleApply = () => {
		const from = fromDate ? new Date(fromDate) : null
		const to = toDate ? new Date(toDate) : null
		onApply?.({
			fromDate: from,
			toDate: to,
			status: status || null,
			tabKey: initialTabKey
		})
		onClose?.()
	}

	// Prevent body scroll when modal is open (same as FilterPropertiesWidget)
	useEffect(() => {
		const scrollY = window.scrollY
		document.body.style.overflow = 'hidden'
		document.body.style.position = 'fixed'
		document.body.style.top = `-${scrollY}px`
		document.body.style.width = '100%'
		return () => {
			document.body.style.overflow = ''
			document.body.style.position = ''
			document.body.style.top = ''
			document.body.style.width = ''
			window.scrollTo(0, scrollY)
		}
	}, [])

	return (
		<div
			className='fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto scrollbar-hide'
				onClick={(e) => e.stopPropagation()}
			>
				<div className='p-4 border-b border-gray-200 flex items-center justify-between'>
					<h3 className='text-[18px] font-semibold text-gray-900'>Filter</h3>
					<button
						type='button'
						onClick={onClose}
						className='p-2 rounded-lg hover:bg-gray-100 text-gray-600'
						aria-label='Close'
					>
						<X className='w-5 h-5' />
					</button>
				</div>

				<div className='p-6'>
					{/* Date Section */}
					<div className='mb-8'>
						<p className='text-[16px] font-semibold text-gray-900 mb-4'>Date</p>
						<div className='space-y-4'>
							<div>
								<p className='text-[14px] font-medium text-gray-600 mb-2'>From</p>
								<div className='relative'>
									<input
										type='date'
										value={fromDate}
										onChange={(e) => setFromDate(e.target.value)}
										className='w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10'
									/>
									<Calendar className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
								</div>
							</div>
							<div>
								<p className='text-[14px] font-medium text-gray-600 mb-2'>To</p>
								<div className='relative'>
									<input
										type='date'
										value={toDate}
										onChange={(e) => setToDate(e.target.value)}
										className='w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary pr-10'
									/>
									<Calendar className='absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none' />
								</div>
							</div>
						</div>
					</div>

					{/* Status Section */}
					<div>
						<p className='text-[16px] font-semibold text-gray-900 mb-4'>Category</p>
						<p className='text-[14px] font-medium text-gray-600 mb-2'>Status</p>
						<div className='relative'>
							<button
								type='button'
								onClick={() => setIsStatusOpen((prev) => !prev)}
								className='w-full px-4 py-3 rounded-xl border border-gray-200 text-left text-[14px] flex items-center justify-between hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							>
								<span className={status ? 'text-gray-900' : 'text-gray-400'}>
									{status || 'Select status'}
								</span>
								<svg className='w-5 h-5 text-gray-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
									<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
								</svg>
							</button>
							{isStatusOpen && (
								<>
									<div
										className='fixed inset-0 z-10'
										onClick={() => setIsStatusOpen(false)}
										aria-hidden='true'
									/>
									<ul className='absolute z-20 w-full mt-1 py-1 rounded-xl border border-gray-200 bg-white shadow-lg max-h-48 overflow-y-auto'>
										{STATUS_OPTIONS.map((opt) => (
											<li
												key={opt}
												role='option'
												onClick={() => {
													setStatus(opt)
													setIsStatusOpen(false)
												}}
												className={`px-4 py-3 text-[14px] cursor-pointer hover:bg-gray-50 ${
													status === opt ? 'bg-primary/5 text-primary font-medium' : 'text-gray-900'
												}`}
											>
												{opt}
											</li>
										))}
									</ul>
								</>
							)}
						</div>
					</div>
				</div>

				<div className='p-6 border-t border-gray-200 flex gap-3'>
					<button
						type='button'
						onClick={handleClear}
						className='flex-1 py-3 rounded-xl border border-gray-300 text-[16px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
					>
						Clear filter
					</button>
					<button
						type='button'
						onClick={handleApply}
						className='flex-1 py-3 rounded-xl bg-primary text-white text-[16px] font-semibold hover:bg-primary/90 transition-colors'
					>
						Apply filter
					</button>
				</div>
			</div>
		</div>
	)
}

export default FilterWalletTransactionsView
