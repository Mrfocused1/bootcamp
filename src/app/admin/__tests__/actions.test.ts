import { describe, it, expect, vi, beforeEach } from "vitest";
import type { Profile } from "@/lib/types";

// Force mock mode so actions never hit Supabase
vi.mock("@/lib/mock", async () => {
  const actual = await vi.importActual<typeof import("@/lib/mock")>("@/lib/mock");
  return { ...actual, IS_MOCK: true };
});

// Mock next/cache so revalidatePath doesn't crash in test env
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

// We will control what getCurrentProfile returns
vi.mock("@/lib/queries", () => ({
  getCurrentProfile: vi.fn(),
}));

import { getCurrentProfile } from "@/lib/queries";

const mockGetCurrentProfile = getCurrentProfile as ReturnType<typeof vi.fn>;

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

describe("admin server actions — authorization", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  describe("saveLesson", () => {
    it("throws Forbidden when called by a student", async () => {
      mockGetCurrentProfile.mockResolvedValue(studentProfile);
      const { saveLesson } = await import("@/app/admin/actions");
      await expect(saveLesson(new FormData())).rejects.toThrow("Forbidden");
    });

    it("resolves without error when called by an admin", async () => {
      mockGetCurrentProfile.mockResolvedValue(adminProfile);
      const { saveLesson } = await import("@/app/admin/actions");
      await expect(saveLesson(new FormData())).resolves.toBeUndefined();
    });
  });

  describe("setAccess", () => {
    it("throws Forbidden when called by a student", async () => {
      mockGetCurrentProfile.mockResolvedValue(studentProfile);
      const { setAccess } = await import("@/app/admin/actions");
      await expect(setAccess("student-2", "revoked")).rejects.toThrow("Forbidden");
    });

    it("resolves without error when called by an admin", async () => {
      mockGetCurrentProfile.mockResolvedValue(adminProfile);
      const { setAccess } = await import("@/app/admin/actions");
      await expect(setAccess("student-2", "active")).resolves.toBeUndefined();
    });
  });

  describe("saveCohort", () => {
    it("throws Forbidden when called by a student", async () => {
      mockGetCurrentProfile.mockResolvedValue(studentProfile);
      const { saveCohort } = await import("@/app/admin/actions");
      await expect(saveCohort(new FormData())).rejects.toThrow("Forbidden");
    });

    it("resolves without error when called by an admin", async () => {
      mockGetCurrentProfile.mockResolvedValue(adminProfile);
      const { saveCohort } = await import("@/app/admin/actions");
      await expect(saveCohort(new FormData())).resolves.toBeUndefined();
    });
  });

  describe("saveLiveSession", () => {
    it("throws Forbidden when called by a student", async () => {
      mockGetCurrentProfile.mockResolvedValue(studentProfile);
      const { saveLiveSession } = await import("@/app/admin/actions");
      await expect(saveLiveSession(new FormData())).rejects.toThrow("Forbidden");
    });

    it("resolves without error when called by an admin", async () => {
      mockGetCurrentProfile.mockResolvedValue(adminProfile);
      const { saveLiveSession } = await import("@/app/admin/actions");
      await expect(saveLiveSession(new FormData())).resolves.toBeUndefined();
    });
  });

  describe("postAnnouncement", () => {
    it("throws Forbidden when called by a student", async () => {
      mockGetCurrentProfile.mockResolvedValue(studentProfile);
      const { postAnnouncement } = await import("@/app/admin/actions");
      await expect(postAnnouncement(new FormData())).rejects.toThrow("Forbidden");
    });

    it("resolves without error when called by an admin", async () => {
      mockGetCurrentProfile.mockResolvedValue(adminProfile);
      const { postAnnouncement } = await import("@/app/admin/actions");
      await expect(postAnnouncement(new FormData())).resolves.toBeUndefined();
    });
  });
});
