
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { cn } from '@/lib/utils'
import type { ArticleModel } from '@/data/Article'

interface ArticleCardItemProps {
  article: ArticleModel
  onRead: () => void
  onSkim: () => void
  onSnooze: () => void
}

export default function ArticleCardItem({
  article,
  onRead,
  onSkim,
  onSnooze
}: ArticleCardItemProps) {
  // Format save date for display
  const formatSaveDate = (dateStr: string): string => {
    // If already a friendly string (from mock), use it
    if (dateStr.includes('ago') || dateStr.includes('week') || dateStr.includes('day')) {
      return dateStr
    }
    
    // Otherwise parse ISO date
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
      return `${Math.floor(diffDays / 30)} months ago`
    } catch {
      return 'Recently'
    }
  }

  const readLabel = article.readingTimeInMinutes <= 3 ? 'skim' : 'read'
  const contextMessage = readLabel === 'skim' 
    ? 'Good for quick insights'
    : 'Good for focused time'

  return (
    <div className="card-minimal p-6 hover:shadow-md transition-shadow">
      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 leading-tight line-clamp-2">
        {article.title}
      </h3>

      {/* Meta Info */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
        <span>{article.source.name}</span>
        <span>•</span>
        <span>{article.readingTimeInMinutes} min read</span>
      </div>

      {/* Context */}
      <div className="mb-4 text-sm text-muted-foreground space-y-1">
        <p>You saved this {formatSaveDate(article.saveDate)}</p>
        <p className="text-foreground/70">{contextMessage}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={onRead}
          size="sm"
          className="gap-2"
        >
          <span>Read</span>
          <span className="text-xs opacity-75">({article.readingTimeInMinutes} min)</span>
        </Button>

        <Button
          onClick={onSkim}
          variant="secondary"
          size="sm"
          className="gap-2"
        >
          <span>Skim</span>
          <span className="text-xs opacity-75">({article.skimTimeInMinutes} min)</span>
        </Button>

        <Button
          onClick={onSnooze}
          variant="ghost"
          size="sm"
          className="gap-2"
        >
          <SafeIcon name="Clock" size={16} />
          <span>Snooze</span>
        </Button>
      </div>
    </div>
  )
}
