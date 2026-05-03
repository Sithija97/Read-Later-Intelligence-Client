import {
  ArticleStatus,
  type ArticleComplexity,
  type ArticleModel,
  type ArticleSource,
} from "@/data/Article";
import type { ItemResponse } from "./queries";

function mapDifficultyToComplexity(
  difficulty?: "easy" | "medium" | "hard",
): ArticleComplexity {
  if (difficulty === "easy") return "Easy";
  if (difficulty === "hard") return "Hard";
  return "Medium";
}

function guessSourceType(sourceName: string): ArticleSource["type"] {
  const value = sourceName.toLowerCase();

  if (value.includes("medium.com") || value === "medium") return "Medium";
  if (value.includes("substack")) return "Newsletter";
  if (
    value.includes("times") ||
    value.includes("post") ||
    value.includes("journal") ||
    value.includes("news")
  ) {
    return "Publication";
  }

  return "Blog";
}

export function mapItemStatusToArticleStatus(
  item: ItemResponse,
): ArticleStatus {
  if (item.isCompleted) return ArticleStatus.Read;
  if (item.isSkimmed) return ArticleStatus.Skimmed;
  return ArticleStatus.Unread;
}

export function mapItemToArticle(item: ItemResponse): ArticleModel {
  const readingTime =
    item.readingTimeMinutes ??
    (typeof item.wordCount === "number"
      ? Math.max(1, Math.ceil(item.wordCount / 220))
      : 1);

  const sourceName = item.source || "Unknown source";

  return {
    id: item.id,
    title: item.title || "Untitled article",
    source: {
      name: sourceName,
      type: guessSourceType(sourceName),
    },
    url: item.url,
    saveDate: item.savedAt,
    readingTimeInMinutes: readingTime,
    skimTimeInMinutes: Math.max(1, Math.round(readingTime / 2)),
    complexity: mapDifficultyToComplexity(item.difficulty),
    tldrSummary: item.summary ?? [],
    fullContent: item.content ?? "",
    status: mapItemStatusToArticleStatus(item),
    userNote: undefined,
    isDailyRead: false,
  };
}
