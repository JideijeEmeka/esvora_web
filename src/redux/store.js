import { configureStore } from '@reduxjs/toolkit';
import { kAuthEndpoints, kAccountSlice, kAgreementEndpoints, kAgreementSlice, kWalletEndpoints, kWalletSlice, kTenantEndpoints, kTenantSlice, kPropertyEndpoints, kPropertySlice, kNotificationEndpoints, kChatEndpoints, kDeviceLocationSlice } from '../lib/constants';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from '../repository/auth_repository';
import { agreementApi } from '../repository/agreement_repository';
import { walletApi } from '../repository/wallet_repository';
import accountReducer from './slices/accountSlice';
import agreementReducer from './slices/agreementSlice';
import walletReducer from './slices/walletSlice';
import tenantReducer from './slices/tenantSlice';
import { tenantApi } from '../repository/tenant_repository';
import { propertyApi } from '../repository/property_repository';
import { notificationApi } from '../repository/notification_repository';
import { chatApi } from '../repository/chat_repository';
import propertyReducer from './slices/propertySlice';
import deviceLocationReducer from './slices/deviceLocationSlice';

export const store = configureStore({
	reducer: {
		[kAccountSlice]: accountReducer,
		[kDeviceLocationSlice]: deviceLocationReducer,
		[kAuthEndpoints]: authApi.reducer,
		[kAgreementEndpoints]: agreementApi.reducer,
		[kAgreementSlice]: agreementReducer,
		[kWalletEndpoints]: walletApi.reducer,
		[kWalletSlice]: walletReducer,
		[kTenantEndpoints]: tenantApi.reducer,
		[kTenantSlice]: tenantReducer,
		[kPropertyEndpoints]: propertyApi.reducer,
		[kPropertySlice]: propertyReducer,
		[kNotificationEndpoints]: notificationApi.reducer,
		[kChatEndpoints]: chatApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			agreementApi.middleware,
			walletApi.middleware,
			tenantApi.middleware,
			propertyApi.middleware,
			notificationApi.middleware,
			chatApi.middleware
		),
});

setupListeners(store.dispatch);