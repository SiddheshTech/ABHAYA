export enum PortalActiveTab {
  HOME = "home",
  ACT_AND_RULES = "act-rules",
  PAPS = "paps",
  GUIDELINES = "guidelines",
  BEST_PRACTICES = "best-practices",
  GRIEVANCE = "grievance",
  MEDIA = "media",
  CITIZEN_CORNER = "citizen-corner",
  TRACK_CHILD = "track-child",
  PM_CARES = "pm-cares",
  RELATED_LINK = "related-link",
  CONTACT_US = "contact-us"
}

export interface NoticeUpdate {
  id: string;
  text: string;
  date: string;
  isUrgent?: boolean;
}

export interface ChildCase {
  id: string;
  name: string;
  gender: "Male" | "Female" | "Other";
  age: number;
  missingFrom: string;
  missingDate: string;
  status: "Missing" | "Recovered" | "In Rehabilitation";
  state: string;
  reportingOfficer: string;
}

export interface GrievanceReport {
  id: string;
  name: string;
  email: string;
  phone: string;
  state: string;
  district: string;
  subject: string;
  description: string;
  status: "Submitted" | "Reviewing" | "Action Taken" | "Resolved";
  submissionDate: string;
}

export interface FosterRegistration {
  id: string;
  primaryApplicant: string;
  spouseName?: string;
  age: number;
  maritalStatus: string;
  annualIncome: number;
  state: string;
  approvedStatus: "Pending" | "Approved" | "Rejected";
}

export type PapsSubPage = "eligibility" | "timeline" | "documents" | "post_adoption" | "financial" | "faqs";

export type GuidelinesSubPage = "financial" | "dcpu" | "cci" | "adoption";

export type GrievanceSubPage = "lodge" | "track" | "sop" | "sla" | "whistleblower";
