import React from 'react'
import { Check } from 'lucide-react'

const RegulationsWidget = ({ regulations }) => {
	return (
		<div className='mb-8'>
			<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>House regulations</h2>
			<div className='space-y-3'>
				{regulations.map((regulation, index) => (
					<div key={index} className='flex items-start gap-3'>
						<Check className='w-5 h-5 text-green-600 mt-0.5 shrink-0' />
						<span className='text-[16px] text-gray-700'>{regulation}</span>
					</div>
				))}
			</div>
		</div>
	)
}

export default RegulationsWidget
