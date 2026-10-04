import type { FooterLink, SocialProfile } from "@/types/ui";

export const CONTACT_EMAIL = "info@toolkitgo.in";
export const SITE_URL = "https://toolkitgo.in";
export const CONTACT_PHONE = "+91 9876843210";
export const CONTACT_PHONE_HREF = "tel:+919876843210";
export const CONTACT_LOCATION = "Hyderabad, India";

/** Set official account URLs here once supplied; never guess a business's handle. */
export const SOCIAL_PROFILES: SocialProfile[] = [
  { name: "LinkedIn", icon: "/assets/icons/footer/linkedin.svg" },
  { name: "X (Twitter)", icon: "/assets/icons/footer/twitter.svg" },
  { name: "Instagram", icon: "/assets/icons/footer/instagram.svg" },
  { name: "YouTube", icon: "/assets/icons/footer/youtube.svg" },
  { name: "Facebook", icon: "/assets/icons/footer/facebook.svg" },
];

export const FOOTER_QUICK_LINKS: FooterLink[] = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "For Technicians", href: "#for-technicians" },
  { label: "For Businesses", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export const FOOTER_SERVICE_LINKS: FooterLink[] = [
  { label: "Household Services", href: "#services" },
  { label: "Corporate Services", href: "#services" },
  { label: "Contract Services", href: "#services" },
];

/** Support is available by email; policy destinations await the business's content. */
export const FOOTER_SUPPORT_LINKS: FooterLink[] = [
  { label: "Help Center", href: `mailto:${CONTACT_EMAIL}` },
  { label: "FAQs", href: `mailto:${CONTACT_EMAIL}?subject=ToolkitGO%20questions` },
  { label: "Terms & Conditions" },
  { label: "Privacy Policy" },
  { label: "Refund Policy" },
];
