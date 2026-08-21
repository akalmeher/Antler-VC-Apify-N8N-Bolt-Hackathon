# n8n contract

n8n owns every database write and uses the Supabase **service_role** key. This repo exports three production workflows. Import all of them; this document is the contract they satisfy.

| File | Role |
| --- | --- |
| `competitor-radar-scan.json` | Scheduled and on-demand competitor website monitoring, change detection, AI analysis, snapshots and signals. |
| `competitor-radar-discover-nearby.json` | Address geocoding plus Apify Google Maps nearby competitor discovery. |
| `competitor-radar-rescan-all.json` | Re-scans all eligible competitors **sequentially** so concurrent Apify crawls do not hit memory limits. |

Exported JSON contains placeholder credentials, not real secrets. After import, replace the tokens inside n8n (see [Placeholders after import](#placeholders-after-import)). Do not commit filled copies.

---

## `competitor-radar-scan.json`

Website monitoring pipeline: crawl competitor pages, hash the content, diff against the previous snapshot, and ask an LLM for signals.

### Triggers

**`POST /webhook/add-competitor`** — payload `{ business_id, name, url, page_urls[] }`.
Inserts the competitor row with status `scanning`, responds immediately, then runs the scan. It must not hold the HTTP response open for the length of the crawl.

**`POST /webhook/rescan`** — payload `{ competitor_id }`.
Sets status to `scanning`, responds immediately, then runs the scan.

**Schedule, every 6 hours** — re-scan every competitor whose status is `active`.

### Scan sequence

1. Fetch the competitor row and its parent business.
2. Call the Apify actor `apify/website-content-crawler` on `page_urls` via `run-sync-get-dataset-items`.
3. Normalize the returned markdown per page and compute a combined `content_hash`.
4. Fetch the most recent snapshot for this competitor.
5. If the hash is unchanged, update `last_checked_at` and stop.
6. Otherwise, one LLM call returning a JSON array of signals.
7. Insert the snapshot.
8. Insert the signals.
9. Set status `active` and `last_checked_at`.

On any failure, set status `error` and write the message to `last_error`.

First scan of a competitor has no previous snapshot, so its signals are `signal_type = 'baseline'` (where the competitor stands today). Every later scan emits `signal_type = 'change'`.

### Actor notes

- Endpoint: `POST https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items`. The JSON body is the actor input; the response body is the dataset items array directly.
- Token: either `?token=<APIFY_API_TOKEN>` in the query string or an `Authorization: Bearer <APIFY_API_TOKEN>` header. Prefer the header so the token stays out of n8n execution logs.
- Hard limit: if the run exceeds **300 seconds**, the endpoint returns HTTP 408 and we get no items, even though the run keeps going on Apify. Set the n8n HTTP node timeout above 300s and treat 408 as a scan error.
- Runtime for 3 pages is not published by Apify. Expect roughly 20-60s with the `cheerio` crawler (mostly container startup) and 1-3 minutes with a Playwright crawler — comfortably inside the 300s window either way, but measure it once in the console.
- `proxyConfiguration` is a **required** input field, not optional. `{ "useApifyProxy": true }` is what we send.
- `respectRobotsTxtFile` defaults to `true`, so a competitor whose robots.txt disallows the menu path will silently return nothing. Worth checking if a scan comes back empty.

---

## `competitor-radar-discover-nearby.json`

Address-based nearby discovery. Does not write to Supabase; it returns a list the frontend can show so the user chooses who to monitor.

**`POST /webhook/discover-nearby`** — payload `{ business_name, address, radius_miles, search_term }` with optional `latitude` / `longitude` fallback if geocoding fails.

Sequence:

1. Geocode `address` with the Google Maps Geocoding API.
2. Build an Apify Places crawl around those coordinates (or the optional lat/lng fallback) using `compass/crawler-google-places`.
3. Normalize, filter closed businesses, sort by distance, and respond with `{ business_name, radius_miles, count, competitors }`.

---

## `competitor-radar-rescan-all.json`

Full-watchlist refresh that **must not** fire every competitor crawl at once. Concurrent Apify website crawls can fail with memory-limit errors, so this workflow queues one eligible competitor at a time through the existing scan webhook.

**`POST /webhook/rescan-all`** — payload `{ business_id }`.

Sequence:

1. Load competitors for that business whose status is `active` or `error`.
2. Respond immediately with `{ accepted, queued_count, started_at, message }` so the frontend can poll progress.
3. Loop sequentially: `POST /webhook/rescan` for the current competitor, wait until that row is no longer `scanning`, then move to the next.

It does not duplicate crawl, LLM, or snapshot logic — it only serializes calls into `competitor-radar-scan.json`.

---

## Placeholders after import

Search each imported workflow for `<<` and replace every token in the n8n editor. Typical placeholders:

| Placeholder | Used by | What to put there |
| --- | --- | --- |
| `<<SUPABASE_SERVICE_ROLE_KEY>>` | scan, rescan-all | Supabase **service_role** key (not the anon key) |
| `<<APIFY_API_TOKEN>>` | scan, discover-nearby | Apify API token |
| `<<OPENAI_API_KEY>>` | scan | OpenAI API key |
| `<<GOOGLE_MAPS_API_KEY>>` | discover-nearby | Google Maps Geocoding API key |

The scan workflow also uses `<<SUPABASE_URL>>` (`https://<project-ref>.supabase.co`, no trailing slash).

There are no n8n credential objects in the exported JSON, so the placeholders are the configuration step. Do not add real credentials to the repo.
