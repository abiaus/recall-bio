WITH data(id, life_stage) AS (
  VALUES
  ('fddae918-e91f-4733-afb9-77a80f7cfd7a'::uuid, '["adult","midlife","senior"]'),
  ('fddbc1de-58d2-4787-b7ec-90d963b6b01e'::uuid, '["teen","young_adult","adult","midlife"]'),
  ('fdff059b-45c4-453e-93ed-1396db2425a9'::uuid, '["teen","young_adult","adult","midlife","senior"]'),
  ('fe2571f6-aeac-425b-98e4-055b08023e53'::uuid, '["midlife","senior"]'),
  ('ff0f4433-605a-4eae-a6a8-7bdb7601d323'::uuid, '["adult","midlife"]'),
  ('ff284cc3-0aad-4cf8-904a-c842043dfc8e'::uuid, '["teen","young_adult","adult"]'),
  ('ff347ca5-d1e3-495f-9870-2bbe2b27847a'::uuid, '["young_adult","adult","midlife"]'),
  ('ffa47ddf-7960-41ad-8327-00b913910c60'::uuid, '["midlife","senior"]'),
  ('ffe5d7cd-7377-4b36-8a81-c301facf3839'::uuid, '["young_adult","adult","midlife"]'),
  ('ffe98f50-2199-4ad2-9c3f-9ca22407f348'::uuid, '["young_adult","midlife","senior"]')
)
UPDATE public.questions q
SET life_stage = d.life_stage
FROM data d
WHERE q.id = d.id;
