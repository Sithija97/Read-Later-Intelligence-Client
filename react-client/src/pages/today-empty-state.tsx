import React from 'react'
import TodayEmptyStateContent from '@/components/today-empty-state/TodayEmptyStateContent'

const TodayEmptyState = () => {
  return (
    <main className="min-h-[calc(100vh-128px)] flex items-center justify-center">
      <TodayEmptyStateContent/>
    </main>
  )
}

export default TodayEmptyState
