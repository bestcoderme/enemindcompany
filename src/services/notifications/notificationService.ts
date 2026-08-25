/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserNotification } from '../../types/user';

const STORAGE_KEY_NOTIFICATIONS = 'enemind_user_notifications_v1';

export class NotificationService {
  private notifications: UserNotification[] = [];

  constructor() {
    this.loadNotifications();
  }

  private loadNotifications() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (stored) {
        this.notifications = JSON.parse(stored);
      } else {
        this.initializeDefaultNotifications();
      }
    } catch (e) {
      console.warn('Could not load notifications:', e);
      this.initializeDefaultNotifications();
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(this.notifications));
    } catch (e) {
      console.warn('Could not persist notifications:', e);
    }
  }

  private initializeDefaultNotifications() {
    this.notifications = [
      {
        id: 'notif_1',
        userId: 'alex.kimani@students.uonbi.ac.ke',
        title: 'Website Ready to Publish',
        message: 'Your website "Campus Chill & Grill Cafe" is ready. Connect your Google Sheet database or publish now.',
        category: 'WEBSITE',
        isRead: false,
        actionUrl: 'websites',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'notif_2',
        userId: 'alex.kimani@students.uonbi.ac.ke',
        title: 'Google Drive Database Connected',
        message: 'Google Sheets folder "ENEMIND WEBSITES" successfully provisioned in your Google Drive.',
        category: 'GOOGLE',
        isRead: true,
        actionUrl: 'google-services',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: 'notif_3',
        userId: 'alex.kimani@students.uonbi.ac.ke',
        title: 'Website Plan Active (KES 150/mo)',
        message: 'Your Enemind Website Standard plan is active. Enjoy unlimited visitor traffic and direct Google Sheet CMS updates.',
        category: 'PAYMENT',
        isRead: true,
        actionUrl: 'payments',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ];
    this.persist();
  }

  public getNotificationsForUser(userId: string): UserNotification[] {
    const target = (userId || '').toLowerCase().trim();
    return this.notifications.filter((n) => (n.userId || '').toLowerCase().trim() === target || n.userId === 'all');
  }

  public getUnreadCount(userId: string): number {
    return this.getNotificationsForUser(userId).filter((n) => !n.isRead).length;
  }

  public markAsRead(notificationId: string): void {
    const notif = this.notifications.find((n) => n.id === notificationId);
    if (notif) {
      notif.isRead = true;
      this.persist();
    }
  }

  public markAllAsRead(userId: string): void {
    const target = (userId || '').toLowerCase().trim();
    this.notifications.forEach((n) => {
      if ((n.userId || '').toLowerCase().trim() === target || n.userId === 'all') {
        n.isRead = true;
      }
    });
    this.persist();
  }

  public addNotification(notification: Omit<UserNotification, 'id' | 'createdAt' | 'isRead'>): UserNotification {
    const newNotif: UserNotification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    this.notifications.unshift(newNotif);
    this.persist();
    return newNotif;
  }
}

export const notificationService = new NotificationService();
