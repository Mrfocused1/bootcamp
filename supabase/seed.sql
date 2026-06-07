-- Urban AI learning app — seed content (5 days, one lesson each).
-- Mirrors the marketing-site curriculum. Video fields are placeholders
-- (admin sets video_provider/video_id once a host is chosen).

insert into days (day_index, title, description) values
  (1, 'Build the look',        'Get a great-looking site on screen with AI.'),
  (2, 'Make it real',          'Store and remember real data.'),
  (3, 'Get paid & connected',  'Take payments and talk to customers.'),
  (4, 'Launch it live',        'Put your site on the internet.'),
  (5, 'Get found & grow',      'Help people find you on Google.')
on conflict (day_index) do nothing;

insert into lessons (day_id, title, video_provider, video_id, duration_seconds, resources, "order")
select d.id, l.title, null, null, 3600, '[]'::jsonb, 1
from days d
join (values
  (1, 'Day 1 — Cursor, cloning, AI images & voice coding'),
  (2, 'Day 2 — Databases (Supabase) & GitHub'),
  (3, 'Day 3 — Payments (Stripe), emails (Resend) & CRMs'),
  (4, 'Day 4 — Hosting, domains & debugging'),
  (5, 'Day 5 — SEO, growth & live Q&A')
) as l(day_index, title) on l.day_index = d.day_index
on conflict do nothing;
