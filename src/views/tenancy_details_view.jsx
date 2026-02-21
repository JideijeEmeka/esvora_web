import React from 'react'
import { MapPin, Check } from 'lucide-react'

const TenancyDetailsView = ({ tenancy }) => {
	if (!tenancy) return null

	const { status, image, price, description, location, propertyType, dateListed, dateRented, duration, amount, agent } = tenancy

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
			{/* Status tag */}
			<div className='mb-6'>
				<span className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-[14px] font-medium'>
					<Check className='w-4 h-4' />
					{status}
				</span>
			</div>

			{/* Property summary card */}
			<div className='rounded-xl border border-gray-200 overflow-hidden mb-6'>
				<img
					src={image}
					alt={description}
					className='w-full h-[200px] object-cover'
				/>
				<div className='p-4'>
					<p className='text-[20px] font-semibold text-gray-900 mb-1'>
						{price}
					</p>
					<p className='text-[16px] font-medium text-gray-700 mb-1'>
						{description}
					</p>
					<div className='flex items-center gap-1 text-gray-500'>
						<MapPin className='w-4 h-4 shrink-0' />
						<span className='text-[14px]'>{location}</span>
					</div>
				</div>
			</div>

			{/* Property information */}
			<h3 className='text-[18px] font-semibold text-gray-900 mb-4'>
				Property information
			</h3>
			<div className='rounded-xl border border-gray-200 divide-y divide-gray-100 mb-6'>
				{[
					{ label: 'Property type', value: propertyType },
					{ label: 'Date listed', value: dateListed },
					{ label: 'Date rented', value: dateRented },
					{ label: 'Duration', value: duration },
					{ label: 'Amount', value: amount }
				].map(({ label, value }) => (
					<div
						key={label}
						className='flex justify-between items-center px-4 py-3'
					>
						<span className='text-[14px] font-medium text-gray-600'>
							{label}
						</span>
						<span className='text-[14px] font-medium text-gray-900'>
							{value}
						</span>
					</div>
				))}
			</div>

			{/* Agent */}
			<h3 className='text-[18px] font-semibold text-gray-900 mb-4'>
				Landlord
			</h3>
			<div className='flex items-center gap-4 p-4 rounded-xl border border-gray-200'>
				<img
					src={agent?.avatar}
					alt={agent?.name}
					className='w-14 h-14 shrink-0 rounded-full object-cover border-2 border-gray-200'
				/>
				<div className='min-w-0 flex-1'>
					<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[12px] font-medium mb-2'>
						<Check className='w-3 h-3' />
						Verified
					</span>
					<p className='text-[16px] font-semibold text-gray-900'>
						{agent?.name}
					</p>
					<p className='text-[14px] text-gray-500'>
						{agent?.joiningDate}
					</p>
				</div>
			</div>
		</div>
	)
}

export default TenancyDetailsView
