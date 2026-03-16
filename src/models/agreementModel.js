/**
 * Agreement model – list and details from agreements API.
 */

/**
 * @typedef {Object} AgreementParty
 * @property {string|null} id
 * @property {string|null} name
 * @property {string|null} avatar
 */

/**
 * @typedef {Object} AgreementItem
 * @property {string} id
 * @property {string|null} agreement_type
 * @property {string|null} status
 * @property {string|null} completed_at
 * @property {AgreementParty|null} party_one
 * @property {AgreementParty|null} party_two
 */

/**
 * @typedef {Object} AgreementDetailsParty
 * @property {string|null} id
 * @property {string|null} name
 * @property {string|null} avatar
 * @property {boolean|null} verified
 */

/**
 * @typedef {Object} AgreementDetailsProperty
 * @property {string|null} id
 * @property {string|null} title
 * @property {string|null} image
 * @property {string[]|null} images
 * @property {string|null} location
 * @property {string|null} property_type
 */

/**
 * @typedef {Object} AgreementDetailsTerms
 * @property {string|null} amount
 * @property {number|null} amount_raw
 * @property {string|null} duration
 */

/**
 * @typedef {Object} AgreementDetails
 * @property {string} id
 * @property {string|null} agreement_type
 * @property {string|null} status
 * @property {string|null} completed_at
 * @property {AgreementDetailsParty|null} party_one
 * @property {AgreementDetailsParty|null} party_two
 * @property {AgreementDetailsProperty|null} property
 * @property {AgreementDetailsTerms|null} terms
 */

function mapParty(p) {
	if (!p || typeof p !== 'object') return null
	return {
		id: p.id ?? null,
		name: p.name ?? null,
		avatar: p.avatar ?? null
	}
}

function mapDetailsParty(p) {
	if (!p || typeof p !== 'object') return null
	return {
		id: p.id ?? null,
		name: p.name ?? null,
		avatar: p.avatar ?? null,
		verified: p.verified ?? null
	}
}

/**
 * Maps single API agreement item to model.
 * @param {object} raw
 * @returns {AgreementItem}
 */
export function fromListApiItem(raw) {
	if (!raw || typeof raw !== 'object') return null
	const p1 = raw.party_one
	const p2 = raw.party_two
	return {
		id: raw.id ?? '',
		agreement_type: raw.agreement_type ?? null,
		status: raw.status ?? null,
		completed_at: raw.completed_at ?? null,
		party_one: mapParty(p1),
		party_two: mapParty(p2)
	}
}

/**
 * Maps API list response to agreement items array.
 * @param {{ success?: boolean, data?: object[] }} apiResponse
 * @returns {AgreementItem[]}
 */
export function fromListApiResponse(apiResponse) {
	const data = apiResponse?.data
	if (!Array.isArray(data)) return []
	return data.map((item) => fromListApiItem(item)).filter(Boolean)
}

/**
 * Maps API details response to agreement details model.
 * @param {object} raw - raw data object
 * @returns {AgreementDetails|null}
 */
export function fromDetailsApiResponse(raw) {
	if (!raw || typeof raw !== 'object') return null
	const prop = raw.property
	const terms = raw.terms
	let property = null
	if (prop && typeof prop === 'object') {
		const imgs = prop.images
		property = {
			id: prop.id ?? null,
			title: prop.title ?? null,
			image: prop.image ?? null,
			images: Array.isArray(imgs) ? imgs : null,
			location: prop.location ?? null,
			property_type: prop.property_type ?? null
		}
	}
	let termsMapped = null
	if (terms && typeof terms === 'object') {
		termsMapped = {
			amount: terms.amount ?? null,
			amount_raw: typeof terms.amount_raw === 'number' ? terms.amount_raw : null,
			duration: terms.duration ?? null
		}
	}
	return {
		id: raw.id ?? '',
		agreement_type: raw.agreement_type ?? null,
		status: raw.status ?? null,
		completed_at: raw.completed_at ?? null,
		party_one: mapDetailsParty(raw.party_one),
		party_two: mapDetailsParty(raw.party_two),
		property,
		terms: termsMapped
	}
}
