import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { ChevronLeft, FileText } from 'lucide-react'

const KycSelectIdView = () => {
	const navigate = useNavigate()
	const [selectedIdType, setSelectedIdType] = useState('bvn')

	const handleBack = () => {
		navigate('/kyc/form')
	}

	const handleContinue = () => {
		navigate('/kyc/qrcode')
	}

	return (
		<>
			<Navbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col'>
				{/* Main Content - Centered */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full'>
					{/* Form Container */}
					<div className='w-full'>
						{/* Top Navigation */}
						<div className='flex items-center justify-between mb-8'>
							<button
								type='button'
								onClick={handleBack}
								className='flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-gray-700 hover:bg-gray-200 transition-colors'
							>
								<ChevronLeft className='w-5 h-5' />
								<span className='text-[16px] font-medium'>Back</span>
							</button>
							<span className='text-[16px] text-gray-600'>2 Step 3</span>
						</div>

						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-2'>
							Submit ID
						</h1>

						{/* Instructions */}
						<p className='text-[16px] text-gray-600 mb-8'>
							Please provide a valid government ID
						</p>

						{/* ID Selection Options */}
						<div className='space-y-4 mb-8'>
							{/* BVN Option */}
							<label
								htmlFor='bvn'
								className={`flex items-start gap-4 p-4 border-2 rounded-full cursor-pointer transition-all ${
									selectedIdType === 'bvn'
										? 'border-primary bg-primary/5'
										: 'border-gray-200 hover:border-gray-300'
								}`}
							>
								<div className='flex items-center gap-3 flex-1'>
									{/* Icon */}
									<div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0'>
										<FileText className='w-6 h-6 text-gray-700' />
									</div>
									{/* Text Content */}
									<div className='flex-1'>
										<div className='text-[18px] font-semibold text-gray-900 mb-1'>
											BVN
										</div>
										<div className='text-[14px] text-gray-600'>
											Submit a valid BVN number
										</div>
									</div>
									{/* Radio Button */}
									<div className='relative'>
										<input
											type='radio'
											id='bvn'
											name='idType'
											value='bvn'
											checked={selectedIdType === 'bvn'}
											onChange={() => setSelectedIdType('bvn')}
											className='sr-only'
										/>
										<div
											className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
												selectedIdType === 'bvn'
													? 'border-primary bg-primary'
													: 'border-gray-300 bg-white'
											}`}
										>
											{selectedIdType === 'bvn' && (
												<div className='w-2.5 h-2.5 rounded-full bg-white' />
											)}
										</div>
									</div>
								</div>
							</label>

							{/* NIN Option */}
							<label
								htmlFor='nin'
								className={`flex items-start gap-4 p-4 border-2 rounded-full cursor-pointer transition-all ${
									selectedIdType === 'nin'
										? 'border-primary bg-primary/5'
										: 'border-gray-200 hover:border-gray-300'
								}`}
							>
								<div className='flex items-center gap-3 flex-1'>
									{/* Icon */}
									<div className='w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0'>
										<FileText className='w-6 h-6 text-gray-700' />
									</div>
									{/* Text Content */}
									<div className='flex-1'>
										<div className='text-[18px] font-semibold text-gray-900 mb-1'>
											NIN
										</div>
										<div className='text-[14px] text-gray-600'>
											Submit a valid NIN number
										</div>
									</div>
									{/* Radio Button */}
									<div className='relative'>
										<input
											type='radio'
											id='nin'
											name='idType'
											value='nin'
											checked={selectedIdType === 'nin'}
											onChange={() => setSelectedIdType('nin')}
											className='sr-only'
										/>
										<div
											className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
												selectedIdType === 'nin'
													? 'border-primary bg-primary'
													: 'border-gray-300 bg-white'
											}`}
										>
											{selectedIdType === 'nin' && (
												<div className='w-2.5 h-2.5 rounded-full bg-white' />
											)}
										</div>
									</div>
								</div>
							</label>
						</div>

						{/* Continue Button */}
						<button
							type='button'
							onClick={handleContinue}
							className='w-full bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
						>
							Continue
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default KycSelectIdView
