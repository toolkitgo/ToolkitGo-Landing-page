"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import { ArrowRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MobileNavigationProps } from "@/types/ui";

const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Why us", href: "#why-us" },
  { name: "How it works", href: "#how-it-works" },
  { name: "About us", href: "#about" },
  { name: "Our app", href: "#app-download" },
];

/** Exit rows become inert immediately, so keyboard focus cannot enter a closing menu. */
function MobileNavigation({ activeSection, onNavigate }: MobileNavigationProps) {
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();

  return (
    <motion.nav
      id="mobile-navigation"
      aria-label="Mobile navigation"
      inert={!isPresent}
      initial={{ opacity: 0, y: reduceMotion ? 0 : -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
      className="absolute inset-x-4 top-2 z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto overscroll-contain rounded-2xl border border-cream-border bg-white px-5 pb-5 pt-2 shadow-2xl lg:hidden"
    >
      <div className="flex flex-col">
        {NAV_LINKS.map((link, index) => (
          <motion.a
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            aria-current={activeSection === link.href.slice(1) ? "location" : undefined}
            initial={{ opacity: 0, x: reduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, delay: reduceMotion ? 0 : index * 0.035 }}
            className="flex min-h-12 items-center justify-between border-b border-border py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary aria-current:text-primary"
          >
            {link.name}
            {activeSection === link.href.slice(1) && <span aria-hidden="true" className="size-1.5 rounded-full bg-orange" />}
          </motion.a>
        ))}
      </div>
      <a href="#for-technicians" onClick={onNavigate} className="button-primary mt-5 w-full rounded-full">
        Join as a Partner <ArrowRight aria-hidden="true" className="size-4" />
      </a>
      <a href="mailto:info@toolkit.in" className="mt-4 block py-1 text-center text-sm text-muted-foreground underline underline-offset-4">info@toolkit.in</a>
    </motion.nav>
  );
}

/** Supplied Navbar1 adapted to ToolkitGO's assets, anchors and mobile disclosure. */
export function Navbar1() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      }
    }, { rootMargin: "-15% 0px -65% 0px" });
    document.querySelectorAll("main section[id]").forEach((section) => observer.observe(section));
    return () => observer.disconnect();
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
    const onResize = () => { if (desktop.matches) setIsOpen(false); };
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
    <header
      ref={headerRef}
      className="sticky top-0 z-40 w-full border-b border-cream-border/70 bg-cream/95 backdrop-blur-md transition-all shadow-xs"
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#home" aria-label="ToolkitGO home" onClick={() => setIsOpen(false)} className="shrink-0">
          <Image
            src="/assets/branding/logo.png"
            alt="ToolkitGO"
            width={192}
            height={50}
            preload
            className="h-auto w-36 sm:w-44"
          />
        </a>

        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {NAV_LINKS.map((link) => (
            <motion.a
              key={link.href}
              href={link.href}
              whileHover={reduceMotion ? undefined : { y: -2 }}
              transition={{ duration: 0.15 }}
              aria-current={activeSection === link.href.slice(1) ? "location" : undefined}
              className={cn(
                "relative py-2 text-sm font-semibold text-navy transition-colors hover:text-orange",
                activeSection === link.href.slice(1) && "text-orange"
              )}
            >
              {link.name}
              {activeSection === link.href.slice(1) && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-orange" />
              )}
            </motion.a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href="#for-technicians"
            className="button-primary hidden shrink-0 rounded-full lg:inline-flex"
          >
            Join as a Partner <ArrowRight aria-hidden="true" className="size-4" />
          </a>

          <motion.button
            ref={menuButtonRef}
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls={isOpen ? "mobile-navigation" : undefined}
            onClick={() => setIsOpen((open) => !open)}
            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
            className="relative flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-cream-border bg-white text-navy shadow-xs transition-colors hover:border-orange lg:hidden"
          >
            <AnimatePresence initial={false} mode="wait">
              <motion.span
                key={isOpen ? "close" : "menu"}
                initial={{ opacity: 0, rotate: reduceMotion ? 0 : -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: reduceMotion ? 0 : 45 }}
                transition={{ duration: reduceMotion ? 0 : 0.12 }}
              >
                {isOpen ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <MobileNavigation
              key="mobile-menu"
              activeSection={activeSection}
              onNavigate={closeAfterNavigation}
            />
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
