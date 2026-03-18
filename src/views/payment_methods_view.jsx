import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, CreditCard, Plus, RefreshCw, Pencil, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { selectPaymentMethods } from '../redux/slices/walletSlice'
import paymentController from '../controllers/payment_controller'
import Loader from '../components/loader'

const PaymentMethodsView = ({ onBack, onAddCard, onCardDetails, onEditCard }) => {
	const methods = useSelector(selectPaymentMethods)
	const [isLoading, setIsLoading] = useState(false)
	const [deleteMethod, setDeleteMethod] = useState(null)

	useEffect(() => {
		paymentController.listPaymentMethods({
			setLoading: setIsLoading,
			forceRefetch: true,
			onError: () => {}
		})
	}, [])

	const handleRefresh = () => {
		setIsLoading(true)
		paymentController.listPaymentMethods({
			setLoading: setIsLoading,
			forceRefetch: true,
			onError: () => {}
		})
	}

	const handleDeleteClick = (method, e) => {
		e.stopPropagation()
		setDeleteMethod(method)
	}

	const handleEditClick = (method, e) => {
		e.stopPropagation()
		onEditCard?.(method)
	}

	const handleConfirmDelete = () => {
		const id = deleteMethod?.id ?? deleteMethod?.uuid
		if (!id) return
		setDeleteMethod(null)
		paymentController.deletePaymentMethod({
			id,
			setLoading: setIsLoading,
			onSuccess: () => toast.success('Payment method deleted successfully.'),
			onError: (m) => toast.error(m ?? 'Failed to remove payment method')
		})
	}

	const buildCard = (method) => {
		const masked = method.card_number_last_four
			? `**** **** **** ${method.card_number_last_four}`
			: (method.card_number ?? '**** **** **** ****')
		const expiry = method.expiry_date ??
			((method.expiry_month && method.expiry_year)
				? `${String(method.expiry_month).padStart(2, '0')}/${method.expiry_year}`
				: '—')

		return (
			<div
				key={method.id ?? method.uuid}
				role='button'
				tabIndex={0}
				onClick={() => onCardDetails?.(method)}
				onKeyDown={(e) => e.key === 'Enter' && onCardDetails?.(method)}
				className='block w-full p-4 mb-5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-colors text-left'
			>
				<div className='flex justify-between items-start mb-5'>
					<div>
						<p className='text-[16px] font-semibold text-gray-900'>
							{method.cardholder_name ?? method.cardholderName ?? '—'}
						</p>
						<div className='flex items-center gap-2 mt-2'>
							<span className='text-[14px] text-gray-500'>{masked}</span>
							<span className='w-2 h-2 rounded-full bg-gray-400' />
							<span className='text-[14px] text-gray-500'>{expiry}</span>
						</div>
					</div>
					<div className='w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center'>
						<CreditCard className='w-5 h-5 text-gray-500' />
					</div>
				</div>
				<div className='flex items-center gap-2'>
					<button
						type='button'
						onClick={(e) => handleEditClick(method, e)}
						className='px-4 py-2 rounded-lg border border-gray-300 text-[14px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors'
					>
						Edit
					</button>
					<button
						type='button'
						onClick={(e) => handleDeleteClick(method, e)}
						className='px-4 py-2 rounded-lg bg-red-600 text-[14px] font-semibold text-white hover:bg-red-700 transition-colors'
					>
						Remove card
					</button>
				</div>
			</div>
		)
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

			<div className='flex items-start justify-between gap-4 mb-8'>
				<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900'>
					Payment method
				</h2>
				<button
					type='button'
					onClick={handleRefresh}
					disabled={isLoading}
					className='p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors shrink-0'
					aria-label='Refresh'
				>
					<RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
				</button>
			</div>

			{isLoading && methods.length === 0 ? (
				<div className='flex justify-center py-16'>
					<Loader />
				</div>
			) : methods.length === 0 ? (
				<div className='text-center py-12 mb-8'>
					<div className='w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6'>
						<CreditCard className='w-12 h-12 text-gray-400' />
					</div>
					<p className='text-[18px] font-semibold text-gray-900 mb-2'>
						Add payment method
					</p>
					<p className='text-[14px] text-gray-500 mb-8'>
						You have not added a payment method yet
					</p>
				</div>
			) : (
				<div className='mb-8'>
					{methods.map((m) => buildCard(m))}
				</div>
			)}

			{deleteMethod && (
				<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40'>
					<div className='bg-white rounded-2xl p-6 max-w-md w-full shadow-xl'>
						<h3 className='text-[18px] font-semibold text-gray-900 mb-2'>
							Remove card
						</h3>
						<p className='text-[14px] text-gray-600 mb-6'>
							Are you sure you want to remove this payment method?
						</p>
						<div className='flex gap-3 justify-end'>
							<button
								type='button'
								onClick={() => setDeleteMethod(null)}
								className='px-4 py-2 rounded-xl text-[14px] font-medium text-gray-700 hover:bg-gray-100 transition-colors'
							>
								Cancel
							</button>
							<button
								type='button'
								onClick={handleConfirmDelete}
								className='px-4 py-2 rounded-xl text-[14px] font-semibold text-red-600 hover:bg-red-50 transition-colors'
							>
								Remove
							</button>
						</div>
					</div>
				</div>
			)}

			<button
				type='button'
				onClick={onAddCard}
				className='w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-300 text-gray-700 hover:border-primary hover:text-primary font-semibold text-[16px] transition-colors'
			>
				<Plus className='w-5 h-5' />
				Add card
			</button>
		</div>
	)
}

export default PaymentMethodsView
