begin;

-- Messages must pass through the rate-limited RPC. Direct REST inserts are
-- intentionally disabled so clients cannot bypass validation or throttling.
revoke insert on public.chat_messages from authenticated;
drop policy if exists "Account holders write own chat messages" on public.chat_messages;

-- The minigames UI was removed. Remove its unused multiplayer backend as well
-- instead of leaving callable functions and a realtime table exposed.
drop function if exists public.resign_chess_game(uuid);
drop function if exists public.play_chess_move(uuid, text, text, text, text, text, text);
drop function if exists public.join_chess_game(uuid, text);
drop function if exists public.create_chess_game(text);
drop table if exists public.chess_games;

commit;
