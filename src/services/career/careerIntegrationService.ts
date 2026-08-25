/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Career } from '../../types/career';
import { Opportunity } from '../../types/opportunities';
import { OpportunityService } from '../opportunities/opportunityService';

export class CareerIntegrationService {
  public static getRelatedOpportunities(career: Career): {
    attachments: Opportunity[];
    internships: Opportunity[];
    scholarships: Opportunity[];
    jobs: Opportunity[];
    totalCount: number;
  } {
    const allOpps = OpportunityService.getAllOpportunities();

    const related = allOpps.filter((opp) => {
      // 1. Field or Category match
      const fieldMatch =
        opp.field.toLowerCase().includes(career.category.toLowerCase()) ||
        career.category.toLowerCase().includes(opp.field.toLowerCase()) ||
        career.industries.some((ind) => opp.field.toLowerCase().includes(ind.toLowerCase()));

      // 2. Skill overlap
      const allCareerSkills = [...career.requiredSkills, ...career.recommendedSkills];
      const skillMatch = opp.requiredSkills.some((req) =>
        allCareerSkills.some(
          (cSkill) =>
            cSkill.toLowerCase().includes(req.toLowerCase()) ||
            req.toLowerCase().includes(cSkill.toLowerCase())
        )
      );

      // 3. Programme match
      const progMatch = career.relatedProgrammes.some((p) =>
        opp.eligibleProgrammes.some(
          (ep) =>
            ep.toLowerCase().includes(p.toLowerCase()) || p.toLowerCase().includes(ep.toLowerCase())
        )
      );

      return fieldMatch || skillMatch || progMatch;
    });

    const attachments = related.filter((o) => o.type === 'Attachment');
    const internships = related.filter((o) => o.type === 'Internship');
    const scholarships = related.filter((o) => o.type === 'Scholarship' || o.type === 'Fellowship');
    const jobs = related.filter((o) => o.type === 'Job' || o.type === 'Graduate Programme');

    return {
      attachments,
      internships,
      scholarships,
      jobs,
      totalCount: related.length,
    };
  }
}
