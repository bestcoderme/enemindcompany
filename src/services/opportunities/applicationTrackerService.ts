import { StudentApplicationRecord, ApplicationStatus } from '../../types/opportunities';

const STORAGE_KEY_PREFIX = 'enemind_app_tracker_';
const SAVED_KEY_PREFIX = 'enemind_saved_opps_';

export const ApplicationTrackerService = {
  /**
   * Helper to get safe storage key per student email
   */
  getStorageKey(studentEmail: string): string {
    const clean = (studentEmail || 'anonymous').toLowerCase().trim();
    return `${STORAGE_KEY_PREFIX}${clean}`;
  },

  getSavedStorageKey(studentEmail: string): string {
    const clean = (studentEmail || 'anonymous').toLowerCase().trim();
    return `${SAVED_KEY_PREFIX}${clean}`;
  },

  // ----------------------------------------------------
  // 1. Saved / Bookmarked Operations
  // ----------------------------------------------------
  getSavedOpportunityIds(studentEmail: string): string[] {
    try {
      const raw = localStorage.getItem(this.getSavedStorageKey(studentEmail));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  isSaved(studentEmail: string, opportunityId: string): boolean {
    const saved = this.getSavedOpportunityIds(studentEmail);
    return saved.includes(opportunityId);
  },

  saveOpportunity(studentEmail: string, opportunityId: string): void {
    const saved = this.getSavedOpportunityIds(studentEmail);
    if (!saved.includes(opportunityId)) {
      const updated = [...saved, opportunityId];
      localStorage.setItem(this.getSavedStorageKey(studentEmail), JSON.stringify(updated));
    }
    // Also create or sync a 'saved' tracking record if none exists
    const existing = this.getApplication(studentEmail, opportunityId);
    if (!existing) {
      this.setApplicationStatus(studentEmail, opportunityId, 'saved');
    }
  },

  unsaveOpportunity(studentEmail: string, opportunityId: string): void {
    const saved = this.getSavedOpportunityIds(studentEmail);
    const updated = saved.filter(id => id !== opportunityId);
    localStorage.setItem(this.getSavedStorageKey(studentEmail), JSON.stringify(updated));
  },

  toggleSave(studentEmail: string, opportunityId: string): boolean {
    if (this.isSaved(studentEmail, opportunityId)) {
      this.unsaveOpportunity(studentEmail, opportunityId);
      return false;
    } else {
      this.saveOpportunity(studentEmail, opportunityId);
      return true;
    }
  },

  // ----------------------------------------------------
  // 2. Application Pipeline Tracking Operations
  // ----------------------------------------------------
  getAllApplications(studentEmail: string): StudentApplicationRecord[] {
    try {
      const raw = localStorage.getItem(this.getStorageKey(studentEmail));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  getApplication(studentEmail: string, opportunityId: string): StudentApplicationRecord | null {
    const all = this.getAllApplications(studentEmail);
    return all.find(a => a.opportunityId === opportunityId) || null;
  },

  setApplicationStatus(
    studentEmail: string,
    opportunityId: string,
    status: ApplicationStatus,
    notes?: string,
    dates?: { applicationDate?: string; interviewDate?: string; followUpDate?: string }
  ): StudentApplicationRecord {
    const all = this.getAllApplications(studentEmail);
    const now = new Date().toISOString();
    const existingIndex = all.findIndex(a => a.opportunityId === opportunityId);

    let record: StudentApplicationRecord;

    if (existingIndex >= 0) {
      record = {
        ...all[existingIndex],
        status,
        notes: notes !== undefined ? notes : all[existingIndex].notes,
        applicationDate: dates?.applicationDate !== undefined ? dates.applicationDate : (status === 'applied' ? (all[existingIndex].applicationDate || now.split('T')[0]) : all[existingIndex].applicationDate),
        interviewDate: dates?.interviewDate !== undefined ? dates.interviewDate : all[existingIndex].interviewDate,
        followUpDate: dates?.followUpDate !== undefined ? dates.followUpDate : all[existingIndex].followUpDate,
        updatedAt: now,
      };
      all[existingIndex] = record;
    } else {
      record = {
        id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        opportunityId,
        studentId: studentEmail,
        status,
        notes: notes || '',
        applicationDate: dates?.applicationDate || (status === 'applied' ? now.split('T')[0] : undefined),
        interviewDate: dates?.interviewDate,
        followUpDate: dates?.followUpDate,
        personalNotes: '',
        createdAt: now,
        updatedAt: now,
      };
      all.push(record);
    }

    localStorage.setItem(this.getStorageKey(studentEmail), JSON.stringify(all));

    // If status is saved, ensure it's in the saved list; if status changes to withdrawn/rejected, keep in sync
    if (status === 'saved' && !this.isSaved(studentEmail, opportunityId)) {
      const saved = this.getSavedOpportunityIds(studentEmail);
      localStorage.setItem(this.getSavedStorageKey(studentEmail), JSON.stringify([...saved, opportunityId]));
    }

    return record;
  },

  updateApplicationNotes(studentEmail: string, opportunityId: string, personalNotes: string): void {
    const all = this.getAllApplications(studentEmail);
    const existing = all.find(a => a.opportunityId === opportunityId);
    if (existing) {
      existing.personalNotes = personalNotes;
      existing.updatedAt = new Date().toISOString();
      localStorage.setItem(this.getStorageKey(studentEmail), JSON.stringify(all));
    }
  },

  deleteApplication(studentEmail: string, opportunityId: string): void {
    const all = this.getAllApplications(studentEmail);
    const filtered = all.filter(a => a.opportunityId !== opportunityId);
    localStorage.setItem(this.getStorageKey(studentEmail), JSON.stringify(filtered));
    this.unsaveOpportunity(studentEmail, opportunityId);
  },

  getApplicationStats(studentEmail: string) {
    const all = this.getAllApplications(studentEmail);
    return {
      totalTracked: all.length,
      saved: all.filter(a => a.status === 'saved').length,
      planning: all.filter(a => a.status === 'planning').length,
      applied: all.filter(a => a.status === 'applied').length,
      interview: all.filter(a => a.status === 'interview').length,
      accepted: all.filter(a => a.status === 'accepted').length,
      rejected: all.filter(a => a.status === 'rejected').length,
      withdrawn: all.filter(a => a.status === 'withdrawn').length,
    };
  },
};
