// The brand wordmark (hand-lettered "Bridgway ai Bootcamp") rendered via a CSS
// mask so a single transparent asset can be painted any colour. Pass `color` as
// any CSS colour — typically var(--ua-bg) (cream) on dark backgrounds and
// var(--ua-ink) on light ones. Size with `className` (e.g. h-12 w-16).
const MASK = "url(/marketing/logo.png)";

export function BrandLogo({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        backgroundColor: color,
        transition: "background-color 200ms ease",
        WebkitMaskImage: MASK,
        maskImage: MASK,
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        WebkitMaskSize: "contain",
        maskSize: "contain",
      }}
    />
  );
}
