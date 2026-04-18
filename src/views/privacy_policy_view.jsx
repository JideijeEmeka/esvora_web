import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Footer from '../components/footer'

const SECTIONS = [
	{
		title: '1. Introduction',
		content:
			'Esvora (“we”, “us”, or “our”) operates the Esvora property platform (website and related services). This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our services. By using Esvora, you agree to the practices described here. If you do not agree, please discontinue use of the Platform.'
	},
	{
		title: '2. Information we collect',
		content:
			'We may collect: (a) Account and profile data — name, email, phone number, password or authentication tokens, profile photo, and preferences you provide when you register or update your account. (b) Property and listing information — addresses, descriptions, images, pricing, availability, and documents you upload as a landlord or property owner. (c) Usage and device data — IP address, browser type, approximate location (where permitted), pages viewed, and actions taken on the Platform to improve security and performance. (d) Communications — messages you send through in-app chat, support requests, and feedback. (e) Payment-related metadata — where payments are processed, we may receive limited transaction identifiers from payment partners; we do not store full card numbers on our servers when processing is delegated to certified providers.'
	},
	{
		title: '3. How we use your information',
		content:
			'We use personal information to: create and manage your account; display and match property listings; facilitate enquiries, inspections, and agreements between users; send service-related notices and security alerts; improve our products, analytics, and fraud prevention; comply with legal obligations; and, where you have opted in, send marketing communications about Esvora. We do not sell your personal information to third parties in the traditional sense of selling lists for unrelated advertising.'
	},
	{
		title: '4. Legal basis and consent',
		content:
			'Depending on applicable law (including the Nigeria Data Protection Act and related regulations), we rely on contract (to provide the services you request), legitimate interests (to secure and improve the Platform, provided these are not overridden by your rights), legal obligation, and consent where required (for example, for certain marketing or non-essential cookies). You may withdraw consent where processing is consent-based, subject to limitations needed to provide core services or meet legal requirements.'
	},
	{
		title: '5. Sharing and disclosure',
		content:
			'We may share information with: service providers who assist us with hosting, analytics, email delivery, customer support, and payment processing, under strict confidentiality and data-processing terms; other users where you choose to share it (for example, landlords see enquiry details you submit); professional advisers where required; and authorities when we believe disclosure is necessary to comply with law, enforce our terms, or protect the rights, safety, or property of Esvora, our users, or the public. In the event of a merger or acquisition, information may be transferred as part of that transaction with appropriate safeguards.'
	},
	{
		title: '6. Cookies and similar technologies',
		content:
			'We use cookies and similar technologies to remember your session, maintain security, understand how the Platform is used, and (where you agree) personalize content. You can control cookies through your browser settings; disabling some cookies may limit certain features. Further detail is available in our Cookies policy if referenced on the site.'
	},
	{
		title: '7. Data retention',
		content:
			'We retain personal information only as long as necessary for the purposes described in this policy, including satisfying legal, accounting, or reporting requirements. When data is no longer needed, we delete or anonymize it in line with our internal retention schedules, subject to backup and archival systems that may temporarily retain copies.'
	},
	{
		title: '8. Security',
		content:
			'We implement technical and organizational measures designed to protect your information against unauthorized access, alteration, disclosure, or destruction. No method of transmission over the internet is completely secure; we encourage you to use strong passwords and protect your account credentials.'
	},
	{
		title: '9. Your rights',
		content:
			'Subject to applicable law, you may have the right to access, correct, or delete your personal data; restrict or object to certain processing; request portability of data you provided; and lodge a complaint with a supervisory authority. To exercise these rights, contact us using the details below. We may need to verify your identity before responding.'
	},
	{
		title: '10. Children’s privacy',
		content:
			'Esvora is not directed at children under the minimum age required by applicable law to enter into contracts in your jurisdiction. We do not knowingly collect personal information from children. If you believe we have collected such information, please contact us so we can delete it.'
	},
	{
		title: '11. International transfers',
		content:
			'Your information may be processed in Nigeria and, where we use international service providers, in other countries that may have different data protection laws. Where required, we implement appropriate safeguards (such as contractual clauses) for cross-border transfers.'
	},
	{
		title: '12. Changes to this policy',
		content:
			'We may update this Privacy Policy from time to time. We will post the revised version on this page and update the “Last updated” date. Material changes may be communicated through the Platform or by email where appropriate. Continued use after changes constitutes acceptance of the updated policy where permitted by law.'
	},
	{
		title: '13. Contact us',
		content:
			'For privacy-related questions, requests, or complaints, please contact us through the Help & Support options in the profile section or in the app, or at the contact details published on esvora.ng (including support@esvora.ng where applicable). We will respond within a reasonable period in line with applicable law.'
	}
]

const PrivacyPolicyView = () => {
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
							Privacy Policy
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

export default PrivacyPolicyView
