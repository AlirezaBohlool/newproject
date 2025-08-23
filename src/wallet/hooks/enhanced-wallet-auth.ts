import { useState, useEffect } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useAppKit, useDisconnect } from "@reown/appkit/react";
import { keccak256, stringToHex } from "viem";
import { useDispatch } from "react-redux";
import { setToken } from "@/store/auth";
import { jwtDecode } from "jwt-decode";
import { 
  useAuthenticateWalletMutation, 
  useCreateWalletSourceMutation,
  WalletAuthenticateRequest 
} from "@/store/api/wallet";
import { 
  createWalletAuthPayload, 
  isValidWalletAddress,
  formatWalletAddress 
} from "@/utils/wallet-utils";

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

interface UseEnhancedWalletLoginOptions {
  metaData?: string;
  onLoginSuccess?: (response: AuthResponse) => void;
  onLoginError?: (error: any) => void;
  onWalletSourceCreated?: (response: any) => void;
}

export const useEnhancedWalletLogin = (options: UseEnhancedWalletLoginOptions = {}) => {
  const {
    metaData = "1234",
    onLoginSuccess,
    onLoginError,
    onWalletSourceCreated,
  } = options;

  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { open } = useAppKit();
  const { signMessageAsync } = useSignMessage();
  const [isLoading, setIsLoading] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const dispatch = useDispatch();

  // RTK Query hooks
  const [authenticateWallet, { isLoading: isAuthenticating }] = useAuthenticateWalletMutation();
  const [createWalletSource, { isLoading: isCreatingSource }] = useCreateWalletSourceMutation();

  useEffect(() => {
    // Check if wallet is connected and proceed with authentication
    if (isConnected && address) {
      handleWalletLogin();
    }
  }, [isConnected, address]);

  const fetchNonce = async (walletAddress: string): Promise<string> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DAPP_API}/api/v1/wallet/nonce`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            walletAddress,
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error(`Failed to fetch nonce: ${response.status}`);
      }
      
      const data = await response.json();
      return data.result.nonce;
    } catch (error) {
      disconnect(); // Disconnect if there's an error
      setWalletError("Failed to start authentication process");
      throw error;
    }
  };

  const signMessage = async (nonce: string): Promise<string> => {
    try {
      const content: AuthContent = {
        nonce,
        metaData,
      };
      const message = JSON.stringify(content);
      const messageHash = keccak256(stringToHex(message));

      const signature = await signMessageAsync({ message: messageHash });
      return signature.toLowerCase();
    } catch (error) {
      setWalletError("Signature request was rejected");
      disconnect();
      throw error;
    }
  };

  const walletLogin = async (
    signature: string,
    walletAddress: string,
    nonce: string
  ): Promise<AuthResponse> => {
    try {
      // Validate wallet address
      if (!isValidWalletAddress(walletAddress)) {
        throw new Error('Invalid wallet address format');
      }

      // Create the authentication request payload using utility function
      const authRequest: WalletAuthenticateRequest = createWalletAuthPayload(
        walletAddress,
        signature,
        nonce,
        metaData
      );

      // Use the RTK Query mutation
      const result = await authenticateWallet(authRequest).unwrap();
      
      // The result should contain the token in the expected format
      const token = result.result.value;
      
      try {
        // Decode token to verify it's valid
        const decoded = jwtDecode<DecodedToken>(token);
        
        // Store the token in Redux
        dispatch(setToken(token));
        
        // Create wallet source after successful authentication
        try {
          const sourceResult = await createWalletSource({ wallet: walletAddress }).unwrap();
          if (onWalletSourceCreated) {
            onWalletSourceCreated(sourceResult);
          }
        } catch (sourceError) {
          console.warn('Failed to create wallet source:', sourceError);
          // Don't fail the login if wallet source creation fails
        }
        
      } catch (decodeError) {
        console.error('Failed to decode wallet token:', decodeError);
        throw new Error('Invalid token received from wallet authentication');
      }
      
      return { result: { token } };
    } catch (error) {
      setWalletError("Authentication failed");
      disconnect();
      throw error;
    }
  };

  const handleWalletLogin = async () => {
    if (!address) return;

    setIsLoading(true);
    setWalletError("");
    setGeneralError("");

    try {
      const nonce = await fetchNonce(address.toLowerCase());
      const signature = await signMessage(nonce);
      const authResult = await walletLogin(
        signature.toLowerCase(),
        address.toLowerCase(),
        nonce
      );
      
      // Call onLoginSuccess callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(authResult);
      }
    } catch (error) {
      disconnect();

      if (onLoginError) {
        onLoginError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectWallet = () => {
    setWalletError(""); // Clear previous errors
    open();
  };

  return {
    isLoading: isLoading || isAuthenticating || isCreatingSource,
    walletError,
    generalError,
    isConnected,
    address,
    handleConnectWallet,
    handleWalletLogin,
    setWalletError,
    setGeneralError,
    // RTK Query states
    isAuthenticating,
    isCreatingSource,
  };
};
