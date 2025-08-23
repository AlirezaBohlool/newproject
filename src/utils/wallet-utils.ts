/**
 * Utility functions for wallet authentication
 */

/**
 * Generate a unique device identifier
 * @param prefix - Optional prefix for the device identifier
 * @returns A unique device identifier string
 */
export const generateDeviceIdentifier = (prefix: string = 'device'): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown';
  const userAgentHash = userAgent.split('').reduce((a, b) => {
    a = ((a << 5) - a + b.charCodeAt(0)) & 0xffffffff;
    return a;
  }, 0);
  
  return `${prefix}_${timestamp}_${random}_${Math.abs(userAgentHash).toString(36)}`;
};

/**
 * Generate a random hexadecimal value
 * @param length - Length of the hex string (default: 40)
 * @returns A random hexadecimal string
 */
export const generateRandomHex = (length: number = 40): string => {
  const chars = '0123456789abcdef';
  let result = '0x';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * Generate a random seed value
 * @param length - Length of the seed string (default: 32)
 * @returns A random seed string
 */
export const generateRandomSeed = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

/**
 * Generate a UUID-like nonce for wallet authentication
 * @returns A unique nonce string
 */
export const generateNonce = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * Create a wallet authentication payload
 * @param walletAddress - The wallet address
 * @param signature - The signature from the wallet
 * @param nonce - The nonce value
 * @param metadata - The metadata string value (sent as metaData in content)
 * @param iso3 - Country code (default: 'USA')
 * @param referralCode - Referral code (default: 'default')
 * @returns A properly formatted wallet authentication request
 */
export const createWalletAuthPayload = (
  walletAddress: string,
  signature: string,
  nonce: string,
  metadata: string = "123",  // Use "123" as specified
  iso3: string = "USA",
  referralCode: string = "default"
) => {
  // Validate inputs
  if (!walletAddress || !signature || !nonce) {
    throw new Error('Missing required parameters: walletAddress, signature, and nonce are required');
  }

  // Ensure metadata is not empty
  const metadataValue = metadata && metadata.trim() !== '' ? metadata : "123";

  const payload = {
    iso3,
    referralCode,
    signature,
    walletAddress: walletAddress.toLowerCase(),
    content: {
      nonce,
      metaData: metadataValue,  // Changed to metaData with capital D
    },
  };

  // Debug: Log the payload being created
  console.log('🔍 Created auth payload:', JSON.stringify(payload, null, 2));
  console.log('🔍 Metadata value:', metadataValue);
  console.log('🔍 Metadata type:', typeof metadataValue);
  console.log('🔍 MetaData field:', payload.content.metaData);
  console.log('🔍 MetaData field type:', typeof payload.content.metaData);
  console.log('🔍 MetaData field length:', payload.content.metaData.length);
  
  return payload;
};

/**
 * Validate wallet address format
 * @param address - The wallet address to validate
 * @returns True if the address is valid, false otherwise
 */
export const isValidWalletAddress = (address: string): boolean => {
  if (!address) return false;
  
  // Basic Ethereum address validation
  const ethAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  return ethAddressRegex.test(address);
};

/**
 * Format wallet address for display
 * @param address - The wallet address to format
 * @param startLength - Number of characters to show at the start (default: 6)
 * @param endLength - Number of characters to show at the end (default: 4)
 * @returns Formatted address string (e.g., "0x1234...5678")
 */
export const formatWalletAddress = (
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string => {
  if (!address || address.length < startLength + endLength) {
    return address;
  }
  
  const start = address.slice(0, startLength);
  const end = address.slice(-endLength);
  return `${start}...${end}`;
};

/**
 * Generate a unique session ID
 * @returns A unique session identifier
 */
export const generateSessionId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  return `session_${timestamp}_${random}`;
};

/**
 * Create a timestamp for API requests
 * @returns ISO string timestamp
 */
export const createTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Validate API response structure
 * @param response - The API response to validate
 * @returns True if the response has the expected structure
 */
export const isValidApiResponse = (response: any): boolean => {
  return (
    response &&
    typeof response === 'object' &&
    'statusCode' in response &&
    'timestamp' in response
  );
};
