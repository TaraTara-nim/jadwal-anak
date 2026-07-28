import React, { useState } from 'react'
import { buildScheduleText } from './waUtils'

export default function WhatsAppModal({ child, items, onClose }) {
  const [phone, setPhone] = useState('')

  function handleSend(e) {
    e.preventDefault()
    const text = buildScheduleText(child, items)
    const encoded = encodeURIComponent(text)
    const digits = phone.replace(/\D/g, '')
    const url = digits
      ? `https://wa.me/${digits}?text=${encoded}`
      : `https://api.whatsapp.com/send?text=${encoded}`
    window.open(url, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Kirim Jadwal via WhatsApp</h2>
        <p className="field-hint">
          Jadwal akan disiapkan sebagai pesan teks yang siap dikirim lewat WhatsApp.
        </p>

        <form onSubmit={handleSend}>
          <label className="field-label">Nomor WhatsApp tujuan (opsional)</label>
          <input
            type="tel"
            className="text-input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 62812xxxxxxxx"
          />
          <p className="field-hint">
            Kosongkan kalau mau pilih kontak sendiri saat WhatsApp terbuka. Kalau diisi, pakai kode negara
            (62 untuk Indonesia) tanpa tanda + atau angka 0 di depan.
          </p>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
            <button type="submit" className="btn btn-primary">Buka WhatsApp</button>
          </div>
        </form>
      </div>
    </div>
  )
}
