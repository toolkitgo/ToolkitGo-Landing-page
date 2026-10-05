import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { SectionMotion } from "@/components/motion/SectionMotion";
import { CONTACT_EMAIL } from "@/lib/site";

/** Native disclosures keep every answer accessible with touch, keyboard, and without JavaScript. */
export function FaqSection() {
  return (
    <section id="faqs" aria-labelledby="faqs-title" className="section-space border-t border-cream-border bg-cream">
      <SectionMotion>
        <div className="page-shell-wide faq-layout">
          <div data-motion className="faq-intro">
            <p className="eyebrow">A little clarity</p>
            <h2 id="faqs-title" className="section-title mt-5">Good questions.<br /><span className="text-orange">Clear answers.</span></h2>
            <p className="mt-5 max-w-sm text-base leading-relaxed text-charcoal">A few things to know about our services, our upcoming app, and joining the ToolkitGO network.</p>
            <div className="faq-help">
              <p>Still have a question?</p>
              <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}<ArrowUpRight size={18} aria-hidden="true" /></Link>
            </div>
          </div>
          <div data-motion className="faq-list">
            <details name="toolkitgo-faq" className="faq-item">
              <summary>What services does ToolkitGO offer?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>ToolkitGO connects you with independent professionals for AC and appliance repairs, electrical work, plumbing, carpentry, fabrication, and maintenance for homes and businesses. Explore our <Link href="/#services">service categories</Link> to find the right fit.</p></div>
            </details>
            <details name="toolkitgo-faq" className="faq-item">
              <summary>Where are services available?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>Our focus is Hyderabad and nearby areas. Availability depends on your location, the service you need, and the professionals available. Contact our team to check coverage for your area.</p></div>
            </details>
            <details name="toolkitgo-faq" className="faq-item">
              <summary>How can I book a service?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>Our app is launching soon on iOS and Android. Once it launches, you will be able to choose a service, pick an available date and time, and manage your booking in the app. For enquiries in the meantime, email <Link href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</Link>.</p></div>
            </details>
            <details name="toolkitgo-faq" className="faq-item">
              <summary>Who carries out the work?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>Services are carried out by independent service professionals. ToolkitGO conducts onboarding and verification checks using the documentation they provide, and facilitates bookings, communication, and payments.</p></div>
            </details>
            <details name="toolkitgo-faq" className="faq-item">
              <summary>How are service charges decided?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>Standard service charges and applicable inspection or estimated costs are shown before booking confirmation. Additional work, spare parts, and consumables are charged separately and must be agreed with you before the work is carried out.</p></div>
            </details>
            <details name="toolkitgo-faq" className="faq-item">
              <summary>Can I cancel or reschedule a booking?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>Bookings can be rescheduled subject to slot availability. Cancellation charges and refund eligibility depend on when you cancel and whether the professional has arrived. Read our <Link href="/legal/refund-cancellation">Refund &amp; Cancellation Policy</Link> for the full details.</p></div>
            </details>
            <details name="toolkitgo-faq" className="faq-item">
              <summary>What if I have a concern about a service?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>Email our team with your booking details and any supporting photographs or information. Service quality concerns should be reported within 24 hours of completion. Our team may arrange an inspection or rework before assessing a refund under the <Link href="/legal/refund-cancellation">policy</Link>.</p></div>
            </details>
            <details name="toolkitgo-faq" className="faq-item">
              <summary>How can I join as a technician?<Plus aria-hidden="true" size={20} /></summary>
              <div className="faq-answer"><p>Complete the <Link href="/#for-technicians">technician pre-registration form</Link> with your name, phone number, work area, service category, and experience. Our team will review your details for onboarding.</p></div>
            </details>
          </div>
        </div>
      </SectionMotion>
    </section>
  );
}
