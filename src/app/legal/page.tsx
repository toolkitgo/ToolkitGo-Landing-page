import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, FileText, Mail } from "lucide-react";
import { LEGAL_POLICIES, POLICY_EFFECTIVE_DATE } from "@/lib/legal";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Legal & Policies",
  description: "Read ToolkitGo’s Terms of Service, Refund & Cancellation Policy, and Privacy Policy.",
  alternates: { canonical: "/legal" },
  openGraph: { title: "Legal & Policies | ToolkitGO", description: "Terms of Service, Refund & Cancellation Policy, and Privacy Policy.", url: "/legal" },
  twitter: { title: "Legal & Policies | ToolkitGO", description: "Terms of Service, Refund & Cancellation Policy, and Privacy Policy." },
};

export default function LegalHub() {
  return <div className="page-shell-wide legal-hub">
    <Link href="/" className="legal-back">Home <span aria-hidden="true">/</span> Company</Link>
    <header className="legal-hero">
      <span className="eyebrow">Legal & policies</span>
      <h1>Clear terms.<br /><span>Better understanding.</span></h1>
      <p>Everything you need to know about using ToolkitGo, managing your bookings, and how your information is handled.</p>
      <div className="legal-meta"><span>Effective {POLICY_EFFECTIVE_DATE}</span></div>
    </header>
    <div className="legal-policy-grid">
      {LEGAL_POLICIES.map((policy) => <Link key={policy.slug} href={`/legal/${policy.slug}`} className="legal-policy-card">
        <FileText size={25} aria-hidden="true" />
        <h2>{policy.title}</h2><p>{policy.description}</p>
        <span>Read policy <ArrowRight size={18} aria-hidden="true" /></span>
      </Link>)}
    </div>
    <div className="legal-help"><div><h2>Have a question?</h2><p>Get in touch with our team for help with these policies.</p></div><Link href={`mailto:${CONTACT_EMAIL}`}><Mail size={18} aria-hidden="true" />{CONTACT_EMAIL}</Link></div>
  </div>;
}
