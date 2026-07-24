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

## 4. Fitur Cetak & Kirim PDF via Email

### Cetak
Tombol **🖨️ Cetak** langsung memakai fitur print bawaan browser — tidak perlu setup tambahan.

### Kirim PDF via Email
Fitur ini memakai **Resend** ([resend.com](https://resend.com)) untuk mengirim email, dan **Netlify Functions** sebagai perantara supaya API key tidak terekspos di browser.

**Cara setup:**

1. Daftar gratis di **[resend.com](https://resend.com)** (tidak perlu kartu kredit untuk paket gratis).
2. Setelah login, buka menu **API Keys** → **Create API Key** → catat key yang muncul (formatnya `re_xxxxxxxxxxxx`).
3. Di Netlify Dashboard, buka project kamu → **Site configuration → Environment variables** → **Add a variable**:
   - Key: `RESEND_API_KEY`
   - Value: (key dari Resend tadi)
   - **Jangan** pakai awalan `VITE_` untuk ini — supaya key tetap rahasia dan hanya bisa diakses lewat server (Netlify Function), bukan dari browser.
4. Trigger deploy ulang (**Deploys → Trigger deploy → Deploy site**).

**Batasan paket gratis Resend:** selama kamu belum memverifikasi domain sendiri di Resend, email hanya bisa dikirim ke **alamat email yang kamu pakai mendaftar Resend** (mode testing). Untuk mengirim ke sembarang alamat email (misal ke email pasangan atau pengasuh), kamu perlu verifikasi domain sendiri di Resend (menu **Domains**) — butuh akses pengaturan DNS domain. Untuk pemakaian pribadi, mode testing biasanya sudah cukup.

---

## 5. Kegiatan Sekali-Jadi (Tanggal Tertentu) & Hapus Profil Anak

**Jika project Supabase kamu sudah pernah dipakai sebelumnya** (bukan instalasi baru), jalankan dulu migrasi berikut supaya kolom baru tersedia:

1. Buka **SQL Editor** di Supabase → **New query**
2. Salin isi file `supabase/migration_002_event_date.sql`, tempel, klik **Run**

Kalau ini instalasi baru (baru pertama kali menjalankan `schema.sql`), tidak perlu langkah ini — kolomnya sudah termasuk di `schema.sql`.

**Fitur baru:**
- Saat menambah/mengubah kegiatan, pilih **"📅 Tanggal tertentu (sekali)"** untuk kegiatan yang hanya terjadi sekali di tanggal spesifik (bukan berulang tiap minggu).
- Klik ikon **✎** di samping nama anak (chip) untuk mengubah profil atau menghapusnya. Menghapus profil anak akan ikut menghapus semua kegiatan dan riwayatnya secara permanen (ada konfirmasi sebelum benar-benar terhapus).
