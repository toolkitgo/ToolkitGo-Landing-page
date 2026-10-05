import { BookingSequence } from "@/components/motion/BookingSequence";
import type { BookingStep } from "@/types/motion";

const STEPS: readonly BookingStep[] = [
  { title: "Choose a service", titleLines: ["Choose", "a service"], description: "A quick fix or a bigger job. Find the right service for your home or business.", image: "step-1-choose-service-original.png", caption: "Your home. Your choice." },
  { title: "Book & pay", titleLines: ["Book", "& pay"], description: "Pick a date and time that works for you. Book your service in a few simple steps.", image: "step-2-book-pay.svg", caption: "On your schedule." },
  { title: "Technician visits", titleLines: ["Expert at", "your door."], description: "A verified professional arrives at your doorstep, ready to get to work.", image: "step-3-technician-visits.svg", caption: "Expert at your doorstep." },
  { title: "Service completed", titleLines: ["All done.", "Just like that."], description: "One less thing on your to-do list. Get back to the things that matter to you.", image: "step-4-service-completed.svg", caption: "All sorted." },
];

/** Server-rendered copy supplies the four chapters of the scroll-driven booking story. */
export function HowItWorksSection() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="section-space border-y border-cream-border bg-white">
      <div className="page-shell-wide">
        <BookingSequence steps={STEPS}>
          <div data-motion className="journey-heading">
            <div>
              <p className="eyebrow">How ToolkitGO works</p>
              <h2 id="how-it-works-title" className="section-title mt-4">From to-do. <span className="text-orange">To done.</span></h2>
            </div>
            <p>Four simple steps.<br />A little less hassle in your everyday.</p>
          </div>
        </BookingSequence>
      </div>
    </section>
  );
}
