import Link from "next/link";
import { getCurrentProfile } from "@/lib/queries";
import { isOwner } from "@/lib/admin";
import {
  getCrmStats,
  getLeads,
  getFollowUps,
  getRecentActivities,
  getCrmTeam,
  memberMap,
} from "@/lib/crm";
import { STATUS_ORDER, STATUS_META, ACTIVITY_TYPE_META, OUTCOME_LABELS } from "@/lib/crm-constants";
import { formatMoney, relativeDay, followUpBucket, timeAgo } from "@/lib/crm-format";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { Avatar, ActivityGlyph, toneForId } from "@/components/crm/Badges";

export const metadata = { title: "CRM — Bridgeway AI Bootcamp" };

export default async function CrmDashboardPage() {
  const [profile, stats, leads, followUps, activities, team] = await Promise.all([
    getCurrentProfile(),
    getCrmStats(),
    getLeads(),
    getFollowUps(),
    getRecentActivities(10),
    getCrmTeam(),
  ]);
  const owner = isOwner(profile);
  const mMap = memberMap(team);
  const leadMap = new Map(leads.map((l) => [l.id, l]));

  // per-stage value for the board
  const valueByStatus = new Map<string, number>();
  for (const l of leads) {
    valueByStatus.set(l.status, (valueByStatus.get(l.status) ?? 0) + (Number(l.est_value) || 0));
  }

  const statCards = [
    { label: "Open leads", value: String(stats.open), bg: "bg-ua-sky", sticker: "rock-on", href: "/admin/crm/leads?status=open" },
    { label: "Pipeline value", value: formatMoney(stats.openValue), bg: "bg-ua-green", sticker: "hundred", href: "/admin/crm/leads?status=open" },
    { label: "Follow-ups due", value: String(stats.followUpsDue), bg: stats.followUpsDue > 0 ? "bg-ua-orange" : "bg-white", sticker: "phone-hand", href: "/admin/crm/leads?status=open", urgent: stats.followUpsDue > 0 },
    { label: "Won (value)", value: formatMoney(stats.wonValue), bg: "bg-ua-pink", sticker: "high-five", href: "/admin/crm/leads?status=won" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="relative inline-block text-4xl font-black lowercase tracking-tight text-ua-ink md:text-5xl"
              style={{ fontFamily: "var(--font-epilogue)" }}
            >
              crm
              <Sticker name="lets-go" size={60} rotate={10} className="pointer-events-none absolute -right-12 -top-7 hidden sm:block" />
            </h1>
            <p className="mt-2 text-ua-ink/60">
              Shared lead pipeline & outreach tracker — signed in as{" "}
              <span className="font-bold text-ua-ink">{profile.name}</span>{" "}
              <span className="rounded-full bg-ua-ink/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-ua-ink/70">
                {owner ? "co-owner" : "staff"}
              </span>
            </p>
          </div>
          <Link
            href="/admin/crm/leads/new"
            className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-ua-ink bg-ua-blue px-5 py-2.5 text-sm font-bold text-white shadow-[4px_4px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            + Add lead
          </Link>
        </div>
      </Reveal>

      {/* Stat cards */}
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {statCards.map(({ label, value, bg, sticker, href, urgent }) => (
          <Reveal key={label} className="h-full">
            <Link
              href={href}
              className={`relative flex h-full flex-col gap-1 rounded-3xl border-2 border-ua-ink ${bg} p-5 shadow-[6px_6px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5`}
            >
              <Sticker name={sticker} size={52} rotate={-8} className="pointer-events-none absolute -right-3 -top-5 z-10" />
              <p className={`text-[11px] font-bold uppercase tracking-[0.18em] ${urgent ? "text-white/80" : "text-ua-ink/55"}`}>{label}</p>
              <p className={`text-2xl font-black ${urgent ? "text-white" : "text-ua-ink"}`} style={{ fontFamily: "var(--font-epilogue)" }}>
                {value}
              </p>
            </Link>
          </Reveal>
        ))}
      </section>

      {/* Pipeline board */}
      <section className="space-y-4">
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
              pipeline
            </h2>
            <Link href="/admin/crm/leads" className="text-sm font-bold text-ua-blue hover:underline">
              view all leads →
            </Link>
          </div>
        </Reveal>
        <Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {STATUS_ORDER.map((s) => {
              const meta = STATUS_META[s];
              const count = stats.byStatus[s];
              const val = valueByStatus.get(s) ?? 0;
              return (
                <Link
                  key={s}
                  href={`/admin/crm/leads?status=${s}`}
                  className={`flex flex-col gap-1 rounded-2xl border-2 border-ua-ink ${meta.soft} p-3 transition-transform hover:-translate-y-0.5`}
                >
                  <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[11px] font-bold ${meta.badge}`} style={{ fontFamily: "var(--font-epilogue)" }}>
                    {meta.label}
                  </span>
                  <span className="text-2xl font-black text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>{count}</span>
                  <span className="text-[11px] text-ua-ink/55">{formatMoney(val)}</span>
                </Link>
              );
            })}
          </div>
        </Reveal>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Follow-ups */}
        <section className="space-y-4">
          <Reveal>
            <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
              follow-ups
            </h2>
          </Reveal>
          <Reveal>
            <div className="rounded-3xl border-2 border-ua-ink bg-white p-2 shadow-[6px_6px_0_var(--ua-ink)]">
              {followUps.length === 0 ? (
                <p className="p-6 text-center text-sm text-ua-ink/50">No follow-ups scheduled. 🎉</p>
              ) : (
                <ul className="divide-y divide-ua-ink/10">
                  {followUps.map((l) => {
                    const bucket = followUpBucket(l.next_follow_up_at!);
                    const assignee = l.assigned_to ? mMap.get(l.assigned_to) : null;
                    const bucketTone =
                      bucket === "overdue" ? "bg-ua-orange text-white" : bucket === "today" ? "bg-ua-pink text-ua-ink" : "bg-ua-ink/10 text-ua-ink/70";
                    return (
                      <li key={l.id}>
                        <Link href={`/admin/crm/leads/${l.id}`} className="flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-ua-bg">
                          {assignee && <Avatar name={assignee.name} size="sm" tone={toneForId(assignee.id)} />}
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-sm font-bold text-ua-ink">{l.company}</span>
                            <span className="block truncate text-xs text-ua-ink/55">{assignee?.name ?? "Unassigned"}</span>
                          </span>
                          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${bucketTone}`}>
                            {relativeDay(l.next_follow_up_at)}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </Reveal>
        </section>

        {/* Team activity feed */}
        <section className="space-y-4">
          <Reveal>
            <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>
              team activity
            </h2>
          </Reveal>
          <Reveal>
            <div className="rounded-3xl border-2 border-ua-ink bg-white p-2 shadow-[6px_6px_0_var(--ua-ink)]">
              {activities.length === 0 ? (
                <p className="p-6 text-center text-sm text-ua-ink/50">No outreach logged yet. Open a lead and log your first call or email.</p>
              ) : (
              <ul className="divide-y divide-ua-ink/10">
                {activities.map((a) => {
                  const actor = a.user_id ? mMap.get(a.user_id) : null;
                  const lead = leadMap.get(a.lead_id);
                  return (
                    <li key={a.id} className="flex items-start gap-3 p-3">
                      <ActivityGlyph type={a.type} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-ua-ink">
                          <span className="font-bold">{actor?.name ?? "Someone"}</span>{" "}
                          <span className="text-ua-ink/60">{ACTIVITY_TYPE_META[a.type].label.toLowerCase()}</span>
                          {lead && (
                            <>
                              {" · "}
                              <Link href={`/admin/crm/leads/${lead.id}`} className="font-bold text-ua-blue hover:underline">
                                {lead.company}
                              </Link>
                            </>
                          )}
                          {a.outcome && (
                            <span className="ml-1 rounded-full bg-ua-ink/8 px-2 py-0.5 text-[11px] font-semibold text-ua-ink/70">
                              {OUTCOME_LABELS[a.outcome]}
                            </span>
                          )}
                        </p>
                        {a.notes && <p className="mt-0.5 line-clamp-2 text-xs text-ua-ink/55">{a.notes}</p>}
                        <p className="mt-0.5 text-[11px] text-ua-ink/40">{timeAgo(a.occurred_at)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
              )}
            </div>
          </Reveal>
        </section>
      </div>

      {/* Owner-only analytics CTAs */}
      {owner && (
        <Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/admin/crm/analytics/website"
              className="relative flex items-center justify-between overflow-hidden rounded-3xl border-2 border-ua-ink bg-ua-ink p-6 text-white shadow-[6px_6px_0_var(--ua-sky)] transition-transform hover:-translate-y-0.5"
            >
              <div>
                <p className="text-xl font-black" style={{ fontFamily: "var(--font-epilogue)" }}>Website analytics</p>
                <p className="mt-1 text-sm text-white/70">Traffic, clicks, views, search keywords & traction.</p>
              </div>
              <span className="text-2xl">→</span>
            </Link>
            <Link
              href="/admin/crm/analytics"
              className="relative flex items-center justify-between overflow-hidden rounded-3xl border-2 border-ua-ink bg-ua-blue p-6 text-white shadow-[6px_6px_0_var(--ua-ink)] transition-transform hover:-translate-y-0.5"
            >
              <div>
                <p className="text-xl font-black" style={{ fontFamily: "var(--font-epilogue)" }}>Sales analytics</p>
                <p className="mt-1 text-sm text-white/80">Team outreach leaderboard & pipeline conversion.</p>
              </div>
              <span className="text-2xl">→</span>
            </Link>
          </div>
        </Reveal>
      )}
    </div>
  );
}
