import type { ReactNode } from "react";
import { SiteShell } from "@/components/layout/SiteShell";

/** Shared site navigation surrounds accessible, server-rendered policy content. */
export default function LegalLayout({ children }: { children: ReactNode }) {
  return <SiteShell>
    <main id="main-content" tabIndex={-1} className="legal-main flex-1">{children}</main>
  </SiteShell>;
}
