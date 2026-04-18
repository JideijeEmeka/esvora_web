import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Mail, Phone, UserCircle } from 'lucide-react'
import Footer from '../components/footer'

const OFFICIAL_AGENTS = [
	{
		name: 'Esvora Agent',
		email: 'agent@gmail.com',
		displayPhone: '+234 803 448 8873',
		telHref: 'tel:+2348034488873'
	},
	{
		name: 'Esvora',
		email: 'esvora.ng@gmail.com',
		displayPhone: '+234 803 448 8878',
		telHref: 'tel:+2348034488878'
	}
]

const SECTIONS = [
	{
		title: '1. Who are Esvora agents?',
		content:
			'Our agents are authorised representatives who can help you with listings, viewings, and questions about using the Platform. They work in line with Esvora’s standards for transparency and professional conduct. Always verify you are speaking with a contact listed on this page or confirmed through official Esvora channels.'
	},
	{
		title: '2. How to reach an agent',
		content:
			'Use the email or phone number shown for each agent below. For sensitive matters (payments, account access, disputes), prefer in-app Help & Support or the official flows in your profile so there is a record we can assist with.'
	},
	{
		title: '3. Staying safe',
		content:
			'Esvora will never ask you to send money to a personal account outside the Platform’s payment flows where those are enabled. If someone claims to be an agent but is not listed here, report it through Help & Support before taking any action.'
	}
]

const OurAgentsView = () => {
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
							Our agents
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026 · Official Esvora contacts.
						</p>

						<div className='space-y-6 mb-12'>
							{OFFICIAL_AGENTS.map((agent) => (
								<div
									key={agent.email}
									className='flex flex-col sm:flex-row sm:items-start gap-4 rounded-xl border border-gray-200 bg-gray-50/60 p-5'
								>
									<div className='flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white border border-gray-200 text-primary'>
										<UserCircle className='w-8 h-8' aria-hidden />
									</div>
									<div className='min-w-0 flex-1'>
										<h2 className='text-[18px] font-semibold text-gray-900 mb-3'>{agent.name}</h2>
										<div className='space-y-2 text-[15px] text-gray-700'>
											<p className='flex items-start gap-2'>
												<Mail className='w-5 h-5 shrink-0 text-gray-500 mt-0.5' aria-hidden />
												<a href={`mailto:${agent.email}`} className='text-primary font-medium hover:underline break-all'>
													{agent.email}
												</a>
											</p>
											<p className='flex items-start gap-2'>
												<Phone className='w-5 h-5 shrink-0 text-gray-500 mt-0.5' aria-hidden />
												<a href={agent.telHref} className='text-primary font-medium hover:underline'>
													{agent.displayPhone}
												</a>
											</p>
										</div>
									</div>
								</div>
							))}
						</div>

						<div className='space-y-8'>
							{SECTIONS.map((section) => (
								<section key={section.title}>
									<h2 className='text-[18px] font-semibold text-gray-900 mb-3'>{section.title}</h2>
									<p className='text-[15px] text-gray-600 leading-relaxed'>{section.content}</p>
								</section>
							))}
						</div>

						<p className='text-[14px] text-gray-500 mt-10 pt-8 border-t border-gray-100'>
							<Link to='/help' className='text-primary font-medium hover:underline'>
								Help center
							</Link>
							{' · '}
							<Link to='/about' className='text-primary font-medium hover:underline'>
								About us
							</Link>
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default OurAgentsView
