# Competitor Radar

A single-page app for independent restaurant owners to watch competitors and see what changed on their pages — with a recommended action for every change.

## Environment variables

Create a `.env` file (see `.env.example`) with exactly these four keys:

| Key | What it is |
| --- | --- |
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `VITE_N8N_WEBHOOK_BASE_URL` | Your n8n origin, no trailing slash (e.g. `https://yourname.app.n8n.cloud`) |
| `VITE_BUSINESS_ID` | The fixed business UUID this app is scoped to |

## How it works

- **The app is read-only against Supabase.** It only reads from the `businesses`, `competitors`, and `signals` tables using the anon key. It never inserts, updates, or deletes.
- **All writes go through two n8n webhooks:**
  - `POST {VITE_N8N_WEBHOOK_BASE_URL}/webhook/add-competitor` — add a competitor to watch.
  - `POST {VITE_N8N_WEBHOOK_BASE_URL}/webhook/rescan` — re-scan an existing competitor.
- **Scans are asynchronous.** A webhook returns immediately with `202 { "accepted": true }`; the actual crawl and analysis take **30 to 90 seconds**. The app shows the competitor as "scanning", polls Supabase every 3 seconds for the result, refreshes the feed when it lands, and gives up cleanly after about 3 minutes.

## Optional upgrade

Polling is used deliberately so there's no extra setup. If you'd rather have instant updates, you can enable Supabase Realtime on the `signals` table (requires turning on table replication in the Supabase dashboard) and subscribe to inserts instead of polling.

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
