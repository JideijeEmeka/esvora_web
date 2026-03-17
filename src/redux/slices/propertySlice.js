import { createSlice } from '@reduxjs/toolkit'
import { kPropertySlice } from '../../lib/constants'
import { kPropertyEndpoints } from '../../lib/constants'

const initialState = {
	/** @type {Array<Record<string,unknown>>} */
	properties: [],
	/** @type {Array<Record<string,unknown>>} */
	landlordRequests: [],
	/** @type {Array<Record<string,unknown>>} */
	myRequests: [],
	/** @type {Record<string,unknown>|null} */
	propertyDetails: null,
	/** @type {Record<string,unknown>|null} */
	showRequest: null,
	/** @type {Array<Record<string,unknown>>} */
	propertyTypes: [],
	/** @type {Record<string,unknown>|null} */
	propertyTypeDetails: null,
	landlordProperties: []
}

const propertySlice = createSlice({
	name: kPropertySlice,
	initialState,
	reducers: {
		updateProperties: (state, action) => {
			state.properties = Array.isArray(action.payload) ? action.payload : []
		},
		updateLandlordRequests: (state, action) => {
			state.landlordRequests = Array.isArray(action.payload) ? action.payload : []
		},
		updateMyRequests: (state, action) => {
			state.myRequests = Array.isArray(action.payload) ? action.payload : []
		},
		updatePropertyDetails: (state, action) => {
			state.propertyDetails = action.payload ?? null
		},
		updateShowRequest: (state, action) => {
			state.showRequest = action.payload ?? null
		},
		updatePropertyTypes: (state, action) => {
			state.propertyTypes = Array.isArray(action.payload) ? action.payload : []
		},
		updatePropertyTypeDetails: (state, action) => {
			state.propertyTypeDetails = action.payload ?? null
		},
		updateLandlordProperties: (state, action) => {
			state.landlordProperties = Array.isArray(action.payload) ? action.payload : []
		}
	}
})

export const {
	updateProperties,
	updateLandlordRequests,
	updateMyRequests,
	updatePropertyDetails,
	updateShowRequest,
	updatePropertyTypes,
	updatePropertyTypeDetails,
	updateLandlordProperties
} = propertySlice.actions

export const selectProperties = (state) => state[kPropertySlice]?.properties ?? []
export const selectLandlordRequests = (state) => state[kPropertySlice]?.landlordRequests ?? []
export const selectMyRequests = (state) => state[kPropertySlice]?.myRequests ?? []
export const selectPropertyDetails = (state) => state[kPropertySlice]?.propertyDetails ?? null
export const selectShowRequest = (state) => state[kPropertySlice]?.showRequest ?? null
export const selectPropertyTypes = (state) => state[kPropertySlice]?.propertyTypes ?? []
export const selectPropertyTypeDetails = (state) => state[kPropertySlice]?.propertyTypeDetails ?? null
export const selectLandlordProperties = (state) => state[kPropertySlice]?.landlordProperties ?? []

export default propertySlice.reducer
