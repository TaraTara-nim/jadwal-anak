import React, { useState } from 'react'
import { ICONS, DAYS } from './constants'

export default function ItemModal({ initial, onClose, onSave, onDelete }) {
  const [title, setTitle] = useState(initial?.title || '')
  const [time, setTime] = useState(initial?.time || '07:00')
  const [icon, setIcon] = useState(initial?.icon || ICONS[0])
  const [days, setDays] = useState(initial?.days ?? [0, 1, 2, 3, 4, 5, 6])
  const [saving, setSaving] = useState(false)

  function toggleDay(d) {
    setDays((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort()
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim() || days.length === 0) return
    setSaving(true)
    await onSave({ title: title.trim(), time, icon, days })
    setSaving(false)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{initial ? 'Ubah Kegiatan' : 'Kegiatan Baru'}</h2>
        <form onSubmit={handleSubmit}>
          <label className="field-label">Nama kegiatan</label>
          <input
            className="text-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Sikat gigi"
            autoFocus
          />

          <label className="field-label">Jam</label>
          <input
            type="time"
            className="text-input"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <label className="field-label">Ikon</label>
          <div className="emoji-grid">
            {ICONS.map((em) => (
              <button
                type="button"
                key={em}
                className={`emoji-option ${icon === em ? 'emoji-option-active' : ''}`}
                onClick={() => setIcon(em)}
              >
                {em}
              </button>
            ))}
          </div>

          <label className="field-label">Hari</label>
          <div className="day-grid">
            {DAYS.map((d) => (
              <button
                type="button"
                key={d.key}
                className={`day-option ${days.includes(d.key) ? 'day-option-active' : ''}`}
                onClick={() => toggleDay(d.key)}
              >
                {d.label}
              </button>
            ))}
          </div>

          <div className="modal-actions">
            {initial && (
              <button type="button" className="btn btn-danger" onClick={onDelete}>
                Hapus
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !title.trim()}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
