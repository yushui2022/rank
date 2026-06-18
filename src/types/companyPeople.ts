export type CompanyPersonLinkStatus =
  | "verified-profile"
  | "linkedin-search"
  | "needs-verification";

export type CompanyPersonProfile = {
  id: string;
  entityId: string;
  name: string;
  role: string;
  focus: string;
  location?: string;
  profileSummary: string;
  signals: string[];
  linkedinUrl?: string;
  linkedinSearchUrl: string;
  linkStatus: CompanyPersonLinkStatus;
};
