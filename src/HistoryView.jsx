import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import {
  DAYS,
  WEEK_ORDER,
  toISODate,
  startOfWeekMonday,
  addDays,
  startOfMonth,
  endOfMonth,
  addMonths,
  formatShort,
  formatFull,
  formatMonthYear,
  isItemActiveOnDate,
} from './constants'

export default function HistoryView({ child, items, onBack }) {
  const [mode, setMode] = useState('harian') // harian | mingguan | bulanan
  const [refDate, setRefDate] = useState(new Date())
  const [completionDates, setCompletionDates] = useState({}) // schedule_item_id -> Set of 'yyyy-mm-dd'
  const [loading, setLoading] = useState(false)

  // range to fetch depends on mode
  const range = useMemo(() => {
    if (mode === 'harian') {
      return { start: refDate, end: refDate }
    }
    if (mode === 'mingguan') {
      const start = startOfWeekMonday(refDate)
      return { start, end: addDays(start, 6) }
    }
    const start = startOfMonth(refDate)
    return { start, end: endOfMonth(refDate) }
  }, [mode, refDate])

  useEffect(() => {
    if (!items.length) {
      setCompletionDates({})
      return
    }
    loadCompletions()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range.start.getTime(), range.end.getTime(), items.length])

  async function loadCompletions() {
    setLoading(true)
    const { data } = await supabase
      .from('completions')
      .select('schedule_item_id, date')
      .in('schedule_item_id', items.map((i) => i.id))
      .gte('date', toISODate(range.start))
      .lte('date', toISODate(range.end))

    const map = {}
    for (const row of data || []) {
      if (!map[row.schedule_item_id]) map[row.schedule_item_id] = new Set()
      map[row.schedule_item_id].add(row.date)
    }
    setCompletionDates(map)
    setLoading(false)
  }

  function isDone(itemId, isoDate) {
    return completionDates[itemId]?.has(isoDate) || false
  }

  function shiftRef(delta) {
    if (mode === 'harian') setRefDate((d) => addDays(d, delta))
    else if (mode === 'mingguan') setRefDate((d) => addDays(d, delta * 7))
    else setRefDate((d) => addMonths(d, delta))
  }

  const sortedItems = items.slice().sort((a, b) => a.time.localeCompare(b.time))

  return (
    <div className="history-view">
      <div className="history-header">
        <button className="btn btn-ghost btn-small" onClick={onBack}>← Kembali</button>
        <div className="history-mode-switch">
          {['harian', 'mingguan', 'bulanan'].map((m) => (
            <button
              key={m}
              className={`mode-chip ${mode === m ? 'mode-chip-active' : ''}`}
              onClick={() => setMode(m)}
            >
              {m[0].toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="history-nav">
        <button className="btn btn-ghost btn-small" onClick={() => shiftRef(-1)}>‹</button>
        <span className="history-range-label">
          {mode === 'harian' && formatFull(refDate)}
          {mode === 'mingguan' && `${formatShort(range.start)} — ${formatShort(range.end)}`}
          {mode === 'bulanan' && formatMonthYear(refDate)}
        </span>
        <button className="btn btn-ghost btn-small" onClick={() => shiftRef(1)}>›</button>
      </div>

      {loading ? (
        <p className="empty-state">Memuat riwayat…</p>
      ) : sortedItems.length === 0 ? (
        <p className="empty-state">Belum ada kegiatan untuk {child.name}.</p>
      ) : mode === 'harian' ? (
        <DailyTable items={sortedItems} date={refDate} isDone={isDone} />
      ) : mode === 'mingguan' ? (
        <WeeklyTable items={sortedItems} weekStart={range.start} isDone={isDone} />
      ) : (
        <MonthlyTable items={sortedItems} monthStart={range.start} monthEnd={range.end} isDone={isDone} />
      )}
    </div>
  )
}

function DailyTable({ items, date, isDone }) {
  const isoDate = toISODate(date)
  const applicable = items.filter((i) => isItemActiveOnDate(i, date))
  if (applicable.length === 0) {
    return <p className="empty-state">Tidak ada kegiatan terjadwal di hari ini.</p>
  }
  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Jam</th>
          <th>Kegiatan</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {applicable.map((item) => (
          <tr key={item.id}>
            <td>{item.time?.slice(0, 5)}{item.end_time ? ` – ${item.end_time.slice(0, 5)}` : ''}</td>
            <td>{item.icon} {item.title}</td>
            <td>
              {isDone(item.id, isoDate) ? (
                <span className="status-done">✓ Selesai</span>
              ) : (
                <span className="status-pending">— Belum</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function WeeklyTable({ items, weekStart, isDone }) {
  const dates = WEEK_ORDER.map((_, idx) => addDays(weekStart, idx))
  return (
    <div className="table-scroll">
      <table className="history-table">
        <thead>
          <tr>
            <th>Kegiatan</th>
            {dates.map((d) => (
              <th key={d.toISOString()}>{formatShort(d)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="history-item-name">{item.icon} {item.title}</td>
              {dates.map((d) => {
                const iso = toISODate(d)
                const applicable = isItemActiveOnDate(item, d)
                return (
                  <td key={iso} className="history-check-cell">
                    {!applicable ? (
                      <span className="cell-na">–</span>
                    ) : isDone(item.id, iso) ? (
                      <span className="status-done">✓</span>
                    ) : (
                      <span className="status-pending">○</span>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MonthlyTable({ items, monthStart, monthEnd, isDone }) {
  const dates = []
  for (let d = new Date(monthStart); d <= monthEnd; d = addDays(d, 1)) {
    dates.push(new Date(d))
  }
  return (
    <div className="table-scroll">
      <table className="history-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Selesai / Total</th>
            <th>Persentase</th>
          </tr>
        </thead>
        <tbody>
          {dates.map((d) => {
            const iso = toISODate(d)
            const applicable = items.filter((i) => isItemActiveOnDate(i, d))
            const done = applicable.filter((i) => isDone(i.id, iso)).length
            const pct = applicable.length ? Math.round((done / applicable.length) * 100) : null
            return (
              <tr key={iso}>
                <td>{formatShort(d)}</td>
                <td>{applicable.length ? `${done} / ${applicable.length}` : '–'}</td>
                <td>
                  {pct === null ? (
                    <span className="cell-na">–</span>
                  ) : (
                    <span className={pct === 100 ? 'status-done' : pct === 0 ? 'status-pending' : ''}>
                      {pct}%
                    </span>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
