import { store } from '../redux/store'
import { updateAccount } from '../redux/slices/accountSlice'
import { authApi } from '../repository/auth_repository'
import { fromApiResponse } from '../models/accountModel'
import { removeToken, saveToken } from '../lib/localStorage'

class AuthController {

    async signup(email, phone, country, callbacks = {}) {
        const { setLoading, navigate, onError } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.signup.initiate({
                    email,
                    phone: phone ?? '',
                    country: country?.isoCode ?? '',
                })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Signup failed'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Signup failed')
                return
            }
            const path = `/otp/${encodeURIComponent(email)}`
            const state = { email, phoneNumber: phone, selectedCountry: country, fromSignUp: true }
            if (typeof navigate === 'function') {
                navigate(path, { state })
            } else {
                navigate?.(path)
            }
            return data
        } catch (err) {
            console.log('Error...', err)
            const message = err?.data?.message ?? err?.message ?? 'Signup failed'
            onError?.(typeof message === 'string' ? message : 'Signup failed')
        } finally {
            setLoading?.(false)
        }
    }

    async resendOtp(email, callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.resendOtp.initiate({ email })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to resend code'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to resend code')
                return
            }
            onSuccess?.()
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to resend code'
            onError?.(typeof message === 'string' ? message : 'Failed to resend code')
        } finally {
            setLoading?.(false)
        }
    }

    async verifyOtp(email, otp, callbacks = {}) {
        const { setLoading, navigate, onError } = callbacks
        setLoading?.(true)

        await store.dispatch(
                authApi.endpoints.verifyOtp.initiate({ email, otp })
            ).then((res) => {
                if (res.error) {
                    const message = res.error?.data?.message ?? 'Verification failed'
                    onError?.(typeof message === 'string' ? message : 'Verification failed')
                    return
                }
                const data = res.data
                if (data?.success === false) {
                    onError?.(data?.message ?? 'Invalid OTP')
                    return
                }
                const path = '/create-password'
                if (typeof navigate === 'function') {
                    navigate(path, { state: { email } })
                } else {
                    navigate?.(path)
                }
                return data
            }).catch((err) => {
                const message = err?.data?.message ?? err?.message ?? 'Verification failed'
                onError?.(typeof message === 'string' ? message : 'Verification failed')
                return err
            }).finally(() => {
                setLoading?.(false)
            })
    }

    async verifyForgotPasswordOtp(identifier, otp, callbacks = {}) {
        const { setLoading, navigate, onError } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.verifyOtp.initiate({ email: identifier, otp })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Invalid or expired code'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Invalid or expired code')
                return
            }
            navigate?.('/reset-password', { state: { identifier, otp } })
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Verification failed'
            onError?.(typeof message === 'string' ? message : 'Verification failed')
        } finally {
            setLoading?.(false)
        }
    }

    async createPassword(email, password, passwordConfirmation, callbacks = {}) {
        const { setLoading, navigate, onError } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.createPassword.initiate({
                    email,
                    password,
                    password_confirmation: passwordConfirmation,
                })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Create password failed'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Create password failed')
                return
            }
            const account = fromApiResponse(data)
            if (account?.token) {
                saveToken(account.token)
            }
            if (account?.user) {
                store.dispatch(updateAccount(account.user))
            }
            navigate?.('/update-name', { state: { email } })
            return account ?? data
        } catch (err) {
            console.log('Error...', err)
            const message = err?.data?.message ?? err?.message ?? 'Create password failed'
            onError?.(typeof message === 'string' ? message : 'Create password failed')
        } finally {
            setLoading?.(false)
        }
    }

    async login(email, password, callbacks = {}) {
        const { setLoading, navigate, onError } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.login.initiate({ email, password })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Login failed'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Login failed')
                return
            }
            const account = fromApiResponse(data)
            if (account?.token) {
                saveToken(account.token)
            }
            if (account?.user) {
                store.dispatch(updateAccount(account.user))
            }
            const profileRes = await store.dispatch(authApi.endpoints.getProfile.initiate())
            if (!profileRes.error && profileRes.data) {
                const user = profileRes.data?.data?.user ?? profileRes.data?.user
                if (user) store.dispatch(updateAccount(user))
            }
            navigate?.('/explore')
            return account ?? data
        } catch (err) {
            console.log('Error...', err)
            const message = err?.data?.message ?? err?.message ?? 'Login failed'
            onError?.(typeof message === 'string' ? message : 'Login failed')
        } finally {
            setLoading?.(false)
        }
    }

    async updateAccount(firstName, lastName, avatar, callbacks = {}) {
        const { setLoading, navigate, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.updateProfile.initiate({
                    first_name: firstName ?? '',
                    last_name: lastName ?? '',
                    ...(avatar != null && avatar !== '' && { avatar: String(avatar) }),
                })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Update failed'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Update failed')
                return
            }
            const user = data?.data?.user ?? data?.user
            if (user) {
                store.dispatch(updateAccount(user))
            }
            const profileRes = await store.dispatch(authApi.endpoints.getProfile.initiate())
            if (!profileRes.error && profileRes.data) {
                const profileUser = profileRes.data?.data?.user ?? profileRes.data?.user
                if (profileUser) {
                    store.dispatch(updateAccount(profileUser))
                }
            }
            onSuccess?.(data)
            navigate?.(data?.redirect_to ?? '/explore')
            return data
        } catch (err) {
            console.log('Error...', err)
            const message = err?.data?.message ?? err?.message ?? 'Update failed'
            onError?.(typeof message === 'string' ? message : 'Update failed')
        } finally {
            setLoading?.(false)
        }
    }

    async updateLocation(state, city, callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.updateLocation.initiate({ state, city })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to update location'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to update location')
                return
            }
            const user = data?.data?.user ?? data?.user
            if (user) {
                store.dispatch(updateAccount(user))
            }
            const profileRes = await store.dispatch(authApi.endpoints.getProfile.initiate())
            if (!profileRes.error && profileRes.data) {
                const profileUser = profileRes.data?.data?.user ?? profileRes.data?.user
                if (profileUser) {
                    store.dispatch(updateAccount(profileUser))
                }
            }
            onSuccess?.()
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to update location'
            onError?.(typeof message === 'string' ? message : 'Failed to update location')
        } finally {
            setLoading?.(false)
        }
    }

    async changePhoneNumber(phoneNumber, password, callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.changePhoneNumber.initiate({
                    phone_number: phoneNumber,
                    password,
                })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to update phone number'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to update phone number')
                return
            }
            const user = data?.data?.user ?? data?.user
            if (user) {
                store.dispatch(updateAccount(user))
            }
            const profileRes = await store.dispatch(authApi.endpoints.getProfile.initiate())
            if (!profileRes.error && profileRes.data) {
                const profileUser = profileRes.data?.data?.user ?? profileRes.data?.user
                if (profileUser) {
                    store.dispatch(updateAccount(profileUser))
                }
            }
            onSuccess?.()
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to update phone number'
            onError?.(typeof message === 'string' ? message : 'Failed to update phone number')
        } finally {
            setLoading?.(false)
        }
    }

    async becomeLandlord(callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.becomeLandlord.initiate()
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to become landlord'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to become landlord')
                return
            }
            const user = data?.data?.user ?? data?.user ?? data?.data
            if (user) {
                store.dispatch(updateAccount(user))
            }
            onSuccess?.()
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to become landlord'
            onError?.(typeof message === 'string' ? message : 'Failed to become landlord')
        } finally {
            setLoading?.(false)
        }
    }

    async switchDashboard(landlordDashboard, callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.switchDashboard.initiate({
                    landlord_dashboard: !!landlordDashboard,
                })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to switch dashboard'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to switch dashboard')
                return
            }
            const responseData = data?.data ?? data
            const user = responseData?.user ?? responseData
            const token = responseData?.token ?? data?.token
            if (user) {
                store.dispatch(updateAccount(user))
            }
            if (token && typeof token === 'string') {
                saveToken(token)
            }
            onSuccess?.()
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to switch dashboard'
            onError?.(typeof message === 'string' ? message : 'Failed to switch dashboard')
        } finally {
            setLoading?.(false)
        }
    }

    async changePassword(currentPassword, newPassword, newPasswordConfirmation, callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.changePassword.initiate({
                    current_password: currentPassword,
                    new_password: newPassword,
                    new_password_confirmation: newPasswordConfirmation,
                })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to initiate password change'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to initiate password change')
                return
            }
            onSuccess?.(data?.message ?? data?.data?.message ?? 'Verification code sent to your email address.')
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to initiate password change'
            onError?.(typeof message === 'string' ? message : 'Failed to initiate password change')
        } finally {
            setLoading?.(false)
        }
    }

    async resendOtpChangePassword(callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.resendOtpChangePassword.initiate()
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to resend code'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to resend code')
                return
            }
            onSuccess?.(data?.message ?? data?.data?.message ?? 'Verification code resent to your email address.')
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to resend verification code'
            onError?.(typeof message === 'string' ? message : 'Failed to resend verification code')
        } finally {
            setLoading?.(false)
        }
    }

    async confirmChangePassword(otp, callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.confirmChangePassword.initiate({ otp })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to confirm password change'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to confirm password change')
                return
            }
            onSuccess?.(data?.message ?? data?.data?.message ?? 'Password changed successfully')
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to confirm password change'
            onError?.(typeof message === 'string' ? message : 'Failed to confirm password change')
        } finally {
            setLoading?.(false)
        }
    }

    async deleteAccount(password, callbacks = {}) {
        const { setLoading, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.deleteAccount.initiate({ password })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to delete account'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to delete account')
                return
            }
            removeToken()
            store.dispatch(updateAccount({}))
            onSuccess?.()
            return data
        } catch (err) {
            const message = err?.data?.message ?? err?.message ?? 'Failed to delete account'
            onError?.(typeof message === 'string' ? message : 'Failed to delete account')
        } finally {
            setLoading?.(false)
        }
    }

    async logout(callbacks = {}) {
        const { setLoading, onSuccess } = callbacks
        setLoading?.(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        removeToken()
        store.dispatch(updateAccount({}))
        onSuccess?.()
        setLoading?.(false)
    }

    async forgetPassword(identifier, callbacks = {}) {
        const { setLoading, navigate, onError, onSuccess } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.forgetPassword.initiate({ identifier })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to send reset link'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to send reset link')
                return
            }
            onSuccess?.()
            navigate?.(`/forgot-password-otp/${encodeURIComponent(identifier)}`, {
                state: { fromForgotPassword: true },
            })
            return data
        } catch (err) {
            console.log('Error...', err)
            const message = err?.data?.message ?? err?.message ?? 'Failed to send reset link'
            onError?.(typeof message === 'string' ? message : 'Failed to send reset link')
        } finally {
            setLoading?.(false)
        }
    }

    async resetPassword(identifier, otp, password, passwordConfirmation, callbacks = {}) {
        const { setLoading, navigate, onError } = callbacks
        setLoading?.(true)

        try {
            const res = await store.dispatch(
                authApi.endpoints.resetPassword.initiate({
                    identifier,
                    otp,
                    password,
                    password_confirmation: passwordConfirmation,
                })
            )
            if (res.error) {
                const message = res.error?.data?.message ?? res.error?.data?.error ?? 'Failed to reset password'
                onError?.(Array.isArray(message) ? message.join(', ') : message)
                return
            }
            const data = res.data
            if (data?.success === false) {
                onError?.(data?.message ?? 'Failed to reset password')
                return
            }
            navigate?.('/reset-password-success')
            return data
        } catch (err) {
            console.log('Error...', err)
            const message = err?.data?.message ?? err?.message ?? 'Failed to reset password'
            onError?.(typeof message === 'string' ? message : 'Failed to reset password')
        } finally {
            setLoading?.(false)
        }
    }
}

export default AuthController
