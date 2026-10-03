import type { RefObject } from "react";

/** Local state is owned by Navbar1; the menu receives only its presentation data. */
export interface MobileNavigationProps {
  activeSection: string;
  onNavigate: () => void;
}

/** Profile URLs remain unset until the business provides its official accounts. */
export interface SocialProfile {
  name: string;
  href?: string;
}

/** Success dialog data from the completed registration request. */
export interface SuccessModalProps {
  registrationId: string;
  onClose: () => void;
  returnFocusRef: RefObject<HTMLButtonElement | null>;
}
