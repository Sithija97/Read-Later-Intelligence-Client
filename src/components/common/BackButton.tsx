
import { Button } from '@/components/ui/button'
import SafeIcon from '@/components/common/SafeIcon'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

interface BackButtonProps {
  href: string
  label?: string
  className?: string
}

export default function BackButton({ 
  href, 
  label = 'Back',
  className 
}: BackButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      asChild
      className={cn('gap-2 -ml-2', className)}
    >
      <Link to={href}>
        <SafeIcon name="ArrowLeft" size={16} />
        {label}
      </Link>
    </Button>
  )
}
