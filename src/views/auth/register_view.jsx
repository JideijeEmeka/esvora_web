import React from 'react'
import Navbar from '../../components/navbar'
import { useState } from 'react'
import { Country } from 'country-state-city';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { Link, useNavigate } from 'react-router-dom';
import ButtonWidget from '../../components/button'


const RegisterView = () => {

    const [countries, setCountries] = useState(Country.getAllCountries());
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [phoneNumber, setPhoneNumber] = useState('');
    
    const handleCountryChange = (country) => {
        setSelectedCountry(country);
    }
    const navigate = useNavigate();

  return (
    <>
        <Navbar />
        <div className='w-full h-screen md:fixed max-md:items-center max-md:justify-start
          flex items-center justify-center px-6 md:px-16 lg:px-20 md:py-110 max-md:py-30 md:flex-row flex-col'>
            <div className='w-1/2 flex flex-col items-center'>
             <img src="src/assets/bg.png" alt="register" 
                className='w-100 h-auto max-md:w-[400px]'/>
             <h1 className='text-[30px] font-semibold w-[440px] py-6 max-md:text-[23px] 
                  max-md:w-[400px] max-md:text-center max-md:px-10'>
                Rent, Buy, Sell and list Properties with ease across Nigeria </h1>
            </div>

            {/* Signup form */}
            <div className='flex flex-col mr-20 max-md:mr-0'>
                <h2 className='text-[24px] font-semibold max-md:px-10'>Sign up</h2>
                <button className='bg-white px-6 py-1.5 text-[16px] mb-6 mt-2
                max-md:w-80 max-md:mx-auto max-md:mt-2 max-md:mb-6 max-md:text-[14px] text-gray-700
                flex items-center justify-center gap-2 hover:bg-primary/80 hover:scale-105 border border-gray-300
                transition rounded-full w-90 font-medium hover:text-white cursor-pointer'>
                <img src="src/assets/google.png" alt="google" className='w-4 h-4' />
                Continue with your Google account</button>
                <form className='w-90 flex flex-col max-md:px-10 mb-3'>
                    <label htmlFor="email" className='text-[16px] font-medium'>Email address</label>
                    <input type="email" name='email' placeholder='enter email address' required
                    className='w-full max-md:w-[320px] max-md:mx-auto px-4 py-2.5 text-[16px] mt-1 mb-4 border border-gray-300 rounded-full' />
                    
                    <label htmlFor="Country" className='text-[16px] font-medium'>Country</label>
                    <select className='form-select w-full px-4 py-2.5 text-[16px] mt-1 mb-4 border
                     border-gray-300 rounded-full max-md:w-[320px] max-md:mx-auto'
                     onChange={(e) => handleCountryChange(
                        countries.find(country => country.isoCode === e.target.value))}>
                        <option value="">Select Country</option>
                        {countries.map((country) => (
                            <option key={country.isoCode} value={country.isoCode}>{country.name}</option>
                        ))}
                    </select>

                    <label htmlFor="Phone" className='text-[16px] font-medium'>Phone number</label>
                    <div className='mt-1 mb-4 max-md:w-[320px] max-md:mx-auto'>
                        <PhoneInput
                            international
                            defaultCountry="NG"
                            value={phoneNumber}
                            onChange={(value) => setPhoneNumber(value)}
                            placeholder="1234 5678 90"
                            className="phone-input-container"
                        />
                    </div>
                </form>

                <ButtonWidget text="Continue" onClick={() => navigate('/otp')} />
                <div className='mb-5 flex items-start justify-start max-md:items-center max-md:justify-center'>
                    <p className='text-[16px] font-medium text-gray-700'>Already have an account?</p>
                        <Link to="/login" className='text-primary font-semibold text-[16px] ml-2'>Sign In</Link>
                </div>
                <div className='max-md:flex max-md:justify-center max-md:items-center max-md:mb-8'>
                <p className='text-[16px] text-gray-500 max-md:text-center'>By continuing, you agree to esvora's
                    <Link to="/terms" className='text-gray-700 font-semibold text-[16px] ml-1'>Terms of Service </Link> 
                    and<Link to="/privacy" className='text-gray-700 font-semibold text-[16px] ml-1'>Privacy Policy</Link></p>
                </div>
            </div>
        </div>
    </>
  )
}

export default RegisterView