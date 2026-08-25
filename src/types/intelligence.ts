/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MarketingPreference {
  userId: string;
  personalizedRecommendations: boolean;
  marketingEmails: boolean;
  marketingNotifications: boolean;
  productRecommendations: boolean;
  analyticsTracking: boolean;
  lastUpdated: string;
}

export type RecommendationType =
  | 'opportunity'
  | 'mentor'
  | 'course'
  | 'marketplace_product'
  | 'project'
  | 'career_action'
  | 'learning_resource';

export interface RecommendationItem {
  id: string;
  type: RecommendationType;
  title: string;
  subtitle: string;
  category?: string;
  imageUrl?: string;
  badge?: string;
  score: number; // 0 - 100 fit
  rationale: string; // Transparent explanation
  targetView: string;
  targetId?: string;
  actionLabel: string;
  metadata?: Record<string, any>;
}

export type CampaignPlacement =
  | 'dashboard_card'
  | 'marketplace_banner'
  | 'modal'
  | 'inline_prompt';

export interface Campaign {
  id: string;
  title: string;
  message: string;
  targetSegmentCode: string;
  placement: CampaignPlacement;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'draft';
  frequencyLimit: number; // Max impressions per user
  actionLabel: string;
  actionTargetView: string;
  dismissible: boolean;
  iconName?: string;
  priority?: number;
}

export type NotificationCategory =
  | 'transactional'
  | 'account'
  | 'booking'
  | 'learning'
  | 'deadline'
  | 'marketing';

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  category: NotificationCategory;
  isRead: boolean;
  linkView?: string;
  createdAt: string;
  metadata?: Record<string, any>;
}
