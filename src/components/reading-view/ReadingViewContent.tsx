import { useState, useEffect } from "react";
import parse from "html-react-parser";

interface ReadingViewContentProps {
  content: string;
  summary?: string[];
  mode?: "skim" | "read";
}

const ReadingViewContent = ({
  content,
  summary = [],
  mode = "read",
}: ReadingViewContentProps) => {
  const [isClient, setIsClient] = useState(true);

  useEffect(() => {
    setIsClient(false);

    // Trigger client state
    requestAnimationFrame(() => {
      setIsClient(true);
    });
  }, []);

  // Parse content into paragraphs for better rendering
  const paragraphs = content.split("\n\n").filter((p) => p.trim().length > 0);

  const renderSkimContent = () => {
    if (summary.length === 0) {
      return (
        <p className="text-muted-foreground">
          Summary is not available for this article yet.
        </p>
      );
    }

    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Summary</h2>
        <ul className="list-disc pl-5 space-y-3">
          {summary.map((point, index) => (
            <li key={index} className="leading-relaxed">
              {point}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <article className="container-reading py-12 md:py-16">
      <div className="reading-content">
        {mode === "skim"
          ? renderSkimContent()
          : paragraphs.map((paragraph, index) => (
              <p key={index} className="mb-6">
                {parse(paragraph.trim())}
              </p>
            ))}
      </div>

      {/* Divider before actions */}
      <div className="mt-12 pt-8 border-t border-border" />
    </article>
  );
};

export default ReadingViewContent;
