/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CareerAssessmentQuestion,
  CareerAssessmentAttempt,
  CareerCategory,
} from '../../types/career';
import { INITIAL_ASSESSMENT_QUESTIONS, INITIAL_CAREER_CATEGORIES } from './careerData';

const STORAGE_KEY_ASSESSMENTS = 'enemind_career_assessments_history_v4';

export class CareerAssessmentService {
  public static getQuestions(): CareerAssessmentQuestion[] {
    return INITIAL_ASSESSMENT_QUESTIONS;
  }

  public static getQuestionById(id: number): CareerAssessmentQuestion | null {
    return INITIAL_ASSESSMENT_QUESTIONS.find((q) => q.id === id) || null;
  }

  private static getStoredAttempts(): CareerAssessmentAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ASSESSMENTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse assessment history', e);
    }
    return [];
  }

  private static saveAttempts(attempts: CareerAssessmentAttempt[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_ASSESSMENTS, JSON.stringify(attempts));
    } catch (e) {
      console.error('Failed to save assessment attempts', e);
    }
  }

  public static submitAssessment(
    studentEmail: string,
    selectedOptionIds: Record<number, string | string[]>
  ): CareerAssessmentAttempt {
    const questions = this.getQuestions();
    const categoryScores: Record<CareerCategory, number> = {} as any;

    INITIAL_CAREER_CATEGORIES.forEach((cat) => {
      categoryScores[cat] = 0;
    });

    const declaredStrengths: string[] = [];
    const declaredPreferences: string[] = [];
    const declaredGoals: string[] = [];

    questions.forEach((q) => {
      const chosen = selectedOptionIds[q.id];
      if (!chosen) return;

      const chosenIds = Array.isArray(chosen) ? chosen : [chosen];

      chosenIds.forEach((optId) => {
        const option = q.options.find((o) => o.id === optId);
        if (!option) return;

        // Aggregate category weights
        if (option.categoryWeights) {
          Object.entries(option.categoryWeights).forEach(([cat, weight]) => {
            const categoryKey = cat as CareerCategory;
            if (categoryScores[categoryKey] !== undefined) {
              categoryScores[categoryKey] += weight || 0;
            }
          });
        }

        // Collect signals based on question category
        if (option.traitSignals) {
          if (q.category === 'strengths') {
            declaredStrengths.push(...option.traitSignals);
          } else if (q.category === 'workPreferences') {
            declaredPreferences.push(...option.traitSignals);
          } else if (q.category === 'goals') {
            declaredGoals.push(...option.traitSignals);
          }
        }
      });
    });

    const attempt: CareerAssessmentAttempt = {
      id: `attempt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      studentEmail: studentEmail.toLowerCase(),
      completedAt: new Date().toISOString(),
      selectedOptionIds,
      categoryScores,
      declaredStrengths: Array.from(new Set(declaredStrengths)),
      declaredPreferences: Array.from(new Set(declaredPreferences)),
      declaredGoals: Array.from(new Set(declaredGoals)),
    };

    const existing = this.getStoredAttempts();
    existing.unshift(attempt);
    this.saveAttempts(existing);

    return attempt;
  }

  public static getAssessmentHistory(studentEmail: string): CareerAssessmentAttempt[] {
    const all = this.getStoredAttempts();
    return all.filter((a) => a.studentEmail.toLowerCase() === studentEmail.toLowerCase());
  }

  public static getLatestAssessment(studentEmail: string): CareerAssessmentAttempt | null {
    const history = this.getAssessmentHistory(studentEmail);
    return history.length > 0 ? history[0] : null;
  }

  public static deleteAttempt(id: string): boolean {
    const all = this.getStoredAttempts();
    const filtered = all.filter((a) => a.id !== id);
    if (filtered.length === all.length) return false;
    this.saveAttempts(filtered);
    return true;
  }
}
