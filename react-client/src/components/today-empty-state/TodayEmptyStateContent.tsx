
'use client'

import { Button } from '@/components/ui/button'
import EmptyState from '@/components/common/EmptyState'
import { cn } from '@/lib/utils'
import { Link } from 'react-router-dom'

export default function TodayEmptyStateContent() {
  return (
    <div className="w-full max-w-md px-6">
      <EmptyState
        icon="Sparkles"
        title="You're all caught up ✨"
        description="Nothing to read today. Great job staying on top of your reading list!"
        className="py-12"
      />
      
      {/* CTA Buttons */}
      <div className="flex flex-col gap-3 mt-8">
        <Button 
          asChild
          size="lg"
          className="w-full"
        >
          <Link to="/">
            Save Something Worth Reading
          </Link>
        </Button>
        
        <Button 
          asChild
          variant="secondary"
          size="lg"
          className="w-full"
        >
          <Link to="/library-view">
            Browse Your Library
          </Link>
        </Button>
      </div>
    </div>
  )
}
