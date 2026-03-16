import { store } from '../redux/store'
import { tenantApi } from '../repository/tenant_repository'
import { updateTenancies, updateTenancyDetails, setLoadingTenancies, setLoadingDetails } from '../redux/slices/tenantSlice'

const errMsg = (err, fallback) => {
	const m = err?.data?.message ?? err?.data?.error ?? err?.message
	return typeof m === 'string' ? m : (Array.isArray(m) ? m.join(', ') : fallback)
}

class TenantController {
	async listTenancies(callbacks = {}) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		store.dispatch(setLoadingTenancies(true))
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				tenantApi.endpoints.listTenancies.initiate(undefined, {
					forceRefetch: forceRefetch ?? true
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load tenancies'))
				return
			}
			const list = Array.isArray(res.data) ? res.data : []
			store.dispatch(updateTenancies(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			onError?.(errMsg(err, 'Failed to load tenancies'))
		} finally {
			store.dispatch(setLoadingTenancies(false))
			setLoading?.(false)
		}
	}

	async getTenancyDetails(callbacks = {}) {
		const { id, setLoading, onSuccess, onError, forceRefetch } = callbacks
		if (!id) return
		store.dispatch(setLoadingDetails(true))
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				tenantApi.endpoints.getTenancyDetails.initiate(id, {
					forceRefetch: forceRefetch ?? true
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load tenancy details'))
				return
			}
			const details = res.data
			store.dispatch(updateTenancyDetails(details))
			onSuccess?.(details)
			return details
		} catch (err) {
			onError?.(errMsg(err, 'Failed to load tenancy details'))
		} finally {
			store.dispatch(setLoadingDetails(false))
			setLoading?.(false)
		}
	}
}

const tenantController = new TenantController()
export default tenantController
