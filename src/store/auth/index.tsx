"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// Define Role structure
interface Role {
  roleId: string;
  slug: string;
}

// Define decoded token structure
export interface DecodedToken {
  auth: string | null;
  userId: string | null;
  roles: Role[] | null;
  iat: number;
  exp: number;
}

// Main authentication interface
interface AuthInterface {
  authId: string | null;
  userId: string | null;
  token: string | null; // Initial token passed to useSetRole
  accessToken: string | null; // Token received from set-role API
  roles: Role[];
  currentRoleId: string | null;
  expiresAt: number | null;
  currentRole: Role | null; // Added computed property for current role object
}

// Function to get the current role based on currentRoleId
const getCurrentRole = (
  roles: Role[],
  currentRoleId: string | null
): Role | null => {
  if (!currentRoleId) return null;
  return roles.find((role) => role.roleId === currentRoleId) || null;
};

const getInitialAuthState = (): AuthInterface => {
  if (typeof window !== "undefined") {
    // Try to get the token from localStorage
    const token = localStorage.getItem("token");
    const accessToken = localStorage.getItem("auth_token");
    const currentRoleId = localStorage.getItem("current_role_id");

    let authId: string | null = null; // Explicitly declare as string | null
    let userId: string | null = null; // Explicitly declare as string | null
    let roles: Role[] = [];
    let expiresAt: number | null = null; // Explicitly declare as number | null

    // Try to decode the accessToken if it exists
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        authId = decoded.auth;
        userId = decoded.userId;
        roles = decoded.roles || [];
        expiresAt = decoded.exp;
      } catch (error) {}
    }

    return {
      authId,
      userId,
      token,
      accessToken,
      roles,
      currentRoleId,
      expiresAt,
      currentRole: getCurrentRole(roles, currentRoleId),
    };
  }

  return {
    authId: null,
    userId: null,
    token: null,
    accessToken: null,
    roles: [],
    currentRoleId: null,
    expiresAt: null,
    currentRole: null,
  };
};

const initialState: AuthInterface = getInitialAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      state.token = token;

      // Try to decode the token to extract roles and authId
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        state.authId = decoded.auth;
        state.userId = decoded.userId;
        state.roles = decoded.roles || [];
        state.expiresAt = decoded.exp;

        // Don't auto-select any role, let user choose in modal
        // Only keep existing currentRoleId if it exists in the new roles array
        if (
          state.currentRoleId &&
          !state.roles.some((role) => role.roleId === state.currentRoleId)
        ) {
          state.currentRoleId = null;
        }

        // Update the currentRole based on currentRoleId
        state.currentRole = getCurrentRole(state.roles, state.currentRoleId);

        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
          localStorage.setItem("auth_id", decoded.auth ?? "");
          localStorage.setItem("user_id", decoded.userId ?? "");
          localStorage.setItem("roles", JSON.stringify(decoded.roles || []));
          localStorage.setItem("expires_at", decoded.exp.toString());

          // Only save currentRoleId if it exists
          if (state.currentRoleId) {
            localStorage.setItem("current_role_id", state.currentRoleId);
          } else {
            localStorage.removeItem("current_role_id");
          }
        }
      } catch (error) {
        // If token decode fails, just store the token
        console.error("Failed to decode token in setToken:", error);
        if (typeof window !== "undefined") {
          localStorage.setItem("token", token);
        }
      }
    },
    setAccessToken: (state, action: PayloadAction<string>) => {
      try {
        const accessToken = action.payload;
        const decoded = jwtDecode<DecodedToken>(accessToken);
        state.accessToken = accessToken;
        state.authId = decoded.auth;
        state.userId = decoded.userId;
        state.roles = decoded.roles || [];
        state.expiresAt = decoded.exp;

        // Don't auto-select the first role - let user choose manually
        // Only keep existing currentRoleId if it exists in the new roles array
        if (
          state.currentRoleId &&
          !state.roles.some((role) => role.roleId === state.currentRoleId)
        ) {
          state.currentRoleId = null;
        }

        // Update the currentRole based on currentRoleId
        state.currentRole = getCurrentRole(state.roles, state.currentRoleId);

        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", accessToken);
          localStorage.setItem("user_id", decoded.userId ?? "");
          if (state.currentRoleId) {
            localStorage.setItem("current_role_id", state.currentRoleId);
          } else {
            localStorage.removeItem("current_role_id");
          }
        }
      } catch (error) {}
    },

    setCurrentRole: (state, action: PayloadAction<string>) => {
      const roleId = action.payload;
      // Check if the selected role exists
      const roleExists = state.roles.some((role) => role.roleId === roleId);

      if (roleExists) {
        state.currentRoleId = roleId;
        state.currentRole = getCurrentRole(state.roles, roleId);

        if (typeof window !== "undefined") {
          localStorage.setItem("current_role_id", roleId);
        }
      }
    },
    // Add optimized login method
    login: (
      state,
      action: PayloadAction<{
        token: string;
        accessToken: string;
        authId: string;
        userId: string;
        roles?: Role[]; // Make roles optional in type definition
        exp: number;
      }>
    ) => {
      const { token, accessToken, authId, userId, exp } = action.payload;
      // Provide default empty array if roles is undefined
      const roles = action.payload.roles || [];

      // Update state with provided data
      state.token = token;
      state.accessToken = accessToken;
      state.authId = authId;
      state.userId = userId;
      state.roles = roles;
      state.expiresAt = exp;
      // Don't auto-select the first role - let user choose manually
      // Only keep existing currentRoleId if it exists in the new roles array
      if (
        state.currentRoleId &&
        !roles.some((role) => role.roleId === state.currentRoleId)
      ) {
        state.currentRoleId = null;
      }

      // Update the currentRole based on currentRoleId
      state.currentRole = getCurrentRole(roles, state.currentRoleId);

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
        localStorage.setItem("auth_token", accessToken);
        localStorage.setItem("auth_id", authId);
        localStorage.setItem("user_id", userId);
        localStorage.setItem("roles", JSON.stringify(roles));
        localStorage.setItem("expires_at", exp.toString());

        // Only save currentRoleId if it exists
        if (state.currentRoleId) {
          localStorage.setItem("current_role_id", state.currentRoleId);
        } else {
          localStorage.removeItem("current_role_id");
        }
      }
    },
    logout: (state) => {
      state.authId = null;
      state.userId = null;
      state.token = null;
      state.accessToken = null;
      state.roles = [];
      state.currentRoleId = null;
      state.expiresAt = null;
      state.currentRole = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("current_role_id");
        localStorage.removeItem("auth_id");
        localStorage.removeItem("user_id");
        localStorage.removeItem("roles");
        localStorage.removeItem("expires_at");
        localStorage.removeItem("role_selected"); // Clear role selection flag on logout
      }
    },
  },
});

export const { setToken, setAccessToken, setCurrentRole, login, logout } =
  authSlice.actions;
export default authSlice.reducer;
