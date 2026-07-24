import React, { useState } from 'react'
import { AVATAR_COLORS, AVATAR_EMOJIS } from './constants'

export default function ChildModal({ initial, onClose, onSave, onDelete }) {
  const [name, setName] = useState(initial?.name || '')
  const [color, setColor] = useState(initial?.avatar_color || AVATAR_COLORS[0].value)
  const [emoji, setEmoji] = useState(initial?.avatar_emoji || AVATAR_EMOJIS[0])
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

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
        <h2 className="modal-title">{initial ? 'Ubah Profil Anak' : 'Profil Anak Baru'}</h2>
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

          {initial && confirmDelete && (
            <p className="auth-error">
              Yakin hapus profil {initial.name}? Semua kegiatan dan riwayatnya akan ikut terhapus permanen.
            </p>
          )}

          <div className="modal-actions">
            {initial && !confirmDelete && (
              <button type="button" className="btn btn-danger" onClick={() => setConfirmDelete(true)}>
                Hapus
              </button>
            )}
            {initial && confirmDelete && (
              <button type="button" className="btn btn-danger" onClick={onDelete}>
                Ya, Hapus Permanen
              </button>
            )}
            <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
            {!confirmDelete && (
              <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
                {saving ? 'Menyimpan…' : 'Simpan'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
