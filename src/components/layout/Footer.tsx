import Image from "next/image";
import {
  CONTACT_EMAIL,
  CONTACT_LOCATION,
  CONTACT_PHONE,
  CONTACT_PHONE_HREF,
  FOOTER_QUICK_LINKS,
  FOOTER_SERVICE_LINKS,
  FOOTER_SUPPORT_LINKS,
  LEGAL_NAME,
  SOCIAL_PROFILES,
} from "@/lib/site";
import type { FooterLinkGroupProps } from "@/types/ui";

/** Link columns retain readable spacing and useful touch targets on small screens. */
function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
  return (
    <nav aria-label={`Footer ${title}`}>
      <h2 className="mb-4 text-base font-semibold tracking-tight text-white">{title}</h2>
      <ul className="flex flex-col gap-1 text-sm leading-relaxed text-cream">
        {links.map((link) => (
          <li key={link.label}>
            {link.href ? (
              <a href={link.href} className="inline-block py-1.5 transition-colors hover:text-orange hover:underline hover:underline-offset-4">{link.label}</a>
            ) : (
              <span aria-disabled="true" title="Page not available yet" className="inline-block py-1.5">{link.label}</span>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Solid navy and an oversized wordmark give the page a clear branded ending. */
export function Footer() {
  return (
    <footer id="contact" className="overflow-hidden bg-navy pt-12 text-cream sm:pt-16">
      <div className="page-shell-wide">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.85fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-x-6 xl:gap-x-10">
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <a href="#home" aria-label="ToolkitGO home" className="inline-block rounded-sm">
              <Image src="/assets/branding/logo-white.png" alt="ToolkitGO" width={378} height={86} sizes="240px" className="h-auto w-[220px] xl:w-[240px]" />
            </a>
            <p className="mt-5 max-w-[29ch] text-sm leading-relaxed">Connecting you with skilled professionals for home, business and large scale service needs.</p>
          </div>
          <FooterLinkGroup title="Quick Links" links={FOOTER_QUICK_LINKS} />
          <FooterLinkGroup title="Our Services" links={FOOTER_SERVICE_LINKS} />
          <div className="footer-support col-span-2 min-w-0 lg:col-span-1">
            <FooterLinkGroup title="Support" links={FOOTER_SUPPORT_LINKS} />
          </div>
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <h2 className="mb-4 text-base font-semibold tracking-tight text-white">Get in touch</h2>
            <address className="flex flex-col gap-3 text-sm not-italic">
              <a href={`mailto:${CONTACT_EMAIL}`} className="flex min-h-8 items-center gap-3 hover:underline hover:underline-offset-4">
                <Image src="/assets/icons/footer/mail.svg" alt="" width={26} height={26} unoptimized className="shrink-0" />
                <span>{CONTACT_EMAIL}</span>
              </a>
              <a href={CONTACT_PHONE_HREF} className="flex min-h-8 items-center gap-3 hover:underline hover:underline-offset-4">
                <Image src="/assets/icons/footer/phone.svg" alt="" width={26} height={26} unoptimized className="shrink-0" />
                <span>{CONTACT_PHONE}</span>
              </a>
              <p className="flex min-h-8 items-center gap-3">
                <Image src="/assets/icons/footer/location.svg" alt="" width={26} height={26} unoptimized className="shrink-0" />
                <span>{CONTACT_LOCATION}</span>
              </p>
            </address>
            <ul aria-label="Social media" className="mt-6 flex flex-wrap items-center gap-2">
              {SOCIAL_PROFILES.map((profile) => (
                <li key={profile.name}>
                  {profile.href ? (
                    <a href={profile.href} aria-label={`${profile.name} (opens in a new tab)`} target="_blank" rel="noopener noreferrer" className="flex size-11 items-center justify-center rounded-full bg-cream transition-colors hover:bg-orange-subtle">
                      <Image src={profile.icon} alt="" width={28} height={28} unoptimized />
                    </a>
                  ) : (
                    <span aria-label={profile.name} aria-disabled="true" title={`${profile.name}: official profile link not available yet`} className="flex size-11 items-center justify-center rounded-full bg-cream">
                      <Image src={profile.icon} alt="" width={28} height={28} unoptimized />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-4 border-t border-navy-border pt-6 text-xs leading-relaxed sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 {LEGAL_NAME}. All rights reserved.</p>
          <a href="#home" className="inline-flex min-h-8 w-fit items-center gap-3 text-sm hover:underline hover:underline-offset-4">Back to top <span aria-hidden="true">&#8593;</span></a>
        </div>
        <div aria-hidden="true" className="pointer-events-none mt-10 -mb-3 select-none overflow-hidden pt-3 text-center sm:mt-14 sm:-mb-5">
          <p className="footer-wordmark whitespace-nowrap"><span className="footer-wordmark-main">Toolkit</span><span className="footer-wordmark-accent">Go</span></p>
        </div>
      </div>
    </footer>
  );
}
