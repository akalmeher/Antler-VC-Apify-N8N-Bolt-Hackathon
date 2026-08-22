-- m.rror hackathon demo seed
-- Mission Fuego — San Francisco
--
-- Snapshots and signals are intentionally absent.
-- They must come from real scans through the production pipeline.

insert into businesses (
  id,
  name,
  category,
  address,
  city,
  offerings
)
values (
  '11111111-1111-4111-8111-111111111111',
  'Mission Fuego',
  'restaurant',
  null,
  'Mission District, San Francisco, CA',
  'Fast-casual Mission District taqueria serving tacos, breakfast burritos, and lunch plates. Street tacos $4.25 each, breakfast burrito $10.50, weekday lunch plate: 3 tacos + chips for $14.95. Open Monday-Friday 7am-4pm and Saturday-Sunday 8am-4pm. Strong breakfast traffic from nearby workers and students, but weaker weekday lunch and limited evening business.'
)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  address = excluded.address,
  city = excluded.city,
  offerings = excluded.offerings;


-- Final San Francisco competitor watchlist.
-- Competitors start pending so a restored demo generates fresh,
-- grounded snapshots and signals through the real scan workflow.

insert into competitors (
  id,
  business_id,
  name,
  url,
  page_urls,
  status
)
values
  (
    '92e03756-10ec-45f7-9df2-36232dc550a2',
    '11111111-1111-4111-8111-111111111111',
    'Buena Vida Cantina on Belden',
    'http://cantinaonbelden.com/',
    array['http://cantinaonbelden.com/'],
    'pending'
  ),
  (
    '301efd70-b426-4b07-a0ee-3f78d2aac5b4',
    '11111111-1111-4111-8111-111111111111',
    'La China Poblana',
    'https://lachinapoblanarestaurantca.com/',
    array['https://lachinapoblanarestaurantca.com/'],
    'pending'
  ),
  (
    'efc53d8c-5ffe-4ad8-a37d-aedfcbcd3af6',
    '11111111-1111-4111-8111-111111111111',
    'Street Taco',
    'http://streettacosf.com/',
    array['http://streettacosf.com/'],
    'pending'
  ),
  (
    'c149ba94-d445-4ff9-97cd-888a3411614c',
    '11111111-1111-4111-8111-111111111111',
    'Taqueria Dos Charros San Francisco',
    'https://ordertaqueriadoscharros.com/',
    array['https://ordertaqueriadoscharros.com/'],
    'pending'
  ),
  (
    '6fea4bc7-8e89-407e-b1ac-b859b100d321',
    '11111111-1111-4111-8111-111111111111',
    'Taqueria Mana',
    'https://taqueriamanacalifornia.com/',
    array['https://taqueriamanacalifornia.com/'],
    'pending'
  ),
  (
    '1840f5bd-a332-4a95-9859-08b3c4e94047',
    '11111111-1111-4111-8111-111111111111',
    'Tropisueno',
    'https://www.tropisueno.com/',
    array['https://www.tropisueno.com/'],
    'pending'
  ),
  (
    '2cea0842-4378-47f2-b8c7-4695f8aa4c23',
    '11111111-1111-4111-8111-111111111111',
    'Uno Dos Tacos',
    'https://unodostacos.com/',
    array['https://unodostacos.com/'],
    'pending'
  )
on conflict (id) do update set
  business_id = excluded.business_id,
  name = excluded.name,
  url = excluded.url,
  page_urls = excluded.page_urls;
