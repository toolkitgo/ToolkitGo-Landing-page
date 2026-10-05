import { SiteShell } from "@/components/layout/SiteShell";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyToolkitGoSection } from "@/components/sections/WhyToolkitGoSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { AboutUsSection } from "@/components/sections/AboutUsSection";
import { TechnicianPreRegisterSection } from "@/components/sections/TechnicianPreRegisterSection";
import { AppDownloadSection } from "@/components/sections/AppDownloadSection";
import { FaqSection } from "@/components/sections/FaqSection";

export default function Home() {
  return (
    <SiteShell>
      <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col">
        <HeroSection />
        <ServicesSection />
        <WhyToolkitGoSection />
        <HowItWorksSection />
        <AboutUsSection />
        <TechnicianPreRegisterSection />
        <FaqSection />
        <AppDownloadSection />
      </main>
    </SiteShell>
  );
}
