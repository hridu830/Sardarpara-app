'use client'

import { useEffect, useState } from 'react'
import { BottomNav, type Screen } from '@/components/bottom-nav'
import { DashboardScreen } from '@/components/screens/dashboard-screen'
import { MembersScreen } from '@/components/screens/members-screen'
import { TransactionScreen } from '@/components/screens/transaction-screen'
import { NamazScreen } from '@/components/screens/namaz-screen'
import { ReportScreen } from '@/components/screens/report-screen'
import {
  LEDGER_KEY,
  MEMBERS_KEY,
  type Transaction,
  type Member,
} from '@/lib/data'

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function MobileShell() {
  const [screen, setScreen] = useState<Screen>('home')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [loaded, setLoaded] = useState(false)

  // Load real saved data once, on the client only.
  useEffect(() => {
    try {
      const t = window.localStorage.getItem(LEDGER_KEY)
      setTransactions(t ? JSON.parse(t) : [])
      const m = window.localStorage.getItem(MEMBERS_KEY)
      setMembers(m ? JSON.parse(m) : [])
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

  function addTransaction(tx: Omit<Transaction, 'id'>) {
    setTransactions((prev) => [{ ...tx, id: uid() }, ...prev])
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
      {/* Phone frame */}
      <div className="relative flex h-dvh w-full max-w-md flex-col bg-background shadow-xl sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[2.5rem] sm:border sm:border-border">
        {/* Scrollable screen area */}
        <main className="flex-1 overflow-y-auto pb-6 sm:rounded-t-[2.5rem]">
          {screen === 'home' && (
            <DashboardScreen onNavigate={setScreen} transactions={transactions} />
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
          {screen === 'namaz' && <NamazScreen members={members} />}
          {screen === 'report' && <ReportScreen transactions={transactions} />}
        </main>

        {/* Bottom navigation */}
        <div className="shrink-0 sm:overflow-hidden sm:rounded-b-[2.5rem]">
          <BottomNav active={screen} onNavigate={setScreen} />
        </div>
      </div>
    </div>
  )
}
