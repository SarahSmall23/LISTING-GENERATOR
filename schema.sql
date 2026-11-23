-- Run this in the Supabase SQL editor (Project > SQL Editor > New query)

create table if not exists public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  product text not null,
  inputs jsonb not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists generations_user_created_idx
  on public.generations (user_id, created_at desc);

alter table public.generations enable row level security;

create policy "Users read their own generations"
  on public.generations for select
  using (auth.uid() = user_id);

create policy "Users insert their own generations"
  on public.generations for insert
  with check (auth.uid() = user_id);

create policy "Users delete their own generations"
  on public.generations for delete
  using (auth.uid() = user_id);
