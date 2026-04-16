/**
 * @typedef {Object} ChatMessage
 * @property {number} id
 * @property {number} conversation_id
 * @property {number} sender_id
 * @property {string} sender_type
 * @property {string} message
 * @property {string} type
 * @property {boolean} is_read
 * @property {string} created_at
 */

/**
 * @typedef {Object} ChatsListResponse
 * @property {boolean} success
 * @property {string} message
 * @property {ChatMessage[]} data
 */

/**
 * @typedef {Object} SendChatMessageResponse
 * @property {boolean} success
 * @property {string} message
 * @property {ChatMessage|null} data
 */

const asInt = (v) => {
	const n = Number(v)
	return Number.isFinite(n) ? n : 0
}

/**
 * @param {Record<string, unknown>|null|undefined} raw
 * @returns {ChatMessage|null}
 */
export function normalizeChatMessage(raw) {
	if (!raw || typeof raw !== 'object') return null
	return {
		id: asInt(raw.id),
		conversation_id: asInt(raw.conversation_id),
		sender_id: asInt(raw.sender_id),
		sender_type: raw.sender_type != null ? String(raw.sender_type) : '',
		message: raw.message != null ? String(raw.message) : '',
		type: raw.type != null ? String(raw.type) : '',
		is_read: raw.is_read === true || raw.is_read === 1,
		created_at: raw.created_at != null ? String(raw.created_at) : ''
	}
}

/**
 * Normalizes GET /api/v1/properties/:id/chat JSON body.
 * @param {unknown} body
 * @returns {ChatsListResponse}
 */
export function normalizeChatsResponse(body) {
	const o = body && typeof body === 'object' ? /** @type {Record<string, unknown>} */ (body) : {}
	const success = Boolean(o.success)
	const message = typeof o.message === 'string' ? o.message : ''
	const rawList = Array.isArray(o.data) ? o.data : []
	const data = rawList
		.map((item) => normalizeChatMessage(item && typeof item === 'object' ? item : null))
		.filter(Boolean)
	return { success, message, data }
}

/**
 * Normalizes POST /api/v1/properties/:id/chat/message JSON body (`data` is one message).
 * @param {unknown} body
 * @returns {SendChatMessageResponse}
 */
export function normalizeSendMessageResponse(body) {
	const o = body && typeof body === 'object' ? /** @type {Record<string, unknown>} */ (body) : {}
	const success = Boolean(o.success)
	const message = typeof o.message === 'string' ? o.message : ''
	const raw = o.data
	const data =
		raw && typeof raw === 'object'
			? normalizeChatMessage(/** @type {Record<string, unknown>} */ (raw))
			: null
	return { success, message, data }
}
