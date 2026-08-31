'use client'

import { useEffect, useRef, useState } from 'react'
import { BottomNav, type Screen } from '@/components/bottom-nav'
import { DashboardScreen } from '@/components/screens/dashboard-screen'
import { MembersScreen } from '@/components/screens/members-screen'
import { TransactionScreen } from '@/components/screens/transaction-screen'
import { NamazScreen } from '@/components/screens/namaz-screen'
import { ReportScreen } from '@/components/screens/report-screen'
import {
  LEDGER_KEY,
  MEMBERS_KEY,
  PRAYER_TIMES_KEY,
  NOTIF_ENABLED_KEY,
  defaultPrayerTimes,
  prayerLabels,
  type Transaction,
  type Member,
  type PrayerSchedule,
} from '@/lib/data'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function MobileShell() {
  const [screen, setScreen] = useState<Screen>('home')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [prayerTimes, setPrayerTimes] = useState<PrayerSchedule>(defaultPrayerTimes)
  const [notifEnabled, setNotifEnabled] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const firedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    try {
      const t = window.localStorage.getItem(LEDGER_KEY)
      setTransactions(t ? JSON.parse(t) : [])
      const m = window.localStorage.getItem(MEMBERS_KEY)
      setMembers(m ? JSON.parse(m) : [])
      const p = window.localStorage.getItem(PRAYER_TIMES_KEY)
      setPrayerTimes(p ? JSON.parse(p) : defaultPrayerTimes)
      const n = window.localStorage.getItem(NOTIF_ENABLED_KEY)
      setNotifEnabled(n === 'true')
    } catch (e) {
      console.error(e)
    }
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(LEDGER_KEY, JSON.stringify(transactions))
  }, [transactions, loaded])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(MEMBERS_KEY, JSON.stringify(members))
  }, [members, loaded])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(PRAYER_TIMES_KEY, JSON.stringify(prayerTimes))
  }, [prayerTimes, loaded])

  useEffect(() => {
    if (!loaded) return
    window.localStorage.setItem(NOTIF_ENABLED_KEY, String(notifEnabled))
  }, [notifEnabled, loaded])

  useEffect(() => {
    if (!loaded || !notifEnabled) return
    if (typeof window === 'undefined' || !('Notification' in window)) return

    const interval = setInterval(() => {
      if (Notification.permission !== 'granted') return
      const now = new Date()
      const hhmm = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`
      const todayKey = now.toISOString().slice(0, 10)

      ;(Object.keys(prayerTimes) as (keyof PrayerSchedule)[]).forEach((key) => {
        if (prayerTimes[key] === hhmm) {
          const fireKey = `${todayKey}-${key}`
          if (!firedRef.current.has(fireKey)) {
            firedRef.current.add(fireKey)
            new Notification('নামাজের সময় হয়েছে', {
              body: `${prayerLabels[key]}-এর সময় হয়েছে।`,
              icon: '/logo.png',
            })
          }
        }
      })
    }, 20_000)

    return () => clearInterval(interval)
  }, [loaded, notifEnabled, prayerTimes])

  function addTransaction(tx: Omit<Transaction, 'id'>) {
    setTransactions((prev) => [{ ...tx, id: uid() }, ...prev])
  }

  function removeTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  function addMember(m: Omit<Member, 'id'>) {
    setMembers((prev) => [...prev, { ...m, id: uid() }])
  }

  function removeMember(id: string) {
    setMembers((prev) => prev.filter((m) => m.id !== id))
  }

  function toggleMemberStatus(id: string) {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === 'paid' ? 'due' : 'paid' }
          : m,
      ),
    )
  }

  return (
    <div className="flex h-dvh justify-center bg-muted/40">
      <div className="relative flex h-dvh w-full max-w-md flex-col bg-background shadow-xl sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[2.5rem] sm:border sm:border-border">
        <main className="flex-1 overflow-y-auto pb-6 sm:rounded-t-[2.5rem]">
          {screen === 'home' && (
            <DashboardScreen
              onNavigate={setScreen}
              transactions={transactions}
              onDeleteTransaction={removeTransaction}
            />
          )}
          {screen === 'members' && (
            <MembersScreen
              members={members}
              onAddMember={addMember}
              onRemoveMember={removeMember}
              onToggleStatus={toggleMemberStatus}
            />
          )}
          {screen === 'transaction' && (
            <TransactionScreen onNavigate={setScreen} onSave={addTransaction} />
          )}
          {screen === 'namaz' && (
            <NamazScreen
              members={members}
              prayerTimes={prayerTimes}
              onUpdatePrayerTimes={setPrayerTimes}
              notifEnabled={notifEnabled}
              onToggleNotif={setNotifEnabled}
            />
          )}
          {screen === 'report' && <ReportScreen transactions={transactions} />}
        </main>

        <div className="shrink-0 sm:overflow-hidden sm:rounded-b-[2.5rem]">
          <BottomNav active={screen} onNavigate={setScreen} />
        </div>
      </div>
    </div>
  )
}
