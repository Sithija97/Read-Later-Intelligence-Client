/**
 * Example: How to access user data in your components
 */

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useApiClient } from "@/hooks/useApiClient";
import { useQuery } from "@tanstack/react-query";

/**
 * Example 1: Access user data in component
 */
export function UserProfileExample() {
  const { email, username, firstName, lastName, fullName, user, isLoaded } = useCurrentUser();

  if (!isLoaded) {
    return <div>Loading user data...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Email: {email}</p>
      <p>Username: {username}</p>
      <p>Name: {fullName || `${firstName} ${lastName}`}</p>
      
      {/* Access full user object for more details */}
      {user && (
        <div>
          <p>User ID: {user.id}</p>
          <p>Created: {user.createdAt?.toLocaleDateString()}</p>
          {/* Access all user metadata */}
          {user.publicMetadata && (
            <pre>{JSON.stringify(user.publicMetadata, null, 2)}</pre>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Example 2: Send user data in API request body
 */
export function ApiCallWithUserData() {
  const api = useApiClient();
  const { email, user } = useCurrentUser();

  const handleSubmit = async () => {
    try {
      // Send user data along with request
      const response = await api.post("/articles", {
        url: "https://example.com/article",
        userId: user?.id, // User ID from token
        userEmail: email, // User email from hook
        // ... other data
      });
      
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}

/**
 * Example 3: Using React Query with user data
 */
export function QueryWithUserData() {
  const api = useApiClient();
  const { user } = useCurrentUser();

  // Fetch user-specific data
  const { data, isLoading } = useQuery({
    queryKey: ["articles", user?.id],
    queryFn: async () => {
      const response = await api.get(`/users/${user?.id}/articles`);
      return response.data;
    },
    enabled: !!user?.id, // Only fetch when user is available
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* Render data */}</div>;
}

/**
 * Example 4: Using custom JWT template (if configured)
 * 
 * First, create a JWT template in Clerk Dashboard with user claims,
 * then use it like this:
 */
export function UseCustomJWTTemplate() {
  // This will use a JWT template that includes user data in the token
  const api = useApiClient({ template: "user_info" });

  const handleApiCall = async () => {
    // The token now includes email, username, etc.
    const response = await api.get("/protected-endpoint");
    // Your backend can decode the token and get user data directly
    return response.data;
  };

  return <button onClick={handleApiCall}>Call API</button>;
}

