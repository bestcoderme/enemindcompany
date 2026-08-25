/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  TeacherProfile,
  VerificationStatus,
  SessionFormat,
  CurrencyCode,
  RecommendationReason,
  ProviderAvailability,
} from '../../types/mentorship';
import { ReviewService } from './reviewService';

const TEACHERS_STORAGE_KEY = 'enemind_teacher_profiles_v1';

export const INITIAL_TEACHERS: TeacherProfile[] = [
  {
    id: 'teacher_prof_mwangi',
    userId: 'user_prof_peter_mwangi',
    name: 'Prof. Peter Mwangi',
    headline: 'Associate Professor of Computer Science & Database Systems Expert',
    bio: 'Dedicated academic lecturer and technical instructor specializing in Relational Databases, Distributed SQL, Data Structures, and preparing university students for competitive tech exams.',
    subjects: ['Distributed Databases', 'SQL & Query Optimization', 'Data Structures & Algorithms', 'Operating Systems'],
    skills: ['PostgreSQL', 'MySQL', 'Database Normalization', 'ACID Transactions', 'Data Modeling', 'Algorithms'],
    teachingAreas: ['Computer Science', 'Data Engineering', 'Software Engineering'],
    experience: '15 years university lecturing & corporate technical training',
    education: 'Ph.D. in Computer Science (Manchester University), M.Sc. Information Systems (UoN)',
    certifications: ['Oracle Database Certified Professional (OCP)', 'AWS Certified Database — Specialty'],
    languages: ['English', 'Swahili'],
    teachingFormats: ['SKILL_LESSON', 'GROUP', 'WORKSHOP', 'ACADEMIC_SUPPORT'],
    pricing: {
      model: 'FIXED_PRICE',
      amount: 400,
      currency: 'KES',
    },
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      startTime: '10:00',
      endTime: '19:00',
      timezone: 'Africa/Nairobi',
      sessionDuration: 60,
      breakDuration: 15,
      blockedDates: [],
      vacationDates: [],
      recurringAvailability: true,
    },
    profilePhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Faculty credentials verified with university department head.',
    rating: 5.0,
    reviewCount: 38,
    completedSessions: 74,
    createdAt: '2026-06-10T08:00:00Z',
    updatedAt: '2026-08-21T09:00:00Z',
  },
  {
    id: 'teacher_esther_mutindi',
    userId: 'user_esther_mutindi',
    name: 'Esther Mutindi',
    headline: 'Senior Data Scientist & Python Machine Learning Instructor',
    bio: 'Passionate coding tutor teaching hands-on Python, Pandas, Matplotlib, Scikit-learn, and Machine Learning foundations with real African datasets.',
    subjects: ['Python for Data Science', 'Applied Machine Learning', 'Pandas & NumPy', 'Data Visualization'],
    skills: ['Python', 'Pandas', 'Scikit-learn', 'Data Science', 'Statistics', 'Jupyter Notebooks'],
    teachingAreas: ['Data Science', 'Artificial Intelligence', 'Applied Mathematics'],
    experience: '5 years corporate data science training and online coding bootcamp facilitation',
    education: 'B.Sc. Actuarial Science & Data Analytics (Strathmore University)',
    certifications: ['DeepLearning.AI Machine Learning Specialization', 'IBM Data Science Professional Certificate'],
    languages: ['English', 'Swahili'],
    teachingFormats: ['ONE_ON_ONE', 'GROUP', 'SKILL_LESSON', 'PROJECT_REVIEW'],
    pricing: {
      model: 'FIXED_PRICE',
      amount: 350,
      currency: 'KES',
    },
    availability: {
      days: ['Monday', 'Wednesday', 'Friday', 'Sunday'],
      startTime: '14:00',
      endTime: '20:00',
      timezone: 'Africa/Nairobi',
      sessionDuration: 60,
      breakDuration: 15,
      blockedDates: [],
      vacationDates: [],
      recurringAvailability: true,
    },
    profilePhoto: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=300&auto=format&fit=crop&q=80',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Certified instructor credential verified via Coursera & DeepLearning.AI.',
    rating: 4.9,
    reviewCount: 29,
    completedSessions: 51,
    createdAt: '2026-07-05T10:00:00Z',
    updatedAt: '2026-08-22T12:00:00Z',
  },
  {
    id: 'teacher_david_kibet',
    userId: 'user_david_kibet',
    name: 'David Kibet',
    headline: 'Mobile App Developer & Flutter / React Native Instructor',
    bio: 'Full-stack mobile app instructor guiding students to build cross-platform iOS & Android apps with Flutter, Firebase Auth, and offline-first architectures.',
    subjects: ['Flutter & Dart', 'Cross-Platform Mobile Dev', 'Firebase Integration', 'State Management (Riverpod)'],
    skills: ['Flutter', 'Dart', 'React Native', 'Firebase', 'Mobile UI', 'REST APIs'],
    teachingAreas: ['Mobile Development', 'Frontend Engineering', 'App Publishing'],
    experience: '6 years mobile development in fintech and healthcare apps',
    education: 'B.Sc. Computer Science (Kenyatta University)',
    certifications: ['Google Certified Associate Android Developer'],
    languages: ['English', 'Swahili'],
    teachingFormats: ['ONE_ON_ONE', 'GROUP', 'PROJECT_REVIEW'],
    pricing: {
      model: 'FREE',
      amount: 0,
      currency: 'KES',
    },
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      startTime: '09:00',
      endTime: '15:00',
      timezone: 'Africa/Nairobi',
      sessionDuration: 45,
      breakDuration: 15,
      blockedDates: [],
      vacationDates: [],
      recurringAvailability: true,
    },
    profilePhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    verificationStatus: 'VERIFIED',
    verificationNotes: 'Google Play published apps verified.',
    rating: 4.8,
    reviewCount: 22,
    completedSessions: 40,
    createdAt: '2026-07-15T09:00:00Z',
    updatedAt: '2026-08-23T15:00:00Z',
  },
];

export class TeacherService {
  private static initStorage(): void {
    if (!localStorage.getItem(TEACHERS_STORAGE_KEY)) {
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(INITIAL_TEACHERS));
    }
  }

  public static getAllTeachers(): TeacherProfile[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(TEACHERS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  }

  public static getTeacherById(id: string): TeacherProfile | undefined {
    const teachers = this.getAllTeachers();
    const teacher = teachers.find((t) => t.id === id || t.userId === id);
    if (teacher) {
      const ratingStats = ReviewService.calculateProviderRating(teacher.id);
      if (ratingStats.reviewCount > 0) {
        teacher.rating = ratingStats.averageRating;
        teacher.reviewCount = ratingStats.reviewCount;
      }
    }
    return teacher;
  }

  public static searchTeachers(
    query: string,
    filters?: {
      subject?: string;
      skill?: string;
      teachingArea?: string;
      language?: string;
      minRating?: number;
      maxPrice?: number;
      isFree?: boolean;
      format?: SessionFormat;
      verificationOnly?: boolean;
    }
  ): TeacherProfile[] {
    const all = this.getAllTeachers();
    const q = query.toLowerCase().trim();

    return all.filter((t) => {
      if (q) {
        const nameMatch = t.name.toLowerCase().includes(q);
        const headlineMatch = t.headline.toLowerCase().includes(q);
        const bioMatch = t.bio.toLowerCase().includes(q);
        const subjectMatch = t.subjects.some((s) => s.toLowerCase().includes(q));
        const skillMatch = t.skills.some((s) => s.toLowerCase().includes(q));
        const areaMatch = t.teachingAreas.some((a) => a.toLowerCase().includes(q));
        if (!nameMatch && !headlineMatch && !bioMatch && !subjectMatch && !skillMatch && !areaMatch) {
          return false;
        }
      }

      if (filters) {
        if (filters.verificationOnly && t.verificationStatus !== 'VERIFIED') return false;
        if (filters.isFree && t.pricing.model !== 'FREE') return false;
        if (filters.maxPrice !== undefined && t.pricing.model === 'FIXED_PRICE' && t.pricing.amount > filters.maxPrice) {
          return false;
        }
        if (filters.minRating && t.rating < filters.minRating) return false;
        if (filters.subject && !t.subjects.some((s) => s.toLowerCase().includes(filters.subject!.toLowerCase()))) {
          return false;
        }
        if (filters.skill && !t.skills.some((s) => s.toLowerCase().includes(filters.skill!.toLowerCase()))) {
          return false;
        }
        if (filters.teachingArea && !t.teachingAreas.some((a) => a.toLowerCase().includes(filters.teachingArea!.toLowerCase()))) {
          return false;
        }
      }

      return true;
    });
  }

  public static getRecommendedTeachers(
    careerGoalTitle?: string,
    studentSkills: string[] = []
  ): { teacher: TeacherProfile; reason: RecommendationReason }[] {
    const all = this.getAllTeachers().filter((t) => t.verificationStatus === 'VERIFIED');
    const results: { teacher: TeacherProfile; reason: RecommendationReason }[] = [];

    const goal = careerGoalTitle?.toLowerCase() || 'software engineering';

    for (const teacher of all) {
      const matchedTeachingAreas = teacher.teachingAreas.filter((a) =>
        a.toLowerCase().includes(goal) || goal.includes(a.toLowerCase())
      );

      const matchedSkills = teacher.skills.filter((s) =>
        studentSkills.some((ss) => ss.toLowerCase() === s.toLowerCase())
      );

      let score = 0;
      if (matchedTeachingAreas.length > 0) score += 3;
      if (matchedSkills.length > 0) score += 2;
      if (teacher.pricing.model === 'FREE') score += 1;

      if (score > 0 || !careerGoalTitle) {
        let explanation = `Recommended teacher for ${matchedTeachingAreas.join(', ') || teacher.teachingAreas[0]}`;
        if (matchedSkills.length > 0) {
          explanation += ` with dedicated skill curriculum in ${matchedSkills.join(', ')}.`;
        } else {
          explanation += ` specializing in ${teacher.subjects.slice(0, 2).join(' & ')}.`;
        }

        results.push({
          teacher,
          reason: {
            matchedSkills,
            matchedCareerAreas: matchedTeachingAreas,
            explanation,
          },
        });
      }
    }

    return results.sort((a, b) => b.teacher.rating - a.teacher.rating);
  }

  public static createTeacherProfile(
    profile: Omit<TeacherProfile, 'id' | 'rating' | 'reviewCount' | 'completedSessions' | 'createdAt' | 'updatedAt'>
  ): TeacherProfile {
    this.initStorage();
    const newProfile: TeacherProfile = {
      ...profile,
      id: `teacher_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      rating: 5.0,
      reviewCount: 0,
      completedSessions: 0,
      verificationStatus: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = this.getAllTeachers();
    all.unshift(newProfile);
    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(all));

    return newProfile;
  }

  public static updateTeacherProfile(id: string, updates: Partial<TeacherProfile>): TeacherProfile {
    this.initStorage();
    const all = this.getAllTeachers();
    const idx = all.findIndex((t) => t.id === id || t.userId === id);
    if (idx === -1) {
      throw new Error('Teacher profile not found');
    }

    all[idx] = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }

  public static setVerificationStatus(
    teacherId: string,
    status: VerificationStatus,
    notes?: string
  ): TeacherProfile {
    this.initStorage();
    const all = this.getAllTeachers();
    const idx = all.findIndex((t) => t.id === teacherId);
    if (idx === -1) {
      throw new Error('Teacher not found');
    }

    all[idx].verificationStatus = status;
    all[idx].verificationNotes = notes || all[idx].verificationNotes;
    all[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }
}
