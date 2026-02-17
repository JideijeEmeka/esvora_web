import React from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { X } from 'lucide-react'
import listingsImage from '../assets/listings.png'

const AddPropertyView = () => {
	const navigate = useNavigate()

	const handleClose = () => {
		navigate('/property-owner')
	}

	const handleAddProperty = () => {
		navigate('/property-owner/add-property/basic-info')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content */}
				<div className='flex-1 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-20 max-w-7xl mx-auto w-full'>
					{/* Left Side - Image Collage */}
					<div className='flex-1 relative w-full md:w-1/2 h-[500px] md:h-[600px]'>
						<img
							src={listingsImage}
							alt='Property listings collage'
							className='w-full h-full object-contain'
						/>
						{/* Fast Tag Overlay */}
						<div className='absolute bottom-20 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-6 py-3 rounded-xl shadow-lg'>
							<span className='text-[18px] font-bold'>Fast!</span>
						</div>
					</div>

					{/* Right Side - Call to Action */}
					<div className='flex-1 w-full md:w-1/2 flex items-center flex-col justify-center'>

						{/* Heading */}
						<h1 className='text-[40px] md:text-[48px] font-bold text-gray-900 mb-6'>
							Rent out a space
						</h1>

						{/* Description */}
						<p className='text-[18px] md:text-[20px] text-center text-gray-600 mb-8 leading-relaxed'>
							Turn your property into income. List your space, set your terms, and start hosting today.
						</p>

						{/* Add Property Button */}
						<button
							type='button'
							onClick={handleAddProperty}
							className='w-full max-w-md bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
						>
							Add a property
						</button>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddPropertyView
