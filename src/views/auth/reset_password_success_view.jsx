import React from 'react'
import Navbar from '../../components/navbar'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import ButtonWidget from '../../components/button'

const ResetPasswordSuccessView = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <div className='w-full h-screen md:fixed max-md:items-center max-md:justify-start
        flex items-center justify-center mt-10 px-6 lg:px-30 md:py-1 max-md:py-30 flex-col'>
        <div className='w-[500px] max-md:w-full max-md:px-6'>
          <div 
            className='bg-white rounded-2xl p-10 max-md:p-8 shadow-lg relative overflow-hidden'
          >
            <img src="src/assets/confetti.png" alt="confetti" 
                className='absolute inset-0 z-0 w-full h-[100px] object-fill' />
            <div className='flex flex-col items-center relative z-10'>
              {/* Success Icon - Large purple circle with checkmark */}
              <div className='w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-6 shadow-lg'>
                <Check className='w-10 h-10 text-white' strokeWidth={3} />
              </div>

              {/* Heading */}
              <h1 className='text-[24px] font-semibold text-gray-900 mb-4 text-center'>
                Reset successful
              </h1>

              {/* Description text */}
              <p className='text-[16px] text-gray-600 font-normal text-center mb-8 max-w-md'>
                Your request has been successfully submitted. Once approved, you'll be notified
              </p>

              {/* Continue to login button */}
              <div className='w-full flex items-center justify-center'>
                <ButtonWidget 
                  text="Continue to login" 
                  onClick={() => navigate('/login')} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResetPasswordSuccessView
