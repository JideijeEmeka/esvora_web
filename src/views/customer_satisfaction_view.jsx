import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Images, MapPin, MessageCircle, Send, Wallet, Building2 } from 'lucide-react'
import Footer from '../components/footer'

const TRUST_PILLARS = [
	{
		icon: Images,
		title: 'Clear galleries & details',
		description: 'Multiple photos, floor plans where provided, amenities, pricing, and location context so you know what you are booking before you commit.'
	},
	{
		icon: MapPin,
		title: 'Accurate property context',
		description: 'Addresses, areas, and descriptions are shown up front so there are fewer surprises on move-in or check-in day.'
	},
	{
		icon: MessageCircle,
		title: 'Built-in chat',
		description: 'Message landlords in context on each property—keeping questions and answers tied to the right listing.'
	},
	{
		icon: Send,
		title: 'Send request flow',
		description: 'Structured enquiries and requests help both sides record what was asked, reducing confusion compared to scattered emails or phone tags.'
	},
	{
		icon: Wallet,
		title: 'Direct shortlet payments',
		description: 'Pay for shortlets through the Platform’s payment flow where enabled, so funds and booking status are aligned and easier to support if something goes wrong.'
	},
	{
		icon: Building2,
		title: 'Direct to owners, fewer middlemen',
		description: 'Connect with property owners where our product allows—without traditional agent chains adding fee after fee, so you keep more value and know who you are dealing with.'
	}
]

const SECTIONS = [
	{
		title: '1. Why customer satisfaction matters at Esvora',
		content:
			'Esvora is built around trust in a market where renting, buying, and shortletting has often been opaque or expensive because of layers of intermediaries. We focus on transparent information, direct communication, and payment flows that match what you see on screen—so you can book and pay with confidence, and property owners can manage enquiries fairly.'
	},
	{
		title: '2. Rich property information builds confidence',
		content:
			'Every serious decision starts with good information. Listings on Esvora encourage clear image galleries, headline facts (bedrooms, bathrooms, rent or price basis), location cues, and narrative descriptions. When you can see the space and read consistent details before messaging or paying, you reduce mismatched expectations—that is a core part of how we define satisfaction.'
	},
	{
		title: '3. Chatting in one place',
		content:
			'Our messaging experience connects you with landlords around a specific property. That keeps negotiations, clarifications, and scheduling in one thread instead of scattered across personal SMS or informal channels. A clear chat history helps resolve disputes, confirms what was agreed, and generally feels more professional than informal middleman relay.'
	},
	{
		title: '4. Send request system',
		content:
			'Formal send-request flows help tenants and buyers state intent clearly—dates, budgets, or special needs—while landlords receive structured signals to accept, decline, or counter. Compared with ad-hoc “someone knows someone” brokering, it is easier to track who asked for what and when, which improves accountability on both sides.'
	},
	{
		title: '5. Direct payments for shortlets',
		content:
			'Short stays move fast; ambiguity about payment kills trust. Where the Platform offers integrated payment for shortlets, you benefit from a documented checkout path tied to your booking. That does not remove the need to read the listing carefully, but it aligns money movement with the stay you selected, which users consistently tell us feels safer than cash-in-hand handoffs through unknown representatives.'
	},
	{
		title: '6. Fewer intermediaries, fairer pricing',
		content:
			'Traditional chains of agents and informal middlemen often add fees at each hop, without adding proportional value for the renter or guest. Esvora’s model emphasises connecting you with owners and transparent platform flows. Where middle layers are removed or reduced, savings are more likely to stay with renters and landlords rather than disappearing into commissions—which supports the satisfaction goal of “paying less for the same property quality where the market allows it.”'
	},
	{
		title: '7. When something is not right',
		content:
			'Even with strong product design, issues happen. Use Profile → Help & Support to reach us via ticket, chat, phone, or WhatsApp as described in our Help center page. Refund and dispute rules (including time-bound landlord release commitments where applicable) are explained in our Refund policy and Terms.'
	},
	{
		title: '8. We keep improving',
		content:
			'Ratings, support tickets, and product analytics help us prioritise what to fix next—from mobile usability to payment edge cases. Thank you for choosing Esvora; your feedback directly shapes the roadmap.'
	}
]

const CustomerSatisfactionView = () => {
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
							Customer satisfaction
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026 · How Esvora earns your trust—from listings to payments.
						</p>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12'>
							{TRUST_PILLARS.map(({ icon: Icon, title, description }) => (
								<div
									key={title}
									className='flex gap-4 rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-left'
								>
									<div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white border border-gray-200 text-primary'>
										<Icon className='w-5 h-5' aria-hidden />
									</div>
									<div>
										<h3 className='text-[15px] font-semibold text-gray-900 mb-1'>{title}</h3>
										<p className='text-[13px] text-gray-600 leading-relaxed'>{description}</p>
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
							Need help? Visit the{' '}
							<Link to='/help' className='text-primary font-medium hover:underline'>
								Help center
							</Link>{' '}
							or open{' '}
							<Link to='/profile' className='text-primary font-medium hover:underline'>
								Profile → Help &amp; Support
							</Link>{' '}
							when signed in.
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default CustomerSatisfactionView
