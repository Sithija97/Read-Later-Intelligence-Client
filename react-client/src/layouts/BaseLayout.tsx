import React, { useEffect } from "react";
import AppHeader from "@/components/common/AppHeader";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { SpinnerCustom } from "@/components/common/Spinner";
import { useSyncUser } from "@/hooks/useSyncUser";

interface BaseLayoutProps {
  variant?: "default" | "minimal" | "hidden";
  children: React.ReactNode;
}

const BaseLayout = ({ variant = "default", children }: BaseLayoutProps) => {
  const { userId, isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();

  // Sync user details to MongoDB after successful authentication
  useSyncUser({
    onSuccess: (data) => {
      console.log("User synced successfully:", data);
    },
    onError: (error) => {
      console.error("Failed to sync user:", error);
    },
  });

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded]);

  // Show loading while auth is being checked
  if (!isLoaded) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  // Don't render children if user is not authenticated (prevents flash)
  // But allow a brief moment for OAuth callback to complete
  if (!isSignedIn) {
    return null;
  }

  return (
    <>
      <AppHeader variant={variant} />
      {children}
    </>
  );
};

export default BaseLayout;
