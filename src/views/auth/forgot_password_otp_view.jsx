import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import ButtonWidget from '../../components/button'
import OtpInput from 'react-otp-input'
import { validateOtp } from '../../lib/validation'
import toast from 'react-hot-toast'
import AuthController from '../../controllers/auth_controller'

const STORAGE_KEY_FORGOT = 'esvora-forgot-otp-endtime'

const ForgotPasswordOtpView = () => {
    const { email } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const authController = new AuthController()
    const identifier = decodeURIComponent(email ?? '')
    const [otp, setOtp] = useState('')
    const [otpError, setOtpError] = useState('')
    const [isLoadingVerify, setIsLoadingVerify] = useState(false)
    const [isLoadingResend, setIsLoadingResend] = useState(false)
    const [timer, setTimer] = useState(() => {
        const fromForgot = location.state?.fromForgotPassword
        if (fromForgot) return 60
        const stored = sessionStorage.getItem(`${STORAGE_KEY_FORGOT}-${identifier}`)
        if (!stored) return 0
        const endTime = Number(stored)
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
        return remaining
    })
    const endTimeRef = useRef(null)

    useEffect(() => {
        const fromForgot = location.state?.fromForgotPassword
        const stored = sessionStorage.getItem(`${STORAGE_KEY_FORGOT}-${identifier}`)
        if (fromForgot) {
            const endTime = Date.now() + 60 * 1000
            endTimeRef.current = endTime
            sessionStorage.setItem(`${STORAGE_KEY_FORGOT}-${identifier}`, String(endTime))
        } else if (stored) {
            const endTime = Number(stored)
            endTimeRef.current = endTime
        } else {
            endTimeRef.current = 0
        }
    }, [identifier, location.state?.fromForgotPassword])

    useEffect(() => {
        if (endTimeRef.current <= 0) return
        const getRemaining = () => Math.max(0, Math.ceil((endTimeRef.current - Date.now()) / 1000))
        const tick = () => setTimer(getRemaining())
        const interval = setInterval(tick, 1000)
        const onVisible = () => setTimer(getRemaining())
        document.addEventListener('visibilitychange', onVisible)
        return () => {
            clearInterval(interval)
            document.removeEventListener('visibilitychange', onVisible)
        }
    }, [identifier])

    const formatTimer = (seconds) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }

    const handleResendCode = () => {
        if (timer !== 0 || isLoadingResend) return
        if (!identifier) {
            toast.error('Invalid session. Please try again.')
            return
        }
        authController.forgetPassword(identifier, {
            setLoading: setIsLoadingResend,
            onSuccess: () => {
                const endTime = Date.now() + 60 * 1000
                endTimeRef.current = endTime
                sessionStorage.setItem(`${STORAGE_KEY_FORGOT}-${identifier}`, String(endTime))
                setTimer(60)
                toast.success('Code resent. Check your email.')
            },
            onError: (message) => toast.error(message),
        })
    }

    const handleContinue = () => {
        const result = validateOtp(otp)
        if (!result.valid) {
            setOtpError(result.message ?? 'Please enter the 4-digit code')
            toast.error(result.message ?? 'Please enter the 4-digit code')
            return
        }
        setOtpError('')
        if (!identifier) {
            toast.error('Invalid session. Please try again.')
            navigate('/forgot-password')
            return
        }
        authController.verifyForgotPasswordOtp(identifier, otp.trim(), {
            setLoading: setIsLoadingVerify,
            navigate,
            onError: (message) => {
                toast.error(message)
                setOtp('')
                setOtpError(message)
            },
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
                onClick={() => navigate(-1)}><ArrowLeftIcon className='w-4 h-4' />Back</button>
            </div>

            <h1 className='text-[24px] font-semibold max-md:px-10 w-[400px] py-6'>Verify account</h1>
            <p className='text-[16px] text-gray-700 font-medium w-[400px] max-md:px-10'>
                Please enter the 4 digit code sent to your email address
                <span className='font-extralight text-gray-400'> {decodeURIComponent(email ?? '')} </span>
                to proceed with resetting your password.
            </p>

            <div className='w-[400px] max-md:px-10 my-6 flex flex-col justify-start'>
            <div className={`flex justify-start otp-container ${otpError ? 'mb-2' : ''}`}>
                <OtpInput
                    value={otp}
                    onChange={(value) => {
                        setOtp(value)
                        if (otpError) setOtpError('')
                    }}
                    numInputs={4}
                    renderSeparator={<span className='w-2'></span>}
                    renderInput={(props) => <input {...props} className='otp-input' />}
                    inputStyle={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '6px',
                        border: otpError
                            ? '0.85px solid rgb(239, 68, 68)'
                            : '0.85px solid rgba(224, 224, 224, 0.6)',
                        fontSize: '20px',
                        fontWeight: '600',
                        backgroundColor: '#FFFFFF',
                        color: '#000000',
                        textAlign: 'center',
                        outline: 'none',
                        transition: 'all 0.3s ease',
                    }}
                    focusStyle={{
                        border: '0.85px solid #680093',
                        backgroundColor: '#FFFFFF',
                    }}
                    inputType="password"
                    shouldAutoFocus
                    containerStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '8px',
                    }}
                />
            </div>
            {otpError && (
                <p className="text-red-500 text-sm mb-2 max-md:px-10">{otpError}</p>
            )}
            </div>

            <p className='text-[14px] font-medium text-gray-500 w-[400px] max-md:px-10 mt-2'>
                {formatTimer(timer)}
            </p>

            <p className='text-[16px] text-gray-700 font-medium w-[400px] mt-2 mb-3 max-md:px-10'>Didn't receive any code? 
                <span 
                    onClick={handleResendCode}
                    className={`font-medium text-[16px] ml-1 ${
                        timer === 0 && !isLoadingResend
                            ? 'text-primary cursor-pointer hover:underline' 
                            : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {isLoadingResend ? 'Resending...' : 'Resend code'}
                </span>
            </p>
            <ButtonWidget
                text="Continue"
                onClick={handleContinue}
                loading={isLoadingVerify}
                disabled={isLoadingVerify}
            />
            <p className='text-[16px] text-gray-400 w-[400px] mt-3 font-extralight max-md:px-10'>
                By continuing, you agree to Esvora’s  
            <span className='text-gray-500 font-light text-[16px] ml-1 cursor-pointer'>
                Terms of Service and Privacy Policy</span></p> 
        </div>
    </>
  )
}

export default ForgotPasswordOtpView