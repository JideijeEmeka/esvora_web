
import { createSlice } from '@reduxjs/toolkit'
import { kAccountSlice } from '../../lib/constants'

			/** @typedef {import('../../models/accountModel').AccountUser} AccountUser */

const initialState = {
	/** @type {AccountUser|null} */
	account: null,
}

const accountSlice = createSlice({
	name: kAccountSlice,
	initialState,
	reducers: {
		updateAccount: (state, action) => {
			state.account = action.payload
		},
		clearAccount: (state) => {
			state.account = null
		},
	},
})

export const { updateAccount, clearAccount } = accountSlice.actions

																						/**
 * Select current account (user) from store.
 * @param {object} state - Redux root state
 * @returns {AccountUser|null}
 */
export const selectCurrentAccount = (state) => state[kAccountSlice]?.account ?? null

export default accountSlice.reducer
