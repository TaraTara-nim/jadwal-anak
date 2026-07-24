import React, { useState } from 'react'

export default function EmailModal({ onClose, onSend }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')
    try {
      await onSend(email)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.message || 'Gagal mengirim email.')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Kirim Jadwal via Email</h2>

        {status === 'success' ? (
          <div>
            <p className="auth-info">Jadwal berhasil dikirim ke {email}!</p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={onClose}>Tutup</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="field-label">Alamat email tujuan</label>
            <input
              type="email"
              required
              className="text-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="contoh@email.com"
              autoFocus
            />

            {status === 'error' && <p className="auth-error">{errorMsg}</p>}

            <div className="modal-actions">
              <button type="button" className="btn btn-ghost" onClick={onClose}>Batal</button>
              <button type="submit" className="btn btn-primary" disabled={status === 'sending' || !email}>
                {status === 'sending' ? 'Mengirim…' : 'Kirim PDF'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
