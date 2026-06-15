// Pure formatting helpers for the CRM (safe in server + client components).

export function formatMoney(n: number): string {
  const v = Number(n) || 0;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(v);
}

export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Start-of-day difference in whole days (positive = future). */
function dayDiff(iso: string): number {
  const target = new Date(iso);
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export type FollowUpBucket = "overdue" | "today" | "upcoming";

export function followUpBucket(iso: string): FollowUpBucket {
  const d = dayDiff(iso);
  if (d < 0) return "overdue";
  if (d === 0) return "today";
  return "upcoming";
}

/** "Overdue · 2 days", "Today", "Tomorrow", "in 3 days". */
export function relativeDay(iso: string | null): string {
  if (!iso) return "—";
  const d = dayDiff(iso);
  if (d < -1) return `Overdue · ${Math.abs(d)} days`;
  if (d === -1) return "Overdue · 1 day";
  if (d === 0) return "Today";
  if (d === 1) return "Tomorrow";
  if (d < 7) return `In ${d} days`;
  if (d < 14) return "Next week";
  return formatDate(iso);
}

/** "2 hours ago", "3 days ago", or a date for older items. */
export function timeAgo(iso: string | null): string {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  return formatDate(iso);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}
