# 🌈 Jadwal Ceria — Jadwal Harian Anak

Aplikasi web untuk mengatur jadwal harian beberapa anak, dengan tampilan ceria dan bisa dicentang setiap hari. Orang tua login, bisa membuat profil untuk tiap anak, dan menyusun kegiatan harian dengan jam, ikon, dan hari tertentu.

Dibangun dengan **React + Vite**, database **Supabase**, hosting **Netlify**.

---

## 1. Siapkan database di Supabase

1. Buka project Supabase kamu (atau buat project baru di [supabase.com](https://supabase.com)).
2. Masuk ke menu **SQL Editor** → **New query**.
3. Salin seluruh isi file `supabase/schema.sql` dari folder ini, tempel, lalu klik **Run**.
   Ini akan membuat 3 tabel (`children`, `schedule_items`, `completions`) beserta aturan keamanan (Row Level Security) supaya tiap orang tua hanya bisa melihat data anaknya sendiri.
4. Buka menu **Authentication → Providers**, pastikan **Email** provider aktif (biasanya sudah default aktif).
   - Opsional: di **Authentication → Settings**, kamu bisa matikan "Confirm email" kalau tidak mau proses konfirmasi email saat testing.
5. Buka menu **Project Settings → API**. Catat dua nilai ini:
   - **Project URL**
   - **anon public key**

---

## 2. Jalankan di lokal (opsional, untuk coba dulu)

```bash
cd jadwal-anak
cp .env.example .env
```

Edit file `.env` dan isi dengan URL & anon key dari Supabase kamu:

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Lalu jalankan:

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` di browser.

---

## 3. Deploy ke Netlify

**Cara termudah — lewat Netlify CLI:**

```bash
npm install -g netlify-cli
cd jadwal-anak
netlify deploy --prod
```

Ikuti instruksi di terminal (login, pilih/buat site, publish directory isi `dist` — Netlify akan otomatis `npm run build` berkat file `netlify.toml` yang sudah disertakan).

**Atau lewat Netlify Dashboard (drag & drop Git):**

1. Push folder ini ke repository GitHub/GitLab kamu.
2. Di Netlify Dashboard, klik **Add new site → Import an existing project**, hubungkan repo tersebut.
3. Build command: `npm run build`, Publish directory: `dist` (sudah otomatis terbaca dari `netlify.toml`).
4. Di menu **Site settings → Environment variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   (isi dengan nilai yang sama seperti di file `.env` kamu)
5. Klik **Deploy site**.

Setelah deploy selesai, buka URL Netlify-nya — aplikasi siap dipakai. Daftar akun orang tua pertama kali lewat halaman "Daftar", lalu mulai tambahkan profil anak dan kegiatan hariannya.

---

## Struktur data singkat

- **children** — profil tiap anak (nama, warna, maskot), dimiliki oleh 1 akun orang tua.
- **schedule_items** — daftar kegiatan per anak: judul, jam, ikon, dan hari berlaku (0=Minggu … 6=Sabtu). Satu kegiatan bisa berlaku di beberapa hari sekaligus (misal Senin–Jumat).
- **completions** — catatan kegiatan yang sudah dicentang selesai pada tanggal tertentu. Dihapus otomatis kalau kegiatan dihapus.

## Menambah fitur lanjutan (ide pengembangan)

- Notifikasi pengingat (butuh service worker + push notification, atau integrasi email/WhatsApp API).
- Mode "anak" tanpa login yang hanya bisa mencentang, tanpa bisa mengedit — bisa dibuat lewat halaman terpisah dengan Supabase anon read-only view.
- Statistik mingguan (grafik konsistensi kegiatan per anak).
