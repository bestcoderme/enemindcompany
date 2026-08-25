/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from './user';

export type WidgetType =
  | 'academic_summary'
  | 'career_progress'
  | 'opportunities_feed'
  | 'mentor_bookings'
  | 'learning_progress'
  | 'marketplace_feed'
  | 'recent_chats'
  | 'notifications_feed'
  | 'recommended_actions'
  | 'campaign_banner'
  | 'mentor_performance'
  | 'teacher_courses'
  | 'seller_performance'
  | 'admin_growth'
  | 'customer_insights';

export type WidgetSize = 'small' | 'medium' | 'large' | 'full';

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  title: string;
  description?: string;
  position: number;
  size: WidgetSize;
  isVisible: boolean;
  allowedRoles: UserRole[];
  configuration?: Record<string, any>;
}

export interface UserDashboard {
  userId: string;
  role: UserRole;
  widgets: DashboardWidget[];
  customLayoutEnabled: boolean;
  lastUpdated: string;
}
