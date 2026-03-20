import { MenuIcon, XIcon, Bell, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLazyGetUnreadCountQuery } from '../repository/notification_repository'
import { selectCurrentAccount } from '../redux/slices/accountSlice'
import logo from '../assets/logo.png'
import NotificationWidget from './notification_widget'

const DICEBEAR_ADVENTURER = 'https://api.dicebear.com/9.x/adventurer/svg'

function getAvatarSrc(avatar) {
	if (!avatar || typeof avatar !== 'string') return null
	if (avatar.startsWith('data:') || avatar.startsWith('http')) return avatar
	return `${DICEBEAR_ADVENTURER}?seed=${encodeURIComponent(avatar)}`
}

const NOTIFICATIONS_OPEN_KEY = 'esvora_notifications_panel_open'

const PropertyOwnerNavbar = () => {
	const account = useSelector(selectCurrentAccount)
	const [isOpen, setIsOpen] = useState(false)
	const [isNotificationOpen, setIsNotificationOpen] = useState(
		() => sessionStorage.getItem(NOTIFICATIONS_OPEN_KEY) === '1'
	)
	const [fetchUnreadCount, { data: unreadCountData }] = useLazyGetUnreadCountQuery()
	const unreadCount = unreadCountData ?? 0
	const location = useLocation()

	useEffect(() => {
		fetchUnreadCount()
	}, [fetchUnreadCount])
	const avatarSrc = getAvatarSrc(account?.avatar ?? account?.avatar_url ?? account?.profile_image)
	const isSaleRoute = location.pathname.startsWith('/property-owner/sale') || location.pathname.startsWith('/property-owner/add-sale')

	// Get active tab from sessionStorage or determine from pathname
	const getActiveTab = () => {
		// Prefer pathname mapping so active state stays accurate.
		if (location.pathname.startsWith('/property-owner/listings')) return 'listings'
		if (location.pathname === '/property-owner/my-properties') return 'my-properties'
		if (location.pathname.startsWith('/property-owner/requests')) return 'requests'
		if (location.pathname === '/property-owner/message') return 'message'
		if (location.pathname === '/property-owner/shortlet') return 'shortlet'
		if (location.pathname.startsWith('/property-owner/sale') || location.pathname.startsWith('/property-owner/add-sale')) return 'sale'
		if (location.pathname === '/property-owner') return 'discover'

		// Fallback for unmapped routes.
		const storedTab = sessionStorage.getItem('propertyOwnerActiveTab')
		if (storedTab) return storedTab
		return 'discover'
	}

	const activeTab = getActiveTab()

	// Update active tab when pathname changes
	useEffect(() => {
		if (location.pathname.startsWith('/property-owner/listings')) {
			sessionStorage.setItem('propertyOwnerActiveTab', 'listings')
		} else if (location.pathname === '/property-owner/my-properties') {
			sessionStorage.setItem('propertyOwnerActiveTab', 'my-properties')
		} else if (location.pathname.startsWith('/property-owner/requests')) {
			sessionStorage.setItem('propertyOwnerActiveTab', 'requests')
		} else if (location.pathname === '/property-owner/message') {
			sessionStorage.setItem('propertyOwnerActiveTab', 'message')
		} else if (location.pathname === '/property-owner/shortlet') {
			sessionStorage.setItem('propertyOwnerActiveTab', 'shortlet')
		} else if (location.pathname.startsWith('/property-owner/sale') || location.pathname.startsWith('/property-owner/add-sale')) {
			sessionStorage.setItem('propertyOwnerActiveTab', 'sale')
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
						handleTabClick('my-properties')
					}}
					to='/property-owner/my-properties'
					className={`rounded-full px-4 py-2 transition-colors ${
						activeTab === 'my-properties' ? 'bg-gray-200' : 'hover:bg-gray-200'
					}`}
				>
					My Properties
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
					onClick={() => {
						setIsNotificationOpen(true)
						sessionStorage.setItem(NOTIFICATIONS_OPEN_KEY, '1')
					}}
					className='p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-primary relative'
					title='Notifications'
					aria-label='Open notifications'
				>
					<Bell className='w-5 h-5' />
					{unreadCount > 0 && (
						<span className='absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-primary rounded-full'>
							{unreadCount > 99 ? '99+' : unreadCount}
						</span>
					)}
				</button>
				<NotificationWidget
					isOpen={isNotificationOpen}
					onClose={() => {
						setIsNotificationOpen(false)
						sessionStorage.removeItem(NOTIFICATIONS_OPEN_KEY)
						fetchUnreadCount()
					}}
				/>
				<Link
					to='/property-owner/sale'
					onClick={() => {
						scrollTo(0, 0)
						setIsOpen(false)
					}}
					className={`bg-primary text-white px-3 py-2 text-[16px] max-md:hidden hover:bg-primary/80 hover:scale-105 transition rounded-full font-medium cursor-pointer ring-2 ${
						isSaleRoute ? 'ring-primary/60' : 'ring-transparent'
					}`}
				>
					Sell a property
				</Link>
				<Link
					to='/profile'
					onClick={() => setIsOpen(false)}
					className={`w-10 h-10 min-w-10 min-h-10 rounded-full overflow-hidden border-2 shrink-0 bg-gray-100 flex items-center justify-center ring-2 transition ${
						location.pathname === '/profile'
							? 'border-primary ring-primary/50'
							: 'border-gray-200 ring-transparent hover:ring-primary/30'
					}`}
					title='Profile'
					aria-label='Profile'
				>
					{avatarSrc ? (
						<img src={avatarSrc} alt='' className='w-full h-full object-cover' />
					) : (
						<User className='w-6 h-6 text-gray-500' />
					)}
				</Link>
			</div>

			<MenuIcon
				className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer'
				onClick={() => setIsOpen(!isOpen)}
			/>
		</div>
	)
}

export default PropertyOwnerNavbar
