import { getToken } from './localStorage'
import { store } from '../redux/store'
import { authApi } from '../repository/auth_repository'
import { updateAccount } from '../redux/slices/accountSlice'

/**
 * Checks auth status and redirects:
 * - No token → sign-up
 * - Token + fullname empty/null → update-name
 * - Token + name set → explore
 * @param {(path: string, state?: object) => void} navigate - React Router navigate function
 */
export async function checkAuthStatus(navigate) {
	const token = getToken()
	if (!token) {
		navigate('/sign-up')
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
	const fullname = (user?.fullname ?? user?.full_name ?? '').trim()
	const nameMissing = !fullname
	if (nameMissing) {
		navigate('/update-name')
	} else {
		navigate('/explore')
	}
}
