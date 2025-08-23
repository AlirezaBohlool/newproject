# Wallet API Configuration Guide

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```bash
# Your API base URL (required)
NEXT_PUBLIC_DAPP_API=https://auth.exmodules.org

# Wallet Connect Project ID (required for wallet connection)
NEXT_PUBLIC_WALLET_PROJECT_ID=your_project_id_here
```

## API Endpoints

The wallet authentication system uses the following endpoints:

### 1. Wallet Authentication
- **Endpoint**: `POST /api/v1/user/wallet/authenticate`
- **Purpose**: Authenticate wallet and get JWT token
- **Request Body**:
  ```json
  {
    "iso3": "USA",
    "referralCode": "default",
    "signature": "wallet_signature",
    "walletAddress": "0x...",
    "content": {
      "nonce": "uuid-like-string",
      "metadata": "optional_metadata"
    }
  }
  ```

### 2. Create Wallet Source
- **Endpoint**: `POST /api/v1/wallet/save`
- **Purpose**: Save wallet information after authentication
- **Request Body**:
  ```json
  {
    "wallet": "0x..."
  }
  ```

## How It Works

1. **Wallet Connection**: User connects their wallet using WalletConnect
2. **Nonce Generation**: A UUID-like nonce is generated locally (no API call needed)
3. **Message Signing**: User signs a message containing the nonce and metadata
4. **Authentication**: The signed message is sent to authenticate the wallet
5. **Token Storage**: JWT token is stored in Redux store
6. **Wallet Source**: Wallet information is saved to the database

## Troubleshooting

### Common Issues:

1. **500 Internal Server Error**: Usually means the API endpoint is wrong or the server is down
2. **401 Unauthorized**: Check if your API base URL is correct
3. **CORS Errors**: Ensure your API server allows requests from your frontend domain

### Testing:

Use the `/demo` page to test the wallet connection and authentication flow.

## Development

For production, use your actual server:
```bash
NEXT_PUBLIC_DAPP_API=https://auth.exmodules.org
```

For local development (if you have a local API server), you can override this:
```bash
NEXT_PUBLIC_DAPP_API=http://localhost:3000
```
