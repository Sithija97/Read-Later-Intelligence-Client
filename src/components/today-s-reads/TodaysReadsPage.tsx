import { useState, useEffect, useMemo } from "react";
import type { ArticleModel } from "@/data/Article";
import ArticleCardItem from "./ArticleCardItem";
import TodaysReadsEmpty from "./TodaysReadsEmpty";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useGetTodaysItems, useSnoozeItem } from "@/services/queries";
import { mapItemToArticle } from "@/services/itemAdapters";

export default function TodaysReadsPage() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(false);
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());
  const { data, isLoading, isError } = useGetTodaysItems();
  const snoozeMutation = useSnoozeItem();

  useEffect(() => {
    const timer = requestAnimationFrame(() => {
      setIsClient(true);
    });

    return () => cancelAnimationFrame(timer);
  }, []);

  const apiItems = data?.data?.status === "success" ? data.data.data : [];

  const articles = useMemo<ArticleModel[]>(
    () => apiItems.map(mapItemToArticle),
    [apiItems],
  );

  const visibleArticles = useMemo(
    () => articles.filter((article) => !snoozedIds.has(article.id)),
    [articles, snoozedIds],
  );

  const handleRead = (articleId: string) => {
    // Navigate to reading view with article ID
    navigate(`/reading-view/${articleId}`);
  };

  const handleSkim = (articleId: string) => {
    // Navigate to reading view in skim mode (using state for mode)
    navigate(`/reading-view/${articleId}`, { state: { mode: "skim" } });
  };

  const handleSnooze = (articleId: string) => {
    // Optimistically hide from the list immediately for a snappy UX.
    // The API call persists this so it survives a page refresh.
    setSnoozedIds((prev) => new Set([...prev, articleId]));
    snoozeMutation.mutate(articleId);
  };

  const handleSaveNew = () => {
    navigate("/");
  };

  const handleViewLibrary = () => {
    navigate("/library-view");
  };

  if (!isClient || isLoading) {
    return (
      <div className="container-app py-12 text-center text-sm text-muted-foreground">
        Loading today's reads...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-app py-12 text-center text-sm text-destructive">
        Failed to load today's reads. Please try again.
      </div>
    );
  }

  // Show empty state if no articles
  if (visibleArticles.length === 0) {
    return (
      <TodaysReadsEmpty
        onSaveNew={handleSaveNew}
        onViewLibrary={handleViewLibrary}
      />
    );
  }

  return (
    <div className="container-app py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-semibold mb-2">
          Today's Reads
        </h1>
        <p className="text-muted-foreground">
          {visibleArticles.length}{" "}
          {visibleArticles.length === 1 ? "item" : "items"} to explore
        </p>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {visibleArticles.map((article) => (
          <div
            key={article.id}
            className={cn(
              "transition-all duration-300",
              snoozedIds.has(article.id) && "opacity-50 scale-95",
            )}
          >
            <ArticleCardItem
              article={article}
              onRead={() => handleRead(article.id)}
              onSkim={() => handleSkim(article.id)}
              onSnooze={() => handleSnooze(article.id)}
            />
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-4 justify-center md:justify-start">
        <button
          onClick={handleSaveNew}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-md transition-colors"
        >
          <span>+ Save New Link</span>
        </button>
        <button
          onClick={handleViewLibrary}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <span>View Library</span>
        </button>
      </div>
    </div>
  );
}
