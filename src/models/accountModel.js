/**
 * Account model – user and auth token from create-password / login API.
 */

/**
 * @typedef {Object} AccountUser
 * @property {string} id
 * @property {string|null} fullname
 * @property {string|null} avatar
 * @property {string} email
 * @property {string} phone
 * @property {string} country
 * @property {string|null} state
 * @property {string|null} city
 * @property {boolean} is_verified
 * @property {boolean} is_landlord
 * @property {boolean} landlord_dashboard
 * @property {boolean} is_kyc_verified
 * @property {string} kyc_status
 * @property {string} available_balance
 * @property {string} balance_currency
 * @property {string|null} email_verified_at
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} AccountData
 * @property {AccountUser} user
 * @property {string} token
 * @property {string} token_type
 * @property {string|null} expires_at
 */

/**
 * @typedef {Object} AccountModel
 * @property {AccountUser} user
 * @property {string} token
 * @property {string} tokenType
 * @property {string|null} expiresAt
 */

/**
 * Maps API create-password / account response data into account model.
 * @param {{ success?: boolean, message?: string, data?: { user?: object, token?: string, token_type?: string, expires_at?: string|null } }} apiResponse - Raw API response (e.g. res.data)
 * @returns {AccountModel|null} Normalized account or null if data missing
 */
export function fromApiResponse(apiResponse) {
	const data = apiResponse?.data
	const user = data?.user
	if (!data || !user) return null

	return {
		user: {
			id: user.id ?? '',
			fullname: user.fullname ?? null,
			avatar: user.avatar ?? null,
			email: user.email ?? '',
			phone: user.phone ?? '',
			country: user.country ?? '',
			state: user.state ?? null,
			city: user.city ?? null,
			is_verified: Boolean(user.is_verified),
			is_landlord: Boolean(user.is_landlord),
			landlord_dashboard: Boolean(user.landlord_dashboard),
			is_kyc_verified: Boolean(user.is_kyc_verified),
			kyc_status: user.kyc_status ?? 'incomplete',
			available_balance: user.available_balance ?? '0.00',
			balance_currency: user.balance_currency ?? 'NGN',
			email_verified_at: user.email_verified_at ?? null,
			created_at: user.created_at ?? '',
			updated_at: user.updated_at ?? '',
		},
		token: data.token ?? '',
		tokenType: data.token_type ?? 'Bearer',
		expiresAt: data.expires_at ?? null,
	}
}

export default { fromApiResponse }
