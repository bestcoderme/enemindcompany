/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProject, StudentProjectStatus } from '../../types/career';
import { CareerService } from './careerService';

const STORAGE_KEY_STUDENT_PROJECTS = 'enemind_student_projects_v4';

export class CareerProjectService {
  private static getStoredProjects(): Record<string, StudentProject[]> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDENT_PROJECTS);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse student projects', e);
    }
    return {};
  }

  private static saveStoredProjects(map: Record<string, StudentProject[]>): void {
    try {
      localStorage.setItem(STORAGE_KEY_STUDENT_PROJECTS, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save student projects', e);
    }
  }

  public static getStudentProjects(studentEmail: string): StudentProject[] {
    const map = this.getStoredProjects();
    const emailKey = studentEmail.toLowerCase();
    if (map[emailKey] && map[emailKey].length > 0) {
      return map[emailKey];
    }

    // Initial default seed project
    const defaultProject: StudentProject = {
      id: `proj-${Date.now()}-seed`,
      studentEmail: emailKey,
      title: 'University GPA Calculator & Transcript Visualizer',
      description: 'A responsive single-page application built with React and TypeScript to compute semester grade points and cumulative class honors.',
      category: 'Software Engineering',
      difficulty: 'Beginner',
      skillsUsed: ['TypeScript', 'React', 'Tailwind CSS', 'State Management'],
      status: 'completed',
      githubUrl: 'https://github.com/enemind/gpa-engine-prototype',
      liveDemoUrl: 'https://enemind.org/preview',
      startDate: '2026-02-01',
      completedDate: '2026-02-15',
      keyLearnings: 'Learned modular React architecture, state immutability, and responsive CSS grid design.',
      isFeaturedInPortfolio: true,
    };

    map[emailKey] = [defaultProject];
    this.saveStoredProjects(map);
    return [defaultProject];
  }

  public static startProjectFromTemplate(
    studentEmail: string,
    careerId: string,
    templateId: string
  ): StudentProject | null {
    const career = CareerService.getCareerById(careerId);
    if (!career) return null;

    const template = career.projectTemplates.find((t) => t.id === templateId);
    if (!template) return null;

    const map = this.getStoredProjects();
    const emailKey = studentEmail.toLowerCase();
    const list = map[emailKey] || [];

    const newProject: StudentProject = {
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      studentEmail: emailKey,
      title: template.title,
      description: template.description,
      category: career.title,
      careerId: career.id,
      difficulty: template.difficulty,
      skillsUsed: template.skillsPracticed,
      status: 'in_progress',
      startDate: new Date().toISOString().split('T')[0],
      isFeaturedInPortfolio: true,
    };

    list.unshift(newProject);
    map[emailKey] = list;
    this.saveStoredProjects(map);
    return newProject;
  }

  public static createCustomProject(
    studentEmail: string,
    project: Omit<StudentProject, 'id' | 'studentEmail'>
  ): StudentProject {
    const map = this.getStoredProjects();
    const emailKey = studentEmail.toLowerCase();
    const list = map[emailKey] || [];

    const created: StudentProject = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      studentEmail: emailKey,
    };

    list.unshift(created);
    map[emailKey] = list;
    this.saveStoredProjects(map);
    return created;
  }

  public static updateProject(
    studentEmail: string,
    projectId: string,
    updates: Partial<StudentProject>
  ): StudentProject | null {
    const map = this.getStoredProjects();
    const emailKey = studentEmail.toLowerCase();
    const list = map[emailKey] || [];
    const idx = list.findIndex((p) => p.id === projectId);

    if (idx === -1) return null;

    const updated = {
      ...list[idx],
      ...updates,
    };

    list[idx] = updated;
    map[emailKey] = list;
    this.saveStoredProjects(map);
    return updated;
  }

  public static completeProject(
    studentEmail: string,
    projectId: string,
    githubUrl?: string,
    liveDemoUrl?: string,
    keyLearnings?: string
  ): StudentProject | null {
    return this.updateProject(studentEmail, projectId, {
      status: 'completed',
      completedDate: new Date().toISOString().split('T')[0],
      githubUrl: githubUrl || undefined,
      liveDemoUrl: liveDemoUrl || undefined,
      keyLearnings: keyLearnings || undefined,
    });
  }

  public static deleteProject(studentEmail: string, projectId: string): boolean {
    const map = this.getStoredProjects();
    const emailKey = studentEmail.toLowerCase();
    const list = map[emailKey] || [];
    const filtered = list.filter((p) => p.id !== projectId);

    if (filtered.length === list.length) return false;
    map[emailKey] = filtered;
    this.saveStoredProjects(map);
    return true;
  }
}
