"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/marketing/reducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function Sticker({
  name,
  alt = "",
  className,
  size = 96,
  rotate = 0,
  animate = true,
}: {
  name: string;
  alt?: string;
  className?: string;
  size?: number;
  rotate?: number;
  /** Set false when a parent timeline sequences the reveal itself. */
  animate?: boolean;
}) {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !animate) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, scale: 1, rotate });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.2, rotate: rotate - 25 },
        {
          opacity: 1,
          scale: 1,
          rotate,
          duration: 0.7,
          ease: "back.out(1.7)",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [rotate, animate]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={`/marketing/stickers/${name}.png`}
      alt={alt}
      aria-hidden={alt === "" ? true : undefined}
      width={size}
      height={size}
      className={`${animate ? "ua-reveal " : ""}${className ?? ""}`}
      style={{
        width: size,
        height: "auto",
        opacity: animate ? 0 : undefined,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  );
}
