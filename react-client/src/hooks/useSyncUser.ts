import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useSyncUserMutation } from "@/services/queries";

/**
 * Hook to sync user details to MongoDB after successful authentication
 * Uses React Query mutation for proper state management
 *
 * @param options - Configuration options
 * @param options.onSuccess - Callback when sync is successful
 * @param options.onError - Callback when sync fails
 * @param options.enabled - Whether to enable the sync (default: true)
 */
export const useSyncUser = (options?: {
  onSuccess?: (data: unknown) => void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}) => {
  const { isSignedIn, isLoaded } = useAuth();
  const syncUserMutation = useSyncUserMutation();
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    // Only sync if:
    // 1. Auth is loaded
    // 2. User is signed in
    // 3. Enabled option is not explicitly false
    // 4. Haven't synced yet in this session
    // 5. Not currently syncing
    if (
      !isLoaded ||
      !isSignedIn ||
      options?.enabled === false ||
      hasSyncedRef.current ||
      syncUserMutation.isPending
    ) {
      return;
    }

    // Trigger sync
    syncUserMutation.mutate(undefined, {
      onSuccess: (data) => {
        hasSyncedRef.current = true;
        console.log("User synced successfully:", data);
        options?.onSuccess?.(data);
      },
      onError: (error) => {
        console.error("Failed to sync user:", error);
        options?.onError?.(
          error instanceof Error ? error : new Error("Unknown error")
        );
      },
    });
  }, [isLoaded, isSignedIn, options?.enabled, syncUserMutation, options]);

  // Reset sync flag when user signs out
  useEffect(() => {
    if (!isSignedIn) {
      hasSyncedRef.current = false;
    }
  }, [isSignedIn]);
};
