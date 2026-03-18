import React from 'react'
import { ChevronLeft, Copy } from 'lucide-react'
import toast from 'react-hot-toast'

const DetailRow = ({ label, value, onCopy }) => (
	<div className='flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100'>
		<div>
			<p className='text-[12px] font-medium text-gray-500 mb-1'>{label}</p>
			<p className='text-[16px] font-semibold text-gray-900'>{value}</p>
		</div>
		{onCopy != null && value !== '—' && (
			<button
				type='button'
				onClick={onCopy}
				className='p-2 rounded-lg hover:bg-gray-200 text-primary transition-colors shrink-0'
				aria-label={`Copy ${label}`}
			>
				<Copy className='w-5 h-5' />
			</button>
		)}
	</div>
)

const PaymentMethodDetailsView = ({ method, onBack }) => {
	const masked = method?.card_number_last_four
		? `**** **** **** ${method.card_number_last_four}`
		: (method?.card_number ?? '**** **** **** ****')
	const expiry = method?.expiry_date ??
		((method?.expiry_month && method?.expiry_year)
			? `${String(method.expiry_month).padStart(2, '0')}/${method.expiry_year}`
			: '—')

	const copy = (text, label) => {
		if (!text || text === '—') return
		navigator.clipboard?.writeText(text).then(() => toast.success(`${label} copied`))
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
			{onBack && (
				<button
					type='button'
					onClick={onBack}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors'
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</button>
			)}

			<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900 mb-8'>
				Card details
			</h2>

			<div className='space-y-5'>
				<DetailRow
					label='Name on card'
					value={method?.cardholder_name ?? method?.cardholderName ?? '—'}
					onCopy={() => copy(method?.cardholder_name ?? method?.cardholderName ?? '', 'Name')}
				/>
				<DetailRow
					label='Card number'
					value={masked}
					onCopy={() => copy(method?.card_number ?? masked, 'Card number')}
				/>
				<DetailRow
					label='Expiry date'
					value={expiry}
					onCopy={() => copy(expiry === '—' ? '' : expiry, 'Expiry')}
				/>
				<DetailRow
					label='Card brand'
					value={method?.card_brand ?? method?.cardBrand ?? '—'}
					onCopy={() => copy(method?.card_brand ?? method?.cardBrand ?? '', 'Card brand')}
				/>
				<DetailRow
					label='Country'
					value={method?.country ?? '—'}
					onCopy={() => copy(method?.country ?? '', 'Country')}
				/>
				<DetailRow
					label='Default card'
					value={(method?.is_default ?? method?.isDefault) ? 'Yes' : 'No'}
					onCopy={null}
				/>
			</div>
		</div>
	)
}

export default PaymentMethodDetailsView
