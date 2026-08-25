import { INITIAL_UNIVERSITIES, INITIAL_COURSES } from '../../data/institutions';
import { University, CourseItem, UniversityGradingSystem } from '../../types';

export const universityService = {
  getUniversities(): University[] {
    return INITIAL_UNIVERSITIES;
  },

  getUniversityById(id: string): University | undefined {
    return INITIAL_UNIVERSITIES.find((u) => u.id === id);
  },

  getCourses(): CourseItem[] {
    return INITIAL_COURSES;
  },

  getCoursesByCategory(category: string): CourseItem[] {
    if (!category || category === 'All') return INITIAL_COURSES;
    return INITIAL_COURSES.filter((c) => c.category === category);
  },

  getGradingSystemForUniversity(universityId?: string): UniversityGradingSystem | undefined {
    if (!universityId) return undefined;
    const uni = this.getUniversityById(universityId);
    return uni?.gradingSystem;
  }
};
