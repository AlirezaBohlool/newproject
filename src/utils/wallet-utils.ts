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
 * Create a wallet authentication payload
 * @param walletAddress - The wallet address
 * @param signature - The signature from the wallet
 * @param seed - The seed/nonce value
 * @param metadata - Optional metadata
 * @returns A properly formatted wallet authentication request
 */
export const createWalletAuthPayload = (
  walletAddress: string,
  signature: string,
  seed: string,
  metadata: string = 'default'
) => {
  return {
    seed,
    signature,
    deviceIdentifier: generateDeviceIdentifier(),
    walletAddress: walletAddress.toLowerCase(),
    random: {
      value: generateRandomHex(),
      metadata,
    },
  };
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
