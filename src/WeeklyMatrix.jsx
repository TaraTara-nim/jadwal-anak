import React from 'react'
import { WEEK_ORDER, DAYS, addDays, isItemActiveOnDate } from './constants'

const PALETTE = ['#FFE1A8', '#B8E1FF', '#FFC2D1', '#C8F4DE', '#E3D4FF', '#FFD8B8', '#C7ECEE', '#F6D6AD']

function colorFor(key) {
  let hash = 0
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  return PALETTE[hash % PALETTE.length]
}

function parseHM(t) {
  const [h, m] = (t || '0:0').split(':').map(Number)
  return h + m / 60
}

export default function WeeklyMatrix({ items, weekStart, onPrint }) {
  const dates = WEEK_ORDER.map((_, idx) => addDays(weekStart, idx))

  let minHour = 7
  let maxHour = 18
  items.forEach((item) => {
    const start = parseHM(item.time)
    const end = item.end_time ? parseHM(item.end_time) : start + 1
    minHour = Math.min(minHour, Math.floor(start))
    maxHour = Math.max(maxHour, Math.ceil(end))
  })
  minHour = Math.max(0, minHour)
  maxHour = Math.min(24, Math.max(maxHour, minHour + 1))
  const hourCount = maxHour - minHour
  const hours = Array.from({ length: hourCount }, (_, i) => minHour + i)

  return (
    <div className="matrix-wrap">
      {onPrint && (
        <div className="matrix-toolbar">
          <button className="btn btn-ghost btn-small" onClick={() => onPrint(weekStart)}>
            🖨️ Cetak Papan Ini
          </button>
        </div>
      )}

      <div
        className="matrix-grid"
        style={{
          gridTemplateColumns: `64px repeat(7, 1fr)`,
          gridTemplateRows: `50px repeat(${hourCount}, 48px)`,
        }}
      >
        {dates.map((d, idx) => (
          <div key={idx} className="matrix-day-header" style={{ gridColumn: idx + 2, gridRow: 1 }}>
            <div className="matrix-day-name">{DAYS.find((x) => x.key === d.getDay()).label}</div>
            <div className="matrix-day-date">{d.getDate()}/{d.getMonth() + 1}</div>
          </div>
        ))}

        {hours.map((h, hIdx) => (
          <div key={h} className="matrix-hour-label" style={{ gridColumn: 1, gridRow: hIdx + 2 }}>
            {String(h).padStart(2, '0')}:00
          </div>
        ))}

        {hours.map((h, hIdx) =>
          dates.map((d, dIdx) => (
            <div
              key={`bg-${h}-${dIdx}`}
              className="matrix-cell-bg"
              style={{ gridColumn: dIdx + 2, gridRow: hIdx + 2 }}
            />
          ))
        )}

        {dates.map((d, dIdx) =>
          items
            .filter((item) => isItemActiveOnDate(item, d))
            .map((item) => {
              const start = parseHM(item.time)
              const end = item.end_time ? parseHM(item.end_time) : start + 1
              const rowStart = Math.max(0, Math.round(start - minHour)) + 2
              const rowEnd = Math.min(hourCount, Math.round(end - minHour)) + 2
              return (
                <div
                  key={item.id + '-' + dIdx}
                  className="matrix-block"
                  style={{
                    gridColumn: dIdx + 2,
                    gridRow: `${rowStart} / ${Math.max(rowStart + 1, rowEnd)}`,
                    background: colorFor(item.title + item.id),
                  }}
                >
                  <span className="matrix-block-icon">{item.icon}</span>
                  <span className="matrix-block-title">{item.title}</span>
                </div>
              )
            })
        )}
      </div>
    </div>
  )
}
