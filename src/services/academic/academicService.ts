import {
  AcademicYear,
  Semester,
  StudentAcademicRecord,
  SemesterSummary,
  AcademicSummary,
  UniversityGradingSystem,
  TargetGpaSimulationResult,
  WhatIfScenario,
} from '../../types';
import { AcademicCalculationService } from './academicCalculationService';
import { AcademicRulesResolver } from './academicRulesResolver';

const STORAGE_PREFIX = 'enemind_academics_';

export interface UserAcademicDataStore {
  years: AcademicYear[];
  semesters: Semester[];
  records: StudentAcademicRecord[];
  targetGpa?: number;
  lastUpdated: string;
}

export class AcademicService {
  private static getStorageKey(userEmail: string): string {
    const safeEmail = (userEmail || 'anonymous').toLowerCase().trim();
    return `${STORAGE_PREFIX}${safeEmail}`;
  }

  /**
   * Load user's academic store from persistent storage
   */
  static loadStore(userEmail: string): UserAcademicDataStore {
    try {
      const raw = localStorage.getItem(this.getStorageKey(userEmail));
      if (raw) {
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Error loading academic records:', e);
    }

    return {
      years: [],
      semesters: [],
      records: [],
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Save user's academic store to persistent storage
   */
  static saveStore(userEmail: string, store: UserAcademicDataStore): void {
    try {
      store.lastUpdated = new Date().toISOString();
      localStorage.setItem(this.getStorageKey(userEmail), JSON.stringify(store));
    } catch (e) {
      console.error('Error saving academic records:', e);
    }
  }

  /**
   * Get all Semesters for a student
   */
  static getSemesters(userEmail: string): Semester[] {
    const store = this.loadStore(userEmail);
    return store.semesters.filter((s) => !s.isArchived);
  }

  /**
   * Create a new Semester
   */
  static createSemester(
    userEmail: string,
    data: {
      name: string;
      academicYearName: string;
      semesterNumber: number;
      status?: 'upcoming' | 'active' | 'completed';
    }
  ): Semester {
    const store = this.loadStore(userEmail);
    const id = `sem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newSemester: Semester = {
      id,
      academicYearId: `yr_${data.academicYearName.replace(/[^a-zA-Z0-9]/g, '_')}`,
      academicYearName: data.academicYearName,
      name: data.name,
      semesterNumber: data.semesterNumber,
      status: data.status || 'active',
    };

    store.semesters.push(newSemester);
    this.saveStore(userEmail, store);
    return newSemester;
  }

  /**
   * Update an existing Semester
   */
  static updateSemester(
    userEmail: string,
    semesterId: string,
    updates: Partial<Semester>
  ): Semester | null {
    const store = this.loadStore(userEmail);
    const index = store.semesters.findIndex((s) => s.id === semesterId);
    if (index === -1) return null;

    store.semesters[index] = { ...store.semesters[index], ...updates };
    this.saveStore(userEmail, store);
    return store.semesters[index];
  }

  /**
   * Archive / Soft-delete a Semester
   */
  static archiveSemester(userEmail: string, semesterId: string): boolean {
    const store = this.loadStore(userEmail);
    const index = store.semesters.findIndex((s) => s.id === semesterId);
    if (index === -1) return false;

    store.semesters[index].isArchived = true;
    this.saveStore(userEmail, store);
    return true;
  }

  /**
   * Delete a Semester and all its attached records (with safeguard)
   */
  static deleteSemester(userEmail: string, semesterId: string): boolean {
    const store = this.loadStore(userEmail);
    store.semesters = store.semesters.filter((s) => s.id !== semesterId);
    store.records = store.records.filter((r) => r.semesterId !== semesterId);
    this.saveStore(userEmail, store);
    return true;
  }

  /**
   * Get academic records for a user, optionally filtered by semester
   */
  static getAcademicRecords(
    userEmail: string,
    semesterId?: string
  ): StudentAcademicRecord[] {
    const store = this.loadStore(userEmail);
    if (semesterId) {
      return store.records.filter((r) => r.semesterId === semesterId);
    }
    return store.records;
  }

  /**
   * Add a new Course Unit with marks & calculations
   */
  static createAcademicRecord(
    userEmail: string,
    params: {
      semesterId: string;
      unitCode: string;
      unitName: string;
      creditHours: number;
      catScore?: number;
      catMax?: number;
      examScore?: number;
      examMax?: number;
      customComponents?: { name: string; score: number; maxScore: number }[];
      universityId?: string;
      programmeCategory?: string;
      remarks?: string;
    }
  ): { record?: StudentAcademicRecord; error?: string } {
    const store = this.loadStore(userEmail);
    const gradingSystem = AcademicRulesResolver.resolveGradingSystem(params.universityId);
    const weights = AcademicRulesResolver.resolveAssessmentWeights(
      params.universityId,
      params.programmeCategory
    );

    // Validation
    const codeClean = params.unitCode.trim().toUpperCase();
    const nameClean = params.unitName.trim();
    if (!codeClean) return { error: 'Unit Code is required (e.g. CSC 311)' };
    if (!nameClean) return { error: 'Unit Name is required (e.g. Database Systems)' };
    if (params.creditHours <= 0 || params.creditHours > 12) {
      return { error: 'Credit hours must be between 1 and 12' };
    }

    // Check duplicate in same semester
    const exists = store.records.some(
      (r) => r.semesterId === params.semesterId && r.unitCode.toUpperCase() === codeClean
    );
    if (exists) {
      return { error: `Unit ${codeClean} is already added in this semester` };
    }

    const assessments = {
      catScore: params.catScore ?? 0,
      catMax: params.catMax ?? weights.catMax,
      examScore: params.examScore ?? 0,
      examMax: params.examMax ?? weights.examMax,
      customComponents: params.customComponents,
    };

    const calc = AcademicCalculationService.calculateAssessmentTotal(assessments, weights);
    if (!calc.isValid) {
      return { error: calc.error };
    }

    const grade = AcademicCalculationService.resolveGrade(calc.percentage, gradingSystem);
    const gradePoint = AcademicCalculationService.resolveGradePoint(calc.percentage, gradingSystem);
    const weightedPoints = AcademicCalculationService.calculateWeightedPoints(
      gradePoint,
      params.creditHours
    );

    const isPassed = calc.percentage >= (gradingSystem.passMarkPercentage || 40);

    const newRecord: StudentAcademicRecord = {
      id: `rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      studentId: userEmail,
      semesterId: params.semesterId,
      unitCode: codeClean,
      unitName: nameClean,
      creditHours: params.creditHours,
      assessments,
      totalMarks: calc.totalMarks,
      percentage: calc.percentage,
      grade,
      gradePoint,
      weightedPoints,
      status: isPassed ? 'passed' : 'failed',
      remarks: params.remarks,
      updatedAt: new Date().toISOString(),
    };

    store.records.push(newRecord);
    this.saveStore(userEmail, store);
    return { record: newRecord };
  }

  /**
   * Update an existing academic unit record
   */
  static updateAcademicRecord(
    userEmail: string,
    recordId: string,
    params: {
      unitCode?: string;
      unitName?: string;
      creditHours?: number;
      catScore?: number;
      catMax?: number;
      examScore?: number;
      examMax?: number;
      customComponents?: { name: string; score: number; maxScore: number }[];
      universityId?: string;
      programmeCategory?: string;
      remarks?: string;
    }
  ): { record?: StudentAcademicRecord; error?: string } {
    const store = this.loadStore(userEmail);
    const index = store.records.findIndex((r) => r.id === recordId);
    if (index === -1) return { error: 'Record not found' };

    const oldRecord = store.records[index];
    const gradingSystem = AcademicRulesResolver.resolveGradingSystem(params.universityId);
    const weights = AcademicRulesResolver.resolveAssessmentWeights(
      params.universityId,
      params.programmeCategory
    );

    const unitCode = params.unitCode ? params.unitCode.trim().toUpperCase() : oldRecord.unitCode;
    const unitName = params.unitName ? params.unitName.trim() : oldRecord.unitName;
    const creditHours = params.creditHours ?? oldRecord.creditHours;

    const assessments = {
      catScore: params.catScore ?? oldRecord.assessments.catScore ?? 0,
      catMax: params.catMax ?? oldRecord.assessments.catMax ?? weights.catMax,
      examScore: params.examScore ?? oldRecord.assessments.examScore ?? 0,
      examMax: params.examMax ?? oldRecord.assessments.examMax ?? weights.examMax,
      customComponents: params.customComponents ?? oldRecord.assessments.customComponents,
    };

    const calc = AcademicCalculationService.calculateAssessmentTotal(assessments, weights);
    if (!calc.isValid) {
      return { error: calc.error };
    }

    const grade = AcademicCalculationService.resolveGrade(calc.percentage, gradingSystem);
    const gradePoint = AcademicCalculationService.resolveGradePoint(calc.percentage, gradingSystem);
    const weightedPoints = AcademicCalculationService.calculateWeightedPoints(gradePoint, creditHours);
    const isPassed = calc.percentage >= (gradingSystem.passMarkPercentage || 40);

    const updatedRecord: StudentAcademicRecord = {
      ...oldRecord,
      unitCode,
      unitName,
      creditHours,
      assessments,
      totalMarks: calc.totalMarks,
      percentage: calc.percentage,
      grade,
      gradePoint,
      weightedPoints,
      status: isPassed ? 'passed' : 'failed',
      remarks: params.remarks ?? oldRecord.remarks,
      updatedAt: new Date().toISOString(),
    };

    store.records[index] = updatedRecord;
    this.saveStore(userEmail, store);
    return { record: updatedRecord };
  }

  /**
   * Delete an individual unit record
   */
  static deleteAcademicRecord(userEmail: string, recordId: string): boolean {
    const store = this.loadStore(userEmail);
    store.records = store.records.filter((r) => r.id !== recordId);
    this.saveStore(userEmail, store);
    return true;
  }

  /**
   * Save target GPA
   */
  static setTargetGpa(userEmail: string, targetGpa: number): void {
    const store = this.loadStore(userEmail);
    store.targetGpa = targetGpa;
    this.saveStore(userEmail, store);
  }

  /**
   * Build complete Academic Summary including Semester summaries and Cumulative statistics
   */
  static getAcademicSummary(
    userEmail: string,
    universityId?: string,
    programmeCategory?: string
  ): AcademicSummary {
    let store = this.loadStore(userEmail);
    if (store.semesters.length === 0) {
      this.seedDemoAcademicData(userEmail, universityId);
      store = this.loadStore(userEmail);
    }
    const gradingSystem = AcademicRulesResolver.resolveGradingSystem(universityId);

    const semesterSummaries: SemesterSummary[] = [];

    for (const sem of store.semesters.filter((s) => !s.isArchived)) {
      const records = store.records.filter((r) => r.semesterId === sem.id);
      const semCalc = AcademicCalculationService.calculateSemesterGPA(records, gradingSystem);

      semesterSummaries.push({
        semesterId: sem.id,
        semesterName: sem.name,
        academicYearName: sem.academicYearName,
        semesterNumber: sem.semesterNumber,
        status: sem.status,
        unitsCount: records.length,
        totalCredits: semCalc.totalCredits,
        totalWeightedPoints: semCalc.totalWeightedPoints,
        semesterGpa: semCalc.semesterGpa,
        passedUnits: semCalc.passedUnits,
        failedUnits: semCalc.failedUnits,
        gradeDistribution: semCalc.gradeDistribution,
        records,
      });
    }

    const summary = AcademicCalculationService.calculateCumulativeGPA(
      semesterSummaries,
      gradingSystem
    );

    summary.targetGpa = store.targetGpa;
    return summary;
  }

  /**
   * Seed optional sample starter semester for quick preview/testing
   */
  static seedDemoAcademicData(userEmail: string, universityId?: string): void {
    const store = this.loadStore(userEmail);
    if (store.semesters.length > 0) return; // Don't overwrite existing

    const sem1 = this.createSemester(userEmail, {
      name: 'Semester 1',
      academicYearName: 'Year 1 (2024/2025)',
      semesterNumber: 1,
      status: 'completed',
    });

    const sem2 = this.createSemester(userEmail, {
      name: 'Semester 2',
      academicYearName: 'Year 1 (2024/2025)',
      semesterNumber: 2,
      status: 'completed',
    });

    const sem3 = this.createSemester(userEmail, {
      name: 'Semester 1',
      academicYearName: 'Year 2 (2025/2026)',
      semesterNumber: 1,
      status: 'active',
    });

    // Sample Year 1 Sem 1
    this.createAcademicRecord(userEmail, {
      semesterId: sem1.id,
      unitCode: 'CSC 111',
      unitName: 'Introduction to Computer Science',
      creditHours: 3,
      catScore: 28,
      examScore: 62,
      universityId,
    });
    this.createAcademicRecord(userEmail, {
      semesterId: sem1.id,
      unitCode: 'SMA 104',
      unitName: 'Calculus I & Analytical Geometry',
      creditHours: 3,
      catScore: 25,
      examScore: 50,
      universityId,
    });
    this.createAcademicRecord(userEmail, {
      semesterId: sem1.id,
      unitCode: 'PHY 110',
      unitName: 'Physics for Engineers',
      creditHours: 3,
      catScore: 26,
      examScore: 48,
      universityId,
    });

    // Sample Year 1 Sem 2
    this.createAcademicRecord(userEmail, {
      semesterId: sem2.id,
      unitCode: 'CSC 122',
      unitName: 'Object Oriented Programming with Java',
      creditHours: 4,
      catScore: 29,
      examScore: 58,
      universityId,
    });
    this.createAcademicRecord(userEmail, {
      semesterId: sem2.id,
      unitCode: 'SMA 108',
      unitName: 'Discrete Mathematics',
      creditHours: 3,
      catScore: 24,
      examScore: 45,
      universityId,
    });

    // Active Year 2 Sem 1
    this.createAcademicRecord(userEmail, {
      semesterId: sem3.id,
      unitCode: 'CSC 211',
      unitName: 'Data Structures and Algorithms',
      creditHours: 4,
      catScore: 27,
      examScore: 56,
      universityId,
    });
    this.createAcademicRecord(userEmail, {
      semesterId: sem3.id,
      unitCode: 'CSC 215',
      unitName: 'Database Management Systems',
      creditHours: 3,
      catScore: 28,
      examScore: 58,
      universityId,
    });

    this.setTargetGpa(userEmail, 3.8);
  }

  /**
   * Export Academic Transcript to CSV
   */
  static exportToCsv(
    userEmail: string,
    studentName: string,
    universityName: string,
    programmeName: string
  ): void {
    const summary = this.getAcademicSummary(userEmail);
    const headers = [
      'Academic Year',
      'Semester',
      'Unit Code',
      'Unit Name',
      'Credit Hours',
      'CAT (30)',
      'Exam (70)',
      'Total (100)',
      'Grade',
      'Grade Point',
      'Quality Points',
      'Status',
    ];

    const rows: string[][] = [];

    for (const sem of summary.semesters) {
      for (const rec of sem.records) {
        rows.push([
          `"${sem.academicYearName}"`,
          `"${sem.semesterName}"`,
          `"${rec.unitCode}"`,
          `"${rec.unitName.replace(/"/g, '""')}"`,
          `${rec.creditHours}`,
          `${rec.assessments.catScore || 0}`,
          `${rec.assessments.examScore || 0}`,
          `${rec.totalMarks}`,
          `"${rec.grade}"`,
          `${rec.gradePoint.toFixed(1)}`,
          `${rec.weightedPoints.toFixed(1)}`,
          `"${rec.status.toUpperCase()}"`,
        ]);
      }
    }

    const metadataHeader = [
      `"ENEMIND OFFICIAL ACADEMIC TRANSCRIPT RECORD"`,
      `"Student Name: ${studentName}"`,
      `"Institution: ${universityName}"`,
      `"Programme: ${programmeName}"`,
      `"Cumulative GPA: ${summary.cumulativeGpa.toFixed(2)}"`,
      `"Classification: ${summary.academicClassification}"`,
      `"Total Credits Completed: ${summary.totalCreditsCompleted}"`,
      `"Export Date: ${new Date().toLocaleDateString()}"`,
      `""`,
    ].join('\n');

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      encodeURIComponent(metadataHeader + '\n' + headers.join(',') + '\n' + rows.map((e) => e.join(',')).join('\n'));

    const link = document.createElement('a');
    link.setAttribute('href', csvContent);
    link.setAttribute('download', `ENEMIND_Transcript_${studentName.replace(/\s+/g, '_')}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
