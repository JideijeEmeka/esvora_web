import { baseUrl, kWalletEndpoints } from '../lib/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../lib/localStorage'

export const walletApi = createApi({
	reducerPath: kWalletEndpoints,
	baseQuery: fetchBaseQuery({
		baseUrl,
		prepareHeaders: (headers) => {
			const token = getToken()
			if (token) headers.set('Authorization', `Bearer ${token}`)
			return headers
		}
	}),
	endpoints: (builder) => ({
		getWalletBalance: builder.query({
			query: () => ({ url: '/api/v1/wallet/balance' }),
			transformResponse: (res) => {
				const data = res?.data
				const raw = data?.data ?? data
				return raw && typeof raw === 'object' ? raw : null
			}
		}),
		getRecentTransactions: builder.query({
			query: () => ({ url: '/api/v1/wallet/transactions/recent' }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return Array.isArray(raw) ? raw : []
			}
		}),
		getTransactions: builder.query({
			query: (page = 1) => ({ url: '/api/v1/wallet/transactions', params: { page } }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				if (!raw || typeof raw !== 'object') return { transactions: [], totalCount: 0, currentPage: 1, perPage: 15, lastPage: 1 }
				const txList = Array.isArray(raw.transactions) ? raw.transactions : []
				return {
					transactions: txList,
					totalCount: raw.total_count ?? raw.totalCount ?? txList.length,
					currentPage: raw.current_page ?? raw.currentPage ?? 1,
					perPage: raw.per_page ?? raw.perPage ?? 15,
					lastPage: raw.last_page ?? raw.lastPage ?? 1
				}
			}
		}),
		listBanks: builder.query({
			query: () => ({ url: '/api/v1/banks' }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				const list = raw?.banks
				return Array.isArray(list) ? list : []
			}
		}),
		getWithdrawalMethods: builder.query({
			query: () => ({ url: '/api/v1/withdrawals/methods' }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return Array.isArray(raw) ? raw : []
			}
		}),
		previewWithdrawal: builder.mutation({
			query: (body) => ({
				url: '/api/v1/withdrawals/preview',
				method: 'POST',
				body: {
					amount: body.amount,
					withdrawal_method_uuid: body.withdrawalMethodUuid
				}
			}),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return raw && typeof raw === 'object' ? raw : null
			}
		}),
		createWithdrawal: builder.mutation({
			query: (body) => ({
				url: '/api/v1/withdrawals',
				method: 'POST',
				body: {
					amount: body.amount,
					withdrawal_method_uuid: body.withdrawalMethodUuid
				}
			})
		}),
		getWithdrawalTransactions: builder.query({
			query: () => ({ url: '/api/v1/withdrawals' }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return Array.isArray(raw) ? raw : []
			}
		}),
		getDepositTransactions: builder.query({
			query: () => ({ url: '/api/v1/deposits' }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return Array.isArray(raw) ? raw : []
			}
		}),
		addWithdrawalMethod: builder.mutation({
			query: (body) => ({
				url: '/api/v1/withdrawals/methods',
				method: 'POST',
				body: {
					bank_name: body.bankName,
					account_number: body.accountNumber,
					account_name: body.accountName
				}
			})
		}),
		updateWithdrawalMethod: builder.mutation({
			query: ({ methodId, bankName, accountNumber, accountName }) => ({
				url: `/api/v1/withdrawals/methods/${methodId}`,
				method: 'PUT',
				body: { bank_name: bankName, account_number: accountNumber, account_name: accountName }
			})
		}),
		deleteWithdrawalMethod: builder.mutation({
			query: (methodId) => ({
				url: `/api/v1/withdrawals/methods/${methodId}`,
				method: 'DELETE'
			})
		}),
		initializeDeposit: builder.mutation({
			query: (body) => ({
				url: '/api/v1/deposits/initialize',
				method: 'POST',
				body: {
					amount: body.amount,
					gateway: body.gateway,
					callback_url: body.callbackUrl ?? body.callback_url ?? ''
				}
			}),
			transformResponse: (res) => {
				const data = res?.data?.data ?? res?.data
				return data && typeof data === 'object' ? data : null
			}
		}),
		initializePayment: builder.mutation({
			query: (body) => ({
				url: '/api/v1/deposits/initialize',
				method: 'POST',
				body: {
					amount: body.amount,
					gateway: body.gateway,
					callback_url: body.callbackUrl ?? body.callback_url ?? ''
				}
			}),
			transformResponse: (res) => {
				const data = res?.data?.data ?? res?.data
				return data && typeof data === 'object' ? data : null
			}
		}),
		verifyDeposit: builder.mutation({
			query: ({ reference }) => ({
				url: '/api/v1/deposits/verify',
				method: 'POST',
				body: { reference }
			}),
			transformResponse: (res) => {
				const data = res?.data ?? res
				return data && typeof data === 'object' ? data : null
			}
		}),
		listPaymentMethods: builder.query({
			query: () => ({ url: '/api/v1/payment-methods' }),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return Array.isArray(raw) ? raw : []
			}
		}),
		createPaymentMethod: builder.mutation({
			query: (body) => ({
				url: '/api/v1/payment-methods',
				method: 'POST',
				body: {
					card_number: body.cardNumber,
					expiry_date: body.expiryDate,
					cvv: body.cvv,
					cardholder_name: body.cardholderName,
					country: body.country,
					is_default: body.isDefault ?? true
				}
			}),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return raw && typeof raw === 'object' ? raw : null
			}
		}),
		updatePaymentMethod: builder.mutation({
			query: ({ id, expiryDate, cardholderName, isDefault }) => ({
				url: `/api/v1/payment-methods/${id}`,
				method: 'PUT',
				body: {
					expiry_date: expiryDate,
					cardholder_name: cardholderName,
					is_default: isDefault ?? false
				}
			}),
			transformResponse: (res) => {
				const raw = res?.data?.data ?? res?.data
				return raw && typeof raw === 'object' ? raw : null
			}
		}),
		deletePaymentMethod: builder.mutation({
			query: (id) => ({
				url: `/api/v1/payment-methods/${id}`,
				method: 'DELETE'
			})
		}),
		approvePayment: builder.mutation({
			query: (body) => ({
				url: '/api/v1/payments/initialize',
				method: 'POST',
				body: {
					amount: body.amount,
					payment_method_uuid: body.paymentMethodUuid,
					property_request_id: body.propertyRequestId
				}
			}),
			transformResponse: (res) => {
				const data = res?.data ?? res
				return data && typeof data === 'object' ? data : null
			}
		})
	})
})

export const {
	useGetWalletBalanceQuery,
	useLazyGetWalletBalanceQuery,
	useGetRecentTransactionsQuery,
	useLazyGetRecentTransactionsQuery,
	useGetTransactionsQuery,
	useLazyGetTransactionsQuery,
	useListBanksQuery,
	useLazyListBanksQuery,
	useGetWithdrawalMethodsQuery,
	useLazyGetWithdrawalMethodsQuery,
	usePreviewWithdrawalMutation,
	useCreateWithdrawalMutation,
	useAddWithdrawalMethodMutation,
	useUpdateWithdrawalMethodMutation,
	useDeleteWithdrawalMethodMutation,
	useInitializeDepositMutation,
	useInitializePaymentMutation,
	useVerifyDepositMutation,
	useGetWithdrawalTransactionsQuery,
	useLazyGetWithdrawalTransactionsQuery,
	useGetDepositTransactionsQuery,
	useLazyGetDepositTransactionsQuery,
	useListPaymentMethodsQuery,
	useLazyListPaymentMethodsQuery,
	useCreatePaymentMethodMutation,
	useUpdatePaymentMethodMutation,
	useDeletePaymentMethodMutation,
	useApprovePaymentMutation
} = walletApi
