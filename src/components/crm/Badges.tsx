import type { LeadStatus, LeadPriority, ActivityType } from "@/lib/types";
import {
  STATUS_META,
  PRIORITY_META,
  ACTIVITY_TYPE_META,
} from "@/lib/crm-constants";
import { initials } from "@/lib/crm-format";

export function StatusBadge({ status }: { status: LeadStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${m.badge}`}
      style={{ fontFamily: "var(--font-epilogue)" }}
    >
      {m.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: LeadPriority }) {
  const m = PRIORITY_META[priority];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${m.badge}`}>
      {priority === "high" && <span aria-hidden>▲</span>}
      {m.label}
    </span>
  );
}

export function ActivityGlyph({ type }: { type: ActivityType }) {
  const m = ACTIVITY_TYPE_META[type];
  return (
    <span
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-ua-ink bg-white text-sm"
      title={m.label}
      aria-hidden
    >
      {type === "linkedin" ? (
        <span className="text-[11px] font-black lowercase text-ua-blue">in</span>
      ) : (
        m.glyph
      )}
    </span>
  );
}

/** Coloured initials chip for a team member. */
export function Avatar({
  name,
  size = "md",
  tone = "sky",
}: {
  name: string;
  size?: "sm" | "md";
  tone?: "sky" | "pink" | "green" | "orange" | "blue";
}) {
  const dims = size === "sm" ? "h-7 w-7 text-[10px]" : "h-9 w-9 text-xs";
  const tones: Record<string, string> = {
    sky: "bg-ua-sky text-ua-ink",
    pink: "bg-ua-pink text-ua-ink",
    green: "bg-ua-green text-ua-ink",
    orange: "bg-ua-orange text-white",
    blue: "bg-ua-blue text-white",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 border-ua-ink font-black ${dims} ${tones[tone]}`}
      style={{ fontFamily: "var(--font-epilogue)" }}
      title={name}
    >
      {initials(name)}
    </span>
  );
}

/** Deterministic tone per member id so avatars are colour-stable. */
export function toneForId(id: string | null | undefined): "sky" | "pink" | "green" | "orange" | "blue" {
  const tones = ["sky", "pink", "green", "orange", "blue"] as const;
  if (!id) return "sky";
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return tones[h % tones.length];
}
