/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SafetyReport, Course, CourseStatus } from '../../types/learning';
import { learningService } from './learningService';

const STORAGE_KEY_REPORTS = 'enemind_safety_reports';

class AdminEducationService {
  private reports: SafetyReport[] = [];

  constructor() {
    this.loadReports();
  }

  private loadReports() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REPORTS);
      this.reports = stored
        ? JSON.parse(stored)
        : [
            {
              id: 'rep_01',
              reporterId: 'usr_02',
              reporterName: 'Faith Wanjiku',
              targetType: 'COURSE',
              targetId: 'course_test',
              targetName: 'Intro to Web Scrapers',
              reason: 'COPYRIGHT',
              details: 'Contains uncredited slides from another university lab.',
              status: 'REVIEWED',
              createdAt: '2026-08-15T10:00:00Z',
            },
          ];
    } catch {
      this.reports = [];
    }
  }

  private saveReports() {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(this.reports));
    } catch (e) {
      console.warn('Failed to save reports:', e);
    }
  }

  public submitSafetyReport(params: {
    reporterId: string;
    reporterName?: string;
    targetType: 'COURSE' | 'TEACHER' | 'MENTOR' | 'RESOURCE' | 'GROUP' | 'MESSAGE';
    targetId: string;
    targetName: string;
    reason: 'SCAM' | 'MISREPRESENTATION' | 'COPYRIGHT' | 'HARASSMENT' | 'INAPPROPRIATE' | 'SPAM' | 'OTHER';
    details: string;
  }): SafetyReport {
    const newReport: SafetyReport = {
      id: `rep_${Date.now()}`,
      reporterId: params.reporterId,
      reporterName: params.reporterName || 'Anonymous Student',
      targetType: params.targetType,
      targetId: params.targetId,
      targetName: params.targetName,
      reason: params.reason,
      details: params.details.trim(),
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    this.reports.unshift(newReport);
    this.saveReports();
    return newReport;
  }

  public getReports(): SafetyReport[] {
    return this.reports;
  }

  public resolveReport(reportId: string, status: 'REVIEWED' | 'ACTION_TAKEN' | 'DISMISSED'): boolean {
    const rep = this.reports.find((r) => r.id === reportId);
    if (!rep) return false;
    rep.status = status;
    this.saveReports();
    return true;
  }

  public updateCourseStatus(courseId: string, status: CourseStatus, notes?: string): boolean {
    const course = learningService.getCourseById(courseId);
    if (!course) return false;
    course.status = status;
    if (notes) course.moderationNotes = notes;
    course.updatedAt = new Date().toISOString();
    return true;
  }
}

export const adminEducationService = new AdminEducationService();
