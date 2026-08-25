import { AcademicCalculationService } from './academicCalculationService';
import { AcademicRulesResolver } from './academicRulesResolver';
import { STANDARD_KENYA_GRADING_4_0, STANDARD_5_0_GRADING } from '../../data/institutions';
import { StudentAcademicRecord, SemesterSummary } from '../../types';

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function runAcademicEngineTests(): {
  allPassed: boolean;
  results: TestResult[];
} {
  const results: TestResult[] = [];

  const assert = (name: string, condition: boolean, message: string) => {
    results.push({
      name,
      passed: condition,
      message: condition ? 'PASSED: ' + message : 'FAILED: ' + message,
    });
  };

  // 1. Total mark calculation
  const catExamCalc = AcademicCalculationService.calculateAssessmentTotal({
    catScore: 24,
    catMax: 30,
    examScore: 52,
    examMax: 70,
  });
  assert(
    '1. Total Mark Calculation (CAT 24/30 + Exam 52/70 = 76/100)',
    catExamCalc.isValid && catExamCalc.totalMarks === 76 && catExamCalc.percentage === 76,
    `Total: ${catExamCalc.totalMarks}, percentage: ${catExamCalc.percentage}`
  );

  // 2. Grade resolution (4.0 scale & 5.0 scale)
  const gradeA_4 = AcademicCalculationService.resolveGrade(76, STANDARD_KENYA_GRADING_4_0);
  const gradeB_4 = AcademicCalculationService.resolveGrade(64, STANDARD_KENYA_GRADING_4_0);
  const gradeF_4 = AcademicCalculationService.resolveGrade(35, STANDARD_KENYA_GRADING_4_0);
  assert(
    '2. Grade Resolution (4.0 Scale)',
    gradeA_4 === 'A' && gradeB_4 === 'B' && gradeF_4 === 'E/F',
    `76% => ${gradeA_4}, 64% => ${gradeB_4}, 35% => ${gradeF_4}`
  );

  // 3. Grade point resolution
  const gpA_4 = AcademicCalculationService.resolveGradePoint('A', STANDARD_KENYA_GRADING_4_0);
  const gpB_4 = AcademicCalculationService.resolveGradePoint(65, STANDARD_KENYA_GRADING_4_0);
  const gpA_5 = AcademicCalculationService.resolveGradePoint(75, STANDARD_5_0_GRADING);
  assert(
    '3. Grade Point Resolution (4.0 vs 5.0 Scales)',
    gpA_4 === 4.0 && gpB_4 === 3.0 && gpA_5 === 5.0,
    `4.0 Scale A => ${gpA_4}, 4.0 Scale 65% => ${gpB_4}, 5.0 Scale 75% => ${gpA_5}`
  );

  // 4. Weighted GPA (Single semester with varied credit hours)
  const sampleRecords: StudentAcademicRecord[] = [
    {
      id: 'rec_1',
      studentId: 'test@enemind.com',
      semesterId: 'sem_1',
      unitCode: 'EEE 421',
      unitName: 'Electrical Machines',
      creditHours: 3,
      assessments: { catScore: 25, examScore: 55 },
      totalMarks: 80,
      percentage: 80,
      grade: 'A',
      gradePoint: 4.0,
      weightedPoints: 12.0, // 4.0 * 3
      status: 'passed',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'rec_2',
      studentId: 'test@enemind.com',
      semesterId: 'sem_1',
      unitCode: 'MTH 301',
      unitName: 'Complex Analysis',
      creditHours: 4,
      assessments: { catScore: 20, examScore: 45 },
      totalMarks: 65,
      percentage: 65,
      grade: 'B',
      gradePoint: 3.0,
      weightedPoints: 12.0, // 3.0 * 4
      status: 'passed',
      updatedAt: new Date().toISOString(),
    },
  ];
  // Total weighted points = 12 + 12 = 24. Total credits = 3 + 4 = 7. GPA = 24 / 7 = 3.43
  const semGpa = AcademicCalculationService.calculateSemesterGPA(sampleRecords, STANDARD_KENYA_GRADING_4_0);
  assert(
    '4. Weighted Semester GPA Calculation',
    semGpa.totalCredits === 7 && semGpa.totalWeightedPoints === 24 && semGpa.semesterGpa === 3.43,
    `Credits: ${semGpa.totalCredits}, Points: ${semGpa.totalWeightedPoints}, GPA: ${semGpa.semesterGpa}`
  );

  // 5. Cumulative GPA across multiple semesters
  const sem1Summary: SemesterSummary = {
    semesterId: 'sem_1',
    semesterName: 'Semester 1',
    academicYearName: 'Year 1',
    semesterNumber: 1,
    status: 'completed',
    unitsCount: 2,
    totalCredits: 7,
    totalWeightedPoints: 24, // GPA: 3.43
    semesterGpa: 3.43,
    passedUnits: 2,
    failedUnits: 0,
    gradeDistribution: { A: 1, B: 1 },
    records: sampleRecords,
  };

  const sem2Summary: SemesterSummary = {
    semesterId: 'sem_2',
    semesterName: 'Semester 2',
    academicYearName: 'Year 1',
    semesterNumber: 2,
    status: 'completed',
    unitsCount: 2,
    totalCredits: 8,
    totalWeightedPoints: 32, // GPA: 4.0
    semesterGpa: 4.0,
    passedUnits: 2,
    failedUnits: 0,
    gradeDistribution: { A: 2 },
    records: [],
  };

  // Cumulative: (24 + 32) / (7 + 8) = 56 / 15 = 3.73
  const cumSummary = AcademicCalculationService.calculateCumulativeGPA(
    [sem1Summary, sem2Summary],
    STANDARD_KENYA_GRADING_4_0
  );
  assert(
    '5. Cumulative Multi-Semester GPA Calculation',
    cumSummary.totalCreditsCompleted === 15 && cumSummary.cumulativeGpa === 3.73,
    `Credits: ${cumSummary.totalCreditsCompleted}, Cumulative GPA: ${cumSummary.cumulativeGpa}`
  );

  // 6. Target GPA Calculation
  // Current: 3.42 with 72 credits (points = 246.24). Target: 3.70 with 48 remaining credits (total 120 credits => target points = 444).
  // Required future points = 444 - 246.24 = 197.76. Required future GPA = 197.76 / 48 = 4.12 (> 4.0 => unachievable on 4.0 scale).
  const targetSimUnachievable = AcademicCalculationService.calculateTargetGPA(
    3.42,
    72,
    3.70,
    48,
    STANDARD_KENYA_GRADING_4_0
  );
  assert(
    '6. Target GPA Boundary & Unachievable Detection',
    !targetSimUnachievable.isAchievable && targetSimUnachievable.requiredGpa > 4.0,
    `Required GPA: ${targetSimUnachievable.requiredGpa}, Is Achievable: ${targetSimUnachievable.isAchievable}`
  );

  // Realistic Target on 4.0 scale: Current 3.42 with 72 credits, Target 3.55 with 48 credits
  // Target points = 3.55 * 120 = 426. Required future points = 426 - 246.24 = 179.76. Required GPA = 179.76 / 48 = 3.75
  const targetSimAchievable = AcademicCalculationService.calculateTargetGPA(
    3.42,
    72,
    3.55,
    48,
    STANDARD_KENYA_GRADING_4_0
  );
  assert(
    '7. Target GPA Achievable Calculation',
    targetSimAchievable.isAchievable && targetSimAchievable.requiredGpa === 3.75,
    `Required GPA: ${targetSimAchievable.requiredGpa}, Achievable: ${targetSimAchievable.isAchievable}`
  );

  // 8. Invalid Marks Validation
  const invalidCat = AcademicCalculationService.calculateAssessmentTotal({
    catScore: 40,
    catMax: 30, // Exceeds max
    examScore: 50,
    examMax: 70,
  });
  const negativeMark = AcademicCalculationService.calculateAssessmentTotal({
    catScore: -5,
    catMax: 30,
    examScore: 50,
    examMax: 70,
  });
  assert(
    '8. Invalid Marks Validation (Exceeding max & negative marks rejected)',
    !invalidCat.isValid && !negativeMark.isValid,
    `Invalid CAT rejected: ${!invalidCat.isValid}, Negative rejected: ${!negativeMark.isValid}`
  );

  // 9. Different Grading Scales (5.0 Nigerian/UK/MIT scale)
  const target5_0 = AcademicCalculationService.calculateTargetGPA(
    3.80,
    60,
    4.20,
    60,
    STANDARD_5_0_GRADING
  );
  // Target points = 4.20 * 120 = 504. Current points = 3.80 * 60 = 228. Required = (504 - 228)/60 = 4.60
  assert(
    '9. 5.0 GPA Grading Scale Target Calculation',
    target5_0.isAchievable && target5_0.requiredGpa === 4.60,
    `5.0 Scale Required GPA: ${target5_0.requiredGpa} (Max: 5.0)`
  );

  // 10. What-If Scenarios Simulation
  const whatIfs = AcademicCalculationService.simulateWhatIfScenarios(
    3.40,
    60,
    60,
    STANDARD_KENYA_GRADING_4_0
  );
  // If gets straight A's (4.0) in remaining 60 credits => (3.4*60 + 4.0*60)/120 = 3.70
  const allAScenario = whatIfs.find((s) => s.assumedGrade === 'A');
  assert(
    '10. What-If Grade Simulation Scenarios',
    whatIfs.length > 0 && allAScenario?.projectedCumulativeGpa === 3.70,
    `Straight A's projected GPA: ${allAScenario?.projectedCumulativeGpa}, diff: +${allAScenario?.gpaDifference}`
  );

  const allPassed = results.every((r) => r.passed);
  return { allPassed, results };
}
