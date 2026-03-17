import { baseUrl, kAuthEndpoints } from '../lib/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getToken } from '../lib/localStorage'

export const authApi = createApi({
    reducerPath: kAuthEndpoints,
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            const token = getToken()
            if (token) {
                headers.set('Authorization', `Bearer ${token}`)
            }
            return headers
        },
    }),
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (body) => ({
                url: '/api/v1/tenant/auth/start-signup',
                method: 'POST',
                body,
            }),
        }),
        resendOtp: builder.mutation({
            query: (body) => ({
                url: '/api/v1/tenant/auth/resend-otp',
                method: 'POST',
                body,
            }),
        }),
        verifyOtp: builder.mutation({
            query: (body) => ({
                url: '/api/v1/tenant/auth/verify-otp',
                method: 'POST',
                body,
            }),
        }),
        createPassword: builder.mutation({
            query: (body) => ({
                url: '/api/v1/tenant/auth/create-password',
                method: 'POST',
                body,
            }),
        }),
        login: builder.mutation({
            query: (body) => ({
                url: '/api/v1/tenant/auth/login',
                method: 'POST',
                body,
            }),
        }),
        forgetPassword: builder.mutation({
            query: (body) => ({
                url: '/api/v1/tenant/auth/password/forget',
                method: 'POST',
                body,
            }),
        }),
        resetPassword: builder.mutation({
            query: (body) => ({
                url: '/api/v1/tenant/auth/password/reset',
                method: 'POST',
                body,
            }),
        }),
        getProfile: builder.query({
            query: () => ({ url: '/api/v1/user' }),
        }),
        updateProfile: builder.mutation({
            query: (body) => ({
                url: '/api/v1/user/profile',
                method: 'PUT',
                body: {
                    first_name: body.first_name ?? '',
                    last_name: body.last_name ?? '',
                    ...(body.avatar != null && body.avatar !== '' && { avatar: String(body.avatar) }),
                },
            }),
        }),
        updateLocation: builder.mutation({
            query: (body) => ({
                url: '/api/v1/user/location',
                method: 'PUT',
                body: { state: body.state ?? '', city: body.city ?? '' },
            }),
        }),
        changePhoneNumber: builder.mutation({
            query: (body) => ({
                url: '/api/v1/user/change-phone-number',
                method: 'PUT',
                body: {
                    phone_number: body.phone_number ?? '',
                    password: body.password ?? '',
                },
            }),
        }),
        deleteAccount: builder.mutation({
            query: (body) => ({
                url: '/api/v1/user/delete-account',
                method: 'DELETE',
                body: { password: body.password ?? '' },
            }),
        }),
        becomeLandlord: builder.mutation({
            query: () => ({
                url: '/api/v1/auth/become-landlord',
                method: 'POST',
            }),
        }),
        switchDashboard: builder.mutation({
            query: (body) => ({
                url: '/api/v1/user/switch-dashboard',
                method: 'POST',
                body: { landlord_dashboard: body.landlord_dashboard ?? false },
            }),
        }),
        changePassword: builder.mutation({
            query: (body) => ({
                url: '/api/v1/auth/password/change/initiate',
                method: 'POST',
                body: {
                    current_password: body.current_password ?? '',
                    new_password: body.new_password ?? '',
                    new_password_confirmation: body.new_password_confirmation ?? '',
                },
            }),
        }),
        resendOtpChangePassword: builder.mutation({
            query: () => ({
                url: '/api/v1/auth/password/change/resend',
                method: 'POST',
            }),
        }),
        confirmChangePassword: builder.mutation({
            query: (body) => ({
                url: '/api/v1/auth/password/change/confirm',
                method: 'POST',
                body: { otp: body.otp ?? '' },
            }),
        }),
    }),
})

export const { useSignupMutation } = authApi
