import React from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Clock } from 'lucide-react'

const KycSessionExpiredView = () => {
	const navigate = useNavigate()

	return (
		<>
			<Navbar />
			<div className="pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-gray-50">
				<div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full">
					<div className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
						<div className="h-36 bg-gradient-to-br from-amber-200/90 to-amber-50" />
						<div className="px-6 md:px-8 pb-10 -mt-10 text-center">
							<div className="w-20 h-20 mx-auto bg-amber-500 rounded-full flex items-center justify-center shadow-lg mb-6">
								<Clock className="w-10 h-10 text-white" strokeWidth={2} />
							</div>
							<h1 className="text-[26px] md:text-[30px] font-bold text-gray-900 mb-3">
								Session expired
							</h1>
							<p className="text-[16px] text-gray-600 leading-relaxed mb-8">
								Your verification session has timed out. Please go back and start
								identity verification again.
							</p>
							<button
								type="button"
								onClick={() => navigate('/kyc/enter-id')}
								className="w-full bg-primary text-white px-8 py-4 rounded-full text-[17px] font-semibold hover:bg-primary/90 transition-colors"
							>
								Start again
							</button>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default KycSessionExpiredView
