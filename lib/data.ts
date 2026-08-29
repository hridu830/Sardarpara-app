// Shared mock data, types, and Bengali formatting helpers for the
// সর্দারপাড়া আমলে সালেহ যুব সংঘ app.

const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

/** Convert an ASCII number/string into Bengali numerals. */
export function toBengaliDigits(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => bengaliDigits[Number(d)])
}

/** Format an amount as Bengali currency, e.g. ৳১৫,০০০ */
export function formatTaka(amount: number): string {
  const grouped = Math.abs(amount).toLocaleString('en-IN')
  return `৳${toBengaliDigits(grouped)}`
}

/** Format a signed amount, e.g. +৳৫০০ / -৳২,০০০ */
export function formatSignedTaka(amount: number): string {
  const sign = amount < 0 ? '-' : '+'
  return `${sign}${formatTaka(amount)}`
}

export const summary = {
  totalFund: 15000,
  totalExpense: 8000,
  balance: 7000,
}

export type Hadith = {
  text: string
  source: string
}

/** Authentic short Hadiths in Bengali on charity, unity, and good deeds. */
export const hadiths: Hadith[] = [
  {
    text: 'প্রত্যেক ভালো কাজই সদকা।',
    source: 'সহীহ বুখারি',
  },
  {
    text: 'তোমরা পরস্পরকে ভালোবাসো, একে অপরের প্রতি দয়া করো ও সদয় হও।',
    source: 'সহীহ বুখারি',
  },
  {
    text: 'সদকা সম্পদ কমায় না।',
    source: 'সহীহ মুসলিম',
  },
  {
    text: 'মুমিনরা পরস্পরের জন্য একটি ইমারতের মতো, যার এক অংশ অপর অংশকে মজবুত করে।',
    source: 'সহীহ বুখারি',
  },
  {
    text: 'মানুষের মধ্যে সেই ব্যক্তি উত্তম, যে মানুষের সবচেয়ে বেশি উপকার করে।',
    source: 'তাবারানি',
  },
  {
    text: 'তুমি তোমার ভাইয়ের সাথে হাসিমুখে সাক্ষাৎ করা—এটিও একটি সদকা।',
    source: 'জামে তিরমিজি',
  },
  {
    text: 'দানকারী হাত গ্রহণকারী হাতের চেয়ে উত্তম।',
    source: 'সহীহ বুখারি',
  },
  {
    text: 'যে ব্যক্তি কোনো অভাবীর প্রয়োজন পূরণ করে, আল্লাহ তার প্রয়োজন পূরণ করেন।',
    source: 'সহীহ মুসলিম',
  },
]

/** Return a random Hadith from the list. */
export function getRandomHadith(): Hadith {
  return hadiths[Math.floor(Math.random() * hadiths.length)]
}

/** Hadiths specifically about Salah (prayer) for the Namaz tracker. */
export const salahHadiths: Hadith[] = [
  {
    text: 'বান্দার হিসাব-নিকাশে সর্বপ্রথম নামাজের হিসাব নেওয়া হবে।',
    source: 'জামে তিরমিজি',
  },
  {
    text: 'জামাতে নামাজ একাকী নামাজের চেয়ে সাতাশ গুণ বেশি ফজিলতপূর্ণ।',
    source: 'সহীহ বুখারি',
  },
  {
    text: 'নামাজ দ্বীনের স্তম্ভ; যে তা কায়েম করল, সে দ্বীন কায়েম করল।',
    source: 'বায়হাকি',
  },
  {
    text: 'দুই ব্যক্তির চোখ জাহান্নামের আগুন স্পর্শ করবে না—যে আল্লাহর ভয়ে কাঁদে।',
    source: 'জামে তিরমিজি',
  },
  {
    text: 'তোমাদের নামাজের সময় হলে একজন যেন আজান দেয় ও বড় ব্যক্তি ইমামতি করে।',
    source: 'সহীহ বুখারি',
  },
]

export function getRandomSalahHadith(): Hadith {
  return salahHadiths[Math.floor(Math.random() * salahHadiths.length)]
}

export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha'

export type PrayerStatus = 'jamaat' | 'alone' | 'missed'

export type Prayer = {
  key: PrayerKey
  name: string
  time: string
}

/** The five daily prayers with Bengali names and times. */
export const prayers: Prayer[] = [
  { key: 'fajr', name: 'ফজর', time: 'ভোর ৫:১০' },
  { key: 'dhuhr', name: 'যোহর', time: 'দুপুর ১:১৫' },
  { key: 'asr', name: 'আসর', time: 'বিকাল ৪:৩০' },
  { key: 'maghrib', name: 'মাগরিব', time: 'সন্ধ্যা ৬:১৫' },
  { key: 'isha', name: 'এশা', time: 'রাত ৭:৪৫' },
]

/** Options a member can log for each prayer. */
export const prayerStatusOptions: { key: PrayerStatus; label: string }[] = [
  { key: 'jamaat', label: 'জামাতে' },
  { key: 'alone', label: 'একাকী' },
  { key: 'missed', label: 'পড়া হয়নি' },
]

export const salahMonthly = {
  jamaatCount: 120,
  totalWaqt: 150,
  /** Next upcoming prayer for the "current prayer time" banner. */
  nextPrayer: { name: 'আসর', time: 'বিকাল ৪:৩০', remaining: 'বাকি ৩৫ মিনিট' },
}

export type LeaderboardEntry = {
  id: string
  name: string
  position: string
  jamaatWaqt: number
}

/** Members who completed all prayers in congregation this month. */
export const salahLeaderboard: LeaderboardEntry[] = [
  { id: 'm2', name: 'মোঃ রহিম উদ্দিন', position: 'সাধারণ সম্পাদক', jamaatWaqt: 150 },
  { id: 'm1', name: 'মোঃ আব্দুল করিম', position: 'সভাপতি', jamaatWaqt: 148 },
  { id: 'm7', name: 'মোঃ শাহীন আলম', position: 'সহ-সভাপতি', jamaatWaqt: 145 },
  { id: 'm6', name: 'মোঃ নাসির উদ্দিন', position: 'সদস্য', jamaatWaqt: 141 },
  { id: 'm4', name: 'মোঃ সেলিম রেজা', position: 'সদস্য', jamaatWaqt: 138 },
]

export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  title: string
  category: string
  amount: number
  type: TransactionType
  date: string
}

export const recentTransactions: Transaction[] = [
  {
    id: 't1',
    title: 'মসজিদ সংস্কার',
    category: 'মসজিদ',
    amount: -2000,
    type: 'expense',
    date: '২৭ আগস্ট, ২০২৬',
  },
  {
    id: 't2',
    title: 'হাদিয়া (করিম)',
    category: 'হাদিয়া',
    amount: 500,
    type: 'income',
    date: '২৬ আগস্ট, ২০২৬',
  },
  {
    id: 't3',
    title: 'মাসিক চাঁদা (রহিম)',
    category: 'চাঁদা',
    amount: 1000,
    type: 'income',
    date: '২৫ আগস্ট, ২০২৬',
  },
  {
    id: 't4',
    title: 'রাস্তা মেরামত',
    category: 'রাস্তা',
    amount: -1500,
    type: 'expense',
    date: '২২ আগস্ট, ২০২৬',
  },
  {
    id: 't5',
    title: 'গরিব সাহায্য তহবিল',
    category: 'সাহায্য',
    amount: -800,
    type: 'expense',
    date: '২০ আগস্ট, ২০২৬',
  },
  {
    id: 't6',
    title: 'হাদিয়া (জামাল)',
    category: 'হাদিয়া',
    amount: 700,
    type: 'income',
    date: '১৮ আগস্ট, ২০২৬',
  },
]

export type PaymentStatus = 'paid' | 'due'

export type Member = {
  id: string
  name: string
  position: string
  status: PaymentStatus
}

export const members: Member[] = [
  { id: 'm1', name: 'মোঃ আব্দুল করিম', position: 'সভাপতি', status: 'paid' },
  { id: 'm2', name: 'মোঃ রহিম উদ্দিন', position: 'সাধারণ সম্পাদক', status: 'paid' },
  { id: 'm3', name: 'মোঃ জামাল হোসেন', position: 'ক্যাশিয়ার', status: 'due' },
  { id: 'm4', name: 'মোঃ সেলিম রেজা', position: 'সদস্য', status: 'paid' },
  { id: 'm5', name: 'মোঃ ফারুক আহমেদ', position: 'সদস্য', status: 'due' },
  { id: 'm6', name: 'মোঃ নাসির উদ্দিন', position: 'সদস্য', status: 'paid' },
  { id: 'm7', name: 'মোঃ শাহীন আলম', position: 'সহ-সভাপতি', status: 'paid' },
  { id: 'm8', name: 'মোঃ বেলাল হোসেন', position: 'সদস্য', status: 'due' },
]

export const categories = [
  'মসজিদ',
  'রাস্তা',
  'সাহায্য',
  'চাঁদা',
  'হাদিয়া',
  'অন্যান্য',
]

export type ReportSlice = {
  label: string
  value: number
  fill: string
}

export const expenseByCategory: ReportSlice[] = [
  { label: 'মসজিদ', value: 3500, fill: 'var(--color-mosque)' },
  { label: 'রাস্তা', value: 2200, fill: 'var(--color-road)' },
  { label: 'সাহায্য', value: 1500, fill: 'var(--color-help)' },
  { label: 'অন্যান্য', value: 800, fill: 'var(--color-other)' },
]

// ---------------------------------------------------------------------------
// নামাজ / ইবাদত টাস্ক ও পুরস্কার সিস্টেম
// ---------------------------------------------------------------------------

export type TaskCategory = 'salah' | 'roza' | 'quran' | 'other'

export const taskCategoryLabels: Record<TaskCategory, string> = {
  salah: 'নামাজ',
  roza: 'রোজা',
  quran: 'কুরআন তিলাওয়াত',
  other: 'অন্যান্য আমল',
}

export type IbadahTask = {
  id: string
  title: string
  category: TaskCategory
  points: number
}

/** Starter set of tasks — admin can add/edit/remove more from the app. */
export const defaultIbadahTasks: IbadahTask[] = [
  { id: 'fajr', title: 'ফজর জামাতে আদায়', category: 'salah', points: 10 },
  { id: 'dhuhr', title: 'যোহর জামাতে আদায়', category: 'salah', points: 10 },
  { id: 'asr', title: 'আসর জামাতে আদায়', category: 'salah', points: 10 },
  { id: 'maghrib', title: 'মাগরিব জামাতে আদায়', category: 'salah', points: 10 },
  { id: 'isha', title: 'এশা জামাতে আদায়', category: 'salah', points: 10 },
  { id: 'roza', title: 'আজকের রোজা রাখা', category: 'roza', points: 20 },
  { id: 'tarabih', title: 'তারাবীহ নামাজ আদায়', category: 'roza', points: 15 },
  {
    id: 'quran',
    title: 'কুরআন তিলাওয়াত (কমপক্ষে ১ পৃষ্ঠা)',
    category: 'quran',
    points: 10,
  },
]

export type SubmissionStatus = 'pending' | 'approved' | 'rejected'

export type IbadahSubmission = {
  id: string
  taskId: string
  memberName: string
  date: string
  status: SubmissionStatus
  points: number
}

export const ADMIN_PIN = '2580'
