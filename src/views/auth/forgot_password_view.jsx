import React, { useState } from 'react'
import Navbar from '../../components/navbar'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import ButtonWidget from '../../components/button'


const ForgotPasswordView = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')

  return (
    <>
      <Navbar />
      <div className='w-full h-screen md:fixed max-md:items-center max-md:justify-start
        flex items-center justify-center px-6 lg:px-30 md:py-1 max-md:py-30 flex-col'>
        <div className='w-[400px] max-md:w-full max-md:px-7 flex items-start justify-start'>
          <button className='bg-white text-gray-700 px-3 py-1.5 text-[14px] 
            max-md:mt-2 max-md:mb-6 mt-6 mb-3
            flex items-center gap-2 hover:bg-primary/80 hover:scale-105 border border-gray-300
            transition rounded-full font-semibold hover:text-white cursor-pointer' 
            onClick={() => navigate(-1)}>
            <ArrowLeftIcon className='w-4 h-4' />Back
          </button>
        </div>

        <h1 className='text-[24px] font-semibold max-md:px-10 w-[400px] py-6'>Forgot password?</h1>
        
        <form className='w-[400px] flex flex-col max-md:px-10'>
          <label htmlFor="email" className='text-[16px] font-medium text-gray-500'>Email address</label>
          <input 
            type="email" 
            name='email' 
            placeholder='enter email address' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] 
            mt-1.5 mb-6 border border-gray-300 rounded-full' 
          />
        </form>

        <ButtonWidget text="Continue" onClick={() => email && navigate(`/forgot-password-otp/${email}`)} />
        
        <p className='text-[16px] text-gray-400 w-[400px] mt-3 font-extralight max-md:px-10'>
          By continuing, you agree to Esvora's 
          <Link to="/terms" className='text-gray-500 font-light text-[16px] ml-1 cursor-pointer'>
            Terms of Service
          </Link> 
          and
          <Link to="/privacy" className='text-gray-500 font-light text-[16px] ml-1 cursor-pointer'>
            Privacy Policy
          </Link>
        </p>
      </div>
    </>
  )
}

export default ForgotPasswordView