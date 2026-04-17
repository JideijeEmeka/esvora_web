import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Mail, Phone, MessageCircle, MapPin } from 'lucide-react'
import Footer from '../components/footer'
import {
	kSupportPhoneNumber,
	kSupportWhatsAppNumber,
	kTicketEmail
} from '../lib/constants'

const SUPPORT_EMAIL = 'support@esvora.ng'

const CONTACT_CHANNELS = [
	{
		icon: Phone,
		label: 'Phone',
		value: kSupportPhoneNumber,
		href: `tel:${kSupportPhoneNumber.replace(/\s/g, '')}`
	},
	{
		icon: MessageCircle,
		label: 'WhatsApp',
		value: `+${kSupportWhatsAppNumber.replace(/^\+/, '')}`,
		href: `https://wa.me/${kSupportWhatsAppNumber.replace(/\D/g, '')}`
	},
	{
		icon: Mail,
		label: 'General enquiries',
		value: SUPPORT_EMAIL,
		href: `mailto:${SUPPORT_EMAIL}`
	},
	{
		icon: Mail,
		label: 'Support tickets',
		value: kTicketEmail,
		href: `mailto:${kTicketEmail}`
	}
]

const SECTIONS = [
	{
		title: '1. Contact us any time',
		content:
			'We are here for questions about listings, your account, payments, shortlets, and using Esvora safely. The fastest way to get a tracked response is often Profile → Help & Support after you sign in. The channels on this page are official ways to reach our team when you are browsing without an account or prefer phone and email.'
	},
	{
		title: '2. In-app Help & Support',
		content:
			'Signed-in users should open Profile and choose Help & Support for live chat (where enabled), ticket creation, WhatsApp and phone shortcuts, and feedback. That keeps your request tied to your account and speeds up investigation.'
	},
	{
		title: '3. Licensed agents',
		content:
			'For property-related assistance from named Esvora agents, see the Our agents page for authorised contacts and safety tips.'
	},
	{
		title: '4. Office & mail',
		content:
			'Esvora serves customers across Nigeria. Written correspondence and registered service may be directed to the postal address published in your contract or onboarding materials when applicable; general enquiries by email are welcome at the address above.'
	}
]

const ContactUsView = () => {
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
							Contact us
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026 · Official Esvora channels.
						</p>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12'>
							{CONTACT_CHANNELS.map(({ icon: Icon, label, value, href }) => (
								<a
									key={label + value}
									href={href}
									target={href.startsWith('http') ? '_blank' : undefined}
									rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
									className='flex gap-4 rounded-xl border border-gray-200 bg-gray-50/80 p-4 text-left transition-colors hover:border-primary/30 hover:bg-gray-50'
								>
									<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 text-primary'>
										<Icon className='w-5 h-5' aria-hidden />
									</div>
									<div className='min-w-0'>
										<p className='text-[13px] font-medium text-gray-500 mb-0.5'>{label}</p>
										<p className='text-[15px] font-semibold text-gray-900 break-all'>{value}</p>
									</div>
								</a>
							))}
						</div>

						<div className='flex items-start gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-4 mb-12'>
							<MapPin className='w-5 h-5 shrink-0 text-gray-500 mt-0.5' aria-hidden />
							<p className='text-[14px] text-gray-600 leading-relaxed'>
								We operate digitally across Nigeria. For on-site or postal arrangements related to a specific booking or agreement, follow the instructions in your confirmation or contract.
							</p>
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
							<Link to='/agents' className='text-primary font-medium hover:underline'>
								Our agents
							</Link>
							{' · '}
							<Link to='/help' className='text-primary font-medium hover:underline'>
								Help center
							</Link>
							{' · '}
							<Link to='/profile' className='text-primary font-medium hover:underline'>
								Profile
							</Link>
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default ContactUsView
