import React, { useState, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { CreditCard, Eye, ChevronLeft, ChevronRight, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import PaymentProcessedWidget from '../components/payment_processed_widget'
import PropertyPaymentApprovalView from './property_payment_approval_view'

const CATEGORIES = [
	'Popular apartments',
	'Shop',
	'Shortlet',
	'Duplex',
	'Bungalow',
	'Flats',
	'Room & Parlor',
	'Event hall',
	'Shopping hall',
	'Selfcon',
	'Store'
]

const POPULAR_LOCATIONS = [
	'Lagos', 'Benin', 'Kano', 'Abeokuta', 'Akure', 'Calabar',
	'Abuja', 'Enugu', 'Maiduguri', 'Asaba', 'Ilorin',
	'Portharcout', 'Ibadan', 'Jos', 'Onitsha', 'Warri', 'Uyo'
]

const PAYMENT_METHODS = [
	{
		id: 'debit_card',
		label: 'Debit card',
		description: 'Pay via your debit/credit card.',
		icon: CreditCard
	},
	{
		id: 'bank_transfer',
		label: 'Bank transfer',
		description: 'Transfer from your bank account.',
		icon: Building2
	},
	{
		id: 'pay_offline',
		label: 'Pay offline',
		description: 'Process pay outside esvora.',
		icon: Eye
	}
]

const DEFAULT_PROPERTY = {
	id: 1,
	image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
	price: '₦120,500',
	description: '4 bedroom modern bungalow apartment',
	location: 'Ikoyi, Lagos, Nigeria'
}

const PaymentView = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const location = useLocation()
	const [paymentMethod, setPaymentMethod] = useState('debit_card')
	const [selectedCategory, setSelectedCategory] = useState('Popular apartments')
	const [isPaymentProcessedOpen, setIsPaymentProcessedOpen] = useState(false)
	const [showApproval, setShowApproval] = useState(false)
	const categoryRef = useRef(null)

	const state = location.state || {}
	const stateProperty = state.property
	const requestId = state.requestId
	const stateAmount = state.amount
	const hasRequestContext = requestId != null

	const property = stateProperty
		? {
				id: stateProperty.id ?? stateProperty.uuid ?? id,
				image: stateProperty.images?.[0] ?? stateProperty.image ?? DEFAULT_PROPERTY.image,
				images: stateProperty.images ?? (stateProperty.image ? [stateProperty.image] : [DEFAULT_PROPERTY.image]),
				price: stateProperty.price ?? DEFAULT_PROPERTY.price,
				priceNGN: stateProperty.priceNGN ?? stateProperty.paymentInfo?.total,
				totalPrice: stateProperty.paymentInfo?.total ?? stateProperty.priceNGN ?? stateProperty.totalPrice,
				description: stateProperty.description ?? stateProperty.title ?? DEFAULT_PROPERTY.description,
				location: stateProperty.location ?? stateProperty.fullAddress ?? stateProperty.address ?? DEFAULT_PROPERTY.location,
				address: stateProperty.address ?? stateProperty.fullAddress ?? stateProperty.location,
				property_type: stateProperty.property_type,
				propertyType: stateProperty.property_type ?? stateProperty.propertyType
			}
		: { ...DEFAULT_PROPERTY, id: id || DEFAULT_PROPERTY.id }

	const amount = stateAmount ?? property.totalPrice ?? property.priceNGN

	const scrollCategories = (direction) => {
		if (!categoryRef?.current) return
		const amount = 200
		categoryRef.current.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		})
	}

	const handleContinue = () => {
		if (paymentMethod === 'pay_offline') {
			toast.error('Offline payment is not available yet')
			return
		}
		if (paymentMethod === 'bank_transfer') {
			toast.error('Bank transfer is not available yet')
			return
		}
		if (hasRequestContext && requestId && (amount != null || property.totalPrice != null)) {
			setShowApproval(true)
			return
		}
		setIsPaymentProcessedOpen(true)
	}

	if (showApproval && hasRequestContext && requestId) {
		const propForApproval = {
			images: property.images ?? [property.image],
			image: property.image ?? property.images?.[0],
			price: typeof property.price === 'object' ? property.price : { total: amount ?? property.totalPrice ?? 0 },
			totalPrice: amount ?? property.totalPrice ?? property.priceNGN,
			property_type: property.property_type ? { name: property.property_type } : null,
			propertyType: property.property_type ?? property.propertyType,
			address: property.address ?? property.location
		}
		return (
			<>
				<Navbar />
				<div className='pt-24 pb-10 px-6 md:px-16 lg:px-20'>
					<PropertyPaymentApprovalView
						property={propForApproval}
						amount={amount ?? property.totalPrice}
						propertyRequestId={requestId}
						onBack={() => setShowApproval(false)}
						onApproveSuccess={() => setIsPaymentProcessedOpen(true)}
						onAddCard={() => {}}
					/>
				</div>
				<Footer />
				<PaymentProcessedWidget
					isOpen={isPaymentProcessedOpen}
					onClose={() => setIsPaymentProcessedOpen(false)}
					onGoHome={() => navigate('/requests')}
				/>
			</>
		)
	}

	return (
		<>
			<PaymentProcessedWidget
				isOpen={isPaymentProcessedOpen}
				onClose={() => setIsPaymentProcessedOpen(false)}
			/>
			<Navbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20'>

				{/* Two-column: Property card + Payment method */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16'>
					{/* Left: Property details card */}
					<div className='bg-white rounded-2xl border border-gray-200 overflow-hidden'>
						<img
							src={property.image ?? property.images?.[0]}
							alt={property.description ?? ''}
							className='w-full h-[240px] object-cover'
						/>
						<div className='p-6'>
							<p className='text-[24px] font-semibold text-gray-900 mb-2'>
								{typeof property.price === 'string'
									? property.price
									: property.totalPrice != null
										? `₦${Number(property.totalPrice).toLocaleString()}`
										: '—'}
							</p>
							<p className='text-[16px] font-medium text-gray-700 mb-2'>
								{property.description ?? property.title ?? '—'}
							</p>
							<p className='text-[14px] text-gray-500'>{property.location ?? property.address ?? '—'}</p>
						</div>
					</div>

					{/* Right: Select payment method */}
					<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
						<h2 className='text-[22px] font-semibold text-gray-900 mb-6'>
							Select payment method
						</h2>

						<div className='space-y-4 mb-8'>
							{PAYMENT_METHODS.map((method) => {
								const Icon = method.icon
								const isSelected = paymentMethod === method.id
								return (
									<label
										key={method.id}
										className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
											isSelected
												? 'border-primary bg-primary/5'
												: 'border-gray-200 hover:border-gray-300'
										}`}
									>
										<div className='shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
											<Icon className='w-5 h-5 text-gray-700' />
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-[16px] font-medium text-gray-900'>
												{method.label}
											</p>
											<p className='text-[14px] text-gray-600'>
												{method.description}
											</p>
										</div>
										<div className='shrink-0 flex items-center justify-center w-6 h-6 rounded-full border-2 border-gray-300'>
											{isSelected && (
												<div className='w-3 h-3 rounded-full bg-primary' />
											)}
										</div>
										<input
											type='radio'
											name='payment_method'
											value={method.id}
											checked={isSelected}
											onChange={() => setPaymentMethod(method.id)}
											className='sr-only'
										/>
									</label>
								)
							})}
						</div>

						<button
							type='button'
							onClick={handleContinue}
							className='w-full py-3 rounded-full bg-primary 
							    text-white font-semibold text-[16px] hover:bg-primary/90 transition-colors'
						>
							Continue
						</button>
					</div>
				</div>

				{/* Find affordable properties */}
				<div className='mb-12 mt-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							Find affordable properties near you!
						</h2>
						<div className='flex items-center gap-2 max-md:hidden'>
							<button
								type='button'
								onClick={() => scrollCategories('left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								type='button'
								onClick={() => scrollCategories('right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					<div
						ref={categoryRef}
						className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide'
					>
						{CATEGORIES.map((category) => (
							<button
								key={category}
								type='button'
								onClick={() => setSelectedCategory(category)}
								className={`shrink-0 px-6 py-3 rounded-full font-medium text-[16px] transition-colors ${
									selectedCategory === category
										? 'bg-gray-800 text-white'
										: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
								}`}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				{/* Popular locations */}
				<div className='mb-1'>
					<h2 className='text-[24px] font-semibold text-gray-900 mb-6'>
						Popular locations
					</h2>
					<div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
						{POPULAR_LOCATIONS.map((location, index) => (
							<button
								key={index}
								type='button'
								className='text-left px-4 py-3 hover:bg-gray-100 rounded-lg text-[16px] font-medium text-gray-700 transition-colors'
							>
								{location}
							</button>
						))}
					</div>
				</div>
			</div>

			<Footer />
		</>
	)
}

export default PaymentView
