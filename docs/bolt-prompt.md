# Bolt prompt

Copy the fenced block below in one action and paste it into bolt.new as the first message. It is the executable version of `bolt-handoff.md`.
Before pasting, fill in the four bracketed values at the top of the prompt: your Supabase project URL, your Supabase anon key, your n8n instance origin (no trailing slash, no `/webhook`), and the business UUID — which is `11111111-1111-4111-8111-111111111111` from `supabase/seed.sql` unless you changed it.
If your n8n workflow is not activated yet, n8n serves the test URLs at `/webhook-test/...` instead of `/webhook/...`; activate the workflow so the production paths below work.

```
Build a React + Vite + Tailwind CSS single-page app called "Competitor Radar". Use the official Supabase JS client (@supabase/supabase-js) for reads and plain fetch() for webhook POSTs. There is no backend: no server routes, no API folder, no Express, no Next.js, no ORM, no Prisma, no database migrations. The database already exists and I will not change it.

=== ENVIRONMENT ===

Read all config from Vite env vars via import.meta.env. Create a .env file with exactly these four keys and use these values:

VITE_SUPABASE_URL=<paste your Supabase project URL>
VITE_SUPABASE_ANON_KEY=<paste your Supabase anon key>
VITE_N8N_WEBHOOK_BASE_URL=<paste your n8n origin, e.g. https://yourname.app.n8n.cloud, no trailing slash>
VITE_BUSINESS_ID=<paste the business UUID, e.g. 11111111-1111-4111-8111-111111111111>

Also write a .env.example with the same four keys and empty values. Never hardcode these values inline in components. Do not invent additional env vars.

VITE_BUSINESS_ID is a fixed UUID for one business row that already exists in the database. There is no create-business flow and you must not build one: n8n owns every write and there is no add-business webhook. Every query that filters by business scope uses this constant. The add-competitor form attaches new competitors to this one business ID. If you display the business at all, load it read-only (select name, category, city, offerings from businesses where id equals VITE_BUSINESS_ID) and render it as text. No edit button, no profile form, no business switcher, no onboarding wizard.

=== HARD CONSTRAINTS — DO NOT VIOLATE ANY OF THESE ===

1. NO AUTHENTICATION. No login page, no signup, no magic link, no OAuth, no Supabase Auth calls, no session handling, no protected routes, no user accounts, no profile menu, no logout button. This is a single-tenant demo that opens straight onto the dashboard.

2. NO ACCOUNT SCAFFOLDING. No teams, no workspaces, no organizations, no billing or pricing page, no settings page, no permissions or roles, no invite flow, no onboarding tour, no notification preferences, no dark-mode toggle.

3. THE FRONTEND IS READ-ONLY AGAINST SUPABASE. Use .select() only. Never call .insert(), .update(), .upsert(), .delete(), or .rpc() on any table. The database deliberately has row-level security enabled with SELECT policies only and no write policies, so any write from the anon key fails. Every write goes through an n8n webhook described below. As a direct consequence: do not build a "mark as read" button, a signal-dismiss action, an edit-competitor form, a delete-competitor button, or an is_read toggle. There is no webhook for any of those, so they cannot work.

4. NO MOCK DATA. Do not create a mockData.ts, seed array, fixtures file, sample signals constant, or any hardcoded competitor or signal. Do not fall back to sample data when a query returns zero rows or throws. If a table is empty, render a real empty state. If a query errors, show the actual error message. A demo that silently renders fake signals is worse than one that shows nothing.

5. Only read from these three tables: businesses, competitors, signals. Do NOT query the snapshots table — RLS blocks the anon key from reading it and it will always return zero rows. Derive "last scan time" from competitors.last_checked_at only.

=== DATABASE SCHEMA (exact column names — use these verbatim) ===

businesses: id (uuid), name (text), category (text), city (text, nullable), offerings (text, nullable), created_at (timestamptz)

competitors: id (uuid), business_id (uuid), name (text), url (text), page_urls (text array, 1 to 3 entries), status (text), last_checked_at (timestamptz, nullable), last_error (text, nullable), created_at (timestamptz)

signals: id (uuid), business_id (uuid), competitor_id (uuid), snapshot_id (uuid, nullable), signal_type (text), category (text), impact (text), title (text), what_changed (text), why_it_matters (text), recommended_action (text), evidence (text, nullable), is_read (boolean), created_at (timestamptz)

=== ENUM VALUES (database CHECK constraints — reproduce these strings literally in every badge, map, and filter) ===

competitors.status is exactly one of: 'pending', 'scanning', 'active', 'error'
signals.signal_type is exactly one of: 'baseline', 'change'
signals.impact is exactly one of: 'high', 'medium', 'low'
signals.category is exactly one of: 'pricing', 'promotion', 'menu_product', 'hours', 'reputation', 'positioning'

Do not invent extra values, do not rename them, do not change their casing in the query filters. Display labels may be prettier than the raw strings (for example render category 'menu_product' as "Menu & product"), but every comparison and filter value in code must match the strings above character for character.

signal_type meaning: 'baseline' is the first scan of a competitor and describes where they stand today. 'change' is a later scan and describes what moved since the previous scan. Label them in plain language, for example "Baseline" and "New change".

=== SCREENS — EXACTLY FOUR, PLUS A SIMPLE NAV ===

A persistent top nav with four links: Dashboard, Competitors, Signals, Add competitor. Use react-router-dom or simple local state; either is fine. No sidebar with fake extra sections.

--- 1. DASHBOARD ---

Four things, nothing more:
- Competitor count: count of competitors where business_id equals VITE_BUSINESS_ID.
- Unread signal count: count of signals where business_id equals VITE_BUSINESS_ID and is_read is false. Label it "New signals". Note that nothing in this system ever sets is_read to true, so this will match the total; that is expected, do not add a way to change it.
- Last checked: the maximum last_checked_at across that business's competitors, rendered as relative time ("22 minutes ago"). If every competitor has a null last_checked_at, show "No scans yet".
- Top signals: the 3 highest-impact recent signals for this business. Query signals where business_id equals VITE_BUSINESS_ID and created_at is within the last 7 days, order by created_at descending, then sort client-side by impact rank (high before medium before low) and take 3. If that window is empty, fall back to the 3 most recent signals of any age rather than showing an empty card. Each one links to the Signals feed.

Empty state when there are no signals at all: "No signals yet. Run a scan on a competitor and their pricing and menu changes will show up here."

--- 2. COMPETITORS ---

A table or list of competitors where business_id equals VITE_BUSINESS_ID, ordered by created_at ascending. Per row show:
- name
- url, as a link that opens in a new tab
- status, as a colored badge using the four literal status values: pending (neutral grey), scanning (blue, with a subtle animated indicator), active (green), error (red)
- last_checked_at as relative time, or "Never" when null
- signal count for that competitor: count of signals where competitor_id equals that row's id. One count query per row is fine at this scale, or fetch all signals for the business once and tally client-side.
- a "Re-scan now" button, disabled while that row's status is 'scanning'

When status is 'error', display last_error visibly in the row — an inline red message under the name, not a tooltip, not truncated to nothing, not hidden behind a click. Seeing why a scan failed is the point.

Empty state: "No competitors yet." with a link to the Add competitor screen.

--- 3. SIGNALS FEED ---

This screen is the product. Make it the most polished, best-designed part of the app.

Query signals where business_id equals VITE_BUSINESS_ID, ordered by created_at descending. Join the competitor name for attribution using the Supabase foreign-table select syntax: .select('*, competitors(name)'). Render one card per signal, newest first.

Each card contains, in this order:
- Header row: competitor name, a signal_type badge ('baseline' vs 'change' — visually distinct), an impact badge ('high' / 'medium' / 'low' — high should be the loudest, low the quietest), a category label, and relative created_at.
- title as the card headline, prominent.
- what_changed under a "What changed" label.
- why_it_matters under a "Why it matters" label.
- recommended_action under a "Do this" label. This must be the visually emphasized element of the card — give it a tinted background panel, an accent left border, and stronger type weight than the surrounding text. This is the line the owner acts on, so it should be the thing the eye lands on after the headline.
- evidence, when it is not null, rendered last as a quoted excerpt in a blockquote with a monospace or serif treatment and a smaller muted type size, prefixed with a "From their page" label. Skip the whole block when evidence is null.

Add lightweight filter controls at the top: filter by impact, by category, and by competitor, using the literal enum strings as values. Filtering is client-side over already-fetched rows or a re-query; either is fine. Include an "All" option for each.

Empty state: "No signals yet. Once a scan finishes, every price change, new promotion and menu update we find will appear here as a card with a recommended action."

--- 4. ADD COMPETITOR ---

A single form with:
- name (text, required)
- url (the competitor's main site, required, must look like a URL)
- page_urls: between 1 and 3 URLs, the menu or pricing pages to crawl. Start with one input, an "Add page URL" button that stops working at 3, and a remove button on each when there is more than one. The database has a CHECK constraint capping page_urls at 3 entries, so the form MUST hard-enforce a 1-to-3 range and must never submit 0 or 4+. Show the cap in helper text: "Up to 3 pages. The menu or pricing page works best."

Do NOT put business fields (business name, city, offerings) on this form. The business already exists and cannot be created or edited from the frontend.

On submit, POST to the n8n webhook. Never write to Supabase here.

=== WEBHOOKS — THE ONLY WRITE PATH ===

Both are POST with a JSON body and Content-Type: application/json. No auth header. CORS is already open on the n8n side. Both return HTTP 202 with the body {"accepted":true} immediately, before any work is done.

Add a competitor:
POST ${VITE_N8N_WEBHOOK_BASE_URL}/webhook/add-competitor
{ "business_id": "<VITE_BUSINESS_ID>", "name": "Vaquero Taqueria", "url": "https://vaquero.example", "page_urls": ["https://vaquero.example/menu"] }

Re-scan an existing competitor:
POST ${VITE_N8N_WEBHOOK_BASE_URL}/webhook/rescan
{ "competitor_id": "<the competitor row's id>" }

Use exactly those field names: business_id, name, url, page_urls, competitor_id. No extra fields, no nesting, no wrapper object.

=== ASYNCHRONOUS BEHAVIOR — READ THIS TWICE, IT IS THE PART MOST LIKELY TO BE BUILT WRONG ===

The webhook response is NOT the result. It is only an acknowledgement. The real work — crawling the competitor's pages and running an LLM over them — takes 30 to 90 seconds after the 202 comes back. The webhook body contains no competitor id and no signal data. So:

After a successful POST to /webhook/rescan:
1. Optimistically show that competitor as 'scanning' in the UI immediately.
2. Poll Supabase every 3 seconds: re-select that competitor row and read its status.
3. n8n sets status to 'scanning' at the start, then to 'active' on success or 'error' on failure, and stamps last_checked_at. Stop polling as soon as status is no longer 'scanning'.
4. On 'active', re-fetch the signals list and the dashboard counts so new cards appear without a manual refresh. Show a brief success confirmation.
5. On 'error', stop and display that row's last_error.

After a successful POST to /webhook/add-competitor:
1. The 202 body gives you no id, so you cannot poll a known row. Instead show an immediate "Scan started" state and begin polling the competitors list for this business every 3 seconds. n8n inserts the new row with status 'scanning', so identify it as the row whose url matches what was just submitted, or as the newest row by created_at that was not in the pre-submit list.
2. Once found, poll that row's status exactly as in the re-scan flow, and navigate the user to the Competitors screen (or the Signals feed once it settles) so they can watch progress.

Both flows must:
- Give up after about 3 minutes (roughly 60 polls at 3 seconds) and stop cleanly. Show a timeout hint like "Still working. The scan is taking longer than usual — refresh in a minute to check." Never spin forever.
- Clear the polling interval on unmount and when navigating away, so no interval leaks.
- Handle the legitimate outcome where a scan finishes with status 'active' but produces zero new signals. This happens when the competitor's pages have not changed since the last scan, or the analysis found nothing commercially meaningful. That is a success, not a failure: say something like "Scan finished. No meaningful changes since last time." Do not treat it as an error and do not keep polling.

Do not use Supabase Realtime as the default mechanism. You may mention it in the README as an optional upgrade for the signals table, but Realtime requires enabling table replication in the Supabase dashboard, which is extra setup we do not want. Poll.

=== VISUAL DIRECTION ===

Clean, modern, confident. Generous whitespace, a restrained palette with one accent color, clear type hierarchy, subtle borders and shadows rather than heavy cards. Responsive and genuinely usable on a phone, because the audience reads this between shifts.

The audience is an independent restaurant owner, not an analyst. Write every label and every empty state in plain language. No dashboard jargon: no "KPI", "metrics", "insights engine", "analytics", "telemetry", "ingest", "pipeline". Say "New signals", "Last checked", "Competitors we're watching", "Do this".

Do not use emoji as iconography anywhere — not in nav, not in badges, not in empty states, not in buttons. Use lucide-react icons or simple SVG.

Include real loading states (skeletons or a quiet spinner) and real error states that print the actual Supabase error message. Every empty state gets one sentence explaining what will appear there once a scan runs.

=== DELIVERABLE ===

A running Vite app, plus a short README covering: the four env vars, that the app is read-only against Supabase, that all writes go through the two n8n webhooks, and that scans take 30 to 90 seconds. Nothing else.
```
