-- =========================================================
-- Jadwal Ceria — skema database Supabase
-- Jalankan seluruh file ini di Supabase Dashboard > SQL Editor
-- =========================================================

-- Tabel profil anak (tiap anak dimiliki oleh satu akun orang tua)
create table if not exists children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  avatar_color text not null default '#FF8A5B',
  avatar_emoji text not null default '🦁',
  created_at timestamptz not null default now()
);

-- Tabel kegiatan / jadwal per anak
create table if not exists schedule_items (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references children(id) on delete cascade,
  title text not null,
  time time not null default '07:00',
  end_time time, -- opsional, diisi kalau kegiatan berupa rentang waktu (misal 07:00 - 12:00)
  icon text not null default '⏰',
  days int[] not null default '{0,1,2,3,4,5,6}', -- 0=Minggu .. 6=Sabtu (dipakai kalau event_date NULL)
  event_date date, -- diisi kalau kegiatan sekali-jadi di tanggal tertentu (mengabaikan "days")
  created_at timestamptz not null default now()
);

-- Tabel status "selesai" harian per kegiatan
create table if not exists completions (
  id uuid primary key default gen_random_uuid(),
  schedule_item_id uuid not null references schedule_items(id) on delete cascade,
  date date not null,
  completed_at timestamptz not null default now(),
  unique (schedule_item_id, date)
);

-- ---------------------------------------------------------
-- Row Level Security: setiap orang tua hanya bisa
-- melihat & mengubah data anak & jadwal miliknya sendiri
-- ---------------------------------------------------------

alter table children enable row level security;
alter table schedule_items enable row level security;
alter table completions enable row level security;

-- children: akses penuh hanya untuk parent_id = user yang login
create policy "children_select_own" on children
  for select using (auth.uid() = parent_id);
create policy "children_insert_own" on children
  for insert with check (auth.uid() = parent_id);
create policy "children_update_own" on children
  for update using (auth.uid() = parent_id);
create policy "children_delete_own" on children
  for delete using (auth.uid() = parent_id);

-- schedule_items: akses lewat kepemilikan child
create policy "schedule_select_own" on schedule_items
  for select using (
    exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid())
  );
create policy "schedule_insert_own" on schedule_items
  for insert with check (
    exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid())
  );
create policy "schedule_update_own" on schedule_items
  for update using (
    exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid())
  );
create policy "schedule_delete_own" on schedule_items
  for delete using (
    exists (select 1 from children c where c.id = child_id and c.parent_id = auth.uid())
  );

-- completions: akses lewat kepemilikan schedule_item -> child
create policy "completions_select_own" on completions
  for select using (
    exists (
      select 1 from schedule_items si
      join children c on c.id = si.child_id
      where si.id = schedule_item_id and c.parent_id = auth.uid()
    )
  );
create policy "completions_insert_own" on completions
  for insert with check (
    exists (
      select 1 from schedule_items si
      join children c on c.id = si.child_id
      where si.id = schedule_item_id and c.parent_id = auth.uid()
    )
  );
create policy "completions_delete_own" on completions
  for delete using (
    exists (
      select 1 from schedule_items si
      join children c on c.id = si.child_id
      where si.id = schedule_item_id and c.parent_id = auth.uid()
    )
  );
