import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { LEGAL_POLICIES } from "@/lib/legal";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...["/legal", ...LEGAL_POLICIES.map((policy) => `/legal/${policy.slug}`)].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date("2026-10-05"),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];
}
