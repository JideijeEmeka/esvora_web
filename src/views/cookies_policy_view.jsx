import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import Footer from '../components/footer'

const SECTIONS = [
	{
		title: '1. What are cookies?',
		content:
			'Cookies are small text files stored on your device when you visit a website or use a web application. They are widely used to make sites work more efficiently, remember your preferences, and understand how visitors use a service. Similar technologies include local storage, session storage, and pixels; this policy refers to all of these as “cookies” unless we specify otherwise.'
	},
	{
		title: '2. How Esvora uses cookies',
		content:
			'Esvora uses cookies and similar technologies to: keep you signed in and maintain your session; protect the Platform against fraud and abuse; remember settings such as language or display preferences where available; measure traffic and performance so we can improve search, listings, and reliability; and, where you have agreed, support relevant communications or experiences. Some cookies are essential for the Platform to function; others are optional and depend on your choices or applicable law.'
	},
	{
		title: '3. Types of cookies we use',
		content:
			'Strictly necessary cookies — required for core features such as authentication, security, load balancing, and remembering cookie consent choices. These do not require consent under many laws but you can still block them via your browser; the Platform may not work correctly if you do. Functional cookies — help us remember your preferences and improve usability. Analytics cookies — help us understand aggregate usage (for example, which pages are viewed and how long sessions last). Marketing cookies — may be used only where permitted and when you have opted in, to measure campaigns or deliver more relevant messages.'
	},
	{
		title: '4. First-party and third-party cookies',
		content:
			'First-party cookies are set by Esvora when you use esvora.ng or our apps. Third-party cookies are set by partners we use for hosting, analytics, payment, customer support, or embedded content. Those partners are required to process data in line with their policies and our agreements. We encourage you to review their privacy and cookie notices where linked from our Platform.'
	},
	{
		title: '5. Duration',
		content:
			'Session cookies are deleted when you close your browser. Persistent cookies remain for a defined period (for example, to keep you signed in for a limited time or to remember consent). Retention periods vary by purpose; we periodically review and shorten retention where possible.'
	},
	{
		title: '6. Managing and disabling cookies',
		content:
			'You can control cookies through your browser settings (block, delete, or alert you before storing). You may also use industry opt-out tools where available for advertising cookies. Blocking all cookies may prevent sign-in, messaging, or other features from working. For mobile apps, equivalent controls may appear in your device or in-app settings where we offer them.'
	},
	{
		title: '7. Do Not Track and global signals',
		content:
			'Some browsers send “Do Not Track” or similar signals. There is no consistent industry standard for how to respond. We currently treat cookie choices through our consent mechanisms and your browser settings rather than solely through automated DNT signals, but we may update this approach as standards evolve.'
	},
	{
		title: '8. Updates to this policy',
		content:
			'We may update this Cookies Policy to reflect changes in technology, law, or our practices. The “Last updated” date below will change when we publish a new version. We encourage you to review this page periodically. Material changes may be highlighted on the Platform or in other notices where required.'
	},
	{
		title: '9. More information',
		content:
			'For how we use personal data more broadly, please read our Privacy Policy. For rules governing use of the Platform, see our Terms and Conditions. If you have questions about cookies or this policy, contact us through Help & Support or the contact details published on esvora.ng.'
	}
]

const CookiesPolicyView = () => {
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
							Cookies Policy
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

export default CookiesPolicyView
