/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NotificationItem, NotificationCategory } from '../../types/intelligence';
import { MarketingService } from './marketingService';

const NOTIFICATIONS_STORAGE_KEY = 'enemind_notifications_v1';

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'student_current',
    title: 'Mentorship Confirmed',
    message: 'Dr. Jane Mutua accepted your session request for Friday 4:00 PM EAT.',
    category: 'booking',
    isRead: false,
    linkView: 'mentorship',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'notif_2',
    userId: 'student_current',
    title: 'Scholarship Deadline Approaching',
    message: 'Equity Bank Leaders Fellowship applications close in 5 days. Ensure your transcript is attached.',
    category: 'deadline',
    isRead: false,
    linkView: 'opportunities',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
  {
    id: 'notif_3',
    userId: 'student_current',
    title: 'New CAT 2 Past Papers Added',
    message: 'Verified past examination papers and model answers uploaded for Database Systems CS301.',
    category: 'learning',
    isRead: true,
    linkView: 'learning',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'notif_4',
    userId: 'student_current',
    title: 'M-PESA Student Pass Active',
    message: 'Your 30-day all-access trial pass has been synchronized with the cloud database.',
    category: 'transactional',
    isRead: true,
    linkView: 'profile',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export class NotificationService {
  private static initStorage(): void {
    if (!localStorage.getItem(NOTIFICATIONS_STORAGE_KEY)) {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }

  /**
   * Get notifications for user, respecting marketing notification preferences.
   */
  static getNotifications(userId: string): NotificationItem[] {
    this.initStorage();
    const prefs = MarketingService.getPreferences(userId);
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        const notifs: NotificationItem[] = JSON.parse(data);
        return notifs
          .filter((n) => {
            if (n.category === 'marketing' && !prefs.marketingNotifications) {
              return false;
            }
            return n.userId === userId || n.userId === 'student_current';
          })
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    } catch {}
    return INITIAL_NOTIFICATIONS;
  }

  /**
   * Push a new notification.
   */
  static pushNotification(
    userId: string,
    title: string,
    message: string,
    category: NotificationCategory = 'transactional',
    linkView?: string,
    metadata?: Record<string, any>
  ): NotificationItem {
    this.initStorage();
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      userId,
      title,
      message,
      category,
      isRead: false,
      linkView,
      createdAt: new Date().toISOString(),
      metadata,
    };

    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      const notifs: NotificationItem[] = data ? JSON.parse(data) : [];
      notifs.unshift(newNotif);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
    } catch (e) {
      console.error('Failed to push notification', e);
    }

    return newNotif;
  }

  /**
   * Mark single notification as read.
   */
  static markAsRead(id: string): void {
    this.initStorage();
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        const notifs: NotificationItem[] = JSON.parse(data);
        const idx = notifs.findIndex((n) => n.id === id);
        if (idx !== -1) {
          notifs[idx].isRead = true;
          localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
        }
      }
    } catch {}
  }

  /**
   * Mark all notifications as read for a user.
   */
  static markAllAsRead(userId: string): void {
    this.initStorage();
    try {
      const data = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (data) {
        const notifs: NotificationItem[] = JSON.parse(data);
        notifs.forEach((n) => {
          if (n.userId === userId || n.userId === 'student_current') {
            n.isRead = true;
          }
        });
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
      }
    } catch {}
  }

  /**
   * Get unread notification count.
   */
  static getUnreadCount(userId: string): number {
    const list = this.getNotifications(userId);
    return list.filter((n) => !n.isRead).length;
  }
}
