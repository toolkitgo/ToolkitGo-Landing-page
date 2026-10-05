import Image from "next/image";
import { SectionMotion } from "@/components/motion/SectionMotion";

const METRICS = [
  { title: "Skilled professionals", icon: "skilled-professionals" },
  { title: "Trusted by customers", icon: "trusted-by-customers" },
  { title: "Growing across cities", icon: "growing-across-cities" },
];

/** Introduces the marketplace using the original brand artwork. */
export function AboutUsSection() {
  return (
    <section id="about" className="section-space bg-cream">
      <SectionMotion>
      <div className="page-shell grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
        <div data-motion>
          <p className="eyebrow">About ToolkitGO</p>
          <h2 className="section-title mt-5">Building better homes,<br /><span className="text-orange">businesses and communities.</span></h2>
          <p className="mt-6 text-base leading-relaxed text-charcoal">
            ToolkitGO connects urban customers with skilled, verified independent service partners.
            We make it easier to find reliable experts for everyday needs, while helping technicians
            and businesses find a steady stream of work opportunities.
          </p>
          <ul className="mt-8 grid grid-cols-3 gap-4 border-t border-cream-border pt-6">
            {METRICS.map((metric) => (
              <li key={metric.icon}>
                <Image src={`/assets/icons/metrics/${metric.icon}.svg`} alt="" width={48} height={48} unoptimized />
                <p className="mt-2 max-w-28 text-xs font-semibold leading-relaxed text-navy sm:text-sm">{metric.title}</p>
              </li>
            ))}
          </ul>
        </div>
        <Image data-motion-art src="/assets/illustrations/about-washing-machine.svg" alt="A technician helping a homeowner with washing machine maintenance"
          width={1000} height={848} unoptimized className="mx-auto h-auto w-full max-w-lg" />
      </div>
      </SectionMotion>
    </section>
  );
}
