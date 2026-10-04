import Image from "next/image";

const BADGES = [
  { title: "Fast bookings", icon: "fast-bookings" },
  { title: "Verified professionals", icon: "verified-professionals" },
  { title: "Transparent interactions", icon: "transparent-interactions" },
  { title: "Trusted connections", icon: "trusted-connections" },
];

/** The original technician artwork leads a fully server-rendered hero. */
export function HeroSection() {
  return (
    <section id="home" className="bg-cream pt-12 pb-10 sm:pt-16 sm:pb-12">
      <div className="page-shell">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-12">
          <div>
            <p className="eyebrow">Trusted &middot; Verified &middot; On-demand in Hyderabad</p>
            <h1 className="mt-6 text-[clamp(2.5rem,4.6vw,4.25rem)] font-bold leading-[1.08] tracking-[-0.045em]">
              Simplifying<br /><span className="text-orange">Everyday Services</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-charcoal sm:text-lg">
              ToolkitGO connects you with skilled, verified independent professionals for household repairs,
              business maintenance, and on-demand technical services across Hyderabad.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#services" className="button-primary">Explore services <span aria-hidden="true">&rarr;</span></a>
              <a href="#for-technicians" className="button-secondary">Join as a partner</a>
            </div>
          </div>
          <Image
            src="/assets/illustrations/hero-technician-door.svg"
            alt="ToolkitGO verified technician arriving at a customer doorstep in Hyderabad for on-demand home service"
            width={1000}
            height={1000}
            preload
            unoptimized
            className="mx-auto h-auto w-full max-w-[420px] lg:max-w-none"
          />
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-6 border-t border-cream-border pt-7 md:grid-cols-4 lg:mt-12">
          {BADGES.map((badge) => (
            <li key={badge.icon} className="flex items-center gap-3">
              <Image src={`/assets/icons/features/${badge.icon}.svg`} alt="" width={44} height={44} unoptimized className="shrink-0" />
              <span className="max-w-36 text-sm font-semibold leading-snug">{badge.title}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
