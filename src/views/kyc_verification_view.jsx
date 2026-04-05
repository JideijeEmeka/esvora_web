import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { ChevronLeft, ExternalLink } from 'lucide-react'
import {
	getKycStatus,
	parseKycStatusPayload
} from '../repository/kyc_repository'
import {
	KYC_POLL_INTERVAL_MS,
	KYC_STATUS_APPROVED,
	KYC_STATUS_REJECTED,
	KYC_STATUS_SUBMITTED,
	KYC_SUBMITTED_SESSION_MS
} from '../lib/kycConstants'

/**
 * Dojah (liveness / Connect) on web — same contract as the Flutter app:
 * POST /api/v1/kyc/verify returns `data.redirect_url`, which we load in a frame.
 *
 * Note: `dojah-kyc-sdk-react-expo` is for React Native / Expo native apps only.
 * This Vite web app embeds the same server-issued Connect URL the mobile WebView uses.
 */
const KycVerificationView = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const redirectUrl =
		typeof location.state?.redirectUrl === 'string'
			? location.state.redirectUrl.trim()
			: ''

	const submittedSinceRef = useRef(null)

	useEffect(() => {
		if (!redirectUrl) {
			navigate('/kyc/enter-id', { replace: true })
		}
	}, [redirectUrl, navigate])

	useEffect(() => {
		if (!redirectUrl) return undefined

		let cancelled = false
		let intervalId = /** @type {ReturnType<typeof setInterval> | null} */ (
			null
		)

		const step = async () => {
			if (cancelled) return
			try {
				const json = await getKycStatus()
				if (cancelled) return
				const { status, rejectionReason } = parseKycStatusPayload(json)

				if (status === KYC_STATUS_APPROVED) {
					if (intervalId) clearInterval(intervalId)
					navigate('/kyc/success', { replace: true })
					return
				}
				if (status === KYC_STATUS_REJECTED) {
					if (intervalId) clearInterval(intervalId)
					navigate('/kyc/rejected', {
						replace: true,
						state: { message: rejectionReason }
					})
					return
				}
				if (status === KYC_STATUS_SUBMITTED) {
					if (submittedSinceRef.current == null) {
						submittedSinceRef.current = Date.now()
					}
					if (
						Date.now() - submittedSinceRef.current >=
						KYC_SUBMITTED_SESSION_MS
					) {
						if (intervalId) clearInterval(intervalId)
						navigate('/kyc/session-expired', { replace: true })
					}
				} else {
					submittedSinceRef.current = null
				}
			} catch {
				// Keep polling on transient errors (same idea as Flutter stream).
			}
		}

		void step()
		intervalId = setInterval(step, KYC_POLL_INTERVAL_MS)

		return () => {
			cancelled = true
			if (intervalId) clearInterval(intervalId)
		}
	}, [redirectUrl, navigate])

	const openInNewTab = () => {
		window.open(redirectUrl, '_blank', 'noopener,noreferrer')
	}

	if (!redirectUrl) {
		return null
	}

	let iframeOrigin = ''
	try {
		iframeOrigin = new URL(redirectUrl).origin
	} catch {
		// ignore
	}

	return (
		<>
			<Navbar />
			<div className="pt-30 pb-6 px-4 md:px-8 min-h-screen flex flex-col bg-gray-50">
				<div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
					<div className="flex flex-wrap items-center justify-between gap-3 mb-4">
						<button
							type="button"
							onClick={() => navigate('/kyc/enter-id')}
							className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 transition-colors"
						>
							<ChevronLeft className="w-5 h-5" />
							<span className="text-[16px] font-medium">Back</span>
						</button>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={openInNewTab}
								className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 hover:bg-gray-50 text-[14px] font-medium"
							>
								<ExternalLink className="w-4 h-4" />
								Open in new tab
							</button>
						</div>
					</div>

					<h1 className="text-[22px] md:text-[26px] font-bold text-gray-900 mb-1">
						Verification
					</h1>
					<p className="text-[15px] text-gray-600 mb-4">
						Complete liveness and identity steps in the window below. Allow camera
						and microphone when your browser asks. We&apos;ll update this page
						when verification finishes.
					</p>

					<div className="flex-1 min-h-[480px] md:min-h-[560px] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm">
						{/*
							No sandbox: third-party Dojah Connect must behave like the mobile
							InAppWebView (camera, redirects, popups). Use "Open in new tab" if
							your CSP or X-Frame-Options blocks embedding.
						*/}
						<iframe
							title="Dojah verification"
							src={redirectUrl}
							className="w-full h-full min-h-[480px] md:min-h-[560px] border-0"
							allow="camera *; microphone *; fullscreen; payment"
							referrerPolicy="no-referrer-when-downgrade"
						/>
					</div>
					{iframeOrigin ? (
						<p className="text-[12px] text-gray-400 mt-2">
							Hosted by verification provider ({iframeOrigin})
						</p>
					) : null}
				</div>
			</div>
			<Footer />
		</>
	)
}

export default KycVerificationView
