import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Footer from '../components/footer'
import { kSupportPhoneNumber, kSupportWhatsAppNumber } from '../lib/constants'

const SECTIONS = [
	{
		title: '1. What is the Help center?',
		content:
			'The Help center brings together guidance on how to use Esvora, how to get support when something goes wrong, and where to find policies that protect you. This page explains how support works—especially through your account profile—so you can resolve questions about bookings, listings, payments, and your account as quickly as possible.'
	},
	{
		title: '2. Help & Support in your Profile (main hub)',
		content:
			'The primary place to get help while using Esvora is the Help & Support section inside your Profile. After you sign in, open Profile from the navigation bar, then choose Help & Support in the profile sidebar. From there you can access all support channels in one place: Live chat (where available), Create a ticket (structured requests to our support mail), WhatsApp, Phone, and Rate your experience. If you open a sub-screen such as creating a ticket, use the Back control at the top to return to the main Help & Support menu. Help & Support is designed so you do not have to hunt through the site for contact options—they stay consistent whether you are on a large screen or mobile.'
	},
	{
		title: '3. Live chat',
		content:
			'From Help & Support, tap Live chat when you need real-time assistance. If our chat widget is enabled in your session, it will open so you can message the team. If chat is temporarily unavailable, use Create a ticket or WhatsApp instead so we still receive your request.'
	},
	{
		title: '4. Create a ticket',
		content:
			'For issues that need investigation—refunds, payment disputes, a landlord not releasing a property, incorrect listing details, or account access—Create a ticket is often the best choice. You will be guided to provide a subject, description, and any relevant references (for example a booking or property ID). This sends your request to our official support mailbox and creates a record we can track. Please include as much detail as you can; it speeds up review and avoids back-and-forth.'
	},
	{
		title: '5. WhatsApp and phone',
		content:
			'Help & Support also includes WhatsApp and Phone shortcuts. These use the same official numbers as the rest of the platform so you always reach Esvora—not a third party. Current numbers are shown in the app and match the shortcuts in your Profile; you can also use the details in Section 9 below.'
	},
	{
		title: '6. Rate your experience',
		content:
			'Your feedback matters. From Help & Support you can rate your experience so we know what is working and what to improve. Honest ratings and comments help us prioritise fixes and new features for renters, landlords, and agents alike.'
	},
	{
		title: '7. Before you are signed in',
		content:
			'Some tasks require an account—for example opening Profile Help & Support or viewing booking-specific tools. If you are not signed in yet, you can still read our Privacy policy, Terms, Cookies, and Refund policy from the footer, browse listings, and use public contact options where shown. After you register or log in, use Profile → Help & Support for the full set of channels and faster handling tied to your account.'
	},
	{
		title: '8. Response times and tips',
		content:
			'We aim to respond to tickets and serious enquiries within a reasonable business timeframe. Simple questions may be answered faster on chat or WhatsApp. To avoid delays: use one channel per issue (duplicating the same request everywhere can slow triage), include screenshots or reference IDs when relevant, and check spam folders for replies from our support domain.'
	},
	{
		title: '9. Quick contact numbers',
		content: null
	},
	{
		title: '10. Related policies',
		content:
			'Legal and safety topics are covered in dedicated pages: Privacy policy, Terms and Conditions, Cookies policy, and Refund policy (including the 7-day landlord release rule where applicable). Links to these appear in the site footer so you can review them at any time.'
	}
]

const HelpView = () => {
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
							Help center
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026 · Support is centred in{' '}
							<Link to='/profile' className='text-primary font-medium hover:underline'>
								Profile → Help &amp; Support
							</Link>{' '}
							when you are signed in.
						</p>

						<div className='space-y-8'>
							{SECTIONS.map((section) => (
								<section key={section.title}>
									<h2 className='text-[18px] font-semibold text-gray-900 mb-3'>
										{section.title}
									</h2>
									{section.title === '9. Quick contact numbers' ? (
										<div className='text-[15px] text-gray-600 leading-relaxed space-y-2'>
											<p>
												<strong className='text-gray-800'>Phone:</strong>{' '}
												<a href={`tel:${kSupportPhoneNumber.replace(/\s/g, '')}`} className='text-primary hover:underline'>
													{kSupportPhoneNumber}
												</a>
											</p>
											<p>
												<strong className='text-gray-800'>WhatsApp:</strong>{' '}
												<a
													href={`https://wa.me/${kSupportWhatsAppNumber.replace(/\D/g, '')}`}
													target='_blank'
													rel='noopener noreferrer'
													className='text-primary hover:underline'
												>
													{kSupportWhatsAppNumber}
												</a>{' '}
												(open chat in a new tab)
											</p>
											<p className='text-[14px] text-gray-500'>
												These match the shortcuts under Help &amp; Support in your profile when you are logged in.
											</p>
										</div>
									) : (
										<p className='text-[15px] text-gray-600 leading-relaxed'>{section.content}</p>
									)}
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

export default HelpView
