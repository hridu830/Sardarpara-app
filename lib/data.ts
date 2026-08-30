// Shared mock-free data, types, and Bengali formatting helpers for the
// সর্দারপাড়া আমলে সালেহ যুব সংঘ app. All amounts/lists start empty —
// real data should be added by the club as it happens.

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
  totalFund: 0,
  totalExpense: 0,
  balance: 0,
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

export type TransactionType = 'income' | 'expense'

export type Transaction = {
  id: string
  title: string
  category: string
  amount: number
  type: TransactionType
  date: string
}

/** No transactions yet — the club hasn't started recording anything. */
export const recentTransactions: Transaction[] = []

export type PaymentStatus = 'paid' | 'due'

export type Member = {
  id: string
  name: string
  position: string
  status: PaymentStatus
}

/** No members added yet — add real members from the সদস্য tab. */
export const members: Member[] = []

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

/** No expenses recorded yet. */
export const expenseByCategory: ReportSlice[] = []

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
