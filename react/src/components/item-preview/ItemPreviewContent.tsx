import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "@/components/common/BackButton";
import ArticleCard from "@/components/common/ArticleCard";
import { cn } from "@/lib/utils";
import { SpinnerCustom } from "@/components/common/Spinner";
import { useGetItem } from "@/services/queries";

const ItemPreviewContent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClient, setIsClient] = useState(true);
  const [itemId, setItemId] = useState<string | null>(null);
  const [missingItemMessage, setMissingItemMessage] = useState<string>("");

  useEffect(() => {
    setIsClient(false);
    const raf = requestAnimationFrame(() => setIsClient(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const queryItemId = searchParams.get("id");

    if (queryItemId) {
      setItemId(queryItemId);
      setMissingItemMessage("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("activeItemId", queryItemId);
      }
      return;
    }

    if (typeof window !== "undefined") {
      const storedId = sessionStorage.getItem("activeItemId");
      if (storedId) {
        setItemId(storedId);
        setMissingItemMessage("");
        return;
      }
    }

    setMissingItemMessage(
      "We couldn't find the article preview. Please save a link first."
    );
  }, [location.search]);

  const itemQuery = useGetItem(itemId ?? "", { enabled: Boolean(itemId) });
  const apiPayload = itemQuery.data?.data;
  const item = apiPayload?.data;

  useEffect(() => {
    if (!item?.status || !itemId) return;

    if (item.status === "processing" || item.status === "created") {
      navigate(`/loading?itemId=${encodeURIComponent(itemId)}`, {
        replace: true,
      });
    }
  }, [item?.status, itemId, navigate]);

  const readTime = useMemo(() => {
    if (!item) return undefined;
    if (typeof item.readingTimeMinutes === "number") {
      return item.readingTimeMinutes;
    }
    if (typeof item.wordCount === "number") {
      return Math.max(1, Math.ceil(item.wordCount / 200));
    }
    return undefined;
  }, [item]);

  const skimTime = useMemo(() => {
    if (!readTime) return undefined;
    return Math.max(1, Math.round(readTime / 2));
  }, [readTime]);

  const summaryPoints = item?.summary?.length ? item.summary : undefined;

  const savedDateLabel = useMemo(() => {
    if (!item?.savedAt) return undefined;
    try {
      return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(item.savedAt));
    } catch {
      return item.savedAt;
    }
  }, [item?.savedAt]);

  const handleReadFull = () => {
    if (!isClient || !item?.id) return;
    navigate(`/reading-view/${item.id}`);
  };

  const handleSkimSummary = () => {
    if (!isClient || !item?.id) return;
    navigate(`/reading-view/${item.id}`, { state: { mode: "skim" } });
  };

  const renderContent = () => {
    if (missingItemMessage) {
      return (
        <div className="text-center text-sm text-muted-foreground">
          {missingItemMessage}
        </div>
      );
    }

    if (itemQuery.isLoading) {
      return (
        <div className="flex flex-col items-center gap-4 py-12">
          <SpinnerCustom />
          <p className="text-sm text-muted-foreground">
            Preparing your article preview...
          </p>
        </div>
      );
    }

    if (itemQuery.isError) {
      const message =
        itemQuery.error instanceof Error
          ? itemQuery.error.message
          : "Failed to load the article.";
      return (
        <div className="text-center text-sm text-destructive">{message}</div>
      );
    }

    if (!item) {
      return (
        <div className="text-center text-sm text-muted-foreground">
          We couldn't load this article. Please try again.
        </div>
      );
    }

    return (
      <>
        <ArticleCard
          variant="preview"
          title={item.title || "Untitled article"}
          source={item.source}
          readTime={readTime}
          skimTime={skimTime}
          summary={summaryPoints}
          className={cn(
            "transition-all duration-300",
            isClient || true
              ? "opacity-100 translate-y-0"
              : "opacity-75 translate-y-2"
          )}
          onRead={handleReadFull}
          onSkim={handleSkimSummary}
        />

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            {savedDateLabel ? `Saved ${savedDateLabel}` : "Saved article"}
            {item.difficulty ? ` • Complexity: ${item.difficulty}` : ""}
          </p>
        </div>
      </>
    );
  };

  return (
    // min-h-screen to ensure full background color
    <main className="min-h-screen bg-background">
      {/* Header with back button */}
      <div className="border-border bg-background sticky top-0 z-10">
        <div className="container-app py-4">
          <BackButton
            href="/"
            label="Back to Today's Reads"
            className={isClient || true ? "opacity-100" : "opacity-50"}
          />
        </div>
      </div>

      {/* Content */}
      <div className="container-app py-8 md:py-12">
        <div className="max-w-2xl mx-auto">{renderContent()}</div>
      </div>
    </main>
  );
};

export default ItemPreviewContent;
