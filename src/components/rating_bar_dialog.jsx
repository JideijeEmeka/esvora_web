import React, { useState } from 'react'
import { Star } from 'lucide-react'
import logo from '../assets/logo.png'
import { kPlaystoreUrl, kAppStoreUrl } from '../lib/constants'
import toast from 'react-hot-toast'

const RatingBarDialog = ({ onClose }) => {
	const [rating, setRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	const displayRating = hoverRating || rating

	const handleStarClick = (value) => {
		setRating(value)
		// Submit on star click (same behavior as Flutter)
		if (value >= 4) {
			// Open app store - on web we detect mobile or use generic links
			const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
			if (isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
				window.open(`${kAppStoreUrl}?action=write-review`, '_blank')
			} else {
				window.open(kPlaystoreUrl, '_blank')
			}
		} else {
			toast.success('Thanks for the feedback!')
		}
		onClose?.()
	}

	const handleNotNow = () => {
		onClose?.()
	}

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			<div
				className='absolute inset-0 bg-black/50'
				aria-hidden='true'
			/>
			<div
				className='relative bg-white rounded-[30px] shadow-xl p-6 max-w-md w-full'
				role='dialog'
				aria-modal='true'
				aria-labelledby='rating-dialog-title'
			>
				<div className='w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center shadow-md mb-4'>
					<img src={logo} alt='Esvora' className='w-8 h-8 object-contain' />
				</div>
				<h2 id='rating-dialog-title' className='text-[16px] font-bold text-gray-900 mb-1.5'>
					Enjoying Esvora?
				</h2>
				<p className='text-[14px] text-gray-600 mb-4'>
					Tap a star to rate it on the App Store.
				</p>
				<div className='border-t border-gray-200 my-4' />
				<div className='flex justify-center gap-1 mb-6'>
					{[1, 2, 3, 4, 5].map((value) => (
						<button
							key={value}
							type='button'
							onClick={() => handleStarClick(value)}
							onMouseEnter={() => setHoverRating(value)}
							onMouseLeave={() => setHoverRating(0)}
							className='p-1 rounded transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/30'
							aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
						>
							<Star
								className={`w-7 h-7 transition-colors ${
									value <= displayRating
										? 'fill-primary text-primary'
										: 'text-gray-300'
								}`}
							/>
						</button>
					))}
				</div>
				<button
					type='button'
					onClick={handleNotNow}
					className='w-full h-12 rounded-full bg-gray-100 text-gray-900 text-[16px] font-semibold hover:bg-gray-200 transition-colors'
				>
					Not Now
				</button>
			</div>
		</div>
	)
}

export default RatingBarDialog
