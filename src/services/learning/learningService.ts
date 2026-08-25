/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Course,
  Enrollment,
  Assignment,
  AssignmentSubmission,
  Certificate,
  StudyPlan,
  CourseRecommendation,
  TeacherEarningsAnalytics,
  CourseType,
  CourseLevel,
} from '../../types/learning';
import { INITIAL_COURSES, INITIAL_ASSIGNMENTS, INITIAL_CERTIFICATES } from './learningData';
import { calendarService } from '../google/calendarService';
import { emailService } from '../google/emailService';
import { driveService } from '../google/driveService';

const STORAGE_KEY_COURSES = 'enemind_learning_courses';
const STORAGE_KEY_ENROLLMENTS = 'enemind_learning_enrollments';
const STORAGE_KEY_ASSIGNMENTS = 'enemind_learning_assignments';
const STORAGE_KEY_SUBMISSIONS = 'enemind_learning_submissions';
const STORAGE_KEY_CERTIFICATES = 'enemind_learning_certificates';
const STORAGE_KEY_STUDY_PLANS = 'enemind_learning_study_plans';

class LearningService {
  private courses: Course[] = [];
  private enrollments: Enrollment[] = [];
  private assignments: Assignment[] = [];
  private submissions: AssignmentSubmission[] = [];
  private certificates: Certificate[] = [];
  private studyPlans: Record<string, StudyPlan> = {};

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const storedCourses = localStorage.getItem(STORAGE_KEY_COURSES);
      this.courses = storedCourses ? JSON.parse(storedCourses) : INITIAL_COURSES;

      const storedEnrollments = localStorage.getItem(STORAGE_KEY_ENROLLMENTS);
      if (storedEnrollments) {
        this.enrollments = JSON.parse(storedEnrollments);
      } else {
        // Initial sample enrollment for default student
        this.enrollments = [
          {
            id: 'enr_01',
            studentId: 'usr_default',
            courseId: 'course_py_data',
            courseTitle: 'Python for Data Analysis & Statistical Modeling',
            status: 'ACTIVE',
            progress: 60,
            completedLessons: ['lsn_py_01', 'lsn_py_02', 'lsn_py_03'],
            startedAt: '2026-08-10T10:00:00Z',
            lastAccessedAt: '2026-08-24T18:00:00Z',
            notesCount: 4,
          },
          {
            id: 'enr_02',
            studentId: 'usr_default',
            courseId: 'course_cloud_devops',
            courseTitle: 'Cloud DevOps, Docker & Kubernetes Engineering',
            status: 'ACTIVE',
            progress: 33,
            completedLessons: ['lsn_cd_01'],
            startedAt: '2026-08-18T14:00:00Z',
            lastAccessedAt: '2026-08-25T08:00:00Z',
            notesCount: 2,
          }
        ];
      }

      const storedAssignments = localStorage.getItem(STORAGE_KEY_ASSIGNMENTS);
      this.assignments = storedAssignments ? JSON.parse(storedAssignments) : INITIAL_ASSIGNMENTS;

      const storedSubmissions = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      this.submissions = storedSubmissions ? JSON.parse(storedSubmissions) : [];

      const storedCerts = localStorage.getItem(STORAGE_KEY_CERTIFICATES);
      this.certificates = storedCerts ? JSON.parse(storedCerts) : INITIAL_CERTIFICATES;

      const storedPlans = localStorage.getItem(STORAGE_KEY_STUDY_PLANS);
      this.studyPlans = storedPlans ? JSON.parse(storedPlans) : {};
    } catch {
      this.courses = INITIAL_COURSES;
      this.assignments = INITIAL_ASSIGNMENTS;
      this.certificates = INITIAL_CERTIFICATES;
    }
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY_COURSES, JSON.stringify(this.courses));
      localStorage.setItem(STORAGE_KEY_ENROLLMENTS, JSON.stringify(this.enrollments));
      localStorage.setItem(STORAGE_KEY_ASSIGNMENTS, JSON.stringify(this.assignments));
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(this.submissions));
      localStorage.setItem(STORAGE_KEY_CERTIFICATES, JSON.stringify(this.certificates));
      localStorage.setItem(STORAGE_KEY_STUDY_PLANS, JSON.stringify(this.studyPlans));
    } catch (e) {
      console.warn('Storage save warning:', e);
    }
  }

  // --- Course Discovery & Catalog ---

  public getCourses(filters?: {
    search?: string;
    category?: string;
    subject?: string;
    level?: CourseLevel | 'ALL';
    courseType?: CourseType | 'ALL';
    isFree?: boolean;
    hasGoogleClassroom?: boolean;
    skill?: string;
    careerPath?: string;
  }): Course[] {
    let list = this.courses.filter((c) => c.status === 'PUBLISHED');

    if (!filters) return list;

    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.shortDescription.toLowerCase().includes(q) ||
          c.subject.toLowerCase().includes(q) ||
          c.providerName.toLowerCase().includes(q) ||
          c.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== 'All') {
      list = list.filter((c) => c.category.toLowerCase() === filters.category!.toLowerCase());
    }

    if (filters.subject && filters.subject !== 'All') {
      list = list.filter((c) => c.subject.toLowerCase() === filters.subject!.toLowerCase());
    }

    if (filters.level && filters.level !== 'ALL') {
      list = list.filter((c) => c.level === filters.level || c.level === 'ALL_LEVELS');
    }

    if (filters.courseType && filters.courseType !== 'ALL') {
      list = list.filter((c) => c.courseType === filters.courseType);
    }

    if (filters.isFree !== undefined) {
      list = list.filter((c) => c.isFree === filters.isFree);
    }

    if (filters.hasGoogleClassroom) {
      list = list.filter((c) => !!c.googleClassroomId);
    }

    if (filters.skill) {
      const sLower = filters.skill.toLowerCase();
      list = list.filter((c) => c.skills.some((sk) => sk.toLowerCase().includes(sLower)));
    }

    if (filters.careerPath) {
      const cpLower = filters.careerPath.toLowerCase();
      list = list.filter((c) => c.careerPaths.some((cp) => cp.toLowerCase().includes(cpLower)));
    }

    return list;
  }

  public getCourseById(id: string): Course | undefined {
    return this.courses.find((c) => c.id === id);
  }

  // --- Enrollment & Progress Tracking ---

  public async enrollCourse(
    studentId: string,
    courseId: string,
    studentName: string,
    studentEmail?: string
  ): Promise<Enrollment> {
    const course = this.getCourseById(courseId);
    if (!course) throw new Error('Course not found.');

    const existing = this.enrollments.find(
      (e) => e.studentId === studentId && e.courseId === courseId
    );
    if (existing) {
      if (existing.status === 'DROPPED' || existing.status === 'PAUSED') {
        existing.status = 'ACTIVE';
        existing.lastAccessedAt = new Date().toISOString();
        this.saveState();
      }
      return existing;
    }

    const enrollment: Enrollment = {
      id: `enr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId,
      courseId,
      courseTitle: course.title,
      status: 'ACTIVE',
      progress: 0,
      completedLessons: [],
      startedAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
      notesCount: 0,
    };

    this.enrollments.push(enrollment);
    course.enrollmentCount += 1;
    this.saveState();

    // 1. If course has live sessions, sync Google Calendar
    if (course.courseType === 'LIVE' || course.courseType === 'COHORT' || course.googleMeetUrl) {
      const nextWeek = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString();
      const endSession = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString();
      calendarService
        .createEvent({
          summary: `Live Class: ${course.title}`,
          description: `ENEMIND Learning Session with ${course.providerName}.\nGoogle Meet: ${course.googleMeetUrl || 'https://meet.google.com'}\nClassroom: ${course.googleClassroomId || 'Enemind Studio'}`,
          startTime: nextWeek,
          endTime: endSession,
          createMeetLink: true,
          attendeeEmails: [studentEmail || 'student@enemind.org'],
          eventType: 'class',
        })
        .catch(console.warn);
    }

    // 2. Dispatch email confirmation via Gmail
    if (studentEmail) {
      emailService
        .sendTemplatedEmail('course_enrollment', studentEmail, {
          userName: studentName,
          courseTitle: course.title,
          instructorName: course.providerName,
          accessLink: window.location.origin,
        })
        .catch(console.warn);
    }

    return enrollment;
  }

  public getEnrollments(studentId: string): Enrollment[] {
    return this.enrollments.filter((e) => e.studentId === studentId);
  }

  public getEnrollmentByCourse(studentId: string, courseId: string): Enrollment | undefined {
    return this.enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
  }

  /**
   * Updates genuine lesson progress. Recalculates exact mathematical percentage.
   * If all lessons completed, issues authentic verifiable certificate.
   */
  public updateLessonProgress(
    studentId: string,
    courseId: string,
    lessonId: string,
    isCompleted: boolean,
    studentName: string = 'Alex Muli',
    studentEmail?: string
  ): { enrollment: Enrollment; certificate?: Certificate } {
    const enrollment = this.enrollments.find(
      (e) => e.studentId === studentId && e.courseId === courseId
    );
    if (!enrollment) throw new Error('Enrollment record not found.');

    const course = this.getCourseById(courseId);
    if (!course || course.lessons.length === 0) {
      enrollment.progress = 100;
      this.saveState();
      return { enrollment };
    }

    let completed = new Set(enrollment.completedLessons || []);
    if (isCompleted) {
      completed.add(lessonId);
    } else {
      completed.delete(lessonId);
    }

    enrollment.completedLessons = Array.from(completed);
    const totalLessons = course.lessons.length;
    const progressPercent = Math.min(100, Math.round((completed.size / totalLessons) * 100));
    enrollment.progress = progressPercent;
    enrollment.lastAccessedAt = new Date().toISOString();

    let cert: Certificate | undefined;

    // Check genuine course completion
    if (progressPercent === 100 && enrollment.status !== 'COMPLETED') {
      enrollment.status = 'COMPLETED';
      enrollment.completedAt = new Date().toISOString();

      if (course.certificateAvailable) {
        const certNumber = `ENE-CERT-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        cert = {
          id: `cert_${Date.now()}`,
          studentId,
          studentName,
          courseId: course.id,
          courseTitle: course.title,
          providerId: course.providerId,
          providerName: course.providerName,
          issuedAt: new Date().toISOString(),
          certificateNumber: certNumber,
          verificationUrl: `https://enemind.org/verify/${certNumber}`,
          skills: course.skills,
          gradeScore: '100% (Completed)',
        };

        this.certificates.push(cert);
        enrollment.certificateId = cert.id;

        // Dispatch completion email with certificate
        if (studentEmail) {
          emailService
            .sendTemplatedEmail('course_enrollment', studentEmail, {
              userName: studentName,
              courseTitle: course.title,
              certificateNumber: certNumber,
              verifyUrl: cert.verificationUrl,
            })
            .catch(console.warn);
        }

        // Upload reference to Google Drive /Enemind/Certificates
        driveService
          .uploadDocument(
            `${course.title.replace(/\s+/g, '_')}_Certificate.pdf`,
            'application/pdf',
            'Certificates',
            undefined,
            true
          )
          .catch(console.warn);
      }
    } else if (progressPercent < 100 && enrollment.status === 'COMPLETED') {
      enrollment.status = 'ACTIVE';
    }

    this.saveState();
    return { enrollment, certificate: cert };
  }

  // --- Assignments & Submissions ---

  public getAssignmentsForStudent(studentId: string): Array<Assignment & { submission?: AssignmentSubmission }> {
    const studentCourseIds = new Set(
      this.enrollments.filter((e) => e.studentId === studentId).map((e) => e.courseId)
    );

    const relevant = this.assignments.filter((a) => studentCourseIds.has(a.courseId) || a.courseId === 'course_py_data');
    return relevant.map((asg) => {
      const sub = this.submissions.find(
        (s) => s.assignmentId === asg.id && s.studentId === studentId
      );
      return {
        ...asg,
        submission: sub,
      };
    });
  }

  public submitAssignment(submissionData: {
    assignmentId: string;
    studentId: string;
    studentName?: string;
    submissionText?: string;
    googleDocUrl?: string;
    fileUrl?: string;
  }): AssignmentSubmission {
    const existingIndex = this.submissions.findIndex(
      (s) => s.assignmentId === submissionData.assignmentId && s.studentId === submissionData.studentId
    );

    const submission: AssignmentSubmission = {
      id: `sub_${Date.now()}`,
      assignmentId: submissionData.assignmentId,
      studentId: submissionData.studentId,
      studentName: submissionData.studentName || 'Student',
      status: 'SUBMITTED',
      submittedAt: new Date().toISOString(),
      googleDocUrl: submissionData.googleDocUrl,
      fileUrl: submissionData.fileUrl,
      submissionText: submissionData.submissionText,
    };

    if (existingIndex >= 0) {
      this.submissions[existingIndex] = submission;
    } else {
      this.submissions.push(submission);
    }

    this.saveState();
    return submission;
  }

  // --- Certificates ---

  public getStudentCertificates(studentId: string): Certificate[] {
    return this.certificates.filter((c) => c.studentId === studentId);
  }

  public verifyCertificate(certificateNumber: string): Certificate | undefined {
    return this.certificates.find(
      (c) => c.certificateNumber.toLowerCase() === certificateNumber.toLowerCase()
    );
  }

  // --- AI / Cross-Engine Recommendations ---

  public getRecommendations(userContext: {
    careerGoal?: string;
    skillsGap?: string[];
    academicUnits?: string[];
    enrolledCourseIds?: string[];
  }): CourseRecommendation[] {
    const enrolled = new Set(userContext.enrolledCourseIds || []);
    const available = this.courses.filter((c) => !enrolled.has(c.id) && c.status === 'PUBLISHED');
    const recs: CourseRecommendation[] = [];

    const career = userContext.careerGoal || 'Software Engineer';
    const skillsGap = userContext.skillsGap || ['Python', 'SQL', 'Docker', 'React'];

    available.forEach((course) => {
      // 1. Skill Gap Match
      const matchedSkill = course.skills.find((sk) =>
        skillsGap.some((gap) => gap.toLowerCase() === sk.toLowerCase())
      );

      // 2. Career Path Match
      const matchedCareer = course.careerPaths.some(
        (cp) => cp.toLowerCase().includes(career.toLowerCase()) || career.toLowerCase().includes(cp.toLowerCase())
      );

      if (matchedSkill) {
        recs.push({
          courseId: course.id,
          course,
          matchedSkill,
          careerGoal: career,
          reason: `Targeted to bridge your identified ${matchedSkill} skill gap for ${career} roles.`,
        });
      } else if (matchedCareer) {
        recs.push({
          courseId: course.id,
          course,
          matchedSkill: course.skills[0] || 'Core Skill',
          careerGoal: career,
          reason: `Highly recommended foundational curriculum for aspiring ${career}s.`,
        });
      }
    });

    // If empty, return top rated courses
    if (recs.length === 0) {
      available.slice(0, 3).forEach((course) => {
        recs.push({
          courseId: course.id,
          course,
          matchedSkill: course.skills[0] || 'Academic',
          careerGoal: career,
          reason: 'Trending high-rating campus curriculum for tech and engineering disciplines.',
        });
      });
    }

    return recs;
  }

  // --- Study Plan Engine ---

  public getStudyPlan(studentId: string): StudyPlan {
    if (this.studyPlans[studentId]) {
      return this.studyPlans[studentId];
    }

    const defaultPlan: StudyPlan = {
      id: `plan_${studentId}`,
      studentId,
      title: 'Semester 2 Target: Academic & Cloud Certification Readiness',
      careerTarget: 'Cloud DevOps & Software Engineering',
      weeklyHoursTarget: 12,
      courses: ['course_py_data', 'course_cloud_devops'],
      currentWeek: 3,
      tasks: [
        { id: 'tsk_01', text: 'Complete Pandas Data Cleaning module in Python course', done: true, courseId: 'course_py_data', courseTitle: 'Python for Data Analysis' },
        { id: 'tsk_02', text: 'Watch Kubernetes Architecture slides in Cloud DevOps', done: false, courseId: 'course_cloud_devops', courseTitle: 'Cloud DevOps' },
        { id: 'tsk_03', text: 'Submit Raft consensus lab notes to Google Drive', done: false },
        { id: 'tsk_04', text: 'Attend Friday study group Google Meet on Distributed Systems', done: false },
      ],
      updatedAt: new Date().toISOString(),
    };

    this.studyPlans[studentId] = defaultPlan;
    this.saveState();
    return defaultPlan;
  }

  public updateStudyPlanTask(studentId: string, taskId: string, done: boolean): StudyPlan {
    const plan = this.getStudyPlan(studentId);
    plan.tasks = plan.tasks.map((t) => (t.id === taskId ? { ...t, done } : t));
    plan.updatedAt = new Date().toISOString();
    this.studyPlans[studentId] = plan;
    this.saveState();
    return plan;
  }

  public addStudyPlanTask(studentId: string, text: string, courseId?: string): StudyPlan {
    const plan = this.getStudyPlan(studentId);
    const newTask = {
      id: `tsk_${Date.now()}`,
      text: text.trim(),
      done: false,
      courseId,
      courseTitle: courseId ? this.getCourseById(courseId)?.title : undefined,
    };
    plan.tasks.push(newTask);
    plan.updatedAt = new Date().toISOString();
    this.studyPlans[studentId] = plan;
    this.saveState();
    return plan;
  }

  // --- Teacher Creation & Analytics ---

  public createCourse(newCourse: Omit<Course, 'id' | 'enrollmentCount' | 'rating' | 'ratingCount' | 'createdAt' | 'updatedAt'>): Course {
    const course: Course = {
      ...newCourse,
      id: `course_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      enrollmentCount: 0,
      rating: 5.0,
      ratingCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.courses.unshift(course);
    this.saveState();
    return course;
  }

  public getTeacherCourses(teacherId: string): Course[] {
    return this.courses.filter((c) => c.providerId === teacherId);
  }

  public getTeacherAnalytics(teacherId: string): TeacherEarningsAnalytics {
    const teacherCourses = this.getTeacherCourses(teacherId);
    const totalStudents = teacherCourses.reduce((sum, c) => sum + c.enrollmentCount, 0);
    const grossRevenue = teacherCourses.reduce((sum, c) => sum + c.enrollmentCount * c.price, 0);
    const platformFeeRate = 0.1; // 10% ENEMIND platform fee
    const platformFees = Math.round(grossRevenue * platformFeeRate);
    const netEarnings = grossRevenue - platformFees;

    return {
      teacherId,
      totalStudents,
      activeCourses: teacherCourses.length,
      totalRevenue: grossRevenue,
      platformFees,
      netEarnings,
      pendingPayout: Math.round(netEarnings * 0.7),
      completedPayouts: Math.round(netEarnings * 0.3),
      courseStats: teacherCourses.map((c) => ({
        courseId: c.id,
        title: c.title,
        enrollments: c.enrollmentCount,
        completionRate: 78,
        revenue: c.enrollmentCount * c.price,
      })),
    };
  }
}

export const learningService = new LearningService();
