import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProgressSteps from "@/components/common/ProgressSteps";
import { getProcessingSteps, type ProcessingStep } from "@/data/SystemProcess";
import { cn } from "@/lib/utils";
import { SpinnerCustom } from "@/components/common/Spinner";
import { useGetItem } from "@/services/queries";
import { Button } from "@/components/ui/button";

interface Step {
  label: string;
  status: "complete" | "current" | "pending";
}

const buildSteps = (status: "in_progress" | "complete"): Step[] => {
  return getProcessingSteps(status).map(
    (step): Step => ({
      label: step.description,
      status:
        status === "complete"
          ? "complete"
          : step.state === "✔"
          ? "complete"
          : step.state === "⏳"
          ? "current"
          : "pending",
    })
  );
};

export default function ProcessingStateContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClient, setIsClient] = useState(true);
  const [steps, setSteps] = useState<Step[]>(() => buildSteps("in_progress"));
  const [isComplete, setIsComplete] = useState(false);
  const [itemId, setItemId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    setIsClient(false);
    const raf = requestAnimationFrame(() => {
      setIsClient(true);
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, []);

  // Resolve itemId from query params or sessionStorage
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryItemId = searchParams.get("itemId");

    if (queryItemId) {
      setItemId(queryItemId);
      setErrorMessage("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("activeItemId", queryItemId);
      }
      return;
    }

    if (typeof window !== "undefined") {
      const storedId = sessionStorage.getItem("activeItemId");
      if (storedId) {
        setItemId(storedId);
        setErrorMessage("");
        return;
      }
    }

    setErrorMessage(
      "We couldn't find the article you're processing. Please try again."
    );
  }, [location.search]);

  const itemQuery = useGetItem(itemId ?? "", { enabled: Boolean(itemId) });
  const apiPayload = itemQuery.data?.data;
  const item = apiPayload?.data;
  const itemStatus = item?.status;
  const isPolling = itemQuery.isLoading || itemQuery.isFetching;

  useEffect(() => {
    if (!itemId || !itemStatus) {
      return;
    }

    if (typeof window !== "undefined") {
      sessionStorage.setItem("activeItemStatus", itemStatus);
    }

    if (itemStatus === "ready") {
      setSteps(buildSteps("complete"));
      setIsComplete(true);
      setErrorMessage("");

      const redirectTimer = setTimeout(() => {
        navigate(`/item-preview?id=${encodeURIComponent(itemId)}`);
      }, 1200);

      return () => clearTimeout(redirectTimer);
    }

    if (itemStatus === "failed") {
      setIsComplete(false);
      setSteps(buildSteps("in_progress"));
      setErrorMessage(
        "We couldn't process this article. Please try another link."
      );
      return;
    }

    // Status: created/processing
    setIsComplete(false);
    setSteps(buildSteps("in_progress"));
    setErrorMessage("");
  }, [itemId, itemStatus, navigate]);

  useEffect(() => {
    if (!itemQuery.isError || !itemQuery.error) {
      return;
    }

    const fallbackMessage =
      itemQuery.error instanceof Error
        ? itemQuery.error.message
        : "Something went wrong while checking the article status.";
    setErrorMessage(fallbackMessage);
  }, [itemQuery.isError, itemQuery.error]);

  const handleBackHome = () => {
    navigate("/", { replace: true });
  };

  return (
    <div
      className={cn(
        "w-full max-w-md transition-opacity duration-300",
        isClient || isComplete ? "opacity-100" : "opacity-75"
      )}
    >
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-2xl font-semibold mb-2">Analyzing article...</h1>
        <p className="text-muted-foreground">
          {itemStatus === "ready"
            ? "Wrapping up. Redirecting to preview."
            : "This usually takes a few seconds"}
        </p>
      </div>

      {/* Progress Steps */}
      {(isClient || steps.length > 0) && <ProgressSteps steps={steps} />}

      {/* Loading indicator */}
      {isPolling && !errorMessage && (
        <div className="mt-8 flex justify-center">
          <SpinnerCustom />
        </div>
      )}

      {/* Completion message */}
      {isComplete && !errorMessage && (
        <div
          className={cn(
            "mt-8 text-center transition-all duration-300",
            isComplete ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <p className="text-sm text-muted-foreground">
            Ready to preview your article...
          </p>
        </div>
      )}

      {/* Error state */}
      {errorMessage && (
        <div className="mt-8 text-center">
          <p className="text-sm text-destructive mb-4">{errorMessage}</p>
          <Button variant="secondary" onClick={handleBackHome}>
            Go back
          </Button>
        </div>
      )}
    </div>
  );
}
