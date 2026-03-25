import { createSlice } from '@reduxjs/toolkit'
import { kDeviceLocationSlice } from '../../lib/constants'

/**
 * Best-effort GPS from the browser when the app loads. Null until/unless captured.
 * @typedef {{ latitude: number, longitude: number, accuracyMeters: number|null, capturedAt: number }|null} DeviceLocationSnapshot
 */

const initialState = {
	/** @type {DeviceLocationSnapshot} */
	snapshot: null,
}

const deviceLocationSlice = createSlice({
	name: kDeviceLocationSlice,
	initialState,
	reducers: {
		setDeviceLocationSnapshot: (state, action) => {
			state.snapshot = action.payload
		},
		clearDeviceLocation: (state) => {
			state.snapshot = null
		},
	},
})

export const { setDeviceLocationSnapshot, clearDeviceLocation } = deviceLocationSlice.actions

/** @param {object} state */
export const selectDeviceLocationSnapshot = (state) =>
	state[kDeviceLocationSlice]?.snapshot ?? null

export default deviceLocationSlice.reducer
