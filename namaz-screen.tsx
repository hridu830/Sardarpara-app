'use client'

import { useEffect, useMemo, useState } from 'react'
import { BellRing, Quote, Trophy, Award } from 'lucide-react'
import { ScreenHeader } from '@/components/screen-header'
import {
  getRandomSalahHadith,
  prayers,
  prayerStatusOptions,
  salahHadiths,
  salahLeaderboard,
  salahMonthly,
  toBengaliDigits,
  type Hadith,
  type PrayerKey,
  type PrayerStatus,
} from '@/lib/data'
import { cn } from '@/lib/utils'

const statusStyles: Record<
  PrayerStatus,
  { active: string; dot: string }
> = {
  jamaat: {
    active: 'bg-primary text-primary-foreground border-primary',
    dot: 'bg-primary',
  },
  alone: {
    active: 'bg-accent text-accent-foreground border-accent',
    dot: 'bg-accent',
  },
  missed: {
    active: 'bg-destructive text-white border-destructive',
    dot: 'bg-destructive',
  },
}

function getInitials(name: string) {
  const parts = name.replace(/^মোঃ\s*/, '').trim().split(' ')
  return parts[0]?.slice(0, 2) ?? ''
}

export function NamazScreen() {
  // Random Salah Hadith on mount (avoids hydration mismatch).
  const [hadith, setHadith] = useState<Hadith>(salahHadiths[0])
  useEffect(() => {
    setHadith(getRandomSalahHadith())
  }, [])

  // Today's per-prayer logging state.
  const [log, setLog] = useState<Partial<Record<PrayerKey, PrayerStatus>>>({
    fajr: 'jamaat',
    dhuhr: 'jamaat',
  })

  const todayJamaat = useMemo(
    () => Object.values(log).filter((s) => s === 'jamaat').length,
    [log],
  )

  const { jamaatCount, totalWaqt, nextPrayer } = salahMonthly
  const progress = Math.round((jamaatCount / totalWaqt) * 100)

  return (
    <div>
      <ScreenHeader title="নামাজ ট্র্যাকার ও আমল" subtitle="আজকের ইবাদত" />

      <div className="space-y-5 p-4">
        {/* Current prayer time + notification + dynamic Hadith */}
        <section className="overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 pt-4">
            <div>
              <p className="text-[12px] font-medium text-primary-foreground/70">
                পরবর্তী ওয়াক্ত
              </p>
              <p className="text-2xl font-bold leading-tight">
                {nextPrayer.name}
              </p>
              <p className="text-[13px] text-primary-foreground/80">
                {nextPrayer.time} · {nextPrayer.remaining}
              </p>
            </div>
            <span className="relative flex items-center gap-1.5 rounded-full bg-primary-foreground/12 px-3 py-1.5 text-[12px] font-medium">
              <BellRing className="size-4 text-accent" />
              আজান অ্যালার্ট
              <span className="absolute -right-0.5 -top-0.5 flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex size-2.5 rounded-full bg-accent" />
              </span>
            </span>
          </div>

          <figure className="mt-4 flex gap-2.5 border-t border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3">
            <Quote className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <blockquote className="font-serif text-[14px] font-medium leading-relaxed text-balance">
              {`“${hadith.text}”`}
              <cite className="mt-0.5 block text-[11px] not-italic font-medium text-primary-foreground/60">
                — {hadith.source}
              </cite>
            </blockquote>
          </figure>
        </section>

        {/* Today's 5-prayer checklist */}
        <section>
          <h2 className="mb-3 text-[15px] font-bold text-foreground">
            আজকের নামাজ
          </h2>
          <ul className="space-y-2.5">
            {prayers.map((prayer) => {
              const current = log[prayer.key]
              return (
                <li
                  key={prayer.key}
                  className="rounded-2xl border border-border bg-card p-3"
                >
                  <div className="mb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'size-2 rounded-full',
                          current
                            ? statusStyles[current].dot
                            : 'bg-muted-foreground/30',
                        )}
                      />
                      <span className="text-[15px] font-semibold text-foreground">
                        {prayer.name}
                      </span>
                    </div>
                    <span className="text-[12px] text-muted-foreground">
                      {prayer.time}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {prayerStatusOptions.map((opt) => {
                      const selected = current === opt.key
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() =>
                            setLog((prev) => ({
                              ...prev,
                              [prayer.key]: opt.key,
                            }))
                          }
                          aria-pressed={selected}
                          className={cn(
                            'rounded-xl border py-2 text-[13px] font-medium transition-colors',
                            selected
                              ? statusStyles[opt.key].active
                              : 'border-border bg-background text-muted-foreground',
                          )}
                        >
                          {opt.label}
                        </button>
                      )
                    })}
                  </div>
                </li>
              )
            })}
          </ul>
          <p className="mt-2.5 text-center text-[12px] text-muted-foreground">
            আজ জামাতে আদায়:{' '}
            <span className="font-semibold text-primary">
              {toBengaliDigits(todayJamaat)}/{toBengaliDigits(prayers.length)}
            </span>{' '}
            ওয়াক্ত
          </p>
        </section>

        {/* Monthly streak counter */}
        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-muted-foreground">
                এই মাসে মোট জামাতে আদায়
              </p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {toBengaliDigits(jamaatCount)}
                <span className="text-base font-semibold text-muted-foreground">
                  /{toBengaliDigits(totalWaqt)}
                </span>{' '}
                <span className="text-base font-medium text-muted-foreground">
                  ওয়াক্ত
                </span>
              </p>
            </div>
            <span className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
              {toBengaliDigits(progress)}%
            </span>
          </div>
          <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        {/* Leaderboard */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="size-4.5 text-accent" />
            <h2 className="text-[15px] font-bold text-foreground">
              সেরা আমলকারী
            </h2>
          </div>
          <p className="mb-3 text-[12px] text-muted-foreground">
            এই মাসে সর্বোচ্চ জামাতে নামাজ আদায়কারী — পুরস্কার কর্মসূচির জন্য।
          </p>
          <ul className="space-y-2">
            {salahLeaderboard.map((entry, index) => {
              const rank = index + 1
              const topThree = rank <= 3
              return (
                <li
                  key={entry.id}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-3',
                    topThree
                      ? 'border-accent/30 bg-accent/5'
                      : 'border-border bg-card',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
                      rank === 1
                        ? 'bg-accent text-accent-foreground'
                        : topThree
                          ? 'bg-accent/20 text-accent'
                          : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {toBengaliDigits(rank)}
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[13px] font-semibold text-primary">
                    {getInitials(entry.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-foreground">
                      {entry.name}
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      {entry.position}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    {rank === 1 && <Award className="size-4 text-accent" />}
                    <span className="text-[14px] font-bold">
                      {toBengaliDigits(entry.jamaatWaqt)}
                    </span>
                    <span className="text-[12px] text-muted-foreground">
                      ওয়াক্ত
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      </div>
    </div>
  )
}
