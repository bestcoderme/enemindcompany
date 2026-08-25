export interface GradeRule {
  grade: string;        // 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'
  minScore: number;     // e.g. 70
  maxScore: number;     // e.g. 100
  gradePoint: number;   // e.g. 4.0 or 5.0
  description: string;  // 'First Class / Excellent'
  classification?: string; // 'First Class Honours', 'Second Class Upper'
}

export type GradingSystemType = '4_POINT_GPA' | '5_POINT_GPA' | 'PERCENTAGE_CLASS' | 'CWA';

export interface UniversityGradingSystem {
  id: string;
  name: string;
  type: GradingSystemType;
  maxPoint: number;
  passMarkPercentage: number;
  defaultCatMax?: number;  // Default 30
  defaultExamMax?: number; // Default 70
  gradeRules: GradeRule[];
  classificationRules?: {
    firstClassMin: number;
    secondUpperMin: number;
    secondLowerMin: number;
    passMin: number;
  };
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  country?: string;
  logoUrl: string;
  category?: 'University' | 'College' | 'Polytechnic' | 'Other';
  campuses?: string[];
  faculties?: string[];
  gradingSystem?: UniversityGradingSystem;
}

export interface CourseItem {
  id: string;
  name: string;
  category: string;
  code?: string;
  faculty?: string;
  durationYears?: number;
  totalRequiredCredits?: number;
}

export type SemesterStatus = 'upcoming' | 'active' | 'completed';

export interface AcademicYear {
  id: string;
  name: string;             // e.g. "Year 1 (2024/2025)"
  universityId: string;
  programmeId: string;
  yearNumber: number;       // 1, 2, 3, 4, 5, 6
  startDate?: string;
  endDate?: string;
  status: 'upcoming' | 'active' | 'completed';
}

export interface Semester {
  id: string;
  academicYearId: string;
  academicYearName: string; // e.g. "2024/2025" or "Year 1"
  name: string;             // "Semester 1", "Trimester 2"
  semesterNumber: number;   // 1, 2, 3
  startDate?: string;
  endDate?: string;
  status: SemesterStatus;
  isArchived?: boolean;
  notes?: string;
}

export interface AssessmentScore {
  catScore?: number;
  catMax?: number;
  examScore?: number;
  examMax?: number;
  assignmentScore?: number;
  practicalScore?: number;
  projectScore?: number;
  customComponents?: {
    name: string;
    score: number;
    maxScore: number;
    weightPercentage?: number;
  }[];
}

export interface StudentAcademicRecord {
  id: string;
  studentId: string;        // user email or ID
  semesterId: string;
  academicYearId?: string;
  unitCode: string;         // e.g. "EEE 421"
  unitName: string;         // "Electrical Machines II"
  creditHours: number;      // e.g. 3
  level?: number | string;  // e.g. "400" or "Year 4"
  assessments: AssessmentScore;
  totalMarks: number;       // Calculated out of 100
  percentage: number;       // 0 - 100
  grade: string;            // e.g. "A", "B+"
  gradePoint: number;       // e.g. 4.0
  weightedPoints: number;   // gradePoint * creditHours
  status: 'enrolled' | 'passed' | 'failed' | 'in_progress';
  remarks?: string;
  updatedAt: string;
}

// Backward compatibility alias
export type CourseUnit = StudentAcademicRecord;

export interface SemesterSummary {
  semesterId: string;
  semesterName: string;
  academicYearName: string;
  semesterNumber: number;
  status: SemesterStatus;
  unitsCount: number;
  totalCredits: number;
  totalWeightedPoints: number;
  semesterGpa: number;
  passedUnits: number;
  failedUnits: number;
  gradeDistribution: Record<string, number>;
  records: StudentAcademicRecord[];
}

export interface AcademicSummary {
  cumulativeGpa: number;
  totalCreditsCompleted: number;
  totalQualityPoints: number;
  semestersCount: number;
  unitsCompletedCount: number;
  academicClassification: string;
  targetGpa?: number;
  semesters: SemesterSummary[];
  gradeDistribution: Record<string, number>;
  gpaTrend: {
    semesterId: string;
    semesterName: string;
    academicYearName: string;
    semesterGpa: number;
    cumulativeGpa: number;
  }[];
  strongestUnits: StudentAcademicRecord[];
  weakestUnits: StudentAcademicRecord[];
}

export interface TargetGpaSimulationResult {
  currentGpa: number;
  currentCredits: number;
  targetGpa: number;
  remainingCredits: number;
  requiredGpa: number;
  isAchievable: boolean;
  maxPossibleGpa: number;
  recommendation: string;
  suggestedGradesBreakdown: {
    grade: string;
    estimatedUnits: number;
    gradePoint: number;
  }[];
}

export interface WhatIfScenario {
  id: string;
  title: string;
  description: string;
  assumedGrade: string;
  assumedGradePoint: number;
  remainingCredits: number;
  projectedCumulativeGpa: number;
  gpaDifference: number;
}
