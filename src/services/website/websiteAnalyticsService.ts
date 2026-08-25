/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WebsiteAnalyticsSummary } from '../../types/website';

const STORAGE_KEY_ANALYTICS = 'enemind_website_analytics_v1';

export class WebsiteAnalyticsService {
  private analyticsData: Record<string, WebsiteAnalyticsSummary> = {};

  constructor() {
    this.loadData();
  }

  private loadData() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ANALYTICS);
      if (stored) {
        this.analyticsData = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not load analytics:', e);
      this.analyticsData = {};
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_ANALYTICS, JSON.stringify(this.analyticsData));
    } catch (e) {
      console.warn('Could not persist analytics:', e);
    }
  }

  public getAnalytics(websiteId: string): WebsiteAnalyticsSummary {
    if (!this.analyticsData[websiteId]) {
      this.analyticsData[websiteId] = {
        totalViews: 0,
        uniqueVisitors: 0,
        popularPages: [
          { slug: '', title: 'Home', views: 0 },
        ],
        popularItems: [],
        contactClicks: 0,
        bookingClicks: 0,
        orderStarts: 0,
        completedOrders: 0,
        dailyViews: [
          { date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0], views: 12 },
          { date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0], views: 18 },
          { date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0], views: 24 },
          { date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0], views: 35 },
          { date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], views: 42 },
          { date: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0], views: 50 },
          { date: new Date().toISOString().split('T')[0], views: 28 },
        ],
      };
      this.persist();
    }
    return this.analyticsData[websiteId];
  }

  public recordPageView(websiteId: string, pageSlug: string, pageTitle: string = 'Page'): void {
    const data = this.getAnalytics(websiteId);
    data.totalViews += 1;

    // Unique visitor estimate (client local storage fingerprint)
    const sessionKey = `viewed_${websiteId}_${new Date().toISOString().split('T')[0]}`;
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, '1');
      data.uniqueVisitors += 1;
    }

    // Popular page update
    const existingPage = data.popularPages.find((p) => p.slug === pageSlug);
    if (existingPage) {
      existingPage.views += 1;
    } else {
      data.popularPages.push({ slug: pageSlug, title: pageTitle, views: 1 });
    }

    // Daily views update
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = data.dailyViews.find((d) => d.date === today);
    if (todayEntry) {
      todayEntry.views += 1;
    } else {
      data.dailyViews.push({ date: today, views: 1 });
      if (data.dailyViews.length > 30) data.dailyViews.shift();
    }

    this.persist();
  }

  public recordEvent(
    websiteId: string,
    eventType: 'contact_click' | 'booking_click' | 'order_start' | 'order_complete',
    itemName?: string,
    category?: string
  ): void {
    const data = this.getAnalytics(websiteId);

    if (eventType === 'contact_click') data.contactClicks += 1;
    if (eventType === 'booking_click') data.bookingClicks += 1;
    if (eventType === 'order_start') data.orderStarts += 1;
    if (eventType === 'order_complete') data.completedOrders += 1;

    if (itemName) {
      const existing = data.popularItems.find((i) => i.name === itemName);
      if (existing) {
        existing.clicks += 1;
      } else {
        data.popularItems.push({ name: itemName, category: category || 'General', clicks: 1 });
      }
    }

    this.persist();
  }
}

export const websiteAnalyticsService = new WebsiteAnalyticsService();
