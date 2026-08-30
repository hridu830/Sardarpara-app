'use client'

import { useMemo, useState } from 'react'
import { Search, CheckCircle2, Clock, Plus, Trash2, X } from 'lucide-react'
import { ScreenHeader } from '@/components/screen-header'
import { toBengaliDigits, type Member, type PaymentStatus } from '@/lib/data'
import { cn } from '@/lib/utils'

const avatarTones = [
  'bg-secondary text-primary',
  'bg-accent/15 text-accent',
  'bg-primary/10 text-primary',
]

export function MembersScreen({
  members,
  onAddMember,
  onRemoveMember,
  onToggleStatus,
}: {
  members: Member[]
  onAddMember: (m: { name: string; position: string; phone: string; status: PaymentStatus }) => void
  onRemoveMember: (id: string) => void
  onToggleStatus: (id: string) => void
}) {
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [position, setPosition] = useState('')
  const [phone, setPhone] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return members
    return members.filter((m) => m.name.includes(q) || m.position.includes(q))
  }, [members, query])

  const paidCount = members.filter((m) => m.status === 'paid').length

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmedName = name.trim()
    if (!trimmedName) return
    onAddMember({
      name: trimmedName,
      position: position.trim() || 'সদস্য',
      phone: phone.trim(),
      status: 'due',
    })
    setName('')
    setPosition('')
    setPhone('')
    setShowForm(false)
  }

  function handleRemove(id: string, memberName: string) {
    if (!confirm(`"${memberName}" কে সদস্য তালিকা থেকে মুছে ফেলতে চান?`)) return
    onRemoveMember(id)
  }

  return (
    <div className="flex flex-col">
      <ScreenHeader
        title="সদস্য তালিকা"
        subtitle={`মোট ${toBengaliDigits(members.length)} জন সদস্য`}
      />

      <div className="px-5 pt-4">
        {/* Add member button / form */}
        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary py-3.5 text-sm font-bold text-primary-foreground shadow-sm active:scale-[0.98]"
          >
            <Plus className="size-4.5" />
            নতুন সদস্য যোগ করুন
          </button>
        ) : (
          <form
            onSubmit={handleAdd}
            className="mb-3 flex flex-col gap-2.5 rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">নতুন সদস্য</span>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="বাতিল"
                className="flex size-7 items-center justify-center rounded-full text-muted-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="নাম *"
              required
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
            />
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="পদবি (যেমন: সভাপতি, সদস্য)"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="মোবাইল নম্বর (ঐচ্ছিক)"
              inputMode="tel"
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
            />
            <button
              type="submit"
              className="mt-1 rounded-xl bg-primary py-2.5 text-sm font-bold text-primary-foreground"
            >
              যোগ করুন
            </button>
          </form>
        )}

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
        {members.length > 0 && (
          <div className="mt-3 flex items-center justify-between rounded-2xl bg-secondary px-4 py-3">
            <span className="text-[13px] font-medium text-secondary-foreground">
              এই মাসে চাঁদা পরিশোধ
            </span>
            <span className="text-sm font-bold text-primary">
              {toBengaliDigits(paidCount)}/{toBengaliDigits(members.length)}
            </span>
          </div>
        )}

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
                  <p className="truncate text-sm font-semibold text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.position}
                    {member.phone ? ` • ${member.phone}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleStatus(member.id)}
                  className={cn(
                    'flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                    paid ? 'bg-secondary text-primary' : 'bg-accent/15 text-accent',
                  )}
                >
                  {paid ? (
                    <CheckCircle2 className="size-3.5" />
                  ) : (
                    <Clock className="size-3.5" />
                  )}
                  {paid ? 'পরিশোধিত' : 'বকেয়া'}
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(member.id, member.name)}
                  aria-label="সদস্য মুছুন"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            )
          })}

          {members.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              এখনো কোনো সদস্য যোগ করা হয়নি
            </li>
          )}
          {members.length > 0 && filtered.length === 0 && (
            <li className="rounded-2xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
              কোনো সদস্য পাওয়া যায়নি
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
