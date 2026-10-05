import Image from "next/image";
import { SectionMotion } from "@/components/motion/SectionMotion";

const BENEFITS = [
  { title: "Quality assurance", description: "Consistent service standards." },
  { title: "Verified technicians", description: "Skilled professionals you can trust." },
  { title: "Transparent pricing", description: "Clear expectations before service." },
  { title: "On-time service", description: "Appointments built around your time." },
  { title: "Customer support", description: "Help when you need it." },
  { title: "Service warranty", description: "Added confidence after completion." },
];

/** Benefits sit directly on the canvas beside the supplied repair illustration. */
export function WhyToolkitGoSection() {
  return (
    <section id="why-us" className="section-space bg-cream">
      <SectionMotion>
      <div className="page-shell grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <Image data-motion-art src="/assets/illustrations/why-ac-repair.svg" alt="A ToolkitGO technician repairing an air conditioner"
          width={802} height={1042} unoptimized className="order-2 mx-auto h-auto w-full max-w-[340px] lg:order-1" />
        <div className="order-1 lg:order-2">
          <div data-motion><p className="eyebrow">Why ToolkitGO</p>
          <h2 className="section-title mt-5"><span className="text-orange">Built for a better</span><br />service experience.</h2>
          </div>
          <ul data-motion-group className="mt-9 grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {BENEFITS.map((item) => (
              <li data-motion key={item.title} tabIndex={0} className="benefit-item flex items-start gap-3">
                <Image src="/assets/icons/ui/circle-tick.svg" alt="" width={26} height={26} unoptimized className="mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-charcoal">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      </SectionMotion>
    </section>
  );
}
