import React from 'react'

export default function ScheduleItem({ item, done, onToggle, onEdit, accentColor }) {
  return (
    <div className={`schedule-card ${done ? 'schedule-card-done' : ''}`}>
      <button
        className="check-circle"
        style={{ '--accent': accentColor }}
        onClick={() => onToggle(item)}
        aria-label={done ? 'Tandai belum selesai' : 'Tandai selesai'}
      >
        {done ? '✓' : ''}
      </button>

      <button className="schedule-body" onClick={() => onEdit(item)}>
        <span className="schedule-icon">{item.icon}</span>
        <span className="schedule-text">
          <span className="schedule-title">{item.title}</span>
          <span className="schedule-time">
            {item.time?.slice(0, 5)}
            {item.event_date && <span className="schedule-badge">📅 sekali</span>}
          </span>
        </span>
      </button>
    </div>
  )
}
