import {
  StudentAcademicRecord,
  SemesterSummary,
  AcademicSummary,
  UniversityGradingSystem,
  GradeRule,
  AssessmentScore,
  TargetGpaSimulationResult,
  WhatIfScenario,
} from '../../types';
import { AcademicRulesResolver, AssessmentWeightConfig, DEFAULT_ASSESSMENT_WEIGHTS } from './academicRulesResolver';

export class AcademicCalculationService {
  /**
   * Calculate normalized mark out of 100 from assessment components (CAT, Exam, assignments).
   * Validates against impossible or negative inputs.
   */
  static calculateAssessmentTotal(
    assessments: AssessmentScore,
    weights: AssessmentWeightConfig = DEFAULT_ASSESSMENT_WEIGHTS
  ): { totalMarks: number; percentage: number; isValid: boolean; error?: string } {
    const catMax = assessments.catMax ?? weights.catMax ?? 30;
    const examMax = assessments.examMax ?? weights.examMax ?? 70;

    const catScore = assessments.catScore ?? 0;
    const examScore = assessments.examScore ?? 0;

    // Validation
    if (catScore < 0 || examScore < 0) {
      return { totalMarks: 0, percentage: 0, isValid: false, error: 'Marks cannot be negative' };
    }
    if (catScore > catMax) {
      return {
        totalMarks: 0,
        percentage: 0,
        isValid: false,
        error: `CAT mark (${catScore}) cannot exceed maximum allowed (${catMax})`,
      };
    }
    if (examScore > examMax) {
      return {
        totalMarks: 0,
        percentage: 0,
        isValid: false,
        error: `Exam mark (${examScore}) cannot exceed maximum allowed (${examMax})`,
      };
    }

    // If custom assessment components exist (Assignments, Projects, Practicals)
    if (assessments.customComponents && assessments.customComponents.length > 0) {
      let totalRaw = 0;
      let totalMax = 0;

      for (const comp of assessments.customComponents) {
        if (comp.score < 0 || comp.score > comp.maxScore) {
          return {
            totalMarks: 0,
            percentage: 0,
            isValid: false,
            error: `Component "${comp.name}" score (${comp.score}) exceeds max (${comp.maxScore})`,
          };
        }
        totalRaw += comp.score;
        totalMax += comp.maxScore;
      }

      const normalized = totalMax > 0 ? (totalRaw / totalMax) * 100 : 0;
      const rounded = Math.round(normalized * 100) / 100;
      return { totalMarks: rounded, percentage: rounded, isValid: true };
    }

    // Standard CAT + Exam calculation
    const rawTotal = catScore + examScore;
    const maxTotal = catMax + examMax;
    const normalizedPercentage = maxTotal > 0 ? (rawTotal / maxTotal) * 100 : 0;
    const rounded = Math.round(normalizedPercentage * 100) / 100;

    return {
      totalMarks: rawTotal,
      percentage: rounded,
      isValid: true,
    };
  }

  /**
   * Resolve letter grade from percentage mark using institutional grading system.
   */
  static resolveGrade(percentage: number, gradingSystem: UniversityGradingSystem): string {
    const rule = AcademicRulesResolver.resolveGradeRule(percentage, gradingSystem);
    return rule.grade;
  }

  /**
   * Resolve grade point (e.g. 4.0, 3.0, 5.0) from percentage mark or letter grade.
   */
  static resolveGradePoint(
    input: number | string,
    gradingSystem: UniversityGradingSystem
  ): number {
    if (typeof input === 'number') {
      const rule = AcademicRulesResolver.resolveGradeRule(input, gradingSystem);
      return rule.gradePoint;
    }

    if (!input) return 0.0;
    if (!gradingSystem || !Array.isArray(gradingSystem.gradeRules)) return 0.0;

    const strInput = String(input).trim().toLowerCase();
    const matchedRule = gradingSystem.gradeRules.find(
      (r) => (r?.grade || '').toLowerCase().trim() === strInput
    );
    return matchedRule ? matchedRule.gradePoint : 0.0;
  }

  /**
   * Calculate quality points (weighted grade points) for a unit: Grade Point × Credit Hours.
   */
  static calculateWeightedPoints(gradePoint: number, creditHours: number): number {
    const validCredits = Math.max(0, creditHours);
    const validPoint = Math.max(0, gradePoint);
    return Math.round(validPoint * validCredits * 100) / 100;
  }

  /**
   * Calculate Semester GPA: Σ(Grade Point × Credit Hours) ÷ Σ(Credit Hours).
   */
  static calculateSemesterGPA(
    records: StudentAcademicRecord[],
    gradingSystem: UniversityGradingSystem
  ): {
    semesterGpa: number;
    totalCredits: number;
    totalWeightedPoints: number;
    passedUnits: number;
    failedUnits: number;
    gradeDistribution: Record<string, number>;
  } {
    let totalCredits = 0;
    let totalWeightedPoints = 0;
    let passedUnits = 0;
    let failedUnits = 0;
    const gradeDistribution: Record<string, number> = {};

    for (const record of records) {
      if (record.status === 'in_progress') continue;

      const credits = Number(record.creditHours) || 0;
      const point = Number(record.gradePoint) || 0;
      const weighted = point * credits;

      totalCredits += credits;
      totalWeightedPoints += weighted;

      if (record.percentage >= (gradingSystem.passMarkPercentage || 40)) {
        passedUnits += 1;
      } else {
        failedUnits += 1;
      }

      if (record.grade) {
        gradeDistribution[record.grade] = (gradeDistribution[record.grade] || 0) + 1;
      }
    }

    const rawGpa = totalCredits > 0 ? totalWeightedPoints / totalCredits : 0;
    const roundedGpa = Math.round(rawGpa * 100) / 100;

    return {
      semesterGpa: roundedGpa,
      totalCredits,
      totalWeightedPoints: Math.round(totalWeightedPoints * 100) / 100,
      passedUnits,
      failedUnits,
      gradeDistribution,
    };
  }

  /**
   * Calculate Cumulative GPA across multiple semesters.
   */
  static calculateCumulativeGPA(
    semesters: SemesterSummary[],
    gradingSystem: UniversityGradingSystem
  ): AcademicSummary {
    let totalCreditsCompleted = 0;
    let totalQualityPoints = 0;
    let unitsCompletedCount = 0;
    const gradeDistribution: Record<string, number> = {};
    const allRecords: StudentAcademicRecord[] = [];

    const gpaTrend: {
      semesterId: string;
      semesterName: string;
      academicYearName: string;
      semesterGpa: number;
      cumulativeGpa: number;
    }[] = [];

    for (const sem of semesters) {
      for (const rec of sem.records) {
        if (rec.status !== 'in_progress') {
          allRecords.push(rec);
          unitsCompletedCount += 1;
          const grade = rec.grade;
          if (grade) {
            gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;
          }
        }
      }

      totalCreditsCompleted += sem.totalCredits;
      totalQualityPoints += sem.totalWeightedPoints;

      const runningCumulativeGpa =
        totalCreditsCompleted > 0
          ? Math.round((totalQualityPoints / totalCreditsCompleted) * 100) / 100
          : 0;

      gpaTrend.push({
        semesterId: sem.semesterId,
        semesterName: sem.semesterName,
        academicYearName: sem.academicYearName,
        semesterGpa: sem.semesterGpa,
        cumulativeGpa: runningCumulativeGpa,
      });
    }

    const cumulativeGpa =
      totalCreditsCompleted > 0
        ? Math.round((totalQualityPoints / totalCreditsCompleted) * 100) / 100
        : 0;

    const classification = AcademicRulesResolver.resolveClassification(
      cumulativeGpa,
      gradingSystem
    );

    // Sort strongest and weakest units
    const sortedUnits = [...allRecords].sort((a, b) => b.percentage - a.percentage);
    const strongestUnits = sortedUnits.slice(0, 3);
    const weakestUnits = sortedUnits.slice(-3).reverse();

    return {
      cumulativeGpa,
      totalCreditsCompleted,
      totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
      semestersCount: semesters.length,
      unitsCompletedCount,
      academicClassification: classification,
      semesters,
      gradeDistribution,
      gpaTrend,
      strongestUnits,
      weakestUnits,
    };
  }

  /**
   * Calculate Required Performance for Target GPA:
   * Formula:
   * Target Total Quality Points = Target GPA × (Current Credits + Remaining Credits)
   * Required Future Quality Points = Target Total Quality Points - (Current GPA × Current Credits)
   * Required Future Average GPA = Required Future Quality Points ÷ Remaining Credits
   */
  static calculateTargetGPA(
    currentGpa: number,
    currentCredits: number,
    targetGpa: number,
    remainingCredits: number,
    gradingSystem: UniversityGradingSystem
  ): TargetGpaSimulationResult {
    const maxPoint = gradingSystem.maxPoint || 4.0;
    const curCredits = Math.max(0, currentCredits);
    const remCredits = Math.max(0, remainingCredits);
    const curGpa = Math.max(0, Math.min(maxPoint, currentGpa));
    const tgtGpa = Math.max(0, Math.min(maxPoint, targetGpa));

    if (remCredits === 0) {
      return {
        currentGpa: curGpa,
        currentCredits: curCredits,
        targetGpa: tgtGpa,
        remainingCredits: 0,
        requiredGpa: curGpa,
        isAchievable: curGpa >= tgtGpa,
        maxPossibleGpa: curGpa,
        recommendation:
          curGpa >= tgtGpa
            ? 'Target already met with completed credits.'
            : 'No remaining credits to change cumulative GPA.',
        suggestedGradesBreakdown: [],
      };
    }

    const currentPoints = curGpa * curCredits;
    const totalCreditsFuture = curCredits + remCredits;
    const targetTotalPoints = tgtGpa * totalCreditsFuture;
    const requiredFuturePoints = targetTotalPoints - currentPoints;

    const rawRequiredGpa = requiredFuturePoints / remCredits;
    const requiredGpa = Math.round(rawRequiredGpa * 100) / 100;

    const maxFuturePoints = maxPoint * remCredits;
    const maxPossiblePoints = currentPoints + maxFuturePoints;
    const maxPossibleGpa = Math.round((maxPossiblePoints / totalCreditsFuture) * 100) / 100;

    const isAchievable = requiredGpa <= maxPoint && requiredGpa >= 0;

    let recommendation = '';
    if (!isAchievable && requiredGpa > maxPoint) {
      recommendation = `Target of ${tgtGpa.toFixed(2)} is mathematically unachievable. Even with straight highest grades (${maxPoint.toFixed(1)}), your maximum cumulative GPA will reach ${maxPossibleGpa.toFixed(2)}.`;
    } else if (requiredGpa <= 0) {
      recommendation = `Target is already secured! Even with passing minimums, your cumulative GPA will remain above ${tgtGpa.toFixed(2)}.`;
    } else if (requiredGpa >= (maxPoint * 0.9)) {
      recommendation = `Requires exceptional performance. You must average ~${requiredGpa.toFixed(2)} GPA across all ${remCredits} remaining credits (primarily top grades).`;
    } else if (requiredGpa >= (maxPoint * 0.75)) {
      recommendation = `Strongly achievable with consistent upper-tier coursework. Aim for an average of ${requiredGpa.toFixed(2)} in remaining credits.`;
    } else {
      recommendation = `Comfortably within reach. Maintain an average GPA of ${requiredGpa.toFixed(2)} to secure your target.`;
    }

    // Build suggested grades distribution
    const suggestedGradesBreakdown = this.generateSuggestedGradeMix(
      requiredGpa,
      remCredits,
      gradingSystem
    );

    return {
      currentGpa: curGpa,
      currentCredits: curCredits,
      targetGpa: tgtGpa,
      remainingCredits: remCredits,
      requiredGpa: Math.max(0, requiredGpa),
      isAchievable,
      maxPossibleGpa,
      recommendation,
      suggestedGradesBreakdown,
    };
  }

  /**
   * Helper to construct realistic unit-grade combinations for a target GPA.
   */
  private static generateSuggestedGradeMix(
    requiredGpa: number,
    remainingCredits: number,
    gradingSystem: UniversityGradingSystem
  ): { grade: string; estimatedUnits: number; gradePoint: number }[] {
    const avgCreditsPerUnit = 3;
    const estimatedTotalUnits = Math.max(1, Math.round(remainingCredits / avgCreditsPerUnit));

    const rules = [...gradingSystem.gradeRules].sort((a, b) => b.gradePoint - a.gradePoint);
    if (rules.length === 0) return [];

    if (requiredGpa > rules[0].gradePoint) {
      return [{ grade: rules[0].grade, estimatedUnits: estimatedTotalUnits, gradePoint: rules[0].gradePoint }];
    }

    // Find nearest primary rules
    const topRule = rules[0];
    const secondRule = rules[1] || rules[0];

    const pointDiff = topRule.gradePoint - secondRule.gradePoint;
    if (pointDiff <= 0) {
      return [{ grade: topRule.grade, estimatedUnits: estimatedTotalUnits, gradePoint: topRule.gradePoint }];
    }

    // Linear mix formula: unitsA * topPoint + unitsB * secondPoint = totalUnits * requiredGpa
    const ratioTop = Math.min(1, Math.max(0, (requiredGpa - secondRule.gradePoint) / pointDiff));
    const countTop = Math.round(estimatedTotalUnits * ratioTop);
    const countSecond = estimatedTotalUnits - countTop;

    const breakdown: { grade: string; estimatedUnits: number; gradePoint: number }[] = [];
    if (countTop > 0) {
      breakdown.push({ grade: topRule.grade, estimatedUnits: countTop, gradePoint: topRule.gradePoint });
    }
    if (countSecond > 0) {
      breakdown.push({ grade: secondRule.grade, estimatedUnits: countSecond, gradePoint: secondRule.gradePoint });
    }

    return breakdown;
  }

  /**
   * "What If" Simulation scenarios: Projected Cumulative GPA if student obtains specific grade distributions.
   */
  static simulateWhatIfScenarios(
    currentGpa: number,
    currentCredits: number,
    remainingCredits: number,
    gradingSystem: UniversityGradingSystem
  ): WhatIfScenario[] {
    const curCredits = Math.max(0, currentCredits);
    const remCredits = Math.max(0, remainingCredits);
    const totalCredits = curCredits + remCredits;
    const currentPoints = currentGpa * curCredits;

    if (totalCredits === 0) return [];

    const scenarios: WhatIfScenario[] = [];
    const standardGrades = gradingSystem.gradeRules;

    for (const rule of standardGrades) {
      const futurePoints = rule.gradePoint * remCredits;
      const totalPoints = currentPoints + futurePoints;
      const projectedGpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;
      const diff = Math.round((projectedGpa - currentGpa) * 100) / 100;

      scenarios.push({
        id: `whatif_${rule.grade}`,
        title: `All ${rule.grade}'s in Remaining Units`,
        description: `Assuming a ${rule.gradePoint.toFixed(1)} average across ${remCredits} remaining credits (${rule.description})`,
        assumedGrade: rule.grade,
        assumedGradePoint: rule.gradePoint,
        remainingCredits: remCredits,
        projectedCumulativeGpa: projectedGpa,
        gpaDifference: diff,
      });
    }

    return scenarios;
  }
}
