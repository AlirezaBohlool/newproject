import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_DAPP_API || 'https://auth.exmodules.org';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Prioritize auth_token (from set-role) over token (from login/register)
      const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(error);
  }
);

// Types based on the API documentation
export interface WalletAuthenticateRequest {
  iso3?: string;           // Optional: Only required for login
  referralCode?: string;   // Optional: Only required for login
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
  result: {
    walletName: string;
    wallet: string;
    createdAt: string;
    updatedAt: string;
  };
  timestamp: string;
}

export interface NonceRequest {
  walletAddress: string;
}

export interface NonceResponse {
  statusCode: number;
  result: {
    nonce: string;
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

// Wallet API service class
export class WalletApiService {
  /**
   * Fetch nonce for wallet authentication
   */
  static async fetchNonce(walletAddress: string): Promise<string> {
    try {
      const response = await apiClient.post<NonceResponse>('/api/v1/wallet/nonce', {
        walletAddress,
      });
      return response.data.result.nonce;
    } catch (error) {
      console.error('Failed to fetch nonce:', error);
      throw new Error('Failed to start authentication process');
    }
  }

  /**
   * Authenticate wallet using the new API endpoint
   */
  static async authenticateWallet(credentials: WalletAuthenticateRequest): Promise<WalletAuthenticateResponse> {
    try {
      const response = await apiClient.post<WalletAuthenticateResponse>(
        '/api/v1/user/wallet/authenticate',
        credentials
      );
      return response.data;
    } catch (error: any) {
      console.error('Wallet authentication failed:', error);
      if (error.response?.data?.message?.msg) {
        throw new Error(error.response.data.message.msg);
      }
      throw new Error('Authentication failed');
    }
  }

  /**
   * Create wallet source
   */
  static async createWalletSource(walletData: WalletSourceRequest): Promise<WalletSourceResponse> {
    try {
      const response = await apiClient.post<WalletSourceResponse>(
        '/api/v1/wallet/source',
        walletData
      );
      return response.data;
    } catch (error: any) {
      console.error('Failed to create wallet source:', error);
      if (error.response?.data?.message?.msg) {
        throw new Error(error.response.data.message.msg);
      }
      throw new Error('Failed to create wallet source');
    }
  }

  /**
   * Legacy wallet signin (keeping for backward compatibility)
   */
  static async signinWallet(signature: string, walletAddress: string, content: any): Promise<any> {
    try {
      const response = await apiClient.post('/api/v1/wallet/signin-wallet', {
        signature,
        walletAddress,
        content,
      });
      return response.data;
    } catch (error: any) {
      console.error('Legacy wallet signin failed:', error);
      if (error.response?.data?.message?.msg) {
        throw new Error(error.response.data.message.msg);
      }
      throw new Error('Signin failed');
    }
  }

  /**
   * Get wallet information
   */
  static async getWalletInfo(walletAddress: string): Promise<any> {
    try {
      const response = await apiClient.get(`/api/v1/wallet/${walletAddress}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to get wallet info:', error);
      if (error.response?.data?.message?.msg) {
        throw new Error(error.response.data.message.msg);
      }
      throw new Error('Failed to get wallet information');
    }
  }

  /**
   * Update wallet information
   */
  static async updateWalletInfo(walletAddress: string, updateData: any): Promise<any> {
    try {
      const response = await apiClient.put(`/api/v1/wallet/${walletAddress}`, updateData);
      return response.data;
    } catch (error: any) {
      console.error('Failed to update wallet info:', error);
      if (error.response?.data?.message?.msg) {
        throw new Error(error.response.data.message.msg);
      }
      throw new Error('Failed to update wallet information');
    }
  }

  /**
   * Delete wallet
   */
  static async deleteWallet(walletAddress: string): Promise<any> {
    try {
      const response = await apiClient.delete(`/api/v1/wallet/${walletAddress}`);
      return response.data;
    } catch (error: any) {
      console.error('Failed to delete wallet:', error);
      if (error.response?.data?.message?.msg) {
        throw new Error(error.response.data.message.msg);
      }
      throw new Error('Failed to delete wallet');
    }
  }
}

// Export the service instance
export default WalletApiService;
