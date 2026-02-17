import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import shortletImage from '../assets/shortlet.png'

const AddShortletView = () => {
	const navigate = useNavigate()

	const handleListShortlet = () => {
		navigate('/property-owner/add-shortlet/basic-info')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content */}
				<div className='flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 max-w-7xl mx-auto w-full'>
					{/* Left Side - Image Collage */}
					<div className='flex-1 relative w-full md:w-1/2 h-[500px] md:h-[600px]'>
						<img
							src={shortletImage}
							alt='Shortlet property collage'
							className='w-full h-full object-contain'
						/>
					</div>

					{/* Right Side - Call to Action */}
					<div className='flex-1 w-full md:w-1/2 flex items-center flex-col justify-center'>
						{/* Heading */}
						<h1 className='text-[40px] md:text-[48px] font-bold text-gray-900 mb-6'>
							List a shortlet
						</h1>

						{/* Description */}
						<p className='text-[18px] md:text-[20px] text-center text-gray-600 mb-8 leading-relaxed'>
							Control your shortlet portfolio; add, edit and list properties quickly.
						</p>

						{/* List Shortlet Button */}
						<button
							type='button'
							onClick={handleListShortlet}
							className='w-full max-w-md bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
						>
							List a shortlet
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddShortletView
