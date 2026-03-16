import { kToken } from './constants'


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