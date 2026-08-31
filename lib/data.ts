// Shared types and Bengali formatting helpers for the
// সর্দারপাড়া আমলে সালেহ যুব সংঘ app.
// Real data (transactions, members, prayer settings, admin PIN) lives in
// each device's localStorage — see the storage-key constants below.

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

// ---------------------------------------------------------------------------
// localStorage keys — single source of truth so every screen reads/writes
// the same place.
// ---------------------------------------------------------------------------
export const LEDGER_KEY = 'sardarpara-ledger'
export const MEMBERS_KEY = 'sardarpara-members'
export const ADMIN_PIN_KEY = 'sardarpara-admin-pin'
export const ADMIN_SESSION_KEY = 'sardarpara-ibadah-admin-session'
export const PRAYER_TIMES_KEY = 'sardarpara-prayer-times'
export const NOTIF_ENABLED_KEY = 'sardarpara-notif-enabled'

export type Hadith = {
  text: string
  source: string
}

/** General Hadiths in Bengali on charity, unity, kindness, and good deeds. */
export const hadiths: Hadith[] = [
  { text: 'প্রত্যেক ভালো কাজই সদকা।', source: 'সহীহ বুখারি' },
  { text: 'তোমরা পরস্পরকে ভালোবাসো, একে অপরের প্রতি দয়া করো ও সদয় হও।', source: 'সহীহ বুখারি' },
  { text: 'সদকা সম্পদ কমায় না।', source: 'সহীহ মুসলিম' },
  { text: 'মুমিনরা পরস্পরের জন্য একটি ইমারতের মতো, যার এক অংশ অপর অংশকে মজবুত করে।', source: 'সহীহ বুখারি' },
  { text: 'মানুষের মধ্যে সেই ব্যক্তি উত্তম, যে মানুষের সবচেয়ে বেশি উপকার করে।', source: 'তাবারানি' },
  { text: 'তুমি তোমার ভাইয়ের সাথে হাসিমুখে সাক্ষাৎ করা—এটিও একটি সদকা।', source: 'জামে তিরমিজি' },
  { text: 'দানকারী হাত গ্রহণকারী হাতের চেয়ে উত্তম।', source: 'সহীহ বুখারি' },
  { text: 'যে ব্যক্তি কোনো অভাবীর প্রয়োজন পূরণ করে, আল্লাহ তার প্রয়োজন পূরণ করেন।', source: 'সহীহ মুসলিম' },
  { text: 'মুমিন একে অপরের প্রতি দয়া ও ভালোবাসায় একটি দেহের মতো—একটি অঙ্গ কষ্ট পেলে সারা দেহ জ্বরে অস্থির হয়ে পড়ে।', source: 'সহীহ মুসলিম' },
  { text: 'যে আল্লাহতে ও শেষ দিবসে বিশ্বাস করে, সে যেন তার প্রতিবেশীর সাথে ভালো ব্যবহার করে।', source: 'সহীহ বুখারি' },
  { text: 'তোমাদের মধ্যে সে-ই উত্তম, যে তার পরিবারের কাছে উত্তম।', source: 'জামে তিরমিজি' },
  { text: 'নিশ্চয় আল্লাহ সকল বিষয়ে দয়া ও উত্তম আচরণ পছন্দ করেন।', source: 'সহীহ মুসলিম' },
  { text: 'যে ব্যক্তি একটি এতিমের ভরণপোষণ করে, জান্নাতে আমি ও সে এভাবে থাকব—এই বলে তিনি তাঁর দুই আঙুল একত্র করে দেখালেন।', source: 'সহীহ বুখারি' },
  { text: 'মুসলিম তো সে-ই, যার হাত ও জিহ্বা থেকে অন্য মুসলিমরা নিরাপদ থাকে।', source: 'সহীহ বুখারি' },
  { text: 'সৎ কাজে সাহায্যকারী নিজেও সেই সৎ কাজের সওয়াব পায়।', source: 'সহীহ মুসলিম' },
  { text: 'আল্লাহর কাছে সবচেয়ে প্রিয় ব্যক্তি সে, যে মানুষের সবচেয়ে বেশি উপকার করে।', source: 'তাবারানি' },
]

/** Return a random Hadith from the list. */
export function getRandomHadith(): Hadith {
  return hadiths[Math.floor(Math.random() * hadiths.length)]
}

/** Hadiths specifically about Salah (prayer) for the Namaz tracker. */
export const salahHadiths: Hadith[] = [
  { text: 'বান্দার হিসাব-নিকাশে সর্বপ্রথম নামাজের হিসাব নেওয়া হবে।', source: 'জামে তিরমিজি' },
  { text: 'জামাতে নামাজ একাকী নামাজের চেয়ে সাতাশ গুণ বেশি ফজিলতপূর্ণ।', source: 'সহীহ বুখারি' },
  { text: 'নামাজ দ্বীনের স্তম্ভ; যে তা কায়েম করল, সে দ্বীন কায়েম করল।', source: 'বায়হাকি' },
  { text: 'দুই ব্যক্তির চোখ জাহান্নামের আগুন স্পর্শ করবে না—যে আল্লাহর ভয়ে কাঁদে।', source: 'জামে তিরমিজি' },
  { text: 'তোমাদের নামাজের সময় হলে একজন যেন আজান দেয় ও বড় ব্যক্তি ইমামতি করে।', source: 'সহীহ বুখারি' },
  { text: 'নামাজ মুমিনের জন্য নূর।', source: 'সহীহ মুসলিম' },
  { text: 'পাঁচ ওয়াক্ত নামাজ এমন, যেমন কারো ঘরের সামনে দিয়ে বহমান নদীতে সে দিনে পাঁচবার গোসল করে—তার শরীরে কি ময়লা থাকতে পারে?', source: 'সহীহ বুখারি' },
  { text: 'কিয়ামতের দিন সর্বপ্রথম বান্দার আমলের মধ্যে নামাজের হিসাব নেওয়া হবে; তা ঠিক থাকলে বাকি সব আমল ঠিক থাকবে।', source: 'জামে তিরমিজি' },
  { text: 'যে ব্যক্তি ফজরের নামাজ জামাতে আদায় করল, সে যেন সারা রাত নামাজ পড়ল।', source: 'সহীহ মুসলিম' },
  { text: 'নামাজে দাঁড়ানোর সময় কাতার সোজা করা নামাজ পরিপূর্ণ হওয়ার অংশ।', source: 'সহীহ বুখারি' },
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
  /** ISO date, yyyy-mm-dd */
  date: string
  dateLabel: string
}

export type PaymentStatus = 'paid' | 'due'

export type Member = {
  id: string
  name: string
  position: string
  phone: string
  status: PaymentStatus
}

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

export type PrayerAttendance = 'jamaat' | 'alone' | 'missed'

export type IbadahSubmission = {
  id: string
  taskId: string
  memberName: string
  date: string
  status: SubmissionStatus
  points: number
  attendance?: PrayerAttendance
}

/** Default daily prayer time schedule — admin can edit these in নামাজ tab. */
export type PrayerSchedule = {
  fajr: string
  dhuhr: string
  asr: string
  maghrib: string
  isha: string
}

export const defaultPrayerTimes: PrayerSchedule = {
  fajr: '05:00',
  dhuhr: '13:15',
  asr: '16:30',
  maghrib: '18:15',
  isha: '19:45',
}

export const prayerLabels: Record<keyof PrayerSchedule, string> = {
  fajr: 'ফজর',
  dhuhr: 'যোহর',
  asr: 'আসর',
  maghrib: 'মাগরিব',
  isha: 'এশা',
}
