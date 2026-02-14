import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import SafeIcon from "@/components/common/SafeIcon";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

interface CompletionReflectionProps {
  articleTitle?: string;
  onComplete?: (rating: "yes" | "no", note?: string) => void;
}

const CompletionReflection = ({
  articleTitle = "How We Read on the Internet",
  onComplete,
}: CompletionReflectionProps) => {
  const navigate = useNavigate();
  const [isClient, setIsClient] = useState(true);
  const [rating, setRating] = useState<"yes" | "no" | null>(null);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Hydration: switch to pre-client state
    setIsClient(false);

    // Client: restore to final state
    const timer = requestAnimationFrame(() => {
      setIsClient(true);
    });

    return () => cancelAnimationFrame(timer);
  }, []);

  const handleSubmit = async () => {
    if (!rating) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (onComplete) {
      onComplete(rating, note || undefined);
    } else {
      // Default navigation to today's reads
      navigate("/todays-reads");
    }
  };

  const isFormValid = rating !== null;

  const handleSkipForNow = () => navigate("/todays-reads");

  return (
    <div className="container-app py-12 md:py-16">
      {/* Content Container */}
      <div
        className={cn(
          "max-w-md mx-auto transition-opacity duration-300",
          isClient || true ? "opacity-100" : "opacity-50"
        )}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-semibold mb-2">
            Was this worth saving?
          </h1>
          <p className="text-sm text-muted-foreground">
            Help us understand what you found valuable
          </p>
        </div>

        {/* Rating Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Button
            onClick={() => setRating("yes")}
            variant={rating === "yes" ? "default" : "outline"}
            size="lg"
            className={cn(
              "transition-all",
              rating === "yes" && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <SafeIcon name="ThumbsUp" size={18} className="mr-2" />
            Yes
          </Button>
          <Button
            onClick={() => setRating("no")}
            variant={rating === "no" ? "default" : "outline"}
            size="lg"
            className={cn(
              "transition-all",
              rating === "no" && "ring-2 ring-primary ring-offset-2"
            )}
          >
            <SafeIcon name="ThumbsDown" size={18} className="mr-2" />
            Not really
          </Button>
        </div>

        {/* Optional Note Section */}
        {rating && (
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <label className="block text-sm font-medium mb-3">
              What did you learn?{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              placeholder="Share a key takeaway or insight..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="min-h-24 resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This helps us understand your reading patterns
            </p>
          </div>
        )}

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
          size="lg"
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <SafeIcon
                name="Loader2"
                size={18}
                className="mr-2 animate-spin"
              />
              Saving...
            </>
          ) : (
            <>
              <SafeIcon name="Check" size={18} className="mr-2" />
              Done
            </>
          )}
        </Button>

        {/* Skip Link */}
        <div className="text-center mt-6">
          <button
            onClick={handleSkipForNow}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors underline"
          >
            Skip for now
          </button>
        </div>
      </div>

      {/* Decorative Element */}
      <div className="mt-16 text-center">
        <p className="text-xs text-muted-foreground">
          ✨ Your reading habits are improving
        </p>
      </div>
    </div>
  );
};

export default CompletionReflection;
