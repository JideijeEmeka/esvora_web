import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Loader2 } from 'lucide-react'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import Footer from '../components/footer'
import {
	useCreatePropertyForRentMutation,
	useCreatePropertyForSaleMutation,
	useCreatePropertyForShortletMutation
} from '../repository/property_repository'
import { getAddListingDraft, getAddPropertyDraftImages } from '../lib/localStorage'
import propertyController from '../controllers/property_controller'

const AddPropertyAgreementAndPolicyView = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const [isAgreed, setIsAgreed] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [createPropertyForRent] = useCreatePropertyForRentMutation()
	const [createPropertyForShortlet] = useCreatePropertyForShortletMutation()
	const [createPropertyForSale] = useCreatePropertyForSaleMutation()

	const handleBack = () => {
		navigate(-1)
	}

	const handleSubmit = async () => {
		if (!isAgreed || isSubmitting) return
		const listingType = location.state?.listingType || 'rent'
		const draft = getAddListingDraft(listingType === 'sale' ? 'sale' : listingType)
		const basicInfo = draft?.basicInfo || {}
		const features = Array.isArray(draft?.features) ? draft.features : []
		const regs = Array.isArray(draft?.regulations) ? draft.regulations : []
		const houseRegs = regs.map((r) => (typeof r === 'string' ? r : r?.text)).filter(Boolean)
		const b = draft?.bedrooms || {}
		const imageDataUrls = getAddPropertyDraftImages().map((i) => i.url).filter(Boolean)
		const routeImageFiles = Array.isArray(location.state?.imageFiles) ? location.state.imageFiles.filter(Boolean) : []
		const priceDraft = draft?.price || {}

		// Build API body based on Flutter repo contract.
		const common = {
			title: String(basicInfo.title || '').trim(),
			description: String(basicInfo.description || '').trim(),
			state: String(basicInfo.state || '').trim(),
			city: String(basicInfo.city || '').trim(),
			address: String(basicInfo.houseAddress || '').trim(),
			postal_code: String(basicInfo.postalCode || '').trim(),
			longitude: basicInfo.longitude ?? 33.636,
			latitude: basicInfo.latitude ?? -42.22,
			// NOTE: property_type_id is required by API; until UI collects it, use a placeholder if present in draft.
			property_type_id: draft?.propertyTypeId ?? draft?.property_type_id ?? basicInfo.propertyTypeId ?? basicInfo.property_type_id,
			no_of_bedrooms: Number(b.bedrooms || 0),
			no_of_bathrooms: Number(b.bathrooms || 0),
			no_of_beds: Number(b.beds || 0),
			furnishing: draft?.furnishing ?? 'furnished',
			features,
			house_regulations: houseRegs
		}

		const dataUrlToFile = async (dataUrl, index) => {
			try {
				const response = await fetch(dataUrl)
				const blob = await response.blob()
				const ext = blob.type.includes('png') ? 'png' : blob.type.includes('jpeg') ? 'jpg' : 'jpg'
				return new File([blob], `property-image-${index + 1}.${ext}`, { type: blob.type || 'image/jpeg' })
			} catch (_) {
				return null
			}
		}

		const resolveRentPropertyTypeId = async () => {
			const types = await propertyController.getPropertyTypesList()
			if (!Array.isArray(types) || types.length === 0) return null
			const rentCandidate = types.find((t) => {
				const name = String(t?.name ?? t?.title ?? t?.label ?? '').toLowerCase()
				const slug = String(t?.slug ?? '').toLowerCase()
				const range = String(t?.property_range ?? t?.range ?? t?.type ?? '').toLowerCase()
				return (
					name.includes('rent') ||
					slug.includes('rent') ||
					range === 'rent' ||
					range === 'for_rent' ||
					range === 'for rent'
				)
			})
			return rentCandidate?.uuid ?? rentCandidate?.id ?? null
		}

		const parseMoney = (s) => Number(String(s || '0').replace(/,/g, '')) || 0
		const rentageFee = parseMoney(priceDraft.rentageFee)
		const otherFees = Array.isArray(priceDraft.fees)
			? priceDraft.fees
					.filter((f) => f && (f.description || f.amount))
					.map((f) => ({
						description: String(f.description || '').trim(),
						amount: parseMoney(f.amount)
					}))
					.filter((f) => f.description && f.amount >= 0)
			: []

		const rentPropertyTypeId =
			common.property_type_id || (listingType === 'rent' ? await resolveRentPropertyTypeId() : null)
		const rentBody = {
			...common,
			property_type_id: rentPropertyTypeId,
			price: {
				rentage_type: priceDraft.rentageType || 'monthly',
				rentage_fee: rentageFee,
				other_fees: otherFees
			}
		}

		const shortletBody = {
			...common,
			shortlet_availability: [
				{
					price: parseMoney(priceDraft.price),
					duration_type: priceDraft.duration || 'per-night',
					from_date: priceDraft.fromDate || '',
					to_date: priceDraft.toDate || ''
				}
			]
		}

		const saleBody = {
			...common,
			price: {
				total: parseMoney(priceDraft.price)
			},
			status: 'active'
		}

		const payload =
			listingType === 'shortlet' ? shortletBody : listingType === 'sale' ? saleBody : rentBody
		const extractPropertyId = (response) => {
			const data = response?.data ?? response
			return (
				data?.uuid ??
				data?.id ??
				data?.property_id ??
				response?.uuid ??
				response?.id ??
				null
			)
		}
		try {
			setIsSubmitting(true)
			// Build multipart payload with real Files.
			const formData = new FormData()
			const appendIf = (key, value) => {
				if (value !== undefined && value !== null && String(value).length > 0) formData.append(key, String(value))
			}
			appendIf('title', payload.title)
			appendIf('description', payload.description)
			appendIf('state', payload.state)
			appendIf('city', payload.city)
			appendIf('address', payload.address)
			appendIf('postal_code', payload.postal_code)
			appendIf('longitude', payload.longitude)
			appendIf('latitude', payload.latitude)
			appendIf('property_type_id', payload.property_type_id)
			appendIf('no_of_bedrooms', payload.no_of_bedrooms)
			appendIf('no_of_bathrooms', payload.no_of_bathrooms)
			appendIf('no_of_beds', payload.no_of_beds)
			appendIf('furnishing', payload.furnishing)
			appendIf('status', payload.status)
			;(payload.features || []).forEach((feature, idx) => appendIf(`features[${idx}]`, feature))
			;(payload.house_regulations || []).forEach((rule, idx) => appendIf(`house_regulations[${idx}]`, rule))
			if (payload.price?.rentage_type) appendIf('price[rentage_type]', payload.price.rentage_type)
			if (payload.price?.rentage_fee != null) appendIf('price[rentage_fee]', payload.price.rentage_fee)
			if (payload.price?.total != null) appendIf('price[total]', payload.price.total)
			;(payload.price?.other_fees || []).forEach((fee, idx) => {
				appendIf(`price[other_fees][${idx}][description]`, fee?.description)
				appendIf(`price[other_fees][${idx}][amount]`, fee?.amount)
			})
			;(payload.shortlet_availability || []).forEach((item, idx) => {
				appendIf(`shortlet_availability[${idx}][price]`, item?.price)
				appendIf(`shortlet_availability[${idx}][duration_type]`, item?.duration_type)
				appendIf(`shortlet_availability[${idx}][from_date]`, item?.from_date)
				appendIf(`shortlet_availability[${idx}][to_date]`, item?.to_date)
			})

			const filesFromDataUrls = (
				await Promise.all(
					imageDataUrls
						.filter((u) => typeof u === 'string' && u.startsWith('data:'))
						.map((u, i) => dataUrlToFile(u, i))
				)
			).filter(Boolean)
			const finalFiles = [...routeImageFiles, ...filesFromDataUrls]
			finalFiles.forEach((file) => {
				formData.append('images[]', file)
			})

			let created = null
			if (listingType === 'shortlet') {
				created = await createPropertyForShortlet(formData).unwrap()
			} else if (listingType === 'sale') {
				created = await createPropertyForSale(formData).unwrap()
			} else {
				if (!rentBody.property_type_id) {
					toast.error('Unable to resolve rent property type id from property types list.')
					return
				}
				created = await createPropertyForRent(formData).unwrap()
			}
			const createdPropertyId = extractPropertyId(created)
			toast.success('Property submitted successfully')
			navigate('/property-owner/add-property/success', {
				state: { propertyId: createdPropertyId }
			})
		} catch (error) {
			const message = error?.data?.message || error?.message || 'Failed to submit property'
			toast.error(message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				{/* Main Content */}
				<div className='flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full'>
					{/* Content Container */}
					<div className='w-full'>
						{/* Heading */}
						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8 text-center'>
							Agreement and Policy
						</h1>

						{/* Terms and Conditions Section */}
						<div className='mb-8'>
							<h2 className='text-[24px] font-semibold text-gray-900 mb-4'>
								Terms and condition
							</h2>
							<div className='space-y-4 text-[16px] text-gray-700 leading-relaxed'>
								<p>
									By listing a property for rent, you confirm ownership or authorisation, agree to
									provide accurate details, and comply with local laws.
								</p>
								<p>
									Listings must include truthful information, required images, and may be removed if
									found misleading or violating platform policies.
								</p>
							</div>
						</div>

						{/* Agreement Checkbox */}
						<div className='mb-8'>
							<label className='flex items-start gap-3 cursor-pointer'>
								<input
									type='checkbox'
									checked={isAgreed}
									onChange={(e) => setIsAgreed(e.target.checked)}
									className='mt-1 w-5 h-5 rounded border-gray-300 text-white checked:bg-primary checked:border-primary focus:ring-primary cursor-pointer'
								/>
								<div className='flex-1'>
									<span className='text-[16px] font-medium text-gray-900 block'>
										Agreement policy
									</span>
									<span className='text-[14px] text-gray-500 mt-1 block'>I agree to the Terms and Condition</span>
								</div>
							</label>
						</div>

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
								onClick={handleSubmit}
								disabled={!isAgreed || isSubmitting}
								className='flex-1 bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
							>
								{isSubmitting ? (
									<span className='inline-flex items-center gap-2'>
										<Loader2 className='w-5 h-5 animate-spin' />
										Submitting...
									</span>
								) : (
									'Submit'
								)}
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddPropertyAgreementAndPolicyView
