import { MenuIcon, XIcon, Bell } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logo.png'
import NotificationWidget from './notification_widget'

const PropertyOwnerNavbar = () => {
	const [isOpen, setIsOpen] = useState(false)
	const [isNotificationOpen, setIsNotificationOpen] = useState(false)
	const navigate = useNavigate()
	const location = useLocation()

	// Get active tab from sessionStorage or determine from pathname
	const getActiveTab = () => {
		const storedTab = sessionStorage.getItem('propertyOwnerActiveTab')
		if (storedTab) return storedTab

		// Default based on pathname
		if (location.pathname === '/property-owner/listings') return 'listings'
		if (location.pathname.startsWith('/property-owner/requests')) return 'requests'
		if (location.pathname === '/property-owner/message') return 'message'
		if (location.pathname === '/property-owner') return 'discover'
		return 'discover'
	}

	const activeTab = getActiveTab()

	// Update active tab when pathname changes
	useEffect(() => {
		if (location.pathname === '/property-owner/listings') {
			sessionStorage.setItem('propertyOwnerActiveTab', 'listings')
		} else 		if (location.pathname.startsWith('/property-owner/requests')) {
			sessionStorage.setItem('propertyOwnerActiveTab', 'requests')
		} else if (location.pathname === '/property-owner/message') {
			sessionStorage.setItem('propertyOwnerActiveTab', 'message')
		} else if (location.pathname === '/property-owner') {
			sessionStorage.setItem('propertyOwnerActiveTab', 'discover')
		}
	}, [location.pathname])

	const handleTabClick = (tabName) => {
		sessionStorage.setItem('propertyOwnerActiveTab', tabName)
		setIsOpen(false)
	}

	return (
		<div className='flex justify-between fixed top-0 left-0 z-50 
		    bg-white w-full items-center px-6 md:px-16 lg:px-20 py-5 shadow-md'>
			<Link to='/property-owner' className='max-md:flex-1'>
				<img src={logo} alt='logo' className='w-36 h-auto' />
			</Link>

			<div
				className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg text-[16px]
        z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-5 md:px-8 py-3 max-md:h-screen 
        max-md:backdrop-blur-sm overflow:hidden transition-[width] duration-300 
        ${isOpen ? 'max-md:w-full' : 'max-md:w-0 max-md:hidden'}`}
			>
				<XIcon
					className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer'
					onClick={() => setIsOpen(!isOpen)}
				/>

				<Link
					onClick={() => {
						scrollTo(0, 0)
						handleTabClick('discover')
					}}
					to='/property-owner'
					className={`rounded-full px-4 py-2 transition-colors ${
						activeTab === 'discover' ? 'bg-gray-200' : 'hover:bg-gray-200'
					}`}
				>
					Discover
				</Link>
				<Link
					onClick={() => {
						scrollTo(0, 0)
						handleTabClick('requests')
					}}
					to='/property-owner/requests'
					className={`rounded-full px-4 py-2 transition-colors ${
						activeTab === 'requests' ? 'bg-gray-200' : 'hover:bg-gray-200'
					}`}
				>
					Requests
				</Link>
				<Link
					onClick={() => {
						scrollTo(0, 0)
						handleTabClick('listings')
					}}
					to='/property-owner/listings'
					className={`rounded-full px-4 py-2 transition-colors ${
						activeTab === 'listings' ? 'bg-gray-200' : 'hover:bg-gray-200'
					}`}
				>
					Listings
				</Link>
				<Link
					onClick={() => {
						scrollTo(0, 0)
						handleTabClick('shortlet')
					}}
					to='/property-owner/shortlet'
					className={`rounded-full px-4 py-2 transition-colors ${
						activeTab === 'shortlet' ? 'bg-gray-200' : 'hover:bg-gray-200'
					}`}
				>
					Shortlet
				</Link>
				<Link
					onClick={() => {
						scrollTo(0, 0)
						handleTabClick('message')
					}}
					to='/property-owner/message'
					className={`rounded-full px-4 py-2 transition-colors ${
						activeTab === 'message' ? 'bg-gray-200' : 'hover:bg-gray-200'
					}`}
				>
					Message
				</Link>
			</div>

			<div className='flex items-center gap-4 md:gap-10'>
				<button
					type='button'
					onClick={() => setIsNotificationOpen(true)}
					className='p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-primary relative'
					title='Notifications'
					aria-label='Open notifications'
				>
					<Bell className='w-5 h-5' />
				</button>
				<NotificationWidget
					isOpen={isNotificationOpen}
					onClose={() => setIsNotificationOpen(false)}
				/>
				<button className='bg-primary text-white px-3 py-2 text-[16px] max-md:hidden hover:bg-primary/80 hover:scale-105 transition rounded-full font-medium cursor-pointer'>
					Rent property
				</button>
				<Link to='/help' className='max-md:hidden text-[16px] font-medium'>
					Help
				</Link>
				<Link to='/login' className='max-md:hidden text-[16px] font-medium'>
					Log in
				</Link>
				<div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden'>
					<img
						onClick={() => navigate('/profile')}
						src='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
						alt='Profile'
						className='w-full h-full object-cover'
					/>
				</div>
			</div>

			<MenuIcon
				className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
				onClick={() => setIsOpen(!isOpen)}
			/>
		</div>
	)
}

export default PropertyOwnerNavbar
