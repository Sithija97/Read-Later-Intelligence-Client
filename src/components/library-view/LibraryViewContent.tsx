import { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/common/BackButton";
import EmptyState from "@/components/common/EmptyState";
import LibraryArticleItem from "./LibraryArticleItem";
import { ArticleStatus, type ArticleModel } from "@/data/Article";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useGetItems, useDeleteItem } from "@/services/queries";
import { mapItemToArticle } from "@/services/itemAdapters";
import { useQueryClient } from "@tanstack/react-query";

type StatusFilter = "all" | "unread" | "skimmed" | "read";

const LibraryViewContent = () => {
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<StatusFilter>("all");
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const { data, isLoading, isError } = useGetItems();
  const deleteMutation = useDeleteItem();
  const queryClient = useQueryClient();

  const handleDeleteClick = (id: string) => {
    // First click: mark as pending (shows confirmation UI)
    // Second click on the same item: actually delete
    if (pendingDeleteId === id) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          setPendingDeleteId(null);
          // Invalidate the library query so the list re-fetches
          queryClient.invalidateQueries({ queryKey: ["/items/items"] });
        },
      });
    } else {
      setPendingDeleteId(id);
    }
  };

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
    (a) => a.status === ArticleStatus.Unread,
  ).length;
  const skimmedCount = articles.filter(
    (a) => a.status === ArticleStatus.Skimmed,
  ).length;
  const readCount = articles.filter(
    (a) => a.status === ArticleStatus.Read,
  ).length;

  if (!isClient || isLoading) {
    return (
      <div className="container-app py-12 text-center text-sm text-muted-foreground">
        Loading library...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-app py-12 text-center text-sm text-destructive">
        Failed to load library. Please try again.
      </div>
    );
  }

  return (
    <div className="container-app py-6 md:py-8">
      {/* Header with back button */}
      <div
        className={cn(
          "mb-8 transition-opacity duration-300",
          isClient ? "opacity-100" : "opacity-75",
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
          isClient ? "opacity-100" : "opacity-75",
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
                  isClient ? "opacity-100" : "opacity-75",
                )}
              >
                {filteredArticles.map((article) => (
                  <div key={article.id}>
                    <LibraryArticleItem
                      article={article}
                      isClient={isClient}
                      onDelete={handleDeleteClick}
                      isDeleting={
                        deleteMutation.isPending &&
                        pendingDeleteId === article.id
                      }
                    />
                    {/* Tap-to-confirm: show warning text below the item */}
                    {pendingDeleteId === article.id &&
                      !deleteMutation.isPending && (
                        <div className="flex items-center justify-between px-4 py-2 bg-destructive/10 rounded-b-md text-sm">
                          <span className="text-destructive font-medium">
                            Tap delete again to confirm
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 text-muted-foreground"
                            onClick={() => setPendingDeleteId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                  </div>
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
            isClient ? "opacity-100" : "opacity-75",
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
