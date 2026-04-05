import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { X } from 'lucide-react'

const KycRejectedView = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const message =
		typeof location.state?.message === 'string' && location.state.message.trim()
			? location.state.message.trim()
			: null

	const body =
		message ||
		'We could not verify your details. Please check your information and try again, or contact support if you need help.'

	return (
		<>
			<Navbar />
			<div className="pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-gray-50">
				<div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
					<div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
						<div className="h-36 bg-gradient-to-br from-red-200/90 to-red-50" />
						<div className="px-6 md:px-8 pb-10 -mt-10 text-center">
							<div className="w-20 h-20 mx-auto bg-red-600 rounded-full flex items-center justify-center shadow-lg mb-6">
								<X className="w-10 h-10 text-white" strokeWidth={2.5} />
							</div>
							<h1 className="text-[26px] md:text-[30px] font-bold text-gray-900 mb-3">
								Verification not approved
							</h1>
							<p className="text-[16px] text-gray-600 leading-relaxed mb-8">{body}</p>
							<button
								type="button"
								onClick={() => navigate('/kyc/enter-id')}
								className="w-full bg-primary text-white px-8 py-4 rounded-full text-[17px] font-semibold hover:bg-primary/90 transition-colors"
							>
								Try again
							</button>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default KycRejectedView
