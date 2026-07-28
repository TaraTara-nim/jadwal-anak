-- Migration: tambah dukungan rentang waktu (jam mulai - jam selesai)
-- Jalankan di Supabase SQL Editor. Aman dijalankan meski tabel sudah berisi data.

alter table schedule_items
  add column if not exists end_time time;

-- end_time NULL = kegiatan hanya punya satu jam (seperti biasa)
-- end_time terisi = kegiatan berupa rentang waktu, misal 07:00 - 12:00
