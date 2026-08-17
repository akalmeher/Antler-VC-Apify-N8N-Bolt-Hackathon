# demo-site — the competitor we control

`index.html` is a single static page for a fictional Austin taqueria, **Media Luna Taqueria**. Real competitors don't change their menu on cue, so this is the page we edit live on stage to prove the pipeline detects a genuine change.

## This page must be publicly reachable on the internet

**Apify crawls from Apify's cloud, not from your laptop. `http://localhost:8080` and `file:///.../index.html` will not work** — the actor gets a connection error or an empty page and the scan fails or produces nothing. Before you add this as a competitor, it needs a real public `https://` URL that someone else's machine can open.

## Hosting option 1 (recommended): Netlify Drop

Fastest path to a public URL — no account setup wizard, no CLI, no git, and it is a drag-and-drop to redeploy mid-demo.

1. Go to <https://app.netlify.com/drop>.
2. Drag the `demo-site/` folder onto the page. You get a URL like `https://sunny-taco-1a2b3c.netlify.app` within seconds.
3. Sign in when prompted to claim the site so the URL stays alive for the demo.
4. To redeploy after editing: open the site's **Deploys** tab and drag `demo-site/` on again. **The URL stays the same**, which matters because it is baked into the seeded competitor row.

Netlify also serves HTML with revalidating cache headers by default, which makes the mid-demo edit show up immediately. GitHub Pages and Cloudflare Pages both work too, but Pages needs a repo plus a build wait, and Cloudflare needs a project setup — slower when you're on the clock.

## Hosting option 2 (fallback): tunnel to a local copy

```bash
python3 -m http.server 8080 --directory demo-site
# in a second terminal
ngrok http 8080
```

Use the `https://` forwarding URL ngrok prints.

**Drawback:** the tunnel URL changes every time ngrok restarts, and the old URL is stored in the competitor's `page_urls`. A restart means the seeded row now points at a dead host and the scan errors — you have to update the row. Also, ngrok's free tier can serve a browser warning interstitial to non-browser clients, so the crawler may capture that page instead of the menu. Check the tunnel URL from a phone or an incognito window before trusting it.

## Demo choreography

1. **Host it.** Get the public URL and open it in a browser to confirm the menu and prices render.
2. **Register it.** Add it as a competitor for the seeded business (or replace the `<<YOUR-DEMO-SITE-URL>>` placeholder in `supabase/seed.sql` before seeding).
3. **First scan = baseline.** Trigger a scan. This one has nothing to diff against, so it stores the first snapshot and produces `baseline` signals describing where this competitor stands today. Show those on screen.
4. **Make the change.** Open `demo-site/index.html`, find the loud `DEMO CHANGE GOES HERE` comment block above the Sides section, copy the markup between the two `COPY` lines, and paste it directly below that comment block. Save.
5. **Redeploy.** Drag `demo-site/` onto the Netlify Deploys tab again (or just save, if you're tunneling a local folder).
6. **Verify it's really live.** Reload the public URL in a fresh incognito window and confirm you see **Weekday Lunch Special $15**.
7. **Rescan.** Trigger the scan again and show the new `change` signal about the $15 weekday lunch special landing on top of the owner's $12.95 lunch plate.

## Cache warning — read this before you hit rescan

Some static hosts and CDNs cache HTML aggressively. If the crawler is served the pre-edit version, the content hash is identical to the previous snapshot and the workflow **correctly** short-circuits with "no change" — but on stage that looks exactly like a broken pipeline.

Always do step 6. Load the public URL in an incognito window (or `curl -s <url> | grep 15` from a terminal) and confirm the new price is actually being served before you trigger the rescan. If the host is stale, wait for it to expire or add a throwaway query string when re-checking.
