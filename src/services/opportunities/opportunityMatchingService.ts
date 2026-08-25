import { Opportunity, OpportunityMatchResult, MatchTier, GpaEligibilityStatus } from '../../types/opportunities';
import { UserProfile } from '../../types/user';
import { AcademicService } from '../academic/academicService';

export interface StudentMatchProfile {
  country: string;
  universityName?: string;
  universityId?: string;
  campus?: string;
  faculty?: string;
  programmeName: string;
  academicLevel: string; // e.g. 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Postgraduate'
  gpa: number; // e.g. 3.70 on 4.0 scale
  skills: string[];
  interests: string[];
  careerInterests: string[];
}

export const OpportunityMatchingService = {
  /**
   * Extracts a unified matching profile combining user profile and academic engine marks.
   */
  extractStudentProfile(user: UserProfile | null): StudentMatchProfile {
    const userEmail = user?.email || 'student@enemind.com';
    const uniId = user?.university?.id;
    const courseCat = user?.course?.category;
    
    // Get verified GPA from Academic Engine
    let academicGpa = 0.0;
    try {
      const summary = AcademicService.getAcademicSummary(userEmail, uniId, courseCat);
      if (summary.cumulativeGpa > 0) {
        academicGpa = summary.cumulativeGpa;
      }
    } catch {
      academicGpa = 0.0;
    }

    // Determine academic level
    const rawYear = user?.yearOfStudy || 'Year 3';
    let academicLevel = 'Year 3';
    if (rawYear.includes('1') || rawYear.toLowerCase().includes('first')) academicLevel = 'Year 1';
    else if (rawYear.includes('2') || rawYear.toLowerCase().includes('second')) academicLevel = 'Year 2';
    else if (rawYear.includes('3') || rawYear.toLowerCase().includes('third')) academicLevel = 'Year 3';
    else if (rawYear.includes('4') || rawYear.toLowerCase().includes('fourth')) academicLevel = 'Year 4';
    else if (rawYear.includes('5') || rawYear.toLowerCase().includes('fifth')) academicLevel = 'Year 5';
    else if (rawYear.toLowerCase().includes('post') || rawYear.toLowerCase().includes('master')) academicLevel = 'Masters';
    else if (rawYear.toLowerCase().includes('grad')) academicLevel = 'Recent Graduate';

    const programmeName = user?.course?.name || user?.programme || 'Engineering & Technology';
    const faculty = user?.faculty || user?.course?.category || 'Engineering';
    const country = user?.country || user?.university?.country || 'Kenya';

    const skills = Array.isArray(user?.skills) && user.skills.length > 0
      ? user.skills
      : ['Python', 'Problem Solving', 'Data Analysis', 'Web Development', 'Electronics'];

    const interests = Array.isArray(user?.interests) && user.interests.length > 0
      ? user.interests
      : ['Software Engineering', 'Renewable Energy', 'Automation', 'Machine Learning'];

    return {
      country,
      universityName: user?.university?.name,
      universityId: uniId,
      campus: user?.campus,
      faculty,
      programmeName,
      academicLevel,
      gpa: academicGpa > 0 ? academicGpa : 3.5, // sensible default if new student
      skills,
      interests,
      careerInterests: interests,
    };
  },

  /**
   * Evaluates match score, tier, criteria breakdown, and transparent human explanation.
   */
  calculateMatch(opportunity: Opportunity, student: StudentMatchProfile): OpportunityMatchResult {
    let score = 0;
    const highlights: string[] = [];

    // 1. Programme / Course match (Max 30 pts)
    let programmeMatch = false;
    let programmeScore = 0;

    const progLower = (student.programmeName || '').toLowerCase();
    const facLower = (student.faculty || '').toLowerCase();

    // Check eligible programmes
    if (!opportunity.eligibleProgrammes || opportunity.eligibleProgrammes.length === 0 ||
        opportunity.eligibleProgrammes.some(p => p.toLowerCase().includes('all') || p.toLowerCase().includes('any'))) {
      programmeMatch = true;
      programmeScore = 25;
    } else {
      const directProgMatch = opportunity.eligibleProgrammes.some(p => {
        const pLow = p.toLowerCase();
        return (
          pLow.includes(progLower) ||
          progLower.includes(pLow) ||
          (pLow.includes('stem') && (facLower.includes('engineer') || facLower.includes('tech') || facLower.includes('comput') || facLower.includes('science'))) ||
          (pLow.includes('engineer') && (progLower.includes('engineer') || facLower.includes('engineer'))) ||
          (pLow.includes('comput') && (progLower.includes('comput') || progLower.includes('software') || progLower.includes('it'))) ||
          (pLow.includes('business') && (progLower.includes('business') || progLower.includes('commerc') || progLower.includes('econ') || progLower.includes('financ')))
        );
      });

      const fieldMatch = opportunity.fields?.some(f => {
        const fLow = f.toLowerCase();
        return progLower.includes(fLow) || fLow.includes(progLower) || facLower.includes(fLow);
      });

      if (directProgMatch) {
        programmeMatch = true;
        programmeScore = 30;
        highlights.push(`Direct match for ${student.programmeName}`);
      } else if (fieldMatch) {
        programmeMatch = true;
        programmeScore = 22;
        highlights.push(`Relevant to your field (${student.faculty || opportunity.field})`);
      } else {
        programmeScore = 5;
      }
    }
    score += programmeScore;

    // 2. Academic Level Match (Max 20 pts)
    let academicLevelMatch = false;
    let levelScore = 0;

    if (!opportunity.eligibleAcademicLevels || opportunity.eligibleAcademicLevels.length === 0 ||
        opportunity.eligibleAcademicLevels.includes('All Levels') || opportunity.eligibleAcademicLevels.includes('Undergraduate')) {
      academicLevelMatch = true;
      levelScore = 20;
    } else {
      const matchExact = opportunity.eligibleAcademicLevels.some(lvl => {
        const lLow = lvl.toLowerCase();
        const sLow = student.academicLevel.toLowerCase();
        return lLow === sLow || (lLow.includes('undergrad') && sLow.includes('year'));
      });

      if (matchExact) {
        academicLevelMatch = true;
        levelScore = 20;
        highlights.push(`Open to ${student.academicLevel} students`);
      } else {
        levelScore = 8;
      }
    }
    score += levelScore;

    // 3. GPA Eligibility (Max 20 pts)
    let gpaEligibility = true;
    let gpaScore = 15;
    let gpaStatus: GpaEligibilityStatus = 'not_specified';
    let gpaMessage = 'No GPA minimum specified';

    if (opportunity.minimumGPA && opportunity.minimumGPA > 0) {
      if (student.gpa >= opportunity.minimumGPA) {
        gpaEligibility = true;
        gpaScore = 20;
        gpaStatus = 'eligible';
        gpaMessage = `Eligible based on GPA: ${student.gpa.toFixed(2)} vs ${opportunity.minimumGPA.toFixed(2)} required`;
        highlights.push(`GPA eligible (${student.gpa.toFixed(2)} ≥ ${opportunity.minimumGPA.toFixed(2)})`);
      } else {
        gpaEligibility = false;
        gpaScore = 0;
        gpaStatus = 'below_requirement';
        gpaMessage = `Below stated GPA requirement: min ${opportunity.minimumGPA.toFixed(2)} vs your ${student.gpa.toFixed(2)}`;
      }
    } else {
      gpaEligibility = true;
      gpaScore = 15;
      gpaStatus = 'not_specified';
    }
    score += gpaScore;

    // 4. Skills Match (Max 15 pts)
    const matchedSkills: string[] = [];
    const studentSkillsLower = student.skills.map(s => s.toLowerCase());

    const allOppSkills = [
      ...(opportunity.requiredSkills || []),
      ...(opportunity.preferredSkills || []),
    ];

    allOppSkills.forEach(reqSkill => {
      const rLow = reqSkill.toLowerCase();
      const isMatched = studentSkillsLower.some(s => s.includes(rLow) || rLow.includes(s));
      if (isMatched && !matchedSkills.includes(reqSkill)) {
        matchedSkills.push(reqSkill);
      }
    });

    let skillScore = 0;
    if (allOppSkills.length > 0) {
      const ratio = matchedSkills.length / Math.min(allOppSkills.length, 3);
      skillScore = Math.min(15, Math.round(ratio * 15));
      if (matchedSkills.length > 0) {
        highlights.push(`Matches ${matchedSkills.length} of your skills (${matchedSkills.slice(0, 2).join(', ')})`);
      }
    } else {
      skillScore = 10;
    }
    score += skillScore;

    // 5. Country / Regional Eligibility (Max 10 pts)
    let countryEligibility = false;
    let countryScore = 0;

    const studentCountryLower = (student.country || 'Kenya').toLowerCase();
    const oppCountryLower = (opportunity.country || 'Global').toLowerCase();
    const isGlobalOrPanAfrica =
      oppCountryLower.includes('global') ||
      oppCountryLower.includes('pan-africa') ||
      oppCountryLower.includes('worldwide') ||
      opportunity.remote === true ||
      opportunity.remote === 'remote';

    const inCountriesList = opportunity.countries?.some(c => c.toLowerCase().includes(studentCountryLower) || studentCountryLower.includes(c.toLowerCase()));

    if (oppCountryLower.includes(studentCountryLower) || inCountriesList || isGlobalOrPanAfrica) {
      countryEligibility = true;
      countryScore = 10;
      if (opportunity.remote === true || opportunity.remote === 'remote') {
        highlights.push('Remote friendly / Worldwide');
      } else if (inCountriesList || oppCountryLower.includes(studentCountryLower)) {
        highlights.push(`Available in ${student.country}`);
      }
    } else {
      countryScore = 4;
    }
    score += countryScore;

    // 6. Career Interests / Field Match (Max 5 pts)
    let careerInterestMatch = false;
    let interestScore = 0;

    const matchedInterest = student.careerInterests?.some(interest => {
      const iLow = interest.toLowerCase();
      return (
        (opportunity.field && opportunity.field.toLowerCase().includes(iLow)) ||
        (opportunity.fields && opportunity.fields.some(f => f.toLowerCase().includes(iLow))) ||
        opportunity.title.toLowerCase().includes(iLow)
      );
    });

    if (matchedInterest) {
      careerInterestMatch = true;
      interestScore = 5;
      score += interestScore;
      highlights.push('Aligns with your career interests');
    }

    // Clamp score
    const finalScore = Math.min(100, Math.max(10, score));

    // Determine Tier
    let tier: MatchTier = 'exploratory';
    let tierLabel = 'Exploratory match';

    if (finalScore >= 75) {
      tier = 'strong';
      tierLabel = 'Strong match';
    } else if (finalScore >= 55) {
      tier = 'good';
      tierLabel = 'Good match';
    } else if (finalScore >= 35) {
      tier = 'moderate';
      tierLabel = 'Moderate match';
    }

    // Generate readable explanation
    const reasonParts: string[] = [];
    if (programmeMatch) {
      reasonParts.push(`accepts ${student.programmeName} students`);
    }
    if (academicLevelMatch) {
      reasonParts.push(`matches your academic level (${student.academicLevel})`);
    }
    if (matchedSkills.length > 0) {
      reasonParts.push(`requires ${matchedSkills.length} of your listed skills (${matchedSkills.slice(0, 2).join(', ')})`);
    }
    if (gpaStatus === 'eligible' && opportunity.minimumGPA) {
      reasonParts.push(`and your ${student.gpa.toFixed(2)} GPA meets the ${opportunity.minimumGPA.toFixed(2)} requirement`);
    }

    const explanation = reasonParts.length > 0
      ? `${tierLabel} because this opportunity ${reasonParts.join(', ')}.`
      : `${tierLabel} based on your general academic and career profile.`;

    return {
      opportunityId: opportunity.id,
      score: finalScore,
      tier,
      tierLabel,
      explanation,
      highlights,
      gpaStatus,
      gpaMessage,
      criteriaBreakdown: {
        programmeMatch,
        programmeScore,
        academicLevelMatch,
        levelScore,
        gpaEligibility,
        gpaScore,
        skillMatchCount: matchedSkills.length,
        matchedSkills,
        skillScore,
        countryEligibility,
        countryScore,
        careerInterestMatch,
        interestScore,
      },
    };
  },

  /**
   * Sort and rank a collection of opportunities by match score for a given student.
   */
  rankOpportunities(opportunities: Opportunity[], student: StudentMatchProfile): { opportunity: Opportunity; match: OpportunityMatchResult }[] {
    const scored = opportunities.map(opp => ({
      opportunity: opp,
      match: this.calculateMatch(opp, student),
    }));

    // Sort descending by match score
    return scored.sort((a, b) => b.match.score - a.match.score);
  },
};
