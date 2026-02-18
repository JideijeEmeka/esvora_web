import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { User, CheckCircle } from 'lucide-react'

const KycView = () => {
	const navigate = useNavigate()

	const handleAgreeAndContinue = () => {
		navigate('/kyc/form')
	}

	return (
		<>
			<Navbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col'>
				{/* Main Content - Centered */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full'>
					{/* Verification Icon */}
					<div className='relative mb-8'>
						<div className='w-48 h-48 md:w-56 md:h-56 rounded-3xl bg-gradient-to-br from-purple-400 via-purple-300 to-pink-300 shadow-lg flex items-center justify-center relative overflow-hidden'>
							{/* Person Silhouette */}
							<div className='absolute inset-0 flex items-center justify-center'>
								<User className='w-24 h-24 md:w-28 md:h-28 text-white/80' strokeWidth={1.5} />
							</div>
							{/* Checkmark */}
							<div className='absolute bottom-6 right-6 md:bottom-8 md:right-8'>
								<div className='w-12 h-12 md:w-14 md:h-14 bg-white rounded-full flex items-center justify-center shadow-md'>
									<CheckCircle className='w-8 h-8 md:w-9 md:h-9 text-purple-600' fill='currentColor' />
								</div>
							</div>
						</div>
					</div>

					{/* Heading */}
					<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-4 text-center'>
						Verify your identity
					</h1>

					{/* Descriptive Text */}
					<p className='text-[16px] md:text-[18px] text-gray-600 mb-12 text-center max-w-lg leading-relaxed'>
						This information will be used to very your account and prove authenticity of your profile
					</p>

					{/* Agree and Continue Button */}
					<button
						type='button'
						onClick={handleAgreeAndContinue}
						className='w-full max-w-md bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
					>
						Agree and continue
					</button>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default KycView
