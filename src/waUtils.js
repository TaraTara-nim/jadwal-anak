import { DAYS, WEEK_ORDER } from './constants'

function dayLabels(days) {
  return WEEK_ORDER
    .filter((d) => (days || []).includes(d))
    .map((d) => DAYS.find((x) => x.key === d).label)
    .join(', ')
}

function timeRange(item) {
  return item.time?.slice(0, 5) + (item.end_time ? ` – ${item.end_time.slice(0, 5)}` : '')
}

export function buildScheduleText(child, items) {
  const recurring = items.filter((i) => !i.event_date).slice().sort((a, b) => a.time.localeCompare(b.time))
  const oneTime = items
    .filter((i) => i.event_date)
    .slice()
    .sort((a, b) => (a.event_date + a.time).localeCompare(b.event_date + b.time))

  let text = `*Jadwal Harian ${child.name}* ${child.avatar_emoji}\n\n`

  if (recurring.length) {
    text += `📅 *Berulang tiap minggu*\n`
    for (const item of recurring) {
      text += `• ${item.icon} ${timeRange(item)} ${item.title} (${dayLabels(item.days)})\n`
    }
    text += `\n`
  }

  if (oneTime.length) {
    text += `📌 *Kegiatan Khusus*\n`
    for (const item of oneTime) {
      const dateStr = new Date(item.event_date + 'T00:00:00').toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
      })
      text += `• ${item.icon} ${dateStr}, ${timeRange(item)} ${item.title}\n`
    }
  }

  if (!recurring.length && !oneTime.length) {
    text += 'Belum ada kegiatan yang dijadwalkan.'
  }

  return text.trim()
}
