import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const SORT_OPTIONS = [
	{ id: 'newest', label: 'Newest first' },
	{ id: 'oldest', label: 'Oldest first' },
	{ id: 'price_low', label: 'Lowest to Highest' },
	{ id: 'price_high', label: 'Highest to Lowest' },
	{ id: 'status_pending', label: 'Pending' },
	{ id: 'status_approved', label: 'Approved' },
	{ id: 'status_declined', label: 'Declined' }
]

const SortRequestsBottomSheet = ({ isOpen, onClose, value, onChange }) => {
	const [selected, setSelected] = useState(value ?? 'newest')

	useEffect(() => {
		if (isOpen && value != null) setSelected(value)
	}, [isOpen, value])

	const handleSelect = (id) => {
		setSelected(id)
		onChange?.(id)
		onClose?.()
	}

	if (!isOpen) return null

	return (
		<div
			className="fixed inset-0 z-50 flex flex-col justify-end"
			role="dialog"
			aria-modal="true"
			aria-labelledby="sort-title"
		>
			<div
				className="absolute inset-0 bg-black/40"
				onClick={onClose}
				aria-hidden="true"
			/>
			<div className="relative bg-white rounded-t-2xl shadow-xl max-h-[85vh] overflow-hidden">
				<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
					<h2 id="sort-title" className="text-[18px] font-semibold text-gray-900">
						Sort requests
					</h2>
					<button
						type="button"
						onClick={onClose}
						className="p-2 rounded-full hover:bg-gray-100 transition-colors"
						aria-label="Close"
					>
						<X className="w-5 h-5 text-gray-600" />
					</button>
				</div>
				<div className="px-6 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
					{SORT_OPTIONS.map((opt) => (
						<button
							key={opt.id}
							type="button"
							onClick={() => handleSelect(opt.id)}
							className={`w-full text-left px-4 py-3 rounded-xl text-[16px] font-medium transition-colors ${
								selected === opt.id
									? 'bg-primary text-white'
									: 'bg-gray-100 text-gray-800 hover:bg-gray-200'
							}`}
						>
							{opt.label}
						</button>
					))}
				</div>
			</div>
		</div>
	)
}

export default SortRequestsBottomSheet