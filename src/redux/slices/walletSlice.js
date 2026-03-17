import { createSlice } from '@reduxjs/toolkit'
import { kWalletSlice } from '../../lib/constants'

const initialState = {
	/** @type {{ total_earnings?: number, currency?: string, formatted_balance?: string }|null} */
	wallet: null,
	/** @type {Array<Record<string,unknown>>} */
	recentTransactions: [],
	/** @type {{ transactions: Array<Record<string,unknown>>, totalCount: number, currentPage: number, perPage: number, lastPage: number }} */
	walletTransactions: { transactions: [], totalCount: 0, currentPage: 1, perPage: 15, lastPage: 1 },
	/** @type {Array<{ name?: string, code?: string }>} */
	banks: [],
	/** @type {Array<{ id?: string, bank_name?: string, account_number?: string, account_name?: string }>} */
	withdrawalMethods: [],
	/** @type {Array<Record<string,unknown>>} */
	withdrawalTransactions: [],
	/** @type {Array<Record<string,unknown>>} */
	depositTransactions: [],
	/** @type {Array<{id?:string,cardholder_name?:string,card_number_last_four?:string,card_brand?:string,expiry_date?:string,expiry_month?:string,expiry_year?:string,country?:string,is_default?:boolean}>} */
	paymentMethods: []
}

const walletSlice = createSlice({
	name: kWalletSlice,
	initialState,
	reducers: {
		updateWallet: (state, action) => {
			state.wallet = action.payload ?? null
		},
		updateRecentTransactions: (state, action) => {
			state.recentTransactions = action.payload ?? []
		},
		updateWalletTransactions: (state, action) => {
			const p = action.payload
			if (!p) return
			state.walletTransactions = {
				transactions: Array.isArray(p.transactions) ? p.transactions : [],
				totalCount: p.totalCount ?? 0,
				currentPage: p.currentPage ?? 1,
				perPage: p.perPage ?? 15,
				lastPage: p.lastPage ?? 1
			}
		},
		updateBanks: (state, action) => {
			state.banks = Array.isArray(action.payload) ? action.payload : []
		},
		updateWithdrawalMethods: (state, action) => {
			state.withdrawalMethods = Array.isArray(action.payload) ? action.payload : []
		},
		updateWithdrawalTransactions: (state, action) => {
			state.withdrawalTransactions = Array.isArray(action.payload) ? action.payload : []
		},
		updateDepositTransactions: (state, action) => {
			state.depositTransactions = Array.isArray(action.payload) ? action.payload : []
		},
		updatePaymentMethods: (state, action) => {
			state.paymentMethods = Array.isArray(action.payload) ? action.payload : []
		}
	}
})

export const { updateWallet, updateRecentTransactions, updateWalletTransactions, updateBanks, updateWithdrawalMethods, updateWithdrawalTransactions, updateDepositTransactions, updatePaymentMethods } = walletSlice.actions

export const selectWallet = (state) =>
	state[kWalletSlice]?.wallet ?? null

export const selectRecentTransactions = (state) =>
	state[kWalletSlice]?.recentTransactions ?? []

export const selectWalletTransactions = (state) =>
	state[kWalletSlice]?.walletTransactions ?? { transactions: [], totalCount: 0, currentPage: 1, perPage: 15, lastPage: 1 }

export const selectBanks = (state) =>
	state[kWalletSlice]?.banks ?? []

export const selectWithdrawalMethods = (state) =>
	state[kWalletSlice]?.withdrawalMethods ?? []

export const selectWithdrawalTransactions = (state) =>
	state[kWalletSlice]?.withdrawalTransactions ?? []

export const selectDepositTransactions = (state) =>
	state[kWalletSlice]?.depositTransactions ?? []

export const selectPaymentMethods = (state) =>
	state[kWalletSlice]?.paymentMethods ?? []

export const selectFormattedBalance = (state) => {
	const w = state[kWalletSlice]?.wallet
	if (!w) return ''
	const b = (w.formatted_balance ?? '').trim()
	if (b.startsWith('₦')) return b
	return b ? `₦${b}` : ''
}

export default walletSlice.reducer
