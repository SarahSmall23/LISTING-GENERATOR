-- Step 4: saved brand voice per user. Run in the Supabase SQL editor.

create table if not exists public.brand_profiles (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  voice text not null default '' check (char_length(voice) <= 300),
  updated_at timestamptz not null default now()
);

alter table public.brand_profiles enable row level security;

create policy "Users read their own brand profile"
  on public.brand_profiles for select
  using (auth.uid() = user_id);

create policy "Users create their own brand profile"
  on public.brand_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users update their own brand profile"
  on public.brand_profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
