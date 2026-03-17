import { createSlice } from '@reduxjs/toolkit'
import { kAgreementSlice } from '../../lib/constants'

/** @typedef {import('../../models/agreementModel').AgreementItem} AgreementItem */
/** @typedef {import('../../models/agreementModel').AgreementDetails} AgreementDetails */

const initialState = {
	/** @type {AgreementItem[]} */
	agreements: [],
	/** @type {AgreementDetails|null} */
	agreementDetails: null
}

const agreementSlice = createSlice({
	name: kAgreementSlice,
	initialState,
	reducers: {
		updateAgreements: (state, action) => {
			state.agreements = action.payload ?? []
		},
		updateAgreementDetails: (state, action) => {
			state.agreementDetails = action.payload ?? null
		}
	}
})

export const { updateAgreements, updateAgreementDetails } = agreementSlice.actions

export const selectAgreements = (state) =>
	state[kAgreementSlice]?.agreements ?? []

export const selectAgreementDetails = (state) =>
	state[kAgreementSlice]?.agreementDetails ?? null

export default agreementSlice.reducer
