import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import PaystackPop from '@paystack/inline-js'
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { kPayStack, kFlutterWave } from '../lib/constants'
import walletController from '../controllers/wallet_controller'
import { selectCurrentAccount } from '../redux/slices/accountSlice'
import Loader from '../components/loader'

const ChooseDepositServiceView = ({ amount, onBack, onComplete }) => {
	const [isLoading, setIsLoading] = useState(false)
	const account = useSelector(selectCurrentAccount)
	const paystackPublicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY
	const flutterwavePublicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY
	const parsedAmount = Number(String(amount).replace(/[^\d.]/g, '')) || 0
	const customerPhone = (account?.phone_number ?? account?.phone ?? account?.user?.phone_number ?? account?.user?.phone ?? '08000000000').toString().replace(/\D/g, '').slice(-11) || '08000000000'
	const customerEmail = account?.email ?? account?.user?.email ?? 'customer@example.com'
	const customerName = account?.fullname ?? account?.full_name ?? account?.name ?? account?.user?.fullname ?? account?.user?.full_name ?? account?.user?.name ?? 'Customer'

	const [flutterwaveConfig, setFlutterwaveConfig] = useState(null)
	const [backendTxRef, setBackendTxRef] = useState(null)
	const defaultFwConfig = {
		public_key: flutterwavePublicKey ?? '',
		tx_ref: backendTxRef ?? `tx-${Date.now()}`,
		amount: parsedAmount || 1,
		currency: 'NGN',
		payment_options: 'card,banktransfer,ussd',
		customer: {
			email: customerEmail,
			phone_number: customerPhone,
			name: customerName
		},
		customizations: {
			title: 'Esvora',
			description: `Wallet deposit of ₦${Number(parsedAmount).toLocaleString()}`,
			logo: 'https://via.placeholder.com/150'
		}
	}
	const handleFlutterPayment = useFlutterwave(flutterwaveConfig ?? defaultFwConfig)
	const [shouldLaunchFlutterwave, setShouldLaunchFlutterwave] = useState(false)

	useEffect(() => {
		if (!shouldLaunchFlutterwave || !flutterwaveConfig) return
		setShouldLaunchFlutterwave(false)
		handleFlutterPayment({
			callback: async (response) => {
				// Prefer backend ref (DEP-XXX format) from config over Flutterwave response
				const ref = flutterwaveConfig?.tx_ref ?? response?.tx_ref ?? response?.flw_ref
				if (!ref) {
					toast.error('Invalid payment response')
					closePaymentModal()
					return
				}
				walletController.verifyDeposit({
					reference: ref,
					setLoading: setIsLoading,
					onSuccess: () => {
						closePaymentModal()
						toast.success('Deposit completed successfully')
						onComplete?.({ reference: ref })
					},
					onError: (msg) => {
						toast.error(msg ?? 'Verification failed')
						closePaymentModal()
					}
				})
			},
			onClose: () => {}
		})
	}, [shouldLaunchFlutterwave, flutterwaveConfig, handleFlutterPayment, onComplete])

	const launchPaystackInline = ({ amountValue, initData, fallbackUrl }) => {
		if (!paystackPublicKey) {
			toast.error('Paystack public key is missing')
			if (fallbackUrl) window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
			return
		}

		const gatewayData = initData?.gateway_response ?? {}
		const email =
			initData?.email ??
			gatewayData?.customer?.email ??
			account?.email ??
			account?.user?.email
		if (!email) {
			toast.error('No email found for Paystack checkout')
			if (fallbackUrl) window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
			return
		}

		const reference =
			initData?.reference ??
			initData?.ref ??
			gatewayData?.reference ??
			gatewayData?.trxref
		const accessCode =
			initData?.access_code ??
			initData?.accessCode ??
			gatewayData?.access_code ??
			gatewayData?.accessCode
		const metadata = initData?.metadata ?? gatewayData?.metadata
		const popup = new PaystackPop()
		const callbacks = {
			onSuccess: (transaction) => {
				const referenceFromSuccess =
					transaction?.reference ??
					reference
				toast.loading('Validating payment...', { duration: 2000 })
				onComplete?.({ reference: referenceFromSuccess })
			},
			onCancel: () => {
				toast.error('Payment was cancelled')
			},
			onError: (error) => {
				toast.error(error?.message ?? 'Failed to open Paystack checkout')
				if (fallbackUrl) window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
			}
		}

		try {
			if (accessCode) {
				popup.resumeTransaction(accessCode, callbacks)
				return
			}
			popup.newTransaction({
				key: paystackPublicKey,
				email,
				amount: Math.round(amountValue * 100),
				reference,
				metadata,
				...callbacks
			})
		} catch (e) {
			toast.error('Failed to open Paystack checkout')
			if (fallbackUrl) window.open(fallbackUrl, '_blank', 'noopener,noreferrer')
		}
	}

	const handleSelectGateway = (gateway) => {
		const numAmount = Number(String(amount).replace(/[^\d.]/g, ''))
		if (!numAmount || numAmount <= 0) {
			toast.error('Please enter a valid amount')
			return
		}
		setIsLoading(true)
		walletController.initializeDeposit({
			amount: numAmount,
			gateway,
			setLoading: setIsLoading,
			onSuccess: ({ paymentUrl, data }) => {
				console.log('data', data)
				console.log('paymentUrl', paymentUrl)
				console.log('gateway', gateway)
				console.log('flutterwavePublicKey', data.deposit.reference)
				if (gateway === kPayStack) {
					launchPaystackInline({
						amountValue: numAmount,
						initData: data,
						fallbackUrl: paymentUrl
					})
					return
				}
				if (gateway === kFlutterWave) {
					const txRef =
					    data.deposit.reference ??
						data.deposit.payment_transaction.reference
					setBackendTxRef(String(txRef))
					setFlutterwaveConfig({
						public_key: flutterwavePublicKey,
						tx_ref: String(txRef),
						amount: numAmount,
						currency: 'NGN',
						payment_options: 'card,banktransfer,ussd',
						customer: {
							email: customerEmail,
							phone_number: customerPhone,
							name: customerName
						},
						customizations: {
							title: 'Esvora',
							description: `Wallet deposit of ₦${Number(numAmount).toLocaleString()}`,
							logo: 'https://via.placeholder.com/150'
						}
					})
					setShouldLaunchFlutterwave(true)
					return
				}
				if (paymentUrl) {
					window.open(paymentUrl, '_blank', 'noopener,noreferrer')
				}
				const reference =
					data?.reference ??
					data?.ref ??
					data?.gateway_response?.reference ??
					data?.gateway_response?.trxref
				onComplete?.({ reference })
			},
			onError: (m) => toast.error(m ?? 'Failed to initialize deposit')
		})
	}

	const services = [
		{ id: kPayStack, title: 'Paystack' },
		{ id: kFlutterWave, title: 'Flutterwave' }
	]

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

			<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900 mb-2'>
				Choose deposit service
			</h2>
			<p className='text-[14px] text-gray-500 mb-8'>
				Select a payment gateway to add ₦{Number(amount).toLocaleString()} to your wallet
			</p>

			<div className='space-y-3 mb-8 relative min-h-[120px]'>
				{isLoading ? (
					<div className='absolute inset-0 flex items-center justify-center py-8'>
						<Loader />
					</div>
				) : null}
				{services.map((service) => (
					<button
						key={service.id}
						type='button'
						onClick={() => handleSelectGateway(service.id)}
						disabled={isLoading}
						className='w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed'
					>
						<span className='text-[16px] font-semibold text-gray-900'>
							{service.title}
						</span>
						<ChevronRight className='w-5 h-5 text-gray-400 shrink-0' />
					</button>
				))}
			</div>

			<p className='text-[12px] text-gray-500'>
				You will be redirected to the payment page in a new tab. Complete the payment there.
			</p>
		</div>
	)
}

export default ChooseDepositServiceView
