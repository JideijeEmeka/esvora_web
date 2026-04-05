/** KYC statuses — aligned with Flutter `lib/constants.dart` and GET /api/v1/kyc. */
export const KYC_STATUS_INCOMPLETE = 'incomplete'
export const KYC_STATUS_SUBMITTED = 'submitted'
export const KYC_STATUS_APPROVED = 'approved'
export const KYC_STATUS_REJECTED = 'rejected'

/** Time in `submitted` before session-expired (matches Flutter selfie view). */
export const KYC_SUBMITTED_SESSION_MS = 2 * 60 * 1000

/** Poll interval for GET /api/v1/kyc (matches Flutter default stream interval). */
export const KYC_POLL_INTERVAL_MS = 2000
