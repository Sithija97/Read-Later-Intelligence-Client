import { useState, useEffect } from "react";
import parse from "html-react-parser";

interface ReadingViewContentProps {
  content: string;
}

const ReadingViewContent = ({ content }: ReadingViewContentProps) => {
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

  return (
    <article className="container-reading py-12 md:py-16">
      <div className="reading-content">
        {paragraphs.map((paragraph, index) => (
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
