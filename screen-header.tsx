'use client'

import { ChevronLeft } from 'lucide-react'
import type { Screen } from '@/components/bottom-nav'

export function ScreenHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string
  subtitle?: string
  onBack?: (screen: Screen) => void
}) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-primary px-4 py-4 text-primary-foreground">
      {onBack && (
        <button
          type="button"
          onClick={() => onBack('home')}
          aria-label="পিছনে যান"
          className="flex size-9 items-center justify-center rounded-full bg-primary-foreground/15"
        >
          <ChevronLeft className="size-5" />
        </button>
      )}
      <div>
        <h1 className="text-lg font-bold leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-[12px] text-primary-foreground/70">{subtitle}</p>
        )}
      </div>
    </header>
  )
}
