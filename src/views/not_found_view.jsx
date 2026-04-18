import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home } from 'lucide-react'
import Footer from '../components/footer'

const NotFoundView = () => {
	const location = useLocation()

	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])

	return (
		<>
			<div className='pt-30 pb-16 px-6 md:px-16 lg:px-20 min-h-[calc(100vh-12rem)] bg-gray-50 flex flex-col'>
				<div className='flex-1 flex items-center justify-center'>
					<div className='w-full max-w-lg'>
						<div className='bg-white rounded-2xl border border-gray-200 shadow-sm px-8 py-12 md:px-12 md:py-14 text-center'>
							<p
								className='text-[clamp(4.5rem,15vw,7rem)] font-bold leading-none tracking-tight text-primary/15 select-none'
								aria-hidden
							>
								404
							</p>
							<h1 className='text-[22px] md:text-[26px] font-bold text-gray-900 -mt-4 mb-3'>
								Page not found
							</h1>
							<p className='text-[15px] text-gray-600 leading-relaxed mb-2'>
								The page you are looking for was not found. It may have been moved, renamed, or the
								address may contain a typo.
							</p>
							<p className='text-[13px] text-gray-500 font-mono break-all mb-8'>
								{location.pathname}
							</p>
							<div className='flex justify-center'>
								<Link
									to='/explore'
									className='inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-[15px] font-semibold text-white hover:opacity-95 transition-opacity'
								>
									<Home className='w-5 h-5 shrink-0' aria-hidden />
									Go to home
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default NotFoundView
