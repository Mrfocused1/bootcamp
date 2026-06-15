import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries";
import { isOwner } from "@/lib/admin";
import { getWebsiteAnalytics } from "@/lib/crm";
import { Reveal } from "@/components/marketing/Reveal";
import { Sticker } from "@/components/marketing/Sticker";

export const metadata = { title: "Website analytics — Bridgeway AI Bootcamp" };

const n = (v: number) => v.toLocaleString("en-GB");
const pct = (v: number) => `${Math.round(v * 100)}%`;
const ctr = (v: number) => `${(v * 100).toFixed(1)}%`;

function Delta({ value, invert = false }: { value: number; invert?: boolean }) {
  const up = value >= 0;
  const good = invert ? !up : up; // for bounce rate, down is good
  return (
    <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${good ? "text-green-700" : "text-ua-orange"}`}>
      {up ? "▲" : "▼"} {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function MiniBars({ data, max, tone }: { data: { date: string; value: number }[]; max: number; tone: string }) {
  return (
    <>
      <div className="flex h-32 items-stretch gap-1">
        {data.map((d) => (
          <div key={d.date} className="group flex flex-1 flex-col justify-end" title={`${d.date}: ${n(d.value)}`}>
            <div className={`w-full rounded-t-md ${tone} transition-colors group-hover:bg-ua-ink`} style={{ height: `${(d.value / max) * 100}%` }} />
          </div>
        ))}
      </div>
      <div className="mt-1.5 flex gap-1">
        {data.map((d) => (
          <span key={d.date} className="flex-1 text-center text-[8px] text-ua-ink/40">{d.date.slice(8)}</span>
        ))}
      </div>
    </>
  );
}

export default async function WebsiteAnalyticsPage() {
  const profile = await getCurrentProfile();
  if (!isOwner(profile)) redirect("/admin/crm");

  const w = await getWebsiteAnalytics();
  const maxVisitors = Math.max(...w.series.map((d) => d.visitors), 1);
  const maxViews = Math.max(...w.series.map((d) => d.pageviews), 1);
  const maxKwClicks = Math.max(...w.keywords.map((k) => k.clicks), 1);
  const maxCta = Math.max(...w.ctas.map((c) => c.clicks), 1);
  const maxSource = Math.max(...w.sources.map((s) => s.visitors), 1);
  const maxCountry = Math.max(...w.countries.map((c) => c.visitors), 1);
  const totalImpr = w.keywords.reduce((s, k) => s + k.impressions, 0);
  const totalKwClicks = w.keywords.reduce((s, k) => s + k.clicks, 0);

  const kpis = [
    { label: "Visitors", value: n(w.visitors), delta: w.deltas.visitors, bg: "bg-ua-sky" },
    { label: "Unique visitors", value: n(w.uniqueVisitors), delta: w.deltas.uniqueVisitors, bg: "bg-ua-green" },
    { label: "Pageviews", value: n(w.pageviews), delta: w.deltas.pageviews, bg: "bg-ua-pink" },
    { label: "Clicks", value: n(w.clicks), delta: w.deltas.clicks, bg: "bg-white" },
    { label: "Enquiries", value: n(w.enquiries), delta: w.deltas.enquiries, bg: "bg-ua-orange", invertText: true },
    { label: "Avg. engagement", value: `${Math.floor(w.avgSessionSeconds / 60)}m ${w.avgSessionSeconds % 60}s`, bg: "bg-white" },
    { label: "Bounce rate", value: pct(w.bounceRate), delta: w.deltas.bounceRate, deltaInvert: true, bg: "bg-white" },
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <Reveal>
        <Link href="/admin/crm/analytics" className="text-sm font-bold text-ua-blue hover:underline">← Back to analytics</Link>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="relative inline-block text-3xl font-black lowercase tracking-tight text-ua-ink md:text-4xl" style={{ fontFamily: "var(--font-epilogue)" }}>
              website analytics
              <Sticker name="shooting-star" size={54} rotate={10} className="pointer-events-none absolute -right-12 -top-6 hidden sm:block" />
            </h1>
            <p className="mt-2 text-sm text-ua-ink/60">Traction, traffic, clicks & search performance for bridgewayaibootcamp.com · last {w.rangeDays} days.</p>
          </div>
          {!w.live && (
            <span className="w-fit rounded-full bg-ua-ink/8 px-3 py-1 text-[11px] font-semibold text-ua-ink/55">sample data — connect GA4 + Search Console to go live</span>
          )}
        </div>
      </Reveal>

      {/* Overview KPIs */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {kpis.map((k) => (
          <Reveal key={k.label} className="h-full">
            <div className={`flex h-full flex-col gap-1 rounded-2xl border-2 border-ua-ink ${k.bg} p-4 shadow-[4px_4px_0_var(--ua-ink)]`}>
              <p className={`text-[10px] font-bold uppercase tracking-[0.14em] ${k.invertText ? "text-white/80" : "text-ua-ink/55"}`}>{k.label}</p>
              <p className={`text-xl font-black ${k.invertText ? "text-white" : "text-ua-ink"}`} style={{ fontFamily: "var(--font-epilogue)" }}>{k.value}</p>
              {k.delta !== undefined && <Delta value={k.delta} invert={k.deltaInvert} />}
            </div>
          </Reveal>
        ))}
      </section>

      {/* Traffic over time */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-ua-ink/50">Visitors</h3>
            <MiniBars data={w.series.map((d) => ({ date: d.date, value: d.visitors }))} max={maxVisitors} tone="bg-ua-blue" />
          </div>
        </Reveal>
        <Reveal>
          <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-6 shadow-[6px_6px_0_var(--ua-ink)]">
            <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-ua-ink/50">Pageviews</h3>
            <MiniBars data={w.series.map((d) => ({ date: d.date, value: d.pageviews }))} max={maxViews} tone="bg-ua-pink" />
          </div>
        </Reveal>
      </section>

      {/* Search keywords */}
      <section className="space-y-4">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <h2 className="text-2xl font-black lowercase text-ua-ink" style={{ fontFamily: "var(--font-epilogue)" }}>search keywords</h2>
            <p className="text-xs text-ua-ink/50">{n(totalKwClicks)} clicks · {n(totalImpr)} impressions from search</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="overflow-hidden rounded-3xl border-2 border-ua-ink bg-white shadow-[6px_6px_0_var(--ua-ink)]">
            <div className="hidden grid-cols-[2.5fr_1fr_1fr_0.8fr_0.8fr] gap-3 border-b-2 border-ua-ink/10 bg-ua-bg px-5 py-3 text-[11px] font-bold uppercase tracking-widest text-ua-ink/50 sm:grid">
              <span>Query</span><span className="text-right">Clicks</span><span className="text-right">Impressions</span><span className="text-right">CTR</span><span className="text-right">Position</span>
            </div>
            <ul className="divide-y divide-ua-ink/10">
              {w.keywords.map((k) => (
                <li key={k.query} className="grid grid-cols-2 gap-y-1 px-5 py-3 text-sm sm:grid-cols-[2.5fr_1fr_1fr_0.8fr_0.8fr] sm:items-center sm:gap-3">
                  <span className="col-span-2 font-semibold text-ua-ink sm:col-span-1">
                    {k.query}
                    <span className="mt-1 block h-1.5 max-w-[180px] overflow-hidden rounded-full bg-ua-bg sm:hidden">
                      <span className="block h-full rounded-full bg-ua-blue" style={{ width: `${(k.clicks / maxKwClicks) * 100}%` }} />
                    </span>
                  </span>
                  <span className="text-ua-ink/70 sm:text-right"><span className="text-ua-ink/40 sm:hidden">clicks </span>{n(k.clicks)}</span>
                  <span className="text-ua-ink/70 sm:text-right"><span className="text-ua-ink/40 sm:hidden">impr </span>{n(k.impressions)}</span>
                  <span className="text-ua-ink/70 sm:text-right"><span className="text-ua-ink/40 sm:hidden">ctr </span>{ctr(k.ctr)}</span>
                  <span className="font-semibold text-ua-ink sm:text-right"><span className="text-ua-ink/40 sm:hidden">pos </span>{k.position.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* Top pages + CTA clicks */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Top pages</h3>
            <ul className="space-y-2">
              {w.topPages.map((p) => (
                <li key={p.path} className="flex items-center justify-between gap-3 text-sm">
                  <span className="font-semibold text-ua-ink">{p.path}</span>
                  <span className="flex items-center gap-3 text-ua-ink/55">
                    <span>{Math.floor(p.avgSeconds / 60)}m {p.avgSeconds % 60}s</span>
                    <span className="w-14 text-right font-semibold text-ua-ink/70">{n(p.views)}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Button & link clicks</h3>
            <ul className="space-y-2.5">
              {w.ctas.map((c) => (
                <li key={c.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ua-ink">{c.label}</span>
                    <span className="text-ua-ink/55">{n(c.clicks)} · {pct(c.clicks / w.visitors)}</span>
                  </div>
                  <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-ua-bg">
                    <div className="h-full rounded-full bg-ua-orange" style={{ width: `${(c.clicks / maxCta) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Channels + Devices + Countries */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Reveal>
          <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Channels</h3>
            <ul className="space-y-2.5">
              {w.sources.map((s) => (
                <li key={s.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ua-ink">{s.label}</span>
                    <span className="text-ua-ink/55">{n(s.visitors)}</span>
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
              {w.devices.map((d) => (
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
            <h3 className="mb-2 mt-4 text-sm font-black uppercase tracking-widest text-ua-ink/50">Top referrers</h3>
            <ul className="space-y-1.5">
              {w.referrers.map((r) => (
                <li key={r.label} className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-ua-ink">{r.label}</span>
                  <span className="text-ua-ink/55">{n(r.visitors)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal>
          <div className="h-full rounded-3xl border-2 border-ua-ink bg-white p-5 shadow-[6px_6px_0_var(--ua-ink)]">
            <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-ua-ink/50">Top countries</h3>
            <ul className="space-y-2.5">
              {w.countries.map((c) => (
                <li key={c.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-ua-ink">{c.label}</span>
                    <span className="text-ua-ink/55">{n(c.visitors)}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ua-bg">
                    <div className="h-full rounded-full bg-ua-green" style={{ width: `${(c.visitors / maxCountry) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
