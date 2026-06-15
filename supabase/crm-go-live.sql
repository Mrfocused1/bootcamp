-- ===========================================================================
-- CRM go-live: assign the 2 co-owners + 1 staff member.
-- ===========================================================================
-- The CRM is gated on profiles.role = 'admin' (access) and profiles.crm_role
-- ('owner' = full pipeline + analytics, 'staff' = outreach tracking).
--
-- STEP 1 — have all three people sign up / log in once via the live site
--          (bridgewayaibootcamp.com/login) so they get a row in `profiles`.
--
-- STEP 2 — run the statements below in the Supabase SQL editor, swapping in
--          their real emails. (Owners can see & manage everything; staff can
--          log + view all outreach but can't see analytics or delete leads.)

-- Co-owner #1
update profiles set role = 'admin', crm_role = 'owner'
  where email = 'paul@bridgewayaibootcamp.com';

-- Co-owner #2
update profiles set role = 'admin', crm_role = 'owner'
  where email = 'maya@bridgewayaibootcamp.com';

-- Staff / employee
update profiles set role = 'admin', crm_role = 'staff'
  where email = 'jamie@bridgewayaibootcamp.com';

-- STEP 3 — verify:
select name, email, role, crm_role from profiles where crm_role is not null order by crm_role;
