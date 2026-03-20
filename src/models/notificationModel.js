/**
 * Notification model – from GET /api/v1/notifications.
 */

/**
 * @typedef {Object} NotificationActionButton
 * @property {string} label
 * @property {string} action
 */

/**
 * @typedef {Object} NotificationData
 * @property {string} [property_request_uuid]
 * @property {string} [property_uuid]
 * @property {string} [property_request_status]
 * @property {string} [buyer_name]
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} type
 * @property {string} type_label
 * @property {string} title
 * @property {string} body
 * @property {string} time_ago
 * @property {string} created_at
 * @property {boolean} is_read
 * @property {string|null} image
 * @property {string|null} icon
 * @property {NotificationActionButton[]} action_buttons
 * @property {string|null} action_url
 * @property {NotificationData|null} data
 */

/**
 * @typedef {Object} NotificationsResponse
 * @property {Notification[]} all
 * @property {Notification[]} today
 * @property {Notification[]} last_7_days
 * @property {number} unread_count
 */

/**
 * @typedef {Object} NotificationApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {NotificationsResponse} data
 */

/**
 * @typedef {Object} UnreadCountApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {{ unread_count: number }} data
 */

/**
 * Parse unread count from GET /api/v1/notifications/unread-count.
 * @param {{ success?: boolean, message?: string, data?: { unread_count?: number } }} apiResponse
 * @returns {number}
 */
export function fromUnreadCountApiResponse(apiResponse) {
	const data = apiResponse?.data ?? {}
	return Number(data.unread_count ?? 0)
}

/**
 * Normalize a single notification from API.
 * @param {Record<string, unknown>} raw
 * @returns {Notification}
 */
function normalizeNotification(raw) {
	const actionButtons = Array.isArray(raw?.action_buttons)
		? raw.action_buttons.map((b) => ({
				label: b?.label ?? '',
				action: b?.action ?? ''
			}))
		: []
	return {
		id: raw?.id ?? '',
		type: raw?.type ?? '',
		type_label: raw?.type_label ?? '',
		title: raw?.title ?? '',
		body: raw?.body ?? '',
		time_ago: raw?.time_ago ?? '',
		created_at: raw?.created_at ?? '',
		is_read: Boolean(raw?.is_read),
		image: raw?.image ?? null,
		icon: raw?.icon ?? null,
		action_buttons: actionButtons,
		action_url: raw?.action_url ?? null,
		data: raw?.data && typeof raw.data === 'object' ? raw.data : null
	}
}

/**
 * Maps API notifications response into normalized model.
 * @param {{ success?: boolean, message?: string, data?: { all?: unknown[], today?: unknown[], last_7_days?: unknown[], unread_count?: number } }} apiResponse
 * @returns {NotificationsResponse}
 */
export function fromApiResponse(apiResponse) {
	const data = apiResponse?.data ?? {}
	const all = Array.isArray(data.all) ? data.all.map(normalizeNotification) : []
	const today = Array.isArray(data.today) ? data.today.map(normalizeNotification) : []
	const last7Days = Array.isArray(data.last_7_days) ? data.last_7_days.map(normalizeNotification) : []

	return {
		all,
		today,
		last_7_days: last7Days,
		unread_count: Number(data.unread_count ?? 0)
	}
}

export default { fromApiResponse, normalizeNotification }
