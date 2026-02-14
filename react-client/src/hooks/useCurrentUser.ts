import { useUser } from "@clerk/clerk-react";

/**
 * Hook to access current user data from Clerk
 * This provides access to user information like email, username, etc.
 */
export const useCurrentUser = () => {
  const { user, isLoaded } = useUser();

  return {
    user,
    isLoaded,
    // Convenience properties
    email: user?.primaryEmailAddress?.emailAddress,
    username: user?.username,
    firstName: user?.firstName,
    lastName: user?.lastName,
    fullName: user?.fullName,
    imageUrl: user?.imageUrl,
    id: user?.id,
  };
};

