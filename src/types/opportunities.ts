export type OpportunityType =
  | 'Scholarship'
  | 'Attachment'
  | 'Internship'
  | 'Job'
  | 'Fellowship'
  | 'Competition'
  | 'Volunteering'
  | 'Training'
  | 'Graduate Programme'
  | 'Other';

export type FundingType =
  | 'Fully Funded'
  | 'Partially Funded'
  | 'Paid'
  | 'Unpaid'
  | 'Competitive'
  | 'Tuition Only'
  | 'Monthly Stipend'
  | 'Grant';

export type RemoteStatus = 'remote' | 'hybrid' | 'on_site';

export type OpportunityStatus = 'open' | 'closing_soon' | 'closed' | 'archived';

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'attachment'
  | 'graduate_trainee';

export type AcademicLevel =
  | 'Certificate'
  | 'Diploma'
  | 'Undergraduate'
  | 'Year 1'
  | 'Year 2'
  | 'Year 3'
  | 'Year 4'
  | 'Year 5'
  | 'Postgraduate'
  | 'Masters'
  | 'PhD'
  | 'Recent Graduate'
  | 'All Levels';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  provider: string; // e.g. "Mastercard Foundation", "Safaricom PLC"
  organization: string; // e.g. "Mastercard Foundation", "Safaricom PLC", "Google", "Equity Group Foundation"
  type: OpportunityType;
  country: string; // Primary country or "Global", "Kenya", "United Kingdom", "United States", "Pan-Africa"
  countries?: string[]; // Multiple eligible countries
  location: string; // e.g. "Nairobi, Kenya", "London, UK / Hybrid", "Remote"
  remote: boolean | RemoteStatus;
  website?: string;
  applicationUrl: string; // Official application destination
  field: string; // Primary field e.g. "Engineering", "Technology", "Business", "Health", "Sciences"
  fields: string[]; // Related fields e.g. ["Electrical Engineering", "Software Engineering", "Computer Science"]
  eligibleUniversities?: string[]; // e.g. ["All accredited universities", "University of Nairobi", "JKUAT"]
  eligibleProgrammes?: string[]; // e.g. ["BSc. Electrical & Electronic Engineering", "BSc. Computer Science", "All STEM"]
  eligibleAcademicLevels?: AcademicLevel[];
  requiredSkills: string[];
  preferredSkills?: string[];
  minimumGPA?: number; // e.g. 3.2 on 4.0 scale (or null if not required)
  fundingAmount?: string; // e.g. "Full Tuition + KSh 45,000 Monthly Stipend"
  currency?: string; // "USD", "KES", "GBP", "EUR"
  fundingType?: FundingType;
  deadline: string; // ISO date string "YYYY-MM-DD" or timestamp
  startDate?: string;
  endDate?: string;
  duration?: string; // e.g. "3 Months", "6 Months", "1 Year", "4 Years"
  status: OpportunityStatus;
  source: string; // e.g. "Official Careers Portal", "University Directorate of Attachments"
  sourceUrl?: string;
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;

  // Scholarship-specific details
  scholarshipDetails?: {
    coverageType: 'Full Funding' | 'Partial Tuition' | 'Tuition & Stipend' | 'Research Grant';
    tuitionCoverage: boolean;
    accommodationCoverage: boolean;
    travelCoverage: boolean;
    livingAllowance: boolean;
    monthlyStipendAmount?: string;
    ageLimit?: number;
    bondOrServiceRequirement?: string;
  };

  // Attachment / Internship specific details
  attachmentDetails?: {
    companyLogoUrl?: string;
    department?: string;
    supervisorTitle?: string;
    insuranceRequired?: boolean;
    recommendationLetterRequired?: boolean;
    applicationMethod: 'online_portal' | 'email' | 'in_person' | 'university_portal';
    contactEmail?: string;
  };

  // Job specific details
  jobDetails?: {
    employmentType: EmploymentType;
    salaryRange?: string;
    experienceLevel?: 'Entry Level' | 'Graduate' | 'Junior' | 'Mid Level' | 'Student';
    probationPeriod?: string;
  };
}

export type ApplicationStatus =
  | 'saved'
  | 'planning'
  | 'applied'
  | 'interview'
  | 'accepted'
  | 'rejected'
  | 'withdrawn';

export interface StudentApplicationRecord {
  id: string;
  opportunityId: string;
  studentId: string; // user email
  status: ApplicationStatus;
  notes?: string;
  applicationDate?: string;
  interviewDate?: string;
  followUpDate?: string;
  personalNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReportReason =
  | 'scam'
  | 'expired'
  | 'wrong_info'
  | 'broken_link'
  | 'duplicate'
  | 'inappropriate'
  | 'other';

export interface OpportunityReport {
  id: string;
  opportunityId: string;
  studentEmail: string;
  studentName?: string;
  reason: ReportReason;
  details: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'dismissed' | 'resolved';
}

export type MatchTier = 'strong' | 'good' | 'moderate' | 'exploratory';
export type GpaEligibilityStatus = 'eligible' | 'below_requirement' | 'not_specified';

export interface OpportunityMatchResult {
  opportunityId: string;
  score: number; // 0 - 100
  tier: MatchTier;
  tierLabel: string;
  explanation: string;
  highlights: string[];
  gpaStatus: GpaEligibilityStatus;
  gpaMessage?: string;
  criteriaBreakdown: {
    programmeMatch: boolean;
    programmeScore: number;
    academicLevelMatch: boolean;
    levelScore: number;
    gpaEligibility: boolean;
    gpaScore: number;
    skillMatchCount: number;
    matchedSkills: string[];
    skillScore: number;
    countryEligibility: boolean;
    countryScore: number;
    careerInterestMatch: boolean;
    interestScore: number;
  };
}

export interface OpportunityFilterOptions {
  searchQuery?: string;
  types?: OpportunityType[];
  countries?: string[];
  location?: string;
  remoteOnly?: boolean;
  field?: string;
  fields?: string[];
  programme?: string;
  academicLevel?: AcademicLevel;
  minStudentGpa?: number;
  skills?: string[];
  fundingTypes?: FundingType[];
  deadlineFilter?: 'all' | 'today' | 'this_week' | 'this_month' | 'closing_soon' | 'no_deadline';
  verifiedOnly?: boolean;
  featuredOnly?: boolean;
  status?: OpportunityStatus[];
  sortBy?: 'recommended' | 'deadline_asc' | 'deadline_desc' | 'created_desc' | 'gpa_asc';
}

// Backward compatibility interfaces
export interface Scholarship extends Opportunity {}
export interface InternshipOpportunity extends Opportunity {}
