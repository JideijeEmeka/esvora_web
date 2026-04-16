import { store } from '../redux/store'
import { chatApi } from '../repository/chat_repository'
import { normalizeChatsResponse, normalizeSendMessageResponse } from '../models/chatMessageModel'
import { normalizeGetChatsResponse } from '../models/chatConversationModel'

const errMsg = (err, fallback) => {
	const m = err?.data?.message ?? err?.data?.error ?? err?.message
	return typeof m === 'string' ? m : (Array.isArray(m) ? m.join(', ') : fallback)
}

class ChatController {
	/**
	 * GET /api/v1/chats
	 * @param {{ onSuccess?: (res: import('../models/chatConversationModel').GetChatsResponse) => void, onError?: (msg: string) => void, forceRefetch?: boolean }} [cb]
	 */
	async getChats(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				chatApi.endpoints.getChats.initiate(undefined, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				const msg = errMsg(res.error, 'Failed to load chats')
				onError?.(msg)
				return { success: false, message: msg, data: [] }
			}
			const normalized = normalizeGetChatsResponse(res.data)
			onSuccess?.(normalized)
			return normalized
		} catch (e) {
			const msg = errMsg(e, 'Failed to load chats')
			onError?.(msg)
			return { success: false, message: msg, data: [] }
		}
	}

	/**
	 * GET /api/v1/properties/:propertyId/chat
	 * @param {string} propertyId
	 * @param {{ onSuccess?: (res: { success: boolean, message: string, data: unknown[] }) => void, onError?: (msg: string) => void, forceRefetch?: boolean }} [cb]
	 */
	async getChatMessages(propertyId, cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		const id = typeof propertyId === 'string' ? propertyId.trim() : ''
		if (!id) {
			const empty = { success: false, message: 'Invalid property', data: [] }
			onError?.('Invalid property')
			return empty
		}
		try {
			const res = await store.dispatch(
				chatApi.endpoints.getChatMessages.initiate(id, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				const msg = errMsg(res.error, 'Failed to load chats')
				onError?.(msg)
				return { success: false, message: msg, data: [] }
			}
			const normalized = normalizeChatsResponse(res.data)
			onSuccess?.(normalized)
			return normalized
		} catch (e) {
			const msg = errMsg(e, 'Failed to load chats')
			onError?.(msg)
			return { success: false, message: msg, data: [] }
		}
	}

	/**
	 * POST /api/v1/properties/:propertyId/chat/message
	 * @param {string} propertyId
	 * @param {string} message
	 * @param {{ onSuccess?: (res: { success: boolean, message: string, data: unknown }) => void, onError?: (msg: string) => void }} [cb]
	 */
	async sendMessage(propertyId, message, cb = {}) {
		const { onSuccess, onError } = cb
		const id = typeof propertyId === 'string' ? propertyId.trim() : ''
		const text = typeof message === 'string' ? message.trim() : ''
		if (!id) {
			onError?.('Invalid property')
			return { success: false, message: 'Invalid property', data: null }
		}
		if (!text) {
			onError?.('Message is empty')
			return { success: false, message: 'Message is empty', data: null }
		}
		try {
			const res = await store.dispatch(
				chatApi.endpoints.sendMessage.initiate({ propertyId: id, message: text })
			)
			if (res.error) {
				const msg = errMsg(res.error, 'Failed to send message')
				onError?.(msg)
				return { success: false, message: msg, data: null }
			}
			const normalized = normalizeSendMessageResponse(res.data)
			onSuccess?.(normalized)
			return normalized
		} catch (e) {
			const msg = errMsg(e, 'Failed to send message')
			onError?.(msg)
			return { success: false, message: msg, data: null }
		}
	}
}

export default new ChatController()
