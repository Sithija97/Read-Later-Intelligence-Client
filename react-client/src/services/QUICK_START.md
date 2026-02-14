# Quick Start Guide

## Setup Complete! ✅

Your API service is ready to use with:
- ✅ React Query integration
- ✅ Automatic Clerk token authentication
- ✅ TypeScript support
- ✅ Standard error handling

## Environment Variable

Add your API base URL to your `.env` file:

```env
VITE_API_BASE_URL=https://your-api.com/api
```

If not set, defaults to `http://localhost:3000/api`

## Basic Usage

### 1. Simple GET Request

```tsx
import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";

function MyComponent() {
  const api = useApiClient();
  
  const { data, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: async () => {
      const response = await api.get("/articles");
      return response.data; // Your API response data
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{/* Render data */}</div>;
}
```

### 2. POST Request (Mutation)

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useApiClient } from "@/hooks/useApiClient";

function CreateArticle() {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (articleData: { title: string; content: string }) => {
      const response = await api.post("/articles", articleData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["articles"] });
    },
  });

  return (
    <button 
      onClick={() => mutation.mutate({ title: "New Article", content: "..." })}
      disabled={mutation.isPending}
    >
      {mutation.isPending ? "Creating..." : "Create Article"}
    </button>
  );
}
```

### 3. GET with Query Parameters

```tsx
const { data } = useQuery({
  queryKey: ["articles", page, limit],
  queryFn: async () => {
    const response = await api.get("/articles", {
      params: { page: 1, limit: 10 },
    });
    return response.data;
  },
});
```

### 4. All HTTP Methods Available

```tsx
const api = useApiClient();

// GET
await api.get("/endpoint", { params: { key: "value" } });

// POST
await api.post("/endpoint", { data: "value" });

// PUT
await api.put("/endpoint", { data: "value" });

// PATCH
await api.patch("/endpoint", { data: "value" });

// DELETE
await api.delete("/endpoint");
```

## Important Notes

1. **Authentication is automatic** - The Clerk token is automatically attached to all requests as a Bearer token
2. **All methods return** `ApiResponse<T>` with structure: `{ data: T, status: number, message?: string }`
3. **Error handling** - Errors throw `ApiError` with `status`, `statusText`, and `data` properties

## See Examples

- `example-api.ts` - Complete API hook examples
- `USAGE_EXAMPLE.tsx` - Component usage patterns
- `README.md` - Detailed documentation

