/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MentorProfile,
  VerificationStatus,
  SessionFormat,
  CurrencyCode,
  RecommendationReason,
  ProviderAvailability,
} from '../../types/mentorship';
import { ReviewService } from './reviewService';

const MENTORS_STORAGE_KEY = 'enemind_mentor_profiles_v1';

export const INITIAL_MENTORS: MentorProfile[] = [
  {
    id: 'mentor_dr_jane',
    userId: 'user_dr_jane_mutua',
    name: 'Dr. Jane Mutua',
    headline: 'Senior Principal Cloud Solutions Architect @ AWS & Ex-Safaricom',
    bio: 'Helping university computer science and software engineering students bridge academic theory into production-grade distributed architectures, cloud security, and high-throughput backend APIs.',
    expertise: ['Cloud Architecture', 'DevOps & CI/CD', 'Distributed Systems', 'System Design', 'Go & Python'],
    skills: ['AWS', 'Kubernetes', 'Docker', 'System Design', 'Go', 'Python', 'PostgreSQL', 'Microservices'],
    industries: ['Cloud Computing', 'FinTech', 'Telecommunications', 'SaaS'],
    careerAreas: ['Software Engineering', 'Cloud Engineering', 'DevOps Engineering', 'Backend Engineering'],
    yearsExperience: 12,
    education: 'Ph.D. in Computer Systems Engineering (University of Nairobi), B.Sc. Electrical & Information Engineering',
    certifications: [
      'AWS Certified Solutions Architect — Professional',
      'Certified Kubernetes Administrator (CKA)',
      'HashiCorp Certified Terraform Associate',
    ],
    languages: ['English', 'Swahili'],
    country: 'Kenya',
    location: 'Nairobi, Kenya / Remote',
    timezone: 'Africa/Nairobi',
    sessionTypes: ['ONE_ON_ONE', 'GROUP', 'SYSTEM_DESIGN', 'CV_REVIEW', 'INTERVIEW_PREPARATION'] as any,
    pricing: {
      model: 'FREE',
      amount: 0,
      currency: 'KES',
    },
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
      startTime: '09:00',
      endTime: '18:00',
      timezone: 'Africa/Nairobi',
      sessionDuration: 45,
      breakDuration: 15,
      blockedDates: [],
      vacationDates: [],
      recurringAvailability: true,
    },
    profilePhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Verified via AWS certification verification portal & Safaricom alumni verification.',
    rating: 5.0,
    reviewCount: 42,
    completedSessions: 89,
    createdAt: '2026-06-01T08:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'mentor_faith_chebet',
    userId: 'user_faith_chebet',
    name: 'Faith Chebet',
    headline: 'Lead Product Designer @ FinTech Hub Nairobi',
    bio: 'Product designer focusing on end-to-end design systems, mobile banking UX, Figma token workflows, and helping students craft standout case studies for international design internships.',
    expertise: ['UI/UX Design', 'Design Systems', 'Figma Prototyping', 'User Research', 'Design Systems'],
    skills: ['Figma', 'UX Research', 'Design Systems', 'Wireframing', 'Interaction Design', 'Product Strategy'],
    industries: ['FinTech', 'Digital Banking', 'E-Commerce', 'EdTech'],
    careerAreas: ['Product Design', 'UI/UX Design', 'Design Engineering'],
    yearsExperience: 7,
    education: 'B.A. Graphic Design & Interactive Media (Technical University of Kenya)',
    certifications: ['Google UX Design Professional Certificate', 'Nielsen Norman Group UX Master Certified'],
    languages: ['English', 'Swahili'],
    country: 'Kenya',
    location: 'Nairobi, Kenya',
    timezone: 'Africa/Nairobi',
    sessionTypes: ['ONE_ON_ONE', 'CV_REVIEW', 'PROJECT_REVIEW', 'PORTFOLIO_AUDIT'] as any,
    pricing: {
      model: 'FIXED_PRICE',
      amount: 300,
      currency: 'KES',
    },
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      startTime: '10:00',
      endTime: '17:00',
      timezone: 'Africa/Nairobi',
      sessionDuration: 45,
      breakDuration: 15,
      blockedDates: [],
      vacationDates: [],
      recurringAvailability: true,
    },
    profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Verified portfolio with international fintech clients and Google UX badge.',
    rating: 4.9,
    reviewCount: 28,
    completedSessions: 54,
    createdAt: '2026-06-15T11:00:00Z',
    updatedAt: '2026-08-22T14:00:00Z',
  },
  {
    id: 'mentor_eng_brian',
    userId: 'user_eng_brian_mwangi',
    name: 'Eng. Brian Mwangi',
    headline: 'Automation & SCADA Systems Lead @ East African Breweries (EABL)',
    bio: 'Guiding mechatronics, mechanical, and electrical engineering students into smart manufacturing, PLC ladder logic programming, industrial robotics, and engineering attachment interview preparation.',
    expertise: ['Industrial Automation', 'SCADA & PLCs', 'Robotics & Control', 'Smart Manufacturing'],
    skills: ['PLC Programming', 'SCADA', 'Siemens TIA Portal', 'Control Systems', 'AutoCAD', 'Industrial IoT'],
    industries: ['Manufacturing', 'FMCG', 'Heavy Industry', 'Robotics'],
    careerAreas: ['Mechatronics Engineering', 'Automation Engineering', 'Electrical Engineering', 'Manufacturing'],
    yearsExperience: 9,
    education: 'B.Sc. Mechatronics Engineering (JKUAT), Registered Graduate Engineer (EBK)',
    certifications: ['EBK Professional Engineering License (AIT)', 'Siemens Certified Automation Professional'],
    languages: ['English', 'Swahili', 'German'],
    country: 'Kenya',
    location: 'Ruaraka, Nairobi',
    timezone: 'Africa/Nairobi',
    sessionTypes: ['ONE_ON_ONE', 'INTERVIEW_PREPARATION', 'PROJECT_REVIEW'] as any,
    pricing: {
      model: 'FIXED_PRICE',
      amount: 500,
      currency: 'KES',
    },
    availability: {
      days: ['Saturday', 'Sunday'],
      startTime: '09:00',
      endTime: '16:00',
      timezone: 'Africa/Nairobi',
      sessionDuration: 60,
      breakDuration: 15,
      blockedDates: [],
      vacationDates: [],
      recurringAvailability: true,
    },
    profilePhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Engineers Board of Kenya license verified.',
    rating: 4.8,
    reviewCount: 35,
    completedSessions: 62,
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-08-23T11:00:00Z',
  },
  {
    id: 'mentor_sarah_jenkins',
    userId: 'user_sarah_jenkins',
    name: 'Sarah Jenkins',
    headline: 'Global Tech Recruiter & Career Coach @ TalentBridge Europe',
    bio: 'UK and European remote tech recruitment specialist helping African engineers optimize CVs, pass behavioural interviews, and negotiate international remote tech salaries.',
    expertise: ['Tech Recruitment', 'CV & LinkedIn Optimization', 'Salary Negotiation', 'Mock Interviews'],
    skills: ['CV Writing', 'Interview Coaching', 'LinkedIn Branding', 'Career Strategy', 'Remote Work'],
    industries: ['International Tech', 'Human Resources', 'Recruitment'],
    careerAreas: ['Software Engineering', 'Data Science', 'Product Management'],
    yearsExperience: 10,
    education: 'B.Sc. Psychology & Human Resource Management (University of Leeds)',
    certifications: ['CIPD Level 7 Advanced Diploma in Strategic People Management'],
    languages: ['English'],
    country: 'United Kingdom',
    location: 'London, UK / Remote',
    timezone: 'Europe/London',
    sessionTypes: ['ONE_ON_ONE', 'CV_REVIEW', 'INTERVIEW_PREPARATION'] as any,
    pricing: {
      model: 'FIXED_PRICE',
      amount: 25,
      currency: 'USD',
    },
    availability: {
      days: ['Monday', 'Wednesday', 'Thursday'],
      startTime: '13:00',
      endTime: '19:00',
      timezone: 'Europe/London',
      sessionDuration: 45,
      breakDuration: 15,
      blockedDates: [],
      vacationDates: [],
      recurringAvailability: true,
    },
    profilePhoto: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'CIPD certified career coach credential verified.',
    rating: 5.0,
    reviewCount: 19,
    completedSessions: 38,
    createdAt: '2026-07-20T09:00:00Z',
    updatedAt: '2026-08-21T16:00:00Z',
  },
];

export class MentorService {
  private static initStorage(): void {
    if (!localStorage.getItem(MENTORS_STORAGE_KEY)) {
      localStorage.setItem(MENTORS_STORAGE_KEY, JSON.stringify(INITIAL_MENTORS));
    }
  }

  public static getAllMentors(): MentorProfile[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(MENTORS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_MENTORS;
    } catch {
      return INITIAL_MENTORS;
    }
  }

  public static getMentorById(id: string): MentorProfile | undefined {
    const mentors = this.getAllMentors();
    const mentor = mentors.find((m) => m.id === id || m.userId === id);
    if (mentor) {
      // Sync calculated rating dynamically from review service
      const ratingStats = ReviewService.calculateProviderRating(mentor.id);
      if (ratingStats.reviewCount > 0) {
        mentor.rating = ratingStats.averageRating;
        mentor.reviewCount = ratingStats.reviewCount;
      }
    }
    return mentor;
  }

  public static searchMentors(
    query: string,
    filters?: {
      skill?: string;
      career?: string;
      industry?: string;
      country?: string;
      language?: string;
      minRating?: number;
      maxPrice?: number;
      isFree?: boolean;
      sessionFormat?: SessionFormat;
      verificationOnly?: boolean;
    }
  ): MentorProfile[] {
    const all = this.getAllMentors();
    const q = query.toLowerCase().trim();

    return all.filter((m) => {
      // Query search
      if (q) {
        const nameMatch = m.name.toLowerCase().includes(q);
        const headlineMatch = m.headline.toLowerCase().includes(q);
        const bioMatch = m.bio.toLowerCase().includes(q);
        const skillMatch = m.skills.some((s) => s.toLowerCase().includes(q));
        const expertiseMatch = m.expertise.some((e) => e.toLowerCase().includes(q));
        const careerMatch = m.careerAreas.some((c) => c.toLowerCase().includes(q));
        if (!nameMatch && !headlineMatch && !bioMatch && !skillMatch && !expertiseMatch && !careerMatch) {
          return false;
        }
      }

      if (filters) {
        if (filters.verificationOnly && m.verificationStatus !== 'VERIFIED') return false;
        if (filters.isFree && m.pricing.model !== 'FREE') return false;
        if (filters.maxPrice !== undefined && m.pricing.model === 'FIXED_PRICE' && m.pricing.amount > filters.maxPrice) {
          return false;
        }
        if (filters.minRating && m.rating < filters.minRating) return false;
        if (filters.country && m.country.toLowerCase() !== filters.country.toLowerCase()) return false;
        if (filters.language && !m.languages.some((l) => l.toLowerCase() === filters.language!.toLowerCase())) {
          return false;
        }
        if (filters.skill && !m.skills.some((s) => s.toLowerCase().includes(filters.skill!.toLowerCase()))) {
          return false;
        }
        if (filters.career && !m.careerAreas.some((c) => c.toLowerCase().includes(filters.career!.toLowerCase()))) {
          return false;
        }
        if (filters.industry && !m.industries.some((i) => i.toLowerCase().includes(filters.industry!.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * AI-powered / Career Goal recommendations connecting Phase 4 with Phase 5
   */
  public static getRecommendedMentors(
    careerGoalTitle?: string,
    studentSkills: string[] = []
  ): { mentor: MentorProfile; reason: RecommendationReason }[] {
    const all = this.getAllMentors().filter((m) => m.verificationStatus === 'VERIFIED');
    const results: { mentor: MentorProfile; reason: RecommendationReason }[] = [];

    const goal = careerGoalTitle?.toLowerCase() || 'software engineering';

    for (const mentor of all) {
      const matchedCareerAreas = mentor.careerAreas.filter((c) =>
        c.toLowerCase().includes(goal) || goal.includes(c.toLowerCase())
      );

      const matchedSkills = mentor.skills.filter((s) =>
        studentSkills.some((ss) => ss.toLowerCase() === s.toLowerCase())
      );

      // Special check for high-demand career tracks
      let score = 0;
      if (matchedCareerAreas.length > 0) score += 3;
      if (matchedSkills.length > 0) score += 2;
      if (mentor.pricing.model === 'FREE') score += 1;

      if (score > 0 || !careerGoalTitle) {
        let explanation = `Recommended because this mentor specializes in ${matchedCareerAreas.join(', ') || mentor.careerAreas[0]}`;
        if (matchedSkills.length > 0) {
          explanation += ` and mentors in ${matchedSkills.join(', ')} from your roadmap.`;
        } else {
          explanation += ` and has ${mentor.yearsExperience}+ years industry experience.`;
        }

        results.push({
          mentor,
          reason: {
            matchedSkills,
            matchedCareerAreas,
            explanation,
          },
        });
      }
    }

    return results.sort((a, b) => b.mentor.rating - a.mentor.rating);
  }

  public static createMentorProfile(
    profile: Omit<MentorProfile, 'id' | 'rating' | 'reviewCount' | 'completedSessions' | 'createdAt' | 'updatedAt'>
  ): MentorProfile {
    this.initStorage();
    const newProfile: MentorProfile = {
      ...profile,
      id: `mentor_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rating: 5.0,
      reviewCount: 0,
      completedSessions: 0,
      verificationStatus: 'PENDING', // All new submissions require admin verification
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = this.getAllMentors();
    all.unshift(newProfile);
    localStorage.setItem(MENTORS_STORAGE_KEY, JSON.stringify(all));

    return newProfile;
  }

  public static updateMentorProfile(id: string, updates: Partial<MentorProfile>): MentorProfile {
    this.initStorage();
    const all = this.getAllMentors();
    const idx = all.findIndex((m) => m.id === id || m.userId === id);
    if (idx === -1) {
      throw new Error('Mentor profile not found');
    }

    all[idx] = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(MENTORS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }

  public static setVerificationStatus(
    mentorId: string,
    status: VerificationStatus,
    notes?: string
  ): MentorProfile {
    this.initStorage();
    const all = this.getAllMentors();
    const idx = all.findIndex((m) => m.id === mentorId);
    if (idx === -1) {
      throw new Error('Mentor not found');
    }

    all[idx].verificationStatus = status;
    all[idx].verificationNotes = notes || all[idx].verificationNotes;
    all[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(MENTORS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }
}
