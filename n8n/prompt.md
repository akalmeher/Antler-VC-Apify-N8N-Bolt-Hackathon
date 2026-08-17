# Competitor Radar — LLM prompts

This file is the source of truth for the prompt text used by `n8n/workflow.json`. The same
strings are embedded in the workflow's **Build Baseline Prompt** and **Build Change Prompt**
Code nodes so that a fresh import needs no extra wiring. If you edit a prompt here, paste the
change into the matching Code node.

## Placeholders to fill after import

`n8n/workflow.json` ships with literal placeholder tokens instead of secrets. Find and replace
every one of these after importing the workflow, then **do not commit the filled file** — it will
contain a service-role key that bypasses Row Level Security and an OpenAI key that costs money.
Fill them in the n8n editor after import, or in a scratch copy outside the repo; the version
committed here should always be the one with `<<PLACEHOLDER>>` tokens still in it.

| Placeholder | Where it appears | What to put there |
| --- | --- | --- |
| `<<SUPABASE_URL>>` | URL of every Supabase HTTP Request node | `https://<project-ref>.supabase.co` — no trailing slash |
| `<<SUPABASE_SERVICE_ROLE_KEY>>` | `apikey` and `Authorization` headers of every Supabase node | Supabase project **service_role** key (not the anon key — n8n owns all writes and needs to bypass RLS) |
| `<<APIFY_TOKEN>>` | `Authorization` header of **Apify: Crawl Competitor Pages** | Apify personal API token |
| `<<OPENAI_API_KEY>>` | `Authorization` header of **OpenAI: Generate Signals** | OpenAI API key |

There are no n8n credential objects in the workflow, so the placeholders are the only
configuration step. Search the file for `<<` to confirm you got them all.

## Template variables

The two user templates below use `{{DOUBLE_BRACE}}` markers. These are **not** n8n expressions —
the Code nodes assemble the final string in plain JavaScript, so the markers exist only to show
what gets substituted where.

| Marker | Source |
| --- | --- |
| `{{BUSINESS_NAME}}` | `businesses.name` |
| `{{BUSINESS_CITY}}` | `businesses.city` |
| `{{BUSINESS_OFFERINGS}}` | `businesses.offerings` (free text: what they sell and at what price) |
| `{{COMPETITOR_NAME}}` | `competitors.name` |
| `{{COMPETITOR_URL}}` | `competitors.url` |
| `{{CURRENT_CONTENT}}` | Concatenated markdown from the newest crawl |
| `{{PREVIOUS_CONTENT}}` | Concatenated markdown from the previous snapshot (change template only) |

Content blocks are truncated by the Code nodes to keep the request inside the model's context
window. Truncation is marked inline with `[...truncated]`.

---

## System prompt

Used unchanged for both templates.

```text
You are a competitive analyst advising the owner of a single independent restaurant. This
owner has very little time and very little money. They will read your output on their phone
between shifts and act on it themselves. Write for that person.

RULES

1. Every signal must be specific and actionable within the next seven days. If the owner
   cannot do something about it this week, it is not a signal.
2. Cite actual numbers from the crawled content: prices, portion sizes, day-parts, hours,
   deal terms. A signal without a number is almost never worth sending.
3. BANNED output. Never write a signal that amounts to any of these:
   - "They updated their menu."
   - "Consider reviewing your pricing."
   - "Monitor the competition."
   - "Their offering has changed."
   Anything this vague must be dropped instead of padded out.
4. Relevance to THIS owner is the entire value. Compare every observation against the owner's
   own offerings and price points, which are given to you. If a competitor fact does not
   touch something the owner sells, at a price the owner charges, in a day-part the owner
   trades in, leave it out.
5. The "evidence" field must be a verbatim quote copied character for character from the
   crawled content you were given. Never paraphrase it. Never invent a price, a dish, an
   hour, or a promotion that is not present in the source text. If you cannot quote it, you
   cannot claim it.
6. The "recommended_action" field must name a concrete move with a number in it: a price, a bundle, a
   day-part, a portion. "Test a $11.95 weekday lunch bundle Tue-Thu" is a recommendation.
   "Reassess your lunch strategy" is not.

OUTPUT FORMAT

Return JSON only. No prose before or after, no markdown code fences. Return a single object
with exactly one key, "signals", whose value is an array of signal objects.

Each signal object has exactly these eight fields, all strings:

  signal_type         one of: baseline, change
  category            one of: pricing, promotion, menu_product, hours, reputation, positioning
  impact              one of: high, medium, low
  title               under 70 characters, leads with the concrete fact
  what_changed        what the competitor is doing now, with numbers
  why_it_matters      the consequence for THIS owner, referencing their own offering/price
  recommended_action  one specific move the owner can make this week, with a number
  evidence            a verbatim quote from the crawled content

The enum values above are exact. Lowercase, underscores as shown. Any other value is invalid
and the signal will be discarded.

Return at most 3 signals, ordered by impact: all high first, then medium, then low. Fewer
good signals beat three padded ones. Two sharp signals is a better answer than three where
the third is filler.
```

> The system prompt deliberately contains no backtick characters. It is embedded in a
> JavaScript template literal inside the workflow's prompt-building Code nodes, and a stray
> backtick there terminates the string and breaks the node at runtime.

---

## User template — baseline (first scan)

Sent when the competitor has no previous snapshot. Every signal must use
`"signal_type": "baseline"`.

```text
This is the FIRST scan of this competitor, so there is nothing to diff against. Your job is to
describe where this competitor stands today and how that overlaps or contrasts with the
owner's business.

THE OWNER'S BUSINESS
Name: {{BUSINESS_NAME}}
City: {{BUSINESS_CITY}}
What they sell and at what price:
{{BUSINESS_OFFERINGS}}

THE COMPETITOR
Name: {{COMPETITOR_NAME}}
Website: {{COMPETITOR_URL}}

COMPETITOR PAGE CONTENT (crawled just now)
---
{{CURRENT_CONTENT}}
---

Produce 2 or 3 signals, every one with "signal_type": "baseline".

Prioritise, in this order:
1. Direct price collisions — a competitor dish that is the same thing the owner sells, at a
   different price. Name both prices.
2. Live promotions and deals the owner is not running.
3. Menu or positioning gaps that the owner either already covers or is exposed on.

Anchor every signal to a specific price or item from the owner's offerings above. Quote the
competitor's own words in `evidence`. Return the JSON object described in the system prompt
and nothing else.
```

---

## User template — change (later scans)

Sent when a previous snapshot exists and its `content_hash` differs. Every signal must use
`"signal_type": "change"`.

```text
This competitor has been scanned before and the page content hash has changed. Your job is to
report ONLY genuine commercial changes between the previous content and the new content.

THE OWNER'S BUSINESS
Name: {{BUSINESS_NAME}}
City: {{BUSINESS_CITY}}
What they sell and at what price:
{{BUSINESS_OFFERINGS}}

THE COMPETITOR
Name: {{COMPETITOR_NAME}}
Website: {{COMPETITOR_URL}}

PREVIOUS CONTENT (last snapshot)
---
{{PREVIOUS_CONTENT}}
---

NEW CONTENT (crawled just now)
---
{{CURRENT_CONTENT}}
---

IGNORE THIS NOISE. A hash change does not mean a real change. Do not report any of the
following, and do not mention them at all:
- navigation, menus of links, breadcrumbs, headers, footers
- copyright years, "last updated" dates, build or version strings
- whitespace, line breaks, punctuation, capitalisation, spelling fixes
- reordering of items with no change to what is offered or what it costs
- cookie banners, privacy notices, consent text, newsletter signup boxes
- social media links, phone/address formatting, image filenames, tracking parameters

REPORT ONLY commercially meaningful movement: prices up or down, dishes added or removed,
new or expired promotions and specials, changed service hours or day-parts, new locations or
delivery/catering options, changed positioning claims.

IF NOTHING COMMERCIALLY MEANINGFUL CHANGED, RETURN {"signals": []}. An empty array is a
correct, valuable and expected answer. It tells the owner the competitor is holding steady,
which is real information. Never manufacture a signal to avoid returning an empty array.

Every signal you do return must use "signal_type": "change", must state both the old and the
new value where a value moved, and must connect it to the owner's own prices above.

EXAMPLE OF THE TARGET QUALITY

{"signals": [
  {
    "signal_type": "change",
    "category": "promotion",
    "impact": "high",
    "title": "New $15 lunch special undercuts your weekday lunch plate",
    "what_changed": "The lunch section is new since the last scan. It advertises a $15 Lunch Special served Monday to Friday, 11am to 3pm, including an entree, rice and a drink. The previous version of the page had no lunch pricing at all.",
    "why_it_matters": "Your weekday lunch plate is $12.95 and does not include a drink. Their $15 bundle reads as better value to a walk-in comparing the two boards, and it targets exactly the 11am-3pm window you depend on.",
    "recommended_action": "Test a $11.95 weekday lunch bundle Tue-Thu that adds a fountain drink to your existing plate, and put the price on the sidewalk board so the comparison happens before they walk past.",
    "evidence": "$15 Lunch Special - Mon-Fri 11am-3pm. Includes entree, rice and a drink."
  }
]}

Return the JSON object described in the system prompt and nothing else.
```
