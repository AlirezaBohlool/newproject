import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { createWrapper } from "next-redux-wrapper"; // Important for SSR
import authReducer from "./auth";
import { walletApi } from "./api/wallet"; // Import the wallet API slice
// import { menuApi } from "./api/menu"; // Import the new API slice
// import { jobCommitteeApi } from "./api/job-committee"; // Import the new job committee API
// import { actionApi } from "./api/action";
// import { providerIpgApi } from "./api/IPG";

export const makeStore = () =>
  configureStore({    reducer: {
      auth: authReducer,
      [walletApi.reducerPath]: walletApi.reducer, // Add the wallet API reducer
    //   [menuApi.reducerPath]: menuApi.reducer, // Add the reducer
    //   [roleApi.reducerPath]: roleApi.reducer,
    //   [frontApi.reducerPath]: frontApi.reducer,
    //   [operationApi.reducerPath]: operationApi.reducer,
    //   [submenuApi.reducerPath]: submenuApi.reducer,
    //   [providerApi.reducerPath]: providerApi.reducer,
    //   [providerSectionApi.reducerPath]: providerSectionApi.reducer,
    //   [emailApi.reducerPath]: emailApi.reducer, // Add the email API reducer
    //   [templateCommitteeApi.reducerPath]: templateCommitteeApi.reducer, // Add the template committee API reducer
    //   [committeeApi.reducerPath]: committeeApi.reducer, // Add the committee API reducer
    //   [profileApi.reducerPath]: profileApi.reducer, // Add the profile API reducer
    //   [jobCommitteeApi.reducerPath]: jobCommitteeApi.reducer, // Add the job committee API reducer
    //   [contractApi.reducerPath]: contractApi.reducer, // Add the contract API reducer
    //   [contractDappApi.reducerPath]: contractDappApi.reducer, // Add the contract-dapp API reducer
    //   [providerSSOApi.reducerPath]: providerSSOApi.reducer, // Add the provider SSO API reducer
    //   [adminActionsApi.reducerPath]: adminActionsApi.reducer, // Add the admin actions API reducer
    //   [actionApi.reducerPath]: actionApi.reducer,
    //   [providerIpgApi.reducerPath]: providerIpgApi.reducer, // Add providerIpgApi reducer
    //   [typeContractApi.reducerPath]: typeContractApi.reducer, // Add the type contract API reducer
    //   [archApi.reducerPath]: archApi.reducer, // Add the arch API reducer
    //   [chainApi.reducerPath]: chainApi.reducer, // Add the chain API reducer
    //   [paymentSettingApi.reducerPath]: paymentSettingApi.reducer, // Add the payment-setting API reducer
    //   [pmAssetsApi.reducerPath]: pmAssetsApi.reducer, // Add the pm-assets API reducer
      // ... other reducers
    },    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        walletApi.middleware, // Add the wallet API middleware
        // menuApi.middleware, // Add the middleware
        // roleApi.middleware, // Add the middleware for roleApi
        // frontApi.middleware,
        // submenuApi.middleware,
        // providerApi.middleware,
        // committeeApi.middleware,
        // providerSectionApi.middleware,
        // emailApi.middleware, // Add the email API middleware
        // templateCommitteeApi.middleware, // Add the template committee API middleware
        // operationApi.middleware, // Add the operation API middleware
        // profileApi.middleware, // Add the profile API middleware
        // jobCommitteeApi.middleware, // Add the job committee API middleware
        // contractApi.middleware, // Add the contract API middleware
        // contractDappApi.middleware, // Add the contract-dapp API middleware
        // providerSSOApi.middleware, // Add the provider SSO API middleware
        // actionApi.middleware,
        // adminActionsApi.middleware, // Add the admin actions API middleware
        // providerIpgApi.middleware, // Add providerIpgApi middleware
        // typeContractApi.middleware, // Add the type contract API middleware
        // archApi.middleware, // Add the arch API middleware
        // chainApi.middleware, // Add the chain API middleware
        // paymentSettingApi.middleware, // Add the payment-setting API middleware
        // pmAssetsApi.middleware // Add the pm-assets API middleware
        // ... other middleware
      ),
  });

export const store = makeStore();

// Define RootState based on the store
export type RootState = ReturnType<typeof store.getState>;

// Create a typed hook for dispatch
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Setup SSR with wrapper
export const wrapper = createWrapper(makeStore);
setupListeners(store.dispatch); // Use the created store instance
