-- Supabase schema for KeyWise MVP

create extension if not exists "pgcrypto";

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  user_id text not null,
  address text,
  city text,
  state text,
  zip_code text,
  beds integer,
  baths integer,
  square_feet integer,
  year_built integer,
  seller_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_listings_user_id on listings(user_id);

create table if not exists generated_content (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references listings(id) on delete cascade,
  content_type text not null,
  content text not null,
  created_at timestamptz not null default now()
);
