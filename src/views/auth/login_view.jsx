import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ButtonWidget from '../../components/button'
import { Eye, EyeOff } from 'lucide-react'
import { validateEmail } from '../../lib/validation'
import toast from 'react-hot-toast'
import AuthController from '../../controllers/auth_controller'
import bgImage from '../../assets/bg.png'

const LoginView = () => {
  const navigate = useNavigate()
  const authController = new AuthController()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    const emailResult = validateEmail(email)
    const passwordTrimmed = (password ?? '').trim()
    const passwordError = !passwordTrimmed ? 'Password is required' : ''

    const newErrors = {
      email: emailResult.valid ? '' : (emailResult.message ?? ''),
      password: passwordError,
    }
    setErrors(newErrors)

    if (!emailResult.valid || passwordError) {
      toast.error('Please fix the errors before continuing')
      return
    }

    authController.login(email.trim(), passwordTrimmed, {
      setLoading: setIsLoading,
      navigate,
      onError: (message) => {
        toast.error(message)
        setPassword('')
        setErrors((prev) => ({ ...prev, password: message }))
      },
    })
  }

  return (
    <>
      <div className='w-full h-screen md:fixed max-md:items-center max-md:justify-start
        flex items-center justify-center px-6 md:px-16 lg:px-20 pt-4 pb-8 md:flex-row flex-col'>
        <div className='w-1/2 flex flex-col items-center'>
          <img src={bgImage} alt="login" 
            className='w-100 h-auto max-md:w-[400px]'/>
          <h1 className='text-[30px] font-semibold w-[440px] py-6 max-md:text-[23px] 
            max-md:w-[400px] max-md:text-center max-md:px-10'>
            Rent, Buy, Sell and list Properties with ease across Nigeria </h1>
        </div>

        {/* Login form */}
        <div className='flex flex-col mr-20 max-md:mr-0'>
          <h2 className='text-[24px] font-semibold md:mb-6 max-md:px-10'>Log in</h2>
          
          <form className='w-90 flex flex-col max-md:px-10' onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <label htmlFor="email" className='text-[16px] font-medium text-gray-500'>Email address</label>
            <input
              type="email"
              name="email"
              placeholder="enter email address"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
              }}
              className={`max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] mt-1 mb-1 border rounded-full ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email}</p>}

            <label htmlFor="password" className='text-[16px] font-medium text-gray-500'>Password</label>
            <div className='relative mt-1 mb-1 max-md:w-[320px] max-md:mx-auto'>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="**********"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }))
                }}
                className={`w-full px-4 py-2.5 text-[16px] border rounded-full pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
              >
                {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}

            <Link
              to="/forgot-password"
              className='text-primary text-[14px] font-medium mb-4 max-md:w-[320px] max-md:mx-auto underline'
            >
              Forgot your password?
            </Link>
          </form>

          <ButtonWidget
            text="Continue"
            onClick={handleLogin}
            loading={isLoading}
            disabled={isLoading}
          />
          
          <div className='mb-5 flex items-start justify-start max-md:items-center max-md:justify-center'>
            <p className='text-[16px] font-medium text-gray-700'>Don't have an account?</p>
            <Link to="/sign-up" className='text-primary font-semibold text-[16px] ml-2'>Sign up</Link>
          </div>
          
          <div className='max-md:flex max-md:justify-center max-md:items-center max-md:mb-8'>
            <p className='text-[16px] text-gray-500 max-md:text-center'>By continuing, you agree to Esvora's
              <Link to="/terms" className='text-gray-700 font-semibold text-[16px] ml-1'>Terms of Service </Link> 
              and<Link to="/privacy" className='text-gray-700 font-semibold text-[16px] ml-1'>Privacy Policy</Link></p>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginView