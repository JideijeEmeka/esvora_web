import { setDeviceLocationSnapshot } from '../redux/slices/deviceLocationSlice'

/**
 * Request browser geolocation once at startup. Non-blocking; ignores denial/errors.
 * Requires secure context (HTTPS) on most browsers.
 *
 * @param {import('@reduxjs/toolkit').Dispatch} dispatch
 */
export function captureDeviceLocationOnLaunch(dispatch) {
	if (typeof navigator === 'undefined' || !navigator.geolocation) return

	navigator.geolocation.getCurrentPosition(
		(pos) => {
			dispatch(
				setDeviceLocationSnapshot({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
					accuracyMeters:
						pos.coords.accuracy != null && Number.isFinite(pos.coords.accuracy)
							? pos.coords.accuracy
							: null,
					capturedAt: Date.now(),
				}),
			)
		},
		() => {
			// Permission denied, timeout, or unavailable — optional for UX.
		},
		{
			enableHighAccuracy: false,
			maximumAge: 300_000,
			timeout: 20_000,
		},
	)
}
