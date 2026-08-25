/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type GoogleServiceType =
  | 'gmail'
  | 'drive'
  | 'docs'
  | 'sheets'
  | 'slides'
  | 'forms'
  | 'calendar'
  | 'meet'
  | 'classroom'
  | 'chat'
  | 'groups'
  | 'youtube'
  | 'appsScript';

export type GoogleServiceStatus =
  | 'CONNECTED'
  | 'AVAILABLE'
  | 'REQUIRES_AUTHORIZATION'
  | 'REQUIRES_WORKSPACE'
  | 'DISCONNECTED';

export interface GoogleAccountInfo {
  isConnected: boolean;
  email?: string;
  name?: string;
  picture?: string;
  scopes: string[];
  tokenExpiry?: string;
  lastSyncTimestamp?: string;
  isWorkspaceAccount?: boolean;
}

export interface GoogleServiceCapability {
  service: GoogleServiceType;
  name: string;
  description: string;
  iconName: string;
  requiredScopes: string[];
  status: GoogleServiceStatus;
  isAvailable: boolean;
  isAuthorized: boolean;
  isWorkspaceRequired: boolean;
  isWorkspaceDetected: boolean;
  lastUsedTimestamp?: string;
}

export interface GoogleAuditLogEntry {
  id: string;
  service: GoogleServiceType;
  action: string;
  timestamp: string;
  userEmail: string;
  purpose: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  details?: string;
}

export type EnemindDriveCategory =
  | 'Academic'
  | 'Certificates'
  | 'CV'
  | 'Applications'
  | 'Notes'
  | 'Projects'
  | 'Mentorship'
  | 'Marketplace';

export interface GoogleDriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  webViewLink: string;
  webContentLink?: string;
  iconLink?: string;
  size?: string;
  modifiedTime: string;
  folderCategory?: EnemindDriveCategory;
  isPrivate: boolean;
  sharedWith?: string[];
  thumbnailLink?: string;
}

export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description?: string;
  location?: string;
  start: { dateTime?: string; date?: string; timeZone?: string };
  end: { dateTime?: string; date?: string; timeZone?: string };
  htmlLink?: string;
  hangoutLink?: string;
  meetUrl?: string;
  attendees?: { email: string; displayName?: string; responseStatus?: string }[];
  eventType?: 'mentorship' | 'class' | 'exam' | 'deadline' | 'career' | 'general';
}

export interface GoogleMeetSession {
  meetingId: string;
  meetingUrl: string;
  meetingProvider: 'GOOGLE_MEET';
  calendarEventId?: string;
  topic: string;
  scheduledStart: string;
  scheduledEnd: string;
  hostEmail: string;
  participantEmails: string[];
}

export interface GoogleClassroomCourse {
  id: string;
  name: string;
  section?: string;
  descriptionHeading?: string;
  room?: string;
  alternateLink?: string;
  teacherGroupEmail?: string;
  courseGroupEmail?: string;
  enrollmentCode?: string;
  courseState?: 'ACTIVE' | 'ARCHIVED' | 'PROVISIONED' | 'DECLINED';
}

export interface GoogleClassroomCourseWork {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  materials?: Array<{
    driveFile?: { driveFile: { id: string; title: string; alternateLink: string } };
    youtubeVideo?: { id: string; title: string; alternateLink: string };
    link?: { url: string; title: string };
    form?: { formUrl: string; title: string };
  }>;
  state?: 'PUBLISHED' | 'DRAFT' | 'DELETED';
  alternateLink?: string;
  dueDate?: { year: number; month: number; day: number };
  dueTime?: { hours: number; minutes: number };
  maxPoints?: number;
  workType?: 'ASSIGNMENT' | 'SHORT_ANSWER_QUESTION' | 'MULTIPLE_CHOICE_QUESTION';
}

export interface GoogleChatSpace {
  name: string;
  displayName: string;
  type: 'SPACE' | 'GROUP_CHAT' | 'DIRECT_MESSAGE';
  spaceUri?: string;
  description?: string;
}

export interface GoogleAppsScriptProduct {
  id: string;
  title: string;
  category: string;
  description: string;
  priceKsh: number;
  templateSpreadsheetId: string;
  features: string[];
  appsScriptCode: string;
  deploymentInstructions: string[];
}

export type EmailTemplateType =
  | 'welcome'
  | 'email_verification'
  | 'booking_confirmation'
  | 'booking_reminder'
  | 'payment_receipt'
  | 'opportunity_alert'
  | 'scholarship_deadline'
  | 'mentor_message'
  | 'teacher_notification'
  | 'course_enrollment'
  | 'marketplace_purchase'
  | 'security_alert';

export interface EmailMessagePayload {
  to: string | string[];
  subject: string;
  bodyHtml: string;
  bodyText: string;
  fromName?: string;
  replyTo?: string;
  templateType?: EmailTemplateType;
  isTransactional: boolean;
  metadata?: Record<string, any>;
}

export interface UserCommunicationPreferences {
  emailNotifications: boolean;
  marketingEmail: boolean;
  bookingNotifications: boolean;
  opportunityNotifications: boolean;
  careerNotifications: boolean;
  learningNotifications: boolean;
  marketplaceNotifications: boolean;
  chatNotifications: boolean;
  pushNotifications: boolean;
}

export type EnemindGroupType = 'DISCUSSION' | 'COURSE' | 'PROJECT' | 'COMMUNITY';

export interface EnemindGroupConfig {
  id: string;
  title: string;
  description: string;
  groupType: EnemindGroupType;
  googleIntegrationType?: 'CHAT_SPACE' | 'CLASSROOM' | 'DRIVE_WORKSPACE' | 'GOOGLE_GROUP' | 'ENEMIND_INTERNAL';
  googleChatSpaceId?: string;
  googleClassroomId?: string;
  googleDriveFolderId?: string;
  googleGroupEmail?: string;
  membersCount: number;
  isPrivate: boolean;
}
