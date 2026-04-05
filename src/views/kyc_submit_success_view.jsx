import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Check } from 'lucide-react'
import { store } from '../redux/store'
import { authApi } from '../repository/auth_repository'
import { updateAccount } from '../redux/slices/accountSlice'
import { getToken } from '../lib/localStorage'
import { navigateToAppHome } from '../lib/auth'

/**
 * Shown when KYC is approved — aligned with Flutter `KycSubmitSuccessView`.
 */
const KycSubmitSuccessView = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const prev = document.title
		document.title = 'Verification successful'
		return () => {
			document.title = prev
		}
	}, [])

	useEffect(() => {
		if (!getToken()) return
		store
			.dispatch(authApi.endpoints.getProfile.initiate())
			.then((res) => {
				if (res.error) return
				const data = res.data
				const user = data?.data?.user ?? data?.user
				if (user) store.dispatch(updateAccount(user))
			})
			.catch(() => {})
	}, [])

	const handleGoHome = () => {
		void navigateToAppHome(navigate)
	}

	return (
		<>
			<Navbar />
			<div className="min-h-screen flex flex-col bg-gray-50/98 pt-20 pb-8 px-4 md:pt-24 md:pb-10 md:px-6">
				<div className="flex-1 flex items-center justify-center">
					<div className="w-full max-w-[340px] md:max-w-[420px] bg-white rounded-xl md:rounded-2xl shadow-[0_4px_14px_rgba(0,0,0,0.07)] md:shadow-[0_6px_16px_rgba(0,0,0,0.08)] overflow-hidden">
						<div
							className="h-[88px] md:h-[118px] w-full bg-gradient-to-br from-primary/35 to-primary/12"
							aria-hidden
						/>
						<div className="px-5 pb-6 md:px-8 md:pb-8 -mt-7 md:-mt-8 text-center">
							<div className="w-14 h-14 md:w-[72px] md:h-[72px] mx-auto bg-primary rounded-full flex items-center justify-center shadow-md md:shadow-lg mb-4 md:mb-5 ring-[3px] md:ring-4 ring-white">
								<Check className="w-8 h-8 md:w-10 md:h-10 text-white" strokeWidth={2.5} />
							</div>
							<h1 className="text-[22px] md:text-[26px] font-bold text-gray-900 mb-2 md:mb-3 leading-tight">
								Verification successful
							</h1>
							<p className="text-[14px] md:text-base text-gray-600/90 leading-snug md:leading-relaxed mb-5 md:mb-7 max-w-[280px] md:max-w-[340px] mx-auto">
								Your identity has been verified. Your account is ready to use.
							</p>
							<button
								type="button"
								onClick={handleGoHome}
								className="w-full h-10 md:h-11 rounded-full border-2 border-gray-200 text-gray-800 text-[15px] md:text-[17px] font-semibold bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors"
							>
								Go home
							</button>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default KycSubmitSuccessView
