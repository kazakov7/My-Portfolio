-- Supabase visits table schema for Portfolio Analytics
-- Run this in the Supabase SQL Editor

-- 1. Create table
create table if not exists public.visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  vid text not null,
  type text not null check (type in ('pageview', 'click', 'leave')),
  path text,
  referrer text,
  screen text,
  lang text,
  tz text,
  utm text,
  target text,
  seconds integer,
  scroll integer,
  country text,
  city text,
  device text,
  os text,
  browser text,
  ua text
);

-- 2. Enable Row Level Security (RLS)
alter table public.visits enable row level security;

-- NOTE: No public policies are created.
-- By default with RLS enabled and no policies, anonymous and standard authenticated users cannot read or write.
-- Only the Supabase service_role key (which bypasses RLS) can access or insert into this table.
-- This ensures that only your Vercel serverless functions (/api/track and /api/visits) can read/write data.

-- 3. Indexes for fast aggregation and queries in Admin Dashboard
create index if not exists visits_created_at_idx on public.visits (created_at desc);
create index if not exists visits_vid_idx on public.visits (vid);
create index if not exists visits_type_idx on public.visits (type);
create index if not exists visits_country_idx on public.visits (country);
create index if not exists visits_device_idx on public.visits (device);
