/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentPortfolio } from '../../types/career';
import { UserProfile } from '../../types/user';
import { AcademicService } from '../academic/academicService';
import { CareerSkillsService } from './careerSkillsService';
import { CareerProjectService } from './careerProjectService';

const STORAGE_KEY_PORTFOLIO = 'enemind_student_portfolio_v4';

export class CareerPortfolioService {
  private static getStoredPortfolios(): Record<string, StudentPortfolio> {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PORTFOLIO);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.warn('Failed to parse portfolio store', e);
    }
    return {};
  }

  private static saveStoredPortfolios(map: Record<string, StudentPortfolio>): void {
    try {
      localStorage.setItem(STORAGE_KEY_PORTFOLIO, JSON.stringify(map));
    } catch (e) {
      console.error('Failed to save portfolios', e);
    }
  }

  public static getPortfolio(user: UserProfile | null): StudentPortfolio {
    const emailKey = (user?.email || 'guest@enemind.org').toLowerCase();
    const map = this.getStoredPortfolios();

    if (map[emailKey]) {
      return map[emailKey];
    }

    // Build initial portfolio from user profile and academic engine
    const academicSummary = AcademicService.getAcademicSummary(
      emailKey,
      user?.university?.id,
      user?.course?.category
    );

    const skills = CareerSkillsService.getStudentSkills(emailKey);
    const projects = CareerProjectService.getStudentProjects(emailKey);

    const defaultPortfolio: StudentPortfolio = {
      studentEmail: emailKey,
      fullName: user?.name || 'Enemind Student Scholar',
      headline: `${user?.course?.name || 'Engineering Student'} | Aspiring Technical Professional`,
      bio:
        user?.bio ||
        'Passionate undergraduate student focused on practical software, engineering, and data solutions with strong quantitative and analytical foundations.',
      location: `${user?.university?.location || 'Nairobi'}, ${user?.country || 'Kenya'}`,
      emailContact: emailKey,
      phoneContact: user?.phoneNumber || '+254 700 000 000',
      githubUrl: 'https://github.com/enemind',
      linkedinUrl: 'https://linkedin.com/in/enemind-student',
      websiteUrl: '',
      education: [
        {
          institution: user?.university?.name || 'Enemind University Network',
          degree: user?.course?.level || 'Bachelor of Science',
          programme: user?.course?.name || user?.programme || 'Electrical & Electronic Engineering',
          startYear: '2023',
          endYear: user?.graduationYear || '2027',
          gpaDisplay:
            academicSummary.cumulativeGpa > 0
              ? `${academicSummary.cumulativeGpa.toFixed(2)} GPA (${academicSummary.academicClassification})`
              : 'Cumulative GPA: In Progress',
          honors: academicSummary.academicClassification || 'First Class Honours Candidate',
        },
      ],
      skills,
      projects,
      experience: [
        {
          id: 'exp-1',
          role: 'Technical Student Intern',
          organization: 'University Engineering Lab / Research Group',
          location: 'Nairobi, Kenya',
          type: 'Attachment',
          startDate: '2025-05',
          endDate: '2025-08',
          isCurrent: false,
          responsibilities: [
            'Assisted senior engineers in circuit prototyping, sensor telemetry calibration, and testing.',
            'Documented operational data and prepared structured weekly technical reports.',
          ],
        },
      ],
      certifications: [
        {
          id: 'cert-1',
          name: 'Google Data Analytics Professional Certificate',
          issuingOrganization: 'Google / Coursera',
          issueDate: '2025-11',
          credentialId: 'COURSERA-GDA-98234',
        },
      ],
      achievements: [
        'Dean’s Commendation List for Academic Excellence (Year 2)',
        '1st Runner Up — National University STEM Innovation Challenge 2025',
      ],
      volunteerWork: [
        'Peer Academic Tutor — Engineering Mathematics & Python Programming Workshop',
      ],
      isPublic: true,
      updatedAt: new Date().toISOString(),
    };

    map[emailKey] = defaultPortfolio;
    this.saveStoredPortfolios(map);
    return defaultPortfolio;
  }

  public static savePortfolio(portfolio: StudentPortfolio): void {
    const map = this.getStoredPortfolios();
    const emailKey = portfolio.studentEmail.toLowerCase();
    portfolio.updatedAt = new Date().toISOString();
    map[emailKey] = portfolio;
    this.saveStoredPortfolios(map);
  }

  public static togglePublicVisibility(studentEmail: string, isPublic: boolean): StudentPortfolio {
    const map = this.getStoredPortfolios();
    const emailKey = studentEmail.toLowerCase();
    const current = map[emailKey] || this.getPortfolio({ email: emailKey, name: 'Student' } as any);
    current.isPublic = isPublic;
    current.updatedAt = new Date().toISOString();
    map[emailKey] = current;
    this.saveStoredPortfolios(map);
    return current;
  }
}
