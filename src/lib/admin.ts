import type { Profile } from "@/lib/types";

/** Returns true when the profile has the admin role. */
export function isAdmin(profile: Profile): boolean {
  return profile.role === "admin";
}

/** CRM users are admins (the 2 co-owners + the 1 staff member). */
export function isCrmUser(profile: Profile): boolean {
  return profile.role === "admin";
}

/** Co-owners get the full pipeline plus website + team analytics. */
export function isOwner(profile: Profile): boolean {
  return profile.role === "admin" && profile.crm_role === "owner";
}
