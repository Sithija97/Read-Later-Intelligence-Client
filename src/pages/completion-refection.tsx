import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import CompletionReflection from "@/components/completion-reflection/CompletionReflection";
import { useGetItem } from "@/services/queries";

const CompletionReflectionPage = () => {
  const location = useLocation();
  const state = location.state as { itemId?: string; articleTitle?: string };

  const itemId = useMemo(() => {
    if (state?.itemId) return state.itemId;
    if (typeof window === "undefined") return undefined;
    return sessionStorage.getItem("activeItemId") ?? undefined;
  }, [state?.itemId]);

  const itemQuery = useGetItem(itemId ?? "", { enabled: Boolean(itemId) });
  const item =
    itemQuery.data?.data?.status === "success"
      ? itemQuery.data.data.data
      : null;
  const articleTitle =
    state?.articleTitle || item?.title || "How We Read on the Internet";

  return (
    <main className="min-h-screen bg-background">
      <CompletionReflection articleId={itemId} articleTitle={articleTitle} />
    </main>
  );
};

export default CompletionReflectionPage;
