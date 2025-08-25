import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../../store';
import type { 
  MenuRequestBody, 
  RoleItem, 
  RoleResponse, 
  CreateRoleRequest,
  UpdateRoleRequest,
  CreateRoleActionRequest,
  UpdateRoleActionRequest,
  RoleActionResponse,
  DeleteRoleActionResponse,
  RoleActionPaginationResponse
} from '../types';

// Define a type for the create role response
interface CreateRoleResponse {
  statusCode: number;
  result: RoleItem;
  timestamp: string;
}

// Define a type for the delete role response
interface DeleteRoleResponse {
  statusCode: number;
  timestamp: string;
}

// Define the role API
export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_DAPP_API}/api/v1/`,
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Role', 'RoleAction'],
  endpoints: (builder) => ({
    fetchRoles: builder.query<RoleResponse, MenuRequestBody>({
      query: (body) => ({
        url: 'role/pagination',
        method: 'POST',
        body,
      }),
      providesTags: (result) =>
        result
          ? [...result.result.data.map(({ roleId }) => ({ type: 'Role' as const, id: roleId })), { type: 'Role', id: 'LIST' }]
          : [{ type: 'Role', id: 'LIST' }],
    }),
    createRole: builder.mutation<CreateRoleResponse, CreateRoleRequest>({
      query: (roleData) => ({
        url: 'role',
        method: 'POST',
        body: roleData,
      }),
      invalidatesTags: [{ type: 'Role', id: 'LIST' }],
    }),
    deleteRole: builder.mutation<DeleteRoleResponse, string>({
      query: (roleId) => ({
        url: `role/${roleId}`,
        method: 'DELETE',
        body: {}, // Add empty object as body to satisfy content-type requirement
      }),
      invalidatesTags: (result, error, roleId) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' }
      ],
    }),
    updateRole: builder.mutation<CreateRoleResponse, { roleId: string; data: UpdateRoleRequest }>({
      query: ({ roleId, data }) => ({
        url: `role/${roleId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'Role', id: roleId },
        { type: 'Role', id: 'LIST' }
      ],
    }),
    
    // New Role Action endpoints
    createRoleAction: builder.mutation<RoleActionResponse, CreateRoleActionRequest>({
      query: (actionData) => ({
        url: 'role/action',
        method: 'POST',
        body: actionData,
      }),
      invalidatesTags: (result, error, { roleId }) => [
        { type: 'RoleAction', id: roleId },
        { type: 'RoleAction', id: 'LIST' }
      ],
    }),
    
    updateRoleAction: builder.mutation<RoleActionResponse, { roleActionId: string; data: UpdateRoleActionRequest }>({
      query: ({ roleActionId, data }) => ({
        url: `role/action/${roleActionId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { roleActionId }) => [
        { type: 'RoleAction', id: roleActionId },
        { type: 'RoleAction', id: 'LIST' }
      ],
    }),
    
    getRoleAction: builder.query<RoleActionResponse, string>({
      query: (roleActionId) => ({
        url: `role/action/${roleActionId}`,
        method: 'GET',
      }),
      providesTags: (result, error, roleActionId) => [{ type: 'RoleAction', id: roleActionId }],
    }),
    
    deleteRoleAction: builder.mutation<DeleteRoleActionResponse, string>({
      query: (roleActionId) => ({
        url: `role/action/${roleActionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, roleActionId) => [
        { type: 'RoleAction', id: roleActionId },
        { type: 'RoleAction', id: 'LIST' }
      ],
    }),
    
    fetchRoleActions: builder.query<RoleActionPaginationResponse, { roleId: string; params: MenuRequestBody }>({
      query: ({ roleId, params }) => ({
        url: `role/pagination/action/${roleId}`,
        method: 'POST',
        body: params,
      }),
      providesTags: (result, error, { roleId }) => [
        { type: 'RoleAction', id: roleId },
        { type: 'RoleAction', id: 'LIST' }
      ],
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useFetchRolesQuery,
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useUpdateRoleMutation,
  
  // Export hooks for role action
  useCreateRoleActionMutation,
  useUpdateRoleActionMutation,
  useGetRoleActionQuery,
  useDeleteRoleActionMutation,
  useFetchRoleActionsQuery,
} = roleApi;

// Export the reducer and middleware
export const roleApiReducer = roleApi.reducer;
export const roleApiMiddleware = roleApi.middleware;