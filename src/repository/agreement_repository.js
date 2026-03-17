import { baseUrl, kAgreementEndpoints } from '../lib/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../lib/localStorage'

export const agreementApi = createApi({
	reducerPath: kAgreementEndpoints,
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			const token = getToken()
			if (token) headers.set('Authorization', `Bearer ${token}`)
			return headers
		}
	}),
	endpoints: (builder) => ({
		listAgreements: builder.query({
			query: () => ({ url: '/api/v1/agreements' }),
			transformResponse: (res) => {
				const data = res?.data
				return Array.isArray(data) ? data : []
			}
		}),
		getAgreementDetails: builder.query({
			query: (id) => ({ url: `/api/v1/agreements/${id}` }),
			transformResponse: (res) => {
				const data = res?.data
				return data && typeof data === 'object' ? data : null
			}
		})
	})
})

export const {
	useListAgreementsQuery,
	useGetAgreementDetailsQuery,
	useLazyListAgreementsQuery,
	useLazyGetAgreementDetailsQuery
} = agreementApi
