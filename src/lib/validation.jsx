const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MIN_PHONE_LENGTH = 9

export const validatePassword = (password) => {
	return {
		hasMoreThan6Chars: password.length > 6,
		hasLetter: /[a-zA-Z]/.test(password),
		hasNumber: /[0-9]/.test(password),
		hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	}
}

/**
 * @param {string} email
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateEmail = (email) => {
	const trimmed = (email ?? '').trim()
	if (!trimmed) return { valid: false, message: 'Email is required' }
	if (!EMAIL_REGEX.test(trimmed)) return { valid: false, message: 'Enter a valid email address' }
	return { valid: true }
}

/**
 * @param {{ name: string, isoCode: string } | null} country
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateCountry = (country) => {
	if (!country || !country.isoCode) return { valid: false, message: 'Please select a country' }
	return { valid: true }
}

/**
 * @param {string} phone - E.164 or national format
 * @returns {{ valid: boolean, message?: string }}
 */
export const validatePhone = (phone) => {
	const digits = (phone ?? '').replace(/\D/g, '')
	if (!digits.length) return { valid: false, message: 'Phone number is required' }
	if (digits.length < MIN_PHONE_LENGTH) return { valid: false, message: 'Phone number is too short' }
	if (digits.length > 16) return { valid: false, message: 'Phone number must be 16 digits or less' }
	return { valid: true }
}

/**
 * @param {string} otp - 4-digit code
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateOtp = (otp) => {
	const digits = (otp ?? '').replace(/\D/g, '')
	if (!digits.length) return { valid: false, message: 'Please enter the 4-digit code' }
	if (digits.length !== 4) return { valid: false, message: 'Code must be 4 digits' }
	return { valid: true }
}

/**
 * @param {string} password
 * @param {string} passwordConfirmation
 * @returns {{ valid: boolean, message?: string }}
 */
export const validateCreatePassword = (password, passwordConfirmation) => {
	const p = (password ?? '').trim()
	const c = (passwordConfirmation ?? '').trim()
	if (!p) return { valid: false, message: 'Password is required' }
	const criteria = validatePassword(p)
	if (!criteria.hasMoreThan6Chars) return { valid: false, message: 'Password must be more than 6 characters' }
	if (!criteria.hasLetter) return { valid: false, message: 'Password must contain at least one letter' }
	if (!criteria.hasNumber) return { valid: false, message: 'Password must contain at least one number' }
	if (!criteria.hasSpecialChar) return { valid: false, message: 'Password must contain at least one special character' }
	if (p !== c) return { valid: false, message: 'Passwords do not match' }
	return { valid: true }
}
