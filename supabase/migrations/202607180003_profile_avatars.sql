begin;

alter table public.chat_messages add column if not exists avatar_url text;
alter table public.reviews add column if not exists avatar_url text;

-- Read the avatar from the authenticated user's metadata when a message is sent.
-- This keeps the displayed identity consistent even if a client sends a forged URL.
create or replace function public.send_chat_message(message_body text, display_name text)
returns public.chat_messages
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  created_message public.chat_messages;
  safe_body text := left(trim(coalesce(message_body, '')), 600);
  safe_name text := left(trim(coalesce(display_name, '')), 32);
  recent_count integer;
  safe_avatar text;
begin
  if auth.uid() is null then raise exception 'authentication_required'; end if;
  if char_length(safe_body) < 1 or char_length(safe_name) < 3 then raise exception 'invalid_message'; end if;

  select count(*) into recent_count from public.chat_messages
    where user_id = auth.uid() and created_at > now() - interval '30 seconds';
  if recent_count >= 5 then raise exception 'chat_rate_limited'; end if;

  select count(*) into recent_count from public.chat_messages
    where user_id = auth.uid() and created_at > now() - interval '1 hour';
  if recent_count >= 80 then raise exception 'chat_rate_limited'; end if;

  select left(raw_user_meta_data->>'avatar_url', 500) into safe_avatar from auth.users where id = auth.uid();
  insert into public.chat_messages (user_id, username, body, avatar_url)
    values (auth.uid(), safe_name, safe_body, safe_avatar)
    returning * into created_message;
  return created_message;
end;
$$;

revoke all on function public.send_chat_message(text, text) from public, anon;
grant execute on function public.send_chat_message(text, text) to authenticated;

commit;
