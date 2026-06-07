import { describe, it, expect } from "vitest";
import { isAdmin } from "@/lib/admin";
import type { Profile } from "@/lib/types";

const adminProfile: Profile = {
  id: "admin-1",
  name: "Admin User",
  email: "admin@urbanai.co",
  role: "admin",
};

const studentProfile: Profile = {
  id: "student-1",
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "student",
};

describe("isAdmin", () => {
  it("returns true for a profile with role admin", () => {
    expect(isAdmin(adminProfile)).toBe(true);
  });

  it("returns false for a profile with role student", () => {
    expect(isAdmin(studentProfile)).toBe(false);
  });
});
