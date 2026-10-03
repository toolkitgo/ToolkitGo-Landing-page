import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { ServicesSection } from "@/components/sections/ServicesSection";
import { WhyToolkitGoSection } from "@/components/sections/WhyToolkitGoSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { AboutUsSection } from "@/components/sections/AboutUsSection";
import { TechnicianPreRegisterSection } from "@/components/sections/TechnicianPreRegisterSection";
import { AppDownloadSection } from "@/components/sections/AppDownloadSection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full bg-cream text-navy selection:bg-orange selection:text-navy flex flex-col justify-between">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-navy focus:p-4 focus:text-white">Skip to content</a>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 w-full flex flex-col">
        <HeroSection />
        <ServicesSection />
        <WhyToolkitGoSection />
        <HowItWorksSection />
        <AboutUsSection />
        <TechnicianPreRegisterSection />
        <AppDownloadSection />
      </main>
      <Footer />
    </div>
  );
}
