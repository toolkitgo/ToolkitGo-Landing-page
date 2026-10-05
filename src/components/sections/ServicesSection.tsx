import Image from "next/image";
import { SectionMotion } from "@/components/motion/SectionMotion";

const SERVICES = [
  { title: "Household services", description: "Reliable repair and maintenance for your home.", icon: "household-services" },
  { title: "Corporate services", description: "Keep your business running smoothly with dependable maintenance.", icon: "corporate-services" },
  { title: "Contract services", description: "End-to-end support for large-scale projects and facilities.", icon: "contract-services" },
];

/** Solid cards keep the original brand icons at their natural proportions. */
export function ServicesSection() {
  return (
    <section id="services" className="section-space bg-navy text-white">
      <SectionMotion>
      <div className="page-shell">
        <div data-motion className="grid gap-5 lg:grid-cols-2 lg:items-end lg:gap-16">
          <div>
            <p className="eyebrow eyebrow-dark">Our services</p>
            <h2 className="section-title mt-5"><span className="text-orange">Solutions for</span><br />every need.</h2>
          </div>
          <p className="max-w-md text-base leading-relaxed text-cream sm:text-lg">From home appliances to enterprise facilities, ToolkitGO has you covered in Hyderabad.</p>
        </div>
        <div data-motion-group className="mt-10 grid gap-5 md:grid-cols-3">
          {SERVICES.map((service) => (
            <article data-motion key={service.icon} className="service-card rounded-xl border border-cream-border bg-cream p-7 text-navy sm:p-8">
              <Image data-motion-icon src={`/assets/icons/services/${service.icon}.svg`} alt={`${service.title} icon`} width={56} height={56} unoptimized />
              <h3 className="mt-7 text-xl font-bold tracking-tight sm:text-2xl">{service.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-charcoal">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
      </SectionMotion>
    </section>
  );
}
