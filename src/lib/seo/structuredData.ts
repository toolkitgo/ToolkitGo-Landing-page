import {
  LEGAL_NAME,
  SITE_NAME,
  SITE_URL,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  GEO_COORDINATES,
  HYDERABAD_LOCALITIES,
  SOCIAL_PROFILES,
} from "@/lib/site";
import { SERVICE_CATEGORY_GROUPS } from "@/lib/validation/registrationSchema";

/**
 * Generates an enterprise-grade Schema.org @graph definition
 * providing deep semantic context for Google Search, Knowledge Graph,
 * Local Pack, and rich snippet eligibility.
 */
export function generateStructuredData(): Record<string, unknown> {
  const socialUrls = SOCIAL_PROFILES.map((p) => p.href).filter(
    (href): href is string => Boolean(href)
  );

  const servicesGraph = SERVICE_CATEGORY_GROUPS.map((group, index) => ({
    "@type": "Service",
    "@id": `${SITE_URL}/#service-${index + 1}`,
    name: group.group,
    serviceType: group.group,
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Hyderabad, Telangana",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${group.group} Services`,
      itemListElement: group.items.map((sub, subIdx) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: sub.label,
        },
        position: subIdx + 1,
      })),
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization Entity
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        legalName: LEGAL_NAME,
        url: SITE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${SITE_URL}/assets/branding/logo.png`,
          caption: `${SITE_NAME} Logo`,
        },
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: CONTACT_PHONE,
            contactType: "customer service",
            email: CONTACT_EMAIL,
            areaServed: "IN",
            availableLanguage: ["English", "Hindi", "Telugu"],
          },
        ],
        sameAs: socialUrls,
      },

      // 2. WebSite Entity
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        inLanguage: "en-IN",
      },

      // 3. LocalBusiness / HomeAndConstruction Entity (Hyderabad Anchor)
      {
        "@type": ["HomeAndConstructionBusiness", "LocalBusiness"],
        "@id": `${SITE_URL}/#local-business`,
        name: `${SITE_NAME} Hyderabad`,
        legalName: LEGAL_NAME,
        image: `${SITE_URL}/assets/branding/logo.png`,
        url: SITE_URL,
        telephone: CONTACT_PHONE,
        email: CONTACT_EMAIL,
        priceRange: "₹₹",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          postalCode: "500081",
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: GEO_COORDINATES.latitude,
          longitude: GEO_COORDINATES.longitude,
        },
        areaServed: HYDERABAD_LOCALITIES.map((locality) => ({
          "@type": "City",
          name: locality,
        })),
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "08:00",
            closes: "21:00",
          },
        ],
        sameAs: socialUrls,
      },

      // 4. Catalog of Services
      ...servicesGraph,
    ],
  };
}
