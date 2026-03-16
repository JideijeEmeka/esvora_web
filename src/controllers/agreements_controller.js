import { store } from '../redux/store'
import { agreementApi } from '../repository/agreement_repository'
import { updateAgreements, updateAgreementDetails } from '../redux/slices/agreementSlice'
import { fromListApiItem, fromDetailsApiResponse } from '../models/agreementModel'

class AgreementsController {
	async listAgreements(callbacks = {}) {
		const { setLoading, onSuccess, onError } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				agreementApi.endpoints.listAgreements.initiate()
			)
			if (res.error) {
				const message =
					res.error?.data?.message ??
					res.error?.data?.error ??
					'Failed to load agreements'
				onError?.(Array.isArray(message) ? message.join(', ') : message)
				return
			}
			const raw = Array.isArray(res.data) ? res.data : []
			const list = raw.map((item) => fromListApiItem(item)).filter(Boolean)
			store.dispatch(updateAgreements(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			const message = err?.data?.message ?? err?.message ?? 'Failed to load agreements'
			onError?.(typeof message === 'string' ? message : 'Failed to load agreements')
		} finally {
			setLoading?.(false)
		}
	}

	async getAgreementDetails(id, callbacks = {}) {
		const { setLoading, onSuccess, onError } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				agreementApi.endpoints.getAgreementDetails.initiate(id)
			)
			if (res.error) {
				const message =
					res.error?.data?.message ??
					res.error?.data?.error ??
					'Failed to load agreement details'
				onError?.(Array.isArray(message) ? message.join(', ') : message)
				return
			}
			const details = fromDetailsApiResponse(res.data)
			store.dispatch(updateAgreementDetails(details))
			onSuccess?.(details)
			return details
		} catch (err) {
			const message =
				err?.data?.message ?? err?.message ?? 'Failed to load agreement details'
			onError?.(typeof message === 'string' ? message : 'Failed to load agreement details')
		} finally {
			setLoading?.(false)
		}
	}
}

export default new AgreementsController()
