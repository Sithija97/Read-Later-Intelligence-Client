import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

// Route configuration type
type RouteConfig = {
  path: string;
  element: React.ReactNode;
  headerVariant?: "default" | "minimal" | "hidden";
  useBaseLayout?: boolean;
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
  },
  {
    path: "/",
    element: <SaveLinkScreen />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
  {
    path: "/loading",
    element: <ProcessingState />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
  {
    path: "/empty",
    element: <TodayEmptyState />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
  {
    path: "/item-preview",
    element: <ItemPreviewContent />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
  {
    path: "/todays-reads",
    element: <TodaysReads />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
  {
    path: "/library-view",
    element: <LibraryView />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
  {
    path: "/completion-reflection",
    element: <CompletionReflectionPage />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
  {
    path: "/reading-view/:id",
    element: <ReadingView />,
    useBaseLayout: true,
    headerVariant: "minimal",
  },
];

function AppRoutes() {
  return (
    <Routes>
      {routes.map((route) => {
        const element = route.useBaseLayout ? (
          <LayoutWrapper defaultVariant={route.headerVariant}>
            {route.element}
          </LayoutWrapper>
        ) : (
          route.element
        );

        return <Route key={route.path} path={route.path} element={element} />;
      })}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
