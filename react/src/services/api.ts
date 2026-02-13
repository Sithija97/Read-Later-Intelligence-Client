/**
 * API Client Configuration
 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

/**
 * API Error class for handling API errors
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown,
    message?: string
  ) {
    super(message || `API Error: ${status} ${statusText}`);
    this.name = "ApiError";
  }
}

/**
 * API Request Options
 */
export interface ApiRequestOptions extends RequestInit {
  requireAuth?: boolean; // Whether authentication is required (default: true)
  params?: Record<string, string | number | boolean | null | undefined>; // Query parameters
}

/**
 * API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Get authentication token from Clerk
 * Note: This is a fallback for standalone usage. Prefer using useApiClient hook instead.
 */
export const getAuthToken = async (): Promise<string | null> => {
  // This function is kept for backwards compatibility
  // In most cases, you should use the useApiClient hook which handles tokens automatically
  return null;
};

/**
 * Build query string from params object
 */
const buildQueryString = (params: Record<string, string | number | boolean | null | undefined>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
};

/**
 * API Client class
 */
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ""); // Remove trailing slash
  }

  /**
   * Get authentication headers
   */
  private async getAuthHeaders(token: string | null): Promise<HeadersInit> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    let data: T;
    try {
      data = isJson ? await response.json() : ((await response.text()) as unknown as T);
    } catch (error) {
      data = {} as T;
    }

    if (!response.ok) {
      throw new ApiError(
        response.status,
        response.statusText,
        data,
        `Request failed with status ${response.status}`
      );
    }

    return {
      data,
      status: response.status,
    };
  }

  /**
   * Make API request
   */
  async request<T = unknown>(
    endpoint: string,
    options: ApiRequestOptions = {},
    token?: string | null
  ): Promise<ApiResponse<T>> {
    const {
      requireAuth = true,
      params,
      headers: customHeaders,
      ...fetchOptions
    } = options;

    // Build URL with query parameters
    const url = `${this.baseURL}${endpoint}${params ? buildQueryString(params) : ""}`;

    // Get auth token if required
    const authToken = requireAuth ? (token ?? await getAuthToken()) : null;

    // Get headers
    const authHeaders = await this.getAuthHeaders(authToken || null);
    const headers = {
      ...authHeaders,
      ...customHeaders,
    };

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      return await this.handleResponse<T>(response);
    } catch (err) {
      if (err instanceof ApiError) {
        throw err;
      }

      // Network or other errors
      throw new ApiError(
        0,
        "Network Error",
        undefined,
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }

  /**
   * GET request
   */
  async get<T = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
    token?: string | null
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "GET" }, token);
  }

  /**
   * POST request
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
    token?: string | null
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      },
      token
    );
  }

  /**
   * PUT request
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
    token?: string | null
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      },
      token
    );
  }

  /**
   * PATCH request
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
    token?: string | null
  ): Promise<ApiResponse<T>> {
    return this.request<T>(
      endpoint,
      {
        ...options,
        method: "PATCH",
        body: data ? JSON.stringify(data) : undefined,
      },
      token
    );
  }

  /**
   * DELETE request
   */
  async delete<T = unknown>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
    token?: string | null
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" }, token);
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export default for convenience
export default apiClient;

