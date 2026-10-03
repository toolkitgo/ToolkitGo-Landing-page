import Image from "next/image";
import { ArrowUpRight, Mail } from "lucide-react";
import { CONTACT_EMAIL, SOCIAL_PROFILES } from "@/lib/site";

/** A compact footer mirrors the page navigation without decorative overlays. */
export function Footer() {
  return (
    <footer id="contact" className="bg-navy py-12 text-white">
      <div className="page-shell">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
          <div>
            <a href="#home" aria-label="ToolkitGO home">
              <Image src="/assets/branding/logo-white.png" alt="ToolkitGO" width={192} height={50} className="h-auto w-44" />
            </a>
            <p className="mt-4 text-sm text-cream">Simplifying everyday services.</p>
            <p className="mt-5 text-sm font-semibold text-orange">Contact us</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-2 inline-flex items-center gap-2 py-1 text-sm text-cream underline underline-offset-4 hover:text-orange"><Mail aria-hidden="true" className="size-4" />{CONTACT_EMAIL}</a>
          </div>
          <nav aria-label="Footer services">
            <h2 className="mb-4 text-sm font-semibold text-orange">Our services</h2>
            <ul className="flex flex-col gap-3 text-sm text-cream">
              <li><a href="#services" className="hover:underline">Household services</a></li>
              <li><a href="#services" className="hover:underline">Corporate services</a></li>
              <li><a href="#services" className="hover:underline">Contract services</a></li>
            </ul>
          </nav>
          <nav aria-label="Footer company">
            <h2 className="mb-4 text-sm font-semibold text-orange">ToolkitGO</h2>
            <ul className="flex flex-col gap-3 text-sm text-cream">
              <li><a href="#about" className="hover:underline">About us</a></li>
              <li><a href="#for-technicians" className="hover:underline">For technicians</a></li>
              <li><a href="#app-download" className="hover:underline">Our app &middot; Coming soon</a></li>
            </ul>
          </nav>
          <div>
            <h2 className="mb-4 text-sm font-semibold text-orange">Social media</h2>
            <ul className="flex flex-col gap-3 text-sm text-cream">
              {SOCIAL_PROFILES.map((profile) => (
                <li key={profile.name}>
                  {profile.href ? (
                    <a href={profile.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                      {profile.name}<ArrowUpRight aria-hidden="true" className="size-3.5" />
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <span aria-disabled="true" title="Official profile link not available yet">{profile.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-navy-border pt-6 text-xs text-cream">
          <p>&copy; 2026 ToolkitGO Technologies. All rights reserved.</p>
          <a href="#home" className="font-semibold hover:underline">Back to top &uarr;</a>
        </div>
      </div>
    </footer>
  );
}
