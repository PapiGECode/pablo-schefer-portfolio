begin;

-- Keep privileged-looking names out of the public chat identity field.
-- The owner may use the explicit branded display name PapiGEGamer(Owner).
create or replace function public.send_chat_message(message_body text, display_name text)
returns public.chat_messages
language plpgsql
security definer
set search_path = ''
as $$
declare
  created_message public.chat_messages;
  safe_body text := left(trim(message_body), 600);
  safe_name text := left(trim(display_name), 32);
  recent_count integer;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  if char_length(safe_body) < 1 or char_length(safe_name) < 3 then raise exception 'invalid_message'; end if;
  if lower(safe_name) in ('owner', 'admin', 'administrator', 'moderator', 'moderador', 'system', 'support', 'staff')
     and lower(coalesce(auth.jwt() ->> 'email', '')) <> 'pablopme41@gmail.com' then
    raise exception 'reserved_username';
  end if;
  select count(*) into recent_count from public.chat_messages where user_id = auth.uid() and created_at > now() - interval '30 seconds';
  if recent_count >= 5 then raise exception 'chat_rate_limited'; end if;
  select count(*) into recent_count from public.chat_messages where user_id = auth.uid() and created_at > now() - interval '1 hour';
  if recent_count >= 80 then raise exception 'chat_rate_limited'; end if;
  insert into public.chat_messages (user_id, username, body) values (auth.uid(), safe_name, safe_body) returning * into created_message;
  return created_message;
end;
$$;

revoke all on function public.send_chat_message(text, text) from public, anon;
grant execute on function public.send_chat_message(text, text) to authenticated;

-- Migrate the legacy account label whenever the account is next used in the app;
-- existing public messages are rendered through the same alias map in the client.
commit;
