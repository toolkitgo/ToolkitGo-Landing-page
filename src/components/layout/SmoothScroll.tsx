"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap/config";
import type { ScrollViewportAnchor } from "@/types/motion";

let activeSmoother: Lenis | null = null;

/** Keep layout corrections synchronized with the scroll engine, including reduced motion. */
export function scrollToPageOffset(top: number, immediate = false): void {
  if (activeSmoother) {
    if (immediate) activeSmoother.resize();
    activeSmoother.scrollTo(top, { duration: 0.7, immediate, force: immediate });
  }
  else window.scrollTo({ top, behavior: "instant" });
}

/** Ease wheel scrolling while preserving native anchors, touch, and keyboard navigation. */
export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let smoother: Lenis | null = null;
    const tick = (seconds: number) => smoother?.raf(seconds * 1000);

    // Refreshing restores scroll position during measurement. Defer it while an
    // anchor is moving or a dialog is open, so neither interaction gets interrupted.
    let refreshTimer: ReturnType<typeof setTimeout> | undefined;
    let refreshRequested = false;
    let disposed = false;
    let viewportAnchor: ScrollViewportAnchor | null = null;
    const rememberViewport = () => {
      const pinnedScene = document.querySelector<HTMLElement>(".booking-scene[data-scroll-driven='true']");
      const pinnedBounds = pinnedScene?.getBoundingClientRect();
      if (pinnedScene && pinnedBounds && Math.abs(pinnedBounds.top - 96) < 2) {
        viewportAnchor = { element: pinnedScene, top: pinnedBounds.top };
        return;
      }
      const section = Array.from(document.querySelectorAll<HTMLElement>("main > section, footer")).find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= 128 && rect.bottom > 128;
      });
      if (section) viewportAnchor = { element: section, top: section.getBoundingClientRect().top };
    };
    const restoreViewport = () => {
      if (!viewportAnchor?.element.isConnected) return;
      const adjustment = viewportAnchor.element.getBoundingClientRect().top - viewportAnchor.top;
      if (Math.abs(adjustment) > 0.5) scrollToPageOffset(window.scrollY + adjustment, true);
    };
    const isScrollLocked = () => ["hidden", "clip"].includes(document.body.style.overflow);
    const scheduleRefresh = () => {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => {
        if (disposed || isScrollLocked()) return;
        refreshRequested = false;
        smoother?.resize();
        ScrollTrigger.refresh();
      }, 250);
    };
    const refreshLayout = () => {
      if (disposed) return;
      refreshRequested = true;
      scheduleRefresh();
    };
    const onLayoutScroll = () => {
      rememberViewport();
      if (refreshRequested && !isScrollLocked()) scheduleRefresh();
    };
    const onAssetLoad = (event: Event) => {
      if (event.target instanceof HTMLImageElement) refreshLayout();
    };

    // Existing dialogs lock body overflow; stop any momentum as soon as they open.
    const syncScrollLock = () => {
      if (isScrollLocked()) {
        // Body overflow alone does not cancel an in-flight browser smooth anchor.
        window.scrollTo({ top: window.scrollY, left: window.scrollX, behavior: "instant" });
        smoother?.stop();
      } else {
        smoother?.start();
        if (refreshRequested) scheduleRefresh();
      }
    };

    const syncMotionPreference = () => {
      gsap.ticker.remove(tick);
      smoother?.destroy();
      smoother = null;
      activeSmoother = null;
      if (reducedMotion.matches) return;

      smoother = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        // Browser anchors retain their URL history, focus behavior, and CSS offsets.
        anchors: false,
        prevent: (node) => node.tagName === "DIALOG" || node.id === "mobile-navigation" || node.tagName === "TEXTAREA",
      });
      activeSmoother = smoother;
      smoother.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
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

    document.addEventListener("load", onAssetLoad, true);
    window.addEventListener("scroll", onLayoutScroll, { passive: true });
    // This event runs after GSAP has reverted and refreshed all media-specific pins.
    ScrollTrigger.addEventListener("matchMedia", restoreViewport);
    rememberViewport();
    void document.fonts.ready.then(refreshLayout);

    return () => {
      disposed = true;
      clearTimeout(refreshTimer);
      document.removeEventListener("load", onAssetLoad, true);
      window.removeEventListener("scroll", onLayoutScroll);
      ScrollTrigger.removeEventListener("matchMedia", restoreViewport);
      scrollLockObserver.disconnect();
      reducedMotion.removeEventListener("change", syncMotionPreference);
      document.removeEventListener("click", onAnchorClick);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", cancelMomentum);
      gsap.ticker.remove(tick);
      smoother?.destroy();
      activeSmoother = null;
    };
  }, []);

  return null;
}
