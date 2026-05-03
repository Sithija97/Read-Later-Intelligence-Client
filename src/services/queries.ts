import {
  useQuery,
  useMutation,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import { ApiError, type ApiResponse, type ApiRequestOptions } from "./api";

/**
 * Standard query key factory
 * Helps with consistent query key generation across the app
 */
export const queryKeys = {
  items: ["items"],
  item: (id: string) => ["items", id],
  todaysItems: ["items", "today"],
} as const;

/**
 * Types for API requests/responses
 */
export interface ApiSuccessPayload<T> {
  status: "success";
  message?: string;
  data: T;
}

export interface ApiErrorPayload {
  status: "error";
  message: string;
  errors?: unknown;
}

export interface CreateItemRequest {
  url: string;
}

export interface CreateItemPayload {
  id: string;
  status: string;
}

export interface CompleteItemRequest {
  id: string;
  isCompleted: boolean;
  isSkimmed: boolean;
}

export interface FeedbackRequest {
  id: string;
  worthReadingFeedback: "yes" | "no";
  note?: string;
}

export interface ItemResponse {
  id: string;
  url: string;
  title?: string;
  source?: string;
  wordCount?: number;
  readingTimeMinutes?: number;
  difficulty?: "easy" | "medium" | "hard";
  summary?: string[];
  content?: string;
  status: "created" | "processing" | "ready" | "failed" | "read";
  savedAt: string;
  isCompleted?: boolean;
  isSkimmed?: boolean;
}

/**
 * Generic API query hook factory
 * Creates a React Query hook that uses the API client with Clerk token
 */
export const createApiQuery = <TData = unknown, TError = ApiError>(
  endpoint: string,
  options?: Omit<ApiRequestOptions, "method" | "body">,
  queryOptions?: Omit<
    UseQueryOptions<ApiResponse<TData>, TError>,
    "queryKey" | "queryFn"
  >,
) => {
  return () => {
    const api = useApiClient();

    return useQuery<ApiResponse<TData>, TError>({
      queryKey: [endpoint, options?.params],
      queryFn: async () => {
        return await api.get<TData>(endpoint, options);
      },
      ...queryOptions,
    });
  };
};

/**
 * Generic API mutation hook factory
 * Creates a React Query mutation hook that uses the API client with Clerk token
 */
export const createApiMutation = <
  TData = unknown,
  TVariables = unknown,
  TError = ApiError,
>(
  mutationFn: (
    api: ReturnType<typeof useApiClient>,
    variables: TVariables,
  ) => Promise<ApiResponse<TData>>,
  mutationOptions?: Omit<
    UseMutationOptions<ApiResponse<TData>, TError, TVariables>,
    "mutationFn"
  >,
) => {
  return () => {
    const api = useApiClient();

    return useMutation<ApiResponse<TData>, TError, TVariables>({
      mutationFn: async (variables: TVariables) => {
        return await mutationFn(api, variables);
      },
      ...mutationOptions,
    });
  };
};

// Re-export types for convenience
export type { ApiRequestOptions };

/**
 * Sync User Mutation
 * Syncs authenticated user to MongoDB
 */
export const useSyncUserMutation = () => {
  return createApiMutation<unknown, void>(async (api) => {
    return await api.post<unknown>("/auth/sync-user");
  })();
};

/**
 * Create Item Mutation
 * Saves a new article URL for processing
 */
export const useCreateItem = () => {
  return createApiMutation<
    ApiSuccessPayload<CreateItemPayload>,
    CreateItemRequest
  >(
    async (api, variables) => {
      return await api.post<ApiSuccessPayload<CreateItemPayload>>(
        "/items/create-item",
        variables,
      );
    },
    {
      onSuccess: (data) => {
        console.log("Item created successfully:", data);
      },
      onError: (error) => {
        console.error("Failed to create item:", error);
      },
    },
  )();
};

/**
 * Get Item by ID Query
 * Fetches a single item with all metadata
 */
export const useGetItem = (itemId: string, options?: { enabled?: boolean }) => {
  return createApiQuery<ApiSuccessPayload<ItemResponse>>(
    `/items/items/${itemId}`,
    undefined,
    {
      enabled: options?.enabled ?? !!itemId,
      refetchInterval: (query) => {
        // Auto-refetch every 2 seconds if status is "processing"
        const status = query.state.data?.data.data?.status;
        return status === "processing" ? 2000 : false;
      },
    },
  )();
};

/**
 * Get All Items Query
 * Fetches all items for the authenticated user
 */
export const useGetItems = (status?: string) => {
  return createApiQuery<ApiSuccessPayload<ItemResponse[]>>(
    "/items/items",
    { params: status ? { status } : undefined },
    {
      staleTime: 1000 * 30, // 30 seconds
    },
  )();
};

/**
 * Get Today's Items Query
 * Fetches up to 3 ready, unread items for the day queue
 */
export const useGetTodaysItems = () => {
  return createApiQuery<ApiSuccessPayload<ItemResponse[]>>(
    "/items/today",
    undefined,
    {
      staleTime: 1000 * 10,
    },
  )();
};

/**
 * Mark Item Complete Mutation
 * Updates isCompleted/isSkimmed based on read mode
 */
export const useMarkItemComplete = () => {
  return createApiMutation<
    ApiSuccessPayload<Pick<ItemResponse, "id" | "isCompleted" | "isSkimmed">>,
    CompleteItemRequest
  >(async (api, variables) => {
    return await api.patch<
      ApiSuccessPayload<Pick<ItemResponse, "id" | "isCompleted" | "isSkimmed">>
    >(`/items/items/${variables.id}/complete`, {
      isCompleted: variables.isCompleted,
      isSkimmed: variables.isSkimmed,
    });
  })();
};

/**
 * Submit Feedback Mutation
 * Sends yes/no worth-reading feedback with optional note
 */
export const useSubmitFeedback = () => {
  return createApiMutation<
    ApiSuccessPayload<Pick<ItemResponse, "id">>,
    FeedbackRequest
  >(async (api, variables) => {
    return await api.patch<ApiSuccessPayload<Pick<ItemResponse, "id">>>(
      `/items/items/${variables.id}/feedback`,
      {
        worthReadingFeedback: variables.worthReadingFeedback,
        note: variables.note,
      },
    );
  })();
};

/**
 * Snooze Item Mutation
 * Hides an item from today's reads until midnight tonight.
 * The /today endpoint automatically un-snoozes it the next day.
 */
export const useSnoozeItem = () => {
  return createApiMutation<ApiSuccessPayload<{ id: string }>, string>(
    async (api, itemId) => {
      return await api.patch<ApiSuccessPayload<{ id: string }>>(
        `/items/items/${itemId}/snooze`,
      );
    },
  )();
};

/**
 * Delete Item Mutation
 * Permanently removes an item from the user's library.
 */
export const useDeleteItem = () => {
  return createApiMutation<ApiSuccessPayload<null>, string>(
    async (api, itemId) => {
      return await api.delete<ApiSuccessPayload<null>>(
        `/items/items/${itemId}`,
      );
    },
  )();
};
