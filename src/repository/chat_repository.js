import { baseUrl, kChatEndpoints } from '../lib/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../lib/localStorage'

export const chatApi = createApi({
	reducerPath: kChatEndpoints,
	keepUnusedDataFor: 120,
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			const token = getToken()
			if (token) headers.set('Authorization', `Bearer ${token}`)
			return headers
		}
	}),
	endpoints: (builder) => ({
		getChats: builder.query({
			query: () => ({ url: '/api/v1/chats' })
		}),
		getChatMessages: builder.query({
			query: (propertyId) => ({
				url: `/api/v1/properties/${propertyId}/chat`
			})
		}),
		sendMessage: builder.mutation({
			query: ({ propertyId, message }) => ({
				url: `/api/v1/properties/${propertyId}/chat/message`,
				method: 'POST',
				body: { message }
			})
		})
	})
})

export const {
	useGetChatsQuery,
	useLazyGetChatsQuery,
	useGetChatMessagesQuery,
	useLazyGetChatMessagesQuery,
	useSendMessageMutation
} = chatApi
