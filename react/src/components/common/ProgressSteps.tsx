
import { cn } from '@/lib/utils'
import SafeIcon from './SafeIcon'

interface Step {
  label: string
  status: 'complete' | 'current' | 'pending'
}

interface ProgressStepsProps {
  steps: Step[]
  className?: string
}

export default function ProgressSteps({ steps, className }: ProgressStepsProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {steps.map((step, index) => (
        <div 
          key={index}
          className="flex items-center gap-3"
        >
          {/* Icon */}
          <div className={cn(
            'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
            step.status === 'complete' && 'bg-primary text-primary-foreground',
            step.status === 'current' && 'bg-primary/20 text-primary',
            step.status === 'pending' && 'bg-muted text-muted-foreground'
          )}>
            {step.status === 'complete' ? (
              <SafeIcon name="Check" size={14} strokeWidth={3} />
            ) : step.status === 'current' ? (
              <SafeIcon name="Loader2" size={14} className="animate-spin" />
            ) : (
              <SafeIcon name="Circle" size={8} />
            )}
          </div>
          
          {/* Label */}
          <span className={cn(
            'text-sm',
            step.status === 'complete' && 'text-foreground',
            step.status === 'current' && 'text-foreground font-medium',
            step.status === 'pending' && 'text-muted-foreground'
          )}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )
}
