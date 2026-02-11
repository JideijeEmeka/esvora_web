import { MenuIcon, XIcon, Heart, Bell } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import logo from '../assets/logo.png'
import NotificationWidget from './notification_widget'

const Navbar = () => {

  const [isOpen, setIsOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get active tab from sessionStorage or determine from pathname
  const getActiveTab = () => {
    const storedTab = sessionStorage.getItem('activeTab')
    if (storedTab) return storedTab
    
    // Default based on pathname
    if (location.pathname === '/buy') return 'buy'
    if (location.pathname === '/rent') return 'rent'
    if (location.pathname === '/shortlet') return 'shortlet'
    if (location.pathname === '/my-properties') return 'my-properties'
    if (location.pathname === '/property-owner') return 'property-owner'
    if (location.pathname === '/profile') return 'profile'
    if (location.pathname === '/') return 'discover'
    return null
  }
  
  const activeTab = getActiveTab()
  
  // Update active tab when pathname changes (for direct navigation)
  useEffect(() => {
    if (location.pathname === '/buy') {
      sessionStorage.setItem('activeTab', 'buy')
    } else if (location.pathname === '/rent') {
      sessionStorage.setItem('activeTab', 'rent')
    } else if (location.pathname === '/shortlet') {
      sessionStorage.setItem('activeTab', 'shortlet')
    } else if (location.pathname === '/my-properties') {
      sessionStorage.setItem('activeTab', 'my-properties')
    } else if (location.pathname === '/property-owner') {
      sessionStorage.setItem('activeTab', 'property-owner')
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
      <Link to="/" className='max-md:flex-1'>
        <img src={logo} alt="logo" className='w-36 h-auto' />
      </Link>

      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg text-[16px]
        z-50 flex flex-col md:flex-row items-center max-md:justify-center gap-5 md:px-8 py-3 max-md:h-screen 
        max-md:backdrop-blur-sm overflow:hidden transition-[width] duration-300 
        ${isOpen ? 'max-md:w-full' : 'max-md:w-0 max-md:hidden'}`}>

        <XIcon className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' 
            onClick={() => setIsOpen(!isOpen)} />

        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('discover')}} 
          to="/kyc" 
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
          onClick={()=> {scrollTo(0,0), handleTabClick('profile')}} 
          to="/profile" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'profile' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          Message
        </Link>
        <Link 
          onClick={()=> {scrollTo(0,0), handleTabClick('my-properties')}} 
          to="/my-properties" 
          className={`rounded-full px-4 py-2 transition-colors ${
            activeTab === 'my-properties' ? 'bg-gray-200' : 'hover:bg-gray-200'
          }`}
        >
          My properties
        </Link>
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
      {/* <button
        type='button'
        onClick={() => setIsNotificationOpen(true)}
        className='p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-primary relative'
        title='Notifications'
        aria-label='Open notifications'
      >
        <Bell className='w-5 h-5' />
      </button> */}
      {/* <NotificationWidget
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      /> */}
      <Link
        to="/favourites"
        onClick={() => setIsOpen(false)}
        className='p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700 hover:text-primary'
        title='Favourites'
      >
        <Heart className='w-5 h-5' />
      </Link>
      <button className='bg-primary text-white px-3 py-2 text-[16px] max-md:hidden
         hover:bg-primary/80 hover:scale-105 transition rounded-full font-medium cursor-pointer'>List a property</button>
        <Link to="/help" className='max-md:hidden text-[16px] font-medium'>Help</Link>
        <Link to="/login" className='max-md:hidden text-[16px] font-medium'>Log in</Link>
      </div>

      <MenuIcon className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' 
          onClick={() => setIsOpen(!isOpen)}/>
    </div>
  )
}

export default Navbar