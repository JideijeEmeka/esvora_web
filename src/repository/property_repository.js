import { baseUrl, kPropertyEndpoints } from '../lib/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../lib/localStorage'

export const propertyApi = createApi({
	reducerPath: kPropertyEndpoints,
	keepUnusedDataFor: 300,
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			const token = getToken()
			if (token) headers.set('Authorization', `Bearer ${token}`)
			return headers
		}
	}),
	endpoints: (builder) => ({
		// Landlord
		listLandlordRequests: builder.query({
			query: () => ({ url: '/api/v1/landlord/requests' }),
			keepUnusedDataFor: 300,
			refetchOnMountOrArgChange: false
		}),
		showRequest: builder.query({
			query: (id) => ({ url: `/api/v1/landlord/requests/${id}` })
		}),
		acceptRequest: builder.mutation({
			query: (requestId) => ({
				url: `/api/v1/landlord/requests/${requestId}/accept`,
				method: 'POST'
			})
		}),
		declineRequest: builder.mutation({
			query: (requestId) => ({
				url: `/api/v1/landlord/requests/${requestId}/decline`,
				method: 'POST'
			})
		}),
		listLandlordProperties: builder.query({
			query: () => ({ url: '/api/v1/landlord/properties' }),
			keepUnusedDataFor: 300,
			refetchOnMountOrArgChange: false
		}),
		viewProperty: builder.query({
			query: (uuid) => ({ url: `/api/v1/landlord/properties/${uuid}` })
		}),
		updateProperty: builder.mutation({
			query: (body) => ({
				url: `/api/v1/landlord/properties/${body.uuid}`,
				method: 'PUT',
				body: { title: body.title, status: body.status }
			})
		}),
		deleteProperty: builder.mutation({
			query: (uuid) => ({
				url: `/api/v1/landlord/properties/${uuid}`,
				method: 'DELETE'
			})
		}),
		createPropertyForRent: builder.mutation({
			query: (body) => ({
				url: '/api/v1/landlord/properties',
				method: 'POST',
				body
			})
		}),
		createPropertyForShortlet: builder.mutation({
			query: (body) => ({
				url: '/api/v1/landlord/properties',
				method: 'POST',
				body
			})
		}),
		createPropertyForSale: builder.mutation({
			query: (body) => ({
				url: '/api/v1/landlord/properties',
				method: 'POST',
				body
			})
		}),
		// Tenant / Public
		listMyRequests: builder.query({
			query: () => ({ url: '/api/v1/requests' })
		}),
		submitRequestForRent: builder.mutation({
			query: (body) => ({
				url: '/api/v1/requests',
				method: 'POST',
				body
			})
		}),
		submitRequestForSales: builder.mutation({
			query: (body) => ({
				url: '/api/v1/requests',
				method: 'POST',
				body
			})
		}),
		submitRequestForShortlet: builder.mutation({
			query: (body) => ({
				url: '/api/v1/requests',
				method: 'POST',
				body
			})
		}),
		getAllProperties: builder.query({
			query: () => ({ url: '/api/v1/properties' }),
			keepUnusedDataFor: 300,
			refetchOnMountOrArgChange: false
		}),
		getPropertyDetails: builder.query({
			query: (uuid) => ({ url: `/api/v1/properties/${uuid}` })
		}),
		getPropertyTypesList: builder.query({
			query: () => ({ url: '/api/v1/property-types/list' })
		}),
		getPropertyTypeDetails: builder.query({
			query: (id) => ({ url: `/api/v1/property-types/${id}` })
		}),
		searchProperties: builder.query({
			query: (query) => ({
				url: '/api/v1/search',
				params: { search: (query ?? '').trim() }
			})
		}),
		filterProperties: builder.query({
			query: (params) => {
				const q = {}
				if (params?.state) q.state = params.state
				if (params?.city) q.city = params.city
				if (params?.search) q.search = params.search
				if (params?.bedrooms != null) q.bedrooms = params.bedrooms
				if (params?.bathrooms != null) q.bathrooms = params.bathrooms
				if (params?.min_price != null) q.min_price = params.min_price
				if (params?.max_price != null) q.max_price = params.max_price
				if (params?.furnishing) q.furnishing = params.furnishing
				if (params?.property_range) q.property_range = params.property_range
				if (params?.property_type) q.property_type = params.property_type
				return { url: '/api/v1/search', params: q }
			}
		}),
		addReview: builder.mutation({
			query: ({ propertyId, rating, sentiment, tags, comment }) => ({
				url: `/api/v1/properties/${propertyId}/reviews`,
				method: 'POST',
				body: { rating, sentiment, tags, comment }
			})
		})
	})
})

export const {
	useListLandlordRequestsQuery,
	useLazyListLandlordRequestsQuery,
	useShowRequestQuery,
	useLazyShowRequestQuery,
	useAcceptRequestMutation,
	useDeclineRequestMutation,
	useListLandlordPropertiesQuery,
	useLazyListLandlordPropertiesQuery,
	useViewPropertyQuery,
	useLazyViewPropertyQuery,
	useUpdatePropertyMutation,
	useDeletePropertyMutation,
	useCreatePropertyForRentMutation,
	useCreatePropertyForShortletMutation,
	useCreatePropertyForSaleMutation,
	useListMyRequestsQuery,
	useLazyListMyRequestsQuery,
	useSubmitRequestForRentMutation,
	useSubmitRequestForSalesMutation,
	useSubmitRequestForShortletMutation,
	useGetAllPropertiesQuery,
	useLazyGetAllPropertiesQuery,
	useGetPropertyDetailsQuery,
	useLazyGetPropertyDetailsQuery,
	useGetPropertyTypesListQuery,
	useLazyGetPropertyTypesListQuery,
	useGetPropertyTypeDetailsQuery,
	useLazyGetPropertyTypeDetailsQuery,
	useSearchPropertiesQuery,
	useLazySearchPropertiesQuery,
	useFilterPropertiesQuery,
	useLazyFilterPropertiesQuery,
	useAddReviewMutation
} = propertyApi
