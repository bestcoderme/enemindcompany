import { OpportunityService } from './opportunityService';
import { OpportunityMatchingService, StudentMatchProfile } from './opportunityMatchingService';
import { ApplicationTrackerService } from './applicationTrackerService';
import { DeadlineUtils } from './deadlineUtils';
import { Opportunity } from '../../types/opportunities';

export interface OpportunityTestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function runOpportunityEngineTests(): {
  allPassed: boolean;
  results: OpportunityTestResult[];
} {
  const results: OpportunityTestResult[] = [];

  const assert = (name: string, condition: boolean, message: string) => {
    results.push({
      name,
      passed: condition,
      message: condition ? 'PASSED: ' + message : 'FAILED: ' + message,
    });
  };

  // 1. All opportunities retrieval
  const allOpps = OpportunityService.getAllOpportunities();
  assert(
    '1. Opportunity Service Retrieval',
    allOpps.length >= 10,
    `Retrieved ${allOpps.length} opportunities from data service.`
  );

  // 2. Global Search & Relevance
  const searchElect = OpportunityService.searchOpportunities('Electrical engineering');
  const searchSaf = OpportunityService.searchOpportunities('Safaricom');
  assert(
    '2. Global Search Relevance Ranking',
    searchElect.length > 0 && searchSaf.some((o) => o.organization.includes('Safaricom')),
    `"Electrical engineering" returned ${searchElect.length} items, "Safaricom" matched correctly.`
  );

  // 3. Multi-dimensional filtering by Type and Country
  const scholarships = OpportunityService.filterOpportunities({ types: ['Scholarship'] });
  const kenyaAttachments = OpportunityService.filterOpportunities({
    types: ['Attachment'],
    countries: ['Kenya'],
  });
  assert(
    '3. Filter by Type & Country',
    scholarships.every((s) => s.type === 'Scholarship') &&
      kenyaAttachments.every((a) => a.type === 'Attachment'),
    `Scholarships: ${scholarships.length}, Kenya Attachments: ${kenyaAttachments.length}`
  );

  // 4. Remote filter
  const remoteOpps = OpportunityService.filterOpportunities({ remoteOnly: true });
  assert(
    '4. Remote Opportunity Filter',
    remoteOpps.length > 0 &&
      remoteOpps.every((o) => o.remote === true || o.remote === 'remote'),
    `Found ${remoteOpps.length} remote opportunities.`
  );

  // 5. Deadline Calculations & Timezone handling
  const todayDateStr = new Date().toISOString().split('T')[0];
  const todayInfo = DeadlineUtils.getDeadlineInfo(todayDateStr);
  
  const future3Days = new Date();
  future3Days.setDate(future3Days.getDate() + 3);
  const future3Info = DeadlineUtils.getDeadlineInfo(future3Days.toISOString().split('T')[0]);

  const pastDate = new Date();
  pastDate.setDate(pastDate.getDate() - 5);
  const pastInfo = DeadlineUtils.getDeadlineInfo(pastDate.toISOString().split('T')[0]);

  assert(
    '5. Deadline Timezone & Delta Calculation',
    todayInfo.isToday &&
      todayInfo.daysRemaining === 0 &&
      future3Info.daysRemaining === 3 &&
      pastInfo.isExpired,
    `Today: ${todayInfo.displayText}, 3 Days: ${future3Info.displayText}, Past: ${pastInfo.displayText}`
  );

  // 6. GPA Eligibility Logic (Below requirement vs Eligible)
  const dummyOppGpa: Opportunity = {
    ...allOpps[0],
    minimumGPA: 3.5,
  };
  const studentLowGpa: StudentMatchProfile = {
    country: 'Kenya',
    programmeName: 'BSc. Electrical & Electronic Engineering',
    academicLevel: 'Year 4',
    gpa: 3.2,
    skills: ['Python'],
    interests: ['Automation'],
    careerInterests: ['Automation'],
  };
  const studentHighGpa: StudentMatchProfile = {
    ...studentLowGpa,
    gpa: 3.7,
  };

  const matchLow = OpportunityMatchingService.calculateMatch(dummyOppGpa, studentLowGpa);
  const matchHigh = OpportunityMatchingService.calculateMatch(dummyOppGpa, studentHighGpa);

  assert(
    '6. GPA Eligibility Assessment',
    matchLow.gpaStatus === 'below_requirement' &&
      matchLow.criteriaBreakdown.gpaEligibility === false &&
      matchHigh.gpaStatus === 'eligible' &&
      matchHigh.criteriaBreakdown.gpaEligibility === true,
    `Low GPA (3.2 vs 3.5): ${matchLow.gpaStatus}, High GPA (3.7 vs 3.5): ${matchHigh.gpaStatus}`
  );

  // 7. Programme and Skill Matching
  const safOpp = allOpps.find((o) => o.id === 'opp-saf-tech-2026') || allOpps[1];
  const electricalStudent: StudentMatchProfile = {
    country: 'Kenya',
    programmeName: 'BSc. Electrical & Electronic Engineering',
    academicLevel: 'Year 3',
    gpa: 3.6,
    skills: ['Python', 'Networking Basics', 'Linux Fundamentals'],
    interests: ['Telecommunications'],
    careerInterests: ['Telecommunications'],
  };
  const matchResult = OpportunityMatchingService.calculateMatch(safOpp, electricalStudent);

  assert(
    '7. Match Score & Transparent Explanation',
    matchResult.score >= 70 &&
      matchResult.tier === 'strong' &&
      matchResult.criteriaBreakdown.skillMatchCount >= 2,
    `Score: ${matchResult.score} (${matchResult.tierLabel}), Explanation: ${matchResult.explanation}`
  );

  // 8. Saved Opportunities Toggle & Storage
  const testStudent = 'test_student_engine@enemind.com';
  ApplicationTrackerService.saveOpportunity(testStudent, 'opp-saf-tech-2026');
  const isSavedFirst = ApplicationTrackerService.isSaved(testStudent, 'opp-saf-tech-2026');
  ApplicationTrackerService.unsaveOpportunity(testStudent, 'opp-saf-tech-2026');
  const isSavedSecond = ApplicationTrackerService.isSaved(testStudent, 'opp-saf-tech-2026');

  assert(
    '8. Saved Opportunities Toggle',
    isSavedFirst === true && isSavedSecond === false,
    `Save -> ${isSavedFirst}, Unsave -> ${isSavedSecond}`
  );

  // 9. Application Pipeline Status Progression
  const appRec = ApplicationTrackerService.setApplicationStatus(
    testStudent,
    'opp-mc-2026',
    'applied',
    'Submitted essays and transcript'
  );
  const fetchedApp = ApplicationTrackerService.getApplication(testStudent, 'opp-mc-2026');
  const stats = ApplicationTrackerService.getApplicationStats(testStudent);

  assert(
    '9. Application Pipeline Tracking Progression',
    fetchedApp !== null &&
      fetchedApp.status === 'applied' &&
      stats.applied >= 1 &&
      fetchedApp.notes === 'Submitted essays and transcript',
    `Status: ${fetchedApp?.status}, Total tracked: ${stats.totalTracked}`
  );

  // 10. Admin Verification & Report Flow
  const customOpp = OpportunityService.createOpportunity(
    {
      title: 'Robotics Engineering Fellowship',
      organization: 'Kenya Robotics Lab',
      type: 'Fellowship',
      country: 'Kenya',
      applicationUrl: 'https://example.com/robotics',
      verified: false,
    },
    'admin@enemind.com'
  );

  const verifiedCustom = OpportunityService.verifyOpportunity(customOpp.id, 'admin@enemind.com');
  const reported = OpportunityService.reportOpportunity({
    opportunityId: customOpp.id,
    studentEmail: testStudent,
    reason: 'broken_link',
    details: 'Application link is giving 404',
  });

  const reportResolved = OpportunityService.resolveReport(reported.id, 'dismiss');
  OpportunityService.deleteOpportunity(customOpp.id);

  assert(
    '10. Admin Verification & Moderation Pipeline',
    verifiedCustom?.verified === true && reported.status === 'pending' && reportResolved === true,
    `Verified: ${verifiedCustom?.verified}, Report Status: ${reported.status}`
  );

  const allPassed = results.every((r) => r.passed);
  return { allPassed, results };
}
