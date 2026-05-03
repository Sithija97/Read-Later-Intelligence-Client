import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: ReactNode;
  /**
   * Optional custom fallback. If omitted, the default fallback is shown.
   */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary
 *
 * Why a class component?
 * React error boundaries MUST be class components. There is no hook
 * equivalent for `componentDidCatch` / `getDerivedStateFromError`.
 * This is a known React limitation — it's on their roadmap for a future
 * version, but as of React 18 you need a class for this.
 *
 * Placement: wrap large subtrees (e.g., the whole route content) so a
 * crash in one component doesn't take down the entire app. You can also
 * place tighter boundaries around individual risky widgets.
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  /**
   * Called during rendering when a descendant throws.
   * Return value updates state synchronously so the next render
   * shows the fallback instead of the broken subtree.
   */
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  /**
   * Called after the error has been committed to state.
   * Good place to log to an error reporting service (e.g. Sentry).
   */
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "[ErrorBoundary] Uncaught error:",
      error,
      info.componentStack,
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center gap-4">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            An unexpected error occurred. You can try reloading the page or go
            back to the home screen.
          </p>
          {this.state.error && (
            <p className="text-xs text-destructive font-mono bg-destructive/10 px-3 py-2 rounded max-w-sm break-all">
              {this.state.error.message}
            </p>
          )}
          <div className="flex gap-3">
            <Button variant="outline" onClick={this.handleReset}>
              Try again
            </Button>
            <Button
              variant="default"
              onClick={() => {
                this.handleReset();
                window.location.href = "/";
              }}
            >
              Go home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
