/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NextBestAction } from '../../types/career';
import { UserProfile } from '../../types/user';
import { CareerAssessmentService } from './careerAssessmentService';
import { CareerGoalService } from './careerGoalService';
import { CareerSkillsService } from './careerSkillsService';
import { CareerProjectService } from './careerProjectService';
import { CareerService } from './careerService';

export class NextBestActionService {
  public static getNextBestActions(user: UserProfile | null): NextBestAction[] {
    const studentEmail = user?.email || 'guest@enemind.org';
    const actions: NextBestAction[] = [];

    // Check 1: Assessment status
    const latestAssessment = CareerAssessmentService.getLatestAssessment(studentEmail);
    if (!latestAssessment) {
      actions.push({
        id: 'nba-assessment',
        title: 'Complete Career Discovery Assessment',
        description: 'Take the 5-minute multi-signal career assessment to discover personalized paths tailored to your strengths and degree.',
        category: 'assessment',
        priority: 'high',
        actionLabel: 'Take Assessment',
        actionTargetView: 'career-assessment',
      });
    }

    // Check 2: Active Goal & Roadmap
    const activeGoal = CareerGoalService.getActiveGoal(studentEmail);
    if (!activeGoal) {
      actions.push({
        id: 'nba-set-goal',
        title: 'Set Primary Target Career Goal',
        description: 'Choose your desired graduation career to unlock customized roadmaps, milestone tasks, and skills analysis.',
        category: 'goal',
        priority: 'high',
        actionLabel: 'Explore Careers',
        actionTargetView: 'career-explorer',
      });
    } else {
      // Check for uncompleted tasks in active roadmap
      const uncompletedTask = activeGoal.roadmapTasks.find((t) => !t.isCompleted);
      if (uncompletedTask) {
        actions.push({
          id: `nba-task-${uncompletedTask.id}`,
          title: `Next Milestone: ${uncompletedTask.title}`,
          description: uncompletedTask.description,
          category: 'goal',
          priority: 'high',
          actionLabel: 'Open Roadmap',
          actionTargetView: 'career-roadmap',
          actionContext: { taskId: uncompletedTask.id, goalId: activeGoal.id },
        });
      }

      // Check 3: Skill Gap Analysis
      const career = CareerService.getCareerById(activeGoal.careerId);
      if (career) {
        const gap = CareerSkillsService.analyzeSkillGap(career, studentEmail);
        if (gap.nextRecommendedSkill) {
          actions.push({
            id: `nba-skill-${gap.nextRecommendedSkill.skillName}`,
            title: `Learn High-Priority Skill: ${gap.nextRecommendedSkill.skillName}`,
            description: gap.nextRecommendedSkill.whyPriority,
            category: 'skill',
            priority: 'medium',
            actionLabel: 'View Learning Resources',
            actionTargetView: 'career-skills',
            actionContext: { skillName: gap.nextRecommendedSkill.skillName },
          });
        }
      }
    }

    // Check 4: Project Portfolio Building
    const projects = CareerProjectService.getStudentProjects(studentEmail);
    const inProgressProject = projects.find((p) => p.status === 'in_progress');
    const completedProjects = projects.filter((p) => p.status === 'completed');

    if (inProgressProject) {
      actions.push({
        id: `nba-proj-finish-${inProgressProject.id}`,
        title: `Continue Project: ${inProgressProject.title}`,
        description: 'Add GitHub code or deploy live demo to showcase this project on your verified career portfolio.',
        category: 'project',
        priority: 'medium',
        actionLabel: 'View Project Lab',
        actionTargetView: 'career-projects',
      });
    } else if (completedProjects.length === 0) {
      actions.push({
        id: 'nba-proj-start',
        title: 'Start First Practical Portfolio Project',
        description: 'Employers and fellowship boards prioritize verifiable proof-of-work over paper qualifications.',
        category: 'project',
        priority: 'medium',
        actionLabel: 'Browse Projects',
        actionTargetView: 'career-projects',
      });
    }

    // Check 5: Opportunity Discovery
    actions.push({
      id: 'nba-opps',
      title: 'Discover Aligned Attachments & Scholarships',
      description: 'Check newly verified industrial attachments and internship openings matching your degree level and GPA.',
      category: 'opportunity',
      priority: 'low',
      actionLabel: 'Browse Opportunities',
      actionTargetView: 'opportunities',
    });

    // Return top 3 prioritized actions
    return actions.slice(0, 3);
  }
}
