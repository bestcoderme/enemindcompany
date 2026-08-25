import { University, UniversityGradingSystem, GradeRule } from '../../types';
import { INITIAL_UNIVERSITIES, STANDARD_KENYA_GRADING_4_0, STANDARD_5_0_GRADING } from '../../data/institutions';

export interface AssessmentWeightConfig {
  catMax: number;
  examMax: number;
  catWeight: number;   // e.g. 0.3 (30%)
  examWeight: number;  // e.g. 0.7 (70%)
}

export const DEFAULT_ASSESSMENT_WEIGHTS: AssessmentWeightConfig = {
  catMax: 30,
  examMax: 70,
  catWeight: 0.3,
  examWeight: 0.7,
};

export class AcademicRulesResolver {
  /**
   * Resolve grading system by university, faculty, or programme hierarchy.
   */
  static resolveGradingSystem(
    universityId?: string,
    country?: string,
    programmeId?: string
  ): UniversityGradingSystem {
    if (universityId) {
      const uni = INITIAL_UNIVERSITIES.find((u) => u.id === universityId);
      if (uni?.gradingSystem) {
        return uni.gradingSystem;
      }
    }

    // Default fallback based on country or regional standard
    if (country === 'Nigeria' || country === 'Ghana' || country === 'United Kingdom') {
      return STANDARD_5_0_GRADING;
    }

    // Default Kenyan/US 4.0 Standard
    return STANDARD_KENYA_GRADING_4_0;
  }

  /**
   * Resolve assessment weighting configuration for a programme or course.
   */
  static resolveAssessmentWeights(
    universityId?: string,
    programmeCategory?: string
  ): AssessmentWeightConfig {
    // Practical/Engineering/Medical programmes often use 40% Continuous Assessment / 60% Exam
    if (programmeCategory === 'Health & Sciences' || programmeCategory === 'Engineering') {
      return {
        catMax: 40,
        examMax: 60,
        catWeight: 0.4,
        examWeight: 0.6,
      };
    }

    return DEFAULT_ASSESSMENT_WEIGHTS;
  }

  /**
   * Find the matching GradeRule for a given percentage mark.
   */
  static resolveGradeRule(
    percentageMark: number,
    gradingSystem: UniversityGradingSystem
  ): GradeRule {
    const rounded = Math.round(percentageMark * 10) / 10;
    const rules = [...gradingSystem.gradeRules].sort((a, b) => b.minScore - a.minScore);

    for (const rule of rules) {
      if (rounded >= rule.minScore) {
        return rule;
      }
    }

    // Fallback to lowest rule (e.g. Fail / F)
    return rules[rules.length - 1] || {
      grade: 'F',
      minScore: 0,
      maxScore: 39,
      gradePoint: 0.0,
      description: 'Fail',
    };
  }

  /**
   * Determine the academic honours classification for a cumulative GPA.
   */
  static resolveClassification(
    cumulativeGpa: number,
    gradingSystem: UniversityGradingSystem
  ): string {
    const rules = gradingSystem.classificationRules;
    if (!rules || cumulativeGpa <= 0) {
      return 'Not Yet Graded';
    }

    if (cumulativeGpa >= rules.firstClassMin) {
      return 'First Class Honours';
    }
    if (cumulativeGpa >= rules.secondUpperMin) {
      return 'Second Class Honours (Upper Division)';
    }
    if (cumulativeGpa >= rules.secondLowerMin) {
      return 'Second Class Honours (Lower Division)';
    }
    if (cumulativeGpa >= rules.passMin) {
      return 'Pass Degree';
    }

    return 'Below Pass Threshold';
  }
}
