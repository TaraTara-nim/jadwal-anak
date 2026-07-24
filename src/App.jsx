import React, { useEffect, useMemo, useState } from 'react'
import { supabase } from './supabaseClient'
import Login from './Login'
import ChildBar from './ChildBar'
import ChildModal from './ChildModal'
import ItemModal from './ItemModal'
import ScheduleItem from './ScheduleItem'
import PrintView from './PrintView'
import EmailModal from './EmailModal'
import HistoryView from './HistoryView'
import { buildSchedulePdfBase64 } from './pdfUtils'
import { todayKey, isItemActiveOnDate } from './constants'

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [children, setChildren] = useState([])
  const [activeChildId, setActiveChildId] = useState(null)
  const [items, setItems] = useState([])
  const [doneMap, setDoneMap] = useState({}) // schedule_item_id -> completion id

  const [showChildModal, setShowChildModal] = useState(false)
  const [editingChild, setEditingChild] = useState(null)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [view, setView] = useState('jadwal') // jadwal | riwayat
  const [editingItem, setEditingItem] = useState(null) // null = closed, {} = new, {...} = edit
  const [loadingData, setLoadingData] = useState(false)

  // --- auth wiring ---
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sess) => {
      setSession(sess)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  // --- load children on login ---
  useEffect(() => {
    if (!session) return
    loadChildren()
  }, [session])

  async function loadChildren() {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .order('created_at', { ascending: true })
    if (!error && data) {
      setChildren(data)
      if (data.length && !activeChildId) setActiveChildId(data[0].id)
    }
  }

  // --- load schedule + completions when active child changes ---
  useEffect(() => {
    if (!activeChildId) return
    loadSchedule(activeChildId)
  }, [activeChildId])

  async function loadSchedule(childId) {
    setLoadingData(true)
    const { data: itemsData } = await supabase
      .from('schedule_items')
      .select('*')
      .eq('child_id', childId)
      .order('time', { ascending: true })

    const map = {}
    if (itemsData && itemsData.length > 0) {
      const { data: completions } = await supabase
        .from('completions')
        .select('*')
        .eq('date', todayKey())
        .in('schedule_item_id', itemsData.map((i) => i.id))
      for (const c of completions || []) map[c.schedule_item_id] = c.id
    }

    setItems(itemsData || [])
    setDoneMap(map)
    setLoadingData(false)
  }

  const todayItems = useMemo(() => {
    const today = new Date()
    return items.filter((i) => isItemActiveOnDate(i, today))
  }, [items])

  const activeChild = children.find((c) => c.id === activeChildId)

  // --- child CRUD ---
  async function handleAddChild({ name, avatar_color, avatar_emoji }) {
    const { data, error } = await supabase
      .from('children')
      .insert({ name, avatar_color, avatar_emoji, parent_id: session.user.id })
      .select()
      .single()
    if (!error && data) {
      setChildren((prev) => [...prev, data])
      setActiveChildId(data.id)
      setShowChildModal(false)
    }
  }

  async function handleUpdateChild({ name, avatar_color, avatar_emoji }) {
    const { data, error } = await supabase
      .from('children')
      .update({ name, avatar_color, avatar_emoji })
      .eq('id', editingChild.id)
      .select()
      .single()
    if (!error && data) {
      setChildren((prev) => prev.map((c) => (c.id === data.id ? data : c)))
    }
    setEditingChild(null)
  }

  async function handleDeleteChild() {
    const deletedId = editingChild.id
    await supabase.from('children').delete().eq('id', deletedId)
    setChildren((prev) => {
      const next = prev.filter((c) => c.id !== deletedId)
      if (activeChildId === deletedId) {
        setActiveChildId(next[0]?.id || null)
        setItems([])
        setDoneMap({})
      }
      return next
    })
    setEditingChild(null)
  }

  // --- schedule item CRUD ---
  async function handleSaveItem({ title, time, icon, days, event_date }) {
    if (editingItem?.id) {
      const { data, error } = await supabase
        .from('schedule_items')
        .update({ title, time, icon, days, event_date })
        .eq('id', editingItem.id)
        .select()
        .single()
      if (!error && data) {
        setItems((prev) => prev.map((i) => (i.id === data.id ? data : i)))
      }
    } else {
      const { data, error } = await supabase
        .from('schedule_items')
        .insert({ title, time, icon, days, event_date, child_id: activeChildId })
        .select()
        .single()
      if (!error && data) {
        setItems((prev) => [...prev, data].sort((a, b) => a.time.localeCompare(b.time)))
      }
    }
    setEditingItem(null)
  }

  async function handleDeleteItem() {
    if (!editingItem?.id) return
    await supabase.from('schedule_items').delete().eq('id', editingItem.id)
    setItems((prev) => prev.filter((i) => i.id !== editingItem.id))
    setEditingItem(null)
  }

  // --- toggle completion ---
  async function handleToggle(item) {
    const existingId = doneMap[item.id]
    if (existingId) {
      await supabase.from('completions').delete().eq('id', existingId)
      setDoneMap((prev) => {
        const next = { ...prev }
        delete next[item.id]
        return next
      })
    } else {
      const { data, error } = await supabase
        .from('completions')
        .insert({ schedule_item_id: item.id, date: todayKey() })
        .select()
        .single()
      if (!error && data) {
        setDoneMap((prev) => ({ ...prev, [item.id]: data.id }))
      }
    }
  }

  // --- send PDF via email ---
  async function handleSendEmail(email) {
    const pdfBase64 = buildSchedulePdfBase64(activeChild, items)
    const res = await fetch('/.netlify/functions/send-schedule-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, childName: activeChild.name, pdfBase64 }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Gagal mengirim email.')
  }

  if (authLoading) return <div className="loading-screen">Memuat…</div>
  if (!session) return <Login />

  const doneCount = todayItems.filter((i) => doneMap[i.id]).length

  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-logo">🌈 Jadwal Ceria</h1>
        <div className="header-actions">
          {activeChild && (
            <>
              <button className="btn btn-ghost btn-small" onClick={() => setView('riwayat')} aria-label="Riwayat">
                <span aria-hidden="true">📊</span><span className="btn-label"> Riwayat</span>
              </button>
              <button className="btn btn-ghost btn-small" onClick={() => window.print()} aria-label="Cetak">
                <span aria-hidden="true">🖨️</span><span className="btn-label"> Cetak</span>
              </button>
              <button className="btn btn-ghost btn-small" onClick={() => setShowEmailModal(true)} aria-label="Email">
                <span aria-hidden="true">📧</span><span className="btn-label"> Email</span>
              </button>
            </>
          )}
          <button className="btn btn-ghost btn-small" onClick={() => supabase.auth.signOut()} aria-label="Keluar">
            <span aria-hidden="true">🚪</span><span className="btn-label"> Keluar</span>
          </button>
        </div>
      </header>

      <ChildBar
        children={children}
        activeId={activeChildId}
        onSelect={setActiveChildId}
        onAddChild={() => setShowChildModal(true)}
        onEditChild={setEditingChild}
      />

      {activeChild && view === 'riwayat' && (
        <main className="app-main">
          <HistoryView child={activeChild} items={items} onBack={() => setView('jadwal')} />
        </main>
      )}

      {activeChild && view === 'jadwal' && (
        <main className="app-main">
          <div className="day-summary" style={{ '--accent': activeChild.avatar_color }}>
            <div>
              <p className="day-summary-name">{activeChild.avatar_emoji} Jadwal {activeChild.name} hari ini</p>
              <p className="day-summary-progress">
                {todayItems.length === 0
                  ? 'Belum ada kegiatan hari ini'
                  : `${doneCount} dari ${todayItems.length} selesai`}
              </p>
            </div>
            <div className="day-summary-actions">
              <button className="btn btn-primary" onClick={() => setEditingItem({})}>
                + Kegiatan
              </button>
            </div>
          </div>

          {loadingData ? (
            <p className="empty-state">Memuat jadwal…</p>
          ) : todayItems.length === 0 ? (
            <div className="empty-state">
              <p>Belum ada kegiatan untuk hari ini.</p>
              <button className="btn btn-primary" onClick={() => setEditingItem({})}>
                Tambah kegiatan pertama
              </button>
            </div>
          ) : (
            <div className="schedule-list">
              {todayItems.map((item) => (
                <ScheduleItem
                  key={item.id}
                  item={item}
                  done={!!doneMap[item.id]}
                  onToggle={handleToggle}
                  onEdit={setEditingItem}
                  accentColor={activeChild.avatar_color}
                />
              ))}
            </div>
          )}
        </main>
      )}

      {!activeChild && children.length === 0 && (
        <div className="empty-state empty-state-fill">
          <p>Belum ada profil anak. Tambahkan dulu untuk mulai membuat jadwal.</p>
          <button className="btn btn-primary" onClick={() => setShowChildModal(true)}>
            Tambah Anak Pertama
          </button>
        </div>
      )}

      {showChildModal && (
        <ChildModal onClose={() => setShowChildModal(false)} onSave={handleAddChild} />
      )}

      {editingChild && (
        <ChildModal
          initial={editingChild}
          onClose={() => setEditingChild(null)}
          onSave={handleUpdateChild}
          onDelete={handleDeleteChild}
        />
      )}

      {editingItem !== null && (
        <ItemModal
          initial={editingItem.id ? editingItem : null}
          onClose={() => setEditingItem(null)}
          onSave={handleSaveItem}
          onDelete={handleDeleteItem}
        />
      )}

      {showEmailModal && (
        <EmailModal onClose={() => setShowEmailModal(false)} onSend={handleSendEmail} />
      )}

      <PrintView child={activeChild} items={items} />

      <footer className="app-footer">
        Copyright (C) 2026 Megantara. All rights reserved.
      </footer>
    </div>
  )
}
