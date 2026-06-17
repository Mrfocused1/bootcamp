import { describe, it, expect } from "vitest";
import { OUTREACH_TEMPLATES, renderTemplate } from "@/lib/outreach-templates";
import type { Lead } from "@/lib/types";

const baseLead: Lead = {
  id: "lead-1", company: "Acme Trust", website: "https://acme.org",
  contact_name: "Sam Lee", email: "sam@acme.org", phone: null,
  status: "new", source: "cold_outreach", priority: "medium", est_value: 0,
  assigned_to: null, created_by: null, notes: null,
  next_follow_up_at: null, last_contacted_at: null,
  created_at: "2026-01-01T00:00:00.000Z", updated_at: "2026-01-01T00:00:00.000Z",
};

describe("renderTemplate", () => {
  it("merges company, contact name and website, and appends the footer", () => {
    const t = OUTREACH_TEMPLATES[0];
    const { subject, body } = renderTemplate(t, baseLead);
    expect(subject).toContain("Acme Trust");
    expect(body).toContain("Hi Sam Lee,");
    expect(body).not.toContain("{{");
    expect(body).toContain("Bridgeway Ai Bootcamp");
    expect(body).toContain("www.bridgewayaibootcamp.com/work");
  });

  it("falls back to a team greeting when there is no contact name", () => {
    const { body } = renderTemplate(OUTREACH_TEMPLATES[0], { ...baseLead, contact_name: null });
    expect(body).toContain("Dear Acme Trust team,");
    expect(body).not.toContain("{{");
  });

  it("ships both seeded templates", () => {
    expect(OUTREACH_TEMPLATES.map((t) => t.id)).toEqual(["website-pitch", "ai-workshop"]);
  });
});
