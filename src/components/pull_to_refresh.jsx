import React, { useState, useRef } from 'react'
import { RefreshCw } from 'lucide-react'

/**
 * Wraps content and triggers onRefresh on pull-down (touch) or via refresh button.
 */
const PullToRefresh = ({ onRefresh, children, className = '', showRefreshButton = true }) => {
	const [refreshing, setRefreshing] = useState(false)
	const [pullY, setPullY] = useState(0)
	const startY = useRef(0)

	const doRefresh = async () => {
		if (!onRefresh || refreshing) return
		setRefreshing(true)
		try {
			await Promise.resolve(onRefresh())
		} finally {
			setRefreshing(false)
		}
	}

	const handleTouchStart = (e) => {
		startY.current = e.touches[0].clientY
	}

	const handleTouchMove = (e) => {
		if (window.scrollY <= 0) {
			const delta = e.touches[0].clientY - startY.current
			if (delta > 0) setPullY(Math.min(delta, 80))
		}
	}

	const handleTouchEnd = () => {
		if (pullY >= 60) {
			setPullY(0)
			doRefresh()
		} else {
			setPullY(0)
		}
	}

	return (
		<div
			className={`relative ${className}`}
			onTouchStart={handleTouchStart}
			onTouchMove={handleTouchMove}
			onTouchEnd={handleTouchEnd}
			onTouchCancel={() => setPullY(0)}
		>
			{showRefreshButton && (
				<div className='flex justify-end mb-2'>
					<button
						type='button'
						onClick={doRefresh}
						disabled={refreshing}
						className='flex items-center gap-1.5 text-[14px] text-gray-500 hover:text-gray-900 disabled:opacity-50'
						aria-label='Refresh'
					>
						<RefreshCw
							className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
						/>
						Refresh
					</button>
				</div>
			)}
			{(refreshing && !showRefreshButton) && (
				<div className='flex justify-center py-2'>
					<div className='w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin' />
				</div>
			)}
			{children}
		</div>
	)
}

export default PullToRefresh
