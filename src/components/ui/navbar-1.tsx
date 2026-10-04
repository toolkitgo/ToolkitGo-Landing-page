"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { ArrowRight, Mail, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CONTACT_EMAIL } from "@/lib/site";
import type { MobileNavigationProps } from "@/types/ui";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Why us", href: "#why-us" },
  { name: "How it works", href: "#how-it-works" },
  { name: "About us", href: "#about" },
  { name: "Our app", href: "#app-download" },
];

/** A non-modal disclosure: native scrolling and Tab order remain available. */
function MobileNavigation({ activeSection, onNavigate }: MobileNavigationProps) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      id="mobile-navigation"
      aria-label="Mobile navigation"
      inert={!isPresent}
      initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.18, ease: "easeOut" }}
      className="absolute right-3 top-full w-[calc(100%-1.5rem)] max-w-md max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-3xl border border-cream-border bg-cream p-3 text-navy shadow-nav-panel lg:hidden"
    >
      <ul className="grid gap-1">
        {NAV_LINKS.map((link) => {
          const active = activeSection === link.href.slice(1);
          return (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={onNavigate}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "flex min-h-13 items-center justify-between gap-3 rounded-2xl px-4 py-3 text-base font-semibold transition-colors hover:bg-cream-dark",
                  active && "bg-cream-dark"
                )}
              >
                <span>{link.name}</span>
                {active ? <span aria-hidden="true" className="size-2 rounded-full bg-orange" />
                  : <ArrowRight aria-hidden="true" className="size-4 text-charcoal-muted" />}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="mt-3 border-t border-cream-border px-1 pt-4">
        <a href="#for-technicians" onClick={onNavigate} className="button-primary min-h-12 w-full rounded-full"
          aria-current={activeSection === "for-technicians" ? "location" : undefined}>
          Join as a Partner <ArrowRight aria-hidden="true" className="size-4" />
        </a>
        <a href={`mailto:${CONTACT_EMAIL}`} onClick={onNavigate}
          className="mt-2 flex min-h-11 items-center justify-center gap-2 rounded-xl text-sm text-charcoal-muted hover:text-navy">
          <Mail aria-hidden="true" className="size-4" />{CONTACT_EMAIL}
        </a>
      </div>
    </motion.nav>
  );
}

/** Solid floating navigation keeps a stable height and native section links. */
export function Navbar1() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[id]"));
    let frame: number | null = null;
    // Read positions once per frame, selecting the last section beneath the header.
    const updateActiveSection = () => {
      frame = null;
      const threshold = (headerRef.current?.getBoundingClientRect().bottom ?? 80) + 40;
      let current = "home";
      for (const section of sections) {
        if (section.getBoundingClientRect().top > threshold) break;
        current = section.id;
      }
      setActiveSection((previous) => previous === current ? previous : current);
    };
    const scheduleUpdate = () => {
      if (frame === null) frame = window.requestAnimationFrame(updateActiveSection);
    };
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setIsOpen(false);
        menuButtonRef.current?.focus({ preventScroll: true });
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) setIsOpen(false);
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onResize = () => {
      if (!desktop.matches) return;
      const focusWasInNavigation = headerRef.current?.contains(document.activeElement);
      setIsOpen(false);
      if (focusWasInNavigation) logoRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    desktop.addEventListener("change", onResize);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [isOpen]);

  const closeAfterNavigation = () => {
    setIsOpen(false);
    menuButtonRef.current?.focus({ preventScroll: true });
  };

  return (
    <header ref={headerRef} className="sticky top-0 z-40 flex h-20 w-full items-center"
      onBlurCapture={(event) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) setIsOpen(false);
      }}>
      <div className="navbar-shell mx-auto flex h-16 items-center justify-between gap-3 rounded-3xl border border-cream-border bg-cream px-3 shadow-nav lg:gap-4 lg:rounded-full lg:px-5 xl:px-6">
        <a ref={logoRef} href="#home" aria-label="ToolkitGO home" onClick={() => setIsOpen(false)} className="shrink-0 rounded-sm">
          <Image src="/assets/branding/logo.png" alt="ToolkitGO" width={378} height={86}
            sizes="(min-width: 1280px) 176px, (min-width: 1024px) 160px, 144px" preload
            className="h-auto w-36 lg:w-40 xl:w-44" />
        </a>
        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = activeSection === link.href.slice(1);
              return (
                <li key={link.href}>
                  <a href={link.href} aria-current={active ? "location" : undefined}
                    className={cn("relative inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-2.5 py-2 text-sm font-semibold text-navy transition-colors hover:bg-cream-dark xl:px-3.5", active && "bg-cream-dark")}>
                    {link.name}
                    {active && <span aria-hidden="true" className="absolute inset-x-4 bottom-1.5 h-0.5 rounded-full bg-orange" />}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
        <a href="#for-technicians" aria-current={activeSection === "for-technicians" ? "location" : undefined}
          className="button-primary hidden min-h-11 shrink-0 rounded-full lg:inline-flex">
          Join as a Partner <ArrowRight aria-hidden="true" className="size-4" />
        </a>
        <motion.button ref={menuButtonRef} type="button" tabIndex={0}
          aria-label={isOpen ? "Close menu" : "Open menu"} aria-expanded={isOpen}
          aria-controls={isOpen ? "mobile-navigation" : undefined} onClick={() => setIsOpen((open) => !open)}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-2xl border border-cream-border bg-cream-light text-navy transition-colors hover:bg-cream-dark lg:hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.span key={isOpen ? "close" : "menu"} aria-hidden="true"
              initial={{ opacity: 0, rotate: reduceMotion ? 0 : -30 }} animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: reduceMotion ? 0 : 30 }} transition={{ duration: reduceMotion ? 0 : 0.12 }}>
              {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {isOpen && <MobileNavigation key="mobile-menu" activeSection={activeSection} onNavigate={closeAfterNavigation} />}
      </AnimatePresence>
    </header>
  );
}
