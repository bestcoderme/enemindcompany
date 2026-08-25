/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EnemindDriveCategory } from './google';

export type CourseType =
  | 'SELF_PACED'
  | 'LIVE'
  | 'COHORT'
  | 'ONE_ON_ONE'
  | 'GROUP'
  | 'WORKSHOP'
  | 'ACADEMIC'
  | 'SKILL'
  | 'CAREER'
  | 'CERTIFICATION_PREPARATION';

export type LessonType =
  | 'VIDEO'
  | 'DOCUMENT'
  | 'NOTE'
  | 'LIVE_SESSION'
  | 'ASSIGNMENT'
  | 'QUIZ'
  | 'PROJECT'
  | 'RESOURCE'
  | 'GOOGLE_CLASSROOM_ACTIVITY';

export type EnrollmentStatus =
  | 'ENROLLED'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'DROPPED'
  | 'PAUSED';

export type NoteType =
  | 'TEXT'
  | 'STUDY'
  | 'LECTURE'
  | 'REVISION'
  | 'RESEARCH'
  | 'PROJECT'
  | 'CAREER'
  | 'MEETING'
  | 'MENTORSHIP';

export type CourseStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'SUSPENDED'
  | 'ARCHIVED';

export type CourseLevel =
  | 'BEGINNER'
  | 'INTERMEDIATE'
  | 'ADVANCED'
  | 'ALL_LEVELS';

export interface LessonResourceLink {
  title: string;
  url: string;
  type?: 'drive' | 'doc' | 'sheet' | 'slides' | 'form' | 'link' | 'video';
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  type: LessonType;
  duration: string; // e.g. "45 mins" or "1.5 hours"
  content?: string; // Rich markdown / notes text
  resourceLinks?: LessonResourceLink[];
  googleDocId?: string;
  googleDocUrl?: string;
  googleDriveFileId?: string;
  googleMeetId?: string;
  googleMeetUrl?: string;
  googleFormId?: string;
  googleFormUrl?: string;
  googleSlidesId?: string;
  googleSlidesUrl?: string;
  googleSheetId?: string;
  googleSheetUrl?: string;
  status: 'AVAILABLE' | 'LOCKED' | 'DRAFT';
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  providerId: string;
  providerName: string;
  providerAvatar?: string;
  providerType: 'TEACHER' | 'MENTOR' | 'INSTITUTION' | 'PEER';
  category: string; // e.g. "Computer Science", "Engineering", "Business"
  subject: string; // e.g. "Algorithms", "Linear Algebra", "Cloud DevOps"
  skills: string[]; // e.g. ["Python", "SQL", "Docker"]
  careerPaths: string[]; // e.g. ["Software Engineer", "Data Analyst"]
  level: CourseLevel;
  language: string;
  thumbnail: string;
  duration: string; // e.g. "6 Weeks (24 Hours)"
  lessons: Lesson[];
  requirements: string[];
  price: number; // in KSh or local currency (0 if free)
  currency: string; // e.g. "KSh"
  isFree: boolean;
  status: CourseStatus;
  visibility: 'PUBLIC' | 'UNLISTED' | 'INVITE_ONLY';
  courseType: CourseType;
  googleClassroomId?: string;
  googleDriveFolderId?: string;
  googleMeetUrl?: string;
  googleChatSpaceId?: string;
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  certificateAvailable: boolean;
  moderationNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  courseTitle?: string;
  status: EnrollmentStatus;
  progress: number; // 0 to 100
  completedLessons: string[]; // array of lesson IDs
  startedAt: string;
  completedAt?: string;
  lastAccessedAt: string;
  certificateId?: string;
  notesCount?: number;
}

export interface LearningNote {
  id: string;
  ownerId: string;
  title: string;
  content: string;
  noteType: NoteType;
  subject?: string;
  courseId?: string;
  courseTitle?: string;
  lessonId?: string;
  lessonTitle?: string;
  tags: string[];
  googleDocId?: string;
  googleDocUrl?: string;
  googleDriveFileId?: string;
  visibility: 'PRIVATE' | 'SHARED' | 'PUBLIC';
  isFavorite?: boolean;
  isArchived?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentReference {
  id: string;
  userId: string;
  googleDriveFileId: string;
  name: string;
  mimeType: string;
  category: EnemindDriveCategory;
  folderId?: string;
  size: string;
  webUrl: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseTitle?: string;
  teacherId: string;
  teacherName?: string;
  title: string;
  description: string;
  dueDate: string;
  maxScore: number;
  googleClassroomAssignmentId?: string;
  googleFormId?: string;
  googleDriveFolderId?: string;
  status: 'ACTIVE' | 'GRADED' | 'CLOSED';
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName?: string;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'LATE';
  submittedAt: string;
  score?: number;
  feedback?: string;
  googleDocUrl?: string;
  fileUrl?: string;
  submissionText?: string;
}

export interface Certificate {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  providerId: string;
  providerName: string;
  issuedAt: string;
  certificateNumber: string;
  verificationUrl: string;
  skills: string[];
  gradeScore?: string;
}

export interface StudyGroupMember {
  id: string;
  name: string;
  role: 'ADMIN' | 'MEMBER' | 'MODERATOR';
  avatar?: string;
  joinedAt: string;
}

export interface StudyGroupResource {
  id: string;
  title: string;
  type: 'doc' | 'sheet' | 'slides' | 'drive' | 'link' | 'note';
  url: string;
  addedBy: string;
  date: string;
}

export interface StudyGroupAnnouncement {
  id: string;
  author: string;
  content: string;
  date: string;
}

export interface LearningStudyGroup {
  id: string;
  name: string;
  description: string;
  courseId?: string;
  courseTitle?: string;
  subject?: string;
  teacherId?: string;
  mentorId?: string;
  members: StudyGroupMember[];
  googleChatSpaceId?: string;
  googleDriveFolderId?: string;
  googleMeetUrl?: string;
  calendarEventId?: string;
  resources: StudyGroupResource[];
  announcements: StudyGroupAnnouncement[];
  isPrivate: boolean;
  createdAt: string;
}

export interface StudyPlanTask {
  id: string;
  text: string;
  done: boolean;
  dueDate?: string;
  courseId?: string;
  courseTitle?: string;
}

export interface StudyPlan {
  id: string;
  studentId: string;
  title: string;
  careerTarget?: string;
  weeklyHoursTarget: number;
  courses: string[]; // course IDs
  currentWeek: number;
  tasks: StudyPlanTask[];
  updatedAt: string;
}

export interface CourseRecommendation {
  courseId: string;
  course: Course;
  matchedSkill: string;
  careerGoal: string;
  reason: string;
  academicUnitMatch?: string;
}

export interface SafetyReport {
  id: string;
  reporterId: string;
  reporterName?: string;
  targetType: 'COURSE' | 'TEACHER' | 'MENTOR' | 'RESOURCE' | 'GROUP' | 'MESSAGE';
  targetId: string;
  targetName: string;
  reason: 'SCAM' | 'MISREPRESENTATION' | 'COPYRIGHT' | 'HARASSMENT' | 'INAPPROPRIATE' | 'SPAM' | 'OTHER';
  details: string;
  status: 'PENDING' | 'REVIEWED' | 'ACTION_TAKEN' | 'DISMISSED';
  createdAt: string;
}

export interface TeacherEarningsAnalytics {
  teacherId: string;
  totalStudents: number;
  activeCourses: number;
  totalRevenue: number;
  platformFees: number;
  netEarnings: number;
  pendingPayout: number;
  completedPayouts: number;
  courseStats: Array<{
    courseId: string;
    title: string;
    enrollments: number;
    completionRate: number;
    revenue: number;
  }>;
}
