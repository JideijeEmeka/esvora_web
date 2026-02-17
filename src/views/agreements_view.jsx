import React from 'react'
import { Check, ArrowLeftRight, ChevronLeft } from 'lucide-react'

const SAMPLE_AGREEMENTS = [
	{
		id: 1,
		title: 'Tenancy Agreement',
		status: 'Completed',
		date: '12th November 2025',
		party1: {
			name: 'Osaite Emmanuel',
			avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80'
		},
		party2: {
			name: 'Nathan James',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80'
		}
	},
	{
		id: 2,
		title: 'Sales Agreement',
		status: 'Completed',
		date: '12th November 2025',
		party1: {
			name: 'Oluwafemi Precious',
			avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80'
		},
		party2: {
			name: 'Nathan James',
			avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80'
		}
	}
]

const AgreementsView = ({ agreements = SAMPLE_AGREEMENTS, onBack }) => {
	return (
		<div className='space-y-6'>
			{onBack && (
				<div className='md:hidden'>
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				</div>
			)}
			<h2 className='text-[22px] font-semibold text-gray-900'>
				Agreements
			</h2>

			<div className='space-y-4'>
				{agreements.map((agreement) => (
					<div
						key={agreement.id}
						className='bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:bg-gray-50/80 transition-colors'
					>
						<div className='flex flex-col sm:flex-row sm:items-center gap-4'>
							{/* Overlapping avatars */}
							<div className='flex shrink-0'>
								<img
									src={agreement.party1?.avatar}
									alt={agreement.party1?.name}
									className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm -mr-3 z-10'
								/>
								<img
									src={agreement.party2?.avatar}
									alt={agreement.party2?.name}
									className='w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm z-0'
								/>
							</div>

							<div className='flex-1 min-w-0'>
								<h3 className='text-[18px] font-semibold text-gray-900 mb-2'>
									{agreement.title}
								</h3>
								<div className='flex items-center gap-2 text-[14px] text-gray-600 mb-3'>
									<span className='inline-flex items-center gap-1.5 text-green-700 font-medium'>
										<Check className='w-4 h-4 shrink-0' />
										{agreement.status}
									</span>
									<span>{agreement.date}</span>
								</div>
								<div className='flex items-center gap-2 flex-wrap'>
									<span className='text-[14px] font-medium text-gray-900'>
										{agreement.party1?.name}
									</span>
									<ArrowLeftRight className='w-4 h-4 text-gray-400 shrink-0' />
									<span className='text-[14px] font-medium text-gray-900'>
										{agreement.party2?.name}
									</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default AgreementsView
