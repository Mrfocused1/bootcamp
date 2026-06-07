export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16">
      <h1
        className="text-4xl font-bold lowercase"
        style={{
          fontFamily: "var(--font-epilogue), Epilogue, sans-serif",
          color: "var(--ua-ink)",
        }}
      >
        About
      </h1>
      <p className="mt-4 text-base" style={{ color: "var(--ua-ink)", opacity: 0.55 }}>
        Coming soon.
      </p>
    </div>
  );
}
