import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { Image, X, Minus } from 'lucide-react'

const AddPropertyImagesView = () => {
	const navigate = useNavigate()
	const fileInputRef = useRef(null)
	const [images, setImages] = useState([])

	const handleFileSelect = (e) => {
		const files = Array.from(e.target.files)
		const validFiles = files.filter((file) => {
			const isValidType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
			return isValidType
		})

		validFiles.forEach((file) => {
			const reader = new FileReader()
			reader.onloadend = () => {
				setImages((prev) => [
					...prev,
					{
						id: Date.now() + Math.random(),
						url: reader.result,
						file: file
					}
				])
			}
			reader.readAsDataURL(file)
		})

		// Reset input
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleRemoveImage = (id) => {
		setImages(images.filter((img) => img.id !== id))
	}

	const handleDropzoneClick = () => {
		fileInputRef.current?.click()
	}

	const handleDragOver = (e) => {
		e.preventDefault()
		e.stopPropagation()
	}

	const handleDrop = (e) => {
		e.preventDefault()
		e.stopPropagation()
		const files = Array.from(e.dataTransfer.files)
		if (files.length > 0) {
			const validFiles = files.filter((file) => {
				const isValidType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
				return isValidType
			})

			validFiles.forEach((file) => {
				const reader = new FileReader()
				reader.onloadend = () => {
					setImages((prev) => [
						...prev,
						{
							id: Date.now() + Math.random(),
							url: reader.result,
							file: file
						}
					])
				}
				reader.readAsDataURL(file)
			})
		}
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleSaveAndContinue = () => {
		// Handle form submission
		console.log('Images:', images)
		navigate('/property-owner/add-property/summary')
	}

	// Create array of 6 slots (filled + empty)
	const imageSlots = Array.from({ length: 6 }, (_, index) => {
		return images[index] || null
	})

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content */}
				<div className='flex-1 flex flex-col max-w-5xl mx-auto w-full'>
					<div className='flex flex-col lg:flex-row gap-8 lg:gap-12'>
						{/* Left Side - Image Grid */}
						<div className='flex-1'>
							<div className='grid grid-cols-2 gap-4'>
								{imageSlots.map((image, index) => (
									<div
										key={index}
										className={`aspect-square rounded-lg overflow-hidden relative ${
											image ? 'bg-gray-100' : 'bg-gray-50 border-2 border-dashed border-gray-200'
										}`}
									>
										{image ? (
											<>
												<img
													src={image.url}
													alt={`Property ${index + 1}`}
													className='w-full h-full object-cover'
												/>
												<button
													type='button'
													onClick={() => handleRemoveImage(image.id)}
													className='absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-md transition-colors'
												>
													<Minus className='w-4 h-4 text-gray-700' />
												</button>
											</>
										) : (
											<div className='w-full h-full flex items-center justify-center'>
												<div className='text-gray-300'>
													<Image className='w-12 h-12' />
												</div>
											</div>
										)}
									</div>
								))}
							</div>
						</div>

						{/* Right Side - Upload Section */}
						<div className='flex-1 lg:max-w-md'>
							{/* Progress Indicator */}
							<div className='flex items-center gap-2 mb-8'>
								<div className='h-2 w-16 bg-primary rounded-full' />
								<div className='h-2 w-16 bg-primary rounded-full' />
								<div className='h-1 flex-1 bg-gray-200 rounded-full' />
							</div>

							{/* Heading */}
							<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
								Add Images
							</h1>

							{/* Upload Dropzone */}
							<div
								onClick={handleDropzoneClick}
								onDragOver={handleDragOver}
								onDrop={handleDrop}
								className='border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 hover:bg-gray-50/50 transition-all mb-4'
							>
								<input
									ref={fileInputRef}
									type='file'
									multiple
									accept='image/jpeg,image/png'
									onChange={handleFileSelect}
									className='hidden'
								/>
								<div className='flex flex-col items-center gap-3'>
									<div className='w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center'>
										<Image className='w-8 h-8 text-gray-400' />
									</div>
									<p className='text-[16px] text-gray-700 font-medium'>
										Click to add images
									</p>
								</div>
							</div>

							{/* Requirements Text */}
							<p className='text-[14px] text-gray-600 mb-8'>
								Minimum of 4 images |{' '}
								<span className='text-primary font-medium'>Accept Jpeg or PNGs or JPG</span>
							</p>

							{/* Action Buttons */}
							<div className='flex gap-4 mt-8'>
								<button
									type='button'
									onClick={handleBack}
									className='flex-1 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-[18px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all'
								>
									Back
								</button>
								<button
									type='button'
									onClick={handleSaveAndContinue}
									// disabled={images.length < 4}
									className='flex-1 bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
								>
									Save & continue
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default AddPropertyImagesView
