import { generateStructuredData } from "@/lib/seo/structuredData";

/**
 * Server Component that embeds validated Schema.org JSON-LD structured data.
 * Injected as static markup for zero client-bundle JavaScript overhead.
 */
export function JsonLd() {
  const structuredData = generateStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}
