/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SessionOffering, SessionFormat, CurrencyCode, ProviderType } from '../../types/mentorship';

const OFFERINGS_STORAGE_KEY = 'enemind_session_offerings_v1';

export const INITIAL_OFFERINGS: SessionOffering[] = [
  {
    id: 'off_m1_1',
    providerId: 'mentor_dr_jane',
    providerType: 'MENTOR',
    providerName: 'Dr. Jane Mutua',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Cloud Architecture & Backend Career Mentorship',
    description: '1-on-1 deep dive into distributed cloud architectures, AWS/GCP services, and system design mock interview.',
    category: 'Cloud & Software Engineering',
    durationMinutes: 45,
    price: 0, // Volunteer / Free
    currency: 'KES',
    maxParticipants: 1,
    bookedSeats: 0,
    format: 'ONE_ON_ONE',
    meetingProvider: 'google_meet',
    status: 'active',
    materials: [
      {
        id: 'mat_1',
        title: 'System Design Interview Checklist & Architecture Blueprints (PDF)',
        type: 'pdf',
        url: 'https://enemind.org/resources/system-design-blueprint.pdf',
        fileSize: '2.4 MB',
        isPublic: true,
      },
    ],
    createdAt: '2026-08-01T09:00:00Z',
    updatedAt: '2026-08-01T09:00:00Z',
  },
  {
    id: 'off_m1_2',
    providerId: 'mentor_dr_jane',
    providerType: 'MENTOR',
    providerName: 'Dr. Jane Mutua',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    title: 'Mastering Microservices with Go & Kubernetes (Group Masterclass)',
    description: 'Intensive weekend interactive workshop building high-throughput microservices in Go, deployed to Kubernetes clusters.',
    category: 'Cloud & DevOps',
    durationMinutes: 90,
    price: 500,
    currency: 'KES',
    maxParticipants: 20,
    bookedSeats: 12,
    format: 'GROUP',
    scheduleDate: '2026-08-30',
    scheduleTime: '10:00 AM EAT',
    meetingProvider: 'google_meet',
    status: 'active',
    materials: [
      {
        id: 'mat_2',
        title: 'Go Microservices Boilerplate Repository & Lab Exercises',
        type: 'link',
        url: 'https://github.com/enemind/go-k8s-lab',
        isPublic: true,
      },
    ],
    createdAt: '2026-08-05T10:00:00Z',
    updatedAt: '2026-08-05T10:00:00Z',
  },
  {
    id: 'off_m2_1',
    providerId: 'mentor_faith_chebet',
    providerType: 'MENTOR',
    providerName: 'Faith Chebet',
    providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Product UX & Figma Portfolio Review (1-on-1)',
    description: 'Detailed analysis of your UX case studies, visual hierarchy, design system tokens, and portfolio storytelling for international design roles.',
    category: 'Product Design',
    durationMinutes: 45,
    price: 300,
    currency: 'KES',
    maxParticipants: 1,
    bookedSeats: 0,
    format: 'CV_REVIEW',
    meetingProvider: 'google_meet',
    status: 'active',
    materials: [
      {
        id: 'mat_3',
        title: 'Figma Design System Starter Kit & Token Tokens Guide',
        type: 'google_drive',
        url: 'https://drive.google.com/drive/folders/enemind_figma_kit',
        isPublic: true,
      },
    ],
    createdAt: '2026-08-10T12:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
  },
  {
    id: 'off_t1_1',
    providerId: 'teacher_prof_mwangi',
    providerType: 'TEACHER',
    providerName: 'Prof. Peter Mwangi',
    providerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    title: 'Advanced SQL & Data Warehousing Masterclass',
    description: 'Learn analytical SQL window functions, CTEs, BigQuery partitions, dbt modeling, and query optimization from scratch to advanced.',
    category: 'Data Analytics & Engineering',
    durationMinutes: 60,
    price: 400,
    currency: 'KES',
    maxParticipants: 15,
    bookedSeats: 8,
    format: 'SKILL_LESSON',
    meetingProvider: 'google_meet',
    status: 'active',
    materials: [
      {
        id: 'mat_4',
        title: 'SQL Practice Datasets & 100 Real-World Interview Queries',
        type: 'document',
        url: 'https://enemind.org/data/sql-interview-dataset.csv',
        fileSize: '5.1 MB',
        isPublic: true,
      },
    ],
    createdAt: '2026-08-12T14:00:00Z',
    updatedAt: '2026-08-12T14:00:00Z',
  },
  {
    id: 'off_m3_1',
    providerId: 'mentor_eng_brian',
    providerType: 'MENTOR',
    providerName: 'Eng. Brian Mwangi',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Industrial Automation & PLC Interview Preparation',
    description: 'Guidance on manufacturing SCADA systems, PLC ladder logic, and landing smart manufacturing attachment positions in Kenya & East Africa.',
    category: 'Engineering & Manufacturing',
    durationMinutes: 60,
    price: 500,
    currency: 'KES',
    maxParticipants: 1,
    bookedSeats: 0,
    format: 'INTERVIEW_PREPARATION',
    meetingProvider: 'google_meet',
    status: 'active',
    materials: [],
    createdAt: '2026-08-15T08:30:00Z',
    updatedAt: '2026-08-15T08:30:00Z',
  },
];

export class SessionOfferingService {
  private static initStorage(): void {
    if (!localStorage.getItem(OFFERINGS_STORAGE_KEY)) {
      localStorage.setItem(OFFERINGS_STORAGE_KEY, JSON.stringify(INITIAL_OFFERINGS));
    }
  }

  public static getAllOfferings(): SessionOffering[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(OFFERINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_OFFERINGS;
    } catch {
      return INITIAL_OFFERINGS;
    }
  }

  public static getOfferingsByProvider(providerId: string): SessionOffering[] {
    const all = this.getAllOfferings();
    return all.filter((o) => o.providerId === providerId && o.status !== 'archived');
  }

  public static getOfferingById(id: string): SessionOffering | undefined {
    const all = this.getAllOfferings();
    return all.find((o) => o.id === id);
  }

  public static createOffering(offering: Omit<SessionOffering, 'id' | 'bookedSeats' | 'createdAt' | 'updatedAt'>): SessionOffering {
    this.initStorage();
    const newOffering: SessionOffering = {
      ...offering,
      id: `off_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookedSeats: 0,
      materials: offering.materials || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = this.getAllOfferings();
    all.unshift(newOffering);
    localStorage.setItem(OFFERINGS_STORAGE_KEY, JSON.stringify(all));

    return newOffering;
  }

  public static updateOffering(id: string, updates: Partial<SessionOffering>): SessionOffering {
    this.initStorage();
    const all = this.getAllOfferings();
    const idx = all.findIndex((o) => o.id === id);
    if (idx === -1) {
      throw new Error('Offering not found');
    }

    all[idx] = {
      ...all[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(OFFERINGS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }

  public static deleteOffering(id: string, providerId: string): boolean {
    this.initStorage();
    const all = this.getAllOfferings();
    const idx = all.findIndex((o) => o.id === id);
    if (idx === -1) return false;
    if (all[idx].providerId !== providerId) {
      throw new Error('Unauthorized to delete this offering.');
    }

    all[idx].status = 'archived';
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem(OFFERINGS_STORAGE_KEY, JSON.stringify(all));
    return true;
  }

  public static incrementBookedSeats(offeringId: string): void {
    this.initStorage();
    const all = this.getAllOfferings();
    const idx = all.findIndex((o) => o.id === offeringId);
    if (idx !== -1) {
      if (all[idx].bookedSeats >= all[idx].maxParticipants) {
        throw new Error('This group session is already fully booked.');
      }
      all[idx].bookedSeats = (all[idx].bookedSeats || 0) + 1;
      localStorage.setItem(OFFERINGS_STORAGE_KEY, JSON.stringify(all));
    }
  }

  public static decrementBookedSeats(offeringId: string): void {
    this.initStorage();
    const all = this.getAllOfferings();
    const idx = all.findIndex((o) => o.id === offeringId);
    if (idx !== -1 && all[idx].bookedSeats > 0) {
      all[idx].bookedSeats -= 1;
      localStorage.setItem(OFFERINGS_STORAGE_KEY, JSON.stringify(all));
    }
  }
}
