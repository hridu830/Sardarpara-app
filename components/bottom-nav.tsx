'use client'

import { Home, Users, PieChart, Plus, MoonStar } from 'lucide-react'
import { cn } from '@/lib/utils'

export type Screen =
  | 'home'
  | 'members'
  | 'transaction'
  | 'namaz'
  | 'report'

const items: {
  key: Screen
  label: string
  icon: typeof Home
  raised?: boolean
}[] = [
  { key: 'home', label: 'হোম', icon: Home },
  { key: 'namaz', label: 'নামাজ', icon: MoonStar },
  { key: 'transaction', label: 'লেনদেন', icon: Plus, raised: true },
  { key: 'members', label: 'সদস্য', icon: Users },
  { key: 'report', label: 'রিপোর্ট', icon: PieChart },
]

export function BottomNav({
  active,
  onNavigate,
}: {
  active: Screen
  onNavigate: (screen: Screen) => void
}) {
  return (
    <nav
      aria-label="মূল নেভিগেশন"
      className="border-t border-border bg-card px-2 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="flex items-stretch justify-around">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active === item.key

          if (item.raised) {
            return (
              <li key={item.key} className="flex flex-1 justify-center">
                <button
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className="flex flex-col items-center gap-1 pt-1.5"
                >
                  <span
                    className={cn(
                      'flex size-12 items-center justify-center rounded-full text-accent-foreground shadow-md shadow-accent/30 ring-4 transition-all active:scale-95',
                      isActive
                        ? 'bg-primary ring-primary/20'
                        : 'bg-accent ring-accent/15',
                    )}
                  >
                    <Icon className="size-6" strokeWidth={2.5} />
                  </span>
                  <span
                    className={cn(
                      'text-[11px] font-semibold',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            )
          }

          return (
            <li key={item.key} className="flex-1">
              <button
                type="button"
                onClick={() => onNavigate(item.key)}
                aria-current={isActive ? 'page' : undefined}
                className="flex w-full flex-col items-center gap-1 py-2.5"
              >
                <span
                  className={cn(
                    'flex items-center justify-center rounded-full px-4 py-1 transition-colors',
                    isActive && 'bg-secondary',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-6',
                      isActive ? 'text-primary' : 'text-muted-foreground',
                    )}
                    strokeWidth={isActive ? 2.6 : 2}
                  />
                </span>
                <span
                  className={cn(
                    'text-[11px] font-medium transition-colors',
                    isActive ? 'font-bold text-primary' : 'text-muted-foreground',
                  )}
                >
                  {item.label}
                </span>
                <span
                  className={cn(
                    'h-1 w-1 rounded-full transition-opacity',
                    isActive ? 'bg-accent opacity-100' : 'opacity-0',
                  )}
                />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
