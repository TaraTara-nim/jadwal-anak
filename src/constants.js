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
