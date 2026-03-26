/**
 * Property model – getAllProperties and property list API response.
 */

/**
 * @typedef {Object} PropertyPrice
 * @property {number|null} total
 * @property {Array} other_fees
 * @property {number|null} rentage_fee
 * @property {string|null} rentage_type
 */

/**
 * @typedef {Object} PropertyReviewUser
 * @property {string|null} id
 * @property {string|null} fullname
 * @property {string|null} avatar
 */

/**
 * @typedef {Object} PropertyReview
 * @property {string|null} id
 * @property {number|null} rating
 * @property {string|null} sentiment
 * @property {string[]|null} tags
 * @property {string|null} comment
 * @property {string|null} created_at
 * @property {PropertyReviewUser|null} user
 */

/**
 * @typedef {Object} PropertyLandlord
 * @property {string|null} id
 * @property {string|null} fullname
 * @property {string|null} avatar
 * @property {number|null} number_of_properties
 * @property {string|null} email
 * @property {string|null} phone
 * @property {string|null} country
 * @property {string|null} state
 * @property {string|null} city
 * @property {string|null} postal_code
 * @property {string|null} address
 */

/**
 * @typedef {Object} Property
 * @property {string} id
 * @property {string|null} title
 * @property {string|null} description
 * @property {string|null} state
 * @property {string|null} city
 * @property {string|null} address
 * @property {string|null} postal_code
 * @property {string[]} features
 * @property {PropertyPrice|null} priceRaw
 * @property {string|null} currency
 * @property {number|null} total_price
 * @property {Array} shortlet_availability
 * @property {string[]} house_regulations
 * @property {number} no_of_bedrooms
 * @property {number} no_of_bathrooms
 * @property {string|null} furnishing
 * @property {string[]} documents
 * @property {string[]} images
 * @property {string|null} status
 * @property {number} view_count
 * @property {string|null} property_type
 * @property {PropertyLandlord|null} landlord
 * @property {PropertyReview[]} reviews
 * @property {string|null} image
 * @property {string} price
 * @property {string|null} priceFormatted
 * @property {number} priceValue
 * @property {string|null} location
 * @property {boolean} available
 */

/**
 * Maps single API property item to display model.
 * @param {object} raw - Raw property from API
 * @returns {Property|null}
 */
export function fromApiItem(raw) {
	if (!raw || typeof raw !== 'object') return null

	const price = raw.price ?? {}
	const total = price.total ?? raw.total_price ?? 0
	const priceFormatted =
		typeof total === 'number' ? `₦${Number(total).toLocaleString()}` : '—'
	const images = Array.isArray(raw.images) ? raw.images : []
	const image = images[0] ?? null
	const location = raw.address
		? [raw.address, raw.city, raw.state].filter(Boolean).join(', ')
		: [raw.city, raw.state].filter(Boolean).join(', ') || null

	const landlord = raw.landlord && typeof raw.landlord === 'object'
		? {
				id: raw.landlord.id ?? null,
				fullname: raw.landlord.fullname ?? null,
				avatar: raw.landlord.avatar ?? null,
				number_of_properties: raw.landlord.number_of_properties ?? null,
				email: raw.landlord.email ?? null,
				phone: raw.landlord.phone ?? null,
				country: raw.landlord.country ?? null,
				state: raw.landlord.state ?? null,
				city: raw.landlord.city ?? null,
				postal_code: raw.landlord.postal_code ?? null,
				address: raw.landlord.address ?? null
			}
		: null

	return {
		id: raw.id ?? raw.uuid ?? '',
		title: raw.title ?? null,
		description: raw.description ?? null,
		state: raw.state ?? null,
		city: raw.city ?? null,
		address: raw.address ?? null,
		postal_code: raw.postal_code ?? null,
		features: Array.isArray(raw.features) ? raw.features : [],
		priceRaw: price && typeof price === 'object' ? price : null,
		currency: raw.currency ?? null,
		total_price: typeof raw.total_price === 'number' ? raw.total_price : null,
		shortlet_availability: Array.isArray(raw.shortlet_availability) ? raw.shortlet_availability : [],
		house_regulations: Array.isArray(raw.house_regulations) ? raw.house_regulations : [],
		no_of_bedrooms: raw.no_of_bedrooms ?? raw.bedrooms ?? 0,
		no_of_bathrooms: raw.no_of_bathrooms ?? raw.bathrooms ?? 0,
		furnishing: raw.furnishing ?? null,
		documents: Array.isArray(raw.documents) ? raw.documents : [],
		images,
		status: raw.status ?? null,
		view_count: raw.view_count ?? 0,
		property_type: raw.property_type ?? null,
		landlord,
		reviews: Array.isArray(raw.reviews) ? raw.reviews : [],
		/** Inspection windows from API (tenant scheduled tab / cards). Preserved for normalizeProperty. */
		schedules: Array.isArray(raw.schedules) ? raw.schedules : [],
		// Display helpers (for PropertyCardWidget etc.)
		image,
		price: priceFormatted,
		priceFormatted,
		priceValue: typeof total === 'number' ? total : 0,
		location,
		available: raw.status !== 'inactive' && raw.status !== 'unpublished'
	}
}

/**
 * Extracts list from raw API response (handles data, data.data, data.properties, etc).
 * @param {object} apiResponse - Raw API response (res.data)
 * @returns {Property[]}
 */
export function fromListApiResponse(apiResponse) {
	const raw = apiResponse?.data ?? apiResponse
	if (Array.isArray(raw)) return raw.map((item) => fromApiItem(item)).filter(Boolean)
	if (raw && typeof raw === 'object') {
		const arr = raw.data ?? raw.properties ?? raw.properties_list ?? raw.requests ?? []
		if (Array.isArray(arr)) return arr.map((item) => fromApiItem(item)).filter(Boolean)
	}
	return []
}
