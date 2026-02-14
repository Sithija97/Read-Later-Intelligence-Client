import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReadingViewContent from "@/components/reading-view/ReadingViewContent";
import ReadingViewFooter from "@/components/reading-view/ReadingViewFooter";
import ReadingViewHeader from "@/components/reading-view/ReadingViewHeader";
import { Spinner } from "@/components/ui/spinner";
import { useGetItem } from "@/services/queries";

const ReadingView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const itemId = id ?? "";

  useEffect(() => {
    if (!itemId) {
      navigate("/");
    }
  }, [itemId, navigate]);

  const {
    data: itemResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetItem(itemId, { enabled: Boolean(itemId) });

  if (!itemId) {
    return null;
  }

  const payload = itemResponse?.data;
  const article = payload?.status === "success" ? payload.data : null;
  const readingTimeMinutes =
    article?.readingTimeMinutes ??
    (article?.wordCount ? Math.max(1, Math.ceil(article.wordCount / 200)) : 0);

  const resolveSource = (): string => {
    if (article?.source) {
      return article.source;
    }
    if (article?.url) {
      try {
        const url = new URL(article.url);
        return url.hostname.replace(/^www\./, "");
      } catch {
        return "Unknown source";
      }
    }
    return "Unknown source";
  };

  const renderCenteredState = (
    title: string,
    description: string,
    action?: { label: string; handler: () => void }
  ) => (
    <main className="flex flex-col min-h-[calc(100vh-64px)] bg-background items-center justify-center">
      <div className="text-center max-w-md px-6">
        <h1 className="text-2xl font-semibold mb-2">{title}</h1>
        <p className="text-muted-foreground mb-4">{description}</p>
        {action ? (
          <button
            onClick={action.handler}
            className="text-primary hover:underline"
          >
            {action.label}
          </button>
        ) : null}
      </div>
    </main>
  );

  if (isLoading) {
    return (
      <main className="flex flex-col min-h-[calc(100vh-64px)] bg-background">
        <div className="flex flex-1 items-center justify-center">
          <Spinner className="size-8 text-muted-foreground" />
        </div>
      </main>
    );
  }

  if (isError) {
    if (error?.status === 404) {
      return renderCenteredState(
        "Article not found",
        "The article you're looking for doesn't exist.",
        { label: "Go back home", handler: () => navigate("/") }
      );
    }

    return renderCenteredState(
      "Something went wrong",
      "We couldn't load this article. Please try again.",
      { label: "Go back home", handler: () => navigate("/") }
    );
  }

  if (!article) {
    return renderCenteredState(
      "Article unavailable",
      "We couldn't find details for this article yet.",
      { label: "Go back home", handler: () => navigate("/") }
    );
  }

  if (!article.content) {
    return renderCenteredState(
      "Processing in progress",
      "We're still preparing this article. Please check back in a moment.",
      {
        label: "Refresh",
        handler: () => {
          void refetch();
        },
      }
    );
  }

  return (
    <main className="flex flex-col min-h-[calc(100vh-64px)] bg-background">
      {/* Reading View Header - Sticky */}
      <ReadingViewHeader
        title={article.title ?? "Untitled article"}
        source={resolveSource()}
        readingTime={readingTimeMinutes}
      />

      {/* Reading Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <ReadingViewContent content={article.content ?? ""} />
      </div>

      {/* Reading View Footer - Sticky */}
      <ReadingViewFooter articleId={article.id} />
    </main>
  );
};

export default ReadingView;
