
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'

interface TodaysReadsEmptyProps {
  onSaveNew: () => void
  onViewLibrary: () => void
}

export default function TodaysReadsEmpty({
  onSaveNew,
  onViewLibrary
}: TodaysReadsEmptyProps) {
  return (
    <div className="container-app min-h-[calc(100vh-64px)] flex items-center justify-center py-12">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
          <SafeIcon name="Sparkles" size={40} className="text-muted-foreground" />
        </div>

        {/* Message */}
        <h2 className="text-2xl font-semibold mb-2">
          You're all caught up ✨
        </h2>
        <p className="text-muted-foreground mb-8">
          Nothing to read today. Great job staying on top of things!
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={onSaveNew} size="lg">
            Save Something New
          </Button>
          <Button onClick={onViewLibrary} variant="secondary" size="lg">
            Browse Library
          </Button>
        </div>
      </div>
    </div>
  )
}
