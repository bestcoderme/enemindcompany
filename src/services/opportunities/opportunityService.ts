import {
  Opportunity,
  OpportunityFilterOptions,
  OpportunityReport,
  OpportunityType,
} from '../../types/opportunities';
import { INITIAL_OPPORTUNITIES } from './opportunityData';
import { DeadlineUtils } from './deadlineUtils';

const STORAGE_OPPS_KEY = 'enemind_custom_opportunities_v1';
const STORAGE_REPORTS_KEY = 'enemind_opportunity_reports_v1';

export const OpportunityService = {
  /**
   * Loads all opportunities (combining seed data + local custom admin additions).
   */
  getAllOpportunities(): Opportunity[] {
    try {
      const raw = localStorage.getItem(STORAGE_OPPS_KEY);
      if (!raw) {
        // Initialize with default dataset
        localStorage.setItem(STORAGE_OPPS_KEY, JSON.stringify(INITIAL_OPPORTUNITIES));
        return INITIAL_OPPORTUNITIES;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_OPPORTUNITIES;
    } catch {
      return INITIAL_OPPORTUNITIES;
    }
  },

  /**
   * Persists opportunities list to local storage
   */
  saveAllOpportunities(list: Opportunity[]): void {
    try {
      localStorage.setItem(STORAGE_OPPS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Error saving opportunities:', e);
    }
  },

  getOpportunityById(id: string): Opportunity | undefined {
    const list = this.getAllOpportunities();
    return list.find((o) => o.id === id);
  },

  /**
   * Global multi-field search with relevance scoring
   */
  searchOpportunities(query: string): Opportunity[] {
    if (!query || !query.trim()) return this.getAllOpportunities();

    const q = query.toLowerCase().trim();
    const terms = q.split(/\s+/).filter(Boolean);
    const list = this.getAllOpportunities();

    const scored = list
      .map((item) => {
        let score = 0;
        const title = (item.title || '').toLowerCase();
        const org = (item.organization || '').toLowerCase();
        const prov = (item.provider || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        const field = (item.field || '').toLowerCase();
        const fields = (item.fields || []).map((f) => f.toLowerCase()).join(' ');
        const progs = (item.eligibleProgrammes || []).map((p) => p.toLowerCase()).join(' ');
        const skills = (item.requiredSkills || []).map((s) => s.toLowerCase()).join(' ');
        const country = (item.country || '').toLowerCase();
        const countries = (item.countries || []).map((c) => c.toLowerCase()).join(' ');
        const loc = (item.location || '').toLowerCase();
        const type = (item.type || '').toLowerCase();

        // Exact phrase matches
        if (title.includes(q)) score += 50;
        if (org.includes(q) || prov.includes(q)) score += 30;
        if (field.includes(q) || fields.includes(q)) score += 25;
        if (progs.includes(q)) score += 20;
        if (skills.includes(q)) score += 20;
        if (country.includes(q) || countries.includes(q) || loc.includes(q)) score += 15;
        if (type.includes(q)) score += 15;
        if (desc.includes(q)) score += 10;

        // Individual term matches
        terms.forEach((term) => {
          if (title.includes(term)) score += 15;
          if (org.includes(term) || prov.includes(term)) score += 10;
          if (skills.includes(term)) score += 8;
          if (fields.includes(term) || progs.includes(term)) score += 8;
          if (country.includes(term) || loc.includes(term)) score += 5;
          if (desc.includes(term)) score += 3;
        });

        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score);

    return scored.map((s) => s.item);
  },

  /**
   * Powerful multi-dimensional filter engine
   */
  filterOpportunities(filter: OpportunityFilterOptions): Opportunity[] {
    let list = this.getAllOpportunities();

    // 1. Search Query
    if (filter.searchQuery && filter.searchQuery.trim()) {
      const searched = this.searchOpportunities(filter.searchQuery);
      const searchIds = new Set(searched.map((s) => s.id));
      list = list.filter((item) => searchIds.has(item.id));
    }

    // 2. Type Filter
    if (filter.types && filter.types.length > 0) {
      const typeSet = new Set(filter.types);
      list = list.filter((item) => typeSet.has(item.type));
    }

    // 3. Country / Location Filter
    if (filter.countries && filter.countries.length > 0) {
      const cLow = filter.countries.map((c) => c.toLowerCase());
      list = list.filter((item) => {
        const itemCountry = (item.country || '').toLowerCase();
        const itemCountries = (item.countries || []).map((c) => c.toLowerCase());
        const isGlobal =
          itemCountry.includes('global') ||
          itemCountry.includes('pan-africa') ||
          itemCountries.includes('global');
        return isGlobal || cLow.some((c) => itemCountry.includes(c) || itemCountries.includes(c));
      });
    }

    // 4. Remote Only
    if (filter.remoteOnly) {
      list = list.filter((item) => item.remote === true || item.remote === 'remote');
    }

    // 5. Field / Category Filter
    if (filter.field && filter.field !== 'All') {
      const fLow = filter.field.toLowerCase();
      list = list.filter((item) => {
        const itemField = (item.field || '').toLowerCase();
        const itemFields = (item.fields || []).map((f) => f.toLowerCase());
        return (
          itemField.includes(fLow) ||
          fLow.includes(itemField) ||
          itemFields.some((f) => f.includes(fLow) || fLow.includes(f)) ||
          itemField.includes('all')
        );
      });
    }

    // 6. Academic Level Filter
    if (filter.academicLevel && filter.academicLevel !== 'All Levels') {
      const lvl = filter.academicLevel;
      list = list.filter((item) => {
        if (!item.eligibleAcademicLevels || item.eligibleAcademicLevels.length === 0) return true;
        if (
          item.eligibleAcademicLevels.includes('All Levels') ||
          item.eligibleAcademicLevels.includes('Undergraduate')
        )
          return true;
        return item.eligibleAcademicLevels.includes(lvl);
      });
    }

    // 7. GPA Requirement Filter
    if (filter.minStudentGpa !== undefined && filter.minStudentGpa > 0) {
      const studentGpa = filter.minStudentGpa;
      list = list.filter((item) => {
        if (!item.minimumGPA || item.minimumGPA === 0) return true;
        return studentGpa >= item.minimumGPA;
      });
    }

    // 8. Verified Only
    if (filter.verifiedOnly) {
      list = list.filter((item) => item.verified === true);
    }

    // 9. Featured Only
    if (filter.featuredOnly) {
      list = list.filter((item) => item.featured === true);
    }

    // 10. Deadline Filter
    if (filter.deadlineFilter && filter.deadlineFilter !== 'all') {
      list = list.filter((item) => {
        const dInfo = DeadlineUtils.getDeadlineInfo(item.deadline);
        if (filter.deadlineFilter === 'today') return dInfo.isToday;
        if (filter.deadlineFilter === 'this_week')
          return dInfo.daysRemaining >= 0 && dInfo.daysRemaining <= 7;
        if (filter.deadlineFilter === 'this_month')
          return dInfo.daysRemaining >= 0 && dInfo.daysRemaining <= 30;
        if (filter.deadlineFilter === 'closing_soon') return dInfo.isClosingSoon;
        if (filter.deadlineFilter === 'no_deadline') return dInfo.daysRemaining === 999;
        return true;
      });
    }

    // 11. Sorting
    if (filter.sortBy === 'deadline_asc') {
      list.sort((a, b) => {
        const da = DeadlineUtils.getDeadlineInfo(a.deadline).daysRemaining;
        const db = DeadlineUtils.getDeadlineInfo(b.deadline).daysRemaining;
        return da - db;
      });
    } else if (filter.sortBy === 'deadline_desc') {
      list.sort((a, b) => {
        const da = DeadlineUtils.getDeadlineInfo(a.deadline).daysRemaining;
        const db = DeadlineUtils.getDeadlineInfo(b.deadline).daysRemaining;
        return db - da;
      });
    } else if (filter.sortBy === 'created_desc') {
      list.sort(
        (a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    } else if (filter.sortBy === 'gpa_asc') {
      list.sort((a, b) => (a.minimumGPA || 0) - (b.minimumGPA || 0));
    }

    return list;
  },

  // ----------------------------------------------------
  // Category-specific helpers
  // ----------------------------------------------------
  getScholarships(): Opportunity[] {
    return this.getAllOpportunities().filter((o) => o.type === 'Scholarship');
  },

  getAttachments(): Opportunity[] {
    return this.getAllOpportunities().filter((o) => o.type === 'Attachment');
  },

  getInternships(): Opportunity[] {
    return this.getAllOpportunities().filter((o) => o.type === 'Internship');
  },

  getJobs(): Opportunity[] {
    return this.getAllOpportunities().filter(
      (o) => o.type === 'Job' || o.type === 'Graduate Programme'
    );
  },

  getFellowships(): Opportunity[] {
    return this.getAllOpportunities().filter((o) => o.type === 'Fellowship');
  },

  getCompetitions(): Opportunity[] {
    return this.getAllOpportunities().filter((o) => o.type === 'Competition');
  },

  getFeaturedOpportunities(): Opportunity[] {
    return this.getAllOpportunities().filter((o) => o.featured === true);
  },

  getClosingSoon(daysThreshold: number = 7): Opportunity[] {
    return this.getAllOpportunities().filter((o) => {
      const dInfo = DeadlineUtils.getDeadlineInfo(o.deadline);
      return (
        !dInfo.isExpired &&
        dInfo.daysRemaining >= 0 &&
        dInfo.daysRemaining <= daysThreshold
      );
    });
  },

  // ----------------------------------------------------
  // Admin & Management operations
  // ----------------------------------------------------
  createOpportunity(oppData: Partial<Opportunity>, authorEmail: string): Opportunity {
    const list = this.getAllOpportunities();
    const now = new Date().toISOString();
    const newOpp: Opportunity = {
      id: oppData.id || `opp_custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title: oppData.title || 'Untitled Opportunity',
      description: oppData.description || '',
      provider: oppData.provider || oppData.organization || 'Enemind Partner',
      organization: oppData.organization || 'Organization',
      type: oppData.type || 'Internship',
      country: oppData.country || 'Kenya',
      countries: oppData.countries || [oppData.country || 'Kenya'],
      location: oppData.location || 'Nairobi, Kenya',
      remote: oppData.remote !== undefined ? oppData.remote : false,
      website: oppData.website || '',
      applicationUrl: oppData.applicationUrl || 'https://enemind.com',
      field: oppData.field || 'General',
      fields: oppData.fields || [oppData.field || 'General'],
      eligibleUniversities: oppData.eligibleUniversities || ['All accredited institutions'],
      eligibleProgrammes: oppData.eligibleProgrammes || ['All Degree Programmes'],
      eligibleAcademicLevels: oppData.eligibleAcademicLevels || ['All Levels'],
      requiredSkills: oppData.requiredSkills || ['Communication', 'Teamwork'],
      preferredSkills: oppData.preferredSkills || [],
      minimumGPA: oppData.minimumGPA,
      fundingAmount: oppData.fundingAmount || 'Competitive Stipend',
      currency: oppData.currency || 'KES',
      fundingType: oppData.fundingType || 'Paid',
      deadline: oppData.deadline || now.split('T')[0],
      duration: oppData.duration || '3 Months',
      status: oppData.status || 'open',
      source: oppData.source || 'Enemind Verified Submission',
      sourceUrl: oppData.sourceUrl || oppData.website,
      verified: oppData.verified !== undefined ? oppData.verified : false,
      verifiedBy: oppData.verified ? authorEmail : undefined,
      verifiedAt: oppData.verified ? now : undefined,
      featured: oppData.featured || false,
      createdAt: now,
      updatedAt: now,
      scholarshipDetails: oppData.scholarshipDetails,
      attachmentDetails: oppData.attachmentDetails,
      jobDetails: oppData.jobDetails,
    };

    list.unshift(newOpp);
    this.saveAllOpportunities(list);
    return newOpp;
  },

  updateOpportunity(id: string, updates: Partial<Opportunity>): Opportunity | null {
    const list = this.getAllOpportunities();
    const index = list.findIndex((o) => o.id === id);
    if (index < 0) return null;

    const updated: Opportunity = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    list[index] = updated;
    this.saveAllOpportunities(list);
    return updated;
  },

  deleteOpportunity(id: string): boolean {
    const list = this.getAllOpportunities();
    const filtered = list.filter((o) => o.id !== id);
    if (filtered.length !== list.length) {
      this.saveAllOpportunities(filtered);
      return true;
    }
    return false;
  },

  verifyOpportunity(id: string, verifiedBy: string): Opportunity | null {
    return this.updateOpportunity(id, {
      verified: true,
      verifiedBy,
      verifiedAt: new Date().toISOString(),
    });
  },

  unverifyOpportunity(id: string): Opportunity | null {
    return this.updateOpportunity(id, {
      verified: false,
      verifiedBy: undefined,
      verifiedAt: undefined,
    });
  },

  featureOpportunity(id: string, featured: boolean): Opportunity | null {
    return this.updateOpportunity(id, { featured });
  },

  // ----------------------------------------------------
  // Reporting & Moderation
  // ----------------------------------------------------
  getAllReports(): OpportunityReport[] {
    try {
      const raw = localStorage.getItem(STORAGE_REPORTS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  reportOpportunity(reportData: Omit<OpportunityReport, 'id' | 'createdAt' | 'status'>): OpportunityReport {
    const reports = this.getAllReports();
    const newReport: OpportunityReport = {
      ...reportData,
      id: `rep_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    reports.unshift(newReport);
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));
    return newReport;
  },

  resolveReport(reportId: string, action: 'dismiss' | 'archive_opportunity'): boolean {
    const reports = this.getAllReports();
    const index = reports.findIndex((r) => r.id === reportId);
    if (index < 0) return false;

    const report = reports[index];
    report.status = action === 'dismiss' ? 'dismissed' : 'resolved';
    localStorage.setItem(STORAGE_REPORTS_KEY, JSON.stringify(reports));

    if (action === 'archive_opportunity') {
      this.updateOpportunity(report.opportunityId, { status: 'archived', verified: false });
    }
    return true;
  },

  getAdminStats() {
    const all = this.getAllOpportunities();
    const reports = this.getAllReports();

    return {
      totalOpportunities: all.length,
      scholarshipsCount: all.filter((o) => o.type === 'Scholarship').length,
      attachmentsCount: all.filter((o) => o.type === 'Attachment').length,
      internshipsCount: all.filter((o) => o.type === 'Internship').length,
      jobsCount: all.filter((o) => o.type === 'Job' || o.type === 'Graduate Programme').length,
      fellowshipsCount: all.filter((o) => o.type === 'Fellowship' || o.type === 'Competition').length,
      verifiedCount: all.filter((o) => o.verified).length,
      unverifiedCount: all.filter((o) => !o.verified).length,
      featuredCount: all.filter((o) => o.featured).length,
      expiredCount: all.filter((o) => DeadlineUtils.getDeadlineInfo(o.deadline).isExpired).length,
      closingSoonCount: all.filter((o) => DeadlineUtils.getDeadlineInfo(o.deadline).isClosingSoon).length,
      pendingReportsCount: reports.filter((r) => r.status === 'pending').length,
    };
  },
};
