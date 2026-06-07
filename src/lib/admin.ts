import type { Profile } from "@/lib/types";

/** Returns true when the profile has the admin role. */
export function isAdmin(profile: Profile): boolean {
  return profile.role === "admin";
}
