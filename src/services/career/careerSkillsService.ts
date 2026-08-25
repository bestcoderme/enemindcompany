/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Career,
  SkillLevel,
  StudentSkillRecord,
  SkillGapAnalysis,
  LearningResource,
} from '../../types/career';

const STORAGE_KEY_STUDENT_SKILLS = 'enemind_student_skills_v4';

export class CareerSkillsService {
  private static getStoredSkills(): Record<string, StudentSkillRecord[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENT_SKILLS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse student skills', e);
    }
    return {};
  }

  private static saveStoredSkills(map: Record<string, StudentSkillRecord[]>): void {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT_SKILLS, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save student skills', e);
    }
  }

  public static getStudentSkills(studentEmail: string): StudentSkillRecord[] {
    const map = this.getStoredSkills();
    const emailKey = studentEmail.toLowerCase();
    if (map[emailKey] && map[emailKey].length > 0) {
      return map[emailKey];
    }

    // Default initial seed for student
    const defaultSkills: StudentSkillRecord[] = [
      {
        skillName: 'Problem Solving & Critical Thinking',
        level: 'competent',
        verified: true,
        lastUpdated: new Date().toISOString(),
      },
      {
        skillName: 'Python Programming',
        level: 'practicing',
        verified: false,
        evidenceNotes: 'Completed university coursework lab assignments',
        lastUpdated: new Date().toISOString(),
      },
      {
        skillName: 'SQL Database Basics',
        level: 'learning',
        verified: false,
        lastUpdated: new Date().toISOString(),
      },
    ];

    map[emailKey] = defaultSkills;
    this.saveStoredSkills(map);
    return defaultSkills;
  }

  public static updateSkillLevel(
    studentEmail: string,
    skillName: string,
    level: SkillLevel,
    evidenceNotes?: string
  ): StudentSkillRecord {
    const map = this.getStoredSkills();
    const emailKey = studentEmail.toLowerCase();
    const skills = map[emailKey] || [];

    const existingIdx = skills.findIndex(
      (s) => s.skillName.toLowerCase() === skillName.toLowerCase()
    );

    let updated: StudentSkillRecord;
    const now = new Date().toISOString();

    if (existingIdx >= 0) {
      updated = {
        ...skills[existingIdx],
        level,
        evidenceNotes: evidenceNotes !== undefined ? evidenceNotes : skills[existingIdx].evidenceNotes,
        lastUpdated: now,
      };
      skills[existingIdx] = updated;
    } else {
      updated = {
        skillName,
        level,
        verified: false,
        evidenceNotes: evidenceNotes || '',
        lastUpdated: now,
      };
      skills.unshift(updated);
    }

    map[emailKey] = skills;
    this.saveStoredSkills(map);
    return updated;
  }

  public static deleteStudentSkill(studentEmail: string, skillName: string): boolean {
    const map = this.getStoredSkills();
    const emailKey = studentEmail.toLowerCase();
    const skills = map[emailKey] || [];
    const filtered = skills.filter((s) => s.skillName.toLowerCase() !== skillName.toLowerCase());

    if (filtered.length === skills.length) return false;
    map[emailKey] = filtered;
    this.saveStoredSkills(map);
    return true;
  }

  public static analyzeSkillGap(career: Career, studentEmail: string): SkillGapAnalysis {
    const studentSkills = this.getStudentSkills(studentEmail);

    const masteredSkills: string[] = [];
    const inProgressSkills: string[] = [];
    const missingRequiredSkills: string[] = [];
    const missingRecommendedSkills: string[] = [];

    // Check required skills
    career.requiredSkills.forEach((reqSkill) => {
      const match = studentSkills.find((s) =>
        s.skillName.toLowerCase().includes(reqSkill.toLowerCase()) ||
        reqSkill.toLowerCase().includes(s.skillName.toLowerCase())
      );

      if (match) {
        if (match.level === 'competent' || match.level === 'advanced') {
          masteredSkills.push(reqSkill);
        } else if (match.level === 'learning' || match.level === 'practicing') {
          inProgressSkills.push(reqSkill);
        } else {
          missingRequiredSkills.push(reqSkill);
        }
      } else {
        missingRequiredSkills.push(reqSkill);
      }
    });

    // Check recommended skills
    career.recommendedSkills.forEach((recSkill) => {
      const match = studentSkills.find((s) =>
        s.skillName.toLowerCase().includes(recSkill.toLowerCase()) ||
        recSkill.toLowerCase().includes(s.skillName.toLowerCase())
      );

      if (match) {
        if (match.level === 'competent' || match.level === 'advanced') {
          masteredSkills.push(recSkill);
        } else if (match.level === 'learning' || match.level === 'practicing') {
          inProgressSkills.push(recSkill);
        } else {
          missingRecommendedSkills.push(recSkill);
        }
      } else {
        missingRecommendedSkills.push(recSkill);
      }
    });

    const totalRequired = career.requiredSkills.length;
    const coveredWeight =
      masteredSkills.filter((s) => career.requiredSkills.includes(s)).length * 1.0 +
      inProgressSkills.filter((s) => career.requiredSkills.includes(s)).length * 0.5;

    const readinessPercentage =
      totalRequired > 0 ? Math.min(100, Math.round((coveredWeight / totalRequired) * 100)) : 50;

    // Next recommended skill
    let nextRecommendedSkill: SkillGapAnalysis['nextRecommendedSkill'] = null;
    const nextSkillName = missingRequiredSkills[0] || missingRecommendedSkills[0] || null;

    if (nextSkillName) {
      const relevantResources: LearningResource[] = career.learningResources.filter(
        (r) =>
          r.skillTaught.toLowerCase().includes(nextSkillName.toLowerCase()) ||
          nextSkillName.toLowerCase().includes(r.skillTaught.toLowerCase())
      );

      nextRecommendedSkill = {
        skillName: nextSkillName,
        whyPriority: `Core foundation requirement for ${career.title} entry roles and technical interviews.`,
        difficulty: 'Intermediate',
        suggestedResources: relevantResources.length > 0 ? relevantResources : career.learningResources.slice(0, 2),
      };
    }

    return {
      careerId: career.id,
      careerTitle: career.title,
      readinessPercentage,
      masteredSkills,
      inProgressSkills,
      missingRequiredSkills,
      missingRecommendedSkills,
      nextRecommendedSkill,
    };
  }
}
