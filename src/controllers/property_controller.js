import { store } from '../redux/store'
import { propertyApi } from '../repository/property_repository'
import { fromListApiResponse as fromPropertyListApiResponse } from '../models/propertyModel'
import {
	updateProperties,
	updateLandlordRequests,
	updateMyRequests,
	updatePropertyDetails,
	updateShowRequest,
	updatePropertyTypes,
	updateLandlordProperties,
	updateLandlordRequestStatus,
	updateShowRequestStatus
} from '../redux/slices/propertySlice'

const errMsg = (err, fallback) => {
	const m = err?.data?.message ?? err?.data?.error ?? err?.message
	return typeof m === 'string' ? m : (Array.isArray(m) ? m.join(', ') : fallback)
}

const unwrapList = (data, keys = ['data', 'requests', 'properties']) => {
	const raw = data?.data ?? data
	if (Array.isArray(raw)) return raw
	if (raw && typeof raw === 'object') {
		for (const k of keys) {
			const v = raw[k]
			if (Array.isArray(v)) return v
		}
	}
	return []
}

class PropertyController {
	async listLandlordRequests(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.listLandlordRequests.initiate(undefined, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load requests'))
				return []
			}
			const list = unwrapList(res.data, ['data', 'requests'])
			store.dispatch(updateLandlordRequests(list))
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load requests'))
			return []
		}
	}

	async showRequest(requestId, cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		if (!requestId) return null
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.showRequest.initiate(requestId, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load request'))
				return null
			}
			const data = res.data?.data ?? res.data
			store.dispatch(updateShowRequest(data))
			onSuccess?.(data)
			return data
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load request'))
			return null
		}
	}

	async acceptRequest(requestId, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(propertyApi.endpoints.acceptRequest.initiate(requestId))
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to accept request'))
				return
			}
			store.dispatch(updateLandlordRequestStatus({ requestId, status: 'accepted' }))
			store.dispatch(updateShowRequestStatus({ requestId, status: 'accepted' }))
			onSuccess?.(res.data)
		} catch (e) {
			onError?.(errMsg(e, 'Failed to accept request'))
		}
	}

	async declineRequest(requestId, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(propertyApi.endpoints.declineRequest.initiate(requestId))
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to decline request'))
				return
			}
			store.dispatch(updateLandlordRequestStatus({ requestId, status: 'declined' }))
			store.dispatch(updateShowRequestStatus({ requestId, status: 'declined' }))
			onSuccess?.(res.data)
		} catch (e) {
			onError?.(errMsg(e, 'Failed to decline request'))
		}
	}

	async listLandlordProperties(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.listLandlordProperties.initiate(undefined, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load properties'))
				return []
			}
			const list = unwrapList(res.data, ['data', 'properties'])
			store.dispatch(updateLandlordProperties(list))
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load properties'))
			return []
		}
	}

	async getAllProperties(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.getAllProperties.initiate(undefined, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load properties'))
				return []
			}
			const list = fromPropertyListApiResponse(res.data)
			store.dispatch(updateProperties(list))
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load properties'))
			return []
		}
	}

	async getPropertyDetails(uuid, cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		if (!uuid) return null
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.getPropertyDetails.initiate(uuid, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load property'))
				return null
			}
			const data = res.data?.data ?? res.data
			store.dispatch(updatePropertyDetails(data))
			onSuccess?.(data)
			return data
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load property'))
			return null
		}
	}

	async searchProperties(query, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.searchProperties.initiate(query ?? '')
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to search'))
				return []
			}
			const list = fromPropertyListApiResponse(res.data)
			store.dispatch(updateProperties(list))
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to search'))
			return []
		}
	}

	async filterProperties(params, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.filterProperties.initiate(params ?? {})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to filter properties'))
				return []
			}
			const list = fromPropertyListApiResponse(res.data)
			store.dispatch(updateProperties(list))
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to filter properties'))
			return []
		}
	}

	async listMyRequests(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.listMyRequests.initiate(undefined, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load my requests'))
				return []
			}
			const list = unwrapList(res.data, ['data', 'requests'])
			store.dispatch(updateMyRequests(list))
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load my requests'))
			return []
		}
	}

	async getPropertyTypesList(cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.getPropertyTypesList.initiate(undefined, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load property types'))
				return []
			}
			const list = unwrapList(res.data, ['data', 'property_types', 'property_types_list'])
			store.dispatch(updatePropertyTypes(list))
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load property types'))
			return []
		}
	}

	submitRequestForRent(body, cb = {}) {
		const { onSuccess, onError } = cb
		const apiBody = {
			property_id: body.propertyId,
			fullname: body.fullname,
			email: body.email,
			phone_number: body.phoneNumber,
			type: 'rent',
			message: body.message,
			urgency: body.urgency,
			schedule_date: body.scheduleDate
		}
		return store.dispatch(propertyApi.endpoints.submitRequestForRent.initiate(apiBody))
			.then((res) => {
				if (res.error) onError?.(errMsg(res.error, 'Failed to submit request'))
				else onSuccess?.(res.data)
				return res.data
			})
			.catch((e) => {
				onError?.(errMsg(e, 'Failed to submit request'))
			})
	}

	submitRequestForSales(body, cb = {}) {
		const { onSuccess, onError } = cb
		const apiBody = {
			property_id: body.propertyId,
			fullname: body.fullname,
			email: body.email,
			phone_number: body.phoneNumber,
			type: 'sales',
			message: body.message,
			urgency: body.urgency,
			schedule_date: body.scheduleDate
		}
		return store.dispatch(propertyApi.endpoints.submitRequestForSales.initiate(apiBody))
			.then((res) => {
				if (res.error) onError?.(errMsg(res.error, 'Failed to submit request'))
				else onSuccess?.(res.data)
				return res.data
			})
			.catch((e) => {
				onError?.(errMsg(e, 'Failed to submit request'))
			})
	}

	submitRequestForShortlet(body, cb = {}) {
		const { onSuccess, onError } = cb
		const apiBody = {
			property_id: body.propertyId,
			fullname: body.fullname,
			email: body.email,
			phone_number: body.phoneNumber,
			type: 'shortlet',
			check_in_date: body.checkInDate,
			check_out_date: body.checkOutDate,
			adults: body.adults,
			children: body.children,
			urgency: body.urgency,
			message: body.message ?? ''
		}
		return store.dispatch(propertyApi.endpoints.submitRequestForShortlet.initiate(apiBody))
			.then((res) => {
				if (res.error) onError?.(errMsg(res.error, 'Failed to submit request'))
				else onSuccess?.(res.data)
				return res.data
			})
			.catch((e) => {
				onError?.(errMsg(e, 'Failed to submit request'))
			})
	}

	async updateProperty({ uuid, title, status }, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.updateProperty.initiate({ uuid, title, status })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to update property'))
				return
			}
			onSuccess?.(res.data)
		} catch (e) {
			onError?.(errMsg(e, 'Failed to update property'))
		}
	}

	async deleteProperty(uuid, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(propertyApi.endpoints.deleteProperty.initiate(uuid))
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to delete property'))
				return
			}
			onSuccess?.()
		} catch (e) {
			onError?.(errMsg(e, 'Failed to delete property'))
		}
	}

	async listSchedules(propertyId, cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		if (!propertyId) {
			onError?.('Property is required')
			return []
		}
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.listSchedules.initiate(propertyId, { forceRefetch: !!forceRefetch })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load schedules'))
				return []
			}
			const list = Array.isArray(res.data?.data)
				? res.data.data
				: Array.isArray(res.data) ? res.data : []
			onSuccess?.(list)
			return list
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load schedules'))
			return []
		}
	}

	async showSchedule({ propertyId, scheduleId }, cb = {}) {
		const { onSuccess, onError, forceRefetch } = cb
		if (!propertyId || !scheduleId) {
			onError?.('Property and schedule are required')
			return null
		}
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.showSchedule.initiate(
					{ propertyId, scheduleId },
					{ forceRefetch: !!forceRefetch }
				)
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to load schedule'))
				return null
			}
			const data = res.data?.data ?? res.data
			onSuccess?.(data)
			return data
		} catch (e) {
			onError?.(errMsg(e, 'Failed to load schedule'))
			return null
		}
	}

	async createSchedule({ propertyId, startTime, endTime, dayOfWeek }, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.createSchedule.initiate({
					propertyId,
					body: {
						start_time: startTime,
						end_time: endTime,
						day_of_week: dayOfWeek
					}
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to create schedule'))
				return null
			}
			const data = res.data?.data ?? res.data
			onSuccess?.(data)
			return data
		} catch (e) {
			onError?.(errMsg(e, 'Failed to create schedule'))
			return null
		}
	}

	async updateSchedule({ propertyId, scheduleId, startTime, endTime, dayOfWeek }, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.updateSchedule.initiate({
					propertyId,
					scheduleId,
					body: {
						start_time: startTime,
						end_time: endTime,
						day_of_week: dayOfWeek
					}
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to update schedule'))
				return null
			}
			const data = res.data?.data ?? res.data
			onSuccess?.(data)
			return data
		} catch (e) {
			onError?.(errMsg(e, 'Failed to update schedule'))
			return null
		}
	}

	async toggleSchedule({ propertyId, scheduleId }, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.toggleSchedule.initiate({ propertyId, scheduleId })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to toggle schedule'))
				return null
			}
			const data = res.data?.data ?? res.data
			onSuccess?.(data)
			return data
		} catch (e) {
			onError?.(errMsg(e, 'Failed to toggle schedule'))
			return null
		}
	}

	async deleteSchedule({ propertyId, scheduleId }, cb = {}) {
		const { onSuccess, onError } = cb
		try {
			const res = await store.dispatch(
				propertyApi.endpoints.deleteSchedule.initiate({ propertyId, scheduleId })
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to delete schedule'))
				return false
			}
			onSuccess?.()
			return true
		} catch (e) {
			onError?.(errMsg(e, 'Failed to delete schedule'))
			return false
		}
	}

	async addReview({ propertyId, rating, sentiment, tags, comment }, cb = {}) {
		const { onSuccess, onError, setLoading } = cb
		if (!propertyId) {
			onError?.('Property is required to submit review')
			return
		}
		const apiRating = Math.max(1, Math.min(5, Math.round(rating)))
		const apiTags = Array.isArray(tags) ? tags : []
		const apiComment = (comment || '').trim() || 'No comment'
		try {
			setLoading?.(true)
			const res = await store.dispatch(
				propertyApi.endpoints.addReview.initiate({
					propertyId,
					rating: apiRating,
					sentiment: sentiment || 'good',
					tags: apiTags,
					comment: apiComment
				})
			)
			if (res.error) {
				onError?.(errMsg(res.error, 'Failed to submit review'))
				return
			}
			onSuccess?.(res.data)
		} catch (e) {
			onError?.(errMsg(e, 'Failed to submit review'))
		} finally {
			setLoading?.(false)
		}
	}
}

const propertyController = new PropertyController()
export default propertyController
