import { useState, useEffect } from "react";
import {
  getDailyReads,
  MOCK_ARTICLES,
  ArticleStatus,
  type ArticleModel,
} from "@/data/Article";
import ArticleCardItem from "./ArticleCardItem";
import TodaysReadsEmpty from "./TodaysReadsEmpty";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function TodaysReadsPage() {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(true);
  const [articles, setArticles] = useState<ArticleModel[]>([]);
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(new Set());

  // SSG: Initialize with mock data
  useEffect(() => {
    // State 0: Hydration start
    setIsClient(false);

    // Simulate loading and prepare data
    const dailyArticles = MOCK_ARTICLES.filter(
      (a) => a.isDailyRead && a.status !== ArticleStatus.Archived
    );
    setArticles(dailyArticles);

    // State 1: Client ready
    const timer = requestAnimationFrame(() => {
      setIsClient(true);
    });

    return () => cancelAnimationFrame(timer);
  }, []);

  const handleRead = (articleId: string) => {
    // Navigate to reading view with article ID
    navigate(`/reading-view/${articleId}`);
  };

  const handleSkim = (articleId: string) => {
    // Navigate to reading view in skim mode (using state for mode)
    navigate(`/reading-view/${articleId}`, { state: { mode: 'skim' } });
  };

  const handleSnooze = (articleId: string) => {
    // Add to snoozed set (visual feedback)
    setSnoozedIds((prev) => new Set([...prev, articleId]));

    // In a real app, this would update the backend
    // For now, remove from display after animation
    setTimeout(() => {
      setArticles((prev) => prev.filter((a) => a.id !== articleId));
      setSnoozedIds((prev) => {
        const next = new Set(prev);
        next.delete(articleId);
        return next;
      });
    }, 300);
  };

  const handleSaveNew = () => {
    navigate('/');
  };

  const handleViewLibrary = () => {
    navigate('/library-view')
  };

  // Show empty state if no articles
  if (articles.length === 0 && isClient) {
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
          {articles.length} {articles.length === 1 ? "item" : "items"} to
          explore
        </p>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {articles.map((article) => (
          <div
            key={article.id}
            className={cn(
              "transition-all duration-300",
              snoozedIds.has(article.id) && "opacity-50 scale-95"
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
