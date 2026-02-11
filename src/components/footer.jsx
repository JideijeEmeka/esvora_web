import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'
import facebook from '../assets/icons/facebook.png'
import instagram from '../assets/icons/instagram.png'
import linkedin from '../assets/icons/linkedin.png'
import xTwitter from '../assets/icons/x_twitter.png'
import tiktok from '../assets/icons/tiktok.png'
import whatsapp from '../assets/icons/whatsapp.png'	
import playstore from '../assets/playstore.png'
import apple from '../assets/apple.png'
import qrCode from '../assets/qr_code.png'

const Footer = () => {
	return (
		<footer className='border-t border-gray-200 mt-10 max-md:mt-0'>
			<div className='mt-12'>
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 max-md:grid-cols-2 mb-8 px-6 md:px-16 lg:px-20'>
					{/* Service */}
					<div>
						<h3 className='text-[18px] font-semibold text-gray-900 mb-4'>Services</h3>
						<ul className='space-y-2'>
							<li><Link to="/rent" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Rent</Link></li>
							<li><Link to="/buy" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Buy</Link></li>
							<li><Link to="/shortlet" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Shortlet</Link></li>
							<li><Link to="/listing" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Listing</Link></li>
						</ul>
					</div>

					{/* Legal */}
					<div className='md:-ml-16'>
						<h3 className='text-[18px] font-semibold text-gray-900 mb-4'>Legal</h3>
						<ul className='space-y-2'>
							<li><Link to="/privacy" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Privacy policy</Link></li>
							<li><Link to="/terms" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Terms and Condition</Link></li>
							<li><Link to="/cookies" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Cookies</Link></li>
							<li><Link to="/refund" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Refund policy</Link></li>
							<li><Link to="/help" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Help centers</Link></li>
							<li><Link to="/satisfaction" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Customer satisfaction</Link></li>
						</ul>
					</div>

					{/* Company */}
					<div className='md:-ml-16 max-md:py-8'>
						<h3 className='text-[18px] font-semibold text-gray-900 mb-4'>Company</h3>
						<ul className='space-y-2'>
							<li><Link to="/about" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>About us</Link></li>
							<li><Link to="/teams" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Teams</Link></li>
							<li><Link to="/agents" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Our Agent</Link></li>
							<li><Link to="/career" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Career</Link></li>
							<li><Link to="/contact" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Contact us</Link></li>
						</ul>
					</div>

					{/* Socials */}
					<div className='md:-ml-16 max-md:py-8'>
						<h3 className='text-[18px] font-semibold text-gray-900 mb-4'>Socials</h3>
						<ul className='space-y-2'>
							<li><Link to="/linkedin" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>LinkedIn</Link></li>
							<li><Link to="/twitter" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>X (Formerly twitter)</Link></li>
							<li><Link to="/instagram" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Instagram</Link></li>
							<li><Link to="/tiktok" className='text-[16px] text-gray-600 hover:text-primary transition-colors'>Tiktok</Link></li>
						</ul>
					</div>

					{/* App Download */}
					<div className='flex bg-white p-4 w-[400px] max-md:w-[350px] md:-ml-25 rounded-lg shadow-md border border-gray-300'>
						<div className='flex flex-col gap-2'>
							<h3 className='text-[18px] font-semibold text-gray-900 mb-2'>Stay connected with us all the time.</h3>
							<p className='text-[16px] text-gray-600 mb-4'>Download the esvora App today.</p>
							<div className='flex gap-3'>
								<button className='flex items-center gap-2 px-2.5 py-1.5 bg-gray-200 rounded-sm hover:bg-gray-800 transition-colors'>
									<img src={playstore} alt="google-play" className='w-5 h-5' />
								</button>
								<button className='flex items-center gap-2 px-2.5 py-1.5 bg-gray-200 rounded-sm hover:bg-gray-800 transition-colors'>
									<img src={apple} alt="google-play" className='w-5 h-5' />
								</button>
							</div>
						</div>
						<img src={qrCode} alt="app" className='w-1/2 h-auto' />
					</div>
				</div>

				{/* Bottom Footer */}
				<div className='border-t bg-gray-50 border-gray-200 pt-8 mt-8 px-6 md:px-16 lg:px-20'>
					<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4'>
						<div className='flex flex-col items-start gap-2 mb-4 max-md:mb-0'>
							<img src={logo} alt="esvora" className='w-24 h-auto' />
							<p className='text-[14px] text-gray-600 py-4'>© 2025 esvoragroup. All rights reserved.</p>
						</div>
						<div className='flex items-center gap-4 max-md:mb-4'>
							<Link to="/linkedin" className='text-gray-600 hover:text-primary transition-colors'>
								<img src={linkedin} alt="linkedin" className='w-5 h-5' />
							</Link>
							<Link to="/instagram" className='text-gray-600 hover:text-primary transition-colors'>
								<img src={instagram} alt="instagram" className='w-5 h-5' />
							</Link>
							<Link to="/twitter" className='text-gray-900 hover:text-primary transition-colors'>
								<img src={xTwitter} alt="twitter" className='w-5 h-5' />
							</Link>
							<Link to="/tiktok" className='text-gray-900 hover:text-primary transition-colors'>
								<img src={tiktok} alt="tiktok" className='w-5 h-5' />
							</Link>
							<Link to="/whatsapp" className='text-gray-600 hover:text-primary transition-colors'>
								<img src={whatsapp} alt="whatsapp" className='w-5 h-5' />
							</Link>
							<Link to="/facebook" className='text-gray-600 hover:text-primary transition-colors'>
								<img src={facebook} alt="facebook" className='w-5 h-5' />
							</Link>
						</div>
					</div>
					<p className='text-[14px] text-gray-600 max-w-4xl'>
						Our mission is to simplify property discovery, empower home ownership, and support sustainable real estate growth in Nigeria.
					</p>
					<p className='text-[14px] text-gray-600 mt-2 pb-4'>
						For inquiries, please contact us at +234 (0)1-XXX-XXXX or email support@esvora.ng.
					</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
