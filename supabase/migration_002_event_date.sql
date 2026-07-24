-- Migration: tambah dukungan kegiatan sekali-jadi (tanggal spesifik)
-- Jalankan di Supabase SQL Editor. Aman dijalankan meski tabel sudah berisi data.

alter table schedule_items
  add column if not exists event_date date;

-- event_date NULL = kegiatan berulang (pakai kolom "days" seperti biasa)
-- event_date terisi = kegiatan sekali-jadi hanya di tanggal itu (kolom "days" diabaikan)
