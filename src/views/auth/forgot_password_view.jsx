import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import ButtonWidget from '../../components/button'
import AuthController from '../../controllers/auth_controller'
import { validateEmail } from '../../lib/validation'

const ForgotPasswordView = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [emailError, setEmailError] = useState('')
  const accountController = new AccountController()

  const handleContinue = (e) => {
    e?.preventDefault?.()
    const result = validateEmail(email)
    if (!result.valid) {
      setEmailError(result.message ?? 'Enter a valid email')
      toast.error(result.message ?? 'Enter a valid email address')
      return
    }
    setEmailError('')
    authController.forgetPassword(email.trim(), {
      setLoading: setIsLoading,
      navigate,
      onError: (message) => {
        toast.error(message)
        setEmailError(message)
      },
      onSuccess: () => toast.success('Reset link sent. Check your email.'),
    })
  }

  return (
    <>
      <div className='w-full h-screen md:fixed max-md:items-center max-md:justify-start
        flex items-center justify-center px-6 lg:px-30 pt-4 pb-8 flex-col'>
        <div className='w-[400px] max-md:w-full max-md:px-7 flex items-start justify-start'>
          <button className='bg-white text-gray-700 px-3 py-1.5 text-[14px] 
            mb-3
            flex items-center gap-2 hover:bg-primary/80 hover:scale-105 border border-gray-300
            transition rounded-full font-semibold hover:text-white cursor-pointer' 
            onClick={() => navigate(-1)}>
            <ArrowLeftIcon className='w-4 h-4' />Back
          </button>
        </div>

        <h1 className='text-[24px] font-semibold max-md:px-10 w-[400px] py-6'>Reset password</h1>
        
        <form className='w-[400px] flex flex-col max-md:px-10' onSubmit={(e) => { e.preventDefault(); handleContinue(); }}>
          <label htmlFor="email" className='text-[16px] font-medium text-gray-500'>Enter email address</label>
          <input 
            type="email" 
            name='email' 
            placeholder='enter email address' 
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError('') }}
            required
            disabled={isLoading}
            className={`max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] 
            mt-1.5 mb-6 border rounded-full ${emailError ? 'border-red-500' : 'border-gray-300'}`} 
          />
          {emailError && <p className="text-red-500 text-sm -mt-4 mb-2">{emailError}</p>}
        </form>

        <ButtonWidget text="Continue" loading={isLoading} disabled={isLoading} onClick={handleContinue} />
        
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