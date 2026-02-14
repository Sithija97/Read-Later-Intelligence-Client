
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  ctaText?: string
  ctaHref?: string
  className?: string
}

export default function EmptyState({
  icon = 'Sparkles',
  title,
  description,
  ctaText,
  ctaHref,
  className
}: EmptyStateProps) {
  return (
    <div className={cn('text-center py-16 px-6', className)}>
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-6">
        <SafeIcon name={icon} size={32} className="text-muted-foreground" />
      </div>
      
      <h2 className="text-2xl font-semibold mb-2">
        {title}
      </h2>
      
      {description && (
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          {description}
        </p>
      )}
      
      {ctaText && ctaHref && (
        <Button asChild>
          <Link to={ctaHref}>{ctaText}</Link>
        </Button>
      )}
    </div>
  )
}
