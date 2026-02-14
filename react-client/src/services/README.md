# API Service Documentation

This directory contains the API service layer for the application. It provides a standardized way to make API calls with React Query integration and automatic Clerk token authentication.

## Files

- **api.ts** - Core API client with authentication handling
- **queries.ts** - React Query utilities and helper functions
- **example-api.ts** - Example API hooks demonstrating usage patterns

## Quick Start

### 1. Basic Usage with React Query

```tsx
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";

function MyComponent() {
  const api = useApiClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await api.get("/articles");
      return response.data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### 2. Creating Custom API Hooks

Create a hook in your service file:

```tsx
// src/services/articles-api.ts
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";

export const useArticles = () => {
  const api = useApiClient();
  
  return useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await api.get("/articles");
      return response.data;
    },
  });
};
```

### 3. Making Mutations

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";

export const useCreateArticle = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (articleData) => {
      const response = await api.post("/articles", articleData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });
};
```

## API Client Methods

The `useApiClient()` hook provides the following methods:

- **`get<T>(endpoint, options?)`** - GET request
- **`post<T>(endpoint, data, options?)`** - POST request
- **`put<T>(endpoint, data, options?)`** - PUT request
- **`patch<T>(endpoint, data, options?)`** - PATCH request
- **`delete<T>(endpoint, options?)`** - DELETE request

All methods automatically include the Clerk authentication token as a Bearer token in the Authorization header.

## Configuration

Set your API base URL via environment variable:

```env
VITE_API_BASE_URL=https://api.example.com
```

If not set, it defaults to `http://localhost:3000/api`.

## Error Handling

The API client throws `ApiError` for API errors. Handle them in your components:

```tsx
const { data, error } = useQuery({
  queryKey: ["articles"],
  queryFn: async () => {
    try {
      const response = await api.get("/articles");
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("API Error:", error.status, error.data);
      }
      throw error;
    }
  },
});
```

## Examples

See `example-api.ts` for complete examples of:
- GET requests with and without parameters
- POST, PUT, PATCH, DELETE mutations
- Query parameter handling
- Cache invalidation patterns

