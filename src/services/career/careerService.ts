/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Career, CareerCategory, CareerComparison } from '../../types/career';
import { INITIAL_CAREERS, INITIAL_CAREER_CATEGORIES } from './careerData';

const STORAGE_KEY_CAREERS = 'enemind_careers_catalog_v4';

export class CareerService {
  private static getStoredCareers(): Career[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CAREERS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Failed to parse stored careers, using defaults', e);
    }
    this.saveCareers(INITIAL_CAREERS);
    return INITIAL_CAREERS;
  }

  private static saveCareers(careers: Career[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_CAREERS, JSON.stringify(careers));
    } catch (e) {
      console.error('Failed to save careers to storage', e);
    }
  }

  public static getAllCareers(): Career[] {
    return this.getStoredCareers();
  }

  public static getCareerById(id: string): Career | null {
    const careers = this.getStoredCareers();
    return careers.find((c) => c.id === id) || null;
  }

  public static getAllCategories(): CareerCategory[] {
    return INITIAL_CAREER_CATEGORIES;
  }

  public static getCareersByCategory(category: CareerCategory): Career[] {
    return this.getStoredCareers().filter((c) => c.category === category);
  }

  public static searchCareers(query: string): Career[] {
    const term = query.trim().toLowerCase();
    if (!term) return this.getAllCareers();

    return this.getStoredCareers().filter((career) => {
      const titleMatch = career.title.toLowerCase().includes(term);
      const categoryMatch = career.category.toLowerCase().includes(term);
      const descMatch = career.description.toLowerCase().includes(term);
      const skillMatch = [...career.requiredSkills, ...career.recommendedSkills].some((s) =>
        s.toLowerCase().includes(term)
      );
      const programmeMatch = career.relatedProgrammes.some((p) =>
        p.toLowerCase().includes(term)
      );
      const industryMatch = career.industries.some((i) => i.toLowerCase().includes(term));

      return (
        titleMatch ||
        categoryMatch ||
        descMatch ||
        skillMatch ||
        programmeMatch ||
        industryMatch
      );
    });
  }

  public static filterCareers(filters: {
    category?: string;
    remoteOnly?: boolean;
    hasEntrepreneurship?: boolean;
    searchQuery?: string;
    country?: string;
  }): Career[] {
    let list = this.getStoredCareers();

    if (filters.searchQuery) {
      list = this.searchCareers(filters.searchQuery);
    }

    if (filters.category && filters.category !== 'All') {
      list = list.filter((c) => c.category === filters.category);
    }

    if (filters.remoteOnly) {
      list = list.filter((c) => c.remotePossible && c.remotePotentialScore >= 60);
    }

    if (filters.hasEntrepreneurship) {
      list = list.filter((c) => c.entrepreneurshipPotentialScore >= 70);
    }

    if (filters.country && filters.country !== 'All') {
      list = list.filter(
        (c) =>
          c.countries.includes(filters.country!) ||
          c.countries.includes('Global') ||
          c.countries.includes('Remote Worldwide')
      );
    }

    return list;
  }

  public static compareCareers(careerIds: string[]): CareerComparison {
    const all = this.getStoredCareers();
    const careers = all.filter((c) => careerIds.includes(c.id));

    if (careers.length === 0) {
      return {
        careers: [],
        readinessScores: {},
        skillOverlap: [],
        uniqueSkills: {},
        salaryComparison: {},
        remoteViability: {},
        entrepreneurshipViability: {},
      };
    }

    // Find overlapping skills
    const skillSets = careers.map((c) => new Set([...c.requiredSkills, ...c.recommendedSkills]));
    const firstSkillSet = skillSets[0] || new Set();
    const overlap: string[] = [];
    firstSkillSet.forEach((skill) => {
      if (skillSets.every((set) => set.has(skill))) {
        overlap.push(skill);
      }
    });

    const uniqueSkills: Record<string, string[]> = {};
    const salaryComparison: Record<string, any> = {};
    const remoteViability: Record<string, number> = {};
    const entrepreneurshipViability: Record<string, number> = {};

    careers.forEach((career) => {
      uniqueSkills[career.id] = [...career.requiredSkills, ...career.recommendedSkills].filter(
        (s) => !overlap.includes(s)
      );
      salaryComparison[career.id] =
        career.salaryInformation.find((s) => s.country === 'Kenya') ||
        career.salaryInformation[0] ||
        null;
      remoteViability[career.id] = career.remotePotentialScore;
      entrepreneurshipViability[career.id] = career.entrepreneurshipPotentialScore;
    });

    return {
      careers,
      readinessScores: {},
      skillOverlap: overlap,
      uniqueSkills,
      salaryComparison,
      remoteViability,
      entrepreneurshipViability,
    };
  }

  public static createCareer(newCareer: Omit<Career, 'id' | 'createdAt' | 'updatedAt'>): Career {
    const careers = this.getStoredCareers();
    const id = `career-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    const now = new Date().toISOString();

    const created: Career = {
      ...newCareer,
      id,
      createdAt: now,
      updatedAt: now,
    };

    careers.unshift(created);
    this.saveCareers(careers);
    return created;
  }

  public static updateCareer(id: string, updates: Partial<Career>): Career | null {
    const careers = this.getStoredCareers();
    const idx = careers.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    const updated: Career = {
      ...careers[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    careers[idx] = updated;
    this.saveCareers(careers);
    return updated;
  }

  public static deleteCareer(id: string): boolean {
    const careers = this.getStoredCareers();
    const filtered = careers.filter((c) => c.id !== id);
    if (filtered.length === careers.length) return false;
    this.saveCareers(filtered);
    return true;
  }

  public static resetToDefaultData(): void {
    this.saveCareers(INITIAL_CAREERS);
  }
}
