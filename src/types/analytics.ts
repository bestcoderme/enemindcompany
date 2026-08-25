/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from './user';

export type AnalyticsEventType =
  | 'USER_REGISTERED'
  | 'PROFILE_COMPLETED'
  | 'UNIVERSITY_SELECTED'
  | 'DASHBOARD_VIEWED'
  | 'CAREER_ASSESSMENT_COMPLETED'
  | 'CAREER_SELECTED'
  | 'OPPORTUNITY_VIEWED'
  | 'OPPORTUNITY_SAVED'
  | 'OPPORTUNITY_APPLIED'
  | 'MENTOR_VIEWED'
  | 'MENTOR_BOOKED'
  | 'COURSE_VIEWED'
  | 'COURSE_STARTED'
  | 'COURSE_COMPLETED'
  | 'PRODUCT_VIEWED'
  | 'PRODUCT_ADDED_TO_CART'
  | 'CHECKOUT_STARTED'
  | 'PAYMENT_COMPLETED'
  | 'PRODUCT_PURCHASED'
  | 'DOCUMENT_CONNECTED'
  | 'GOOGLE_SERVICE_CONNECTED'
  | 'MESSAGE_SENT'
  | 'CAMPAIGN_VIEWED'
  | 'CAMPAIGN_CLICKED'
  | 'WIDGET_CUSTOMIZED';

export interface UserActivityEvent {
  id: string;
  eventType: AnalyticsEventType;
  userId: string;
  userEmail?: string;
  userRole: UserRole;
  timestamp: string; // ISO string
  sessionId: string;
  properties?: Record<string, any>;
  pageUrl?: string;
  isConsented: boolean;
}

export type CustomerLifecycleStage =
  | 'NEW_USER'
  | 'ONBOARDING'
  | 'ACTIVE'
  | 'ENGAGED'
  | 'CUSTOMER'
  | 'REPEAT_CUSTOMER'
  | 'INACTIVE'
  | 'CHURN_RISK';

export type SegmentRuleOperator =
  | 'equals'
  | 'contains'
  | 'greater_than'
  | 'in'
  | 'has_event'
  | 'not_has_event'
  | 'event_count_gte';

export interface SegmentRule {
  id: string;
  field?: string;
  operator: SegmentRuleOperator;
  value?: any;
  eventName?: AnalyticsEventType;
  timeframeDays?: number;
}

export interface UserSegment {
  id: string;
  code: string;
  name: string;
  description: string;
  category: 'behavioral' | 'academic' | 'commerce' | 'lifecycle' | 'custom';
  rules: SegmentRule[];
  memberCount?: number;
  isSystem: boolean;
  createdAt: string;
}

export interface SalesFunnelStep {
  stepNumber: number;
  name: string;
  eventName: AnalyticsEventType;
  count: number;
  conversionRate: number; // Percentage relative to previous step
  overallConversionRate: number; // Percentage relative to first step
  dropoffRate: number;
}

export interface CustomerInsightProfile {
  userId: string;
  email: string;
  name: string;
  roles: UserRole[];
  universityName?: string;
  campusName?: string;
  programmeName?: string;
  lifecycleStage: CustomerLifecycleStage;
  consentedProductInterests: string[];
  totalPurchasesCount: number;
  totalSpentKES: number;
  totalBookingsCount: number;
  totalOpportunitiesAppliedCount: number;
  totalCoursesEnrolledCount: number;
  segmentMemberships: string[];
  lastActiveDate: string;
  hasMarketingConsent: boolean;
  accountStatus: 'active' | 'suspended' | 'pending';
}

export interface AggregatedAnalytics {
  timeframe: string;
  dau: number;
  wau: number;
  mau: number;
  newRegistrations: number;
  retentionRate: number;
  totalRevenueKES: number;
  totalOrdersCount: number;
  totalBookingsCount: number;
  totalAssessmentsCompleted: number;
  topRequestedSkills: { skill: string; count: number }[];
  topSearchedCareers: { careerTitle: string; count: number }[];
  topViewedOpportunities: { title: string; count: number }[];
  topViewedProducts: { title: string; count: number }[];
  activeUniversities: { universityName: string; activeUsersCount: number }[];
  salesFunnel: SalesFunnelStep[];
}
