import { configureStore } from '@reduxjs/toolkit';
import { kAuthEndpoints, kAccountSlice, kAgreementEndpoints, kAgreementSlice, kWalletEndpoints, kWalletSlice, kTenantEndpoints, kTenantSlice, kPropertyEndpoints, kPropertySlice } from '../lib/constants';
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
import propertyReducer from './slices/propertySlice';

export const store = configureStore({
	reducer: {
		[kAccountSlice]: accountReducer,
		[kAuthEndpoints]: authApi.reducer,
		[kAgreementEndpoints]: agreementApi.reducer,
		[kAgreementSlice]: agreementReducer,
		[kWalletEndpoints]: walletApi.reducer,
		[kWalletSlice]: walletReducer,
		[kTenantEndpoints]: tenantApi.reducer,
		[kTenantSlice]: tenantReducer,
		[kPropertyEndpoints]: propertyApi.reducer,
		[kPropertySlice]: propertyReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			authApi.middleware,
			agreementApi.middleware,
			walletApi.middleware,
			tenantApi.middleware,
			propertyApi.middleware
		),
});

setupListeners(store.dispatch);