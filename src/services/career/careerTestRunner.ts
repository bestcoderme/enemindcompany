/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CareerService } from './careerService';
import { CareerAssessmentService } from './careerAssessmentService';
import { CareerMatchingService } from './careerMatchingService';
import { CareerSkillsService } from './careerSkillsService';
import { CareerGoalService } from './careerGoalService';
import { CareerProjectService } from './careerProjectService';
import { NextBestActionService } from './nextBestActionService';

export interface CareerTestCaseResult {
  id: string;
  name: string;
  category: string;
  status: 'passed' | 'failed';
  durationMs: number;
  details: string;
}

export interface CareerTestSuiteReport {
  timestamp: string;
  totalTests: number;
  passedCount: number;
  failedCount: number;
  successRate: number;
  results: CareerTestCaseResult[];
}

export class CareerTestRunner {
  public static runAllTests(): CareerTestSuiteReport {
    const results: CareerTestCaseResult[] = [];
    const startTime = Date.now();

    const testEmail = 'career.test.student@enemind.org';

    // Test 1: Career Retrieval & Catalog
    try {
      const tStart = Date.now();
      const careers = CareerService.getAllCareers();
      if (careers.length >= 5) {
        results.push({
          id: 'test-1-catalog',
          name: 'Career Catalog Retrieval',
          category: 'Catalog',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Retrieved ${careers.length} career pathways with complete salary, skill, and roadmap metadata.`,
        });
      } else {
        throw new Error(`Insufficient career catalog count: ${careers.length}`);
      }
    } catch (e: any) {
      results.push({
        id: 'test-1-catalog',
        name: 'Career Catalog Retrieval',
        category: 'Catalog',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 2: Search & Filter Capabilities
    try {
      const tStart = Date.now();
      const searchRes = CareerService.searchCareers('PLC Programming');
      const filtered = CareerService.filterCareers({ category: 'Engineering' });

      const hasAuto = searchRes.some((c) => c.id === 'automation-engineer');
      const hasEng = filtered.length > 0 && filtered.every((c) => c.category === 'Engineering');

      if (hasAuto && hasEng) {
        results.push({
          id: 'test-2-search-filter',
          name: 'Career Search & Multi-Category Filter',
          category: 'Search',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Successfully searched by skill token and filtered by Engineering category.`,
        });
      } else {
        throw new Error('Search or filter result mismatch');
      }
    } catch (e: any) {
      results.push({
        id: 'test-2-search-filter',
        name: 'Career Search & Multi-Category Filter',
        category: 'Search',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 3: Multi-Signal Assessment Submission
    try {
      const tStart = Date.now();
      const answers = {
        1: 'opt-1-tech',
        2: 'opt-2-analytical',
        3: 'opt-3-remote',
        4: 'opt-4-code',
        5: 'opt-5-global',
      };

      const attempt = CareerAssessmentService.submitAssessment(testEmail, answers);

      if (attempt.categoryScores.Technology > 0 && attempt.declaredPreferences.includes('Remote-Oriented')) {
        results.push({
          id: 'test-3-assessment',
          name: 'Multi-Signal Assessment Scoring',
          category: 'Assessment',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Computed category weights (Tech: ${attempt.categoryScores.Technology}) and extracted preferences.`,
        });
      } else {
        throw new Error('Assessment signal extraction failed');
      }
    } catch (e: any) {
      results.push({
        id: 'test-3-assessment',
        name: 'Multi-Signal Assessment Scoring',
        category: 'Assessment',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 4: Career Matching & Transparent Explanation
    try {
      const tStart = Date.now();
      const profile = {
        email: testEmail,
        programmeName: 'BSc. Computer Science',
        facultyName: 'School of Computing',
        universityName: 'Technical University',
        yearOfStudy: 'Year 3',
        declaredSkills: ['JavaScript / TypeScript', 'SQL & Database Design'],
        interests: ['Technology', 'Software'],
        cumulativeGpa: 3.8,
      };

      const attempt = CareerAssessmentService.getLatestAssessment(testEmail);
      const careers = CareerService.getAllCareers();
      const matches = CareerMatchingService.matchAllCareers(careers, profile, attempt);

      const topMatch = matches[0];
      if (topMatch && topMatch.matchScore >= 70 && topMatch.factors.length > 0) {
        results.push({
          id: 'test-4-matching',
          name: 'Career Recommendation & Explanation Engine',
          category: 'Matching',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Ranked top match (${topMatch.career.title}) with score ${topMatch.matchScore}% and transparent factor breakdown.`,
        });
      } else {
        throw new Error('Top match calculation failed or explanation missing');
      }
    } catch (e: any) {
      results.push({
        id: 'test-4-matching',
        name: 'Career Recommendation & Explanation Engine',
        category: 'Matching',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 5: Skill Gap Analysis
    try {
      const tStart = Date.now();
      const career = CareerService.getCareerById('automation-engineer');
      if (career) {
        CareerSkillsService.updateSkillLevel(testEmail, 'Electrical Circuits & Schematics', 'competent');
        const gap = CareerSkillsService.analyzeSkillGap(career, testEmail);

        if (gap.masteredSkills.length > 0 && gap.nextRecommendedSkill) {
          results.push({
            id: 'test-5-skill-gap',
            name: 'Skill Gap & Readiness Analysis',
            category: 'Skills',
            status: 'passed',
            durationMs: Date.now() - tStart,
            details: `Identified ${gap.masteredSkills.length} mastered skill(s) and recommended next skill: ${gap.nextRecommendedSkill.skillName}.`,
          });
        } else {
          throw new Error('Skill gap analysis output incomplete');
        }
      } else {
        throw new Error('Target career not found');
      }
    } catch (e: any) {
      results.push({
        id: 'test-5-skill-gap',
        name: 'Skill Gap & Readiness Analysis',
        category: 'Skills',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 6: 6-Stage Roadmap Generation
    try {
      const tStart = Date.now();
      const career = CareerService.getCareerById('software-engineer')!;
      const roadmapTasks = CareerGoalService.generateRoadmapForCareer(career);

      const hasFoundation = roadmapTasks.some((t) => t.stage === 'foundation');
      const hasSkills = roadmapTasks.some((t) => t.stage === 'technical_skills');
      const hasProjects = roadmapTasks.some((t) => t.stage === 'projects');
      const hasPortfolio = roadmapTasks.some((t) => t.stage === 'portfolio');
      const hasExp = roadmapTasks.some((t) => t.stage === 'experience');
      const hasJob = roadmapTasks.some((t) => t.stage === 'employment_entrepreneurship');

      if (hasFoundation && hasSkills && hasProjects && hasPortfolio && hasExp && hasJob) {
        results.push({
          id: 'test-6-roadmap',
          name: '6-Stage Career Development Roadmap Generator',
          category: 'Roadmap',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Generated complete 6-stage milestone progression with ${roadmapTasks.length} structured tasks.`,
        });
      } else {
        throw new Error('Incomplete stages in generated roadmap');
      }
    } catch (e: any) {
      results.push({
        id: 'test-6-roadmap',
        name: '6-Stage Career Development Roadmap Generator',
        category: 'Roadmap',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 7: Goal Progression & Task Completion
    try {
      const tStart = Date.now();
      const goal = CareerGoalService.createGoal(
        testEmail,
        'software-engineer',
        'Corporate Employment',
        '2028-06-30'
      );

      const taskId = goal.roadmapTasks[1].id;
      const updatedGoal = CareerGoalService.toggleTaskCompletion(testEmail, goal.id, taskId);

      const structure = CareerGoalService.getRoadmapStructure(updatedGoal!);
      if (structure.completedTasks >= 2 && structure.progressPercentage > 0) {
        results.push({
          id: 'test-7-goal-progress',
          name: 'Career Goal Progress & Task Toggling',
          category: 'Goals',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Updated task completion status and computed ${structure.progressPercentage}% roadmap progress.`,
        });
      } else {
        throw new Error('Goal progress calculation mismatch');
      }
    } catch (e: any) {
      results.push({
        id: 'test-7-goal-progress',
        name: 'Career Goal Progress & Task Toggling',
        category: 'Goals',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 8: Student Project Management
    try {
      const tStart = Date.now();
      const proj = CareerProjectService.startProjectFromTemplate(
        testEmail,
        'software-engineer',
        'proj-swe-1'
      );

      if (proj && proj.status === 'in_progress') {
        const completed = CareerProjectService.completeProject(
          testEmail,
          proj.id,
          'https://github.com/enemind/test-proj',
          'https://test.demo.app'
        );

        if (completed && completed.status === 'completed' && completed.githubUrl) {
          results.push({
            id: 'test-8-projects',
            name: 'Project Lab Lifecycle Management',
            category: 'Projects',
            status: 'passed',
            durationMs: Date.now() - tStart,
            details: `Started project template and transitioned to completed state with verified artifact URLs.`,
          });
        } else {
          throw new Error('Project completion update failed');
        }
      } else {
        throw new Error('Project template start failed');
      }
    } catch (e: any) {
      results.push({
        id: 'test-8-projects',
        name: 'Project Lab Lifecycle Management',
        category: 'Projects',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 9: Career Comparison Matrix
    try {
      const tStart = Date.now();
      const comparison = CareerService.compareCareers(['software-engineer', 'data-analyst']);

      if (
        comparison.careers.length === 2 &&
        comparison.skillOverlap.length > 0 &&
        comparison.salaryComparison['software-engineer']
      ) {
        results.push({
          id: 'test-9-comparison',
          name: 'Multi-Career Side-by-Side Comparison',
          category: 'Comparison',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Evaluated skill overlap (${comparison.skillOverlap.join(', ')}) and regional compensation.`,
        });
      } else {
        throw new Error('Career comparison matrix evaluation failed');
      }
    } catch (e: any) {
      results.push({
        id: 'test-9-comparison',
        name: 'Multi-Career Side-by-Side Comparison',
        category: 'Comparison',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    // Test 10: Next Best Action Engine
    try {
      const tStart = Date.now();
      const actions = NextBestActionService.getNextBestActions({
        email: testEmail,
        name: 'Test Student',
      } as any);

      if (actions.length > 0 && actions.length <= 3 && actions[0].title) {
        results.push({
          id: 'test-10-next-action',
          name: 'Next Best Action Recommendation Engine',
          category: 'Recommendations',
          status: 'passed',
          durationMs: Date.now() - tStart,
          details: `Synthesized prioritized next step: "${actions[0].title}".`,
        });
      } else {
        throw new Error('Next Best Action generation returned empty or excessive actions');
      }
    } catch (e: any) {
      results.push({
        id: 'test-10-next-action',
        name: 'Next Best Action Recommendation Engine',
        category: 'Recommendations',
        status: 'failed',
        durationMs: 0,
        details: e.message,
      });
    }

    const passedCount = results.filter((r) => r.status === 'passed').length;
    const failedCount = results.filter((r) => r.status === 'failed').length;

    return {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passedCount,
      failedCount,
      successRate: Math.round((passedCount / results.length) * 100),
      results,
    };
  }
}
