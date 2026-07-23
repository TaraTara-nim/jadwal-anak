import React, { useState } from 'react'
import { AVATAR_COLORS, AVATAR_EMOJIS } from './constants'

export default function ChildModal({ onClose, onSave }) {
  const [name, setName] = useState('')
  const [color, setColor] = useState(AVATAR_COLORS[0].value)
  const [emoji, setEmoji] = useState(AVATAR_EMOJIS[0])
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await onSave({ name: name.trim(), avatar_color: color, avatar_emoji: emoji })
    setSaving(false)
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Profil Anak Baru</h2>
        <form onSubmit={handleSubmit}>
          <label className="field-label">Nama anak</label>
          <input
            className="text-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Kayla"
            autoFocus
          />

          <label className="field-label">Pilih maskot</label>
          <div className="emoji-grid">
            {AVATAR_EMOJIS.map((em) => (
              <button
                type="button"
                key={em}
                className={`emoji-option ${emoji === em ? 'emoji-option-active' : ''}`}
                onClick={() => setEmoji(em)}
              >
                {em}
              </button>
            ))}
          </div>

          <label className="field-label">Pilih warna</label>
          <div className="color-grid">
            {AVATAR_COLORS.map((c) => (
              <button
                type="button"
                key={c.value}
                className={`color-option ${color === c.value ? 'color-option-active' : ''}`}
                style={{ background: c.value }}
                onClick={() => setColor(c.value)}
                title={c.name}
              />
            ))}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
              {saving ? 'Menyimpan…' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
