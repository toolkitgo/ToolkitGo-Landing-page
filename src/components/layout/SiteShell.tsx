import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { SiteShellProps } from "@/types/ui";

/** Every public page shares the same navigation, skip link, and complete branded footer. */
export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="site-shell relative flex min-h-screen w-full flex-col bg-cream text-navy selection:bg-orange selection:text-navy">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-navy focus:p-4 focus:text-white">Skip to content</a>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
