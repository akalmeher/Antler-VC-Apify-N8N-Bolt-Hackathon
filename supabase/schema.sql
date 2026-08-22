-- Competitor Radar — schema
-- Paste and run top-to-bottom in the Supabase SQL editor.

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  -- plain text so other verticals are possible later; MVP only ships restaurants
  category text not null default 'restaurant',
  address text,
  city text,
  -- free text describing what they sell and at what price; feeds the LLM prompt
  offerings text,
  created_at timestamptz default now()
);

create table if not exists competitors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  name text not null,
  url text not null,
  -- the menu/pricing pages actually crawled; capped at 3 to keep each Apify run fast and cheap
  page_urls text[] not null,
  status text not null default 'pending',
  last_checked_at timestamptz,
  last_error text,
  created_at timestamptz default now(),
  constraint competitors_page_urls_cardinality check (cardinality(page_urls) between 1 and 3),
  constraint competitors_status_check check (status in ('pending', 'scanning', 'active', 'error'))
);

create table if not exists snapshots (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references competitors (id) on delete cascade,
  captured_at timestamptz default now(),
  -- hash of the combined page content; if it matches the previous snapshot the scan stops early
  content_hash text not null,
  pages jsonb not null, -- [{ url, markdown, hash }]
  structured jsonb      -- { prices: [], items: [], hours: null }
);

create table if not exists signals (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses (id) on delete cascade,
  competitor_id uuid not null references competitors (id) on delete cascade,
  snapshot_id uuid references snapshots (id) on delete set null,
  -- 'baseline' = first scan of a competitor, describing where they stand today;
  -- 'change'   = later scans, describing what moved since the previous snapshot
  signal_type text not null,
  category text not null,
  impact text not null,
  title text not null,
  finding text not null,
  why_it_matters text not null,
  recommended_action text not null,
  evidence text, -- quoted snippet from the crawled page
  source_url text, -- exact crawled page that supports the evidence
  is_read boolean not null default false,
  created_at timestamptz default now(),
  constraint signals_signal_type_check check (signal_type in ('baseline', 'change')),
  constraint signals_category_check check (
    category in ('pricing', 'promotion', 'menu_product', 'hours', 'reputation', 'positioning')
  ),
  constraint signals_impact_check check (impact in ('high', 'medium', 'low'))
);

create index if not exists signals_business_id_created_at_idx on signals (business_id, created_at desc);
create index if not exists signals_competitor_id_idx on signals (competitor_id);
create index if not exists snapshots_competitor_id_captured_at_idx on snapshots (competitor_id, captured_at desc);
create index if not exists competitors_business_id_idx on competitors (business_id);

alter table businesses enable row level security;
alter table competitors enable row level security;
alter table snapshots enable row level security;
alter table signals enable row level security;

-- RLS model
--
-- Read: the frontend holds the anon key and gets SELECT on the three tables it
-- renders from — businesses, competitors and signals.
-- Write: there are deliberately NO insert/update/delete policies. n8n uses the
-- service_role key, which bypasses RLS, so every write path still works while
-- being impossible for anyone holding only the anon key.
--
-- Exception: snapshots has RLS enabled and zero policies, so it is reachable only
-- with the service_role key n8n uses. No MVP screen reads it, and it holds raw
-- crawled page dumps, so granting the anon key SELECT there would add exposure
-- without adding a feature.
--
-- Tradeoff: this makes all signal data publicly readable to anyone with the anon
-- key. Accepted for a single-tenant hackathon demo. Multi-tenancy would replace
-- these blanket policies with per-user ones scoped by auth.uid().

drop policy if exists businesses_select on businesses;
create policy businesses_select on businesses for select to anon, authenticated using (true);

drop policy if exists competitors_select on competitors;
create policy competitors_select on competitors for select to anon, authenticated using (true);

drop policy if exists signals_select on signals;
create policy signals_select on signals for select to anon, authenticated using (true);
