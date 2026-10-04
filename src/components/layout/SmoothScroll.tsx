"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/** Ease wheel scrolling while preserving native anchors, touch, and keyboard navigation. */
export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let smoother: Lenis | null = null;

    // Existing dialogs lock body overflow; stop any momentum as soon as they open.
    const syncScrollLock = () => {
      const locked = ["hidden", "clip"].includes(document.body.style.overflow);
      if (locked) smoother?.stop();
      else smoother?.start();
    };

    const syncMotionPreference = () => {
      smoother?.destroy();
      smoother = null;
      if (reducedMotion.matches) return;

      smoother = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        // Browser anchors retain their URL history, focus behavior, and CSS offsets.
        anchors: false,
        prevent: (node) => node.tagName === "DIALOG" || node.id === "mobile-navigation" || node.tagName === "TEXTAREA",
      });
      syncScrollLock();
    };

    const cancelMomentum = () => {
      if (!smoother || smoother.isStopped) return;
      smoother.stop();
      smoother.start();
    };

    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement)) return;
      const destination = new URL(link.href);
      if (destination.origin === window.location.origin && destination.pathname === window.location.pathname && destination.hash) cancelMomentum();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !["Tab", "PageUp", "PageDown", "Home", "End", "ArrowUp", "ArrowDown", " "].includes(event.key)) return;
      const editing = event.target instanceof Element && event.target.closest("input, textarea, select, [contenteditable]");
      if (!editing || event.key === "Tab") cancelMomentum();
    };

    const scrollLockObserver = new MutationObserver(syncScrollLock);
    scrollLockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    syncMotionPreference();
    reducedMotion.addEventListener("change", syncMotionPreference);
    document.addEventListener("click", onAnchorClick);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", cancelMomentum);

    return () => {
      scrollLockObserver.disconnect();
      reducedMotion.removeEventListener("change", syncMotionPreference);
      document.removeEventListener("click", onAnchorClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", cancelMomentum);
      smoother?.destroy();
    };
  }, []);

  return null;
}
