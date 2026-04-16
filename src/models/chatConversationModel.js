/**
 * @typedef {Object} ChatLastMessagePreview
 * @property {number} id
 * @property {string} message
 * @property {string} type
 * @property {string} sender_type
 * @property {string} created_at
 */

/**
 * @typedef {Object} ChatPropertyBrief
 * @property {string} id
 * @property {string} title
 * @property {string} address
 * @property {string} city
 * @property {string} state
 */

/**
 * @typedef {Object} ChatAgentBrief
 * @property {string} uuid
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 */

/**
 * @typedef {Object} ChatConversation
 * @property {string} id
 * @property {string} status
 * @property {ChatPropertyBrief} property
 * @property {ChatAgentBrief} agent
 * @property {ChatLastMessagePreview|null} last_message
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} GetChatsResponse
 * @property {boolean} success
 * @property {string} message
 * @property {ChatConversation[]} data
 */

const asInt = (v) => {
	const n = Number(v)
	return Number.isFinite(n) ? n : 0
}

/**
 * @param {Record<string, unknown>|null|undefined} raw
 * @returns {ChatLastMessagePreview|null}
 */
export function normalizeChatLastMessagePreview(raw) {
	if (!raw || typeof raw !== 'object') return null
	return {
		id: asInt(raw.id),
		message: raw.message != null ? String(raw.message) : '',
		type: raw.type != null ? String(raw.type) : '',
		sender_type: raw.sender_type != null ? String(raw.sender_type) : '',
		created_at: raw.created_at != null ? String(raw.created_at) : ''
	}
}

/**
 * @param {Record<string, unknown>|null|undefined} raw
 * @returns {ChatPropertyBrief|null}
 */
export function normalizeChatPropertyBrief(raw) {
	if (!raw || typeof raw !== 'object') return null
	return {
		id: raw.id != null ? String(raw.id) : '',
		title: raw.title != null ? String(raw.title) : '',
		address: raw.address != null ? String(raw.address) : '',
		city: raw.city != null ? String(raw.city) : '',
		state: raw.state != null ? String(raw.state) : ''
	}
}

/**
 * @param {Record<string, unknown>|null|undefined} raw
 * @returns {ChatAgentBrief|null}
 */
export function normalizeChatAgentBrief(raw) {
	if (!raw || typeof raw !== 'object') return null
	return {
		uuid: raw.uuid != null ? String(raw.uuid) : '',
		name: raw.name != null ? String(raw.name) : '',
		email: raw.email != null ? String(raw.email) : '',
		phone: raw.phone != null ? String(raw.phone) : ''
	}
}

/**
 * @param {Record<string, unknown>|null|undefined} raw
 * @returns {ChatConversation|null}
 */
export function normalizeChatConversation(raw) {
	if (!raw || typeof raw !== 'object') return null
	const property = normalizeChatPropertyBrief(
		raw.property && typeof raw.property === 'object'
			? /** @type {Record<string, unknown>} */ (raw.property)
			: null
	)
	const agent = normalizeChatAgentBrief(
		raw.agent && typeof raw.agent === 'object'
			? /** @type {Record<string, unknown>} */ (raw.agent)
			: null
	)
	const last_message = normalizeChatLastMessagePreview(
		raw.last_message && typeof raw.last_message === 'object'
			? /** @type {Record<string, unknown>} */ (raw.last_message)
			: null
	)
	return {
		id: raw.id != null ? String(raw.id) : '',
		status: raw.status != null ? String(raw.status) : '',
		property: property ?? {
			id: '',
			title: '',
			address: '',
			city: '',
			state: ''
		},
		agent: agent ?? { uuid: '', name: '', email: '', phone: '' },
		last_message,
		created_at: raw.created_at != null ? String(raw.created_at) : '',
		updated_at: raw.updated_at != null ? String(raw.updated_at) : ''
	}
}

/**
 * Normalizes GET /api/v1/chats JSON body.
 * @param {unknown} body
 * @returns {GetChatsResponse}
 */
export function normalizeGetChatsResponse(body) {
	const o = body && typeof body === 'object' ? /** @type {Record<string, unknown>} */ (body) : {}
	const success = Boolean(o.success)
	const message = typeof o.message === 'string' ? o.message : ''
	const rawList = Array.isArray(o.data) ? o.data : []
	const data = rawList
		.map((item) =>
			normalizeChatConversation(item && typeof item === 'object' ? item : null)
		)
		.filter(Boolean)
	return { success, message, data }
}
