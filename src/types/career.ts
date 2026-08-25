/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ==========================================
// 1. CAREER CORE DATA MODEL
// ==========================================

export type CareerCategory =
  | 'Technology'
  | 'Engineering'
  | 'Healthcare'
  | 'Business'
  | 'Finance'
  | 'Law'
  | 'Education'
  | 'Agriculture'
  | 'Media'
  | 'Design'
  | 'Hospitality'
  | 'Tourism'
  | 'Science'
  | 'Government'
  | 'Social Sciences'
  | 'Trades'
  | 'Entrepreneurship'
  | 'Creative Industries'
  | 'Environmental Careers'
  | 'Other';

export type EmploymentPathway =
  | 'Corporate Employment'
  | 'Public Sector & Government'
  | 'Freelancing & Consulting'
  | 'Startup & Entrepreneurship'
  | 'Academic & Research'
  | 'NGO & International Development';

export interface SalaryRange {
  currency: string;
  country: string;
  entryLevel: string; // e.g. "KSh 60,000 - 120,000 / mo" or "$55,000 - $80,000 / yr"
  midLevel: string;
  seniorLevel: string;
  sourceNote?: string;
}

export interface LearningResource {
  id: string;
  title: string;
  provider: string; // e.g. "Coursera", "edX", "Enemind Learning", "YouTube", "Official Docs"
  type: 'course' | 'book' | 'video' | 'documentation' | 'interactive' | 'cert';
  url: string;
  isFree: boolean;
  durationEstimate?: string;
  skillTaught: string;
  enemindVerified?: boolean;
}

export interface CareerCertification {
  id: string;
  name: string;
  issuer: string; // e.g. "AWS", "Google", "ISA", "Cisco", "ACCA", "EBK"
  level: 'Entry' | 'Intermediate' | 'Professional' | 'Chartered';
  url?: string;
  estimatedCost?: string;
  description: string;
}

export interface CareerProjectTemplate {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  skillsPracticed: string[];
  suggestedTools: string[];
  deliverables: string[];
  estimatedHours: number;
}

export interface Career {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: CareerCategory;
  industries: string[];
  requiredSkills: string[];
  recommendedSkills: string[];
  futureSkills: string[]; // Emerging skills 2026-2030+
  relatedProgrammes: string[]; // Academic degree names e.g. "BSc. Electrical & Electronic Engineering"
  relatedSubjects: string[];
  educationRequirements: {
    minimumLevel: 'Certificate' | 'Diploma' | 'Bachelors' | 'Masters' | 'PhD';
    recommendedMajor: string;
    alternativePathways: string[];
  };
  certifications: CareerCertification[];
  entryLevelRoles: string[];
  progressionRoles: string[];
  salaryInformation: SalaryRange[];
  countries: string[]; // Supported regional data e.g. ["Kenya", "Global", "United Kingdom", "Nigeria"]
  remotePossible: boolean;
  remotePotentialScore: number; // 0 - 100
  entrepreneurshipPotentialScore: number; // 0 - 100
  freelanceViabilityScore: number; // 0 - 100
  pathways: EmploymentPathway[];
  entrepreneurshipIdeas?: string[];
  freelanceNiches?: string[];
  learningResources: LearningResource[];
  projectTemplates: CareerProjectTemplate[];
  toolsAndTech: string[];
  whatProfessionalsDo: string[];
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 2. ASSESSMENT MODEL
// ==========================================

export type AssessmentSignalCategory =
  | 'interests'
  | 'skills'
  | 'strengths'
  | 'workPreferences'
  | 'goals';

export interface AssessmentOption {
  id: string;
  label: string;
  description: string;
  categoryWeights: Partial<Record<CareerCategory, number>>; // e.g. { Technology: 25, Engineering: 20 }
  skillSignals?: string[]; // e.g. ["Python", "Circuit Design", "Public Speaking"]
  traitSignals?: string[]; // e.g. ["Analytical", "Leadership", "Creative"]
}

export interface CareerAssessmentQuestion {
  id: number;
  question: string;
  subtitle: string;
  category: AssessmentSignalCategory;
  options: AssessmentOption[];
  multipleChoice?: boolean;
}

export interface CareerAssessmentAttempt {
  id: string;
  studentEmail: string;
  completedAt: string;
  selectedOptionIds: Record<number, string | string[]>;
  categoryScores: Record<CareerCategory, number>;
  declaredStrengths: string[];
  declaredPreferences: string[];
  declaredGoals: string[];
  notes?: string;
}

// ==========================================
// 3. MATCHING & EXPLANATION MODEL
// ==========================================

export type CareerMatchTier =
  | 'excellent'
  | 'strong'
  | 'good'
  | 'potential'
  | 'explore';

export interface MatchFactor {
  title: string;
  status: 'positive' | 'neutral' | 'gap';
  description: string;
  weight: number;
}

export interface CareerMatch {
  career: Career;
  matchScore: number; // 0 - 100
  matchTier: CareerMatchTier;
  matchTierLabel: string; // "Excellent Match", "Strong Match", etc.
  summaryExplanation: string;
  factors: MatchFactor[];
  skillMatchCount: number;
  totalSkillsCount: number;
  matchingSkills: string[];
  missingRequiredSkills: string[];
  missingRecommendedSkills: string[];
  academicAlignmentScore: number;
}

// ==========================================
// 4. SKILL TRACKER & GAP ANALYSIS MODEL
// ==========================================

export type SkillLevel =
  | 'not_started'
  | 'learning'
  | 'practicing'
  | 'competent'
  | 'advanced';

export interface StudentSkillRecord {
  skillName: string;
  level: SkillLevel;
  category?: string;
  verified: boolean;
  evidenceNotes?: string;
  lastUpdated: string;
  projectIds?: string[];
  certificationIds?: string[];
}

export interface SkillGapAnalysis {
  careerId: string;
  careerTitle: string;
  readinessPercentage: number; // 0 - 100%
  masteredSkills: string[];
  inProgressSkills: string[];
  missingRequiredSkills: string[];
  missingRecommendedSkills: string[];
  nextRecommendedSkill: {
    skillName: string;
    whyPriority: string;
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    suggestedResources: LearningResource[];
  } | null;
}

// ==========================================
// 5. CAREER DEVELOPMENT ROADMAP MODEL
// ==========================================

export type RoadmapStageType =
  | 'foundation'
  | 'technical_skills'
  | 'projects'
  | 'portfolio'
  | 'experience'
  | 'employment_entrepreneurship';

export interface RoadmapTask {
  id: string;
  title: string;
  description: string;
  stage: RoadmapStageType;
  stageLabel: string;
  isCompleted: boolean;
  completedAt?: string;
  relatedSkill?: string;
  resourceUrl?: string;
  resourceTitle?: string;
}

export interface CareerRoadmap {
  careerId: string;
  careerTitle: string;
  stages: {
    stage: RoadmapStageType;
    stageLabel: string;
    stageNumber: number;
    description: string;
    tasks: RoadmapTask[];
    isStageComplete: boolean;
  }[];
  totalTasks: number;
  completedTasks: number;
  progressPercentage: number;
}

// ==========================================
// 6. CAREER GOALS MODEL
// ==========================================

export type CareerGoalStatus = 'active' | 'completed' | 'paused' | 'archived';

export interface CareerGoal {
  id: string;
  studentEmail: string;
  careerId: string;
  careerTitle: string;
  targetDate: string; // e.g. "2027-12-31"
  status: CareerGoalStatus;
  isPrimary: boolean;
  targetPathway: EmploymentPathway;
  notes: string;
  roadmapTasks: RoadmapTask[];
  createdAt: string;
  updatedAt: string;
}

// ==========================================
// 7. STUDENT PROJECTS MODEL
// ==========================================

export type StudentProjectStatus = 'planning' | 'in_progress' | 'completed' | 'archived';

export interface StudentProject {
  id: string;
  studentEmail: string;
  title: string;
  description: string;
  category: string;
  careerId?: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  skillsUsed: string[];
  status: StudentProjectStatus;
  githubUrl?: string;
  liveDemoUrl?: string;
  documentationUrl?: string;
  thumbnailUrl?: string;
  startDate: string;
  completedDate?: string;
  keyLearnings?: string;
  isFeaturedInPortfolio: boolean;
}

// ==========================================
// 8. PORTFOLIO & CV DATA MODEL
// ==========================================

export interface PortfolioEducation {
  institution: string;
  degree: string;
  programme: string;
  startYear: string;
  endYear: string;
  gpaDisplay?: string;
  honors?: string;
}

export interface PortfolioExperience {
  id: string;
  role: string;
  organization: string;
  location: string;
  type: 'Attachment' | 'Internship' | 'Full-Time' | 'Part-Time' | 'Freelance' | 'Volunteering';
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
}

export interface PortfolioCertificationItem {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface StudentPortfolio {
  studentEmail: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  emailContact: string;
  phoneContact?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  education: PortfolioEducation[];
  skills: StudentSkillRecord[];
  projects: StudentProject[];
  experience: PortfolioExperience[];
  certifications: PortfolioCertificationItem[];
  achievements: string[];
  volunteerWork: string[];
  isPublic: boolean;
  updatedAt: string;
}

// ==========================================
// 9. NEXT BEST ACTION MODEL
// ==========================================

export interface NextBestAction {
  id: string;
  title: string;
  description: string;
  category: 'assessment' | 'goal' | 'skill' | 'project' | 'portfolio' | 'opportunity' | 'mentorship';
  priority: 'high' | 'medium' | 'low';
  actionLabel: string;
  actionTargetView: string; // e.g. "career" | "opportunities" | "academics" | "portfolio"
  actionContext?: Record<string, any>;
}

// ==========================================
// 10. CAREER COMPARISON MODEL
// ==========================================

export interface CareerComparison {
  careers: Career[];
  readinessScores: Record<string, number>;
  skillOverlap: string[];
  uniqueSkills: Record<string, string[]>;
  salaryComparison: Record<string, SalaryRange | null>;
  remoteViability: Record<string, number>;
  entrepreneurshipViability: Record<string, number>;
}
