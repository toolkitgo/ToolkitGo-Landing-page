import Image from "next/image";

const STEPS = [
  { title: "Choose a service", description: "Select from a wide range of services.", image: "step-1-choose-service.png" },
  { title: "Book & pay", description: "Pick your preferred date and time.", image: "step-2-book-pay.svg" },
  { title: "Technician visits", description: "Our verified professional arrives at your doorstep.", image: "step-3-technician-visits.svg" },
  { title: "Service completed", description: "Relax and enjoy a hassle-free experience.", image: "step-4-service-completed.svg" },
];

/** A numbered sequence gives the booking illustrations a clear reading order. */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-space border-y border-cream-border bg-white">
      <div className="page-shell">
        <p className="eyebrow">How ToolkitGO works</p>
        <h2 className="section-title mt-5">Get service in <span className="text-orange">4 simple steps.</span></h2>
        <p className="mt-5 text-base leading-relaxed text-charcoal sm:text-lg">From booking to a hassle-free home, it&apos;s quick and easy.</p>
        <ol className="mt-10 grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.image}>
              <div className="relative mx-auto mb-6 aspect-[1.15/1] w-full max-w-64">
                <Image src={`/assets/illustrations/steps/${step.image}`} alt={step.title} fill
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 40vw, 256px"
                  unoptimized={step.image.endsWith(".svg")} className="object-contain" />
              </div>
              <div className="border-t border-cream-border pt-5">
                <span className="text-xs font-semibold tracking-widest text-charcoal-muted">STEP 0{index + 1}</span>
                <h3 className="mt-2 text-lg font-bold">{step.title}</h3>
                <p className="mt-2 max-w-64 text-sm leading-relaxed text-charcoal">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
