/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Career,
  CareerMatch,
  CareerMatchTier,
  MatchFactor,
  CareerAssessmentAttempt,
} from '../../types/career';
import { UserProfile } from '../../types/user';
import { AcademicService } from '../academic/academicService';

export interface StudentCareerProfile {
  email: string;
  programmeName: string;
  facultyName: string;
  universityName: string;
  yearOfStudy: string;
  declaredSkills: string[];
  interests: string[];
  cumulativeGpa: number | null;
}

export class CareerMatchingService {
  public static extractProfile(user: UserProfile | null): StudentCareerProfile {
    if (!user) {
      return {
        email: 'guest@enemind.org',
        programmeName: 'General Undergraduate Studies',
        facultyName: 'School of Engineering & Applied Sciences',
        universityName: 'University Campus',
        yearOfStudy: 'Year 3',
        declaredSkills: ['Python', 'Problem Solving', 'Data Analysis', 'Web Basics'],
        interests: ['Technology', 'Engineering', 'Innovation'],
        cumulativeGpa: 3.5,
      };
    }

    const academicSummary = AcademicService.getAcademicSummary(
      user.email,
      user.university?.id,
      user.course?.category
    );

    const gpa = academicSummary.cumulativeGpa > 0 ? academicSummary.cumulativeGpa : null;

    return {
      email: user.email,
      programmeName: user.course?.name || user.programme || 'General Undergraduate Studies',
      facultyName: user.faculty || user.course?.faculty || 'Academic Faculty',
      universityName: user.university?.name || 'Enemind University Network',
      yearOfStudy: user.yearOfStudy || 'Year 3',
      declaredSkills: user.skills && user.skills.length > 0 ? user.skills : ['Problem Solving', 'Critical Thinking'],
      interests: user.interests && user.interests.length > 0 ? user.interests : ['Technology', 'Engineering'],
      cumulativeGpa: gpa,
    };
  }

  public static matchCareer(
    career: Career,
    profile: StudentCareerProfile,
    assessment?: CareerAssessmentAttempt | null
  ): CareerMatch {
    const factors: MatchFactor[] = [];
    let totalScore = 0;

    // 1. Assessment Category Alignment (Weight: 35 pts)
    let assessmentScore = 0;
    if (assessment && assessment.categoryScores) {
      const catScore = assessment.categoryScores[career.category] || 0;
      // Normalization factor (typical top category score is around 40-70)
      const ratio = Math.min(1, catScore / 50);
      assessmentScore = Math.round(ratio * 35);

      if (assessmentScore >= 25) {
        factors.push({
          title: 'Assessment Alignment',
          status: 'positive',
          description: `Your career assessment signals strong affinity for ${career.category} fields.`,
          weight: assessmentScore,
        });
      } else if (assessmentScore >= 12) {
        factors.push({
          title: 'Moderate Assessment Signal',
          status: 'neutral',
          description: `You have secondary interest indicators in ${career.category}.`,
          weight: assessmentScore,
        });
      }
    } else {
      // Fallback from profile interests
      const hasDirectInterest = profile.interests.some(
        (i) =>
          career.category.toLowerCase().includes(i.toLowerCase()) ||
          i.toLowerCase().includes(career.category.toLowerCase())
      );
      assessmentScore = hasDirectInterest ? 25 : 15;
      if (hasDirectInterest) {
        factors.push({
          title: 'Expressed Interest',
          status: 'positive',
          description: `Matches your profile interest in ${career.category}.`,
          weight: assessmentScore,
        });
      }
    }
    totalScore += assessmentScore;

    // 2. Academic Programme & Faculty Relevance (Weight: 30 pts)
    let academicScore = 0;
    const progLower = profile.programmeName.toLowerCase();
    const isDirectProgrammeMatch = career.relatedProgrammes.some((p) => {
      const pLower = p.toLowerCase();
      return (
        progLower.includes(pLower) ||
        pLower.includes(progLower) ||
        (progLower.includes('engineer') && pLower.includes('engineer')) ||
        (progLower.includes('computer') && pLower.includes('computer')) ||
        (progLower.includes('statistic') && pLower.includes('statistic')) ||
        (progLower.includes('finance') && pLower.includes('finance'))
      );
    });

    if (isDirectProgrammeMatch) {
      academicScore = 30;
      factors.push({
        title: 'Degree Programme Alignment',
        status: 'positive',
        description: `Directly aligned with your academic degree: ${profile.programmeName}.`,
        weight: 30,
      });
    } else {
      academicScore = 12;
      factors.push({
        title: 'Alternative Pathway Opportunity',
        status: 'neutral',
        description: `Cross-disciplinary entry possible through skill acquisition and portfolio building.`,
        weight: 12,
      });
    }
    totalScore += academicScore;

    // 3. Current Skills Overlap (Weight: 25 pts)
    const allCareerSkills = [...career.requiredSkills, ...career.recommendedSkills];
    const matchingSkills: string[] = [];
    const missingRequiredSkills: string[] = [];
    const missingRecommendedSkills: string[] = [];

    career.requiredSkills.forEach((reqSkill) => {
      const isMatched = profile.declaredSkills.some((s) =>
        reqSkill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(reqSkill.toLowerCase())
      );
      if (isMatched) {
        matchingSkills.push(reqSkill);
      } else {
        missingRequiredSkills.push(reqSkill);
      }
    });

    career.recommendedSkills.forEach((recSkill) => {
      const isMatched = profile.declaredSkills.some((s) =>
        recSkill.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(recSkill.toLowerCase())
      );
      if (isMatched) {
        matchingSkills.push(recSkill);
      } else {
        missingRecommendedSkills.push(recSkill);
      }
    });

    const skillRatio = allCareerSkills.length > 0 ? matchingSkills.length / allCareerSkills.length : 0;
    const skillScore = Math.round(skillRatio * 25);
    totalScore += skillScore;

    if (matchingSkills.length > 0) {
      factors.push({
        title: 'Matching Core Skills',
        status: 'positive',
        description: `You already possess foundation skills: ${matchingSkills.slice(0, 3).join(', ')}.`,
        weight: skillScore,
      });
    }

    if (missingRequiredSkills.length > 0) {
      factors.push({
        title: 'Skill Development Gaps',
        status: 'gap',
        description: `Recommended target skills to acquire: ${missingRequiredSkills.slice(0, 3).join(', ')}.`,
        weight: 0,
      });
    }

    // 4. Strengths & Work Preference Alignment (Weight: 10 pts)
    let traitScore = 5;
    if (assessment) {
      if (career.remotePossible && assessment.declaredPreferences.includes('Remote-Oriented')) {
        traitScore += 5;
        factors.push({
          title: 'Remote Work Match',
          status: 'positive',
          description: `Aligns with your preference for remote and autonomous workflows.`,
          weight: 5,
        });
      }
    }
    totalScore += traitScore;

    // Constrain total score between 10 and 98 (avoid claiming 100% false perfection)
    const normalizedScore = Math.min(96, Math.max(15, totalScore));

    // Determine Tier Label
    let matchTier: CareerMatchTier = 'explore';
    let matchTierLabel = 'Explore Further';

    if (normalizedScore >= 80) {
      matchTier = 'excellent';
      matchTierLabel = 'Excellent Match';
    } else if (normalizedScore >= 65) {
      matchTier = 'strong';
      matchTierLabel = 'Strong Match';
    } else if (normalizedScore >= 50) {
      matchTier = 'good';
      matchTierLabel = 'Good Match';
    } else if (normalizedScore >= 35) {
      matchTier = 'potential';
      matchTierLabel = 'Potential Match';
    }

    // Build transparent natural language summary
    let summary = '';
    if (matchTier === 'excellent') {
      summary = `Excellent fit because your degree (${profile.programmeName}) directly connects with ${career.title}, and you exhibit strong assessment indicators in ${career.category}.`;
    } else if (matchTier === 'strong') {
      summary = `Strong match based on your academic background in ${profile.programmeName} and aligned interest in ${career.category} competencies.`;
    } else if (matchTier === 'good') {
      summary = `Good match with strong potential. While there are specific technical skill gaps in ${career.requiredSkills.slice(0, 2).join(' and ')}, your foundation allows steady progression.`;
    } else {
      summary = `Potential alternative pathway. Offers high value if you are exploring cross-functional transitions into ${career.category}.`;
    }

    return {
      career,
      matchScore: normalizedScore,
      matchTier,
      matchTierLabel,
      summaryExplanation: summary,
      factors,
      skillMatchCount: matchingSkills.length,
      totalSkillsCount: allCareerSkills.length,
      matchingSkills,
      missingRequiredSkills,
      missingRecommendedSkills,
      academicAlignmentScore: academicScore,
    };
  }

  public static matchAllCareers(
    careers: Career[],
    profile: StudentCareerProfile,
    assessment?: CareerAssessmentAttempt | null
  ): CareerMatch[] {
    const matches = careers.map((career) => this.matchCareer(career, profile, assessment));
    // Sort descending by match score
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  }
}
