/**
 * Example API hooks to demonstrate usage
 * 
 * This file shows how to create API hooks using React Query and the API client.
 * Copy and modify these patterns for your actual API endpoints.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";
import type { ApiResponse } from "./api";

// Example: Define query keys for your API endpoints
export const exampleQueryKeys = {
  articles: ["articles"] as const,
  article: (id: string) => ["articles", id] as const,
  userProfile: ["user", "profile"] as const,
};

// Example: Type definitions for your API responses
interface ExampleArticle {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface CreateArticleRequest {
  title: string;
  content: string;
  url?: string;
}

/**
 * Example: GET request hook
 * Fetches a list of articles
 */
export const useArticles = () => {
  const api = useApiClient();

  return useQuery<ApiResponse<ExampleArticle[]>>({
    queryKey: exampleQueryKeys.articles,
    queryFn: async () => {
      return await api.get<ExampleArticle[]>("/articles");
    },
  });
};

/**
 * Example: GET request hook with parameters
 * Fetches a single article by ID
 */
export const useArticle = (id: string, enabled = true) => {
  const api = useApiClient();

  return useQuery<ApiResponse<ExampleArticle>>({
    queryKey: exampleQueryKeys.article(id),
    queryFn: async () => {
      return await api.get<ExampleArticle>(`/articles/${id}`);
    },
    enabled: enabled && !!id, // Only fetch if ID is provided
  });
};

/**
 * Example: POST mutation hook
 * Creates a new article
 */
export const useCreateArticle = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<ExampleArticle>, Error, CreateArticleRequest>({
    mutationFn: async (data) => {
      return await api.post<ExampleArticle>("/articles", data);
    },
    onSuccess: () => {
      // Invalidate and refetch articles list after creating
      queryClient.invalidateQueries({ queryKey: exampleQueryKeys.articles });
    },
  });
};

/**
 * Example: PUT/PATCH mutation hook
 * Updates an existing article
 */
export const useUpdateArticle = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<ExampleArticle>,
    Error,
    { id: string; data: Partial<CreateArticleRequest> }
  >({
    mutationFn: async ({ id, data }) => {
      return await api.patch<ExampleArticle>(`/articles/${id}`, data);
    },
    onSuccess: (response, variables) => {
      // Invalidate both the specific article and the list
      queryClient.invalidateQueries({ queryKey: exampleQueryKeys.article(variables.id) });
      queryClient.invalidateQueries({ queryKey: exampleQueryKeys.articles });
    },
  });
};

/**
 * Example: DELETE mutation hook
 * Deletes an article
 */
export const useDeleteArticle = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<void>, Error, string>({
    mutationFn: async (id) => {
      return await api.delete<void>(`/articles/${id}`);
    },
    onSuccess: () => {
      // Invalidate articles list after deletion
      queryClient.invalidateQueries({ queryKey: exampleQueryKeys.articles });
    },
  });
};

/**
 * Example: GET request with query parameters
 * Searches articles with filters
 */
export const useSearchArticles = (searchTerm: string, enabled = true) => {
  const api = useApiClient();

  return useQuery<ApiResponse<ExampleArticle[]>>({
    queryKey: ["articles", "search", searchTerm],
    queryFn: async () => {
      return await api.get<ExampleArticle[]>("/articles/search", {
        params: { q: searchTerm },
      });
    },
    enabled: enabled && searchTerm.length > 0,
  });
};

