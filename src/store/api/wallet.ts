import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types based on the API documentation
export interface WalletAuthenticateRequest {
  seed: string;
  signature: string;
  deviceIdentifier: string;
  walletAddress: string;
  random: {
    value: string;
    metadata: string;
  };
}

export interface WalletAuthenticateResponse {
  statusCode: number;
  result: {
    value: string;
  };
  timestamp: string;
}

export interface WalletSourceRequest {
  wallet: string;
}

export interface WalletSourceResponse {
  statusCode: number;
  result: {
    walletName: string;
    wallet: string;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: {
    msg: string;
    code: number;
  };
  timestamp: string;
}

// Create the API slice
export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_DAPP_API || 'http://localhost:3000',
    prepareHeaders: (headers, { getState }) => {
      // Add any auth headers if needed
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // Wallet Authentication endpoint
    authenticateWallet: builder.mutation<WalletAuthenticateResponse, WalletAuthenticateRequest>({
      query: (credentials) => ({
        url: '/api/v1/user/wallet/authenticate',
        method: 'POST',
        body: credentials,
      }),
    }),
    
    // Create Wallet Source endpoint
    createWalletSource: builder.mutation<WalletSourceResponse, WalletSourceRequest>({
      query: (walletData) => ({
        url: '/api/v1/wallet/source',
        method: 'POST',
        body: walletData,
      }),
    }),
  }),
});

// Export hooks for use in components
export const {
  useAuthenticateWalletMutation,
  useCreateWalletSourceMutation,
} = walletApi;
