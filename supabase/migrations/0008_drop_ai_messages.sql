-- Remove the AI study assistant feature: drop its table + policy.
drop policy if exists ai_rw on public.ai_messages;
drop table if exists public.ai_messages;
