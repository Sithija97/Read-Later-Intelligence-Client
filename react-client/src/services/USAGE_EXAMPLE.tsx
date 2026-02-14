/**
 * USAGE EXAMPLES
 *
 * Copy these patterns into your components to start making API calls right away.
 */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";

// ============================================================================
// EXAMPLE 1: Simple GET request
// ============================================================================

export function ExampleGetRequest() {
  const api = useApiClient();

  const { isLoading, error } = useQuery({
    queryKey: ["users", "profile"],
    queryFn: async () => {
      const response = await api.get("/users/profile");
      return response.data; // response.data contains your API response
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;

  return <div>{/* Use data here */}</div>;
}

// ============================================================================
// EXAMPLE 2: GET request with query parameters
// ============================================================================

export function ExampleGetWithParams() {
  const api = useApiClient();
  const page = 1;
  const limit = 10;

  useQuery({
    queryKey: ["articles", page, limit],
    queryFn: async () => {
      const response = await api.get("/articles", {
        params: { page, limit },
      });
      return response.data;
    },
  });

  return <div>{/* Render data */}</div>;
}

// ============================================================================
// EXAMPLE 3: POST mutation
// ============================================================================

export function ExamplePostMutation() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (articleData: { title: string; content: string }) => {
      const response = await api.post("/articles", articleData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch articles list
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  const handleSubmit = () => {
    mutation.mutate({
      title: "My Article",
      content: "Article content here",
    });
  };

  return (
    <button onClick={handleSubmit} disabled={mutation.isPending}>
      {mutation.isPending ? "Creating..." : "Create Article"}
    </button>
  );
}

// ============================================================================
// EXAMPLE 4: PUT/PATCH mutation
// ============================================================================

export function ExampleUpdateMutation() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Record<string, unknown>;
    }) => {
      const response = await api.patch(`/articles/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate specific article and list
      queryClient.invalidateQueries({ queryKey: ["articles", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  return mutation;
}

// ============================================================================
// EXAMPLE 5: DELETE mutation
// ============================================================================

export function ExampleDeleteMutation() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/articles/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  return mutation;
}

// ============================================================================
// EXAMPLE 6: Custom hook pattern (Recommended)
// ============================================================================

// Create this in a separate file: src/services/articles-api.ts
export function useArticles() {
  const api = useApiClient();

  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await api.get("/articles");
      return response.data;
    },
  });
}

// Then use it in your component:
// const { data, isLoading } = useArticles();

// ============================================================================
// EXAMPLE 7: Error handling
// ============================================================================

import { ApiError } from "@/services/api";

export function ExampleWithErrorHandling() {
  const api = useApiClient();

  useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      try {
        const response = await api.get("/articles");
        return response.data;
      } catch (err) {
        if (err instanceof ApiError) {
          console.error("API Error:", err.status, err.data);
          // Handle specific error codes
          if (err.status === 401) {
            // Handle unauthorized
          } else if (err.status === 404) {
            // Handle not found
          }
        }
        throw err;
      }
    },
  });

  return <div>{/* Component JSX */}</div>;
}
