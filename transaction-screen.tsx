'use client'

import { useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, Upload, Check } from 'lucide-react'
import type { Screen } from '@/components/bottom-nav'
import { ScreenHeader } from '@/components/screen-header'
import { categories, toBengaliDigits } from '@/lib/data'
import { cn } from '@/lib/utils'

export function TransactionScreen({
  onNavigate,
}: {
  onNavigate: (screen: Screen) => void
}) {
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<string>('মসজিদ')
  const [description, setDescription] = useState('')
  const [receiptName, setReceiptName] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onNavigate('home')
    }, 900)
  }

  return (
    <div className="flex flex-col">
      <ScreenHeader title="নতুন লেনদেন" subtitle="আয় বা ব্যয় যোগ করুন" onBack={onNavigate} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-5 py-5">
        {/* Transaction type */}
        <fieldset>
          <legend className="mb-2 text-sm font-semibold text-foreground">
            লেনদেনের ধরন
          </legend>
          <div className="grid grid-cols-2 gap-2 rounded-2xl border border-border bg-muted/50 p-1.5">
            <button
              type="button"
              onClick={() => setType('income')}
              aria-pressed={type === 'income'}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors',
                type === 'income'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              <ArrowDownCircle className="size-4.5" />
              আয় (সংগ্রহ)
            </button>
            <button
              type="button"
              onClick={() => setType('expense')}
              aria-pressed={type === 'expense'}
              className={cn(
                'flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors',
                type === 'expense'
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground',
              )}
            >
              <ArrowUpCircle className="size-4.5" />
              খরচ (ব্যয়)
            </button>
          </div>
        </fieldset>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            পরিমাণ
          </label>
          <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3.5">
            <span className="text-xl font-bold text-primary">৳</span>
            <input
              id="amount"
              inputMode="numeric"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value.replace(/[^0-9]/g, ''))
              }
              placeholder="০"
              className="w-full bg-transparent text-xl font-bold text-foreground outline-none placeholder:text-muted-foreground/50"
            />
            {amount && (
              <span className="text-sm text-muted-foreground">
                {toBengaliDigits(Number(amount).toLocaleString('en-IN'))}
              </span>
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-foreground">
            খাত
          </span>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                  category === cat
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground',
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-foreground"
          >
            বিবরণ
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="লেনদেনের বিস্তারিত লিখুন (যেমন: দাতার নাম, উদ্দেশ্য)"
            className="w-full resize-none rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
          />
        </div>

        {/* Receipt upload */}
        <div>
          <span className="mb-2 block text-sm font-semibold text-foreground">
            রসিদ / ভাউচার
          </span>
          <label
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition-colors',
              receiptName
                ? 'border-primary bg-secondary'
                : 'border-border bg-card',
            )}
          >
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) =>
                setReceiptName(e.target.files?.[0]?.name ?? null)
              }
            />
            <span
              className={cn(
                'flex size-11 items-center justify-center rounded-full',
                receiptName
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-primary',
              )}
            >
              {receiptName ? (
                <Check className="size-5" />
              ) : (
                <Upload className="size-5" />
              )}
            </span>
            <span className="text-sm font-semibold text-foreground">
              রসিদ আপলোড করুন
            </span>
            <span className="max-w-full truncate text-xs text-muted-foreground">
              {receiptName ?? 'ছবি নির্বাচন করতে ট্যাপ করুন'}
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={cn(
            'mt-1 flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-primary-foreground shadow-sm transition-transform active:scale-[0.98]',
            saved ? 'bg-primary' : type === 'income' ? 'bg-primary' : 'bg-accent',
          )}
        >
          {saved ? (
            <>
              <Check className="size-5" />
              সংরক্ষিত হয়েছে
            </>
          ) : (
            'লেনদেন সংরক্ষণ করুন'
          )}
        </button>
      </form>
    </div>
  )
}
