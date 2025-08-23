# Wallet Authentication API Implementation

This document describes the implementation of the wallet authentication API based on the Swagger documentation provided. The implementation includes both signin and signup functionality using wallet-based authentication.

## Overview

The implementation provides a complete wallet authentication system that integrates with:
- **RTK Query** for API state management
- **Redux Toolkit** for global state management
- **Wagmi** for wallet connection and signing
- **Next.js 15** with TypeScript

## API Endpoints Implemented

### 1. Wallet Authentication (`POST /api/v1/user/wallet/authenticate`)

**Purpose**: Authenticate a user's wallet for signin/signup

**Request Body**:
```typescript
interface WalletAuthenticateRequest {
  seed: string;                    // Nonce/seed value from server
  signature: string;               // Wallet signature
  deviceIdentifier: string;        // Unique device identifier
  walletAddress: string;          // User's wallet address
  random: {
    value: string;                 // Random hex value
    metadata: string;              // Additional metadata
  };
}
```

**Response**:
```typescript
interface WalletAuthenticateResponse {
  statusCode: number;
  result: {
    value: string;                 // JWT token
  };
  timestamp: string;
}
```

### 2. Wallet Source Creation (`POST /api/v1/wallet/source`)

**Purpose**: Create a wallet source after successful authentication

**Request Body**:
```typescript
interface WalletSourceRequest {
  wallet: string;                  // Wallet address
}
```

**Response**:
```typescript
interface WalletSourceResponse {
  statusCode: number;
  result: {
    walletName: string;            // Generated wallet name
    wallet: string;                // Wallet address
    createdAt: string;             // Creation timestamp
    updatedAt: string;             // Last update timestamp
  };
  timestamp: string;
}
```

## Project Structure

```
src/
├── store/
│   ├── api/
│   │   └── wallet.ts              # RTK Query API slice
│   ├── auth/
│   │   └── index.tsx              # Authentication Redux slice
│   └── store.ts                   # Redux store configuration
├── wallet/
│   └── hooks/
│       └── wallet-auth/
│           ├── index.ts           # Original wallet auth hook
│           └── enhanced-wallet-auth.ts  # Enhanced hook with new API
├── services/
│   └── wallet-api.ts              # Axios-based API service
├── utils/
│   └── wallet-utils.ts            # Utility functions
└── components/
    └── auth/
        ├── Login.tsx              # Login component
        └── Register.tsx           # Registration component
```

## Key Features

### 1. Enhanced Wallet Authentication Hook

The `useEnhancedWalletLogin` hook provides:
- Automatic wallet connection handling
- Message signing with nonce verification
- Integration with RTK Query mutations
- Automatic wallet source creation
- Error handling and state management

### 2. RTK Query Integration

- **`useAuthenticateWalletMutation`**: Handles wallet authentication
- **`useCreateWalletSourceMutation`**: Creates wallet source after auth
- Automatic caching and state synchronization
- Built-in loading and error states

### 3. Utility Functions

- **Device ID Generation**: Creates unique device identifiers
- **Random Value Generation**: Generates cryptographically secure random values
- **Payload Creation**: Builds properly formatted API requests
- **Address Validation**: Validates Ethereum wallet addresses

### 4. API Service Layer

The `WalletApiService` class provides:
- Centralized API communication
- Automatic token management
- Error handling and response validation
- Request/response interceptors

## Usage Examples

### Basic Authentication

```typescript
import { useEnhancedWalletLogin } from '@/wallet/hooks/wallet-auth/enhanced-wallet-auth';

const LoginComponent = () => {
  const {
    isLoading,
    walletError,
    isConnected,
    address,
    handleConnectWallet,
    handleWalletLogin,
  } = useEnhancedWalletLogin({
    onLoginSuccess: (response) => {
      console.log('Login successful:', response);
    },
    onLoginError: (error) => {
      console.error('Login failed:', error);
    },
    onWalletSourceCreated: (response) => {
      console.log('Wallet source created:', response);
    },
  });

  // Component implementation...
};
```

### Direct API Usage

```typescript
import { WalletApiService } from '@/services/wallet-api';

// Authenticate wallet
const authResult = await WalletApiService.authenticateWallet({
  seed: 'nonce123',
  signature: '0xsignature...',
  deviceIdentifier: 'device_123',
  walletAddress: '0x1234...',
  random: {
    value: '0xrandom...',
    metadata: 'user_metadata'
  }
});

// Create wallet source
const sourceResult = await WalletApiService.createWalletSource({
  wallet: '0x1234...'
});
```

### Utility Functions

```typescript
import { 
  createWalletAuthPayload, 
  generateDeviceIdentifier,
  generateRandomHex 
} from '@/utils/wallet-utils';

// Generate device identifier
const deviceId = generateDeviceIdentifier('mobile');

// Generate random hex
const randomHex = generateRandomHex(64);

// Create auth payload
const payload = createWalletAuthPayload(
  '0x1234...',
  '0xsignature...',
  'nonce123',
  'user_metadata'
);
```

## Environment Variables

Set the following environment variable in your `.env.local`:

```bash
NEXT_PUBLIC_DAPP_API=https://your-api-domain.com
```

## Error Handling

The implementation includes comprehensive error handling:

- **Network Errors**: Automatic retry and user feedback
- **Authentication Errors**: Proper error messages and state management
- **Validation Errors**: Input validation with helpful error messages
- **API Errors**: Structured error responses with status codes

## Security Features

- **Nonce Verification**: Prevents replay attacks
- **Device Identification**: Tracks authentication devices
- **Signature Validation**: Cryptographic verification of wallet ownership
- **Token Management**: Secure storage and automatic refresh
- **Input Validation**: Sanitizes and validates all inputs

## Testing

A demo page is available at `/demo` to test:
- Utility functions
- API service structure
- Wallet connection
- Authentication flow

## Migration from Legacy System

The implementation maintains backward compatibility:
- Original `useWalletLogin` hook still works
- Legacy endpoints are supported
- Gradual migration path available

## Future Enhancements

- **Multi-chain Support**: Support for different blockchain networks
- **Advanced Security**: Additional authentication factors
- **Rate Limiting**: API rate limiting and throttling
- **Analytics**: User behavior tracking and analytics
- **Mobile Support**: Enhanced mobile wallet integration

## Troubleshooting

### Common Issues

1. **Wallet Connection Failed**
   - Check if MetaMask/other wallet is installed
   - Verify network configuration
   - Check browser console for errors

2. **Authentication Failed**
   - Verify API endpoint is correct
   - Check environment variables
   - Validate wallet address format

3. **RTK Query Errors**
   - Ensure store is properly configured
   - Check API slice registration
   - Verify middleware setup

### Debug Mode

Enable debug logging by setting:
```typescript
localStorage.setItem('debug', 'wallet-auth');
```

## Support

For issues or questions:
1. Check the demo page for functionality testing
2. Review browser console for error messages
3. Verify API endpoint configuration
4. Check network tab for API requests/responses
