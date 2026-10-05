"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap/config";
import type { SectionMotionProps } from "@/types/motion";

/** A rising device reveal, timed against its own frame so it also works on tall mobile layouts. */
export function AppLaunchMotion({ children }: SectionMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const scope = containerRef.current;
    if (!scope) return;
    const media = gsap.matchMedia();
    media.add({
      all: "(min-width: 0px)",
      desktop: "(min-width: 768px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = context.conditions?.desktop;
      const copy = scope.querySelector("[data-app-copy]");
      const frame = scope.querySelector("[data-app-phone-frame]");
      const stores = scope.querySelector("[data-app-stores]");
      if (!copy || !frame || !stores) return;

      gsap.from(copy.children, {
        y: 22, opacity: 0, duration: 0.85, stagger: 0.12,
        ease: "power3.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: copy, start: "clamp(top 88%)", once: true },
      });
      gsap.from(frame.querySelector("img"), {
        y: desktop ? 160 : 80, rotation: desktop ? 5 : 3,
        scale: 0.94, opacity: 0, duration: 1.4, ease: "power3.out",
        transformOrigin: "center bottom", clearProps: "transform,opacity,transformOrigin",
        scrollTrigger: { trigger: frame, start: "clamp(top 88%)", once: true },
      });
      gsap.from(stores.querySelectorAll("img, p"), {
        y: 18, opacity: 0, duration: 0.7, stagger: 0.1,
        ease: "power2.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: stores, start: "clamp(top 92%)", once: true },
      });
    });
    return () => media.revert();
  }, { scope: containerRef });

  return <div ref={containerRef} className="contents">{children}</div>;
}
