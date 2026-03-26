export function normalizeSchedule(s) {
	if (!s || typeof s !== 'object') return null
	return {
		id: s.id ?? s.uuid,
		dayOfWeek: s.day_of_week ?? s.dayOfWeek,
		dayOfWeekLabel: s.day_of_week_label ?? s.dayOfWeekLabel,
		startTime: s.start_time ?? s.startTime,
		endTime: s.end_time ?? s.endTime,
		startTimeFormatted: s.start_time_formatted ?? s.startTimeFormatted,
		endTimeFormatted: s.end_time_formatted ?? s.endTimeFormatted,
		isActive: s.is_active ?? s.isActive
	}
}

export function normalizeSchedules(raw) {
	if (!Array.isArray(raw)) return []
	return raw.map(normalizeSchedule).filter(Boolean)
}

export function formatScheduleTime(rawTime, formattedTime) {
	if (formattedTime != null && String(formattedTime).trim() !== '') {
		return String(formattedTime).trim()
	}
	if (rawTime == null || rawTime === '') return null
	const t = String(rawTime).trim()
	const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?/)
	if (!m) return t
	let h = parseInt(m[1], 10)
	const min = parseInt(m[2], 10)
	const ampm = h >= 12 ? 'PM' : 'AM'
	h = h % 12
	if (h === 0) h = 12
	return `${h}:${String(min).padStart(2, '0')} ${ampm}`
}
