'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  BellRing,
  Quote,
  Trophy,
  Award,
  Lock,
  Unlock,
  ShieldCheck,
  KeyRound,
  Plus,
  Trash2,
  Check,
  X,
  ClipboardList,
  Clock,
  Bell,
  BellOff,
} from 'lucide-react'
import { ScreenHeader } from '@/components/screen-header'
import {
  getRandomSalahHadith,
  salahHadiths,
  defaultIbadahTasks,
  taskCategoryLabels,
  toBengaliDigits,
  ADMIN_PIN_KEY,
  prayerLabels,
  type Hadith,
  type IbadahTask,
  type IbadahSubmission,
  type TaskCategory,
  type PrayerAttendance,
  type PrayerSchedule,
  type Member,
} from '@/lib/data'
import { cn } from '@/lib/utils'

const TASKS_KEY = 'sardarpara-ibadah-tasks'
const SUBMISSIONS_KEY = 'sardarpara-ibadah-submissions'
const ADMIN_SESSION_KEY = 'sardarpara-ibadah-admin-session'
const MEMBER_KEY = 'sardarpara-ibadah-current-member'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function todayISO() {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const statusLabel: Record<
  IbadahSubmission['status'],
  { text: string; className: string }
> = {
  pending: { text: 'অপেক্ষমান', className: 'bg-muted text-muted-foreground' },
  approved: { text: 'অনুমোদিত', className: 'bg-secondary text-primary' },
  rejected: { text: 'প্রত্যাখ্যাত', className: 'bg-destructive/10 text-destructive' },
}

const attendanceLabel: Record<PrayerAttendance, string> = {
  jamaat: 'জামাতে আদায়',
  alone: 'একাকী আদায়',
  missed: 'আদায় হয়নি',
}

export function NamazScreen({
  members,
  prayerTimes,
  onUpdatePrayerTimes,
  notifEnabled,
  onToggleNotif,
}: {
  members: Member[]
  prayerTimes: PrayerSchedule
  onUpdatePrayerTimes: (p: PrayerSchedule) => void
  notifEnabled: boolean
  onToggleNotif: (v: boolean) => void
}) {
  const [hadith, setHadith] = useState<Hadith>(salahHadiths[0])

  const [tasks, setTasks] = useState<IbadahTask[]>(defaultIbadahTasks)
  const [submissions, setSubmissions] = useState<IbadahSubmission[]>([])
  const [isAdmin, setIsAdmin] = useState(false)
  const [hasPin, setHasPin] = useState(false)
  const [currentMember, setCurrentMember] = useState<string>('')
  const [today, setToday] = useState('')
  const [loaded, setLoaded] = useState(false)

  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState<TaskCategory>('other')
  const [newPoints, setNewPoints] = useState('10')

  const [showPinEntry, setShowPinEntry] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [pinError, setPinError] = useState('')

  const [showChangePin, setShowChangePin] = useState(false)
  const [oldPinInput, setOldPinInput] = useState('')
  const [newPinInput, setNewPinInput] = useState('')
  const [newPinConfirm, setNewPinConfirm] = useState('')
  const [changePinError, setChangePinError] = useState('')

  const [editingTimes, setEditingTimes] = useState<PrayerSchedule>(prayerTimes)

  useEffect(() => {
    setHadith(getRandomSalahHadith())
    setToday(todayISO())
    try {
      const t = window.localStorage.getItem(TASKS_KEY)
      setTasks(t ? JSON.parse(t) : defaultIbadahTasks)
      const s = window.localStorage.getItem(SUBMISSIONS_KEY)
      setSubmissions(s ? JSON.parse(s) : [])
      const a = window.localStorage.getItem(ADMIN_SESSION_KEY)
      setIsAdmin(a === 'true')
      setHasPin(!!window.localStorage.getItem(ADMIN_PIN_KEY))
      const m = window.localStorage.getItem(MEMBER_KEY)
      setCurrentMember(m || '')
    } catch (e) {
      console.error(e)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    setEditingTimes(prayerTimes)
  }, [prayerTimes])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks, loaded])
  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions))
  }, [submissions, loaded])
  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(ADMIN_SESSION_KEY, String(isAdmin))
  }, [isAdmin, loaded])
  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(MEMBER_KEY, currentMember)
  }, [currentMember, loaded])

  // Pick a default "who am I" once members list is available.
  useEffect(() => {
    if (!loaded) return
    if (!currentMember && members.length > 0) {
      setCurrentMember(members[0].name)
    }
  }, [loaded, members, currentMember])

  const submissionsByTask = useMemo(() => {
    const map: Record<string, IbadahSubmission> = {}
    submissions
      .filter((s) => s.date === today && s.memberName === currentMember)
      .forEach((s) => (map[s.taskId] = s))
    return map
  }, [submissions, today, currentMember])

  const pendingSubmissions = useMemo(
    () => submissions.filter((s) => s.status === 'pending'),
    [submissions],
  )

  const leaderboard = useMemo(() => {
    const monthPrefix = today.slice(0, 7)
    const totals: Record<string, number> = {}
    submissions
      .filter((s) => s.status === 'approved' && s.date.startsWith(monthPrefix))
      .forEach((s) => {
        totals[s.memberName] = (totals[s.memberName] || 0) + s.points
      })
    return Object.entries(totals)
      .map(([name, points]) => ({ name, points }))
      .sort((a, b) => b.points - a.points)
  }, [submissions, today])

  function taskTitle(taskId: string) {
    return tasks.find((t) => t.id === taskId)?.title || 'অজানা টাস্ক'
  }

  function upsertSubmission(task: IbadahTask, attendance?: PrayerAttendance) {
    if (!currentMember) return
    const existing = submissionsByTask[task.id]
    if (existing && existing.status !== 'pending') return // locked once decided

    const points =
      attendance === 'jamaat'
        ? task.points
        : attendance === 'alone'
          ? Math.round(task.points / 2)
          : attendance === 'missed'
            ? 0
            : task.points

    if (existing) {
      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === existing.id ? { ...s, attendance, points } : s,
        ),
      )
    } else {
      setSubmissions((prev) => [
        ...prev,
        {
          id: uid(),
          taskId: task.id,
          memberName: currentMember,
          date: today,
          status: 'pending',
          points,
          attendance,
        },
      ])
    }
  }

  function decide(id: string, status: 'approved' | 'rejected') {
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s)),
    )
  }

  function addTask() {
    const title = newTitle.trim()
    if (!title) return
    setTasks((prev) => [
      ...prev,
      { id: uid(), title, category: newCategory, points: Number(newPoints) || 0 },
    ])
    setNewTitle('')
    setNewPoints('10')
  }

  function updateTaskPoints(id: string, points: number) {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, points } : t)))
  }

  function deleteTask(id: string) {
    if (!confirm('এই টাস্কটি মুছে ফেলতে চান?')) return
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  function handleAdminButtonClick() {
    if (isAdmin) {
      setIsAdmin(false)
      return
    }
    setPinInput('')
    setPinConfirm('')
    setPinError('')
    setShowPinEntry(true)
  }

  function submitPin() {
    if (!hasPin) {
      // First-time setup — the person who does this becomes the one admin.
      if (pinInput.length < 4) {
        setPinError('কমপক্ষে ৪ ডিজিটের পিন দিন')
        return
      }
      if (pinInput !== pinConfirm) {
        setPinError('দুটো পিন মিলছে না')
        return
      }
      window.localStorage.setItem(ADMIN_PIN_KEY, pinInput)
      setHasPin(true)
      setIsAdmin(true)
      setShowPinEntry(false)
      return
    }

    const stored = window.localStorage.getItem(ADMIN_PIN_KEY)
    if (pinInput === stored) {
      setIsAdmin(true)
      setShowPinEntry(false)
    } else {
      setPinError('পিনটি সঠিক নয়, আবার চেষ্টা করুন')
    }
  }

  function submitChangePin() {
    const stored = window.localStorage.getItem(ADMIN_PIN_KEY)
    if (oldPinInput !== stored) {
      setChangePinError('বর্তমান পিন সঠিক নয়')
      return
    }
    if (newPinInput.length < 4) {
      setChangePinError('নতুন পিন কমপক্ষে ৪ ডিজিট হতে হবে')
      return
    }
    if (newPinInput !== newPinConfirm) {
      setChangePinError('নতুন পিন দুটো মিলছে না')
      return
    }
    window.localStorage.setItem(ADMIN_PIN_KEY, newPinInput)
    setShowChangePin(false)
    setOldPinInput('')
    setNewPinInput('')
    setNewPinConfirm('')
    setChangePinError('')
  }

  async function handleNotifToggle() {
    if (notifEnabled) {
      onToggleNotif(false)
      return
    }
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        onToggleNotif(true)
      } else {
        alert('নোটিফিকেশনের অনুমতি দেওয়া হয়নি — ব্রাউজার সেটিংস থেকে অনুমতি দিন।')
      }
    } else {
      alert('আপনার ব্রাউজার নোটিফিকেশন সাপোর্ট করে না।')
    }
  }

  function savePrayerTimes() {
    onUpdatePrayerTimes(editingTimes)
  }

  if (!loaded) {
    return (
      <div>
        <ScreenHeader title="নামাজ ও ইবাদত" subtitle="আজকের ইবাদত" />
        <p className="p-6 text-center text-sm text-muted-foreground">লোড হচ্ছে...</p>
      </div>
    )
  }

  return (
    <div>
      <ScreenHeader title="নামাজ ও ইবাদত" subtitle="আজকের আমল ও পুরস্কার" />

      <div className="space-y-5 p-4">
        {/* Daily Hadith + Admin toggle */}
        <section className="overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-sm">
          <div className="flex items-center justify-between gap-3 px-4 pt-4">
            <span className="flex items-center gap-1.5 rounded-full bg-primary-foreground/12 px-3 py-1.5 text-[12px] font-medium">
              <BellRing className="size-4 text-accent" />
              আজকের হাদিস
            </span>
            <button
              type="button"
              onClick={handleAdminButtonClick}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors',
                isAdmin
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-primary-foreground/12 text-primary-foreground/80',
              )}
            >
              {isAdmin ? <Unlock className="size-3.5" /> : <Lock className="size-3.5" />}
              {isAdmin ? 'এডমিন মোড চালু' : 'এডমিন মোড'}
            </button>
          </div>

          <figure className="mt-4 flex gap-2.5 border-t border-primary-foreground/15 bg-primary-foreground/5 px-4 py-3">
            <Quote className="size-4 shrink-0 text-accent" aria-hidden="true" />
            <blockquote className="font-serif text-[14px] font-medium leading-relaxed text-balance">
              {`"${hadith.text}"`}
              <cite className="mt-0.5 block text-[11px] not-italic font-medium text-primary-foreground/60">
                — {hadith.source}
              </cite>
            </blockquote>
          </figure>
        </section>

        {/* PIN entry / first-time setup */}
        {showPinEntry && (
          <section className="rounded-2xl border border-accent/40 bg-accent/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <ShieldCheck className="size-4.5 text-accent" />
              <h2 className="text-[14px] font-bold text-foreground">
                {hasPin ? 'এডমিন পিন দিন' : 'প্রথমবার এডমিন পিন সেট করুন'}
              </h2>
            </div>
            {!hasPin && (
              <p className="mb-2 text-[11.5px] text-muted-foreground">
                যিনি প্রথম পিন সেট করবেন, তিনিই এই ডিভাইসে একমাত্র এডমিন/ক্যাশিয়ার হবেন। পিনটি মনে রাখুন — ভুলে গেলে পুনরুদ্ধারের উপায় নেই।
              </p>
            )}
            <div className="flex flex-col gap-2">
              <input
                type="password"
                inputMode="numeric"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value)
                  setPinError('')
                }}
                placeholder={hasPin ? '৪-৬ ডিজিট পিন' : 'নতুন পিন (কমপক্ষে ৪ ডিজিট)'}
                autoFocus
                className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
              />
              {!hasPin && (
                <input
                  type="password"
                  inputMode="numeric"
                  value={pinConfirm}
                  onChange={(e) => {
                    setPinConfirm(e.target.value)
                    setPinError('')
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && submitPin()}
                  placeholder="পিনটি আবার লিখুন"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
                />
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submitPin}
                  className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                >
                  {hasPin ? 'প্রবেশ' : 'পিন সেট করুন'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinEntry(false)}
                  className="shrink-0 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-muted-foreground"
                >
                  বাতিল
                </button>
              </div>
            </div>
            {pinError && (
              <p className="mt-2 text-[12px] font-medium text-destructive">{pinError}</p>
            )}
          </section>
        )}

        {/* Who am I */}
        <section className="rounded-2xl border border-border bg-card p-3.5">
          <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">
            আপনি কে? (নাম নির্বাচন করুন)
          </label>
          {members.length === 0 ? (
            <p className="text-[12.5px] text-muted-foreground">
              এখনো কোনো সদস্য যোগ করা হয়নি — আগে &quot;সদস্য&quot; ট্যাব থেকে সদস্য যোগ করুন।
            </p>
          ) : (
            <select
              value={currentMember}
              onChange={(e) => setCurrentMember(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none"
            >
              {members.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
        </section>

        {/* Prayer time settings + notification toggle */}
        <section className="rounded-2xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <Clock className="size-4.5 text-accent" />
            <h2 className="text-[15px] font-bold text-foreground">নামাজের সময় ও রিমাইন্ডার</h2>
          </div>

          {isAdmin ? (
            <div className="mb-3 grid grid-cols-2 gap-2">
              {(Object.keys(prayerLabels) as (keyof PrayerSchedule)[]).map((key) => (
                <label key={key} className="flex flex-col gap-1">
                  <span className="text-[11.5px] text-muted-foreground">{prayerLabels[key]}</span>
                  <input
                    type="time"
                    value={editingTimes[key]}
                    onChange={(e) =>
                      setEditingTimes((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm text-foreground outline-none"
                  />
                </label>
              ))}
              <button
                type="button"
                onClick={savePrayerTimes}
                className="col-span-2 mt-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground"
              >
                সময় সংরক্ষণ করুন
              </button>
            </div>
          ) : (
            <div className="mb-3 grid grid-cols-5 gap-1.5 text-center">
              {(Object.keys(prayerLabels) as (keyof PrayerSchedule)[]).map((key) => (
                <div key={key} className="rounded-lg bg-muted/50 py-1.5">
                  <p className="text-[10.5px] text-muted-foreground">{prayerLabels[key]}</p>
                  <p className="text-[12px] font-semibold text-foreground">
                    {toBengaliDigits(prayerTimes[key])}
                  </p>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleNotifToggle}
            className={cn(
              'flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold',
              notifEnabled
                ? 'bg-secondary text-primary'
                : 'border border-border bg-background text-muted-foreground',
            )}
          >
            {notifEnabled ? <Bell className="size-4" /> : <BellOff className="size-4" />}
            {notifEnabled ? 'রিমাইন্ডার চালু আছে' : 'রিমাইন্ডার চালু করুন'}
          </button>
          <p className="mt-2 text-[11px] text-muted-foreground">
            এই রিমাইন্ডার শুধু ব্রাউজারে এই পেজ/ট্যাব খোলা থাকা অবস্থায় কাজ করবে। ব্রাউজার সম্পূর্ণ বন্ধ থাকলে নোটিফিকেশন আসবে না।
          </p>
        </section>

        {/* Admin: change PIN */}
        {isAdmin && (
          <section className="rounded-2xl border border-border bg-card p-3.5">
            {!showChangePin ? (
              <button
                type="button"
                onClick={() => setShowChangePin(true)}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-2.5 text-sm font-semibold text-foreground"
              >
                <KeyRound className="size-4" />
                পিন পরিবর্তন করুন
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  type="password"
                  inputMode="numeric"
                  value={oldPinInput}
                  onChange={(e) => setOldPinInput(e.target.value)}
                  placeholder="বর্তমান পিন"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPinInput}
                  onChange={(e) => setNewPinInput(e.target.value)}
                  placeholder="নতুন পিন"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  value={newPinConfirm}
                  onChange={(e) => setNewPinConfirm(e.target.value)}
                  placeholder="নতুন পিন আবার লিখুন"
                  className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={submitChangePin}
                    className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground"
                  >
                    সংরক্ষণ করুন
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangePin(false)}
                    className="rounded-xl border border-border px-4 py-2.5 text-sm text-muted-foreground"
                  >
                    বাতিল
                  </button>
                </div>
                {changePinError && (
                  <p className="text-[12px] font-medium text-destructive">{changePinError}</p>
                )}
              </div>
            )}
          </section>
        )}

        {/* Admin: task management */}
        {isAdmin && (
          <section className="rounded-2xl border border-accent/40 bg-accent/5 p-4">
            <div className="mb-3 flex items-center gap-2">
              <ClipboardList className="size-4.5 text-accent" />
              <h2 className="text-[15px] font-bold text-foreground">টাস্ক ম্যানেজমেন্ট (এডমিন)</h2>
            </div>

            <ul className="mb-4 flex flex-col gap-2">
              {tasks.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-semibold text-foreground">{t.title}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {taskCategoryLabels[t.category]}
                      {t.category === 'salah' && ' • একাকী = অর্ধেক পয়েন্ট'}
                    </p>
                  </div>
                  <input
                    type="number"
                    min={0}
                    value={t.points}
                    onChange={(e) => updateTaskPoints(t.id, Number(e.target.value) || 0)}
                    className="w-16 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm text-foreground outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => deleteTask(t.id)}
                    aria-label="টাস্ক মুছুন"
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="rounded-xl border border-dashed border-border bg-card p-3">
              <p className="mb-2 text-[12px] font-semibold text-foreground">নতুন টাস্ক যুক্ত করুন</p>
              <div className="flex flex-col gap-2">
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="যেমন: সেহরি খাওয়া, তাহাজ্জুদ নামাজ"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
                />
                <div className="flex gap-2">
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TaskCategory)}
                    className="flex-1 rounded-lg border border-border bg-background px-2 py-2 text-sm text-foreground outline-none"
                  >
                    {Object.entries(taskCategoryLabels).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    min={0}
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    placeholder="পয়েন্ট"
                    className="w-20 rounded-lg border border-border bg-background px-2 py-2 text-center text-sm text-foreground outline-none"
                  />
                  <button
                    type="button"
                    onClick={addTask}
                    className="flex shrink-0 items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    <Plus className="size-4" />
                    যোগ
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Today's tasks */}
        <section>
          <h2 className="mb-3 text-[15px] font-bold text-foreground">
            আজকের ইবাদত ({currentMember || 'সদস্য নির্বাচন করুন'})
          </h2>
          <ul className="space-y-2.5">
            {tasks.map((task) => {
              const sub = submissionsByTask[task.id]
              const locked = sub && sub.status !== 'pending'

              return (
                <li
                  key={task.id}
                  className="rounded-2xl border border-border bg-card p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-foreground">
                        {task.title}
                      </p>
                      <p className="text-[11.5px] text-muted-foreground">
                        {taskCategoryLabels[task.category]} • {toBengaliDigits(task.points)} পয়েন্ট
                      </p>
                    </div>
                    {locked && (
                      <span
                        className={cn(
                          'shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
                          statusLabel[sub.status].className,
                        )}
                      >
                        {statusLabel[sub.status].text}
                      </span>
                    )}
                  </div>

                  {task.category === 'salah' ? (
                    <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                      {(['jamaat', 'alone', 'missed'] as PrayerAttendance[]).map((att) => {
                        const selected = sub?.attendance === att
                        return (
                          <button
                            key={att}
                            type="button"
                            disabled={!!locked || !currentMember}
                            onClick={() => upsertSubmission(task, att)}
                            className={cn(
                              'rounded-lg py-2 text-[11.5px] font-semibold transition-colors disabled:opacity-60',
                              selected
                                ? att === 'jamaat'
                                  ? 'bg-primary text-primary-foreground'
                                  : att === 'alone'
                                    ? 'bg-accent text-accent-foreground'
                                    : 'bg-destructive/15 text-destructive'
                                : 'bg-muted text-muted-foreground',
                            )}
                          >
                            {attendanceLabel[att]}
                          </button>
                        )
                      })}
                    </div>
                  ) : (
                    !sub && (
                      <button
                        type="button"
                        disabled={!currentMember}
                        onClick={() => upsertSubmission(task)}
                        className="mt-2.5 w-full rounded-lg bg-primary py-2 text-[12.5px] font-semibold text-primary-foreground disabled:opacity-60"
                      >
                        সম্পন্ন করেছি
                      </button>
                    )
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        {/* Admin: pending approvals */}
        {isAdmin && (
          <section>
            <h2 className="mb-3 text-[15px] font-bold text-foreground">
              অনুমোদনের অপেক্ষায় ({toBengaliDigits(pendingSubmissions.length)})
            </h2>
            {pendingSubmissions.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-card p-5 text-center text-[13px] text-muted-foreground">
                কোনো পেন্ডিং অনুরোধ নেই
              </p>
            ) : (
              <ul className="space-y-2">
                {pendingSubmissions.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13.5px] font-semibold text-foreground">
                        {s.memberName}
                      </p>
                      <p className="text-[11.5px] text-muted-foreground">
                        {taskTitle(s.taskId)}
                        {s.attendance && ` • ${attendanceLabel[s.attendance]}`} •{' '}
                        {toBengaliDigits(s.points)} পয়েন্ট
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => decide(s.id, 'approved')}
                      aria-label="অনুমোদন করুন"
                      className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary"
                    >
                      <Check className="size-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => decide(s.id, 'rejected')}
                      aria-label="প্রত্যাখ্যান করুন"
                      className="flex size-8 items-center justify-center rounded-full bg-destructive/10 text-destructive"
                    >
                      <X className="size-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Leaderboard */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <Trophy className="size-4.5 text-accent" />
            <h2 className="text-[15px] font-bold text-foreground">এই মাসের সেরা আমলকারী</h2>
          </div>
          <p className="mb-3 text-[12px] text-muted-foreground">
            এডমিন কর্তৃক অনুমোদিত পয়েন্ট অনুযায়ী — পুরস্কার কর্মসূচির জন্য।
          </p>
          {leaderboard.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-border bg-card p-5 text-center text-[13px] text-muted-foreground">
              এই মাসে এখনো কোনো অনুমোদিত পয়েন্ট নেই
            </p>
          ) : (
            <ul className="space-y-2">
              {leaderboard.map((entry, index) => {
                const rank = index + 1
                const topThree = rank <= 3
                return (
                  <li
                    key={entry.name}
                    className={cn(
                      'flex items-center gap-3 rounded-2xl border p-3',
                      topThree ? 'border-accent/30 bg-accent/5' : 'border-border bg-card',
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
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-semibold text-foreground">
                        {entry.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      {rank === 1 && <Award className="size-4 text-accent" />}
                      <span className="text-[14px] font-bold">{toBengaliDigits(entry.points)}</span>
                      <span className="text-[12px] text-muted-foreground">পয়েন্ট</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}              
