/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WebsiteModel, WebsiteSubscriptionStatus } from '../../types/website';
import { pricingService } from '../pricing/pricingService';
import { mpesaService } from '../mpesaService';

export interface WebsiteSubscriptionRecord {
  id: string;
  websiteId: string;
  ownerId: string;
  ownerEmail: string;
  planName: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  status: WebsiteSubscriptionStatus;
  startDate: string;
  currentPeriodEnd: string;
  gracePeriodEnd: string;
  cancelledAt?: string;
  autoRenew: boolean;
  lastPaymentReceipt?: string;
  paymentMethod: 'MPESA' | 'DEVELOPMENT_BYPASS' | 'CARD';
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY_SUBSCRIPTIONS = 'enemind_website_subscriptions_v1';

export class SubscriptionService {
  private subscriptions: Record<string, WebsiteSubscriptionRecord> = {};

  constructor() {
    this.loadSubscriptions();
  }

  private loadSubscriptions() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SUBSCRIPTIONS);
      if (stored) {
        this.subscriptions = JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to load subscriptions:', e);
      this.subscriptions = {};
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_SUBSCRIPTIONS, JSON.stringify(this.subscriptions));
    } catch (e) {
      console.warn('Failed to persist subscriptions:', e);
    }
  }

  public getSubscriptionForWebsite(websiteId: string): WebsiteSubscriptionRecord | undefined {
    return this.subscriptions[websiteId];
  }

  public getSubscriptionsForOwner(ownerId: string): WebsiteSubscriptionRecord[] {
    return Object.values(this.subscriptions).filter((sub) => sub.ownerId === ownerId);
  }

  /**
   * Evaluates current active status considering expiry and grace period
   */
  public evaluateStatus(sub?: WebsiteSubscriptionRecord): {
    status: WebsiteSubscriptionStatus;
    isActiveOrGrace: boolean;
    isGracePeriod: boolean;
    daysRemaining: number;
    graceDaysRemaining: number;
  } {
    if (!sub) {
      return {
        status: 'EXPIRED',
        isActiveOrGrace: false,
        isGracePeriod: false,
        daysRemaining: 0,
        graceDaysRemaining: 0,
      };
    }

    if (sub.status === 'DEVELOPMENT') {
      return {
        status: 'DEVELOPMENT',
        isActiveOrGrace: true,
        isGracePeriod: false,
        daysRemaining: 999,
        graceDaysRemaining: 999,
      };
    }

    if (sub.status === 'CANCELLED' || sub.status === 'SUSPENDED') {
      return {
        status: sub.status,
        isActiveOrGrace: false,
        isGracePeriod: false,
        daysRemaining: 0,
        graceDaysRemaining: 0,
      };
    }

    const now = new Date().getTime();
    const periodEnd = new Date(sub.currentPeriodEnd).getTime();
    const graceEnd = new Date(sub.gracePeriodEnd).getTime();

    const diffDays = Math.ceil((periodEnd - now) / (1000 * 60 * 60 * 24));
    const graceDiffDays = Math.ceil((graceEnd - now) / (1000 * 60 * 60 * 24));

    if (now <= periodEnd) {
      return {
        status: 'ACTIVE',
        isActiveOrGrace: true,
        isGracePeriod: false,
        daysRemaining: Math.max(0, diffDays),
        graceDaysRemaining: Math.max(0, graceDiffDays),
      };
    } else if (now <= graceEnd) {
      return {
        status: 'PAST_DUE',
        isActiveOrGrace: true,
        isGracePeriod: true,
        daysRemaining: 0,
        graceDaysRemaining: Math.max(0, graceDiffDays),
      };
    } else {
      return {
        status: 'EXPIRED',
        isActiveOrGrace: false,
        isGracePeriod: false,
        daysRemaining: 0,
        graceDaysRemaining: 0,
      };
    }
  }

  /**
   * Activates or renews a website subscription via M-PESA
   */
  public activateWebsiteSubscription(params: {
    websiteId: string;
    ownerId: string;
    ownerEmail: string;
    phoneNumber: string;
    receiptNumber: string;
    isDevelopmentMode?: boolean;
    months?: number;
  }): WebsiteSubscriptionRecord {
    const months = params.months || 1;
    const pricePerMonth = pricingService.getWebsiteMonthlyPrice();
    const totalPrice = pricePerMonth * months;
    const currency = pricingService.getCurrency();

    const startDate = new Date();
    const periodEndDate = new Date(startDate);
    periodEndDate.setMonth(periodEndDate.getMonth() + months);

    const gracePeriodDays = pricingService.getConfig().gracePeriodDays;
    const graceEndDate = new Date(periodEndDate);
    graceEndDate.setDate(graceEndDate.getDate() + gracePeriodDays);

    const isDev = Boolean(params.isDevelopmentMode);

    const record: WebsiteSubscriptionRecord = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      websiteId: params.websiteId,
      ownerId: params.ownerId,
      ownerEmail: params.ownerEmail,
      planName: 'Enemind Website Standard',
      price: isDev ? 0 : totalPrice,
      currency: currency,
      billingCycle: 'MONTHLY',
      status: isDev ? 'DEVELOPMENT' : 'ACTIVE',
      startDate: startDate.toISOString(),
      currentPeriodEnd: periodEndDate.toISOString(),
      gracePeriodEnd: graceEndDate.toISOString(),
      autoRenew: false,
      lastPaymentReceipt: params.receiptNumber,
      paymentMethod: isDev ? 'DEVELOPMENT_BYPASS' : 'MPESA',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.subscriptions[params.websiteId] = record;
    this.persist();

    return record;
  }

  /**
   * Activates development mode subscription for instant testing
   */
  public activateDevelopmentSubscription(
    websiteId: string,
    ownerId: string,
    ownerEmail: string
  ): WebsiteSubscriptionRecord {
    return this.activateWebsiteSubscription({
      websiteId,
      ownerId,
      ownerEmail,
      phoneNumber: '254700000000',
      receiptNumber: `DEV_BYPASS_${Date.now().toString(36).toUpperCase()}`,
      isDevelopmentMode: true,
      months: 12,
    });
  }

  /**
   * Cancel subscription (does not delete data)
   */
  public cancelSubscription(websiteId: string): boolean {
    const sub = this.subscriptions[websiteId];
    if (!sub) return false;
    sub.status = 'CANCELLED';
    sub.cancelledAt = new Date().toISOString();
    sub.updatedAt = new Date().toISOString();
    this.persist();
    return true;
  }

  /**
   * Checks if website is permitted to be published
   */
  public canPublishWebsite(website: WebsiteModel): { allowed: boolean; reason?: string } {
    if (website.isDevelopmentMode) {
      return { allowed: true };
    }

    const sub = this.getSubscriptionForWebsite(website.id);
    if (!sub) {
      return {
        allowed: false,
        reason: 'A website subscription (KES 150/month) is required before publishing.',
      };
    }

    const evalResult = this.evaluateStatus(sub);
    if (!evalResult.isActiveOrGrace) {
      return {
        allowed: false,
        reason: 'Your website subscription has expired. Please renew for KES 150/month to publish.',
      };
    }

    return { allowed: true };
  }
}

export const subscriptionService = new SubscriptionService();
