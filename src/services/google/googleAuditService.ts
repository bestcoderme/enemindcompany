/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleAuditLogEntry, GoogleServiceType } from '../../types/google';

const AUDIT_STORAGE_KEY = 'enemind_google_audit_logs_v1';

class GoogleAuditService {
  private logs: GoogleAuditLogEntry[] = [];

  constructor() {
    this.loadLogs();
  }

  private loadLogs() {
    try {
      const stored = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      } else {
        // Initial sample logs showcasing audit functionality
        this.logs = [
          {
            id: 'audit_init_01',
            service: 'drive',
            action: 'INITIALIZE_ENEMIND_ROOT_FOLDER',
            timestamp: new Date(Date.now() - 3600 * 1000 * 24).toISOString(),
            userEmail: 'bluetmobcompany@gmail.com',
            purpose: 'Structured storage directory initialization',
            status: 'SUCCESS',
            details: 'Created /Enemind hierarchy with Academic, CV, and Projects subfolders',
          },
          {
            id: 'audit_init_02',
            service: 'calendar',
            action: 'SYNC_SCHEDULE_EVENTS',
            timestamp: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
            userEmail: 'bluetmobcompany@gmail.com',
            purpose: 'Mentorship and examination calendar synchronization',
            status: 'SUCCESS',
            details: 'Retrieved 4 upcoming campus events and 2 mentorship advisory slots',
          },
          {
            id: 'audit_init_03',
            service: 'gmail',
            action: 'SEND_NOTIFICATION_DISPATCH',
            timestamp: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
            userEmail: 'bluetmobcompany@gmail.com',
            purpose: 'Booking confirmation email dispatch',
            status: 'SUCCESS',
            details: 'Delivered session confirmation to mentor and student',
          },
        ];
        this.saveLogs();
      }
    } catch (e) {
      console.warn('Failed to load Google Audit logs:', e);
    }
  }

  private saveLogs() {
    try {
      // Keep last 100 entries
      if (this.logs.length > 100) {
        this.logs = this.logs.slice(0, 100);
      }
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      console.warn('Failed to save Google Audit logs:', e);
    }
  }

  public log(
    service: GoogleServiceType,
    action: string,
    userEmail: string,
    purpose: string,
    status: 'SUCCESS' | 'FAILED' | 'PENDING' = 'SUCCESS',
    details?: string
  ): GoogleAuditLogEntry {
    const entry: GoogleAuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      service,
      action,
      timestamp: new Date().toISOString(),
      userEmail,
      purpose,
      status,
      details,
    };

    this.logs.unshift(entry);
    this.saveLogs();
    return entry;
  }

  public getLogs(limit: number = 50): GoogleAuditLogEntry[] {
    return this.logs.slice(0, limit);
  }

  public getLogsByService(service: GoogleServiceType): GoogleAuditLogEntry[] {
    return this.logs.filter((log) => log.service === service);
  }

  public clearLogs(): void {
    this.logs = [];
    localStorage.removeItem(AUDIT_STORAGE_KEY);
  }

  public exportAuditLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const googleAuditService = new GoogleAuditService();
