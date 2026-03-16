import { store } from '../redux/store'
import { walletApi } from '../repository/wallet_repository'
import { updatePaymentMethods } from '../redux/slices/walletSlice'

const errMsg = (err, fallback) => {
	const m = err?.data?.message ?? err?.data?.error ?? err?.message
	return typeof m === 'string' ? m : (Array.isArray(m) ? m.join(', ') : fallback)
}

class PaymentController {
	async listPaymentMethods(callbacks = {}) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.listPaymentMethods.initiate(undefined, {
					forceRefetch: forceRefetch ?? true
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load payment methods'))
				return
			}
			const list = Array.isArray(res.data) ? res.data : []
			store.dispatch(updatePaymentMethods(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			onError?.(errMsg(err, 'Failed to load payment methods'))
		} finally {
			setLoading?.(false)
		}
	}

	async createPaymentMethod(callbacks = {}) {
		const { setLoading, onSuccess, onError, cardNumber, expiryDate, cvv, cardholderName, country, isDefault } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.createPaymentMethod.initiate({
					cardNumber,
					expiryDate,
					cvv,
					cardholderName,
					country,
					isDefault: isDefault ?? true
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to add payment method'))
				return
			}
			const method = res.data
			if (method) {
				const current = store.getState()?.wallet_slice?.paymentMethods ?? []
				store.dispatch(updatePaymentMethods([...current, method]))
			}
			onSuccess?.(method)
			return method
		} catch (err) {
			onError?.(errMsg(err, 'Failed to add payment method'))
		} finally {
			setLoading?.(false)
		}
	}

	async updatePaymentMethod(callbacks = {}) {
		const { setLoading, onSuccess, onError, id, expiryDate, cardholderName, isDefault } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.updatePaymentMethod.initiate({
					id,
					expiryDate,
					cardholderName,
					isDefault: isDefault ?? false
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to update payment method'))
				return
			}
			const method = res.data
			if (method) {
				const current = store.getState()?.wallet_slice?.paymentMethods ?? []
				store.dispatch(updatePaymentMethods(
					current.map((pm) => (pm.id === id || pm.uuid === id) ? method : pm)
				))
			}
			onSuccess?.(method)
			return method
		} catch (err) {
			onError?.(errMsg(err, 'Failed to update payment method'))
		} finally {
			setLoading?.(false)
		}
	}

	async deletePaymentMethod(callbacks = {}) {
		const { setLoading, onSuccess, onError, id } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.deletePaymentMethod.initiate(id)
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to delete payment method'))
				return
			}
			const current = store.getState()?.wallet_slice?.paymentMethods ?? []
			store.dispatch(updatePaymentMethods(current.filter((pm) => pm.id !== id && pm.uuid !== id)))
			onSuccess?.()
		} catch (err) {
			onError?.(errMsg(err, 'Failed to delete payment method'))
		} finally {
			setLoading?.(false)
		}
	}

	async approvePayment(callbacks = {}) {
		const { setLoading, onSuccess, onError, amount, paymentMethodUuid, propertyRequestId } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.approvePayment.initiate({
					amount,
					paymentMethodUuid,
					propertyRequestId
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to initialize payment'))
				return
			}
			onSuccess?.(res.data)
			return res.data
		} catch (err) {
			onError?.(errMsg(err, 'Failed to initialize payment'))
		} finally {
			setLoading?.(false)
		}
	}
}

const paymentController = new PaymentController()
export default paymentController
