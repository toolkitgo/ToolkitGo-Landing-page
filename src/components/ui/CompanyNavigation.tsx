"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { COMPANY_LINKS } from "@/lib/site";
import type { CompanyNavigationProps } from "@/types/legal";

/** Native disclosure supports keyboard activation and remains usable before hydration. */
export function CompanyNavigation({ onNavigate }: CompanyNavigationProps) {
  const disclosure = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !disclosure.current?.contains(event.target) && disclosure.current) disclosure.current.open = false;
    };
    const closeWithEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || !disclosure.current?.open) return;
      disclosure.current.open = false;
      disclosure.current.querySelector("summary")?.focus();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeWithEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeWithEscape);
    };
  }, []);
  return <details ref={disclosure} className="company-navigation" onBlur={(event) => {
    if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false;
  }}>
    <summary>Company <ChevronDown size={15} aria-hidden="true" /></summary>
    <div className="company-panel">
      <p>Get to know ToolkitGo</p>
      <ul>{COMPANY_LINKS.map((link) => <li key={link.href}><Link href={link.href} onClick={() => {
        if (disclosure.current) disclosure.current.open = false;
        onNavigate?.();
      }}>{link.label}<ArrowUpRight size={15} aria-hidden="true" /></Link></li>)}</ul>
    </div>
  </details>;
}
