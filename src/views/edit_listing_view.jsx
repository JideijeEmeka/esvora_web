import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import { Eye, Plus, Minus, Image as ImageIcon } from 'lucide-react'

const LISTING_BY_ID = {
	1: {
		images: [
			'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
			'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
			'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'
		],
		status: 'Rent',
		price: '€120,500',
		title: '3 Bedroom modern duplex apartment',
		address: '22, Apapa Estate, Ikoyi District, Lagos, Nigeria',
		description:
			'A modern 3-bedroom home with spacious living areas, a fully equipped kitchen, and two bathrooms. Features include ample natural light, tiled floors, and built-in wardrobes.',
		features: ['Wifi', 'Furniture'],
		landlord: { name: 'Osaite Emmanuel', since: 'Nov 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
		locationText: 'Lagos, Nigeria',
		paymentItems: [
			{ id: 1, description: 'Rentage fee', amount: '0.00' },
			{ id: 2, description: 'Rentage fee', amount: '0.00' },
			{ id: 3, description: 'Rentage fee', amount: '0.00' }
		],
		regulations: [
			{ id: 1, text: 'Check in at 10:00PM' },
			{ id: 2, text: 'No fighting' }
		]
	},
	2: {
		images: [
			'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
			'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
		],
		status: 'Shortlet',
		price: '€95,000',
		title: '3 bedroom luxury apartment',
		address: 'Victoria Island, Lagos, Nigeria',
		description: 'Luxury shortlet with modern amenities.',
		features: ['Wifi', 'Parking space'],
		landlord: { name: 'Osaite Emmanuel', since: 'Nov 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
		locationText: 'Lagos, Nigeria',
		paymentItems: [{ id: 1, description: 'Rentage fee', amount: '0.00' }],
		regulations: [{ id: 1, text: 'Check in at 10:00PM' }]
	},
	3: {
		images: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'],
		status: 'Sale',
		price: '€150,000',
		title: '5 bedroom detached house',
		address: 'Lekki, Lagos, Nigeria',
		description: 'Spacious detached house for sale.',
		features: ['Wifi', 'Furniture', 'Water'],
		landlord: { name: 'Osaite Emmanuel', since: 'Nov 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
		locationText: 'Lagos, Nigeria',
		paymentItems: [{ id: 1, description: 'Rentage fee', amount: '0.00' }],
		regulations: [{ id: 1, text: 'No fighting' }]
	},
	4: {
		images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
		status: 'Rent',
		price: '€80,000',
		title: '2 bedroom cozy apartment',
		address: 'Surulere, Lagos, Nigeria',
		description: 'Cozy 2-bedroom apartment.',
		features: ['Wifi'],
		landlord: { name: 'Osaite Emmanuel', since: 'Nov 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
		locationText: 'Lagos, Nigeria',
		paymentItems: [{ id: 1, description: 'Rentage fee', amount: '0.00' }],
		regulations: [{ id: 1, text: '' }]
	},
	5: {
		images: ['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800'],
		status: 'Shortlet',
		price: '€110,000',
		title: '3 bedroom modern townhouse',
		address: 'Gbagada, Lagos, Nigeria',
		description: 'Modern townhouse for shortlet.',
		features: ['Wifi', 'Furniture'],
		landlord: { name: 'Osaite Emmanuel', since: 'Nov 2025', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
		locationText: 'Lagos, Nigeria',
		paymentItems: [{ id: 1, description: 'Rentage fee', amount: '0.00' }],
		regulations: [{ id: 1, text: '' }]
	}
}

const STATUS_OPTIONS = ['Rent', 'Shortlet', 'Sale']
const FEATURE_OPTIONS = ['Wifi', 'Furniture', 'Water', 'Parking space', 'Electricity', 'Custom']

const EditListingView = () => {
	const navigate = useNavigate()
	const { id } = useParams()
	const fileInputRef = useRef(null)
	const defaultListing =
		id && LISTING_BY_ID[Number(id)]
			? LISTING_BY_ID[Number(id)]
			: {
					images: [],
					status: 'Rent',
					price: '',
					title: '',
					address: '',
					description: '',
					features: [],
					landlord: { name: 'Osaite Emmanuel', since: 'Nov 2025', avatar: '' },
					locationText: '',
					paymentItems: [{ id: 1, description: 'Rentage fee', amount: '0.00' }],
					regulations: [{ id: 1, text: '' }]
				}

	const [images, setImages] = useState(defaultListing.images.map((url, i) => ({ id: i + 1, url })))
	const [mainImageIndex, setMainImageIndex] = useState(0)
	const [status, setStatus] = useState(defaultListing.status)
	const [price, setPrice] = useState(defaultListing.price)
	const [title, setTitle] = useState(defaultListing.title)
	const [address, setAddress] = useState(defaultListing.address)
	const [description, setDescription] = useState(defaultListing.description)
	const [features, setFeatures] = useState([...defaultListing.features])
	const [locationText, setLocationText] = useState(defaultListing.locationText)
	const [paymentItems, setPaymentItems] = useState(
		defaultListing.paymentItems.map((p) => ({ ...p, id: p.id || Date.now() + Math.random() }))
	)
	const [regulations, setRegulations] = useState(
		defaultListing.regulations.map((r) => ({ ...r, id: r.id || Date.now() + Math.random() }))
	)

	useEffect(() => {
		sessionStorage.setItem('propertyOwnerActiveTab', 'listings')
	}, [])

	const mainImage = images[mainImageIndex]?.url || images[0]?.url

	const handleImageSelect = (e) => {
		const files = Array.from(e.target.files || [])
		const valid = files.filter((f) => /image\/(jpeg|png|jpg)/.test(f.type))
		valid.forEach((file) => {
			const reader = new FileReader()
			reader.onloadend = () => {
				setImages((prev) => [...prev, { id: Date.now() + Math.random(), url: reader.result }])
			}
			reader.readAsDataURL(file)
		})
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const handleRemoveImage = (imageId) => {
		setImages((prev) => {
			const next = prev.filter((img) => img.id !== imageId)
			if (mainImageIndex >= next.length && next.length > 0) setMainImageIndex(0)
			return next
		})
	}

	const handleAddFeature = (name) => {
		if (!features.includes(name)) setFeatures((prev) => [...prev, name])
	}

	const handleRemoveFeature = (name) => {
		setFeatures((prev) => prev.filter((f) => f !== name))
	}

	const handleAddPayment = () => {
		setPaymentItems((prev) => [...prev, { id: Date.now(), description: '', amount: '0.00' }])
	}

	const handleRemovePayment = (itemId) => {
		if (paymentItems.length > 1) {
			setPaymentItems((prev) => prev.filter((p) => p.id !== itemId))
		}
	}

	const handlePaymentChange = (itemId, field, value) => {
		setPaymentItems((prev) =>
			prev.map((p) => (p.id === itemId ? { ...p, [field]: value } : p))
		)
	}

	const handleAddRegulation = () => {
		setRegulations((prev) => [...prev, { id: Date.now(), text: '' }])
	}

	const handleRemoveRegulation = (regId) => {
		if (regulations.length > 1) {
			setRegulations((prev) => prev.filter((r) => r.id !== regId))
		}
	}

	const handleRegulationChange = (regId, value) => {
		setRegulations((prev) =>
			prev.map((r) => (r.id === regId ? { ...r, text: value } : r))
		)
	}

	const handleSave = () => {
		console.log('Save listing', { id, title, status, price, images, features, paymentItems, regulations })
		navigate('/property-owner')
	}

	const handleRemoveListing = () => {
		if (window.confirm('Remove this listing? This cannot be undone.')) {
			console.log('Remove listing', id)
			navigate('/property-owner')
		}
	}

	const handleAddNewListing = () => {
		navigate('/property-owner/add-property/basic-info')
	}

	const handlePreview = () => {
		navigate(`/property-details/${id || 1}`)
	}

	if (id && !LISTING_BY_ID[Number(id)]) {
		return (
			<>
				<PropertyOwnerNavbar />
				<div className='pt-30 pb-10 px-6 flex flex-col items-center justify-center min-h-screen'>
					<p className='text-gray-600'>Listing not found.</p>
					<button
						type='button'
						onClick={() => navigate('/property-owner')}
						className='mt-4 text-primary font-medium'
					>
						Back to dashboard
					</button>
				</div>
			</>
		)
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen bg-white'>
				<div className='max-w-4xl mx-auto'>
					<h1 className='text-[28px] md:text-[32px] font-bold text-gray-900 mb-8'>
						Edit listing
					</h1>

					{/* Image gallery */}
					<div className='mb-8'>
						<div
							className='relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-3 cursor-pointer'
							onClick={() => fileInputRef.current?.click()}
						>
							{mainImage ? (
								<img src={mainImage} alt='' className='w-full h-full object-cover' />
							) : (
								<div className='w-full h-full flex items-center justify-center'>
									<ImageIcon className='w-16 h-16 text-gray-400' />
								</div>
							)}
							<div className='absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center'>
								<span className='opacity-0 hover:opacity-100 text-white font-medium'>
									Click to change image
								</span>
							</div>
						</div>
						<input
							ref={fileInputRef}
							type='file'
							multiple
							accept='image/jpeg,image/png,image/jpg'
							onChange={handleImageSelect}
							className='hidden'
						/>
						<div className='flex gap-2 overflow-x-auto pb-2'>
							{images.slice(0, 4).map((img, idx) => (
								<div key={img.id} className='relative shrink-0 group'>
									<button
										type='button'
										onClick={() => setMainImageIndex(idx)}
										className={`block w-20 h-20 rounded-lg overflow-hidden border-2 ${
											mainImageIndex === idx ? 'border-primary' : 'border-gray-200'
										}`}
									>
										<img src={img.url} alt='' className='w-full h-full object-cover' />
									</button>
									<button
										type='button'
										onClick={(e) => {
											e.stopPropagation()
											handleRemoveImage(img.id)
										}}
										className='absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
										aria-label='Remove image'
									>
										<Minus className='w-3 h-3' />
									</button>
								</div>
							))}
							{images.length > 4 && (
								<button
									type='button'
									onClick={() => fileInputRef.current?.click()}
									className='shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-[14px] font-medium'
								>
									+{images.length - 4}
								</button>
							)}
							<button
								type='button'
								onClick={() => fileInputRef.current?.click()}
								className='shrink-0 w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-primary hover:text-primary'
							>
								<Plus className='w-6 h-6' />
							</button>
						</div>
					</div>

					{/* Status */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>Status</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className='w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-[16px]'
						>
							<option value=''>Select status</option>
							{STATUS_OPTIONS.map((opt) => (
								<option key={opt} value={opt}>{opt}</option>
							))}
						</select>
					</div>

					{/* Price + actions */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>Price</label>
						<div className='flex flex-wrap gap-2'>
							<button
								type='button'
								onClick={handlePreview}
								className='flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-[14px] font-medium'
							>
								<Eye className='w-4 h-4' />
								Preview
							</button>
							<button
								type='button'
								className='px-4 py-2 rounded-full bg-primary text-white text-[14px] font-medium'
							>
								List property
							</button>
						</div>
						<input
							type='text'
							value={price}
							onChange={(e) => setPrice(e.target.value)}
							placeholder='Price'
							className='mt-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-[16px]'
						/>
					</div>

					{/* Title */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>Title</label>
						<input
							type='text'
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder='Title'
							className='w-full px-4 py-3 border border-gray-300 rounded-lg text-[16px]'
						/>
					</div>

					{/* Address */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>Address</label>
						<input
							type='text'
							value={address}
							onChange={(e) => setAddress(e.target.value)}
							placeholder='Address'
							className='w-full px-4 py-3 border border-gray-300 rounded-lg text-[16px]'
						/>
					</div>

					{/* Description */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder='Description'
							rows={4}
							className='w-full px-4 py-3 border border-gray-300 rounded-lg text-[16px] resize-y'
						/>
					</div>

					{/* Features */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>Features</label>
						<div className='flex flex-wrap gap-2 mb-2'>
							{features.map((f) => (
								<span
									key={f}
									className='inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-[14px]'
								>
									{f}
									<button
										type='button'
										onClick={() => handleRemoveFeature(f)}
										className='w-5 h-5 rounded-full hover:bg-gray-200 flex items-center justify-center'
									>
										<Minus className='w-3 h-3' />
									</button>
								</span>
							))}
						</div>
						<div className='flex flex-wrap gap-2'>
							{FEATURE_OPTIONS.filter((f) => !features.includes(f)).map((f) => (
								<button
									key={f}
									type='button'
									onClick={() => handleAddFeature(f)}
									className='inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-[14px] font-medium'
								>
									{f} <Plus className='w-3 h-3' />
								</button>
							))}
						</div>
					</div>

					{/* Landlord info */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>
							Landlord&apos;s information
						</label>
						<div className='flex items-center gap-3 p-4 border border-gray-200 rounded-xl bg-gray-50'>
							<div className='w-12 h-12 rounded-full bg-gray-200 overflow-hidden shrink-0'>
								{defaultListing.landlord?.avatar ? (
									<img src={defaultListing.landlord.avatar} alt='' className='w-full h-full object-cover' />
								) : null}
							</div>
							<div>
								<p className='font-medium text-gray-900 underline cursor-pointer'>
									{defaultListing.landlord?.name || 'Osaite Emmanuel'}
								</p>
								<p className='text-[14px] text-gray-500'>
									Since {defaultListing.landlord?.since || 'Nov 2025'}
								</p>
							</div>
						</div>
					</div>

					{/* Location */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>Location</label>
						<input
							type='text'
							value={locationText}
							onChange={(e) => setLocationText(e.target.value)}
							placeholder='e.g. Lagos, Nigeria'
							className='w-full px-4 py-3 border border-gray-300 rounded-lg text-[16px] mb-2'
						/>
						<p className='text-[14px] text-gray-600 mb-2'>{address || '—'}</p>
						<div className='aspect-video rounded-xl bg-gray-200 flex items-center justify-center text-gray-500'>
							Map (e.g. embed or placeholder)
						</div>
					</div>

					{/* Payment Information */}
					<div className='mb-6'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>
							Payment Information
						</label>
						<div className='space-y-2'>
							{paymentItems.map((item) => (
								<div
									key={item.id}
									className='flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg'
								>
									<input
										type='text'
										value={item.description}
										onChange={(e) => handlePaymentChange(item.id, 'description', e.target.value)}
										placeholder='Description'
										className='flex-1 bg-transparent border-none outline-none text-[16px]'
									/>
									<input
										type='text'
										value={item.amount}
										onChange={(e) => handlePaymentChange(item.id, 'amount', e.target.value)}
										placeholder='Amount'
										className='w-24 bg-transparent border-none outline-none text-[16px] text-right'
									/>
									<button
										type='button'
										onClick={() => handleRemovePayment(item.id)}
										className='w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center'
									>
										<Minus className='w-4 h-4 text-gray-600' />
									</button>
								</div>
							))}
						</div>
						<button
							type='button'
							onClick={handleAddPayment}
							className='mt-2 flex items-center gap-1 text-[14px] font-medium text-primary hover:underline'
						>
							<Plus className='w-4 h-4' /> Add
						</button>
					</div>

					{/* House regulations */}
					<div className='mb-10'>
						<label className='block text-[14px] font-medium text-gray-700 mb-2'>
							House regulations
						</label>
						<div className='space-y-2'>
							{regulations.map((reg) => (
								<div
									key={reg.id}
									className='flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-full'
								>
									<input
										type='text'
										value={reg.text}
										onChange={(e) => handleRegulationChange(reg.id, e.target.value)}
										placeholder='Enter regulation'
										className='flex-1 bg-transparent border-none outline-none text-[16px]'
									/>
									<button
										type='button'
										onClick={() => handleRemoveRegulation(reg.id)}
										className='w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center'
									>
										<Minus className='w-4 h-4 text-gray-600' />
									</button>
								</div>
							))}
						</div>
						<button
							type='button'
							onClick={handleAddRegulation}
							className='mt-2 flex items-center gap-1 text-[14px] font-medium text-primary hover:underline'
						>
							<Plus className='w-4 h-4' /> Add
						</button>
					</div>

					{/* Bottom actions */}
					<div className='flex flex-wrap gap-3 pt-6 border-t border-gray-200'>
						<button
							type='button'
							onClick={handleSave}
							className='px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary/90'
						>
							Save
						</button>
						<button
							type='button'
							onClick={handleRemoveListing}
							className='px-6 py-3 rounded-full bg-white border-2 border-red-200 text-red-600 font-semibold hover:bg-red-50'
						>
							Remove listing
						</button>
						<button
							type='button'
							onClick={handleAddNewListing}
							className='px-6 py-3 rounded-full bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200'
						>
							Add new listing
						</button>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default EditListingView
