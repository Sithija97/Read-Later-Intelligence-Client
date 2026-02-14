
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import SafeIcon from '@/components/common/SafeIcon'
import { cn } from '@/lib/utils'

interface ArticleCardProps {
  variant?: 'today' | 'library' | 'preview'
  title: string
  source?: string
  readTime?: number
  skimTime?: number
  summary?: string[]
  status?: 'unread' | 'skimmed' | 'read'
  savedDate?: string
  contextMessage?: string
  onRead?: () => void
  onSkim?: () => void
  onSnooze?: () => void
  className?: string
}

export default function ArticleCard({
  variant = 'today',
  title,
  source,
  readTime,
  skimTime,
  summary,
  status,
  savedDate,
  contextMessage,
  onRead,
  onSkim,
  onSnooze,
  className
}: ArticleCardProps) {
  return (
    <div className={cn('card-minimal p-6', className)}>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2 leading-tight">
          {title}
        </h3>
        
        {/* Meta info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {source && <span>{source}</span>}
          {readTime && (
            <>
              <span>•</span>
              <span>{readTime} min read</span>
            </>
          )}
          {status && variant === 'library' && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {status}
              </Badge>
            </>
          )}
        </div>
      </div>

      {/* Summary (Preview variant) */}
      {variant === 'preview' && summary && summary.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium mb-2">TL;DR</p>
          <ul className="space-y-1.5">
            {summary.map((item, index) => (
              <li key={index} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Context message (Today variant) */}
      {variant === 'today' && (savedDate || contextMessage) && (
        <div className="mb-4 text-sm text-muted-foreground">
          {savedDate && <p>You saved this {savedDate}</p>}
          {contextMessage && <p className="text-foreground/80">{contextMessage}</p>}
        </div>
      )}

      {/* Actions */}
      {variant === 'today' && (
        <div className="flex flex-wrap gap-2">
          {onRead && readTime && (
            <Button onClick={onRead} size="sm">
              Read ({readTime} min)
            </Button>
          )}
          {onSkim && skimTime && (
            <Button onClick={onSkim} variant="secondary" size="sm">
              Skim ({skimTime} min)
            </Button>
          )}
          {onSnooze && (
            <Button onClick={onSnooze} variant="ghost" size="sm">
              Snooze
            </Button>
          )}
        </div>
      )}

      {variant === 'preview' && (
        <div className="flex flex-wrap gap-2">
          {onRead && readTime && (
            <Button onClick={onRead} size="default">
              Read Full ({readTime} min)
            </Button>
          )}
          {onSkim && skimTime && (
            <Button onClick={onSkim} variant="secondary" size="default">
              Skim Summary ({skimTime} min)
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
