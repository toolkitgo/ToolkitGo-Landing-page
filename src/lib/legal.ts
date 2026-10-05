import policyContent from "@/lib/legal-policies.json";
import type { LegalPolicy } from "@/types/legal";

/** Full legal content stays in server-rendered pages, outside the navigation bundle. */
export const LEGAL_POLICIES: readonly LegalPolicy[] = policyContent;
export const POLICY_EFFECTIVE_DATE = "October 5, 2026";
