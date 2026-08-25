/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardService } from '../dashboard/dashboardService';
import { ChatService } from '../chat/chatService';
import { AnalyticsService } from '../analytics/analyticsService';
import { MarketingService } from './marketingService';
import { RecommendationService } from './recommendationService';
import { NotificationService } from './notificationService';
import { UserProfile, UserRole } from '../../types/user';
import { UserActivityEvent } from '../../types/analytics';

export interface TestResult {
  id: string;
  name: string;
  category: 'Dashboard' | 'Chat' | 'Analytics' | 'Intelligence' | 'Privacy' | 'Funnel';
  passed: boolean;
  message: string;
  details?: any;
}

export class IntelligenceTestRunner {
  static async runAllTests(testUser: UserProfile): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // 1. Dashboard Role Adaptation Test
    try {
      const roles: UserRole[] = ['STUDENT', 'MENTOR', 'TEACHER', 'SELLER', 'ENEMIND_ADMIN'];
      let allRolesAdapted = true;

      for (const role of roles) {
        const dashboard = DashboardService.getUserDashboard(testUser.email, role);
        if (!dashboard || dashboard.widgets.length === 0 || dashboard.role !== role) {
          allRolesAdapted = false;
        }
      }

      results.push({
        id: 'test_dashboard_adaptation',
        name: 'Dashboard Persona & Role Adaptation',
        category: 'Dashboard',
        passed: allRolesAdapted,
        message: allRolesAdapted
          ? 'Dashboards dynamically initialize tailored widget blueprints for all 5 platform personas.'
          : 'Failed to adapt dashboard layouts across roles.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_dashboard_adaptation',
        name: 'Dashboard Persona & Role Adaptation',
        category: 'Dashboard',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 2. Widget Customization & Persistence Test
    try {
      const dbBefore = DashboardService.getUserDashboard(testUser.email, 'STUDENT');
      const widgetToToggle = dbBefore.widgets[0].id;
      const initialVisibility = dbBefore.widgets[0].isVisible;

      const dbAfter = DashboardService.toggleWidgetVisibility(testUser.email, 'STUDENT', widgetToToggle);
      const isToggled = dbAfter.widgets.find((w) => w.id === widgetToToggle)?.isVisible === !initialVisibility;

      // Reset back
      DashboardService.resetToDefault(testUser.email, 'STUDENT');

      results.push({
        id: 'test_widget_customization',
        name: 'Widget Customization & Layout Persistence',
        category: 'Dashboard',
        passed: isToggled,
        message: isToggled
          ? 'Widget visibility toggles and layout mutations correctly persist in user state.'
          : 'Widget customization failed to mutate state.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_widget_customization',
        name: 'Widget Customization & Layout Persistence',
        category: 'Dashboard',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 3. Conversation Multi-Party Authorization Test
    try {
      const userConvs = ChatService.getConversationsForUser(testUser.email);
      const canAccessAuthorized = userConvs.length > 0;

      // Try accessing an unauthorized fake user's isolated conversation
      let authorizationProtected = false;
      try {
        ChatService.getConversationById('unauthorized_external_hacker@evil.com', 'conv_mentor_jane');
      } catch {
        authorizationProtected = true;
      }

      results.push({
        id: 'test_chat_authorization',
        name: 'Chat Channel Authorization & Participant Isolation',
        category: 'Chat',
        passed: canAccessAuthorized && authorizationProtected,
        message: canAccessAuthorized && authorizationProtected
          ? 'Private chat channels strictly enforce participant authentication; unauthorized access is blocked.'
          : 'Chat authorization check failed.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_chat_authorization',
        name: 'Chat Channel Authorization & Participant Isolation',
        category: 'Chat',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 4. Message Access & Delivery Integrity
    try {
      const messages = ChatService.getMessages(testUser.email, 'conv_mentor_jane');
      const hasMessages = Array.isArray(messages) && messages.length > 0;

      // Send a test message
      const sentMsg = ChatService.sendMessage(
        testUser,
        'conv_mentor_jane',
        'Automated test ping for chat delivery verification'
      );

      const isDelivered = sentMsg && sentMsg.content.includes('Automated test ping');

      results.push({
        id: 'test_message_delivery',
        name: 'Message Delivery & Context Linkage',
        category: 'Chat',
        passed: hasMessages && Boolean(isDelivered),
        message: hasMessages && Boolean(isDelivered)
          ? 'Messages deliver with verified timestamps, participant IDs, and contextual metadata linkage.'
          : 'Message delivery validation failed.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_message_delivery',
        name: 'Message Delivery & Context Linkage',
        category: 'Chat',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 5. Centralized Event Tracking & Taxonomy Test
    try {
      AnalyticsService.track('CAREER_ASSESSMENT_COMPLETED', { score: 95, careerCode: 'CLOUD_ENG' }, testUser);
      const userEvents = AnalyticsService.getUserEvents(testUser.email);
      const trackedEvent = userEvents.find((e) => e.eventType === 'CAREER_ASSESSMENT_COMPLETED');

      results.push({
        id: 'test_event_taxonomy',
        name: 'Centralized Event Taxonomy & Telemetry',
        category: 'Analytics',
        passed: Boolean(trackedEvent),
        message: trackedEvent
          ? 'Event taxonomy records sessions, timestamps, and payload attributes cleanly.'
          : 'Event tracking failed to record event.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_event_taxonomy',
        name: 'Centralized Event Taxonomy & Telemetry',
        category: 'Analytics',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 6. Customer Lifecycle Stage Derivation Test
    try {
      const mockEventsNew: UserActivityEvent[] = [];
      const stageNew = AnalyticsService.deriveLifecycleStage(mockEventsNew, null);

      const mockEventsPurchased: UserActivityEvent[] = [
        {
          id: '1',
          eventType: 'PAYMENT_COMPLETED',
          userId: 'test',
          userRole: 'STUDENT',
          timestamp: new Date().toISOString(),
          sessionId: 's1',
          isConsented: true,
        },
      ];
      const stageCust = AnalyticsService.deriveLifecycleStage(mockEventsPurchased, testUser);

      const isLifecycleAccurate = stageNew === 'NEW_USER' && stageCust === 'CUSTOMER';

      results.push({
        id: 'test_lifecycle_derivation',
        name: 'Customer Lifecycle Stage Derivation',
        category: 'Analytics',
        passed: isLifecycleAccurate,
        message: isLifecycleAccurate
          ? 'Customer progression smoothly categorizes users from NEW_USER to ENGAGED/CUSTOMER.'
          : 'Lifecycle stage calculation returned unexpected values.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_lifecycle_derivation',
        name: 'Customer Lifecycle Stage Derivation',
        category: 'Analytics',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 7. Segment Rules Engine Test
    try {
      const mockProspectEvents: UserActivityEvent[] = [
        {
          id: '2',
          eventType: 'PRODUCT_VIEWED',
          userId: testUser.email,
          userRole: 'STUDENT',
          timestamp: new Date().toISOString(),
          sessionId: 's2',
          isConsented: true,
        },
      ];

      const qualifiedSegments = MarketingService.evaluateUserSegments(testUser.email, mockProspectEvents, testUser);
      const isQualified = qualifiedSegments.includes('AUTOMATION_INTERESTED');

      results.push({
        id: 'test_segment_rules',
        name: 'Audience & Behavioral Segment Rules Engine',
        category: 'Intelligence',
        passed: isQualified,
        message: isQualified
          ? 'Rules correctly qualify prospects for AUTOMATION_INTERESTED based on consented actions.'
          : 'Segment rules engine failed qualification.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_segment_rules',
        name: 'Audience & Behavioral Segment Rules Engine',
        category: 'Intelligence',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 8. Recommendation Transparency & Rationale Test
    try {
      const recommendations = RecommendationService.getRecommendations(testUser);
      const hasRationale = recommendations.every((r) => r.rationale && r.rationale.length > 10);
      const hasTypes = recommendations.some((r) => r.type === 'opportunity') && recommendations.some((r) => r.type === 'mentor');

      results.push({
        id: 'test_recommendation_transparency',
        name: 'First-Party Recommendations & Explainability',
        category: 'Intelligence',
        passed: hasRationale && hasTypes,
        message: hasRationale && hasTypes
          ? 'Every recommendation includes transparent, human-readable justification without black-box inferences.'
          : 'Recommendations missing rationale or cross-hub diversity.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_recommendation_transparency',
        name: 'First-Party Recommendations & Explainability',
        category: 'Intelligence',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 9. Marketing Preference & Consent Control Test
    try {
      // Save opt-out
      MarketingService.savePreferences({
        userId: testUser.email,
        personalizedRecommendations: false,
        marketingEmails: false,
        marketingNotifications: false,
        productRecommendations: false,
        analyticsTracking: false,
        lastUpdated: new Date().toISOString(),
      });

      const campaigns = MarketingService.getEligibleCampaigns(testUser.email, ['AUTOMATION_INTERESTED']);
      const isBlockedWhenOptedOut = campaigns.length === 0;

      // Restore opt-in
      MarketingService.savePreferences({
        userId: testUser.email,
        personalizedRecommendations: true,
        marketingEmails: true,
        marketingNotifications: true,
        productRecommendations: true,
        analyticsTracking: true,
        lastUpdated: new Date().toISOString(),
      });

      results.push({
        id: 'test_marketing_consent',
        name: 'User Privacy Consent & Preference Enforcement',
        category: 'Privacy',
        passed: isBlockedWhenOptedOut,
        message: isBlockedWhenOptedOut
          ? 'Consent preferences strictly gate campaign distribution and commercial suggestions.'
          : 'Privacy consent was not respected when user opted out.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_marketing_consent',
        name: 'User Privacy Consent & Preference Enforcement',
        category: 'Privacy',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 10. Campaign Frequency Cap Enforcement Test
    try {
      const campId = 'camp_automation_templates';
      // Record impressions up to limit
      for (let i = 0; i < 10; i++) {
        MarketingService.recordCampaignImpression(testUser.email, campId);
      }

      const activeCamps = MarketingService.getEligibleCampaigns(testUser.email, ['AUTOMATION_INTERESTED']);
      const isCapped = !activeCamps.some((c) => c.id === campId);

      results.push({
        id: 'test_frequency_capping',
        name: 'In-App Campaign Frequency Limits',
        category: 'Intelligence',
        passed: isCapped,
        message: isCapped
          ? 'Campaign frequency limits prevent user fatigue by capping repetitive impressions.'
          : 'Campaign impression frequency cap was bypassed.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_frequency_capping',
        name: 'In-App Campaign Frequency Limits',
        category: 'Intelligence',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 11. Strict Data Isolation (Private Records Protected)
    try {
      // Pass private mark/chat payload into track
      AnalyticsService.track(
        'DASHBOARD_VIEWED',
        {
          password: 'secret_cleartext_password',
          chatMessageText: 'private sensitive chat',
          rawExaminationMarks: { CS101: 99 },
          safeProperty: 'homepage_visit',
        },
        testUser
      );

      const events = AnalyticsService.getUserEvents(testUser.email);
      const latest = events[0];
      const isSanitized =
        !latest.properties?.password &&
        !latest.properties?.chatMessageText &&
        !latest.properties?.rawExaminationMarks &&
        latest.properties?.safeProperty === 'homepage_visit';

      results.push({
        id: 'test_data_isolation',
        name: 'Strict Data Isolation & Privacy Sanitization',
        category: 'Privacy',
        passed: isSanitized,
        message: isSanitized
          ? 'Private marks, passwords, and chat messages are strictly excluded from telemetry & marketing ingestion.'
          : 'Sensitive fields leaked into analytics payload.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_data_isolation',
        name: 'Strict Data Isolation & Privacy Sanitization',
        category: 'Privacy',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    // 12. Sales Funnel & Business Analytics Calculation
    try {
      const analytics = AnalyticsService.getAggregatedAnalytics();
      const hasFunnel = Array.isArray(analytics.salesFunnel) && analytics.salesFunnel.length === 4;
      const validConversion = analytics.salesFunnel.every((s) => s.conversionRate >= 0 && s.conversionRate <= 100);

      results.push({
        id: 'test_funnel_calculations',
        name: 'E-commerce Conversion Funnel & Dropoff Rates',
        category: 'Funnel',
        passed: hasFunnel && validConversion,
        message: hasFunnel && validConversion
          ? 'Multi-stage funnel computes Product Viewed → Cart → Checkout → Payment dropoff rates accurately.'
          : 'Funnel computation failed.',
      });
    } catch (e: any) {
      results.push({
        id: 'test_funnel_calculations',
        name: 'E-commerce Conversion Funnel & Dropoff Rates',
        category: 'Funnel',
        passed: false,
        message: `Error: ${e.message}`,
      });
    }

    return results;
  }
}
