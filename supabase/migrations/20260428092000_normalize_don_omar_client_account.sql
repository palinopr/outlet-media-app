-- Keep the Don Omar Barcelona campaign on the Don Omar BCN client account.

insert into public.clients (name, slug, status)
values ('Don Omar BCN', 'don_omar_bcn', 'active')
on conflict (slug) do update
set
  name = excluded.name,
  status = excluded.status;

insert into public.campaign_client_overrides (campaign_id, client_slug, updated_at)
values ('120243011364360525', 'don_omar_bcn', now())
on conflict (campaign_id) do update
set
  client_slug = excluded.client_slug,
  updated_at = excluded.updated_at;

update public.meta_campaigns
set client_slug = 'don_omar_bcn'
where campaign_id = '120243011364360525';

update public.clients
set status = 'inactive'
where slug = 'don_omar';
