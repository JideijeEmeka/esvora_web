import React, { useMemo } from 'react'
import Divider from './divider'

const PaymentWidget = ({ paymentInfo }) => {
	const totalPayment = useMemo(() => {
		return Object.values(paymentInfo).reduce((sum, val) => sum + val, 0)
	}, [paymentInfo])

	return (
		<div className='mb-8'>
			<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Payment information</h2>
			<p className='text-[14px] text-gray-600 mb-6'>
				Kindly note that payment information is subject to change by the property owner.
			</p>
			<div className='border border-gray-200 rounded-3xl p-6'>
				<div className='space-y-4'>
					<div className='flex flex-col justify-between items-start'>
						<span className='text-[16px] text-gray-900'>Rentage/year</span>
						<span className='text-[16px] font-medium text-gray-500 mt-2'>
							NGN {paymentInfo.rent.toLocaleString()}.00
						</span>
					</div>
					<Divider width='full' />
					<div className='flex flex-col justify-between items-start'>
						<span className='text-[16px] text-gray-700'>Electricity fee</span>
						<span className='text-[16px] font-medium text-gray-500 mt-2'>
							NGN {paymentInfo.electricity.toLocaleString()}.00
						</span>
					</div>
					{paymentInfo.waste !== undefined && (
						<>
							<Divider width='full' />
							<div className='flex flex-col justify-between items-start'>
								<span className='text-[16px] text-gray-700'>Waste fee</span>
								<span className='text-[16px] font-medium text-gray-500 mt-2'>
									NGN {paymentInfo.waste.toLocaleString()}.00
								</span>
							</div>
						</>
					)}
					{paymentInfo.maintenance !== undefined && (
						<>
							<Divider width='full' />
							<div className='flex flex-col justify-between items-start'>
								<span className='text-[16px] text-gray-700'>Maintan fee</span>
								<span className='text-[16px] font-medium text-gray-500 mt-2'>
									NGN {paymentInfo.maintenance.toLocaleString()}.00
								</span>
							</div>
						</>
					)}
					<Divider width='full' />
					<div className='flex flex-col justify-between items-start'>
						<span className='text-[16px] text-gray-700'>Security fee</span>
						<span className='text-[16px] font-medium text-gray-500 mt-2'>
							NGN {paymentInfo.security.toLocaleString()}.00
						</span>
					</div>
					<Divider width='full' />
					<div className='flex flex-col justify-between items-start'>
						<span className='text-[16px] text-gray-700'>Others</span>
						<span className='text-[16px] font-medium text-gray-500 mt-2'>
							NGN {paymentInfo.others.toLocaleString()}.00
						</span>
					</div>
					<div className='border-t border-gray-300 pt-4 flex flex-col justify-between items-start'>
						<span className='text-[18px] font-semibold text-gray-700'>Total</span>
						<span className='text-[20px] font-bold text-gray-500 mt-2'>
							NGN {totalPayment.toLocaleString()}.00
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PaymentWidget
