/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DisputeReport } from '../../types/mentorship';

const DISPUTES_STORAGE_KEY = 'enemind_disputes_reports_v1';

export class SafetyModerationService {
  private static initStorage(): void {
    if (!localStorage.getItem(DISPUTES_STORAGE_KEY)) {
      localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify([]));
    }
  }

  public static getAllReports(): DisputeReport[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(DISPUTES_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static submitReport(params: {
    bookingId?: string;
    reporterId: string;
    reporterName: string;
    reporterRole: 'STUDENT' | 'PROVIDER' | 'USER';
    reportedId: string;
    reportedName: string;
    targetType: 'PROVIDER' | 'STUDENT' | 'SESSION' | 'MESSAGE' | 'REVIEW';
    reason: 'FRAUD' | 'HARASSMENT' | 'INAPPROPRIATE_BEHAVIOR' | 'MISREPRESENTATION' | 'NO_SHOW' | 'SPAM' | 'OTHER';
    description: string;
  }): DisputeReport {
    this.initStorage();
    const newReport: DisputeReport = {
      id: `report_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      bookingId: params.bookingId,
      reporterId: params.reporterId,
      reporterName: params.reporterName,
      reporterRole: params.reporterRole,
      reportedId: params.reportedId,
      reportedName: params.reportedName,
      targetType: params.targetType,
      reason: params.reason,
      description: params.description.trim(),
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const all = this.getAllReports();
    all.unshift(newReport);
    localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(all));

    return newReport;
  }

  public static resolveReport(
    reportId: string,
    action: 'RESOLVED' | 'DISMISSED',
    resolutionNotes: string,
    refundIssued?: boolean
  ): DisputeReport {
    this.initStorage();
    const all = this.getAllReports();
    const idx = all.findIndex((r) => r.id === reportId);
    if (idx === -1) {
      throw new Error('Report not found');
    }

    all[idx].status = action;
    all[idx].resolutionNotes = resolutionNotes;
    all[idx].refundIssued = refundIssued;
    all[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(DISPUTES_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }

  /**
   * Anti-Fraud Heuristics helper
   */
  public static checkSuspiciousActivity(userId: string): {
    isSuspicious: boolean;
    flags: string[];
  } {
    const flags: string[] = [];
    const all = this.getAllReports();
    const userReports = all.filter((r) => r.reportedId === userId);

    if (userReports.length >= 2) {
      flags.push(`User has received ${userReports.length} safety/moderation flags.`);
    }

    return {
      isSuspicious: flags.length > 0,
      flags,
    };
  }
}
