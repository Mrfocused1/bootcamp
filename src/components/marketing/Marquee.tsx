export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-ua-ink bg-ua-green py-4">
      <div className="ua-marquee flex w-max gap-10 whitespace-nowrap">
        {row.map((t, i) => (
          <span
            key={i}
            className="text-2xl font-bold uppercase text-ua-ink"
            style={{ fontFamily: "var(--font-epilogue)" }}
          >
            {t} <span className="text-ua-blue" aria-hidden="true">✷</span>
          </span>
        ))}
      </div>
    </div>
  );
}
