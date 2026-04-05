import { baseUrl } from '../lib/constants'
import { getToken } from '../lib/localStorage'

function authHeaders() {
	const token = getToken()
	return {
		Accept: 'application/json',
		...(token ? { Authorization: `Bearer ${token}` } : {})
	}
}

/**
 * GET /api/v1/kyc — current KYC status (same as Flutter `KycRepository.verifyKycStatus`).
 */
export async function getKycStatus() {
	const res = await fetch(`${baseUrl}/api/v1/kyc`, {
		method: 'GET',
		headers: authHeaders()
	})
	let data = {}
	try {
		data = await res.json()
	} catch {
		// non-JSON body
	}
	if (!res.ok) {
		const msg =
			(typeof data?.message === 'string' && data.message) ||
			`Could not load KYC status (${res.status})`
		throw new Error(msg)
	}
	return data
}

/**
 * @param {unknown} json — body from GET /api/v1/kyc
 * @returns {{ status: string, rejectionReason: string | undefined }}
 */
export function parseKycStatusPayload(json) {
	const payload = json && typeof json === 'object' ? json : {}
	const inner = /** @type {Record<string, unknown>} */ (payload).data
	const block = inner && typeof inner === 'object' ? inner : {}
	const raw = block.status
	const status = typeof raw === 'string' ? raw.trim().toLowerCase() : ''
	const rr = block.rejection_reason
	const rejectionReason =
		typeof rr === 'string' && rr.trim() ? rr.trim() : undefined
	return { status, rejectionReason }
}

/**
 * POST /api/v1/kyc/verify
 * @param {{ idNumber: string, idType: string }} params — idType e.g. "bvn" | "nin"
 */
export async function verifyId({ idNumber, idType }) {
	const headers = {
		'Content-Type': 'application/json',
		...authHeaders()
	}
	const res = await fetch(`${baseUrl}/api/v1/kyc/verify`, {
		method: 'POST',
		headers,
		body: JSON.stringify({ id_number: idNumber, id_type: idType })
	})
	let data = {}
	try {
		data = await res.json()
	} catch {
		// non-JSON body
	}
	if (!res.ok) {
		const msg =
			(typeof data?.message === 'string' && data.message) ||
			(typeof data?.error === 'string' && data.error) ||
			`Verification failed (${res.status})`
		throw new Error(msg)
	}
	return data
}
