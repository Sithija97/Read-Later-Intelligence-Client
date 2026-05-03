import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import SaveLinkScreen from "@/pages/save-link-screen";
import SignIn from "@/pages/sign-in";
import ProcessingState from "@/pages/processing-state";
import ItemPreviewContent from "@/components/item-preview/ItemPreviewContent";
import TodayEmptyState from "@/pages/today-empty-state";
import TodaysReads from "@/pages/today-s-reads";
import LibraryView from "@/pages/library-view";
import CompletionReflectionPage from "@/pages/completion-refection";
import ReadingView from "@/pages/reading-view";
import { useAuth } from "@clerk/clerk-react";
import ErrorBoundary from "@/components/common/ErrorBoundary";

// Route configuration type
type RouteConfig = {
  path: string;
  element: React.ReactNode;
  headerVariant?: "default" | "minimal" | "hidden";
  useBaseLayout?: boolean;
  protected?: boolean;
};

/**
 * Guards a route behind Clerk authentication.
 *
 * Why check isLoaded before isSignedIn?
 * On first render, Clerk hasn't resolved the session from its CDN yet.
 * isSignedIn would be undefined (not false) during this window, so we'd
 * flash-redirect to /sign-in even for logged-in users. Waiting for
 * isLoaded ensures we only redirect once we have a definitive answer.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    // Clerk is still initializing — show nothing to avoid layout flash
    return null;
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

// Wrapper component to apply BaseLayout with variant
// Supports variant from route config or route state
const LayoutWrapper = ({
  children,
  defaultVariant,
}: {
  children: React.ReactNode;
  defaultVariant?: "default" | "minimal" | "hidden";
}) => {
  const location = useLocation();
  // Check if variant is passed through route state
  const variantFromState = (
    location.state as { headerVariant?: "default" | "minimal" | "hidden" }
  )?.headerVariant;
  const variant = variantFromState || defaultVariant || "default";

  return <BaseLayout variant={variant}>{children}</BaseLayout>;
};

// Route configuration
const routes: RouteConfig[] = [
  {
    path: "/sign-in",
    element: <SignIn />,
    useBaseLayout: false,
    protected: false,
  },
  {
    path: "/",
    element: <SaveLinkScreen />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
  {
    path: "/loading",
    element: <ProcessingState />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
  {
    path: "/empty",
    element: <TodayEmptyState />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
  {
    path: "/item-preview",
    element: <ItemPreviewContent />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
  {
    path: "/todays-reads",
    element: <TodaysReads />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
  {
    path: "/library-view",
    element: <LibraryView />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
  {
    path: "/completion-reflection",
    element: <CompletionReflectionPage />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
  {
    path: "/reading-view/:id",
    element: <ReadingView />,
    useBaseLayout: true,
    headerVariant: "minimal",
    protected: true,
  },
];

function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        let element = route.useBaseLayout ? (
          <LayoutWrapper defaultVariant={route.headerVariant}>
            {route.element}
          </LayoutWrapper>
        ) : (
          route.element
        );

        if (route.protected) {
          element = <ProtectedRoute>{element}</ProtectedRoute>;
        }

        return <Route key={route.path} path={route.path} element={element} />;
      })}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
