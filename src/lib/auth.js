import { getToken } from './localStorage'
import { store } from '../redux/store'
import { authApi } from '../repository/auth_repository'
import { updateAccount } from '../redux/slices/accountSlice'
import { kAccountSlice } from './constants'

/**
 * Checks auth status and redirects:
 * - No token → explore
 * - Token + fullname empty/null → update-name
 * - Token + name set → explore
 * @param {(path: string, state?: object) => void} navigate - React Router navigate function
 */
export async function checkAuthStatus(navigate) {
	const token = getToken()
	const hasToken = typeof token === 'string' && token.trim().length > 0
	if (!hasToken) {
		navigate('/explore')
		return
	}
	const res = await store.dispatch(authApi.endpoints.getProfile.initiate())
	if (res.error) {
		navigate('/explore')
		return
	}
	const user = res.data?.data?.user ?? res.data?.user
	if (user) {
		store.dispatch(updateAccount(user))
	}
	const landlordDashboardEnabled = Boolean(
		user?.landlord_dashboard ?? user?.landlordDashboard
	)
	if (landlordDashboardEnabled) {
		navigate('/property-owner')
		return
	}
	const fullname = (user?.fullname ?? user?.full_name ?? '').trim()
	const nameMissing = !fullname
	if (nameMissing) {
		navigate('/update-name')
	} else {
		navigate('/explore')
	}
}

/**
 * Refreshes profile then routes to the correct shell — mirrors Flutter
 * `Utility.navigateToTheRightView` (landlord main vs tenant main).
 * @param {(path: string, opts?: { replace?: boolean }) => void} navigate
 */
export async function navigateToAppHome(navigate) {
	const opts = { replace: true }
	const token = getToken()
	if (typeof token !== 'string' || !token.trim()) {
		navigate('/explore', opts)
		return
	}
	try {
		const res = await store.dispatch(authApi.endpoints.getProfile.initiate())
		if (!res.error) {
			const user = res.data?.data?.user ?? res.data?.user
			if (user) store.dispatch(updateAccount(user))
			const landlordDashboardEnabled = Boolean(
				user?.landlord_dashboard ?? user?.landlordDashboard
			)
			if (landlordDashboardEnabled) {
				navigate('/property-owner', opts)
				return
			}
			const fullname = (user?.fullname ?? user?.full_name ?? '').trim()
			if (!fullname) {
				navigate('/update-name', opts)
				return
			}
		}
	} catch {
		// fall through to client-side account
	}

	const account = store.getState()[kAccountSlice]?.account
	const landlord = Boolean(
		account?.landlord_dashboard ?? account?.landlordDashboard
	)
	if (landlord) {
		navigate('/property-owner', opts)
		return
	}
	const fullname = (account?.fullname ?? account?.full_name ?? '').trim()
	if (!fullname) {
		navigate('/update-name', opts)
		return
	}
	navigate('/explore', opts)
}
