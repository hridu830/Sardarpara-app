'use client'

import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  PlusCircle,
  MinusCircle,
  Quote,
  Wallet,
} from 'lucide-react'
import type { Screen } from '@/components/bottom-nav'
import {
  formatSignedTaka,
  formatTaka,
  getRandomHadith,
  hadiths,
  recentTransactions,
  summary,
  type Hadith,
} from '@/lib/data'
import { cn } from '@/lib/utils'

export function DashboardScreen({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  const [hadith, setHadith] = useState<Hadith>(hadiths[0])

  useEffect(() => {
    setHadith(getRandomHadith())
  }, [])

  return (
    <div className="flex flex-col">
      {/* App bar */}
      <header className="relative overflow-hidden bg-primary px-5 pb-16 pt-6 text-primary-foreground">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-4 size-48 -translate-x-1/2 rounded-full bg-accent/25 blur-3xl"
        />

        <div className="relative flex justify-end">
          <button
            type="button"
            aria-label="বিজ্ঞপ্তি"
            className="relative flex size-9 shrink-0 items-center justify-center rounded-full border border-primary-foreground/15 bg-primary-foreground/10 backdrop-blur-sm"
          >
            <Bell className="size-4.5" />
            <span className="absolute right-2 top-2 size-2 rounded-full bg-accent" />
          </button>
        </div>

        {/* Prominent glassmorphic logo */}
        <div className="relative -mt-4 flex flex-col items-center text-center">
          <div className="relative">
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-primary-foreground/40 via-primary-foreground/5 to-transparent"
            />
            <div className="relative flex size-28 items-center justify-center overflow-hidden rounded-full border-2 border-accent bg-primary-foreground/10 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)] backdrop-blur-md">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-2 top-2 z-10 h-1/2 rounded-t-full bg-gradient-to-b from-primary-foreground/35 to-transparent"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo.png"
                alt="সর্দারপাড়া আমলে সালেহ যুব সংঘ লোগো"
                className="relative size-full object-cover"
              />
            </div>
          </div>

          <p className="mt-4 text-[11px] font-medium uppercase tracking-[0.2em] text-primary-foreground/60">
            স্বাগতম
          </p>
          <h1 className="mt-1 text-balance text-xl font-bold leading-tight tracking-tight">
            সর্দারপাড়া আমলে সালেহ যুব সংঘ
          </h1>
          <span
            aria-hidden="true"
            className="mt-3 h-0.5 w-12 rounded-full bg-accent/70"
          />
        </div>

        {/* Daily Hadith / wisdom snippet */}
        <figure className="mt-5 flex gap-3 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/10 p-4">
          <Quote className="size-5 shrink-0 text-accent" aria-hidden="true" />
          <div className="min-w-0">
            <figcaption className="text-[11px] font-medium uppercase tracking-wide text-primary-foreground/60">
              আজকের হাদিস
            </figcaption>
            <blockquote className="mt-1 font-serif text-[15px] font-medium leading-relaxed text-balance text-primary-foreground">
              {`"${hadith.text}"`}
            </blockquote>
            <cite className="mt-1.5 block text-[11px] not-italic font-medium text-accent">
              — {hadith.source}
            </cite>
          </div>
        </figure>
      </header>

      {/* Balance hero card overlapping the app bar */}
      <div className="-mt-12 px-5">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="size-4 text-accent" />
            <span className="text-[13px] font-medium">বর্তমান ব্যালেন্স</span>
          </div>
          <p className="mt-1.5 text-4xl font-bold tracking-tight text-primary">
            {formatTaka(summary.balance)}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SummaryTile
              label="মোট ফান্ড"
              value={formatTaka(summary.totalFund)}
              tone="income"
            />
            <SummaryTile
              label="মোট খরচ"
              value={formatTaka(summary.totalExpense)}
              tone="expense"
            />
          </div>
        </div>
      </div>

      {/* Primary actions */}
      <div className="mt-5 grid grid-cols-2 gap-3 px-5">
        <button
          type="button"
          onClick={() => onNavigate('transaction')}
          className="flex flex-col items-start gap-2 rounded-2xl bg-primary p-4 text-left text-primary-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          <PlusCircle className="size-6" />
          <span className="text-sm font-semibold leading-tight text-balance">
            সংগ্রহ যোগ করুন
          </span>
        </button>
        <button
          type="button"
          onClick={() => onNavigate('transaction')}
          className="flex flex-col items-start gap-2 rounded-2xl bg-accent p-4 text-left text-accent-foreground shadow-sm transition-transform active:scale-[0.98]"
        >
          <MinusCircle className="size-6" />
          <span className="text-sm font-semibold leading-tight text-balance">
            খরচ যোগ করুন
          </span>
        </button>
      </div>

      {/* Recent transactions */}
      <section className="mt-6 px-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-foreground">
            সাম্প্রতিক লেনদেন
          </h2>
          {recentTransactions.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate('report')}
              className="text-[13px] font-medium text-accent"
            >
              সব দেখুন
            </button>
          )}
        </div>

        {recentTransactions.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            এখনো কোনো লেনদেন যোগ করা হয়নি। উপরের বাটন থেকে প্রথম লেনদেন যোগ করুন।
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'income'
              return (
                <li
                  key={tx.id}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
                >
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full',
                      isIncome
                        ? 'bg-secondary text-primary'
                        : 'bg-accent/15 text-accent',
                    )}
                  >
                    {isIncome ? (
                      <ArrowDownRight className="size-5" />
                    ) : (
                      <ArrowUpRight className="size-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {tx.title}
                    </p>
                    <p className="text-xs text-muted-foreground">{tx.date}</p>
                  </div>
                  <span
                    className={cn(
                      'shrink-0 text-sm font-bold',
                      isIncome ? 'text-primary' : 'text-accent',
                    )}
                  >
                    {formatSignedTaka(tx.amount)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string
  value: string
  tone: 'income' | 'expense'
}) {
  return (
    <div className="rounded-2xl bg-muted/60 p-3">
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            'flex size-6 items-center justify-center rounded-full',
            tone === 'income'
              ? 'bg-secondary text-primary'
              : 'bg-accent/15 text-accent',
          )}
        >
          {tone === 'income' ? (
            <ArrowDownRight className="size-3.5" />
          ) : (
            <ArrowUpRight className="size-3.5" />
          )}
        </span>
        <span className="text-[12px] font-medium text-muted-foreground">
          {label}
        </span>
      </div>
      <p className="mt-1.5 text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
