-- Demo data. Snapshots and signals are intentionally absent: they must come from a real scan.

insert into businesses (id, name, category, city, offerings)
values (
  '11111111-1111-4111-8111-111111111111',
  'Taco Fuego', 'restaurant', 'Austin, TX',
  'Counter-service tacos and breakfast burritos. Street tacos $3.75 each, breakfast burrito $8.50, weekday lunch plate (3 tacos + chips) $12.95. Open 7am-3pm. Strong breakfast rush, weak lunch traffic.'
)
on conflict (id) do nothing;

-- Two competitors for the demo:
--   1. El Chilito — a real, live Austin counter-service taqueria. Its menu is
--      server-rendered HTML with prices as plain text (no PDF, no iframe), so the
--      crawler actually sees numbers. Proves the pipeline survives the real web.
--   2. Media Luna Taqueria — the page in demo-site/ that we control and edit on
--      stage, so a real change can be detected live. REPLACE the placeholder URL
--      below with the public URL you get after hosting it (see demo-site/README.md);
--      localhost and file:// will not work because Apify crawls from the cloud.

insert into competitors (business_id, name, url, page_urls)
select v.business_id, v.name, v.url, v.page_urls
from (
  values
    (
      '11111111-1111-4111-8111-111111111111'::uuid,
      'El Chilito',
      'https://www.elchilito.com/',
      array['https://www.elchilito.com/menu']
    ),
    (
      '11111111-1111-4111-8111-111111111111'::uuid,
      'Media Luna Taqueria',
      'https://effulgent-semifreddo-401290.netlify.app/',
      array['https://effulgent-semifreddo-401290.netlify.app/']
    )
) as v(business_id, name, url, page_urls)
where not exists (
  select 1 from competitors c
  where c.business_id = v.business_id
    and c.name = v.name
);
