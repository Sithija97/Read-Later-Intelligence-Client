import { useAuth } from "@clerk/clerk-react";
import { useMemo } from "react";
import { apiClient, type ApiRequestOptions, type ApiResponse } from "@/services/api";

/**
 * Hook to get API client with Clerk token
 * This hook automatically provides the Clerk token to all API requests
 * 
 * By default, uses the standard session token. To use a custom JWT template
 * that includes user data, pass template: 'template-name' to getToken.
 * 
 * @example
 * // Use default token (minimal claims)
 * const api = useApiClient();
 * 
 * // Use custom JWT template (if configured in Clerk Dashboard)
 * const api = useApiClient({ template: 'custom_user_info' });
 */
export const useApiClient = (options?: { template?: string }) => {
  const { getToken } = useAuth();

  return useMemo(() => {
    const getTokenWithTemplate = async () => {
      if (options?.template) {
        return await getToken({ template: options.template });
      }
      return await getToken();
    };

    return {
      /**
       * GET request
       */
      get: async <T = unknown>(
        endpoint: string,
        requestOptions?: Omit<ApiRequestOptions, "method" | "body">
      ): Promise<ApiResponse<T>> => {
        const token = await getTokenWithTemplate();
        return apiClient.get<T>(endpoint, requestOptions, token);
      },

      /**
       * POST request
       */
      post: async <T = unknown>(
        endpoint: string,
        data?: unknown,
        requestOptions?: Omit<ApiRequestOptions, "method" | "body">
      ): Promise<ApiResponse<T>> => {
        const token = await getTokenWithTemplate();
        return apiClient.post<T>(endpoint, data, requestOptions, token);
      },

      /**
       * PUT request
       */
      put: async <T = unknown>(
        endpoint: string,
        data?: unknown,
        requestOptions?: Omit<ApiRequestOptions, "method" | "body">
      ): Promise<ApiResponse<T>> => {
        const token = await getTokenWithTemplate();
        return apiClient.put<T>(endpoint, data, requestOptions, token);
      },

      /**
       * PATCH request
       */
      patch: async <T = unknown>(
        endpoint: string,
        data?: unknown,
        requestOptions?: Omit<ApiRequestOptions, "method" | "body">
      ): Promise<ApiResponse<T>> => {
        const token = await getTokenWithTemplate();
        return apiClient.patch<T>(endpoint, data, requestOptions, token);
      },

      /**
       * DELETE request
       */
      delete: async <T = unknown>(
        endpoint: string,
        requestOptions?: Omit<ApiRequestOptions, "method" | "body">
      ): Promise<ApiResponse<T>> => {
        const token = await getTokenWithTemplate();
        return apiClient.delete<T>(endpoint, requestOptions, token);
      },
    };
  }, [getToken, options?.template]);
};

