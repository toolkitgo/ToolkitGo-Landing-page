import Image from "next/image";

/** Store badges are informational until the app is available to download. */
export function AppDownloadSection() {
  return (
    <section id="app-download" className="section-space overflow-hidden bg-cream">
      <div className="page-shell grid items-center gap-x-12 gap-y-8 md:grid-cols-2 lg:gap-x-24">
        <div className="md:col-start-1 md:row-start-1">
          <p className="eyebrow">The ToolkitGO app</p>
          <h2 className="section-title mt-5">Everyday services.<br /><span className="text-orange">Soon in your pocket.</span></h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-charcoal sm:text-lg">A faster, simpler way to book and manage services. Our app is launching soon.</p>
        </div>
        <Image src="/assets/illustrations/phone-mockup.svg" alt="Preview of the ToolkitGO mobile app"
          width={2513} height={4907} unoptimized className="mx-auto h-auto w-full max-w-[220px] sm:max-w-[260px] md:col-start-2 md:row-span-2 md:row-start-1 lg:max-w-[280px]" />
        <div className="text-center md:col-start-1 md:row-start-2 md:self-start md:text-left">
          <div className="mx-auto flex w-full max-w-[336px] items-center justify-center gap-3 md:mx-0 md:justify-start">
            <Image src="/assets/badges/app-store-badge.svg" alt="Coming soon to the App Store" width={162} height={48} unoptimized className="h-auto w-[calc((100%-0.75rem)/2)] max-w-[162px]" />
            <Image src="/assets/badges/google-play-badge.svg" alt="Coming soon to Google Play" width={162} height={48} unoptimized className="h-auto w-[calc((100%-0.75rem)/2)] max-w-[162px]" />
          </div>
          <p className="mt-4 text-sm text-charcoal-muted">Available on iOS and Android at launch.</p>
        </div>
      </div>
    </section>
  );
}
