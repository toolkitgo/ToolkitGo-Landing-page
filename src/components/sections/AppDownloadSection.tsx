import Image from "next/image";
import { AppLaunchMotion } from "@/components/motion/AppLaunchMotion";

/** Store badges are informational until the app is available to download. */
export function AppDownloadSection() {
  return (
    <section id="app-download" aria-labelledby="app-download-title" className="bg-cream py-14 sm:py-20">
      <AppLaunchMotion>
      <div className="page-shell-wide">
        <div className="grid grid-cols-1 gap-x-8 gap-y-8 overflow-hidden rounded-[1.75rem] bg-app-panel px-5 pt-8 pb-7 text-navy sm:rounded-[2.5rem] sm:px-10 sm:pt-10 sm:pb-9 md:min-h-[500px] md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.85fr)] md:gap-y-10 lg:min-h-[550px] lg:px-16 lg:pt-14 lg:pb-12">
          <div data-app-copy className="min-w-0 md:col-start-1 md:row-start-1">
            <p className="mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold uppercase tracking-[0.12em]">
              <span>Our app</span>
              <span aria-hidden="true" className="size-1 rounded-full bg-navy" />
              <span>Launching soon</span>
            </p>
            <h2 id="app-download-title" className="app-download-title font-bold">
              Everyday services.<br />Soon in your pocket.
            </h2>
            <p className="mt-5 max-w-[33ch] text-base leading-relaxed sm:text-lg lg:text-xl">
              A faster, smarter way to book and manage services. All in one app.
            </p>
          </div>
          <div data-app-phone-frame className="relative mx-auto w-full max-w-[210px] sm:max-w-[240px] md:col-start-2 md:row-span-2 md:row-start-1 md:max-w-[285px] md:self-stretch lg:max-w-[330px]">
            <Image src="/assets/illustrations/phone-mockup.svg" alt="Preview of the ToolkitGO mobile app"
              width={2513} height={4907} unoptimized className="h-auto w-full md:absolute md:inset-x-0 md:top-1" />
          </div>
          <div data-app-stores className="min-w-0 md:col-start-1 md:row-start-2 md:self-end">
            <div className="grid w-full max-w-[410px] grid-cols-2 items-center gap-3 sm:gap-4">
              <Image src="/assets/badges/app-store-badge.svg" alt="Coming soon to the App Store" width={210} height={62} unoptimized className="h-auto w-full" />
              <Image src="/assets/badges/google-play-badge.svg" alt="Coming soon to Google Play" width={210} height={62} unoptimized className="h-auto w-full" />
            </div>
            <p className="mt-4 text-xs leading-relaxed sm:text-sm">Available on iOS and Android at launch.</p>
          </div>
        </div>
      </div>
      </AppLaunchMotion>
    </section>
  );
}
