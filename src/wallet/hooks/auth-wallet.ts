import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import axios from "axios";
import { keccak256, stringToHex } from "viem";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/auth";
import { jwtDecode } from "jwt-decode";

// Types
interface AuthContent {
  nonce: string;
  metaData: string;
}

interface AuthResponse {
  result: {
    token: string;
    // Add other properties as needed
  };
}

// JWT token structure  
interface Role {
  roleId: string;
  slug: string;
}

interface DecodedToken {
  auth: string;
  roles: Role[];
  iat: number;
  exp: number;
}

interface UseAuthWalletOptions {
  metaData?: string;
  iso3?: string;
  referralCode?: string;
  onSuccess?: (response: AuthResponse) => void;
  onError?: (error: any) => void;
  mode?: 'login' | 'register';
}

export const useAuthWallet = (options: UseAuthWalletOptions = {}) => {
  const {
    metaData = "1234",
    iso3 = "USA",
    referralCode = "DEMO123", // Default referral code to prevent backend errors
    onSuccess,
    onError,
    mode = 'login',
  } = options;

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const dispatch = useDispatch();

  // Remove automatic authentication on wallet connection
  // useEffect(() => {
  //   if (isConnected && address) {
  //     handleAuth();
  //   }
  // }, [isConnected, address]);

  const fetchNonce = async (wallet: string): Promise<string> => {
    try {
      console.log('🔐 Fetching nonce for wallet:', wallet);
      const response = await axios.post(
        `https://auth.exmodules.org/api/v1/wallet/nonce`,
        {
          wallet,
        }
      );
      console.log('✅ Nonce response:', response.data);
      
      // Handle different response structures
      if (response.data.result && response.data.result.nonce) {
        return response.data.result.nonce;
      } else if (response.data.nonce) {
        return response.data.nonce;
      } else {
        throw new Error('Invalid nonce response structure');
      }
    } catch (error: any) {
      console.error('❌ Nonce fetch error:', error.response?.data || error.message);
      
      if (error.response?.status === 403) {
        setWalletError("Access forbidden. Please check your wallet permissions.");
      } else if (error.response?.status === 401) {
        setWalletError("Unauthorized. Please reconnect your wallet.");
      } else {
        setWalletError("Failed to start authentication process");
      }
      
      // Don't disconnect immediately on nonce errors
      throw error;
    }
  };

  const signMessage = async (nonce: string): Promise<string> => {
    try {
      console.log('✍️ Signing message with nonce:', nonce);
      const content: AuthContent = {
        nonce,
        metaData,
      };
      const message = JSON.stringify(content);
      const messageHash = keccak256(stringToHex(message));

      const signature = await signMessageAsync({ message: messageHash });
      console.log('✅ Message signed successfully');
      return signature.toLowerCase();
    } catch (error: any) {
      console.error('❌ Message signing error:', error);
      setWalletError("Signature request was rejected");
      // Only disconnect on signature rejection
      if (error.message?.includes('rejected') || error.message?.includes('denied')) {
        disconnect();
      }
      throw error;
    }
  };

  const authenticateWallet = async (
    signature: string,
    walletAddress: string,
    nonce: string
  ): Promise<AuthResponse> => {
    try {
      console.log('🔑 Authenticating wallet with signature and nonce');
      const response = await axios.post(
        `https://auth.exmodules.org/api/v1/user/wallet/authenticate`,
        {
          iso3,
          referralCode,
          signature,
          walletAddress,
          content: {
            nonce,
            metaData,
          },
        }
      );
      
      console.log('✅ Authentication response:', response.data);
      
      // Handle different response structures
      let token;
      if (response.data.result && response.data.result.token) {
        token = response.data.result.token;
      } else if (response.data.token) {
        token = response.data.token;
      } else {
        throw new Error('No token received from authentication');
      }
      
      try {
        // Decode token to verify it's valid
        const decoded = jwtDecode<DecodedToken>(token);
        console.log('✅ Token decoded successfully');
        
        // Store the token
        dispatch(setToken(token));
      } catch (decodeError) {
        console.error('❌ Failed to decode wallet token:', decodeError);
        throw new Error('Invalid token received from wallet authentication');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Authentication error:', error.response?.data || error.message);
      
      if (error.response?.status === 401) {
        setWalletError("Authentication failed. Please try again.");
      } else if (error.response?.status === 403) {
        setWalletError("Access forbidden. Please check your permissions.");
      } else {
        setWalletError("Authentication failed");
      }
      
      // Don't disconnect on authentication errors
      throw error;
    }
  };

  const handleAuth = async () => {
    if (!address) return;

    setIsLoading(true);
    setWalletError("");
    setGeneralError("");

    try {
      console.log('🚀 Starting authentication process for:', address);
      
      // Step 1: Get nonce
      const nonce = await fetchNonce(address.toLowerCase());
      console.log('📝 Got nonce:', nonce);
      
      // Step 2: Sign message
      const signature = await signMessage(nonce);
      console.log('✍️ Got signature:', signature);
      
      // Step 3: Authenticate
      const authResult = await authenticateWallet(
        signature.toLowerCase(),
        address.toLowerCase(),
        nonce
      );
      
      console.log('🎉 Authentication successful!');
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(authResult);
      }
    } catch (error: any) {
      console.error('💥 Authentication process failed:', error);
      
      // Only disconnect on critical errors
      if (error.message?.includes('rejected') || error.message?.includes('denied')) {
        disconnect();
      }

      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = () => {
    setWalletError(""); // Clear previous errors
    setGeneralError(""); // Clear general errors too
    open();
  };

  return {
    isLoading,
    walletError,
    generalError,
    isConnected,
    address,
    handleConnectWallet,
    handleAuth,
    setWalletError,
    setGeneralError,
    mode,
  };
};
