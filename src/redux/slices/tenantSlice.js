import { createSlice } from '@reduxjs/toolkit'
import { kTenantSlice } from '../../lib/constants'

const initialState = {
	/** @type {Array<{id?:string,status?:string,property?:object}>} */
	tenancies: [],
	/** @type {{id?:string,status?:string,property_summary?:object,property_information?:object,landlord?:object}|null} */
	tenancyDetails: null,
	isLoadingTenancies: false,
	isLoadingDetails: false
}

const tenantSlice = createSlice({
	name: kTenantSlice,
	initialState,
	reducers: {
		updateTenancies: (state, action) => {
			state.tenancies = Array.isArray(action.payload) ? action.payload : []
		},
		updateTenancyDetails: (state, action) => {
			state.tenancyDetails = action.payload ?? null
		},
		setLoadingTenancies: (state, action) => {
			state.isLoadingTenancies = !!action.payload
		},
		setLoadingDetails: (state, action) => {
			state.isLoadingDetails = !!action.payload
		}
	}
})

export const { updateTenancies, updateTenancyDetails, setLoadingTenancies, setLoadingDetails } = tenantSlice.actions

export const selectTenancies = (state) => state[kTenantSlice]?.tenancies ?? []
export const selectTenancyDetails = (state) => state[kTenantSlice]?.tenancyDetails ?? null
export const selectIsLoadingTenancies = (state) => state[kTenantSlice]?.isLoadingTenancies ?? false
export const selectIsLoadingDetails = (state) => state[kTenantSlice]?.isLoadingDetails ?? false

export default tenantSlice.reducer
