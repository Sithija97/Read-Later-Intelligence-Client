import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import SafeIcon from "@/components/common/SafeIcon";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface ReadingViewFooterProps {
  articleId: string;
}

type CompletionStatus = "read" | "skimmed" | null;

const ReadingViewFooter = ({ articleId }: ReadingViewFooterProps) => {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(true);
  const [completionStatus, setCompletionStatus] =
    useState<CompletionStatus>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setIsClient(false);

    // Trigger client state
    requestAnimationFrame(() => {
      setIsClient(true);
    });
  }, []);

  const handleCompletion = async (status: CompletionStatus) => {
    setIsSubmitting(true);
    setCompletionStatus(status);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Navigate to completion reflection
    if (typeof window !== "undefined") {
      navigate('/completion-reflection');
    }
  };

  return  <footer
      className={cn(
        'sticky bottom-0 z-40 border-t border-border bg-background transition-shadow duration-200',
        (isClient || isSubmitting) && 'shadow-soft'
      )}
    >
      <div className="container-reading py-6 md:py-8">
        {/* Completion Actions */}
        <div className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium text-muted-foreground">
            Mark as:
          </span>

          <div className="flex gap-3">
            {/* Mark as Read */}
            <Button
              onClick={() => handleCompletion('read')}
              disabled={isSubmitting}
              className={(isClient || isSubmitting) ? 'opacity-100' : 'opacity-0'}
              style={{
                transition: 'opacity 0.3s ease-out'
              }}
            >
              {isSubmitting && completionStatus === 'read' ? (
                <>
                  <SafeIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <SafeIcon name="Check" size={16} className="mr-2" />
                  Read
                </>
              )}
            </Button>

            {/* Mark as Skimmed */}
            <Button
              onClick={() => handleCompletion('skimmed')}
              disabled={isSubmitting}
              variant="secondary"
              className={(isClient || isSubmitting) ? 'opacity-100' : 'opacity-0'}
              style={{
                transition: 'opacity 0.3s ease-out'
              }}
            >
              {isSubmitting && completionStatus === 'skimmed' ? (
                <>
                  <SafeIcon name="Loader2" size={16} className="animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <SafeIcon name="Eye" size={16} className="mr-2" />
                  Skimmed
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Accessibility hint */}
        <p className="text-xs text-muted-foreground mt-4">
          Choose how you consumed this article to help improve your reading habits.
        </p>
      </div>
    </footer>
};

export default ReadingViewFooter;
