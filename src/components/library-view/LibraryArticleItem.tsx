import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/SafeIcon";
import { ArticleStatus, type ArticleModel } from "@/data/Article";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface LibraryArticleItemProps {
  article: ArticleModel;
  isClient: boolean;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

const LibraryArticleItem = ({
  article,
  isClient,
  onDelete,
  isDeleting,
}: LibraryArticleItemProps) => {
  const formatSaveDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      return `${Math.floor(diffDays / 30)} months ago`;
    } catch {
      return "Recently";
    }
  };

  const getStatusColor = (status: ArticleStatus) => {
    switch (status) {
      case ArticleStatus.Unread:
        return "bg-blue-100 text-blue-800";
      case ArticleStatus.Skimmed:
        return "bg-amber-100 text-amber-800";
      case ArticleStatus.Read:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div
      className={cn(
        "card-minimal p-4 transition-all duration-200",
        isClient ? "opacity-100" : "opacity-75",
        isDeleting && "opacity-40 pointer-events-none",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Article info — links to reading view */}
        <Link
          to={`/reading-view/${article.id}`}
          className="flex-1 min-w-0 group"
        >
          <h3 className="text-base font-semibold leading-tight mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {article.title}
          </h3>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{article.source.name}</span>
            <span>•</span>
            <span>{article.readingTimeInMinutes} min</span>
            <span>•</span>
            <span>{formatSaveDate(article.saveDate)}</span>
          </div>
        </Link>

        {/* Status badge + delete button */}
        <div className="flex-shrink-0 flex items-center gap-2">
          <Badge
            variant="secondary"
            className={cn(
              "text-xs whitespace-nowrap",
              getStatusColor(article.status),
            )}
          >
            {article.status}
          </Badge>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                // Stop the click from bubbling to the Link above
                e.preventDefault();
                e.stopPropagation();
                onDelete(article.id);
              }}
              aria-label="Delete article"
            >
              <SafeIcon name="Trash2" size={15} />
            </Button>
          )}
        </div>
      </div>

      {article.userNote && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <p className="text-sm text-muted-foreground italic">
            "{article.userNote}"
          </p>
        </div>
      )}
    </div>
  );
};

export default LibraryArticleItem;
