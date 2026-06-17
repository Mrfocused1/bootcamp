import type { Lead } from "@/lib/types";

export interface OutreachTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
}

const FOOTER = `Warm regards,
Paul
Bridgeway Ai Bootcamp

You can see more of the work we've done here: www.bridgewayaibootcamp.com/work`;

export const OUTREACH_TEMPLATES: OutreachTemplate[] = [
  {
    id: "website-pitch",
    label: "Website pitch",
    subject: "Helping {{company}} reach more people online",
    body: `{{greeting}}

I've been looking at the work {{company}} does, and it really stood out.

I help mission-driven organisations strengthen their online presence — not just how a site looks, but how well it works to bring people in. I think there's real scope to help more people discover and support what you do.

I'd love to learn more about where you're headed and explore how we might be able to help. Would you be the right person to speak to, or could you point me to whoever is?`,
  },
  {
    id: "ai-workshop",
    label: "AI-workshop pitch",
    subject: "A practical AI workshop for {{company}}",
    body: `{{greeting}}

I've been reading about the work {{company}} does, and it's clearly important — and growing.

I run Bridgeway Ai Bootcamp, where we deliver practical, jargon-free AI workshops. I'd love to offer one to your team or the people you support — a hands-on session that builds confidence and real, future-facing skills.

I'd love to learn more about where you're headed and explore whether a workshop could be useful. Would you be the right person to speak to, or could you point me to whoever is?`,
  },
];

export function renderTemplate(
  template: OutreachTemplate,
  lead: Lead,
): { subject: string; body: string } {
  const greeting = lead.contact_name
    ? `Hi ${lead.contact_name},`
    : `Dear ${lead.company} team,`;

  const fill = (s: string): string =>
    s
      .replace(/\{\{greeting\}\}/g, greeting)
      .replace(/\{\{contact_name\}\}/g, lead.contact_name ?? "")
      .replace(/\{\{company\}\}/g, lead.company)
      .replace(/\{\{website\}\}/g, lead.website ?? "");

  return {
    subject: fill(template.subject),
    body: `${fill(template.body)}\n\n${FOOTER}`,
  };
}
