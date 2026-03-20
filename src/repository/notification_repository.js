import { baseUrl, kNotificationEndpoints } from '../lib/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../lib/localStorage'
import { fromApiResponse, fromUnreadCountApiResponse } from '../models/notificationModel'

export const notificationApi = createApi({
	reducerPath: kNotificationEndpoints,
	tagTypes: ['Notifications', 'UnreadCount'],
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			const token = getToken()
			if (token) headers.set('Authorization', `Bearer ${token}`)
			return headers
		}
	}),
	endpoints: (builder) => ({
		getNotifications: builder.query({
			query: () => ({ url: '/api/v1/notifications' }),
			providesTags: ['Notifications'],
			transformResponse: (res) => {
				const raw = res?.data ?? res
				return fromApiResponse({ data: raw })
			}
		}),
		getUnreadCount: builder.query({
			query: () => ({ url: '/api/v1/notifications/unread-count' }),
			providesTags: ['UnreadCount'],
			transformResponse: (res) => {
				const raw = res?.data ?? res
				return fromUnreadCountApiResponse({ data: raw })
			}
		}),
		markAsRead: builder.mutation({
			query: (notificationId) => ({
				url: `/api/v1/notifications/${notificationId}/read`,
				method: 'POST'
			}),
			invalidatesTags: ['Notifications', 'UnreadCount']
		}),
		markAllAsRead: builder.mutation({
			query: () => ({
				url: '/api/v1/notifications/read-all',
				method: 'POST'
			}),
			invalidatesTags: ['Notifications', 'UnreadCount']
		})
	})
})

export const {
	useGetNotificationsQuery,
	useLazyGetNotificationsQuery,
	useGetUnreadCountQuery,
	useLazyGetUnreadCountQuery,
	useMarkAsReadMutation,
	useMarkAllAsReadMutation
} = notificationApi
