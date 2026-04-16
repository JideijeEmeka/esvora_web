import { MenuIcon, XIcon, Heart, Bell, User } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useLazyGetUnreadCountQuery } from '../repository/notification_repository'
import { selectCurrentAccount } from '../redux/slices/accountSlice'
import { getToken } from '../lib/localStorage'
import logo from '../assets/logo.png'
import NotificationWidget from './notification_widget'

const DICEBEAR_ADVENTURER = 'https://api.dicebear.com/9.x/adventurer/svg'

function getAvatarSrc(avatar) {
	if (!avatar || typeof avatar !== 'string') return null
	if (avatar.startsWith('data:') || avatar.startsWith('http')) return avatar
	return `${DICEBEAR_ADVENTURER}?seed=${encodeURIComponent(avatar)}`
}

const NOTIFICATIONS_OPEN_KEY = 'esvora_notifications_panel_open'

const Navbar = () => {
  const account = useSelector(selectCurrentAccount)
  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(
    () => sessionStorage.getItem(NOTIFICATIONS_OPEN_KEY) === '1'
  )
  const [fetchUnreadCount, { data: unreadCountData }] = useLazyGetUnreadCountQuery()
  const unreadCount = unreadCountData ?? 0
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    fetchUnreadCount()
  }, [fetchUnreadCount])
  const avatarSrc = getAvatarSrc(account?.avatar ?? account?.avatar_url ?? account?.profile_image)
  
  // Get active tab from pathname (for pages with their own nav state) or sessionStorage
  const getActiveTab = () => {
    // When on favourites, no main nav item should be highlighted
    if (location.pathname === '/favourites') return 'favourites'
    
    const storedTab = sessionStorage.getItem('activeTab')
    if (storedTab) return storedTab
    
    // Default based on pathname
    if (location.pathname === '/buy') return 'buy'
    if (location.pathname === '/rent') return 'rent'
    if (location.pathname === '/shortlet') return 'shortlet'
    if (location.pathname === '/properties') return 'properties'
    if (location.pathname === '/property-owner') return 'property-owner'
    if (location.pathname === '/messages') return 'message'
    if (location.pathname === '/requests') return 'requests'
    if (location.pathname === '/profile') return 'profile'
    if (location.pathname === '/') return 'discover'
    return null
  }
  
  const activeTab = getActiveTab()
  
  // Update active tab when pathname changes (for direct navigation)
  useEffect(() => {
    if (location.pathname === '/favourites') {
      sessionStorage.setItem('activeTab', 'favourites')
    } else if (location.pathname === '/buy') {
      sessionStorage.setItem('activeTab', 'buy')
    } else if (location.pathname === '/rent') {
      sessionStorage.setItem('activeTab', 'rent')
    } else if (location.pathname === '/shortlet') {
      sessionStorage.setItem('activeTab', 'shortlet')
    } else if (location.pathname === '/properties') {
      sessionStorage.setItem('activeTab', 'properties')
    } else if (location.pathname === '/property-owner') {
      sessionStorage.setItem('activeTab', 'property-owner')
    } else if (location.pathname === '/messages') {
      sessionStorage.setItem('activeTab', 'message')
    } else if (location.pathname === '/requests') {
      sessionStorage.setItem('activeTab', 'requests')
    } else if (location.pathname === '/profile') {
      sessionStorage.setItem('activeTab', 'profile')
    } else if (location.pathname === '/') {
      // Only set discover if no active tab is stored (to preserve active tab when on property details)
      if (!sessionStorage.getItem('activeTab')) {
        sessionStorage.setItem('activeTab', 'discover')
      }
    }
  }, [location.pathname])
  
  const handleTabClick = (tabName) => {
    sessionStorage.setItem('activeTab', tabName)
    setIsOpen(false)
  }

  return (
    <div className='flex justify-between fixed top-0 left-0 z-50 bg-white
    w-full items-center px-6 md:px-16 lg:px-20 py-5 shadow-md'>
      <Link
        to="/explore"
        onClick={() => { window.scrollTo(0, 0); handleTabClick('discover') }}
        className='max-md:flex-1'
      >
        <img src={logo} alt="Esvora" className='w-36 h-auto' />
      </Link>

      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg text-[16px]
        z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-5 md:px-8 py-3 max-md:h-screen 
        max-md:backdrop-blur-xl max-md:bg-white/150 overflow:hidden transition-[width] duration-300 
        ${isOpen ? 'max-md:w-full' : 'max-md:w-0 max-md:hidden'}`}>

        <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' 
            onClick={() => setIsOpen(!isOpen)} />

        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('discover')}} 
          to="/explore" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'discover' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Discover
        </Link>
        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('rent')}} 
          to="/rent" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'rent' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Rent
        </Link>
        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('buy')}} 
          to="/buy" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'buy' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Buy
        </Link>
        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('shortlet')}} 
          to="/shortlet" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'shortlet' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Shortlet
        </Link>
        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('message')}} 
          to="/messages" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'message' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Message
        </Link>
        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('requests')}} 
          to="/requests" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'requests' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Requests
        </Link>
        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('properties')}} 
          to="/properties" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'properties' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Properties
        </Link>
        <button
          type='button'
          onClick={() => {
            setIsNotificationOpen(true)
            setIsOpen(false)
            sessionStorage.setItem(NOTIFICATIONS_OPEN_KEY, '1')
          }}
          className='md:hidden rounded-full px-4 py-2 transition-colors hover:bg-gray-200 flex items-center gap-2 relative'
        >
          Notification
          {unreadCount > 0 && (
            <span className='min-w-[16px] h-4 px-1 flex items-center justify-center text-[10px] font-semibold text-white bg-primary rounded-full'>
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>
        {/* <Link
          to="/favourites"
          onClick={() => { setIsOpen(false) }}
          className={`md:hidden rounded-full px-4 py-2 transition-colors flex items-center gap-2 ${
            location.pathname === '/favourites' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Favourites
        </Link> */}
        {/* <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('property-owner')}} 
          to="/property-owner" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'property-owner' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Property owner
        </Link> */}
      </div>

    
      <div className='flex items-center gap-4 md:gap-10'>
      <button
        type='button'
        onClick={() => {
          setIsNotificationOpen(true)
          sessionStorage.setItem(NOTIFICATIONS_OPEN_KEY, '1')
        }}
        className='max-md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-primary relative'
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
      {/* <Link
        to="/favourites"
        onClick={() => setIsOpen(false)}
        className={`max-md:hidden p-2 rounded-full transition-colors ${
          location.pathname === '/favourites'
            ? 'text-primary bg-primary/10'
            : 'text-gray-700 hover:text-primary hover:bg-gray-100'
        }`}
        title='Favourites'
      >
        <Heart
          className={`w-5 h-5 ${
            location.pathname === '/favourites' ? 'fill-primary' : ''
          }`}
        />
      </Link> */}
        {!((getToken() ?? '').trim()) ? (
          <Link
            to="/login"
            onClick={() => { window.scrollTo(0, 0); setIsOpen(false) }}
            className='px-4 py-2 rounded-full bg-primary text-white font-medium text-[14px] hover:bg-primary/90 transition-colors'
          >
            Log in
          </Link>
        ) : (
          <Link
            to="/profile"
            onClick={() => { window.scrollTo(0, 0); setIsOpen(false); handleTabClick('profile') }}
            className={`w-10 h-10 min-w-10 min-h-10 rounded-full overflow-hidden border-2 shrink-0 bg-gray-100 flex items-center justify-center ring-2 transition ${
              location.pathname === '/profile'
                ? 'border-primary ring-primary/50'
                : 'border-gray-200 ring-transparent hover:ring-primary/30'
            }`}
            title='Profile'
            aria-label='Profile'
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className='w-full h-full object-cover' />
            ) : (
              <User className='w-6 h-6 text-gray-500' />
            )}
          </Link>
        )}
      </div>

      <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' 
          onClick={() => setIsOpen(!isOpen)}/>
    </div>
  )
}

export default Navbar