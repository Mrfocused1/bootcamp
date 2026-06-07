interface ProgressBarProps {
  percent: number; // 0–100
  label?: string;
}

export function ProgressBar({ percent, label }: ProgressBarProps) {
  const clamped = Math.min(Math.max(Math.round(percent), 0), 100);

  return (
    <div className="w-full">
      {label !== undefined && (
        <div className="mb-1.5 flex items-center justify-between text-sm font-medium">
          <span style={{ color: "var(--ua-ink)" }}>{label}</span>
          <span style={{ color: "var(--ua-blue)" }}>{clamped}%</span>
        </div>
      )}
      <div
        className="h-3 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: "var(--ua-ink)", opacity: 0.12 }}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progress"}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${clamped}%`,
            backgroundColor: "var(--ua-blue)",
            opacity: 1,
          }}
        />
      </div>
    </div>
  );
}
