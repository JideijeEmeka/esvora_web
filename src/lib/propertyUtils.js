/**
 * Normalize API property to the shape expected by PropertyCardWidget and list views.
 * Handles snake_case and camelCase from API.
 */
export function normalizeProperty(p) {
	if (!p || typeof p !== 'object') return null
	const id = p.id ?? p.uuid ?? p.property_id
	const images = p.images ?? []
	const image = p.image ?? images[0] ?? null
	const priceObj = p.price ?? {}
	// Support model output (priceFormatted/price as string) or raw API (price.total)
	const priceFormatted =
		typeof p.price === 'string' ? p.price
		: p.priceFormatted ?? p.price_formatted ?? priceObj.formatted
		?? (priceObj.total != null ? `₦${Number(priceObj.total).toLocaleString()}` : null)
		?? p.amount ?? '—'
	const priceValue = typeof p.priceValue === 'number' ? p.priceValue
		: (typeof priceObj.total === 'number' ? priceObj.total : (typeof p.price_value === 'number' ? p.price_value : 0))
	const description = p.property_type_summary ?? p.title ?? p.description ?? p.propertyTypeSummary ?? '—'
	const location = p.location ?? p.address ?? [p.city, p.state].filter(Boolean).join(', ') ?? '—'
	const propertyType = p.property_type ?? p.propertyType ?? p.property_type_id ?? ''
	const bedrooms = p.no_of_bedrooms ?? p.bedrooms ?? 0
	const bathrooms = p.no_of_bathrooms ?? p.bathrooms ?? 0
	const furnishing = p.furnishing ?? ''
	const state = p.state ?? ''
	return {
		...p,
		id,
		uuid: id,
		image,
		images,
		price: priceFormatted,
		priceValue,
		description,
		location,
		propertyType,
		bedrooms,
		bathrooms,
		furnishing,
		state,
		available: p.status !== 'inactive'
	}
}

export function normalizeProperties(list) {
	return (Array.isArray(list) ? list : []).map(normalizeProperty).filter(Boolean)
}

/**
 * Normalize full property details for PropertyDetailsView.
 * Maps API response to the shape expected by the details UI.
 */
export function normalizePropertyDetails(p) {
	if (!p || typeof p !== 'object') return null
	const id = p.id ?? p.uuid ?? p.property_id
	const images = Array.isArray(p.images) ? p.images : (p.image ? [p.image] : [])
	const image = images[0] ?? p.image ?? ''
	const priceObj = p.price ?? {}
	const priceFormatted = p.price_formatted ?? priceObj.formatted ?? (priceObj.total != null ? `₦${Number(priceObj.total).toLocaleString()}` : null) ?? p.amount ?? '—'
	const landlord = p.landlord ?? p.owner ?? {}
	const landlordData = typeof landlord === 'object' ? landlord : {}
	const features = p.features ?? []
	const featuresList = Array.isArray(features)
		? features.map((f) => (typeof f === 'string' ? { name: f } : f))
		: []
	const houseRegs = p.house_regulations ?? p.regulations ?? []
	const regulations = Array.isArray(houseRegs) ? houseRegs : (typeof houseRegs === 'string' ? [houseRegs] : [])
	const paymentInfo = p.payment_info ?? p.paymentInfo ?? {}
	const pi = typeof paymentInfo === 'object' ? paymentInfo : {}
	// Build from price model: { total, other_fees, rentage_fee, rentage_type }
	const priceRaw = priceObj && typeof priceObj === 'object' ? priceObj : null
	const priceData = priceRaw
		? {
				total: priceRaw.total ?? 0,
				other_fees: Array.isArray(priceRaw.other_fees) ? priceRaw.other_fees : [],
				rentage_fee: priceRaw.rentage_fee ?? priceRaw.total ?? 0,
				rentage_type: priceRaw.rentage_type ?? 'monthly'
			}
		: {
				total: pi.total ?? (pi.rent ?? pi.amount ?? 0),
				other_fees: [],
				rentage_fee: pi.rent ?? pi.amount ?? 0,
				rentage_type: 'monthly'
			}
	return {
		id,
		uuid: id,
		title: p.title ?? p.property_type_summary ?? p.description ?? '—',
		description: p.description ?? p.property_type_summary ?? '—',
		location: p.location ?? p.address ?? [p.city, p.state].filter(Boolean).join(', ') ?? '—',
		fullAddress: p.full_address ?? p.address ?? p.location ?? '—',
		state: p.state ?? '',
		city: p.city ?? '',
		address: p.address ?? '',
		postal_code: p.postal_code ?? '',
		price: priceFormatted,
		priceNGN: typeof priceData.total === 'number' ? priceData.total : 0,
		images,
		image,
		property_type: p.property_type ?? p.propertyType ?? '',
		bedrooms: p.no_of_bedrooms ?? p.bedrooms ?? 0,
		bathrooms: p.no_of_bathrooms ?? p.bathrooms ?? 0,
		rating: p.rating ?? 4.0,
		reviewCount: p.review_count ?? p.reviews_count ?? 0,
		about: p.about ?? p.description ?? '',
		features: featuresList,
		landlord: {
			name: landlordData.fullname ?? landlordData.name ?? '—',
			email: landlordData.email ?? '',
			location: landlordData.location ?? [landlordData.city, landlordData.state].filter(Boolean).join(', ') ?? '—',
			verified: !!landlordData.is_verified,
			joinDate: landlordData.created_at ? new Date(landlordData.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—',
			listedProperties: landlordData.listed_properties ?? landlordData.listedProperties ?? 0,
			avatar: landlordData.avatar ?? landlordData.profile_image ?? ''
		},
		paymentInfo: {
			total: priceData.total,
			other_fees: priceData.other_fees,
			rentage_fee: priceData.rentage_fee,
			rentage_type: priceData.rentage_type
		},
		regulations,
		reviews: p.reviews ?? [],
		relatedProperties: p.related_properties ?? []
	}
}

/**
 * Normalize landlord request list item for RequestsView.
 */
export function normalizeLandlordRequest(r) {
	if (!r || typeof r !== 'object') return null
	const prop = r.property ?? {}
	const propObj = typeof prop === 'object' ? prop : {}
	const type = (r.type ?? 'rent').toLowerCase()
	const isShortlet = type === 'shortlet'
	const image = propObj.image ?? propObj.images?.[0] ?? ''
	const propertyType = propObj.property_type_label ?? (isShortlet ? 'Shortlet' : type === 'sales' ? 'Sale' : 'Rent')
	const title = isShortlet ? 'Reservation' : 'Schedule Request'
	const requestor = r.requestor ?? r.buyer ?? {}
	const requestorObj = typeof requestor === 'object' ? requestor : {}
	const fromName = r.requestor_name ?? requestorObj.fullname ?? '—'
	const timeAgo = r.created_at_human ?? r.created_at ?? ''
	const duration = r.duration ?? {}
	const dateRange = duration.label ?? (duration.check_in && duration.check_out ? `${duration.check_in} - ${duration.check_out}` : null)
	return {
		id: r.id ?? r.uuid,
		type: isShortlet ? 'reservation' : 'schedule',
		propertyType,
		image,
		title,
		timeAgo,
		message: isShortlet ? 'You have a reservation from' : 'You have a request schedule from',
		requesterName: fromName,
		suffix: isShortlet ? '' : 'for one of your properties.',
		participants: fromName ? [fromName] : [],
		dateRange,
		status: r.status,
		raw: r
	}
}

/**
 * Normalize my request (tenant's own requests) for MyRequestsView.
 * Matches esvora MyRequestModel: summaryTitle, summarySubtitle, landlordName, etc.
 */
export function normalizeMyRequest(r) {
	if (!r || typeof r !== 'object') return null
	const prop = r.property ?? {}
	const propObj = typeof prop === 'object' ? prop : {}
	const type = (r.type ?? 'rent').toLowerCase()
	const isShortlet = type === 'shortlet'
	const image = propObj.image ?? propObj.images?.[0] ?? ''
	const propertyType = propObj.property_type_label ?? propObj.property_type ?? (isShortlet ? 'Shortlet' : type === 'sales' ? 'Sale' : 'Rent')
	const amountDetails = r.amount_details ?? r.amountDetails ?? {}
	const amountObj = typeof amountDetails === 'object' ? amountDetails : {}
	const priceFormatted = amountObj.total_amount_formatted ?? amountObj.totalAmountFormatted ?? propObj.price_formatted ?? (propObj.price != null ? `₦${Number(propObj.price).toLocaleString()}` : null)
	const duration = r.duration ?? {}
	const dateRange = duration.label ?? (duration.check_in && duration.check_out ? `${duration.check_in} - ${duration.check_out}` : null)
	const status = (r.status ?? '').toLowerCase()
	const propId = propObj.id ?? propObj.uuid
	const totalAmount = amountObj.total_amount ?? amountObj.totalAmount ?? propObj.price ?? 0
	return {
		id: r.id ?? r.uuid,
		propertyId: propId,
		image,
		title: r.summary_title ?? r.summaryTitle ?? propObj.title ?? propObj.description ?? propertyType,
		summaryTitle: r.summary_title ?? r.summaryTitle ?? propObj.title ?? propObj.description ?? propertyType,
		summarySubtitle: (r.summary_subtitle ?? r.summarySubtitle ?? '').replace(/\*\*/g, ''),
		propertyType,
		dateRange,
		timeAgo: r.created_at_human ?? r.created_at ?? '',
		createdAt: r.created_at ?? r.createdAt,
		status,
		landlordName: r.landlord_name ?? r.landlordName ?? '',
		priceFormatted,
		totalAmount: typeof totalAmount === 'number' ? totalAmount : 0,
		address: propObj.address ?? [propObj.city, propObj.state].filter(Boolean).join(', ') ?? '',
		type: isShortlet ? 'reservation' : 'schedule',
		raw: r
	}
}

/**
 * Normalize show request details for RequestDetailsView.
 */
export function normalizeShowRequest(r) {
	if (!r || typeof r !== 'object') return null
	const prop = r.property ?? {}
	const propObj = typeof prop === 'object' ? prop : {}
	const requestor = r.requestor ?? r.buyer ?? {}
	const requestorObj = typeof requestor === 'object' ? requestor : {}
	const guest = r.guest_information ?? {}
	const guestObj = typeof guest === 'object' ? guest : {}
	const duration = r.duration ?? {}
	const fromName = requestorObj.fullname ?? guestObj.fullname ?? r.requestor_name ?? '—'
	const priceFormatted = propObj.price_formatted ?? (propObj.price != null ? `₦${Number(propObj.price).toLocaleString()}` : '—')
	return {
		property: {
			image: propObj.image ?? propObj.images?.[0] ?? '',
			price: priceFormatted,
			description: propObj.description ?? propObj.title ?? '—',
			location: propObj.address ?? [propObj.city, propObj.state].filter(Boolean).join(', ') ?? '—',
			id: propObj.id ?? propObj.uuid
		},
		from: fromName,
		userInfo: {
			fullName: guestObj.fullname ?? requestorObj.fullname ?? fromName,
			email: guestObj.email ?? requestorObj.email ?? '',
			phoneNumber: guestObj.phone ?? requestorObj.phone ?? '',
			urgency: r.urgency ?? 'Normal'
		},
		message: r.message ?? r.summary_subtitle ?? '',
		scheduleDate: duration.label ?? (duration.check_in && duration.check_out ? `${duration.check_in} - ${duration.check_out}` : null) ?? r.schedule_date ?? '—',
		raw: r
	}
}
