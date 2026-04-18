import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Footer from '../components/footer'

const SECTIONS = [
	{
		title: '1. Introduction',
		content:
			'This Refund Policy explains when and how Esvora may issue refunds for eligible payments made through the Platform. It should be read together with our Terms and Conditions and Privacy Policy. Capitalised terms used here have the same meaning as in our Terms unless otherwise defined.'
	},
	{
		title: '2. Release of property — 7-day guarantee',
		content:
			'Where a payment or deposit is made in connection with a property booking or tenancy arrangement facilitated on the Platform, the landlord (or property owner) is expected to release or make available the property to you in line with the agreed schedule and our booking flows. If the landlord does not release the property within seven (7) calendar days from the applicable release or handover date confirmed in your booking or agreement on the Platform, you will be eligible for a refund of the amount paid for that transaction, subject to verification and the exceptions in Section 5. “Release” means the landlord has completed the steps required on the Platform to confirm access or handover, or has otherwise fulfilled the obligation to make the property available as described at checkout or in your booking confirmation.'
	},
	{
		title: '3. How to request a refund',
		content:
			'If you believe you qualify under Section 2, submit a refund request through Help & Support in your profile or the contact channels listed on esvora.ng as soon as possible after the 7-day period has passed. Include your booking or transaction reference, property details, and any evidence (for example, messages or screenshots) showing that the property was not released within 7 days. We may ask for additional information to investigate. Incomplete or fraudulent requests may be denied.'
	},
	{
		title: '4. Review and processing',
		content:
			'We will review eligible requests in a reasonable timeframe and notify you of the outcome. Approved refunds are typically returned to the original payment method used for the transaction. Processing times may depend on your bank or payment provider and can take several business days after we initiate the refund. We are not responsible for delays caused by third-party financial institutions.'
	},
	{
		title: '5. Exceptions and limitations',
		content:
			'We may refuse or reduce a refund where: you cancelled in breach of the landlord’s or Platform’s cancellation rules; you caused or contributed to the delay; the landlord released the property on time but you did not accept access; the claim is outside any stated time limit for raising disputes; we detect fraud, abuse, or chargeback manipulation; or applicable law requires a different outcome. Fees charged by payment networks that are non-refundable by their rules may be withheld from the refunded amount where permitted.'
	},
	{
		title: '6. Other refunds',
		content:
			'Refunds outside the 7-day non-release scenario (for example, duplicate charges or proven technical errors) may be considered case by case. Service fees or commissions may be treated differently from rent or deposits as described at the time of payment. Nothing in this policy limits any statutory rights you may have under consumer protection law in your jurisdiction.'
	},
	{
		title: '7. Changes to this policy',
		content:
			'We may update this Refund Policy from time to time. The “Last updated” date below will change when a new version is published. Continued use of the Platform after changes constitutes acceptance of the updated policy where permitted by law. Material changes may be communicated through the Platform or by email where appropriate.'
	},
	{
		title: '8. Contact',
		content:
			'For questions about refunds or this policy, contact us through Help & Support or the contact details published on esvora.ng (including support@esvora.ng where applicable).'
	}
]

const RefundPolicyView = () => {
	const navigate = useNavigate()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<>
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen bg-gray-50'>
				<div className='max-w-3xl mx-auto'>
					<button
						type='button'
						onClick={() => navigate(-1)}
						className='flex items-center gap-2 text-[15px] font-medium text-gray-700 hover:text-gray-900 mb-6 transition-colors'
						aria-label='Go back'
					>
						<ChevronLeft className='w-5 h-5 shrink-0' />
						Back
					</button>

					<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
						<h1 className='text-[26px] font-bold text-gray-900 mb-2'>
							Refund Policy
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026
						</p>

						<div className='space-y-8'>
							{SECTIONS.map((section) => (
								<section key={section.title}>
									<h2 className='text-[18px] font-semibold text-gray-900 mb-3'>
										{section.title}
									</h2>
									<p className='text-[15px] text-gray-600 leading-relaxed'>
										{section.content}
									</p>
								</section>
							))}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default RefundPolicyView
