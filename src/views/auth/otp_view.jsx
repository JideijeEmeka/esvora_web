import React, { useState, useEffect } from 'react'
import Navbar from '../../components/navbar'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftIcon } from 'lucide-react'
import ButtonWidget from '../../components/button'
import OtpInput from 'react-otp-input'

const OtpView = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60); // 60 seconds countdown

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const formatTimer = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleResendCode = () => {
        if (timer === 0) {
            setTimer(60); // Reset timer to 60 seconds
            // Add your resend code logic here
            console.log('Resending code...');
        }
    };

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
                onClick={() => navigate(-1)}><ArrowLeftIcon className='w-4 h-4' />Back</button>
            </div>

            <h1 className='text-[24px] font-semibold max-md:px-10 w-[400px] py-6'>Verify account</h1>
            <p className='text-[16px] text-gray-700 font-medium w-[400px] max-md:px-10'>
                Please enter the 4 digit code sent to your email address
                <span className='font-extralight text-gray-400'> {email} </span>
                to proceed with creating your account.</p>

            <div className='w-[400px] max-md:px-10 my-6 flex justify-start otp-container'>
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={4}
                    renderSeparator={<span className='w-2'></span>}
                    renderInput={(props) => <input {...props} className='otp-input' />}
                    inputStyle={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '6px',
                        border: '0.85px solid rgba(224, 224, 224, 0.6)',
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

            <p className='text-[14px] font-medium text-gray-500 w-[400px] max-md:px-10 mt-2'>
                {formatTimer(timer)}
            </p>

            <p className='text-[16px] text-gray-700 font-medium w-[400px] mt-2 mb-3 max-md:px-10'>Didn't receive any code? 
                <span 
                    onClick={handleResendCode}
                    className={`font-medium text-[16px] ml-1 ${
                        timer === 0 
                            ? 'text-primary cursor-pointer hover:underline' 
                            : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                    Resend code
                </span>
            </p>
            <ButtonWidget text="Continue" onClick={() => navigate('/change-password')} />
            <p className='text-[16px] text-gray-400 w-[400px] mt-3 font-extralight max-md:px-10'>
                By continuing, you agree to Esvora’s  
            <span className='text-gray-500 font-light text-[16px] ml-1 cursor-pointer'>
                Terms of Service and Privacy Policy</span></p> 
        </div>
    </>
  )
}

export default OtpView