'use client'

import { useMemo, useState } from 'react'
import { Search, CheckCircle2, Clock } from 'lucide-react'
import { ScreenHeader } from '@/components/screen-header'
import { members, toBengaliDigits } from '@/lib/data'
import { cn } from '@/lib/utils'

const avatarTones = [
  'bg-secondary text-primary',
  'bg-accent/15 text-accent',
  'bg-primary/10 text-primary',
]

export function MembersScreen() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return members
    return members.filter(
      (m) => m.name.includes(q) || m.position.includes(q),
    )
  }, [query])

  const paidCount = members.filter((m) => m.status === 'paid').length

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="সদস্য তালিকা"
        subtitle={`মোট ${toBengaliDigits(members.length)} জন সদস্য`}
      />

      <div className="px-5 pt-4">
        {/* Search */}
        <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-3.5 py-3">
          <Search className="size-4.5 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="নাম বা পদবি দিয়ে খুঁজুন"
            aria-label="সদস্য খুঁজুন"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Paid summary */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
          <span className="text-[13px] font-medium text-secondary-foreground">
            এই মাসে চাঁদা পরিশোধ
          </span>
          <span className="text-sm font-bold text-primary">
            {toBengaliDigits(paidCount)}/{toBengaliDigits(members.length)}
          </span>
        </div>

        {/* Member list */}
        <ul className="mt-4 flex flex-col gap-2.5 pb-2">
          {filtered.map((member, i) => {
            const initial = member.name.replace(/^মোঃ\s*/, '').charAt(0)
            const paid = member.status === 'paid'
            return (
              <li
                key={member.id}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
              >
                <span
                  aria-hidden
                  className={cn(
                    'flex size-11 shrink-0 items-center justify-center rounded-full text-base font-bold',
                    avatarTones[i % avatarTones.length],
                  )}
                >
                  {initial}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.position}
                  </p>
                </div>
                <span
                  className={cn(
                    'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    paid
                      ? 'bg-secondary text-primary'
                      : 'bg-accent/15 text-accent',
                  )}
                >
                  {paid ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Clock className="size-3.5" />
                  )}
                  {paid ? 'চাঁদা প্রদান করেছেন' : 'বকেয়া আছে'}
                </span>
              </li>
            )
          })}

          {filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              কোনো সদস্য পাওয়া যায়নি
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
