import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import Loader from '../components/loader'
import propertyController from '../controllers/property_controller'
import { selectLandlordProperties } from '../redux/slices/propertySlice'
import { normalizeProperties } from '../lib/propertyUtils'
import { Home, Clock, FileText, ChevronLeft, ChevronRight, MapIcon, Pencil, ShieldCheck, X } from 'lucide-react'
import { selectCurrentAccount } from '../redux/slices/accountSlice'

const toStatusLabel = (p) => {
	const t = (p.property_type ?? p.propertyType ?? p.status ?? '').toString().toLowerCase()
	if (t.includes('shortlet')) return 'Shortlet'
	if (t.includes('sale') || t.includes('buy')) return 'Sale'
	return 'Rent'
}

const SAMPLE_PROPERTIES = [
	{
		id: 1,
		image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
		price: '₦120,500',
		description: '4 bedroom modern bungalow apartment',
		location: 'Ikoyi, Lagos, Nigeria',
		status: 'Rent'
	},
	{
		id: 2,
		image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
		price: '₦95,000',
		description: '3 bedroom luxury apartment',
		location: 'Victoria Island, Lagos, Nigeria',
		status: 'Shortlet'
	},
	{
		id: 3,
		image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
		price: '₦150,000',
		description: '5 bedroom detached house',
		location: 'Lekki, Lagos, Nigeria',
		status: 'Sale'
	},
	{
		id: 4,
		image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400',
		price: '₦80,000',
		description: '2 bedroom cozy apartment',
		location: 'Surulere, Lagos, Nigeria',
		status: 'Rent'
	},
	{
		id: 5,
		image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400',
		price: '₦110,000',
		description: '3 bedroom modern townhouse',
		location: 'Gbagada, Lagos, Nigeria',
		status: 'Shortlet'
	}
]

const PropertyOwnerCard = ({ property, onViewDetails, onEdit }) => {
	const getStatusColor = (status) => {
		switch (status) {
			case 'Rent':
				return 'bg-blue-100 text-blue-700'
			case 'Shortlet':
				return 'bg-purple-100 text-purple-700'
			case 'Sale':
				return 'bg-green-100 text-green-700'
			default:
				return 'bg-gray-100 text-gray-700'
		}
	}

	return (
		<div
			className='shrink-0 w-[280px] bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer relative'
			onClick={onViewDetails}
		>
			<div className='relative'>
				<img
					src={property.image}
					alt={property.description}
					className='w-full h-[200px] object-cover'
				/>
				{property.status && (
					<div
						className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-medium ${getStatusColor(
							property.status
						)}`}
					>
						{property.status}
					</div>
				)}
				{onEdit && (
					<button
						type='button'
						onClick={(e) => {
							e.stopPropagation()
							onEdit(property.id)
						}}
						className='absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors'
						aria-label='Edit listing'
					>
						<Pencil className='w-4 h-4' />
					</button>
				)}
			</div>
			<div className='p-4'>
				<p className='text-[20px] font-semibold text-gray-900 mb-2'>
					{typeof property.price === 'string' ? property.price : (property.price?.total != null ? `₦${Number(property.price.total).toLocaleString()}` : '—')}
				</p>
				<p className='text-[14px] font-medium text-gray-700 mb-2 line-clamp-2'>
					{property.description}
				</p>
				<div className='flex items-center gap-1'>
					<MapIcon className='w-4 h-4 text-gray-500' />
					<p className='text-[14px] text-gray-500'>{property.location}</p>
				</div>
			</div>
		</div>
	)
}

const PropertyOwnerView = () => {
	const navigate = useNavigate()
	const propertiesRef = useRef(null)
	const account = useSelector(selectCurrentAccount)
	const [showKycBanner, setShowKycBanner] = useState(true)
	const landlordPropertiesRaw = useSelector(selectLandlordProperties)
	const hasCachedData = Array.isArray(landlordPropertiesRaw) && landlordPropertiesRaw.length > 0
	const [isLoading, setIsLoading] = useState(!hasCachedData)
	const landlordProperties = normalizeProperties(landlordPropertiesRaw) ?? []
	const displayProperties = landlordProperties.length > 0
		? landlordProperties.map((p) => ({ ...p, status: toStatusLabel(p) }))
		: SAMPLE_PROPERTIES

	const scrollProperties = (ref, direction) => {
		if (!ref?.current) return
		const amount = 296
		ref.current.scrollBy({
			left: direction === 'right' ? amount : -amount,
			behavior: 'smooth'
		})
	}

	const handleViewDetails = (propertyId) => {
		sessionStorage.setItem('activeTab', 'property-owner')
		navigate(`/property-details/${propertyId}`, { state: { fromLandlordDashboard: true } })
	}

	const handleEditListing = (propertyId) => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'listings')
		navigate(`/property-owner/listings/edit/${propertyId}`)
	}

	useEffect(() => {
		sessionStorage.setItem('activeTab', 'property-owner')
	}, [])

	useEffect(() => {
		if (!hasCachedData) setIsLoading(true)
		propertyController.listLandlordProperties({
			forceRefetch: false,
			onSuccess: () => setIsLoading(false),
			onError: () => setIsLoading(false)
		})
	}, [])

	const showKycStrip = Boolean(account && !account.is_kyc_verified && showKycBanner)

	const renderKycBannerCard = () => (
		<div
			className='bg-primary rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer shadow-lg max-w-7xl mx-auto'
			onClick={() => navigate('/kyc')}
		>
			<div className='flex items-center gap-3'>
				<ShieldCheck className='w-5 h-5 text-white shrink-0' />
				<div>
					<p className='text-white font-semibold text-[15px]'>KYC Verification</p>
					<p className='text-white/80 text-[13px]'>Complete your verification to enjoy full access.</p>
				</div>
			</div>
			<button
				type='button'
				onClick={(e) => {
					e.stopPropagation()
					setShowKycBanner(false)
				}}
				className='text-white/80 hover:text-white transition-colors p-1 shrink-0 cursor-pointer'
			>
				<X className='w-5 h-5' />
			</button>
		</div>
	)

		return (
		<>
			<PropertyOwnerNavbar />
			{showKycStrip && (
				<>
					<div className='md:hidden mt-20 sticky top-20 z-40 px-4 pt-2 pb-3 bg-gray-50 border-b border-gray-100'>
						{renderKycBannerCard()}
					</div>
					<div className='hidden md:block fixed top-20 left-0 right-0 z-40 px-4 md:px-8 pt-4'>
						{renderKycBannerCard()}
					</div>
				</>
			)}
			{/* Hero Section - no overflow-hidden so cards below can show */}
			<div className={`relative w-full mt-20 ${showKycStrip ? 'max-md:mt-0' : ''}`}>
				<div className='relative w-full h-[420px] max-md:h-[360px] overflow-hidden'>
					<div
						className='absolute inset-0 bg-cover bg-center'
						style={{
							backgroundImage:
								'url(https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=1200)',
							filter: 'brightness(0.7)'
						}}
					/>
					<div className='absolute inset-0 bg-black/30' />
					<div className='relative z-10 h-full flex flex-col items-center justify-center px-6'>
						<h1 className='text-[48px] max-md:text-[36px] font-bold text-white mb-8 text-center'>
							List your properties and make money
						</h1>
					</div>
				</div>

				{/* Property Type Cards - Below hero, overlapping with negative margin */}
				<div className='relative z-20 -mt-16 max-md:-mt-12 px-6 md:px-16 lg:px-20'>
					<div className='flex flex-wrap justify-center gap-6'>
						<button
							type='button'
							onClick={() => navigate('/property-owner/listings')}
							className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-[280px] w-full hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center gap-4'
						>
							<div className='w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0'>
								<Home className='w-10 h-10 text-primary' />
							</div>
							<span className='text-[18px] font-medium text-gray-900'>
								For Rent
							</span>
						</button>
						<button
							type='button'
							onClick={() => navigate('/property-owner/shortlet')}
							className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-[280px] w-full hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center gap-4'
						>
							<div className='w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0'>
								<Clock className='w-10 h-10 text-primary' />
							</div>
							<span className='text-[18px] font-medium text-gray-900'>
								Shortlet
							</span>
						</button>
						<button
							type='button'
							onClick={() => navigate('/property-owner/sale')}
							className='bg-white rounded-xl shadow-lg border border-gray-200 p-8 max-w-[280px] w-full hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer flex flex-col items-center gap-4'
						>
							<div className='w-20 h-20 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center shrink-0'>
								<FileText className='w-10 h-10 text-primary' />
							</div>
							<span className='text-[18px] font-medium text-gray-900'>
								For Sale
							</span>
						</button>
					</div>
				</div>
			</div>

			<div className='pb-10 px-6 md:px-16 lg:px-20 mt-24 max-md:mt-20'>
				{/* My Properties Section */}
				<div className='mb-12'>
					<div className='flex items-center justify-between mb-6'>
						<h2 className='text-[24px] font-semibold text-gray-900'>
							My properties
						</h2>
						<div className='flex items-center gap-2'>
							<button
								onClick={() => scrollProperties(propertiesRef, 'left')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronLeft className='w-5 h-5 text-gray-700' />
							</button>
							<button
								onClick={() => scrollProperties(propertiesRef, 'right')}
								className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors'
							>
								<ChevronRight className='w-5 h-5 text-gray-700' />
							</button>
						</div>
					</div>
					{isLoading ? (
						<div className='flex justify-center py-12'>
							<Loader />
						</div>
					) : (
						<>
							<div
								ref={propertiesRef}
								className='flex gap-4 overflow-x-auto pb-4 scrollbar-hide'
							>
								{displayProperties.map((property) => (
									<PropertyOwnerCard
										key={property.id}
										property={property}
										onViewDetails={() => handleViewDetails(property.id)}
										onEdit={landlordProperties.length > 0 ? handleEditListing : undefined}
									/>
								))}
							</div>
							<div className='mt-4'>
								<button
									type='button'
									onClick={() => navigate('/property-owner/my-properties')}
									className='text-[14px] font-medium text-primary hover:underline'
								>
									See all
								</button>
							</div>
						</>
					)}
				</div>
			</div>

			<Footer />
		</>
	)
}

export default PropertyOwnerView
