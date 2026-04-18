import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, LayoutGrid, Code2, HeartHandshake, Shield } from 'lucide-react'
import Footer from '../components/footer'

const FUNCTIONS = [
	{
		icon: LayoutGrid,
		title: 'Product & design',
		description:
			'We shape discovery, listings, messaging, and payments so everyday users—renters, buyers, and owners—can move through the product without friction.'
	},
	{
		icon: Code2,
		title: 'Engineering',
		description:
			'We build reliable web and platform services, keep data secure, and ship iteratively so the experience improves every release.'
	},
	{
		icon: HeartHandshake,
		title: 'Customer success & support',
		description:
			'We answer tickets, unblock onboarding, and listen to feedback so real issues on the ground inform what we build next.'
	},
	{
		icon: Shield,
		title: 'Trust, risk & compliance',
		description:
			'We work with policies, partners, and regulators where applicable so Esvora stays a place people can recommend with confidence.'
	}
]

const SECTIONS = [
	{
		title: '1. How we work as a team',
		content:
			'Esvora is built by cross-functional squads: product, design, engineering, and customer-facing colleagues share goals and ship together. We favour clear written decisions, async updates where possible, and direct conversations when speed matters—especially when a user is blocked on rent, a shortlet, or a listing issue.'
	},
	{
		title: '2. What we look for in teammates',
		content:
			'Curiosity about housing in Nigeria, respect for users from every background, and pride in craft—whether that is code, copy, or a support reply. We value ownership: people who see a problem and drive it to a sensible conclusion, and who ask for help early when scope or risk grows.'
	},
	{
		title: '3. Diversity & inclusion',
		content:
			'Better products come from teams that reflect the communities we serve. We aim for fair hiring practices, inclusive meetings, and growth paths for contributors at different experience levels.'
	},
	{
		title: '4. Careers',
		content:
			'Open roles will be listed on this site or our official channels when we are actively hiring. Until a dedicated careers page is live, you may reach us through the Help center or Profile → Help & Support with “Careers” in the subject line, and we will keep your details on file where appropriate.'
	},
	{
		title: '5. Partner with our teams',
		content:
			'If you represent an organisation interested in integrations, data partnerships, or housing programmes aligned with our mission, introduce yourself through the same support channels with a short summary and we will route your note to the right lead.'
	}
]

const TeamsView = () => {
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
							Teams
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026 · The people and functions behind Esvora.
						</p>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12'>
							{FUNCTIONS.map(({ icon: Icon, title, description }) => (
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
							Learn more about our mission on{' '}
							<Link to='/about' className='text-primary font-medium hover:underline'>
								About us
							</Link>
							{' · '}
							<Link to='/help' className='text-primary font-medium hover:underline'>
								Help center
							</Link>
						</p>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default TeamsView
