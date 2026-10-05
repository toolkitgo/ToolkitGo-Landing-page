import type { FooterLink, SocialProfile } from "@/types/ui";

export const LEGAL_NAME = "ToolkitGO";
export const SITE_NAME = "ToolkitGO";
export const SITE_URL = "https://toolkitgo.in";
export const CONTACT_EMAIL = "info@toolkitgo.in";
export const CONTACT_PHONE = "+91 8247474856";
export const CONTACT_PHONE_HREF = "tel:+918247474856";
export const CONTACT_LOCATION = "Hyderabad, Telangana, India";

export const SITE_TITLE = "ToolkitGO - Simplifying Everyday Services with Verified Technicians in Hyderabad";
export const SITE_DESCRIPTION =
  "ToolkitGO connects you with skilled, verified independent professionals for major appliance repairs, electrical systems, plumbing, carpentry, and fabrication across Hyderabad. Transparent master rate card & fast booking.";

export const GEO_COORDINATES = {
  latitude: 17.385044,
  longitude: 78.486671,
};

export const HYDERABAD_LOCALITIES = [
  "Hitec City",
  "Gachibowli",
  "Madhapur",
  "Kondapur",
  "Jubilee Hills",
  "Banjara Hills",
  "Kukatpally",
  "Secunderabad",
  "Begumpet",
  "Miyapur",
  "Ameerpet",
  "Manikonda",
  "Financial District",
  "Nallagandla",
  "Tolichowki",
];

export const SEO_KEYWORDS = [
  "ToolkitGO",
  "ToolkitGO Hyderabad",
  "verified technicians Hyderabad",
  "on-demand home services Hyderabad",
  "AC repair Hyderabad",
  "refrigerator repair Hyderabad",
  "washing machine repair Hyderabad",
  "electrician near me Hyderabad",
  "plumber near me Hyderabad",
  "carpenter Hyderabad",
  "commercial maintenance Hyderabad",
  "master rate card home services",
  "join as technician partner",
];

/** Set official account URLs here once supplied; never guess a business's handle. */
export const SOCIAL_PROFILES: SocialProfile[] = [
  {
    name: "LinkedIn",
    icon: "/assets/icons/footer/linkedin.svg",
    href: "https://www.linkedin.com/company/toolkitgo.in/",
  },
  {
    name: "Instagram",
    icon: "/assets/icons/footer/instagram.svg",
    href: "https://www.instagram.com/toolkitgo.in?stkn=MWpnd3JwbHdrMWF5cg==",
  },
  {
    name: "Facebook",
    icon: "/assets/icons/footer/facebook.svg",
    href: "https://www.facebook.com/share/19S4bt4hSk/",
  },
  { name: "X (Twitter)", icon: "/assets/icons/footer/twitter.svg", href: "https://x.com/Toolkitgoin" },
  { name: "YouTube", icon: "/assets/icons/footer/youtube.svg" },
];

export const FOOTER_QUICK_LINKS: FooterLink[] = [
  { label: "Home", href: "/#home" },
  { label: "Services", href: "/#services" },
  { label: "For Technicians", href: "/#for-technicians" },
  { label: "For Businesses", href: "/#services" },
  { label: "About Us", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const FOOTER_SERVICE_LINKS: FooterLink[] = [
  { label: "Household Services", href: "/#services" },
  { label: "Corporate Services", href: "/#services" },
  { label: "Contract Services", href: "/#services" },
];

/** Shared destinations for desktop and mobile Company disclosures. */
export const COMPANY_LINKS = [
  { label: "About us", href: "/#about" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Refund & Cancellation", href: "/legal/refund-cancellation" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "All policies", href: "/legal" },
];

/** Published policies match the business's supplied legal document. */
export const FOOTER_SUPPORT_LINKS: FooterLink[] = [
  { label: "Help Center", href: `mailto:${CONTACT_EMAIL}` },
  { label: "FAQs", href: "/#faqs" },
  { label: "Terms of Service", href: "/legal/terms-of-service" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Refund & Cancellation", href: "/legal/refund-cancellation" },
];
