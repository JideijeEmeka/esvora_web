import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { ChevronLeft } from 'lucide-react'
import { verifyId } from '../repository/kyc_repository'

const KycEnterIdView = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const idType = location.state?.idType ?? 'bvn'
	const isBvn = idType === 'bvn'
	const label = isBvn ? 'BVN' : 'NIN'
	const maxLength = isBvn ? 11 : 11

	const [idNumber, setIdNumber] = useState('')
	const [error, setError] = useState('')
	const [submitting, setSubmitting] = useState(false)

	const handleChange = (e) => {
		const digits = e.target.value.replace(/\D/g, '').slice(0, maxLength)
		setIdNumber(digits)
		if (error) setError('')
	}

	const handleContinue = async () => {
		if (idNumber.length !== maxLength) {
			setError(`Please enter a valid ${maxLength}-digit ${label} number`)
			return
		}
		setSubmitting(true)
		setError('')
		try {
			const data = await verifyId({ idNumber, idType })
			const redirect =
				typeof data?.data?.redirect_url === 'string'
					? data.data.redirect_url.trim()
					: ''
			if (redirect) {
				navigate('/kyc/verify', { state: { redirectUrl: redirect } })
			} else {
				navigate('/kyc/success')
			}
		} catch (e) {
			const msg = e instanceof Error ? e.message : 'Verification failed'
			setError(msg)
			toast.error(msg)
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<>
			<Navbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col'>
				<div className='flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full'>
					<div className='w-full'>
						<div className='flex items-center justify-between mb-8'>
							<button
								type='button'
								onClick={() => navigate('/kyc/select-id')}
								className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors'
							>
								<ChevronLeft className='w-5 h-5' />
								<span className='text-[16px] font-medium'>Back</span>
							</button>
							<span className='text-[16px] text-gray-600'>2 Step 3</span>
						</div>

						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-2'>
							Enter your {label}
						</h1>

						<p className='text-[16px] text-gray-600 mb-8'>
							Please provide your {maxLength}-digit {label} number to verify your identity
						</p>

						<div className='mb-8'>
							<label htmlFor='idNumber' className='block text-[16px] font-medium text-gray-900 mb-2'>
								{label} Number
							</label>
							<input
								type='text'
								id='idNumber'
								inputMode='numeric'
								value={idNumber}
								onChange={handleChange}
								placeholder={`Enter your ${label} number`}
								maxLength={maxLength}
								className={`w-full px-4 py-3 border rounded-full text-[16px] focus:outline-none focus:ring-2 transition-colors ${
									error
										? 'border-red-400 focus:ring-red-200 focus:border-red-400'
										: 'border-gray-300 focus:ring-primary/20 focus:border-primary'
								}`}
							/>
							{error && (
								<p className='mt-2 text-[14px] text-red-500'>{error}</p>
							)}
							<p className='mt-2 text-[13px] text-gray-400'>
								{idNumber.length}/{maxLength} digits
							</p>
						</div>

						<button
							type='button'
							disabled={submitting}
							onClick={handleContinue}
							className='w-full bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-60 disabled:pointer-events-none'
						>
							{submitting ? 'Submitting…' : 'Submit'}
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default KycEnterIdView
