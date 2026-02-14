import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import EmptyState from "@/components/common/EmptyState";
import LibraryArticleItem from "./LibraryArticleItem";
import {
  getAllLibraryArticles,
  ArticleStatus,
  type ArticleModel,
} from "@/data/Article";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type StatusFilter = "all" | "unread" | "skimmed" | "read";

const LibraryViewContent = () => {
  const [isClient, setIsClient] = useState(true);
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [articles, setArticles] = useState<ArticleModel[]>([]);

  // SSG: Initialize with mock data
  useEffect(() => {
    const allArticles = getAllLibraryArticles();
    setArticles(allArticles);

    // Hydration: Prepare for client interactions
    setIsClient(false);

    // Client: Enable interactions
    const timer = requestAnimationFrame(() => {
      setIsClient(true);
    });

    return () => cancelAnimationFrame(timer);
  }, []);

  // Filter articles by status
  const filteredArticles = articles.filter((article) => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return article.status === ArticleStatus.Unread;
    if (activeTab === "skimmed")
      return article.status === ArticleStatus.Skimmed;
    if (activeTab === "read") return article.status === ArticleStatus.Read;
    return true;
  });

  // Count articles by status
  const unreadCount = articles.filter(
    (a) => a.status === ArticleStatus.Unread
  ).length;
  const skimmedCount = articles.filter(
    (a) => a.status === ArticleStatus.Skimmed
  ).length;
  const readCount = articles.filter(
    (a) => a.status === ArticleStatus.Read
  ).length;

  return (
    <div className="container-app py-6 md:py-8">
      {/* Header with back button */}
      <div
        className={cn(
          "mb-8 transition-opacity duration-300",
          isClient ? "opacity-100" : "opacity-75"
        )}
      >
        <BackButton href="/todays-reads" label="Back to Today's Reads" />
        <h1 className="text-3xl md:text-4xl font-semibold mt-4">Library</h1>
        <p className="text-muted-foreground mt-2">
          {articles.length} article{articles.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {/* Status tabs */}
      <div
        className={cn(
          "mb-8 transition-opacity duration-300",
          isClient ? "opacity-100" : "opacity-75"
        )}
      >
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as StatusFilter)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {unreadCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="skimmed">
              Skimmed
              {skimmedCount > 0 && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {skimmedCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="read">
              Read
              {readCount > 0 && (
                <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {readCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Article list for each tab */}
          <TabsContent value={activeTab} className="mt-6">
            {filteredArticles.length === 0 ? (
              <EmptyState
                icon="BookOpen"
                title="No articles here"
                description={
                  activeTab === "all"
                    ? "Save something worth finishing."
                    : `No ${activeTab} articles yet.`
                }
                ctaText="Save a new article"
                ctaHref="/"
              />
            ) : (
              <div
                className={cn(
                  "space-y-3 transition-opacity duration-300",
                  isClient ? "opacity-100" : "opacity-75"
                )}
              >
                {filteredArticles.map((article) => (
                  <LibraryArticleItem
                    key={article.id}
                    article={article}
                    isClient={isClient}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick action to save new article */}
      {articles.length > 0 && (
        <div
          className={cn(
            "mt-12 pt-8 border-t border-border transition-opacity duration-300",
            isClient ? "opacity-100" : "opacity-75"
          )}
        >
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link to="/">+ Save Another Article</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default LibraryViewContent;
