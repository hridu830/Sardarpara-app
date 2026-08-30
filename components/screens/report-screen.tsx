'use client'

import { TrendingUp, TrendingDown, Wallet } from 'lucide-react'
import { Cell, Label, Pie, PieChart } from 'recharts'
import { ScreenHeader } from '@/components/screen-header'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { expenseByCategory, formatTaka, summary, toBengaliDigits } from '@/lib/data'
import { cn } from '@/lib/utils'

const chartConfig = {
  mosque: { label: 'মসজিদ', color: 'var(--chart-1)' },
  road: { label: 'রাস্তা', color: 'var(--chart-2)' },
  help: { label: 'সাহায্য', color: 'var(--chart-3)' },
  other: { label: 'অন্যান্য', color: 'var(--chart-4)' },
} satisfies ChartConfig

// Map slice labels to config keys for coloring.
const sliceKey = ['mosque', 'road', 'help', 'other']

export function ReportScreen() {
  const totalExpense = expenseByCategory.reduce((s, c) => s + c.value, 0)

  return (
    <div className="flex flex-col">
      <ScreenHeader title="আয়-ব্যয়ের রিপোর্ট" subtitle="সংঘের আর্থিক সারসংক্ষেপ" />

      <div className="px-5 py-4">
        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            icon={<TrendingUp className="size-4" />}
            label="মোট আয়"
            value={formatTaka(summary.totalFund)}
            tone="income"
          />
          <StatCard
            icon={<TrendingDown className="size-4" />}
            label="মোট খরচ"
            value={formatTaka(summary.totalExpense)}
            tone="expense"
          />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary px-4 py-3.5 text-primary-foreground">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Wallet className="size-4.5" />
            বর্তমান ব্যালেন্স
          </span>
          <span className="text-xl font-bold">{formatTaka(summary.balance)}</span>
        </div>

        {/* Expense breakdown pie */}
        <section className="mt-5 rounded-3xl border border-border bg-card p-5">
          <h2 className="text-base font-bold text-foreground">
            খরচের খাত বিশ্লেষণ
          </h2>

          {totalExpense === 0 ? (
            <p className="mt-3 rounded-2xl border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
              এখনো কোনো খরচ যোগ করা হয়নি। খরচ যোগ হলে এখানে খাত অনুযায়ী বিশ্লেষণ দেখা যাবে।
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                মোট খরচ {formatTaka(totalExpense)} বিভিন্ন খাতে বণ্টন
              </p>

              <ChartContainer
                config={chartConfig}
                className="mx-auto mt-3 aspect-square max-h-[220px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={expenseByCategory.map((s, i) => ({
                      name: chartConfig[sliceKey[i] as keyof typeof chartConfig]
                        .label,
                      value: s.value,
                      key: sliceKey[i],
                    }))}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={58}
                    outerRadius={90}
                    strokeWidth={4}
                  >
                    {expenseByCategory.map((_, i) => (
                      <Cell
                        key={sliceKey[i]}
                        fill={`var(--color-${sliceKey[i]})`}
                      />
                    ))}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) - 6}
                                className="fill-foreground text-lg font-bold"
                              >
                                {formatTaka(totalExpense)}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy ?? 0) + 16}
                                className="fill-muted-foreground text-[11px]"
                              >
                                মোট খরচ
                              </tspan>
                            </text>
                          )
                        }
                        return null
                      }}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>

              {/* Legend with amounts */}
              <ul className="mt-2 flex flex-col gap-2.5">
                {expenseByCategory.map((slice, i) => {
                  const pct = Math.round((slice.value / totalExpense) * 100)
                  return (
                    <li
                      key={slice.label}
                      className="flex items-center gap-3 text-sm"
                    >
                      <span
                        className="size-3 shrink-0 rounded-full"
                        style={{ backgroundColor: `var(--color-${sliceKey[i]})` }}
                      />
                      <span className="flex-1 font-medium text-foreground">
                        {slice.label}
                      </span>
                      <span className="text-muted-foreground">
                        {toBengaliDigits(pct)}%
                      </span>
                      <span className="w-20 text-right font-semibold text-foreground">
                        {formatTaka(slice.value)}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </section>
      </div>
    </div>
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
          tone === 'income'
            ? 'bg-secondary text-primary'
            : 'bg-accent/15 text-accent',
        )}
      >
        {icon}
      </span>
      <p className="mt-2 text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-lg font-bold text-foreground">{value}</p>
    </div>
  )
}
