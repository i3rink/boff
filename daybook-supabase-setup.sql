-- ============================================================
-- Day Book - Supabase setup
-- Paste all of this into Supabase: SQL Editor > New query > Run.
-- It creates two tables and locks every row to its owner.
-- ============================================================

-- Your action points / entries
create table if not exists public.entries (
  user_id  uuid not null default auth.uid() references auth.users on delete cascade,
  id       text not null,
  title    text,
  details  text,
  category text,
  priority text,
  type     text,
  caller   text,
  due      text,
  done     boolean default false,
  created  bigint,
  updated  bigint,
  primary key (user_id, id)
);

-- Your day notes (one per day)
create table if not exists public.notes (
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  day     text not null,
  body    text,
  updated bigint,
  primary key (user_id, day)
);

-- Turn on Row Level Security. Nothing is readable until a policy allows it.
alter table public.entries enable row level security;
alter table public.notes   enable row level security;

-- Each signed-in user can only touch their own rows.
drop policy if exists "own entries" on public.entries;
create policy "own entries" on public.entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "own notes" on public.notes;
create policy "own notes" on public.notes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
