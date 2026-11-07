-- Skema + RLS v2 untuk PintarCilik (menggantikan klaim RLS yang tak terbukti di v1).
-- Jalankan di Supabase SQL Editor, lalu verifikasi dengan akun kedua sebelum rilis.
create table if not exists public.calistung_profiles (
  id uuid primary key references auth.users (id),
  name text not null,
  age int check (age between 3 and 10),
  level text not null check (level in ('PEMULA', 'MENENGAH', 'MAHIR')),
  avatar text,
  updated_at timestamptz default now()
);
create table if not exists public.calistung_game_results (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id),
  category text not null check (category in ('BERHITUNG', 'MEMBACA', 'LOGIKA')),
  score int not null check (score between 0 and 100),
  total_questions int not null check (total_questions > 0),
  difficulty text not null,
  created_at timestamptz default now()
);
alter table public.calistung_profiles enable row level security;
alter table public.calistung_game_results enable row level security;
drop policy if exists "own profile" on public.calistung_profiles;
create policy "own profile" on public.calistung_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
drop policy if exists "own results" on public.calistung_game_results;
create policy "own results" on public.calistung_game_results
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
