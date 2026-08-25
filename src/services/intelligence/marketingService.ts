/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  MarketingPreference,
  Campaign,
  UserSegment,
  SegmentRule,
} from '../../types';
import { UserProfile } from '../../types/user';
import { UserActivityEvent } from '../../types/analytics';

const PREFERENCES_STORAGE_KEY = 'enemind_marketing_preferences_v1';
const CAMPAIGN_IMPRESSIONS_KEY = 'enemind_campaign_impressions_v1';

export const DEFAULT_MARKETING_PREFERENCE: Omit<MarketingPreference, 'userId' | 'lastUpdated'> = {
  personalizedRecommendations: true,
  marketingEmails: true,
  marketingNotifications: true,
  productRecommendations: true,
  analyticsTracking: true,
};

export const BUILT_IN_SEGMENTS: UserSegment[] = [
  {
    id: 'seg_automation_interested',
    code: 'AUTOMATION_INTERESTED',
    name: 'Automation & Product Prospects',
    description: 'Users who interacted with Google Sheets or automation templates without purchasing yet.',
    category: 'commerce',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    rules: [
      {
        id: 'r1',
        operator: 'has_event',
        eventName: 'PRODUCT_VIEWED',
      },
      {
        id: 'r2',
        operator: 'not_has_event',
        eventName: 'PAYMENT_COMPLETED',
      },
    ],
  },
  {
    id: 'seg_mentorship_prospect',
    code: 'MENTORSHIP_PROSPECT',
    name: 'Mentorship Prospects',
    description: 'Students who viewed verified industry mentors but have not booked a session yet.',
    category: 'behavioral',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    rules: [
      {
        id: 'r3',
        operator: 'has_event',
        eventName: 'MENTOR_VIEWED',
      },
      {
        id: 'r4',
        operator: 'not_has_event',
        eventName: 'MENTOR_BOOKED',
      },
    ],
  },
  {
    id: 'seg_career_active',
    code: 'CAREER_ACTIVE',
    name: 'Active Career Navigators',
    description: 'Students who completed the career assessment and set target career roadmaps.',
    category: 'academic',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    rules: [
      {
        id: 'r5',
        operator: 'has_event',
        eventName: 'CAREER_ASSESSMENT_COMPLETED',
      },
    ],
  },
  {
    id: 'seg_academic_planner',
    code: 'ACADEMIC_PLANNER',
    name: 'GPA & Academic Planners',
    description: 'High-intent students actively logging marks, simulating GPAs, or accessing past papers.',
    category: 'academic',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    rules: [
      {
        id: 'r6',
        operator: 'has_event',
        eventName: 'DASHBOARD_VIEWED',
      },
    ],
  },
  {
    id: 'seg_high_engagement',
    code: 'HIGH_ENGAGEMENT_USER',
    name: 'Power Platform Users',
    description: 'Highly active students and creators utilizing multiple hubs across the ecosystem.',
    category: 'lifecycle',
    isSystem: true,
    createdAt: '2026-01-01T00:00:00.000Z',
    rules: [
      {
        id: 'r7',
        operator: 'event_count_gte',
        value: 5,
      },
    ],
  },
];

export const BUILT_IN_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp_academic_planning',
    title: 'Achieve First-Class Academic Standing',
    message: 'Try Enemind Academic GPA Simulator to calculate target marks, track course units, and forecast your degree classification.',
    targetSegmentCode: 'ACADEMIC_PLANNER',
    placement: 'dashboard_card',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    status: 'active',
    frequencyLimit: 5,
    actionLabel: 'Open GPA Simulator',
    actionTargetView: 'academics',
    dismissible: true,
    iconName: 'GraduationCap',
    priority: 1,
  },
  {
    id: 'camp_automation_templates',
    title: 'Ready-to-Use Business Automations',
    message: 'Discover verified Google Sheets & Apps Scripts built by top student engineers to automate payroll, inventory, and analytics.',
    targetSegmentCode: 'AUTOMATION_INTERESTED',
    placement: 'dashboard_card',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    status: 'active',
    frequencyLimit: 4,
    actionLabel: 'Explore Marketplace',
    actionTargetView: 'marketplace',
    dismissible: true,
    iconName: 'ShoppingBag',
    priority: 2,
  },
  {
    id: 'camp_mentor_booking',
    title: 'Accelerate Your Career with Industry Mentors',
    message: 'Connect 1-on-1 with verified alumni and tech leads in Nairobi, London & Silicon Valley for portfolio reviews and mock interviews.',
    targetSegmentCode: 'MENTORSHIP_PROSPECT',
    placement: 'dashboard_card',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    status: 'active',
    frequencyLimit: 4,
    actionLabel: 'Book a Session',
    actionTargetView: 'mentorship',
    dismissible: true,
    iconName: 'Users',
    priority: 3,
  },
  {
    id: 'camp_career_roadmap',
    title: 'Build Verified Proof-of-Work',
    message: 'Review your 6-stage career roadmap, build hands-on projects in the lab, and generate a verified digital CV.',
    targetSegmentCode: 'CAREER_ACTIVE',
    placement: 'dashboard_card',
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    status: 'active',
    frequencyLimit: 5,
    actionLabel: 'View Career Roadmap',
    actionTargetView: 'career',
    dismissible: true,
    iconName: 'Compass',
    priority: 4,
  },
];

export class MarketingService {
  /**
   * Retrieve marketing & privacy preferences for a given user.
   */
  static getPreferences(userId: string): MarketingPreference {
    try {
      const data = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (data) {
        const parsed: Record<string, MarketingPreference> = JSON.parse(data);
        if (parsed[userId]) {
          return parsed[userId];
        }
      }
    } catch {
      // Fallback
    }

    return {
      userId,
      ...DEFAULT_MARKETING_PREFERENCE,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Save marketing & privacy preferences.
   */
  static savePreferences(preferences: MarketingPreference): void {
    try {
      const data = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      const parsed: Record<string, MarketingPreference> = data ? JSON.parse(data) : {};
      parsed[preferences.userId] = {
        ...preferences,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(parsed));
    } catch (e) {
      console.error('Failed to save marketing preferences', e);
    }
  }

  /**
   * Get all marketing segments
   */
  static getAllSegments(): UserSegment[] {
    return BUILT_IN_SEGMENTS;
  }

  /**
   * Evaluate which segments a user qualifies for based on consented events.
   * STRICT PRIVACY GUARD: Private marks, private documents, and private chats are never accessed.
   */
  static evaluateUserSegments(
    userId: string,
    userEvents: UserActivityEvent[],
    user?: UserProfile | null
  ): string[] {
    const prefs = this.getPreferences(userId);
    if (!prefs.personalizedRecommendations && !prefs.analyticsTracking) {
      return ['EVERYONE'];
    }

    const consentedEvents = userEvents.filter((e) => e.isConsented !== false);
    const qualifiedCodes: string[] = [];

    for (const segment of BUILT_IN_SEGMENTS) {
      let isMatch = true;

      for (const rule of segment.rules) {
        if (rule.operator === 'has_event' && rule.eventName) {
          const hasIt = consentedEvents.some((e) => e.eventType === rule.eventName);
          if (!hasIt) isMatch = false;
        } else if (rule.operator === 'not_has_event' && rule.eventName) {
          const hasIt = consentedEvents.some((e) => e.eventType === rule.eventName);
          if (hasIt) isMatch = false;
        } else if (rule.operator === 'event_count_gte' && rule.value) {
          if (consentedEvents.length < rule.value) isMatch = false;
        }
      }

      if (isMatch) {
        qualifiedCodes.push(segment.code);
      }
    }

    // Default basic segments
    if (user?.roles?.includes('MENTOR')) qualifiedCodes.push('MENTOR_ROLE');
    if (user?.roles?.includes('SELLER')) qualifiedCodes.push('SELLER_ROLE');
    if (user?.roles?.includes('TEACHER')) qualifiedCodes.push('TEACHER_ROLE');

    return qualifiedCodes.length > 0 ? qualifiedCodes : ['EVERYONE'];
  }

  /**
   * Retrieve active campaigns targeting the user's qualified segments,
   * respecting user preferences and frequency limits.
   */
  static getEligibleCampaigns(
    userId: string,
    qualifiedSegmentCodes: string[],
    placement: string = 'dashboard_card'
  ): Campaign[] {
    const prefs = this.getPreferences(userId);
    if (!prefs.personalizedRecommendations && !prefs.productRecommendations) {
      return [];
    }

    const impressions = this.getCampaignImpressions(userId);

    const eligible = BUILT_IN_CAMPAIGNS.filter((camp) => {
      if (camp.status !== 'active') return false;
      if (camp.placement !== placement) return false;
      
      // Match segment
      const matchesSegment =
        camp.targetSegmentCode === 'EVERYONE' ||
        qualifiedSegmentCodes.includes(camp.targetSegmentCode);
      if (!matchesSegment) return false;

      // Frequency limit
      const currentImp = impressions[camp.id] || 0;
      if (currentImp >= camp.frequencyLimit) return false;

      return true;
    });

    return eligible.sort((a, b) => (a.priority || 10) - (b.priority || 10));
  }

  /**
   * Record campaign impression
   */
  static recordCampaignImpression(userId: string, campaignId: string): void {
    try {
      const data = localStorage.getItem(CAMPAIGN_IMPRESSIONS_KEY);
      const all: Record<string, Record<string, number>> = data ? JSON.parse(data) : {};
      if (!all[userId]) all[userId] = {};
      all[userId][campaignId] = (all[userId][campaignId] || 0) + 1;
      localStorage.setItem(CAMPAIGN_IMPRESSIONS_KEY, JSON.stringify(all));
    } catch (e) {
      console.error('Failed to record campaign impression', e);
    }
  }

  private static getCampaignImpressions(userId: string): Record<string, number> {
    try {
      const data = localStorage.getItem(CAMPAIGN_IMPRESSIONS_KEY);
      if (data) {
        const all = JSON.parse(data);
        return all[userId] || {};
      }
    } catch {}
    return {};
  }
}
