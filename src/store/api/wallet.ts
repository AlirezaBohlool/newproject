import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Types based on the actual API specification
export interface WalletAuthenticateRequest {
  iso3: string;           // String value like "string"
  referralCode: string;   // String value like "string"
  signature: string;      // Wallet signature
  walletAddress: string;  // Wallet address like "0x..."
  content: {
    nonce: string;        // UUID string like "01963112-176b-740e-8562-a1b898ddb641"
    metaData: string;     // String value like "string" (note: capital D)
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
  payload: {
    transactionId: string;
    nonce: string;
    wallet: string;
    signature: string;
    createdAt: string;
  };
  timestamp: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message: string | {
    msg: string;
    code: number;
  };
  timestamp?: string;
}

// Create the API slice
export const walletApi = createApi({
  reducerPath: 'walletApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_DAPP_API || 'https://auth.exmodules.org',
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
      // Add error handling
      async onQueryStarted(credentials, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error: any) {
          console.error('🔍 RTK Query error details:', {
            status: error?.error?.status,
            data: error?.error?.data,
            message: error?.error?.message,
            originalError: error?.error?.originalStatus === 422 ? error?.error?.data : null
          });
          // Check for specific metadata errors
          if (error?.error?.data?.message) {
            const messages = Array.isArray(error.error.data.message) 
              ? error.error.data.message 
              : [error.error.data.message];
            
            messages.forEach((msg: any) => {
              if (msg.code === 1007 || msg.code === 1008) {
                console.error('🔍 Metadata validation error:', {
                  code: msg.code,
                  message: msg.msg,
                  requestMetaData: credentials.content.metaData  // Changed to metaData
                });
              }
            });
          }
        }
      },
    }),
    
    // Create Wallet Source endpoint
    createWalletSource: builder.mutation<WalletSourceResponse, WalletSourceRequest>({
      query: (walletData) => ({
        url: '/api/v1/wallet/save',
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
