export const ICONS = [
  '☀️', '🪥', '🍳', '👕', '🎒', '🚌', '📚', '✏️',
  '🍎', '🥪', '🎨', '⚽', '🎹', '🧩', '🛁', '🍽️',
  '📖', '😴', '🦷', '🧸', '🚲', '🏊', '🎵', '💤',
]

export const DAYS = [
  { key: 0, label: 'Min' },
  { key: 1, label: 'Sen' },
  { key: 2, label: 'Sel' },
  { key: 3, label: 'Rab' },
  { key: 4, label: 'Kam' },
  { key: 5, label: 'Jum' },
  { key: 6, label: 'Sab' },
]

export const AVATAR_COLORS = [
  { name: 'Jingga', value: '#FF8A5B' },
  { name: 'Biru', value: '#4EA8DE' },
  { name: 'Hijau', value: '#6BCB77' },
  { name: 'Kuning', value: '#FFC93C' },
  { name: 'Pink', value: '#FF6FA0' },
  { name: 'Ungu', value: '#9B5DE5' },
]

export const AVATAR_EMOJIS = ['🦁', '🐼', '🐰', '🦊', '🐸', '🦄', '🐢', '🐧']

export function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export function todayDow() {
  return new Date().getDay()
}

export function toISODate(date) {
  return date.toISOString().slice(0, 10)
}

export function startOfWeekMonday(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = (day === 0 ? -6 : 1) - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export function endOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

export function addMonths(date, n) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1)
}

export function formatShort(date) {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

export function formatFull(date) {
  return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatMonthYear(date) {
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })
}

// Days ordered Senin -> Minggu for weekly/monthly tables (DAYS above is Minggu-first, JS getDay convention)
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]
