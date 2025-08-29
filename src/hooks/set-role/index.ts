import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { DecodedToken, login } from "@/store/auth";
import { useRouter } from "next/navigation";
// Get API base URL from environment variable
const apiBaseUrl = process.env.NEXT_PUBLIC_DAPP_API;

// Types for request and response
interface SetRoleRequest {
  roleId: string;
}

interface SetRoleSuccessResponse {
  statusCode: number;
  result: {
    token: string;
  };
  timestamp: string;
}

interface ErrorDetail {
  msg: string;
  code: number;
}

interface ErrorResponse {
  statusCode: number;
  message: ErrorDetail | ErrorDetail[];
  timestamp: string;
}

// JWT token structure
interface Role {
  roleId: string;
  slug: string;
}


interface UseSetRoleReturn {
  setRole: (jwtToken?: string, roleId?: string) => Promise<void>;
  token: string | null;
  isLoading: boolean;
  error: ErrorResponse | null;
  isSuccess: boolean;
  reset: () => void;
  decodedToken: DecodedToken | null;
  currentRoles: Role[];
  authId: string | null;
}

export const useSetRole = (): UseSetRoleReturn => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const router = useRouter();
  // Decode token when it's provided or changes
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
      } catch (error) {
        setDecodedToken(null);
      }
    } else {
      setDecodedToken(null);
    }
  }, [token]);

  const reset = () => {
    setIsLoading(false);
    setError(null);
    setToken(null);
    setIsSuccess(false);
    setDecodedToken(null);
  };
  const setRole = async (jwtToken?: string, roleIdParam?: string): Promise<void> => {
    try {
      setToken(jwtToken || null);
      let roleId: string | null = null;
      let decoded: DecodedToken | null = null;

      if (jwtToken) {
        decoded = jwtDecode<DecodedToken>(jwtToken);
        setDecodedToken(decoded);
      }

      // Use provided roleId parameter first, otherwise get from token
      if (roleIdParam) {
        roleId = roleIdParam;
      } else if (decoded?.roles?.[0]?.roleId) {
        roleId = decoded.roles?.[0].roleId;
      }

      if (!roleId) {
        throw new Error(
          "No role ID provided and no roles found in current token"
        );
      }

      setIsLoading(true);
      setError(null);
      setIsSuccess(false);

      const response = await axios.post<SetRoleSuccessResponse>(
        `${apiBaseUrl}/api/v1/user/set-role`,
        { roleId } as SetRoleRequest,
        jwtToken
          ? {
              headers: {
                Authorization: `Bearer ${jwtToken}`,
              },
            }
          : undefined
      );      const newToken = response.data.result.token;
      setToken(newToken);
      setIsSuccess(true);
      
      // Store the access token in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('role_selected', 'true');
      }
      
      // Update Redux store with login information (which will handle localStorage)
      dispatch(
        login({
          token: jwtToken || "",
          accessToken: newToken,
          authId: decoded?.auth || "",
          roles: decoded?.roles || [],
          exp: decoded?.exp || 0,
          userId: decoded?.userId || "", // Assuming userId is available in the token
        })
      );
      // Don't auto-redirect here - let the calling component handle navigation
    } catch (err) {
      if (err instanceof Error) {
        setError({
          statusCode: 400,
          message: { msg: err.message, code: 0 },
          timestamp: new Date().toISOString(),
        });
      } else {
        const axiosError = err as AxiosError<ErrorResponse>;
        setError(
          axiosError.response?.data || {
            statusCode: 500,
            message: { msg: "An unexpected error occurred", code: 0 },
            timestamp: new Date().toISOString(),
          }
        );
      }
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate derived values
  const currentRoles = decodedToken?.roles || [];
  const authId = decodedToken?.auth || null;

  return {
    setRole,
    token,
    isLoading,
    error,
    isSuccess,
    reset,
    decodedToken,
    currentRoles,
    authId,
  };
};

export default useSetRole;
