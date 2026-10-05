import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register core plugins once at module load in browser context
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Lenis and ScrollTrigger share real elapsed time, including after a busy frame.
  gsap.ticker.lagSmoothing(0);

  // High-performance defaults
  gsap.defaults({
    ease: "power3.out",
    duration: 0.8,
  });

  // Optimize ScrollTrigger performance
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
}

// Reusable physics and easing curves
export const EASE = {
  smoothOut: "power3.out",
  smoothInOut: "power3.inOut",
  elasticPop: "back.out(1.8)",
  floatSine: "sine.inOut",
  linear: "none",
} as const;

export { gsap, ScrollTrigger, useGSAP };
