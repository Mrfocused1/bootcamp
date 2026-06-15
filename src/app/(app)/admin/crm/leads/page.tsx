import Link from "next/link";
import { getLeads, getCrmTeam, memberMap, type LeadFilters } from "@/lib/crm";
import {
  STATUS_ORDER, STATUS_META, PRIORITY_ORDER, PRIORITY_META,
} from "@/lib/crm-constants";
import type { LeadStatus, LeadPriority } from "@/lib/types";
import { formatMoney, relativeDay, followUpBucket } from "@/lib/crm-format";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { StatusBadge, PriorityBadge, Avatar, toneForId } from "@/components/crm/Badges";

export const metadata = { title: "Leads — CRM — Bridgeway AI Bootcamp" };

const SELECT_CLS =
  "rounded-xl border-2 border-ua-ink/20 bg-ua-bg px-3 py-2 text-sm font-semibold text-ua-ink focus:border-ua-blue focus:outline-none";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);

  const filters: LeadFilters = {
    status: (get("status") as LeadFilters["status"]) ?? "all",
    assignedTo: get("assigned") ?? "all",
    priority: (get("priority") as LeadFilters["priority"]) ?? "all",
    q: get("q") ?? "",
  };

  const [leads, team] = await Promise.all([getLeads(filters), getCrmTeam()]);
  const mMap = memberMap(team);

  const created = sp.created === "1";
  const deleted = sp.deleted === "1";

  return (
    <div className="space-y-8">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="relative inline-block text-3xl font-black lowercase tracking-tight text-ua-ink md:text-4xl" style={{ fontFamily: "var(--font-epilogue)" }}>
              leads
              <Sticker name="rock-on" size={50} rotate={-10} className="pointer-events-none absolute -right-11 -top-6 hidden sm:block" />
            </h1>
            <p className="mt-2 text-sm text-ua-ink/60">{leads.length} {leads.length === 1 ? "lead" : "leads"} in view</p>
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

      {created && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-green p-4 text-sm font-semibold text-ua-ink">
          Lead saved. (In live mode this opens the new lead.)
        </div>
      )}
      {deleted && (
        <div className="rounded-2xl border-2 border-ua-ink bg-ua-pink p-4 text-sm font-semibold text-ua-ink">
          Lead deleted.
        </div>
      )}

      {/* Filters */}
      <Reveal>
        <form method="get" className="flex flex-wrap items-end gap-3 rounded-3xl border-2 border-ua-ink bg-white p-4 shadow-[6px_6px_0_var(--ua-ink)]">
          <div className="flex min-w-[160px] flex-1 flex-col gap-1">
            <label htmlFor="q" className="text-[11px] font-bold uppercase tracking-widest text-ua-ink/50">Search</label>
            <input id="q" name="q" defaultValue={filters.q} placeholder="Company, contact, email…" className={`${SELECT_CLS} w-full`} />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="status" className="text-[11px] font-bold uppercase tracking-widest text-ua-ink/50">Stage</label>
            <select id="status" name="status" defaultValue={filters.status} className={SELECT_CLS}>
              <option value="all">All stages</option>
              <option value="open">Open only</option>
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>{STATUS_META[s].label}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="assigned" className="text-[11px] font-bold uppercase tracking-widest text-ua-ink/50">Owner</label>
            <select id="assigned" name="assigned" defaultValue={filters.assignedTo} className={SELECT_CLS}>
              <option value="all">Anyone</option>
              {team.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="priority" className="text-[11px] font-bold uppercase tracking-widest text-ua-ink/50">Priority</label>
            <select id="priority" name="priority" defaultValue={filters.priority} className={SELECT_CLS}>
              <option value="all">Any</option>
              {PRIORITY_ORDER.map((p) => (
                <option key={p} value={p}>{PRIORITY_META[p].label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full border-2 border-ua-ink bg-ua-ink px-4 py-2 text-sm font-bold text-white" style={{ fontFamily: "var(--font-epilogue)" }}>
              Apply
            </button>
            <Link href="/admin/crm/leads" className="rounded-full border-2 border-ua-ink/20 px-4 py-2 text-sm font-bold text-ua-ink/60 hover:border-ua-ink">
              Reset
            </Link>
          </div>
        </form>
      </Reveal>

      {/* Results */}
      <Reveal>
        <div className="overflow-hidden rounded-3xl border-2 border-ua-ink bg-white shadow-[6px_6px_0_var(--ua-ink)]">
          {/* table header (desktop) */}
          <div className="hidden grid-cols-[2.2fr_1.4fr_1fr_0.9fr_1fr] gap-3 border-b-2 border-ua-ink/10 bg-ua-bg px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-ua-ink/50 md:grid">
            <span>Company</span>
            <span>Stage / priority</span>
            <span>Owner</span>
            <span>Value</span>
            <span>Follow-up</span>
          </div>

          {leads.length === 0 ? (
            <p className="px-5 py-12 text-center text-sm text-ua-ink/50">No leads match these filters.</p>
          ) : (
            <ul className="divide-y divide-ua-ink/10">
              {leads.map((l) => {
                const assignee = l.assigned_to ? mMap.get(l.assigned_to) : null;
                const bucket = l.next_follow_up_at ? followUpBucket(l.next_follow_up_at) : null;
                const fuTone =
                  bucket === "overdue" ? "text-ua-orange font-bold" : bucket === "today" ? "text-ua-blue font-bold" : "text-ua-ink/60";
                return (
                  <li key={l.id}>
                    <Link
                      href={`/admin/crm/leads/${l.id}`}
                      className="grid grid-cols-1 gap-2 p-5 transition-colors hover:bg-ua-bg md:grid-cols-[2.2fr_1.4fr_1fr_0.9fr_1fr] md:items-center md:gap-3"
                    >
                      {/* company */}
                      <div className="min-w-0">
                        <p className="truncate font-bold text-ua-ink">{l.company}</p>
                        <p className="truncate text-xs text-ua-ink/55">
                          {l.contact_name ?? "—"}
                          {l.website && <span className="text-ua-ink/35"> · {l.website.replace(/^https?:\/\//, "")}</span>}
                        </p>
                      </div>
                      {/* stage/priority */}
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge status={l.status as LeadStatus} />
                        <PriorityBadge priority={l.priority as LeadPriority} />
                      </div>
                      {/* owner */}
                      <div className="flex items-center gap-2">
                        {assignee ? (
                          <>
                            <Avatar name={assignee.name} size="sm" tone={toneForId(assignee.id)} />
                            <span className="truncate text-sm text-ua-ink/70 md:hidden lg:inline">{assignee.name}</span>
                          </>
                        ) : (
                          <span className="text-sm text-ua-ink/40">Unassigned</span>
                        )}
                      </div>
                      {/* value */}
                      <div className="text-sm font-semibold text-ua-ink">{formatMoney(l.est_value)}</div>
                      {/* follow-up */}
                      <div className={`text-sm ${fuTone}`}>
                        {l.next_follow_up_at ? relativeDay(l.next_follow_up_at) : <span className="text-ua-ink/35">—</span>}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Reveal>
    </div>
  );
}
