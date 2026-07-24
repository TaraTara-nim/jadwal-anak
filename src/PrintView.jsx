import React from 'react'
import { DAYS } from './constants'

export default function PrintView({ child, items }) {
  if (!child) return null

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
          {items
            .slice()
            .sort((a, b) => a.time.localeCompare(b.time))
            .map((item) => (
              <tr key={item.id}>
                <td>{item.time?.slice(0, 5)}</td>
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

      {items.length === 0 && <p>Belum ada kegiatan yang dijadwalkan.</p>}
    </div>
  )
}
