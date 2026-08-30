-- Restore the authenticated RPC used by the public community chat.
-- This function intentionally remains SECURITY DEFINER so clients cannot
-- insert directly into chat_messages or bypass validation/rate limits.

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
begin
  if auth.uid() is null then
    raise exception 'authentication_required';
  end if;

  if char_length(safe_body) < 1 or char_length(safe_name) < 3 then
    raise exception 'invalid_message';
  end if;

  select count(*)
    into recent_count
    from public.chat_messages
   where user_id = auth.uid()
     and created_at > now() - interval '30 seconds';

  if recent_count >= 5 then
    raise exception 'chat_rate_limited';
  end if;

  select count(*)
    into recent_count
    from public.chat_messages
   where user_id = auth.uid()
     and created_at > now() - interval '1 hour';

  if recent_count >= 80 then
    raise exception 'chat_rate_limited';
  end if;

  insert into public.chat_messages (user_id, username, body)
  values (auth.uid(), safe_name, safe_body)
  returning * into created_message;

  return created_message;
end;
$$;

revoke all on function public.send_chat_message(text, text) from public, anon;
grant execute on function public.send_chat_message(text, text) to authenticated;
