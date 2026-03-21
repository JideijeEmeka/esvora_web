import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import ButtonWidget from '../../components/button'
import { CheckIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { validatePassword, validateCreatePassword } from '../../lib/validation'
import AuthController from '../../controllers/auth_controller'

const ResetPasswordView = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { identifier, otp } = location.state ?? {}
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const authController = new AuthController()

    useEffect(() => {
        if (!identifier || !otp) {
            toast.error('Session expired. Please request a new reset link.')
            navigate('/forgot-password')
        }
    }, [identifier, otp, navigate])

    const { hasMoreThan6Chars, hasLetter, hasNumber, hasSpecialChar } = validatePassword(password)

    const handleReset = (e) => {
        e?.preventDefault?.()
        if (!identifier || !otp) return
        const result = validateCreatePassword(password, confirmPassword)
        if (!result.valid) {
            setPasswordError(result.message ?? 'Please fix the errors')
            toast.error(result.message ?? 'Please fix the errors')
            return
        }
        setPasswordError('')
        authController.resetPassword(identifier, otp, password.trim(), confirmPassword.trim(), {
            setLoading: setIsLoading,
            navigate,
            onError: (message) => {
                toast.error(message)
                setPasswordError(message)
            },
        })
    }
    
  return (
    <>
        <div className='w-full h-screen md:fixed max-md:items-center max-md:justify-start
          flex items-center justify-center px-6 lg:px-30 pt-4 pb-8 flex-col'>
            <div className='w-[400px] max-md:w-full max-md:px-7 flex items-start justify-start'>
                <button className='bg-white text-gray-700 px-3 py-1.5 text-[14px] 
                mb-2
                flex items-center gap-2 hover:bg-primary/80 hover:scale-105 border border-gray-300
                transition rounded-full font-semibold hover:text-white cursor-pointer' 
                onClick={() => navigate(-1)}><ArrowLeftIcon className='w-4 h-4' />Back</button>
            </div>

            <h1 className='text-[24px] font-semibold max-md:px-10 w-[400px] py-6'>Set new password</h1>
            <p className='text-[16px] text-gray-700 font-medium w-[400px] max-md:px-10 -mt-4 mb-4'>
                Enter your new password below.
            </p>
            <form className='w-[400px] flex flex-col max-md:px-10' onSubmit={(e) => { e.preventDefault(); handleReset(); }}>
              <label htmlFor="password" className='text-[16px] 
                     font-medium text-gray-500'>Enter password</label>
              <input 
                      type="password" 
                      name='password' 
                      placeholder='Enter new password' 
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (passwordError) setPasswordError('') }}
                      disabled={isLoading}
                      className={`max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] 
                      mt-1.5 mb-5 border rounded-full required ${passwordError ? 'border-red-500' : 'border-gray-300'}`} />
              <label htmlFor="re-enter_password" className='text-[16px] 
                     font-medium text-gray-500'>Re-enter password</label>
              <input 
                      type="password" 
                      name='re-enter-password' 
                      placeholder='Re-enter new password' 
                      value={confirmPassword}
                      onChange={(e) => { setConfirmPassword(e.target.value); if (passwordError) setPasswordError('') }}
                      disabled={isLoading}
                      className={`max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] 
                      mt-1.5 mb-4 border rounded-full required ${passwordError ? 'border-red-500' : 'border-gray-300'}`} />
              {passwordError && <p className="text-red-500 text-sm mb-4">{passwordError}</p>}
            </form>
            <p className='text-[14px] text-gray-700 w-[400px] mb-3 font-medium max-md:px-10'>
                Your password must contain
            </p>
            <div className='w-[400px] flex flex-col max-md:px-10 mb-4'>
              <div className='w-full flex items-center gap-2'>
                 <CheckIcon className={`w-3.5 h-3.5 px-0.5 py-0.5 rounded-full ${
                   hasMoreThan6Chars ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300'
                 }`} /> 
                 <p className={`text-[14px] font-medium ${
                   hasMoreThan6Chars ? 'text-gray-700' : 'text-gray-600'
                 }`}>More than 6 character</p>
              </div>
              <div className='w-full flex items-center gap-2'>
                <CheckIcon className={`w-3.5 h-3.5 px-0.5 py-0.5 rounded-full ${
                  hasLetter ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`} /> 
                <p className={`text-[14px] font-medium ${
                  hasLetter ? 'text-gray-700' : 'text-gray-600'
                }`}>At least one Letter</p>
              </div>
              <div className='w-full flex items-center gap-2'>
                <CheckIcon className={`w-3.5 h-3.5 px-0.5 py-0.5 rounded-full ${
                  hasNumber ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`} /> 
                <p className={`text-[14px] font-medium ${
                  hasNumber ? 'text-gray-700' : 'text-gray-600'
                }`}>At least one Number</p>
              </div>
              <div className='w-full flex items-center gap-2'>
                <CheckIcon className={`w-3.5 h-3.5 px-0.5 py-0.5 rounded-full ${
                  hasSpecialChar ? 'bg-primary text-white' : 'bg-white text-gray-700 border border-gray-300'
                }`} /> 
                <p className={`text-[14px] font-medium ${
                  hasSpecialChar ? 'text-gray-700' : 'text-gray-600'
                }`}>At least one Special Character</p>
              </div>
            </div>

            <ButtonWidget text="Reset password" loading={isLoading} disabled={isLoading || !identifier || !otp} onClick={handleReset} />
            <p className='text-[16px] text-gray-400 w-[400px] mt-2 font-extralight max-md:px-10'>
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

export default ResetPasswordView
