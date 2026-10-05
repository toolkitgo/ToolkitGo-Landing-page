import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { LEGAL_POLICIES, POLICY_EFFECTIVE_DATE } from "@/lib/legal";
import { CONTACT_EMAIL } from "@/lib/site";
import type { PolicyPageProps } from "@/types/legal";

export const dynamicParams = false;
export function generateStaticParams() {
  return LEGAL_POLICIES.map(({ slug }) => ({ policy: slug }));
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const { policy: slug } = await params;
  const policy = LEGAL_POLICIES.find((item) => item.slug === slug);
  if (!policy) notFound();
  return {
    title: policy.title, description: policy.description,
    alternates: { canonical: `/legal/${policy.slug}` },
    openGraph: { title: `${policy.title} | ToolkitGO`, description: policy.description, url: `/legal/${policy.slug}` },
    twitter: { title: `${policy.title} | ToolkitGO`, description: policy.description },
  };
}

/** Semantic HTML preserves every clause and makes long policies easy to scan or print. */
export default async function PolicyPage({ params }: PolicyPageProps) {
  const { policy: slug } = await params;
  const policy = LEGAL_POLICIES.find((item) => item.slug === slug);
  if (!policy) notFound();
  const contents = <ol>{policy.sections.map((section, index) => <li key={section.id}><Link href={`#${section.id}`}><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</Link></li>)}</ol>;

  return <div className="page-shell-wide legal-document">
    <Link href="/legal" className="legal-back"><ArrowLeft size={16} aria-hidden="true" /> All policies</Link>
    <header className="legal-hero">
      <span className="eyebrow">ToolkitGo · Legal</span>
      <h1>{policy.title}</h1>
      <p>{policy.description}</p>
      <div className="legal-meta"><span>Effective <time dateTime="2026-10-05">{POLICY_EFFECTIVE_DATE}</time></span></div>
    </header>
    <div className="legal-reading-layout">
      <aside className="legal-sidebar"><nav aria-label="On this page"><h2>On this page</h2>{contents}</nav><Link href={`mailto:${CONTACT_EMAIL}`} className="legal-contact">Questions? Contact our team <ArrowRight size={16} aria-hidden="true" /></Link></aside>
      <div className="min-w-0">
        <details className="legal-mobile-contents"><summary>On this page <span>{policy.sections.length} sections</span></summary><nav aria-label="Policy sections">{contents}</nav></details>
        <article className="legal-article" aria-label={policy.title}>
          {policy.introduction && <p className="legal-introduction">{policy.introduction}</p>}
          {policy.sections.map((section, index) => <section id={section.id} key={section.id}>
            <h2><span>{String(index + 1).padStart(2, "0")}</span>{section.title}</h2>
            {section.blocks.map((block, blockIndex) => block.type === "list"
              ? <ul key={blockIndex}>{block.items?.map((item) => <li key={item}>{item}</li>)}</ul>
              : <p key={blockIndex}>{block.text}</p>)}
          </section>)}
        </article>
        <nav aria-label="Related policies" className="legal-related"><h2>Related policies</h2>{LEGAL_POLICIES.filter((item) => item.slug !== slug).map((item) => <Link key={item.slug} href={`/legal/${item.slug}`}>{item.title}<ArrowRight size={18} aria-hidden="true" /></Link>)}</nav>
      </div>
    </div>
  </div>;
}
