import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, Briefcase, TrendingUp, Rocket } from 'lucide-react'
import Footer from '../components/footer'

const WHY_ESVORA = [
	{
		icon: Briefcase,
		title: 'Meaningful scope',
		description:
			'You will work on problems that touch housing, payments, and trust—systems that matter when someone is choosing their next home.'
	},
	{
		icon: TrendingUp,
		title: 'Room to grow',
		description:
			'We invest in mentorship, feedback, and stretch projects so you can deepen your craft in product, engineering, design, or support.'
	},
	{
		icon: Rocket,
		title: 'Ship with pace',
		description:
			'Small teams, clear priorities, and a bias to release—so your work reaches users instead of sitting in endless internal review.'
	}
]

const SECTIONS = [
	{
		title: '1. Careers at Esvora',
		content:
			'Esvora is growing a team that cares about transparent property experiences in Nigeria. Whether you build software, design interfaces, support customers, or keep operations steady, you will collaborate with people who take ownership and treat users with respect.'
	},
	{
		title: '2. Roles we often look for',
		content:
			'Depending on hiring cycles, we may recruit for product management, full-stack or frontend engineering, UX design, QA, data analytics, customer success, content, and operations roles. Exact titles and seniority vary; we publish specifics when each window opens.'
	},
	{
		title: '3. How hiring works',
		content:
			'Typical steps include an application review, a conversation about your experience and motivation, a practical exercise where relevant (for example a design critique or technical task), and conversations with future teammates. We aim to communicate outcomes clearly and keep timelines reasonable.'
	},
	{
		title: '4. Ways of working',
		content:
			'We combine focused remote work with in-person collaboration when projects benefit from it. Expect written updates, documented decisions, and respect for focus time—especially when production issues affect renters or landlords.'
	},
	{
		title: '5. How to apply today',
		content:
			'Until a dedicated applicant tracking page is linked from this site, send a short introduction, your CV or portfolio link, and the role you are interested in through the Help center or Profile → Help & Support with “Careers application” in the subject or first line. We read every serious note and reply when there is a match or follow-up question.'
	},
	{
		title: '6. Equal opportunity',
		content:
			'Esvora is an equal opportunity employer. We do not discriminate on the basis of race, religion, gender, age, disability, marital status, or other protected characteristics. We make hiring decisions on merit, role fit, and our values.'
	}
]

const CareerView = () => {
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
							Career
						</h1>
						<p className='text-[14px] text-gray-500 mb-8'>
							Last updated: April 2026 · Build with the Esvora team.
						</p>

						<div className='grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12'>
							{WHY_ESVORA.map(({ icon: Icon, title, description }) => (
								<div
									key={title}
									className='flex flex-col gap-3 rounded-xl border border-gray-100 bg-gray-50/80 p-4 text-left sm:col-span-1'
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
							See how we organise work in{' '}
							<Link to='/teams' className='text-primary font-medium hover:underline'>
								Teams
							</Link>
							{' · '}
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

export default CareerView
