import { kToken } from './constants'

const kAddPropertyDraftImages = 'add_property_draft_images'
const kAddListingDraft = 'add_listing_draft'

export function saveToken(token) {
	try {
		if (typeof token === 'string' && token.length > 0) {
			localStorage.setItem(kToken, token)
		}
	} catch (e) {
		console.warn('saveToken failed:', e)
	}
}

export function getToken() {
	try {
		return localStorage.getItem(kToken)
	} catch (e) {
		console.warn('getToken failed:', e)
		return null
	}
}

export function removeToken() {
	try {
		localStorage.removeItem(kToken)
	} catch (e) {
		console.warn('removeToken failed:', e)
	}
}

export function saveAddPropertyDraftImages(images) {
	try {
		const safe = Array.isArray(images)
			? images
					.map((img) => ({
						id: img?.id ?? null,
						url: typeof img?.url === 'string' ? img.url : ''
					}))
					.filter((img) => Boolean(img.url))
			: []
		localStorage.setItem(kAddPropertyDraftImages, JSON.stringify(safe))
	} catch (e) {
		console.warn('saveAddPropertyDraftImages failed:', e)
	}
}

export function getAddPropertyDraftImages() {
	try {
		const raw = localStorage.getItem(kAddPropertyDraftImages)
		if (!raw) return []
		const parsed = JSON.parse(raw)
		if (!Array.isArray(parsed)) return []
		return parsed
			.map((img) => ({
				id: img?.id ?? null,
				url: typeof img?.url === 'string' ? img.url : ''
			}))
			.filter((img) => Boolean(img.url))
	} catch (e) {
		console.warn('getAddPropertyDraftImages failed:', e)
		return []
	}
}

function readAddListingDraft() {
	try {
		const raw = localStorage.getItem(kAddListingDraft)
		if (!raw) return {}
		const parsed = JSON.parse(raw)
		return parsed && typeof parsed === 'object' ? parsed : {}
	} catch (e) {
		console.warn('readAddListingDraft failed:', e)
		return {}
	}
}

function writeAddListingDraft(next) {
	try {
		localStorage.setItem(kAddListingDraft, JSON.stringify(next || {}))
	} catch (e) {
		console.warn('writeAddListingDraft failed:', e)
	}
}

export function saveAddListingDraft(flow, patch) {
	try {
		const key = flow === 'shortlet' || flow === 'sale' || flow === 'rent' ? flow : 'rent'
		const current = readAddListingDraft()
		const currentFlow = current?.[key] && typeof current[key] === 'object' ? current[key] : {}
		const next = {
			...current,
			[key]: {
				...currentFlow,
				...(patch && typeof patch === 'object' ? patch : {})
			}
		}
		writeAddListingDraft(next)
	} catch (e) {
		console.warn('saveAddListingDraft failed:', e)
	}
}

export function getAddListingDraft(flow) {
	const key = flow === 'shortlet' || flow === 'sale' || flow === 'rent' ? flow : 'rent'
	const current = readAddListingDraft()
	const currentFlow = current?.[key] && typeof current[key] === 'object' ? current[key] : {}
	return currentFlow
}