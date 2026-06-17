-- Clear the "public can execute SECURITY DEFINER function" advisor.
-- These stay SECURITY DEFINER (RLS policies call them as definer); we only
-- remove direct RPC exposure to the API roles.
revoke execute on function public.is_admin() from anon, authenticated;
revoke execute on function public.is_crm_owner() from anon, authenticated;
revoke execute on function public.max_unlocked_day() from anon, authenticated;
