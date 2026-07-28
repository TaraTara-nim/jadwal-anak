import React from 'react'
import { DAYS, formatFull } from './constants'
import WeeklyMatrix from './WeeklyMatrix'

export default function PrintView({ child, items, matrixWeekStart }) {
  if (!child) return null

  if (matrixWeekStart) {
    return (
      <div className="print-area">
        <div className="print-header">
          <span className="print-avatar">{child.avatar_emoji}</span>
          <h1>Papan Jadwal Mingguan {child.name}</h1>
        </div>
        <WeeklyMatrix items={items} weekStart={matrixWeekStart} />
      </div>
    )
  }

  const recurring = items.filter((i) => !i.event_date)
  const oneTime = items
    .filter((i) => i.event_date)
    .sort((a, b) => (a.event_date + a.time).localeCompare(b.event_date + b.time))

  return (
    <div className="print-area">
      <div className="print-header">
        <span className="print-avatar">{child.avatar_emoji}</span>
        <h1>Jadwal Harian {child.name}</h1>
      </div>

      <table className="print-table">
        <thead>
          <tr>
            <th>Jam</th>
            <th>Kegiatan</th>
            {DAYS.map((d) => (
              <th key={d.key}>{d.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {recurring
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((item) => (
              <tr key={item.id}>
                <td>{item.time?.slice(0, 5)}{item.end_time ? ` – ${item.end_time.slice(0, 5)}` : ''}</td>
                <td>
                  <span className="print-icon">{item.icon}</span> {item.title}
                </td>
                {DAYS.map((d) => (
                  <td key={d.key} className="print-check-cell">
                    {(item.days || []).includes(d.key) ? '☐' : ''}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      {recurring.length === 0 && <p>Belum ada kegiatan berulang yang dijadwalkan.</p>}

      {oneTime.length > 0 && (
        <>
          <h2 className="print-subheader">Kegiatan Khusus (Sekali Jadi)</h2>
          <table className="print-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Jam</th>
                <th>Kegiatan</th>
              </tr>
            </thead>
            <tbody>
              {oneTime.map((item) => (
                <tr key={item.id}>
                  <td>{formatFull(new Date(item.event_date + 'T00:00:00'))}</td>
                  <td>{item.time?.slice(0, 5)}{item.end_time ? ` – ${item.end_time.slice(0, 5)}` : ''}</td>
                  <td><span className="print-icon">{item.icon}</span> {item.title}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  )
}
