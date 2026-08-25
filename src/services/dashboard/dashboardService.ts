/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DashboardWidget, UserDashboard, WidgetType } from '../../types/dashboard';
import { UserRole } from '../../types/user';

const DASHBOARD_CONFIGS_KEY = 'enemind_user_dashboard_configs_v1';

export const ROLE_DEFAULT_WIDGETS: Partial<Record<UserRole, DashboardWidget[]>> = {
  STUDENT: [
    {
      id: 'w_academic_summary',
      type: 'academic_summary',
      title: 'Academic Performance & GPA Snapshot',
      description: 'Live cumulative GPA, degree classification trajectory & simulator',
      position: 1,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['STUDENT'],
    },
    {
      id: 'w_career_progress',
      type: 'career_progress',
      title: 'Career Roadmap & Skill Lab',
      description: 'Your 6-stage industry roadmap progress & verified proof of work',
      position: 2,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['STUDENT'],
    },
    {
      id: 'w_campaign_banner',
      type: 'campaign_banner',
      title: 'Personalized Spotlight & Insights',
      description: 'Smart guidance tailored to your academic and career goals',
      position: 3,
      size: 'full',
      isVisible: true,
      allowedRoles: ['STUDENT', 'MENTOR', 'TEACHER', 'SELLER', 'ENEMIND_ADMIN', 'UNIVERSITY_ADMIN'],
    },
    {
      id: 'w_opportunities_feed',
      type: 'opportunities_feed',
      title: 'Recommended Opportunities',
      description: 'Scholarships, industrial attachments and tech apprenticeships',
      position: 4,
      size: 'large',
      isVisible: true,
      allowedRoles: ['STUDENT'],
    },
    {
      id: 'w_mentor_bookings',
      type: 'mentor_bookings',
      title: 'Upcoming Mentorship Sessions',
      description: 'Active 1-on-1 bookings and scheduled career reviews',
      position: 5,
      size: 'small',
      isVisible: true,
      allowedRoles: ['STUDENT', 'MENTOR'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Recent Messages & Discussions',
      description: 'Direct chats with mentors, course circles, and support',
      position: 6,
      size: 'small',
      isVisible: true,
      allowedRoles: ['STUDENT', 'MENTOR', 'TEACHER', 'SELLER', 'ENEMIND_ADMIN', 'UNIVERSITY_ADMIN'],
    },
    {
      id: 'w_marketplace_feed',
      type: 'marketplace_feed',
      title: 'EneHub Marketplace & Automations',
      description: 'Verified student-built Google Sheets and study kits',
      position: 7,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['STUDENT', 'SELLER'],
    },
    {
      id: 'w_learning_progress',
      type: 'learning_progress',
      title: 'Study Notes & Past Papers',
      description: 'Curriculum-aligned lecture notes and exam solutions',
      position: 8,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['STUDENT', 'TEACHER'],
    },
  ],
  MENTOR: [
    {
      id: 'w_mentor_performance',
      type: 'mentor_performance',
      title: 'Mentorship Impact & Analytics',
      description: 'Sessions conducted, mentee satisfaction rating and honorarium',
      position: 1,
      size: 'large',
      isVisible: true,
      allowedRoles: ['MENTOR'],
    },
    {
      id: 'w_mentor_bookings',
      type: 'mentor_bookings',
      title: 'Scheduled Student Sessions',
      description: 'Upcoming 1-on-1 career reviews and calendar bookings',
      position: 2,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['MENTOR'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Mentee Inquiries & Chats',
      description: 'Direct conversations with assigned and booked students',
      position: 3,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['MENTOR'],
    },
    {
      id: 'w_recommended_actions',
      type: 'recommended_actions',
      title: 'Mentorship Growth Recommendations',
      description: 'Actionable tips to optimize your availability and mentorship profile',
      position: 4,
      size: 'full',
      isVisible: true,
      allowedRoles: ['MENTOR'],
    },
  ],
  TEACHER: [
    {
      id: 'w_teacher_courses',
      type: 'teacher_courses',
      title: 'Enrolled Courses & Academic Modules',
      description: 'Active departmental classes, student rosters, and past paper repositories',
      position: 1,
      size: 'large',
      isVisible: true,
      allowedRoles: ['TEACHER'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Course Study Circles & Q&A',
      description: 'Student discussions and questions on assignment topics',
      position: 2,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['TEACHER'],
    },
    {
      id: 'w_learning_progress',
      type: 'learning_progress',
      title: 'Curriculum Resource Repository',
      description: 'Syllabus coverage, revision materials and download statistics',
      position: 3,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['TEACHER'],
    },
  ],
  SELLER: [
    {
      id: 'w_seller_performance',
      type: 'seller_performance',
      title: 'Creator & Marketplace Analytics',
      description: 'M-PESA revenue, total template downloads, and customer ratings',
      position: 1,
      size: 'large',
      isVisible: true,
      allowedRoles: ['SELLER'],
    },
    {
      id: 'w_marketplace_feed',
      type: 'marketplace_feed',
      title: 'Published Templates & Assets',
      description: 'Manage active Google Sheets, code templates and student notes',
      position: 2,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['SELLER'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Customer Inquiries & Reviews',
      description: 'Direct support chats with buyers and template users',
      position: 3,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['SELLER'],
    },
  ],
  ENEMIND_ADMIN: [
    {
      id: 'w_admin_growth',
      type: 'admin_growth',
      title: 'Platform Overview & Ecosystem Growth',
      description: 'DAU, WAU, MAU, M-PESA transaction volume and active campuses',
      position: 1,
      size: 'large',
      isVisible: true,
      allowedRoles: ['ENEMIND_ADMIN'],
    },
    {
      id: 'w_customer_insights',
      type: 'customer_insights',
      title: 'Aggregated Customer Intelligence & Funnel',
      description: 'Consented audience segments, conversion funnels & top skills in demand',
      position: 2,
      size: 'large',
      isVisible: true,
      allowedRoles: ['ENEMIND_ADMIN'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Helpdesk & Ticket Queue',
      description: 'Escalated student inquiries and customer support requests',
      position: 3,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['ENEMIND_ADMIN'],
    },
    {
      id: 'w_notifications_feed',
      type: 'notifications_feed',
      title: 'System Health & Security Audit',
      description: 'Real-time database sync logs and security verifications',
      position: 4,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['ENEMIND_ADMIN'],
    },
  ],
  UNIVERSITY_ADMIN: [
    {
      id: 'w_admin_growth',
      type: 'admin_growth',
      title: 'Campus Intelligence & Student Performance',
      description: 'Active university students, GPA trends, and faculty engagement',
      position: 1,
      size: 'large',
      isVisible: true,
      allowedRoles: ['UNIVERSITY_ADMIN'],
    },
    {
      id: 'w_teacher_courses',
      type: 'teacher_courses',
      title: 'Departmental Courses & Units',
      description: 'Monitored syllabus completion and faculty resources',
      position: 2,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['UNIVERSITY_ADMIN'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Campus Coordination Channel',
      description: 'Direct communications with faculty and student leaders',
      position: 3,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['UNIVERSITY_ADMIN'],
    },
  ],
  EMPLOYER: [
    {
      id: 'w_opportunities_feed',
      type: 'opportunities_feed',
      title: 'Active Job & Attachment Postings',
      description: 'Published student attachments, apprenticeships and graduate roles',
      position: 1,
      size: 'large',
      isVisible: true,
      allowedRoles: ['EMPLOYER'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Applicant Inquiries & Messages',
      description: 'Direct chat with student candidates and interns',
      position: 2,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['EMPLOYER'],
    },
    {
      id: 'w_customer_insights',
      type: 'customer_insights',
      title: 'Talent Pool Intelligence',
      description: 'Student skills, degree programs and university distributions',
      position: 3,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['EMPLOYER'],
    },
  ],
  PROFESSIONAL: [
    {
      id: 'w_mentor_performance',
      type: 'mentor_performance',
      title: 'Professional Impact & Mentorship',
      description: 'Industry sessions conducted and career advisories',
      position: 1,
      size: 'large',
      isVisible: true,
      allowedRoles: ['PROFESSIONAL'],
    },
    {
      id: 'w_recent_chats',
      type: 'recent_chats',
      title: 'Mentee Messages',
      description: 'Career roadmap and portfolio advisory messages',
      position: 2,
      size: 'medium',
      isVisible: true,
      allowedRoles: ['PROFESSIONAL'],
    },
  ],
};

export class DashboardService {
  /**
   * Get user dashboard configuration for a specific role.
   */
  static getUserDashboard(userId: string, role: UserRole): UserDashboard {
    try {
      const data = localStorage.getItem(DASHBOARD_CONFIGS_KEY);
      if (data) {
        const configs: Record<string, UserDashboard> = JSON.parse(data);
        const userKey = `${userId}_${role}`;
        if (configs[userKey]) {
          return configs[userKey];
        }
      }
    } catch {}

    // Fallback to role default
    const defaultWidgets = ROLE_DEFAULT_WIDGETS[role] || ROLE_DEFAULT_WIDGETS.STUDENT;
    return {
      userId,
      role,
      widgets: JSON.parse(JSON.stringify(defaultWidgets)),
      customLayoutEnabled: false,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Save customized dashboard layout.
   */
  static saveUserDashboard(dashboard: UserDashboard): void {
    try {
      const data = localStorage.getItem(DASHBOARD_CONFIGS_KEY);
      const configs: Record<string, UserDashboard> = data ? JSON.parse(data) : {};
      const userKey = `${dashboard.userId}_${dashboard.role}`;
      configs[userKey] = {
        ...dashboard,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem(DASHBOARD_CONFIGS_KEY, JSON.stringify(configs));
    } catch (e) {
      console.error('Failed to save user dashboard', e);
    }
  }

  /**
   * Toggle widget visibility in user's dashboard.
   */
  static toggleWidgetVisibility(userId: string, role: UserRole, widgetId: string): UserDashboard {
    const dashboard = this.getUserDashboard(userId, role);
    dashboard.widgets = dashboard.widgets.map((w) =>
      w.id === widgetId ? { ...w, isVisible: !w.isVisible } : w
    );
    dashboard.customLayoutEnabled = true;
    this.saveUserDashboard(dashboard);
    return dashboard;
  }

  /**
   * Reset user's dashboard to default layout.
   */
  static resetToDefault(userId: string, role: UserRole): UserDashboard {
    const defaultWidgets = ROLE_DEFAULT_WIDGETS[role] || ROLE_DEFAULT_WIDGETS.STUDENT;
    const freshDashboard: UserDashboard = {
      userId,
      role,
      widgets: JSON.parse(JSON.stringify(defaultWidgets)),
      customLayoutEnabled: false,
      lastUpdated: new Date().toISOString(),
    };
    this.saveUserDashboard(freshDashboard);
    return freshDashboard;
  }
}
