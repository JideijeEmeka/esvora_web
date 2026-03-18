import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkAuthStatus } from '../lib/auth'
import Loader from '../components/loader'
import logo from '../assets/logo.png'

const INIT_DELAY_MS = 800

const InitializationView = () => {
	const navigate = useNavigate()

	useEffect(() => {
		const t = setTimeout(() => {
			checkAuthStatus(navigate).catch(() => navigate('/explore'))
		}, INIT_DELAY_MS)
		return () => clearTimeout(t)
	}, [navigate])

	return (
		<div className='w-full min-h-screen flex flex-col items-center justify-center bg-white px-6'>
			<img
				src={logo}
				alt="Esvora"
				className='w-36 h-auto mb-8'
			/>
			<div className='flex items-center gap-3'>
				<span className='text-gray-500 text-sm'>Starting engine...</span>
				<Loader size={28} className='shrink-0' />
			</div>
		</div>
	)
}

export default InitializationView
