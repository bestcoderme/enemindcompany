/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type VerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'REJECTED';

export type SessionFormat =
  | 'ONE_ON_ONE'
  | 'GROUP'
  | 'WORKSHOP'
  | 'CONSULTATION'
  | 'CAREER_GUIDANCE'
  | 'SKILL_LESSON'
  | 'PROJECT_REVIEW'
  | 'CV_REVIEW'
  | 'INTERVIEW_PREPARATION'
  | 'ACADEMIC_SUPPORT';

export type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP';

export type PricingModel = 'FREE' | 'FIXED_PRICE';

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'REFUNDED';

export type PaymentStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SUCCESSFUL'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export type ProviderType = 'MENTOR' | 'TEACHER';

export interface ProviderAvailability {
  days: string[]; // e.g. ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  startTime: string; // '09:00'
  endTime: string; // '18:00'
  timezone: string; // 'Africa/Nairobi'
  sessionDuration: number; // in minutes (e.g. 45 or 60)
  breakDuration: number; // in minutes (e.g. 15)
  blockedDates: string[]; // ISO date strings ['2026-08-30']
  vacationDates: { start: string; end: string }[];
  recurringAvailability: boolean;
  customSlots?: { day: string; start: string; end: string }[];
}

export interface SessionMaterial {
  id: string;
  title: string;
  type: 'pdf' | 'document' | 'link' | 'google_drive' | 'notes' | 'assignment';
  url: string;
  fileSize?: string;
  isPublic: boolean;
}

export interface MentorProfile {
  id: string;
  userId: string;
  name: string;
  headline: string;
  bio: string;
  expertise: string[];
  skills: string[];
  industries: string[];
  careerAreas: string[];
  yearsExperience: number;
  education: string;
  certifications: string[];
  languages: string[];
  country: string;
  location: string;
  timezone: string;
  sessionTypes: SessionFormat[];
  pricing: {
    model: PricingModel;
    amount: number;
    currency: CurrencyCode;
  };
  availability: ProviderAvailability;
  profilePhoto: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  rating: number;
  reviewCount: number;
  completedSessions: number;
  createdAt: string;
  updatedAt: string;
  // Legacy compatibility fields
  title?: string;
  companyOrUni?: string;
  avatarUrl?: string;
  sessionPriceKSh?: number;
  sessionDurationMins?: number;
  availableDays?: string[];
  featured?: boolean;
}

export interface TeacherProfile {
  id: string;
  userId: string;
  name: string;
  headline: string;
  bio: string;
  subjects: string[];
  skills: string[];
  teachingAreas: string[];
  experience: string;
  education: string;
  certifications: string[];
  languages: string[];
  teachingFormats: SessionFormat[];
  pricing: {
    model: PricingModel;
    amount: number;
    currency: CurrencyCode;
  };
  availability: ProviderAvailability;
  profilePhoto: string;
  verificationStatus: VerificationStatus;
  verificationNotes?: string;
  rating: number;
  reviewCount: number;
  completedSessions: number;
  createdAt: string;
  updatedAt: string;
}

export interface SessionOffering {
  id: string;
  providerId: string;
  providerType: ProviderType;
  providerName: string;
  providerAvatar?: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  price: number;
  currency: CurrencyCode;
  maxParticipants: number;
  bookedSeats: number;
  format: SessionFormat;
  location?: string;
  meetingProvider: 'google_meet' | 'in_person' | 'custom';
  status: 'active' | 'archived' | 'draft';
  materials: SessionMaterial[];
  scheduleDate?: string; // Optional fixed date for workshops/group classes
  scheduleTime?: string; // Optional fixed time
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  providerId: string;
  providerType: ProviderType;
  providerName: string;
  providerAvatar?: string;
  sessionOfferingId: string;
  sessionTitle: string;
  sessionFormat: SessionFormat;
  durationMinutes: number;
  scheduledStart: string; // UTC ISO timestamp
  scheduledEnd: string; // UTC ISO timestamp
  timezone: string; // User's local timezone
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: CurrencyCode;
  paymentId?: string;
  paymentProvider?: string;
  mpesaReceiptNumber?: string;
  meetingId?: string;
  meetingUrl?: string;
  meetingProvider: string;
  calendarEventId?: string;
  conversationId?: string;
  notes?: string;
  reviewId?: string;
  materials?: SessionMaterial[];
  cancellationReason?: string;
  cancelledBy?: 'STUDENT' | 'PROVIDER' | 'ADMIN';
  createdAt: string;
  updatedAt: string;
}

export interface SessionReview {
  id: string;
  bookingId: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  providerId: string;
  providerType: ProviderType;
  rating: number; // 1 to 5
  comment: string;
  providerResponse?: string;
  responseDate?: string;
  createdAt: string;
}

export interface Payout {
  id: string;
  providerId: string;
  providerName: string;
  amount: number;
  currency: CurrencyCode;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  paymentProvider: 'mpesa' | 'bank_transfer';
  destination: string; // Phone number or account
  reference: string;
  requestedAt: string;
  processedAt?: string;
  notes?: string;
}

export interface ProviderEarnings {
  grossEarnings: number;
  platformFees: number;
  refunds: number;
  netEarnings: number;
  pendingPayouts: number;
  completedPayouts: number;
  currency: CurrencyCode;
  transactions: {
    id: string;
    bookingId: string;
    sessionTitle: string;
    grossAmount: number;
    platformFee: number;
    netAmount: number;
    currency: CurrencyCode;
    date: string;
    status: 'confirmed' | 'refunded' | 'pending';
  }[];
}

export interface DisputeReport {
  id: string;
  bookingId?: string;
  reporterId: string;
  reporterName: string;
  reporterRole: 'STUDENT' | 'PROVIDER' | 'USER';
  reportedId: string;
  reportedName: string;
  targetType: 'PROVIDER' | 'STUDENT' | 'SESSION' | 'MESSAGE' | 'REVIEW';
  reason: 'FRAUD' | 'HARASSMENT' | 'INAPPROPRIATE_BEHAVIOR' | 'MISREPRESENTATION' | 'NO_SHOW' | 'SPAM' | 'OTHER';
  description: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'DISMISSED';
  resolutionNotes?: string;
  refundIssued?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProviderAnalytics {
  profileViews: number;
  bookingRequests: number;
  confirmedBookings: number;
  completedSessions: number;
  cancellationRate: number;
  averageRating: number;
  totalRevenue: number;
  popularSessionTitle: string;
  repeatStudentsCount: number;
  conversionRate: number;
}

export interface RecommendationReason {
  matchedSkills: string[];
  matchedCareerAreas: string[];
  explanation: string;
}

// Legacy Aliases for backwards compatibility
export interface MentorshipBooking extends Booking {
  mentorId: string;
  mentorName: string;
  studentPhone?: string;
  sessionType: string;
  date?: string;
  timeSlot?: string;
  amountKSh?: number;
}

export interface TeacherCourse {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherAvatar: string;
  title: string;
  category: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationHours: number;
  lessonsCount: number;
  priceKSh: number;
  coverImageUrl: string;
  googleMeetUrl?: string;
  googleClassroomCode?: string;
  rating: number;
  studentsEnrolled: number;
}
