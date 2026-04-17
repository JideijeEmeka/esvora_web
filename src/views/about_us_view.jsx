import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Home, Target, Users, Leaf } from 'lucide-react'
import Footer from '../components/footer'

const HIGHLIGHTS = [
	{
		icon: Target,
		title: 'Our mission',
		description:
			'To simplify property discovery, empower home ownership, and support sustainable real estate growth in Nigeria.'
	},
	{
		icon: Home,
		title: 'What we build',
		description:
			'A modern platform for rent, buy, and shortlet—bringing clearer listings, safer flows, and better conversations between people and places.'
	},
	{
		icon: Users,
		title: 'Who we serve',
		description:
			'Renters and buyers searching with confidence, landlords and owners listing with less friction, and communities that deserve transparent housing options.'
	},
	{
		icon: Leaf,
		title: 'How we think long term',
		description:
			'Fair processes, responsible data use, and products that scale with cities—not quick fixes that leave users behind.'
	}
]

const SECTIONS = [
	{
		title: '1. Who we are',
		content:
			'Esvora is a property technology company focused on Nigeria’s housing market. We combine product design, local insight, and partnerships to make it easier to find a home, list a property, or book a short stay—without losing the human touch that every tenancy still depends on.'
	},
	{
		title: '2. The problem we care about',
		content:
			'Finding the right property is still harder than it should be: scattered listings, unclear pricing, slow responses, and too many informal middle layers. We are building Esvora so that more of the journey—search, chat, requests, and payments where supported—happens in one trusted place with clearer rules for everyone involved.'
	},
	{
		title: '3. What you can do on Esvora today',
		content:
			'Explore neighbourhoods and states, compare homes, save favourites, message landlords, send structured requests, and—depending on the journey—complete flows for shortlets and other property types through the web experience we continue to expand. Property owners can manage listings and enquiries through dedicated dashboards where enabled.'
	},
	{
		title: '4. Our values',
		content:
			'Transparency in what you see and what you pay. Respect for your time and your data. Reliability in core flows like sign-in, messaging, and support. Ambition to keep improving—because housing touches every part of daily life.'
	},
	{
		title: '5. Working with us',
		content:
			'We collaborate with individuals, teams, and partners who share a commitment to better housing outcomes. Career and partnership enquiries may be published on our site as programmes open; until then, reach us through Help & Support or the contact details listed in the footer.'
	},
	{
		title: '6. Legal & policies',
		content:
			'Our Terms and Conditions, Privacy Policy, Cookies Policy, Refund Policy, and Help center describe how the Platform works in detail. We encourage every user to read them alongside this page.'
	}
]

const AboutUsView = () => {
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
							About us
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026 · Esvora (esvoragroup)
						</p>

						<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12'>
							{HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
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
							Ready to browse?{' '}
							<Link to='/explore' className='text-primary font-medium hover:underline'>
								Explore properties
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

export default AboutUsView
