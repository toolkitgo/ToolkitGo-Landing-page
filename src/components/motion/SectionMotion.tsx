"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap/config";
import type { SectionMotionProps } from "@/types/motion";

/** Progressive enhancement: content remains visible before JavaScript and after cleanup. */
export function SectionMotion({ children }: SectionMotionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({
      all: "(min-width: 0px)",
      desktop: "(min-width: 1024px)",
      reduced: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      if (context.conditions?.reduced) return;
      const desktop = context.conditions?.desktop;
      const scope = containerRef.current;
      if (!scope) return;

      const reveal = (targets: Element[], trigger?: Element) => {
        if (!targets.length) return;
        gsap.from(targets, {
          y: desktop ? 24 : 14,
          opacity: 0,
          duration: desktop ? 0.85 : 0.6,
          stagger: 0.1,
          ease: "power3.out",
          clearProps: "transform,opacity",
          ...(trigger ? { scrollTrigger: { trigger, start: "clamp(top 96%)", once: true } } : {}),
        });
      };

      scope.querySelectorAll("[data-motion-group]").forEach((group) => {
        const targets = Array.from(group.querySelectorAll("[data-motion]"));
        // Long mobile columns reveal each item on arrival, rather than off screen with the first row.
        if (desktop) reveal(targets, group);
        else targets.forEach((target) => reveal([target], target));
      });
      scope.querySelectorAll("[data-motion]").forEach((target) => {
        if (!target.closest("[data-motion-group]")) reveal([target], target);
      });
      reveal(Array.from(scope.querySelectorAll("[data-motion-enter]")));

      scope.querySelectorAll("[data-motion-art]").forEach((target) => {
        gsap.from(target, {
          y: desktop ? 48 : 24, rotation: desktop ? -2 : 0, scale: 0.96, opacity: 0,
          duration: 1.1, ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: target, start: "clamp(top 92%)", once: true },
        });
      });
      scope.querySelectorAll("[data-motion-icon]").forEach((target) => {
        gsap.from(target, {
          scale: 0.8, rotation: -8, opacity: 0, duration: 0.8, delay: 0.15,
          ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: target.parentElement, start: "clamp(top 92%)", once: true },
        });
      });
      scope.querySelectorAll("[data-motion-wordmark]").forEach((target) => {
        gsap.from(target, {
          yPercent: 35, opacity: 0, duration: 1.3, ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: target.parentElement, start: "clamp(top 98%)", once: true },
        });
      });

      // Artwork moves independently of its entrance, so the transforms never compete.
      if (desktop) scope.querySelectorAll<HTMLElement>("[data-motion-parallax]").forEach((target) => {
        const distance = Number(target.dataset.motionParallax) || 24;
        gsap.to(target, {
          y: distance,
          ease: "none",
          scrollTrigger: { trigger: scope.parentElement, start: "top top", end: "bottom top", scrub: 0.65 },
        });
      });
    });
    return () => media.revert();
  }, { scope: containerRef });

  return <div ref={containerRef} className="contents">{children}</div>;
}
