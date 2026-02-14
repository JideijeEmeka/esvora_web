import React, { useEffect, useState } from 'react'
import { X, Link2 } from 'lucide-react'
import Divider from './divider'
import { Link } from 'react-router-dom'
import linkedinIcon from '../assets/icons/linkedin.png'
import instagramIcon from '../assets/icons/instagram.png'
import xTwitterIcon from '../assets/icons/x_twitter.png'
import tiktokIcon from '../assets/icons/tiktok.png'
import whatsappIcon from '../assets/icons/whatsapp.png'
import facebookIcon from '../assets/icons/facebook.png'

const SharePropertyWidget = ({ isOpen, onClose, property }) => {
	const [copied, setCopied] = useState(false)

	// Prevent body scroll when modal is open (same pattern as filter_properties_widget)
	useEffect(() => {
		if (isOpen) {
			const originalOverflow = document.body.style.overflow
			const originalPosition = document.body.style.position
			const originalTop = document.body.style.top
			const scrollY = window.scrollY

			document.body.style.overflow = 'hidden'
			document.body.style.position = 'fixed'
			document.body.style.top = `-${scrollY}px`
			document.body.style.width = '100%'

			return () => {
				document.body.style.overflow = originalOverflow || ''
				document.body.style.position = originalPosition || ''
				document.body.style.top = originalTop || ''
				document.body.style.width = ''
				window.scrollTo(0, scrollY)
			}
		}
	}, [isOpen])

	const image = property?.images?.[0] ?? property?.image ?? ''
	const price = property?.price ?? ''
	const description = property?.title ?? property?.description ?? ''
	const location = property?.location ?? property?.fullAddress ?? ''

	const handleCopyLink = (e) => {
		e.preventDefault()
		const url = window.location.href
		navigator.clipboard?.writeText(url).then(() => {
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		})
	}

	if (!isOpen) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm'
			onClick={onClose}
		>
			<div
				className='bg-white rounded-2xl shadow-2xl w-[821px] overflow-hidden'
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between p-6'>
					<h2 className='text-[32px] font-semibold text-gray-900'>Share property</h2>
					<button
						type='button'
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full 
						   hover:bg-gray-100 transition-colors'
					>
						<X className='w-5 h-5 text-gray-700' />
					</button>
				</div>

				{/* Property preview */}
				<div className='p-6'>
					<div className='flex gap-4 mb-6'>
						<div className='shrink-0 w-[200px] h-[120px] rounded-2xl overflow-hidden bg-gray-100'>
							{image ? (
								<img
									src={image}
									alt={description}
									className='w-full h-full object-cover'
								/>
							) : (
								<div className='w-full h-full flex items-center justify-center text-gray-400 text-[12px]'>No image</div>
							)}
						</div>
						<div className='min-w-0 flex-1'>
							<p className='text-[20px] font-bold text-gray-900'>{price}</p>
							<p className='text-[14px] text-gray-700 mt-1'>{description}</p>
							<p className='text-[14px] text-gray-500 mt-1'>{location}</p>
							<Divider className='my-4' />
							{/* Sharing options */}
							<div className='flex items-center gap-2'>
								<div className='flex flex-wrap items-center gap-6'>
									<Link to="/linkedin" className='text-gray-600 hover:text-primary 
									   transition-colors flex items-center gap-2'>
									  <img src={linkedinIcon} alt="linkedin" className='w-5 h-5' />
									  LinkedIn
									</Link>
									<Link to="/instagram" className='text-gray-600 hover:text-primary 
									   transition-colors flex items-center gap-2'>
										<img src={instagramIcon} alt="instagram" className='w-5 h-5' />
										Instagram
									</Link>
									
									<Link to="/twitter" className='text-gray-900 flex items-center gap-2
									     hover:text-primary transition-colors'>
										<img src={xTwitterIcon} alt="twitter" className='w-5 h-5' />
										X (formerly twitter)
									</Link>
									<Link to="/tiktok" className='text-gray-900 flex items-center gap-2
									     hover:text-primary transition-colors'>
										<img src={tiktokIcon} alt="tiktok" className='w-5 h-5' />
										Tiktok
									</Link>
									<Link to="/whatsapp" className='text-gray-600 flex items-center gap-2
									     hover:text-primary transition-colors'>
										<img src={whatsappIcon} alt="whatsapp" className='w-5 h-5' />
										Whatsapp
									</Link>
									<Link to="/facebook" className='text-gray-600 flex items-center gap-2
									     hover:text-primary transition-colors'>
										<img src={facebookIcon} alt="facebook" className='w-5 h-5' />
										Facebook
									</Link>
								</div>
							</div>
							<div className='flex items-center gap-2 hover:cursor-pointer
							    hover:text-primary transition-colors hover:underline mt-6' 
							      onClick={handleCopyLink}>
								<Link2 className='w-5 h-5 text-primary shrink-0 rotate-45' />
								<span className='text-[16px] text-primary font-medium'>
									{copied ? 'Link copied!' : 'Copy property link'}</span>
							</div>
						</div>
					</div>
					
				</div>
			</div>
		</div>
	)
}

export default SharePropertyWidget
