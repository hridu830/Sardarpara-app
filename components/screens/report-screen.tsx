'use client'

import { useMemo } from 'react'
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Cell, Pie, PieChart } from 'recharts'
import { ScreenHeader } from '@/components/screen-header'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { formatTaka, toBengaliDigits, type Transaction } from '@/lib/data'
import { cn } from '@/lib/utils'

const palette = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function ReportScreen({ transactions }: { transactions: Transaction[] }) {
  const { totalIncome, totalExpense, balance, categoryBreakdown } = useMemo(() => {
    let income = 0
    let expense = 0
    const byCategory: Record<string, number> = {}

    transactions.forEach((t) => {
      if (t.type === 'income') {
        income += t.amount
      } else {
        const amt = Math.abs(t.amount)
        expense += amt
        byCategory[t.category] = (byCategory[t.category] || 0) + amt
      }
    })

    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      categoryBreakdown: Object.entries(byCategory).map(([label, value]) => ({
        label,
        value,
      })),
    }
  }, [transactions])

  const incomeExpenseData = [
    { name: 'আয়', value: totalIncome, fill: 'var(--chart-1)' },
    { name: 'ব্যয়', value: totalExpense, fill: 'var(--chart-4)' },
  ].filter((d) => d.value > 0)

  const ieChartConfig = {
    আয়: { label: 'আয়', color: 'var(--chart-1)' },
    ব্যয়: { label: 'ব্যয়', color: 'var(--chart-4)' },
  } satisfies ChartConfig

  const categoryChartConfig = Object.fromEntries(
    categoryBreakdown.map((c, i) => [
      c.label,
      { label: c.label, color: palette[i % palette.length] },
    ]),
  ) satisfies ChartConfig

  const hasAnyData = totalIncome > 0 || totalExpense > 0

  return (
    <div className="flex flex-col">
      <ScreenHeader title="আয়-ব্যয়ের রিপোর্ট" subtitle="সংঘের আর্থিক সারসংক্ষেপ" />

      <div className="px-5 py-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<TrendingUp className="size-4" />}
            label="মোট আয়"
            value={formatTaka(totalIncome)}
            tone="income"
          />
          <StatCard
            icon={<TrendingDown className="size-4" />}
            label="মোট খরচ"
            value={formatTaka(totalExpense)}
            tone="expense"
          />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Wallet className="size-4.5" />
            বর্তমান ব্যালেন্স
          </span>
          <span className="text-xl font-bold">{formatTaka(balance)}</span>
        </div>

        {!hasAnyData ? (
          <p className="mt-5 rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
            এখনো কোনো লেনদেন যোগ করা হয়নি। লেনদেন যোগ হলে এখানে গ্রাফ ও বিশ্লেষণ দেখা যাবে।
          </p>
        ) : (
          <>
            {/* Income vs Expense pie */}
            <section className="mt-5 rounded-3xl border border-border bg-card p-5">
              <h2 className="text-base font-bold text-foreground">আয় বনাম ব্যয়</h2>
              <ChartContainer
                config={ieChartConfig}
                className="mx-auto mt-3 aspect-square max-h-[200px]"
              >
                <PieChart>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={incomeExpenseData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={82}
                    strokeWidth={4}
                  >
                    {incomeExpenseData.map((d) => (
                      <Cell key={d.name} fill={d.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="mt-2 flex justify-center gap-6">
                <LegendDot color="var(--chart-1)" label={`আয় ${formatTaka(totalIncome)}`} />
                <LegendDot color="var(--chart-4)" label={`ব্যয় ${formatTaka(totalExpense)}`} />
              </div>
            </section>

            {/* Expense breakdown pie */}
            {categoryBreakdown.length > 0 && (
              <section className="mt-4 rounded-3xl border border-border bg-card p-5">
                <h2 className="text-base font-bold text-foreground">খরচের খাত বিশ্লেষণ</h2>
                <p className="text-xs text-muted-foreground">
                  মোট খরচ {formatTaka(totalExpense)} বিভিন্ন খাতে বণ্টন
                </p>

                <ChartContainer
                  config={categoryChartConfig}
                  className="mx-auto mt-3 aspect-square max-h-[220px]"
                >
                  <PieChart>
                    <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <Pie
                      data={categoryBreakdown}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={58}
                      outerRadius={90}
                      strokeWidth={4}
                    >
                      {categoryBreakdown.map((c, i) => (
                        <Cell key={c.label} fill={palette[i % palette.length]} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                <ul className="mt-2 flex flex-col gap-2.5">
                  {categoryBreakdown.map((slice, i) => {
                    const pct = Math.round((slice.value / totalExpense) * 100)
                    return (
                      <li key={slice.label} className="flex items-center gap-3 text-sm">
                        <span
                          className="size-3 shrink-0 rounded-full"
                          style={{ backgroundColor: palette[i % palette.length] }}
                        />
                        <span className="flex-1 font-medium text-foreground">{slice.label}</span>
                        <span className="text-muted-foreground">{toBengaliDigits(pct)}%</span>
                        <span className="w-20 text-right font-semibold text-foreground">
                          {formatTaka(slice.value)}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] font-medium text-foreground">
      <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  tone: 'income' | 'expense'
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span
        className={cn(
          'flex size-8 items-center justify-center rounded-full',
          tone === 'income' ? 'bg-secondary text-primary' : 'bg-accent/15 text-accent',
        )}
      >
        {icon}
      </span>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
