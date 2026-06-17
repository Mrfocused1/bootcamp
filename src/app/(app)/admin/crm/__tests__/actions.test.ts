import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Profile } from "@/lib/types";

vi.mock("@/lib/mock", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mock")>("@/lib/mock");
  return { ...actual, IS_MOCK: true };
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`REDIRECT:${url}`);
  }),
}));
vi.mock("@/lib/queries", () => ({ getCurrentProfile: vi.fn() }));

import { getCurrentProfile } from "@/lib/queries";
const mockGetCurrentProfile = getCurrentProfile as ReturnType<typeof vi.fn>;

const adminProfile: Profile = { id: "admin-1", name: "Admin", email: "admin@x.co", role: "admin" };
const studentProfile: Profile = { id: "s-1", name: "Alex", email: "a@x.co", role: "student" };

describe("sendLeadEmail", () => {
  beforeEach(() => vi.resetModules());

  it("throws Forbidden when called by a student", async () => {
    mockGetCurrentProfile.mockResolvedValue(studentProfile);
    const { sendLeadEmail } = await import("@/app/(app)/admin/crm/actions");
    await expect(sendLeadEmail(new FormData())).rejects.toThrow("Forbidden");
  });

  it("redirects to ?sent=1 for an admin in mock mode", async () => {
    mockGetCurrentProfile.mockResolvedValue(adminProfile);
    const { sendLeadEmail } = await import("@/app/(app)/admin/crm/actions");
    const fd = new FormData();
    fd.set("lead_id", "lead-1");
    fd.set("subject", "Hello");
    fd.set("body", "A message");
    await expect(sendLeadEmail(fd)).rejects.toThrow("REDIRECT:/admin/crm/leads/lead-1?sent=1");
  });

  it("redirects with an error when subject/body are missing", async () => {
    mockGetCurrentProfile.mockResolvedValue(adminProfile);
    const { sendLeadEmail } = await import("@/app/(app)/admin/crm/actions");
    const fd = new FormData();
    fd.set("lead_id", "lead-1");
    await expect(sendLeadEmail(fd)).rejects.toThrow(/REDIRECT:\/admin\/crm\/leads\/lead-1\?error=/);
  });
});
