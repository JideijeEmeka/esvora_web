import React from 'react'
import Divider from './divider'

const RENTAGE_LABELS = {
	daily: 'per day',
	weekly: 'per week',
	monthly: 'per month',
	yearly: 'per year'
}

const formatAmount = (n) => `NGN ${Number(n ?? 0).toLocaleString()}.00`

const PaymentWidget = ({ paymentInfo }) => {
	if (!paymentInfo) return null

	// Use price model: { total, other_fees, rentage_fee, rentage_type }
	const rentageFee = paymentInfo.rentage_fee ?? paymentInfo.rent ?? 0
	const rentageType = (paymentInfo.rentage_type ?? 'monthly').toLowerCase()
	const otherFees = Array.isArray(paymentInfo.other_fees) ? paymentInfo.other_fees : []
	const otherFeesSum = otherFees.reduce(
		(sum, f) => sum + Number(f.amount ?? f.value ?? 0),
		0
	)
	const total = paymentInfo.total ?? (rentageFee + otherFeesSum)
	const rentageLabel = RENTAGE_LABELS[rentageType] ?? rentageType

	return (
		<div className='mb-8'>
			<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>Payment information</h2>
			<p className='text-[14px] text-gray-600 mb-6'>
				Kindly note that payment information is subject to change by the property owner.
			</p>
			<div className='border border-gray-200 rounded-3xl p-6'>
				<div className='space-y-4'>
					<div className='flex flex-col justify-between items-start'>
						<span className='text-[16px] text-gray-900'>
							Rentage ({rentageLabel})
						</span>
						<span className='text-[16px] font-medium text-gray-500 mt-2'>
							{formatAmount(rentageFee)}
						</span>
					</div>
					{otherFees.map((fee, i) => (
						<React.Fragment key={i}>
							<Divider width='full' />
							<div className='flex flex-col justify-between items-start'>
								<span className='text-[16px] text-gray-700'>
									{fee.name ?? fee.label ?? `Fee ${i + 1}`}
								</span>
								<span className='text-[16px] font-medium text-gray-500 mt-2'>
									{formatAmount(fee.amount ?? fee.value)}
								</span>
							</div>
						</React.Fragment>
					))}
					<Divider width='full' />
					<div className='border-t border-gray-300 pt-4 flex flex-col justify-between items-start'>
						<span className='text-[18px] font-semibold text-gray-700'>Total</span>
						<span className='text-[20px] font-bold text-gray-500 mt-2'>
							{formatAmount(total)}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default PaymentWidget
