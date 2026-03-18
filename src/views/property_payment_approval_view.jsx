import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { selectPaymentMethods } from '../redux/slices/walletSlice'
import paymentController from '../controllers/payment_controller'
import Loader from '../components/loader'
import PaymentMethodsView from './payment_methods_view'

const PropertyPaymentApprovalView = ({
	property,
	amount,
	propertyRequestId,
	onBack,
	onApproveSuccess,
	onAddCard
}) => {
	const methods = useSelector(selectPaymentMethods)
	const [selectedMethod, setSelectedMethod] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [showPaymentMethods, setShowPaymentMethods] = useState(false)

	useEffect(() => {
		paymentController.listPaymentMethods({
			setLoading: setIsLoading,
			forceRefetch: true,
			onError: () => {}
		})
	}, [])

	const imageUrl = property?.images?.[0] ?? property?.image
	const priceStr = property?.price?.total != null
		? `₦${Number(property.price.total).toLocaleString()}`
		: property?.totalPrice != null
			? `₦${Number(property.totalPrice).toLocaleString()}`
			: '—'
	const typeStr = property?.property_type?.name ?? property?.propertyType ?? '—'
	const addressStr = property?.address ??
		[property?.city, property?.state].filter(Boolean).join(', ') ??
		'—'

	const handleApprove = () => {
		if (!selectedMethod) {
			toast.error('Please select a card')
			return
		}
		if (amount == null || !propertyRequestId) {
			toast.error('Missing payment details')
			return
		}
		const id = selectedMethod.id ?? selectedMethod.uuid
		if (!id) return
		paymentController.approvePayment({
			amount,
			paymentMethodUuid: id,
			propertyRequestId,
			setLoading: setIsLoading,
			onSuccess: () => {
				toast.success('Payment initialized')
				onApproveSuccess?.()
			},
			onError: (m) => toast.error(m ?? 'Failed to initialize payment')
		})
	}

	if (showPaymentMethods) {
		return (
			<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
				<PaymentMethodsView
					onBack={() => setShowPaymentMethods(false)}
					onAddCard={() => {
						setShowPaymentMethods(false)
						onAddCard?.()
					}}
					onCardDetails={() => {}}
					onEditCard={() => {}}
				/>
			</div>
		)
	}

	const buildSelectableCard = (method) => {
		const masked = method.card_number_last_four
			? `**** **** **** ${method.card_number_last_four}`
			: (method.card_number ?? '**** **** **** ****')
		const expiry = method.expiry_date ??
			((method.expiry_month && method.expiry_year)
				? `${String(method.expiry_month).padStart(2, '0')}/${method.expiry_year}`
				: '—')
		const isSelected = selectedMethod?.id === method.id || selectedMethod?.uuid === method.uuid

		return (
			<button
				key={method.id ?? method.uuid}
				type='button'
				onClick={() => setSelectedMethod(method)}
				className={`w-full p-4 mb-3 rounded-xl text-left transition-colors ${
					isSelected ? 'border-2 border-primary bg-primary/5' : 'border border-gray-200'
				}`}
			>
				<div className='flex justify-between items-center'>
					<div>
						<p className='text-[16px] font-semibold text-gray-900'>
							{method.cardholder_name ?? method.cardholderName ?? '—'}
						</p>
						<div className='flex items-center gap-2 mt-1'>
							<span className='text-[14px] text-gray-500'>{masked}</span>
							<span className='w-2 h-2 rounded-full bg-gray-400' />
							<span className='text-[14px] text-gray-500'>{expiry}</span>
						</div>
					</div>
					<div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center'>
						<CreditCard className='w-5 h-5 text-gray-500' />
					</div>
				</div>
			</button>
		)
	}

	return (
		<div className='bg-white mt-10 rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
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

			<h2 className='text-[24px] font-bold text-gray-900 mb-6'>Payment</h2>

			{/* Property card */}
			<div className='p-4 rounded-xl bg-gray-50 border border-gray-100 mb-8'>
				<div className='flex gap-4'>
					{imageUrl ? (
						<img
							src={imageUrl}
							alt=''
							className='w-20 h-20 rounded-lg object-cover'
						/>
					) : (
						<div className='w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center'>
							<CreditCard className='w-8 h-8 text-gray-400' />
						</div>
					)}
					<div>
						<p className='text-[20px] font-semibold text-gray-900'>{priceStr}</p>
						<p className='text-[14px] text-gray-600'>{typeStr}</p>
						<p className='text-[14px] text-gray-500 truncate max-w-xs'>{addressStr}</p>
					</div>
				</div>
			</div>

			<p className='text-[18px] font-semibold text-gray-900 mb-4'>Select card</p>

			{isLoading && methods.length === 0 ? (
				<div className='flex justify-center py-12'>
					<Loader />
				</div>
			) : methods.length === 0 ? (
				<div className='text-center py-8'>
					<p className='text-[14px] text-gray-500 mb-4'>
						No payment methods added
					</p>
					<button
						type='button'
						onClick={() => setShowPaymentMethods(true)}
						className='px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors'
					>
						Add card
					</button>
				</div>
			) : (
				<>
					<div className='mb-8'>
						{methods.map((m) => buildSelectableCard(m))}
					</div>
					<button
						type='button'
						onClick={handleApprove}
						disabled={!selectedMethod || isLoading}
						className='w-full py-4 rounded-xl bg-primary text-white font-semibold text-[16px] hover:bg-primary/90 disabled:opacity-50 transition-colors'
					>
						{isLoading ? 'Processing...' : 'Approve payment'}
					</button>
				</>
			)}
		</div>
	)
}

export default PropertyPaymentApprovalView
