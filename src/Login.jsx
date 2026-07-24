import React, { useState } from 'react'
import { supabase } from './supabaseClient'

export default function Login() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Akun dibuat! Cek email kamu untuk konfirmasi, lalu masuk.')
      }
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-screen">
      <div className="auth-card">
        <div className="auth-blob" aria-hidden="true">🌈</div>
        <h1 className="auth-title">Jadwal Ceria</h1>
        <p className="auth-subtitle">Masuk sebagai orang tua untuk mengatur jadwal harian si kecil.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="orangtua@email.com"
            className="text-input"
          />
          <label className="field-label" htmlFor="password">Kata sandi</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimal 6 karakter"
            className="text-input"
          />

          {error && <p className="auth-error">{error}</p>}
          {info && <p className="auth-info">{info}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Memproses…' : mode === 'signin' ? 'Masuk' : 'Daftar'}
          </button>
        </form>

        <button
          className="link-btn"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError('')
            setInfo('')
          }}
        >
          {mode === 'signin' ? 'Belum punya akun? Daftar' : 'Sudah punya akun? Masuk'}
        </button>
      </div>

      <footer className="app-footer">
        Copyright (C) 2026 Megantara. All rights reserved.
      </footer>
    </div>
  )
}
