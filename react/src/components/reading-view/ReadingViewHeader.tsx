import { useState, useEffect } from "react";
import BackButton from "@/components/common/BackButton";
import { cn } from "@/lib/utils";

interface ReadingViewHeaderProps {
  title: string;
  source: string;
  readingTime: number;
}

const ReadingViewHeader = ({
  title,
  source,
  readingTime,
}: ReadingViewHeaderProps) => {
  const [isClient, setIsClient] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsClient(false)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    
    // Trigger client state
    requestAnimationFrame(() => {
      setIsClient(true)
    })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return <header
      className={cn(
        'sticky top-0 z-40 border-b border-border bg-background transition-shadow duration-200',
        (isScrolled || isClient) && 'shadow-soft'
      )}
    >
      <div className="container-reading py-4 md:py-6">
        {/* Back Button */}
        <div className="mb-4">
          <BackButton href="/todays-reads" />
        </div>

        {/* Article Title & Metadata */}
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold mb-3 leading-tight">
            {title}
          </h1>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{source}</span>
            <span>•</span>
            <span>{readingTime} min read</span>
          </div>
        </div>
      </div>
    </header>
};

export default ReadingViewHeader;
