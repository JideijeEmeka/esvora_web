import { baseUrl, kTenantEndpoints } from '../lib/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../lib/localStorage'

export const tenantApi = createApi({
	reducerPath: kTenantEndpoints,
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			const token = getToken()
			if (token) headers.set('Authorization', `Bearer ${token}`)
			return headers
		}
	}),
	endpoints: (builder) => ({
		listTenancies: builder.query({
			query: () => ({ url: '/api/v1/tenancy' }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return Array.isArray(raw) ? raw : []
			}
		}),
		getTenancyDetails: builder.query({
			query: (id) => ({ url: `/api/v1/tenancy/${id}` }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return raw && typeof raw === 'object' ? raw : null
			}
		})
	})
})

export const {
	useListTenanciesQuery,
	useLazyListTenanciesQuery,
	useGetTenancyDetailsQuery,
	useLazyGetTenancyDetailsQuery
} = tenantApi
