import Link from "next/link";
import { notFound } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import { isOwner } from "@/lib/admin";
import { getLeadById, getActivitiesForLead, getCrmTeam, memberMap } from "@/lib/crm";
import { updateLeadStatus, assignLead, clearFollowUp } from "@/app/(app)/admin/crm/actions";
import {
  STATUS_ORDER, STATUS_META, SOURCE_LABELS, ACTIVITY_TYPE_META, OUTCOME_LABELS,
} from "@/lib/crm-constants";
import type { LeadStatus, LeadPriority } from "@/lib/types";
import { formatMoney, formatDate, formatDateTime, relativeDay, followUpBucket } from "@/lib/crm-format";
import { Reveal } from "@/components/marketing/Reveal";
import { StatusBadge, PriorityBadge, Avatar, ActivityGlyph, toneForId } from "@/components/crm/Badges";
import { LogActivityForm } from "@/components/crm/LogActivityForm";
import { SendEmailForm } from "@/components/crm/SendEmailForm";
import { OUTREACH_TEMPLATES, renderTemplate } from "@/lib/outreach-templates";
import { DeleteLeadButton } from "@/components/crm/DeleteLeadButton";

const FIELD =
  "rounded-xl border-2 border-ua-ink/20 bg-ua-bg px-3 py-2 text-sm text-ua-ink focus:border-ua-blue focus:outline-none";

export default async function LeadDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const [profile, lead, activities, team] = await Promise.all([
    getCurrentProfile(),
    getLeadById(id),
    getActivitiesForLead(id),
    getCrmTeam(),
  ]);
  if (!lead) notFound();

  const owner = isOwner(profile);
  const mMap = memberMap(team);
  const assignee = lead.assigned_to ? mMap.get(lead.assigned_to) : null;
  const creator = lead.created_by ? mMap.get(lead.created_by) : null;
  const logged = sp.logged === "1";
  const saved = sp.saved === "1";
  const sent = sp.sent === "1";
  const error = typeof sp.error === "string" ? sp.error : null;
  const emailTemplates = OUTREACH_TEMPLATES.map((t) => ({
    id: t.id,
    label: t.label,
    ...renderTemplate(t, lead),
  }));

  const websiteHost = lead.website ? lead.website.replace(/^https?:\/\//, "").replace(/\/$/, "") : null;

  return (
    <div className="space-y-6">
      <Reveal>
        <Link href="/admin/crm/leads" className="text-sm font-bold text-ua-blue hover:underline">← Back to leads</Link>
      </Reveal>

      {(logged || saved || sent) && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-green p-4 text-sm font-semibold text-ua-ink">
          {logged
            ? "Outreach logged — the team can see it now."
            : sent
              ? "Email sent — logged to this lead's timeline."
              : "Lead updated."}
        </div>
      )}
      {error && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-orange p-4 text-sm font-semibold text-white">
          {error}
        </div>
      )}

      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-4 rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)] md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-black tracking-tight text-ua-ink md:text-4xl" style={{ fontFamily: "var(--font-epilogue)" }}>
              {lead.company}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <StatusBadge status={lead.status as LeadStatus} />
              <PriorityBadge priority={lead.priority as LeadPriority} />
              <span className="rounded-full bg-ua-ink/8 px-2.5 py-0.5 text-xs font-semibold text-ua-ink/65">{SOURCE_LABELS[lead.source]}</span>
              <span className="rounded-full bg-ua-ink/8 px-2.5 py-0.5 text-xs font-semibold text-ua-ink/65">{formatMoney(lead.est_value)}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Link href={`/admin/crm/leads/${lead.id}/edit`} className="rounded-full border-2 border-ua-ink bg-white px-4 py-2 text-sm font-bold text-ua-ink shadow-[3px_3px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5" style={{ fontFamily: "var(--font-epilogue)" }}>
              Edit
            </Link>
            {owner && <DeleteLeadButton leadId={lead.id} company={lead.company} />}
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Send email */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-4 text-xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                send email
              </h2>
              <SendEmailForm leadId={lead.id} hasEmail={Boolean(lead.email)} templates={emailTemplates} />
            </section>
          </Reveal>

          {/* Log outreach */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-4 text-xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                log outreach
              </h2>
              <LogActivityForm leadId={lead.id} />
            </section>
          </Reveal>

          {/* Timeline */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-4 text-xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                outreach history <span className="text-ua-ink/40">({activities.length})</span>
              </h2>
              {activities.length === 0 ? (
                <p className="py-6 text-center text-sm text-ua-ink/50">No outreach logged yet. Make the first move above. 👆</p>
              ) : (
                <ol className="space-y-4">
                  {activities.map((a) => {
                    const actor = a.user_id ? mMap.get(a.user_id) : null;
                    return (
                      <li key={a.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <ActivityGlyph type={a.type} />
                          <span className="mt-1 w-px flex-1 bg-ua-ink/10" />
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                            <span className="text-sm font-bold text-ua-ink">{ACTIVITY_TYPE_META[a.type].label}</span>
                            {a.type !== "note" && (
                              <span className="text-xs text-ua-ink/45">{a.direction === "inbound" ? "inbound" : "outbound"}</span>
                            )}
                            {a.outcome && (
                              <span className="rounded-full bg-ua-ink/8 px-2 py-0.5 text-[11px] font-semibold text-ua-ink/70">{OUTCOME_LABELS[a.outcome]}</span>
                            )}
                            <span className="text-xs text-ua-ink/40">· {formatDateTime(a.occurred_at)}</span>
                          </div>
                          {a.notes && <p className="mt-1 whitespace-pre-wrap text-sm text-ua-ink/80">{a.notes}</p>}
                          <div className="mt-1.5 flex items-center gap-2">
                            {actor && <Avatar name={actor.name} size="sm" tone={toneForId(actor.id)} />}
                            <span className="text-xs text-ua-ink/55">{actor?.name ?? "Unknown"}</span>
                            {a.follow_up_at && (
                              <span className="ml-auto rounded-full bg-ua-pink/30 px-2 py-0.5 text-[11px] font-semibold text-ua-ink/70">
                                follow-up {relativeDay(a.follow_up_at).toLowerCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}
            </section>
          </Reveal>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Contact</h2>
              <p className="text-sm font-bold text-ua-ink">{lead.contact_name ?? "—"}</p>
              <div className="mt-3 space-y-2">
                {lead.website ? (
                  <a href={lead.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-xl bg-ua-bg px-3 py-2 text-sm text-ua-blue hover:underline">
                    🌐 <span className="truncate">{websiteHost}</span>
                  </a>
                ) : (
                  <p className="flex items-center gap-2 rounded-xl bg-ua-bg px-3 py-2 text-sm text-ua-ink/40">🌐 No website</p>
                )}
                {lead.email ? (
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-2 rounded-xl bg-ua-bg px-3 py-2 text-sm text-ua-blue hover:underline">
                    ✉️ <span className="truncate">{lead.email}</span>
                  </a>
                ) : (
                  <p className="flex items-center gap-2 rounded-xl bg-ua-bg px-3 py-2 text-sm text-ua-ink/40">✉️ No email</p>
                )}
                {lead.phone ? (
                  <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} className="flex items-center gap-2 rounded-xl bg-ua-bg px-3 py-2 text-sm text-ua-blue hover:underline">
                    📞 <span className="truncate">{lead.phone}</span>
                  </a>
                ) : (
                  <p className="flex items-center gap-2 rounded-xl bg-ua-bg px-3 py-2 text-sm text-ua-ink/40">📞 No phone</p>
                )}
              </div>
              {lead.notes && (
                <>
                  <h3 className="mt-4 mb-1 text-xs font-bold uppercase tracking-widest text-ua-ink/45">Notes</h3>
                  <p className="whitespace-pre-wrap text-sm text-ua-ink/75">{lead.notes}</p>
                </>
              )}
            </section>
          </Reveal>

          {/* Pipeline stage quick change */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Pipeline stage</h2>
              <form action={updateLeadStatus} className="flex gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <select name="status" defaultValue={lead.status} className={`${FIELD} flex-1`}>
                  {STATUS_ORDER.map((s) => (
                    <option key={s} value={s}>{STATUS_META[s].label}</option>
                  ))}
                </select>
                <button type="submit" className="rounded-xl border-2 border-ua-ink bg-ua-ink px-4 text-sm font-bold text-white" style={{ fontFamily: "var(--font-epilogue)" }}>
                  Move
                </button>
              </form>
            </section>
          </Reveal>

          {/* Assignment */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Owner</h2>
              <div className="mb-3 flex items-center gap-2">
                {assignee ? (
                  <>
                    <Avatar name={assignee.name} tone={toneForId(assignee.id)} />
                    <span className="text-sm font-bold text-ua-ink">{assignee.name}</span>
                  </>
                ) : (
                  <span className="text-sm text-ua-ink/40">Unassigned</span>
                )}
              </div>
              <form action={assignLead} className="flex gap-2">
                <input type="hidden" name="id" value={lead.id} />
                <select name="assigned_to" defaultValue={lead.assigned_to ?? ""} className={`${FIELD} flex-1`}>
                  <option value="">Unassigned</option>
                  {team.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}{m.crm_role === "owner" ? " (owner)" : ""}</option>
                  ))}
                </select>
                <button type="submit" className="rounded-xl border-2 border-ua-ink bg-white px-4 text-sm font-bold text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
                  Set
                </button>
              </form>
            </section>
          </Reveal>

          {/* Follow-up */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
              <h2 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Next follow-up</h2>
              {lead.next_follow_up_at ? (
                <div className="flex items-center justify-between gap-2">
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${
                    followUpBucket(lead.next_follow_up_at) === "overdue" ? "bg-ua-orange text-white"
                    : followUpBucket(lead.next_follow_up_at) === "today" ? "bg-ua-pink text-ua-ink"
                    : "bg-ua-ink/10 text-ua-ink/70"}`}>
                    {relativeDay(lead.next_follow_up_at)}
                  </span>
                  <form action={clearFollowUp}>
                    <input type="hidden" name="id" value={lead.id} />
                    <button type="submit" className="text-xs font-bold text-ua-blue hover:underline">Mark done</button>
                  </form>
                </div>
              ) : (
                <p className="text-sm text-ua-ink/40">None scheduled. Add one when you log outreach.</p>
              )}
            </section>
          </Reveal>

          {/* Meta */}
          <Reveal>
            <section className="rounded-3xl border-2 border-ua-ink/15 bg-white/60 p-5 text-xs text-ua-ink/55">
              <dl className="space-y-1.5">
                <div className="flex justify-between gap-2"><dt>Added by</dt><dd className="font-semibold text-ua-ink/70">{creator?.name ?? "—"}</dd></div>
                <div className="flex justify-between gap-2"><dt>Created</dt><dd>{formatDate(lead.created_at)}</dd></div>
                <div className="flex justify-between gap-2"><dt>Last contacted</dt><dd>{lead.last_contacted_at ? formatDate(lead.last_contacted_at) : "—"}</dd></div>
                <div className="flex justify-between gap-2"><dt>Updated</dt><dd>{formatDate(lead.updated_at)}</dd></div>
              </dl>
            </section>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
