import React from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCode } from 'react-qr-code'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { ChevronLeft, Smartphone } from 'lucide-react'

const KycQrcodeView = () => {
	const navigate = useNavigate()
	
	// QR code value - update with actual verification URL/token
	const qrCodeValue = 'https://reactjs.org/'

	const handleBack = () => {
		navigate('/kyc/select-id')
	}

	const handleContinue = () => {
		navigate('/kyc/success')
	}

	return (
		<>
			<Navbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-gray-50'>
				{/* Main Content - Centered */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full'>
					{/* Form Container */}
					<div className='w-full bg-white rounded-2xl shadow-sm p-8 md:p-12'>
						{/* Back Button */}
						<div className='mb-8'>
							<button
								type='button'
								onClick={handleBack}
								className='flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5' />
								<span className='text-[16px] font-medium'>Back</span>
							</button>
						</div>

						{/* QR Code Section */}
						<div className='flex flex-col items-center mb-8'>
							{/* QR Code */}
							<div className='w-64 h-64 md:w-80 md:h-80 bg-white border-4 border-gray-900 p-4 rounded-lg mb-6 flex items-center justify-center overflow-hidden'>
								<QRCode
									value={qrCodeValue}
									size={256}
									style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
									viewBox='0 0 256 256'
									bgColor='#FFFFFF'
									fgColor='#000000'
									level='M'
								/>
							</div>

							{/* Phone Icon */}
							<div className='mb-4'>
								<Smartphone className='w-8 h-8 text-primary' />
							</div>

							{/* Instructional Text */}
							<p className='text-[16px] md:text-[18px] text-gray-900 text-center font-medium'>
								Scan code to continue with the verification on your phone
							</p>
						</div>

						{/* Continue Button */}
						<button
							type='button'
							onClick={handleContinue}
							className='w-full bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] mb-6'
						>
							Continue
						</button>

						{/* Legal Disclaimer */}
						<p className='text-[12px] md:text-[14px] text-gray-500 text-center leading-relaxed'>
							By continuing, you agree to Esvora's{' '}
							<button
								type='button'
								onClick={() => {}}
								className='text-gray-700 underline hover:text-primary transition-colors'
							>
								Terms of Service
							</button>{' '}
							and{' '}
							<button
								type='button'
								onClick={() => {}}
								className='text-gray-700 underline hover:text-primary transition-colors'
							>
								Privacy Policy
							</button>{' '}
							including
						</p>
					</div>
				</div>
			</div>
		</>
	)
}

export default KycQrcodeView
