import type { Metadata } from 'next'
import { Hind_Siliguri } from 'next/font/google'
import './globals.css'

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-bengali',
})

export const metadata: Metadata = {
  title: 'সর্দারপাড়া আমলে সালেহ্ যুব সংঘ',
  description: 'সর্দারপাড়া আমলে সালেহ্ যুব সংঘের তহবিল ও সদস্য ব্যবস্থাপনা',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="bn">
      <body className={`${hindSiliguri.variable} font-sans antialiased bg-background`}>
        {children}
      </body>
    </html>
  )
}
