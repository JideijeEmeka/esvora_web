import { store } from '../redux/store'
import { notificationApi } from '../repository/notification_repository'
import { baseUrl } from '../lib/constants'

const errMsg = (err, fallback) => {
	const m = err?.data?.message ?? err?.data?.error ?? err?.message
	return typeof m === 'string' ? m : (Array.isArray(m) ? m.join(', ') : fallback)
}

class NotificationController {
	async getUnreadCount(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				notificationApi.endpoints.getUnreadCount.initiate(undefined, {
					forceRefetch: !!forceRefetch
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to get unread count'))
				return 0
			}
			const count = res.data ?? 0
			onSuccess?.(count)
			return count
		} catch (e) {
			onError?.(errMsg(e, 'Failed to get unread count'))
			return 0
		}
	}

	async getNotifications(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				notificationApi.endpoints.getNotifications.initiate(undefined, {
					forceRefetch: !!forceRefetch
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load notifications'))
				return null
			}
			const data = res.data
			onSuccess?.(data)
			return data
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load notifications'))
			return null
		}
	}

	async markAsRead(notificationId, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				notificationApi.endpoints.markAsRead.initiate(notificationId)
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to mark notification as read'))
				return false
			}
			onSuccess?.()
			return true
		} catch (e) {
			onError?.(errMsg(e, 'Failed to mark notification as read'))
			return false
		}
	}

	async markAllAsRead(cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				notificationApi.endpoints.markAllAsRead.initiate()
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to mark all as read'))
				return false
			}
			const markedCount = res.data?.data?.marked_count ?? res.data?.marked_count ?? 0
			onSuccess?.(markedCount)
			return markedCount
		} catch (e) {
			onError?.(errMsg(e, 'Failed to mark all as read'))
			return false
		}
	}
}

const notificationController = new NotificationController()
export default notificationController
