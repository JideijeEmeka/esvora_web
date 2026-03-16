import { store } from '../redux/store'
import { walletApi } from '../repository/wallet_repository'
import { updateWallet, updateRecentTransactions, updateWalletTransactions, updateBanks, updateWithdrawalMethods, updateWithdrawalTransactions, updateDepositTransactions } from '../redux/slices/walletSlice'

const errMsg = (err, fallback) => {
	const m = err?.data?.message ?? err?.data?.error ?? err?.message
	return typeof m === 'string' ? m : (Array.isArray(m) ? m.join(', ') : fallback)
}

class WalletController {
	async getWalletBalance(callbacks = {}) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.getWalletBalance.initiate(undefined, {
					forceRefetch: forceRefetch ?? true
				})
			)
			if (res.error) {
				const message =
					res.error?.data?.message ??
					res.error?.data?.error ??
					'Failed to load wallet balance'
				onError?.(Array.isArray(message) ? message.join(', ') : message)
				return
			}
			const data = res.data
			store.dispatch(updateWallet(data))
			onSuccess?.(data)
			return data
		} catch (err) {
			const message =
				err?.data?.message ?? err?.message ?? 'Failed to load wallet balance'
			onError?.(typeof message === 'string' ? message : 'Failed to load wallet balance')
		} finally {
			setLoading?.(false)
		}
	}

	async getRecentTransactions(callbacks = {}) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.getRecentTransactions.initiate(undefined, {
					forceRefetch: forceRefetch ?? false
				})
			)
			if (res.error) {
				const message =
					res.error?.data?.message ??
					res.error?.data?.error ??
					'Failed to load recent transactions'
				onError?.(Array.isArray(message) ? message.join(', ') : message)
				return
			}
			const list = Array.isArray(res.data) ? res.data : []
			store.dispatch(updateRecentTransactions(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			const message =
				err?.data?.message ?? err?.message ?? 'Failed to load recent transactions'
			onError?.(typeof message === 'string' ? message : 'Failed to load recent transactions')
		} finally {
			setLoading?.(false)
		}
	}

	async getTransactions(callbacks = {}, page = 1) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.getTransactions.initiate(page, {
					forceRefetch: forceRefetch ?? false
				})
			)
			if (res.error) {
				const message =
					res.error?.data?.message ??
					res.error?.data?.error ??
					'Failed to load transactions'
				onError?.(Array.isArray(message) ? message.join(', ') : message)
				return
			}
			const data = res.data ?? { transactions: [], totalCount: 0, currentPage: 1, perPage: 15, lastPage: 1 }
			store.dispatch(updateWalletTransactions(data))
			onSuccess?.(data)
			return data
		} catch (err) {
			const message =
				err?.data?.message ?? err?.message ?? 'Failed to load transactions'
			onError?.(typeof message === 'string' ? message : 'Failed to load transactions')
		} finally {
			setLoading?.(false)
		}
	}

	async listBanks(callbacks = {}) {
		const { setLoading, onSuccess, onError } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(walletApi.endpoints.listBanks.initiate())
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load banks'))
				return
			}
			const list = Array.isArray(res.data) ? res.data : []
			store.dispatch(updateBanks(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			onError?.(errMsg(err, 'Failed to load banks'))
		} finally {
			setLoading?.(false)
		}
	}

	async getWithdrawalMethods(callbacks = {}) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.getWithdrawalMethods.initiate(undefined, {
					forceRefetch: forceRefetch ?? true
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load withdrawal methods'))
				return
			}
			const list = Array.isArray(res.data) ? res.data : []
			store.dispatch(updateWithdrawalMethods(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			onError?.(errMsg(err, 'Failed to load withdrawal methods'))
		} finally {
			setLoading?.(false)
		}
	}

	async previewWithdrawal({ amount, withdrawalMethodUuid, setLoading, onSuccess, onError }) {
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.previewWithdrawal.initiate({ amount, withdrawalMethodUuid })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Preview failed'))
				return
			}
			onSuccess?.(res.data)
			return res.data
		} catch (err) {
			onError?.(errMsg(err, 'Preview failed'))
		} finally {
			setLoading?.(false)
		}
	}

	async createWithdrawal({ amount, withdrawalMethodUuid, setLoading, onSuccess, onError }) {
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.createWithdrawal.initiate({ amount, withdrawalMethodUuid })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Withdrawal failed'))
				return
			}
			onSuccess?.()
		} catch (err) {
			onError?.(errMsg(err, 'Withdrawal failed'))
		} finally {
			setLoading?.(false)
		}
	}

	async getWithdrawalTransactions(callbacks = {}) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.getWithdrawalTransactions.initiate(undefined, {
					forceRefetch: forceRefetch ?? true
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load withdrawal transactions'))
				return
			}
			const list = Array.isArray(res.data) ? res.data : []
			store.dispatch(updateWithdrawalTransactions(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			onError?.(errMsg(err, 'Failed to load withdrawal transactions'))
		} finally {
			setLoading?.(false)
		}
	}

	async getDepositTransactions(callbacks = {}) {
		const { setLoading, onSuccess, onError, forceRefetch } = callbacks
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.getDepositTransactions.initiate(undefined, {
					forceRefetch: forceRefetch ?? true
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load deposit transactions'))
				return
			}
			const list = Array.isArray(res.data) ? res.data : []
			store.dispatch(updateDepositTransactions(list))
			onSuccess?.(list)
			return list
		} catch (err) {
			onError?.(errMsg(err, 'Failed to load deposit transactions'))
		} finally {
			setLoading?.(false)
		}
	}

	async addWithdrawalMethod({ bankName, accountNumber, accountName, setLoading, onSuccess, onError }) {
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.addWithdrawalMethod.initiate({
					bankName,
					accountNumber,
					accountName
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to add withdrawal method'))
				return
			}
			await this.getWithdrawalMethods({ forceRefetch: true, onError: () => {} })
			onSuccess?.()
		} catch (err) {
			onError?.(errMsg(err, 'Failed to add withdrawal method'))
		} finally {
			setLoading?.(false)
		}
	}

	async updateWithdrawalMethod({ methodId, bankName, accountNumber, accountName, setLoading, onSuccess, onError }) {
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.updateWithdrawalMethod.initiate({
					methodId,
					bankName,
					accountNumber,
					accountName
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to update withdrawal method'))
				return
			}
			await this.getWithdrawalMethods({ forceRefetch: true, onError: () => {} })
			onSuccess?.()
		} catch (err) {
			onError?.(errMsg(err, 'Failed to update withdrawal method'))
		} finally {
			setLoading?.(false)
		}
	}

	async deleteWithdrawalMethod({ methodId, setLoading, onSuccess, onError }) {
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.deleteWithdrawalMethod.initiate(methodId)
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to delete withdrawal method'))
				return
			}
			await this.getWithdrawalMethods({ forceRefetch: true, onError: () => {} })
			onSuccess?.()
		} catch (err) {
			onError?.(errMsg(err, 'Failed to delete withdrawal method'))
		} finally {
			setLoading?.(false)
		}
	}

	async initializeDeposit({ amount, gateway, callbackUrl, setLoading, onSuccess, onError }) {
		setLoading?.(true)
		try {
			const res = await store.dispatch(
				walletApi.endpoints.initializeDeposit.initiate({
					amount: Number(amount),
					gateway,
					callbackUrl: callbackUrl ?? (typeof window !== 'undefined' ? window.location.origin : 'https://www.esvora.ng')
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to initialize deposit'))
				return
			}
			const data = res.data
			const paymentUrl = data?.payment_url ?? data?.gateway_response?.authorization_url
			if (paymentUrl) {
				onSuccess?.({ paymentUrl, data })
			} else {
				onError?.('No payment URL received')
			}
		} catch (err) {
			onError?.(errMsg(err, 'Failed to initialize deposit'))
		} finally {
			setLoading?.(false)
		}
	}
}

export default new WalletController()
