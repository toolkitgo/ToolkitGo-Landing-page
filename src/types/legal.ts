/** Policy text is transcribed from the supplied, dated business document. */
export interface PolicyBlock {
  type: string;
  text?: string;
  items?: string[];
}

export interface LegalPolicy {
  slug: string;
  title: string;
  description: string;
  introduction: string;
  sections: { id: string; title: string; blocks: PolicyBlock[] }[];
}

export interface PolicyPageProps {
  params: Promise<{ policy: string }>;
}

export interface CompanyNavigationProps {
  onNavigate?: () => void;
}
