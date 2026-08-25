/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Career,
  CareerGoal,
  CareerRoadmap,
  RoadmapStageType,
  RoadmapTask,
  EmploymentPathway,
} from '../../types/career';
import { CareerService } from './careerService';

const STORAGE_KEY_CAREER_GOALS = 'enemind_career_goals_v4';

export class CareerGoalService {
  private static getStoredGoals(): CareerGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CAREER_GOALS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse career goals', e);
    }
    return [];
  }

  private static saveStoredGoals(goals: CareerGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_CAREER_GOALS, JSON.stringify(goals));
    } catch (e) {
      console.error('Failed to save career goals', e);
    }
  }

  public static generateRoadmapForCareer(career: Career): RoadmapTask[] {
    const tasks: RoadmapTask[] = [];

    // Stage 1: Foundation
    tasks.push({
      id: `task-${career.id}-1`,
      title: 'Master Academic Foundations & Prerequisites',
      description: `Excel in related coursework (${career.relatedSubjects.slice(0, 2).join(', ')}) with solid GPA.`,
      stage: 'foundation',
      stageLabel: 'Stage 1 — Foundation',
      isCompleted: true,
      completedAt: new Date().toISOString(),
    });

    // Stage 2: Technical Skills
    if (career.requiredSkills.length > 0) {
      tasks.push({
        id: `task-${career.id}-2`,
        title: `Learn Core Skill: ${career.requiredSkills[0]}`,
        description: `Complete foundational tutorials, documentation, and exercise sets for ${career.requiredSkills[0]}.`,
        stage: 'technical_skills',
        stageLabel: 'Stage 2 — Technical Skills',
        isCompleted: true,
        relatedSkill: career.requiredSkills[0],
      });
    }

    if (career.requiredSkills.length > 1) {
      tasks.push({
        id: `task-${career.id}-3`,
        title: `Learn Core Skill: ${career.requiredSkills[1]}`,
        description: `Build practical familiarity with ${career.requiredSkills[1]} through guided examples.`,
        stage: 'technical_skills',
        stageLabel: 'Stage 2 — Technical Skills',
        isCompleted: false,
        relatedSkill: career.requiredSkills[1],
      });
    }

    // Stage 3: Projects
    const firstProject = career.projectTemplates[0];
    tasks.push({
      id: `task-${career.id}-4`,
      title: firstProject ? `Build Project: ${firstProject.title}` : 'Develop First Practical Portfolio Project',
      description: firstProject ? firstProject.description : 'Create a working, documented technical artifact.',
      stage: 'projects',
      stageLabel: 'Stage 3 — Projects',
      isCompleted: false,
    });

    const secondProject = career.projectTemplates[1];
    if (secondProject) {
      tasks.push({
        id: `task-${career.id}-5`,
        title: `Build Advanced Project: ${secondProject.title}`,
        description: secondProject.description,
        stage: 'projects',
        stageLabel: 'Stage 3 — Projects',
        isCompleted: false,
      });
    }

    // Stage 4: Portfolio & Certifications
    tasks.push({
      id: `task-${career.id}-6`,
      title: 'Construct Verified Career Portfolio & Technical CV',
      description: 'Document your completed projects, GitHub code links, and academic credentials in Enemind Portfolio.',
      stage: 'portfolio',
      stageLabel: 'Stage 4 — Portfolio',
      isCompleted: false,
    });

    if (career.certifications.length > 0) {
      tasks.push({
        id: `task-${career.id}-7`,
        title: `Prepare for Certification: ${career.certifications[0].name}`,
        description: career.certifications[0].description,
        stage: 'portfolio',
        stageLabel: 'Stage 4 — Portfolio',
        isCompleted: false,
      });
    }

    // Stage 5: Experience
    tasks.push({
      id: `task-${career.id}-8`,
      title: 'Apply for Industrial Attachment or Summer Internship',
      description: 'Search Enemind Discovery Engine for verified attachment opportunities in relevant industries.',
      stage: 'experience',
      stageLabel: 'Stage 5 — Experience',
      isCompleted: false,
    });

    // Stage 6: Employment / Entrepreneurship
    tasks.push({
      id: `task-${career.id}-9`,
      title: `Secure Entry Role (${career.entryLevelRoles[0] || 'Associate Role'}) or Launch Venture`,
      description: 'Interview for graduate development programs or deploy your independent product/consultancy.',
      stage: 'employment_entrepreneurship',
      stageLabel: 'Stage 6 — Employment / Venture',
      isCompleted: false,
    });

    return tasks;
  }

  public static getGoals(studentEmail: string): CareerGoal[] {
    const all = this.getStoredGoals();
    const studentGoals = all.filter(
      (g) => g.studentEmail.toLowerCase() === studentEmail.toLowerCase()
    );

    if (studentGoals.length === 0) {
      // Auto-create default primary goal if none exists
      const defaultCareer = CareerService.getAllCareers()[0];
      if (defaultCareer) {
        const goal = this.createGoal(
          studentEmail,
          defaultCareer.id,
          'Corporate Employment',
          '2027-12-31',
          'Targeting graduate developer opportunities after campus.'
        );
        return [goal];
      }
    }

    return studentGoals;
  }

  public static getActiveGoal(studentEmail: string): CareerGoal | null {
    const goals = this.getGoals(studentEmail);
    const primary = goals.find((g) => g.isPrimary && g.status === 'active');
    return primary || goals.find((g) => g.status === 'active') || goals[0] || null;
  }

  public static createGoal(
    studentEmail: string,
    careerId: string,
    targetPathway: EmploymentPathway = 'Corporate Employment',
    targetDate: string = '2028-06-30',
    notes: string = ''
  ): CareerGoal {
    const career = CareerService.getCareerById(careerId) || CareerService.getAllCareers()[0];
    const roadmapTasks = this.generateRoadmapForCareer(career);
    const now = new Date().toISOString();

    const allGoals = this.getStoredGoals();
    // Demote any existing primary goals for this student
    allGoals.forEach((g) => {
      if (g.studentEmail.toLowerCase() === studentEmail.toLowerCase()) {
        g.isPrimary = false;
      }
    });

    const newGoal: CareerGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      studentEmail: studentEmail.toLowerCase(),
      careerId: career.id,
      careerTitle: career.title,
      targetDate,
      status: 'active',
      isPrimary: true,
      targetPathway,
      notes,
      roadmapTasks,
      createdAt: now,
      updatedAt: now,
    };

    allGoals.unshift(newGoal);
    this.saveStoredGoals(allGoals);
    return newGoal;
  }

  public static setPrimaryGoal(studentEmail: string, goalId: string): boolean {
    const allGoals = this.getStoredGoals();
    const emailKey = studentEmail.toLowerCase();

    allGoals.forEach((g) => {
      if (g.studentEmail.toLowerCase() === emailKey) {
        g.isPrimary = g.id === goalId;
        g.updatedAt = new Date().toISOString();
      }
    });

    this.saveStoredGoals(allGoals);
    return true;
  }

  public static toggleTaskCompletion(
    studentEmail: string,
    goalId: string,
    taskId: string
  ): CareerGoal | null {
    const allGoals = this.getStoredGoals();
    const goal = allGoals.find(
      (g) => g.id === goalId && g.studentEmail.toLowerCase() === studentEmail.toLowerCase()
    );

    if (!goal) return null;

    const task = goal.roadmapTasks.find((t) => t.id === taskId);
    if (!task) return null;

    task.isCompleted = !task.isCompleted;
    task.completedAt = task.isCompleted ? new Date().toISOString() : undefined;
    goal.updatedAt = new Date().toISOString();

    this.saveStoredGoals(allGoals);
    return goal;
  }

  public static deleteGoal(studentEmail: string, goalId: string): boolean {
    const allGoals = this.getStoredGoals();
    const emailKey = studentEmail.toLowerCase();
    const filtered = allGoals.filter((g) => !(g.id === goalId && g.studentEmail.toLowerCase() === emailKey));

    if (filtered.length === allGoals.length) return false;
    this.saveStoredGoals(filtered);
    return true;
  }

  public static getRoadmapStructure(goal: CareerGoal): CareerRoadmap {
    const stages: {
      stage: RoadmapStageType;
      stageLabel: string;
      stageNumber: number;
      description: string;
    }[] = [
      { stage: 'foundation', stageLabel: 'Stage 1 — Foundation', stageNumber: 1, description: 'Core academic courses, fundamentals, and mindset.' },
      { stage: 'technical_skills', stageLabel: 'Stage 2 — Technical Skills', stageNumber: 2, description: 'Industry-standard tool mastery and programming/instrumentation.' },
      { stage: 'projects', stageLabel: 'Stage 3 — Applied Projects', stageNumber: 3, description: 'Building real, functional portfolio artifacts and solutions.' },
      { stage: 'portfolio', stageLabel: 'Stage 4 — Portfolio & Credentials', stageNumber: 4, description: 'Proof of work, professional CV, and recognized certifications.' },
      { stage: 'experience', stageLabel: 'Stage 5 — Industry Experience', stageNumber: 5, description: 'Industrial attachments, internships, and freelance commissions.' },
      { stage: 'employment_entrepreneurship', stageLabel: 'Stage 6 — Employment / Venture', stageNumber: 6, description: 'Entering professional employment or launching an enterprise.' },
    ];

    const mappedStages = stages.map((s) => {
      const stageTasks = goal.roadmapTasks.filter((t) => t.stage === s.stage);
      const isComplete = stageTasks.length > 0 && stageTasks.every((t) => t.isCompleted);
      return {
        ...s,
        tasks: stageTasks,
        isStageComplete: isComplete,
      };
    });

    const totalTasks = goal.roadmapTasks.length;
    const completedTasks = goal.roadmapTasks.filter((t) => t.isCompleted).length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      careerId: goal.careerId,
      careerTitle: goal.careerTitle,
      stages: mappedStages,
      totalTasks,
      completedTasks,
      progressPercentage,
    };
  }
}
