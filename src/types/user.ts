/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'STUDENT'
  | 'TEACHER'
  | 'MENTOR'
  | 'CREATOR'
  | 'BUSINESS_OWNER'
  | 'FREELANCER'
  | 'RECRUITER'
  | 'EMPLOYER'
  | 'ALUMNI'
  | 'INSTITUTION_ADMIN'
  | 'EVENT_ORGANIZER'
  | 'WEBSITE_OWNER'
  | 'SELLER'
  | 'PROFESSIONAL'
  | 'UNIVERSITY_ADMIN'
  | 'ENEMIND_ADMIN';

export type UserStatus = 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'INACTIVE';

export type AuthMode = 'login' | 'signup' | 'reset-password' | 'verify-email';

export interface MpesaTransaction {
  id: string;
  phoneNumber: string;
  amount: number;
  purpose:
    | 'enehub_activation'
    | 'findlocal_unlock'
    | 'findlocal_sheet'
    | 'mentor_booking'
    | 'automation_product'
    | 'website_subscription'
    | 'website_renewal';
  purposeLabel: string;
  status: 'completed' | 'pending' | 'failed';
  mpesaReceiptNumber: string;
  websiteId?: string;
  timestamp: string;
}

export interface SubscriptionState {
  trialStartDate: string; // ISO timestamp
  isEneHubPaid: boolean;
  isFindLocalUnlocked: boolean;
  hasFindLocalGoogleSheet: boolean;
  findLocalSheetName?: string;
  findLocalSheetUrl?: string;
  mpesaPhone?: string;
  activeWebsiteSubscriptions?: string[]; // Website IDs with active subscriptions
  transactions: MpesaTransaction[];
}

export interface CloudStorageConfig {
  googleSheetId: string;
  googleSheetUrl: string;
  googleDriveFolderName: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  firebaseProjectId?: string;
  syncStatus: 'connected' | 'idle' | 'syncing' | 'error';
  lastSyncTimestamp?: string;
}

export interface UserSocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  youtube?: string;
  portfolioWebsite?: string;
  tiktok?: string;
}

export interface UserEducationEntry {
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  startYear: string;
  endYear?: string;
  isCurrent?: boolean;
}

export interface UserExperienceEntry {
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent?: boolean;
  description?: string;
}

export interface UserNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: 'WEBSITE' | 'PAYMENT' | 'GOOGLE' | 'ORDER' | 'BOOKING' | 'ACADEMIC' | 'SECURITY' | 'COMMUNITY';
  isRead: boolean;
  actionUrl?: string;
  createdAt: string;
}

export interface UserSettings {
  language: string;
  timezone: string;
  marketingEmails: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  profileVisibility: 'PUBLIC' | 'CAMPUS_ONLY' | 'PRIVATE';
  twoFactorEnabled: boolean;
  isDevelopmentModeEnabled: boolean;
}

export interface User {
  id?: string;
  email: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  profilePhoto?: string;
  phone?: string;
  country?: string;
  city?: string;
  bio?: string;
  dateOfBirth?: string;
  language?: string;
  timezone?: string;
  status?: UserStatus;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  personas?: UserRole[];
  primaryPersona?: UserRole;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string;
}

export interface UserProfile extends User {
  name: string; // alias for displayName for backwards compatibility
  avatarUrl: string; // alias for profilePhoto for backwards compatibility
  provider: 'google' | 'email';
  roles: UserRole[]; // alias for personas for backwards compatibility
  phoneNumber?: string;
  whatsappNumber?: string;
  studentIdNumber?: string;
  yearOfStudy?: string;
  university?: any;
  course?: any;
  campus?: string;
  faculty?: string;
  programme?: string;
  graduationYear?: string;
  skills?: string[];
  interests?: string[];
  education?: UserEducationEntry[];
  experience?: UserExperienceEntry[];
  socialLinks?: UserSocialLinks;
  careerPreferences?: {
    primaryCareerGoal?: string;
    targetIndustries?: string[];
    currentSkills?: string[];
    interests?: string[];
  };
  hasGoogleSheetConnected?: boolean;
  isProfileComplete?: boolean;
  subscription?: SubscriptionState;
  settings?: UserSettings;
  ownedWebsiteIds?: string[];
}
