# n8n contract

n8n owns every database write and uses the Supabase **service_role** key. The workflow JSON is not in this repo yet; this is the contract it must satisfy.

## Triggers

**`POST /webhook/add-competitor`** — payload `{ business_id, name, url, page_urls[] }`.
Inserts the competitor row with status `scanning`, responds immediately, then runs the scan. It must not hold the HTTP response open for the length of the crawl.

**`POST /webhook/rescan`** — payload `{ competitor_id }`.
Sets status to `scanning`, responds immediately, then runs the scan.

**Schedule, every 6 hours** — re-scan every competitor whose status is `active`.

## Scan sequence

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

## Required credentials

- Supabase URL + service_role key
- Apify API token
- OpenAI API key

## Actor notes

- Endpoint: `POST https://api.apify.com/v2/acts/apify~website-content-crawler/run-sync-get-dataset-items`. The JSON body is the actor input; the response body is the dataset items array directly.
- Token: either `?token=<APIFY_API_TOKEN>` in the query string or an `Authorization: Bearer <APIFY_API_TOKEN>` header. Prefer the header so the token stays out of n8n execution logs.
- Hard limit: if the run exceeds **300 seconds**, the endpoint returns HTTP 408 and we get no items, even though the run keeps going on Apify. Set the n8n HTTP node timeout above 300s and treat 408 as a scan error.
- Runtime for 3 pages is not published by Apify. Expect roughly 20-60s with the `cheerio` crawler (mostly container startup) and 1-3 minutes with a Playwright crawler — comfortably inside the 300s window either way, but measure it once in the console.
- `proxyConfiguration` is a **required** input field, not optional. `{ "useApifyProxy": true }` is what we send.
- `respectRobotsTxtFile` defaults to `true`, so a competitor whose robots.txt disallows the menu path will silently return nothing. Worth checking if a scan comes back empty.
