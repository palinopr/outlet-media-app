-- Normalize active campaign ownership rows so every campaign resolves to a real client account.

insert into public.clients (name, slug, status)
values
  ('Outlet Media', 'outlet_media', 'inactive'),
  ('Chris R', 'chris_r', 'active'),
  ('Proteccion Final', 'proteccion_final', 'active')
on conflict (slug) do update
set
  name = excluded.name,
  status = excluded.status;

insert into public.campaign_client_overrides (campaign_id, client_slug, updated_at)
values
  ('120243788005450525', 'outlet_media', now()),
  ('120244208515980525', 'chris_r', now()),
  ('120244284580260525', 'proteccion_final', now()),
  ('120243528604840525', 'distill_pr', now()),
  ('120242848886600525', 'vaz_vil_enterprise', now())
on conflict (campaign_id) do update
set
  client_slug = excluded.client_slug,
  updated_at = excluded.updated_at;

update public.meta_campaigns
set client_slug = case campaign_id
  when '120243788005450525' then 'outlet_media'
  when '120244208515980525' then 'chris_r'
  when '120244284580260525' then 'proteccion_final'
  when '120243528604840525' then 'distill_pr'
  when '120242848886600525' then 'vaz_vil_enterprise'
  else client_slug
end
where campaign_id in (
  '120243788005450525',
  '120244208515980525',
  '120244284580260525',
  '120243528604840525',
  '120242848886600525'
);
