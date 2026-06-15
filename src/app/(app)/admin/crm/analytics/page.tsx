import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import { isOwner } from "@/lib/admin";
import { getWebsiteAnalytics, getOutreachStats, getCrmStats } from "@/lib/crm";
import { STATUS_META } from "@/lib/crm-constants";
import { formatMoney } from "@/lib/crm-format";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";
import { Avatar, toneForId } from "@/components/crm/Badges";

export const metadata = { title: "Owner analytics — CRM" };

function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export default async function CrmAnalyticsPage() {
  const profile = await getCurrentProfile();
  if (!isOwner(profile)) redirect("/admin/crm");

  const [web, outreach, stats] = await Promise.all([
    getWebsiteAnalytics(),
    getOutreachStats(),
    getCrmStats(),
  ]);

  const maxVisitors = Math.max(...web.series.map((d) => d.visitors), 1);
  const maxOutreach = Math.max(...outreach.map((o) => o.total), 1);
  const maxSource = Math.max(...web.sources.map((s) => s.visitors), 1);

  // Conversion funnel through the active stages
  const funnel = (["new", "contacted", "qualified", "proposal", "won"] as const).map((s) => ({
    label: STATUS_META[s].label,
    badge: STATUS_META[s].badge,
    count: stats.byStatus[s],
  }));
  const funnelMax = Math.max(...funnel.map((f) => f.count), 1);
  const decided = stats.byStatus.won + stats.byStatus.lost;
  const winRate = decided > 0 ? stats.byStatus.won / decided : 0;

  const webKpis = [
    { label: "Visitors (14d)", value: web.visitors.toLocaleString("en-GB"), bg: "bg-ua-sky" },
    { label: "Pageviews", value: web.pageviews.toLocaleString("en-GB"), bg: "bg-ua-green" },
    { label: "Avg. session", value: `${Math.floor(web.avgSessionSeconds / 60)}m ${web.avgSessionSeconds % 60}s`, bg: "bg-ua-pink" },
    { label: "Bounce rate", value: pct(web.bounceRate), bg: "bg-white" },
    { label: "Enquiries", value: String(web.enquiries), bg: "bg-ua-orange", invert: true },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <Reveal>
        <Link href="/admin/crm" className="text-sm font-bold text-ua-blue hover:underline">← Back to CRM</Link>
        <h1 className="relative mt-2 inline-block text-3xl font-black lowercase tracking-tight text-ua-ink md:text-4xl" style={{ fontFamily: "var(--font-epilogue)" }}>
          owner analytics
          <Sticker name="shooting-star" size={54} rotate={10} className="pointer-events-none absolute -right-12 -top-6 hidden sm:block" />
        </h1>
        <p className="mt-2 text-sm text-ua-ink/60">Website traffic, team outreach & pipeline conversion. Visible to co-owners only.</p>
      </Reveal>

      {/* Website traffic */}
      <section className="space-y-4">
        <Reveal>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>website traffic</h2>
            <Link href="/admin/crm/analytics/website" className="shrink-0 text-sm font-bold text-ua-blue hover:underline">full dashboard →</Link>
          </div>
        </Reveal>

        <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {webKpis.map((k) => (
            <Reveal key={k.label} className="h-full">
              <div className={`flex h-full flex-col gap-1 rounded-2xl border-2 border-ua-ink ${k.bg} p-4 shadow-[4px_4px_0_var(--ua-ink)]`}>
                <p className={`text-[10px] font-bold uppercase tracking-[0.16em] ${k.invert ? "text-white/80" : "text-ua-ink/55"}`}>{k.label}</p>
                <p className={`text-xl font-black ${k.invert ? "text-white" : "text-ua-ink"}`} style={{ fontFamily: "var(--font-epilogue)" }}>{k.value}</p>
              </div>
            </Reveal>
          ))}
        </section>

        {/* Visitors chart */}
        <Reveal>
          <div className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-ua-ink/50">Daily visitors</h3>
            <div className="flex h-44 items-stretch gap-1.5">
              {web.series.map((d) => (
                <div key={d.date} className="group flex flex-1 flex-col justify-end" title={`${d.date}: ${d.visitors} visitors`}>
                  <div className="w-full rounded-t-md bg-ua-blue transition-colors group-hover:bg-ua-ink" style={{ height: `${(d.visitors / maxVisitors) * 100}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {web.series.map((d) => (
                <span key={d.date} className="flex-1 text-center text-[8px] text-ua-ink/40">{d.date.slice(8)}</span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Top pages + sources + devices */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal>
            <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Top pages</h3>
              <ul className="space-y-2">
                {web.topPages.map((p) => (
                  <li key={p.path} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-ua-ink">{p.path}</span>
                    <span className="text-ua-ink/55">{p.views.toLocaleString("en-GB")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Traffic sources</h3>
              <ul className="space-y-2.5">
                {web.sources.map((s) => (
                  <li key={s.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ua-ink">{s.label}</span>
                      <span className="text-ua-ink/55">{s.visitors.toLocaleString("en-GB")}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ua-bg">
                      <div className="h-full rounded-full bg-ua-sky" style={{ width: `${(s.visitors / maxSource) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal>
            <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
              <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Devices</h3>
              <ul className="space-y-2.5">
                {web.devices.map((d) => (
                  <li key={d.label}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-ua-ink">{d.label}</span>
                      <span className="text-ua-ink/55">{pct(d.share)}</span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-ua-bg">
                      <div className="h-full rounded-full bg-ua-pink" style={{ width: `${d.share * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Team outreach leaderboard */}
      <section className="space-y-4">
        <Reveal>
          <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>team outreach</h2>
        </Reveal>
        <Reveal>
          <div className="space-y-3 rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
            {outreach.map((o) => (
              <div key={o.member.id} className="flex flex-col gap-2 border-b border-ua-ink/10 pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex w-44 shrink-0 items-center gap-2">
                  <Avatar name={o.member.name} tone={toneForId(o.member.id)} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ua-ink">{o.member.name}</p>
                    <p className="text-[11px] uppercase tracking-wide text-ua-ink/45">{o.member.crm_role}</p>
                  </div>
                </div>
                <div className="flex flex-1 items-center gap-3">
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-ua-bg">
                    <div className="h-full rounded-full bg-ua-blue" style={{ width: `${(o.total / maxOutreach) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right text-sm font-black text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>{o.total}</span>
                </div>
                <div className="flex shrink-0 flex-wrap gap-1.5 text-[11px] font-semibold">
                  <span className="rounded-full bg-ua-sky/25 px-2 py-0.5 text-ua-ink/70">📞 {o.calls}</span>
                  <span className="rounded-full bg-ua-green/30 px-2 py-0.5 text-ua-ink/70">✉️ {o.emails}</span>
                  <span className="rounded-full bg-ua-pink/30 px-2 py-0.5 text-ua-ink/70">🤝 {o.meetings}</span>
                  <span className="rounded-full bg-ua-orange/20 px-2 py-0.5 text-ua-orange">★ {o.positive} positive</span>
                  <span className="rounded-full bg-ua-ink/8 px-2 py-0.5 text-ua-ink/60">{o.followUpsOpen} follow-ups</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Pipeline conversion */}
      <section className="space-y-4">
        <Reveal>
          <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>pipeline conversion</h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
              <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-ua-ink/50">Stage funnel</h3>
              <div className="space-y-2.5">
                {funnel.map((f) => (
                  <div key={f.label} className="flex items-center gap-3">
                    <span className="w-20 shrink-0 text-xs font-bold text-ua-ink/60">{f.label}</span>
                    <div className="h-7 flex-1 overflow-hidden rounded-lg bg-ua-bg">
                      <div className={`flex h-full items-center justify-end rounded-lg px-2 ${f.badge}`} style={{ width: `${Math.max((f.count / funnelMax) * 100, 8)}%` }}>
                        <span className="text-xs font-black">{f.count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
          <div className="space-y-4">
            <Reveal>
              <div className="rounded-3xl border-2 border-ua-ink bg-ua-green p-6 shadow-[6px_6px_0_var(--ua-ink)]">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ua-ink/55">Win rate</p>
                <p className="text-3xl font-black text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>{pct(winRate)}</p>
                <p className="mt-1 text-xs text-ua-ink/60">{stats.byStatus.won} won · {stats.byStatus.lost} lost</p>
              </div>
            </Reveal>
            <Reveal>
              <div className="rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
                <p className="text-[11px] font-bold uppercase tracking-widest text-ua-ink/55">Open pipeline value</p>
                <p className="text-3xl font-black text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>{formatMoney(stats.openValue)}</p>
                <p className="mt-1 text-xs text-ua-ink/60">{stats.open} open · {formatMoney(stats.wonValue)} won</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
