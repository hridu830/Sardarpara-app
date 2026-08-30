'use client'

import { useState } from 'react'
import { BottomNav, type Screen } from '@/components/bottom-nav'
import { DashboardScreen } from '@/components/screens/dashboard-screen'
import { MembersScreen } from '@/components/screens/members-screen'
import { TransactionScreen } from '@/components/screens/transaction-screen'
import { NamazScreen } from '@/components/screens/namaz-screen'
import { ReportScreen } from '@/components/screens/report-screen'

export function MobileShell() {
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <div className="flex h-dvh justify-center bg-muted/40">
      {/* Phone frame */}
      <div className="relative flex h-dvh w-full max-w-md flex-col bg-background shadow-xl sm:my-4 sm:h-[calc(100dvh-2rem)] sm:rounded-[2.5rem] sm:border sm:border-border">
        {/* Scrollable screen area */}
        <main className="flex-1 overflow-y-auto pb-6 sm:rounded-t-[2.5rem]">
          {screen === 'home' && <DashboardScreen onNavigate={setScreen} />}
          {screen === 'members' && <MembersScreen />}
          {screen === 'transaction' && (
            <TransactionScreen onNavigate={setScreen} />
          )}
          {screen === 'namaz' && <NamazScreen />}
          {screen === 'report' && <ReportScreen />}
        </main>

        {/* Bottom navigation */}
        <div className="shrink-0 sm:overflow-hidden sm:rounded-b-[2.5rem]">
          <BottomNav active={screen} onNavigate={setScreen} />
        </div>
      </div>
    </div>
  )
}
