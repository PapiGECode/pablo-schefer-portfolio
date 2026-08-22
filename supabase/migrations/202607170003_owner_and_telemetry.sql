begin;

grant delete on public.chat_messages to authenticated;
grant delete on public.reviews to authenticated;

drop policy if exists "Owner moderates chat" on public.chat_messages;
create policy "Owner moderates chat"
  on public.chat_messages
  for delete
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'pablopme41@gmail.com');

drop policy if exists "Owner moderates reviews" on public.reviews;
create policy "Owner moderates reviews"
  on public.reviews
  for delete
  to authenticated
  using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'pablopme41@gmail.com');

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.hardware_metrics (
  id smallint primary key default 1 check (id = 1),
  captured_at timestamptz not null default now(),
  payload jsonb not null
);

alter table public.hardware_metrics enable row level security;
revoke all on public.hardware_metrics from anon, authenticated;
grant select on public.hardware_metrics to anon, authenticated;

drop policy if exists "Hardware metrics are public" on public.hardware_metrics;
create policy "Hardware metrics are public"
  on public.hardware_metrics
  for select
  to anon, authenticated
  using (true);

create or replace function public.publish_hardware_metrics(shared_secret text, metrics jsonb)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if shared_secret is null
     or pg_catalog.encode(extensions.digest(shared_secret, 'sha256'), 'hex')
       <> '5b10a641b7e07070a43cab5e50ae6de100e1f999659e3c9ddbd06e285f6dfedb' then
    raise exception 'invalid_telemetry_secret';
  end if;

  if metrics is null
     or jsonb_typeof(metrics) <> 'object'
     or pg_catalog.octet_length(metrics::text) > 16000 then
    raise exception 'invalid_telemetry_payload';
  end if;

  insert into public.hardware_metrics (id, captured_at, payload)
  values (1, now(), metrics)
  on conflict (id) do update
    set captured_at = excluded.captured_at,
        payload = excluded.payload;
end;
$$;

revoke all on function public.publish_hardware_metrics(text, jsonb) from public, authenticated;
grant execute on function public.publish_hardware_metrics(text, jsonb) to anon;

commit;
