# Bolt handoff

`docs/bolt-prompt.md` is the thing you actually paste into Bolt. This file is the reference behind it: what each table and field means and why the app is shaped this way.

Competitor Radar watches a restaurant's competitors and turns changes on their menu/pricing pages into actionable signals. You are building the dashboard that displays those signals.

## Ground rules

- The frontend is **read-only against Supabase**. Use the anon key and `select` only.
- **Never insert, update, or delete in Supabase from the frontend.** There are no write policies; those calls will fail. All writes go through the n8n webhooks below.
- Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_N8N_WEBHOOK_BASE_URL`, `VITE_BUSINESS_ID`. The `VITE_` prefix is required — Vite does not expose unprefixed vars to client code. `VITE_BUSINESS_ID` scopes every query.

## Tables

**businesses** — the owner's own business, a single row in the MVP.

| column | type |
| --- | --- |
| id | uuid |
| name | text |
| category | text (always `restaurant` in MVP) |
| city | text, nullable |
| offerings | text, nullable — free text about what they sell and at what price |
| created_at | timestamptz |

**competitors**

| column | type |
| --- | --- |
| id | uuid |
| business_id | uuid |
| name | text |
| url | text — display URL |
| page_urls | text[] — 1 to 3 crawled pages |
| status | text — `pending` \| `scanning` \| `active` \| `error` |
| last_checked_at | timestamptz, nullable |
| last_error | text, nullable — show only when status is `error` |
| created_at | timestamptz |

**snapshots** — raw crawl history. **Not readable from the frontend, by design.** RLS is enabled with zero policies, so an anon-key select returns zero rows with no error. Listed here only so `signals.snapshot_id` makes sense. Use `competitors.last_checked_at` for "last scan time".

| column | type |
| --- | --- |
| id | uuid |
| competitor_id | uuid |
| captured_at | timestamptz |
| content_hash | text |
| pages | jsonb — `[{ url, markdown, hash }]` |
| structured | jsonb, nullable — `{ prices: [], items: [], hours: null }` |

**signals** — the product.

| column | type |
| --- | --- |
| id | uuid |
| business_id | uuid |
| competitor_id | uuid |
| snapshot_id | uuid, nullable |
| signal_type | text — `baseline` (first scan of a competitor) \| `change` (something moved since last scan) |
| category | text — `pricing` \| `promotion` \| `menu_product` \| `hours` \| `reputation` \| `positioning` |
| impact | text — `high` \| `medium` \| `low` |
| title | text — headline |
| finding | text — label as “What we found” when `signal_type` is `baseline`, “What changed” when `signal_type` is `change` |
| why_it_matters | text |
| recommended_action | text |
| evidence | text, nullable — quoted snippet from the competitor's page |
| is_read | boolean — nothing in the pipeline ever sets this to `true` and there is no mark-as-read webhook, so the unread count always equals the total. A read/unread toggle would be a Supabase write that fails. |
| created_at | timestamptz |

## Screens and their reads

**Dashboard**

- Competitor count: `competitors` filtered by `business_id`, count.
- Unread signal count: `signals` where `business_id` matches and `is_read` is false, count.
- Last scan time: max `competitors.last_checked_at` across that business's competitors. This is the only source; `snapshots` is unreadable.
- Top 3 signals: `signals` where `business_id` matches and `created_at` is within the last 7 days, sorted by impact rank (high, then medium, then low) and newest first, limit 3. If that window is empty, fall back to the 3 most recent signals of any impact — never filter on `impact = 'high'` alone or the card renders empty on a medium-only scan.

**Competitors**

- `competitors` where `business_id` matches, ordered by `created_at`. Show `name`, `url`, `status` badge, `last_checked_at`, and `last_error` when status is `error`.
- Signal count per competitor: count of `signals` grouped by `competitor_id` (a joined select on signals, or one count query per row is fine at MVP scale).

**Signals feed**

- `signals` where `business_id` matches, ordered by `created_at` desc.
- Each card shows: `signal_type` badge, `impact`, `title`, `finding`, `why_it_matters`, `recommended_action`, and `evidence` if present. Join `competitors.name` for attribution. Label `finding` as “What we found” when `signal_type === "baseline"` and “What changed” when `signal_type === "change"`.

**Add form**

- No business fields. The business is a fixed seeded row referenced by `VITE_BUSINESS_ID`; there is no add-business webhook and the anon key cannot insert. Display the business profile read-only if at all.
- Competitor fields: `name`, `url`, and 1 to 3 `page_urls` (menu or pricing pages). Enforce that 1-3 range in the UI. Submitting zero is rejected by a database CHECK, but submitting more than 3 is silently truncated to the first 3 by n8n, so the user would never learn their fourth URL was dropped.

## Webhooks

Both are `POST` to `${VITE_N8N_WEBHOOK_BASE_URL}` with a JSON body.

```
POST /webhook/add-competitor
{ "business_id": "uuid", "name": "Vaquero Taqueria", "url": "https://...", "page_urls": ["https://.../menu"] }
```

```
POST /webhook/rescan
{ "competitor_id": "uuid" }
```

Both return HTTP 202 with the body `{"accepted":true}` immediately, before any crawling starts. The response is an acknowledgement, not a result, and carries no data. In particular, add-competitor does not return the new competitor id, so the UI has to find the new row when it polls: match on the submitted `url`, or take the newest `created_at` that was not in the pre-submit list. The competitor's status will be `scanning` for roughly 30-90 seconds. Show a scanning state, then poll `competitors` and `signals` every 3 seconds until status leaves `scanning`, giving up after about 3 minutes. Status settles at `active` on success or `error` on failure. Supabase Realtime on `signals` is a nicer experience but is NOT the default: it needs replication enabled on the table in the Supabase dashboard, which `schema.sql` does not do, so a Realtime-only UI receives nothing and looks broken.
