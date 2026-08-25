/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Payout, ProviderEarnings, CurrencyCode } from '../../types/mentorship';
import { BookingService } from './bookingService';
import { PlatformFeeService } from './platformFeeService';

const PAYOUTS_STORAGE_KEY = 'enemind_provider_payouts_v1';

export class PayoutService {
  private static initStorage(): void {
    if (!localStorage.getItem(PAYOUTS_STORAGE_KEY)) {
      localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify([]));
    }
  }

  public static getAllPayouts(): Payout[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(PAYOUTS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public static getPayoutsByProvider(providerId: string): Payout[] {
    const all = this.getAllPayouts();
    return all.filter((p) => p.providerId === providerId);
  }

  /**
   * Calculate detailed provider earnings breakdown
   */
  public static calculateProviderEarnings(
    providerId: string,
    currency: CurrencyCode = 'KES'
  ): ProviderEarnings {
    const bookings = BookingService.getProviderBookings(providerId);
    const paidBookings = bookings.filter(
      (b) =>
        b.paymentStatus === 'SUCCESSFUL' &&
        (b.status === 'CONFIRMED' || b.status === 'COMPLETED')
    );

    let gross = 0;
    let platformTotal = 0;
    let net = 0;

    const txs: ProviderEarnings['transactions'] = [];

    for (const b of paidBookings) {
      const breakdown = PlatformFeeService.calculateFee(b.amount, b.currency);
      gross += breakdown.grossAmount;
      platformTotal += breakdown.platformFee;
      net += breakdown.providerAmount;

      txs.push({
        id: `tx_${b.id}`,
        bookingId: b.id,
        sessionTitle: b.sessionTitle,
        grossAmount: breakdown.grossAmount,
        platformFee: breakdown.platformFee,
        netAmount: breakdown.providerAmount,
        currency: b.currency,
        date: b.createdAt,
        status: 'confirmed',
      });
    }

    // Check payouts
    const payouts = this.getPayoutsByProvider(providerId);
    const completedPayouts = payouts
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPayouts = payouts
      .filter((p) => p.status === 'PENDING' || p.status === 'PROCESSING')
      .reduce((sum, p) => sum + p.amount, 0);

    return {
      grossEarnings: gross,
      platformFees: platformTotal,
      refunds: 0,
      netEarnings: net - completedPayouts,
      pendingPayouts,
      completedPayouts,
      currency,
      transactions: txs,
    };
  }

  /**
   * Request payout via M-PESA or Bank
   */
  public static requestPayout(params: {
    providerId: string;
    providerName: string;
    amount: number;
    currency: CurrencyCode;
    destination: string; // phone number e.g. 0712345678
    paymentProvider: 'mpesa' | 'bank_transfer';
  }): Payout {
    this.initStorage();
    const earnings = this.calculateProviderEarnings(params.providerId, params.currency);

    if (params.amount <= 0) {
      throw new Error('Payout amount must be greater than zero.');
    }

    if (params.amount > earnings.netEarnings) {
      throw new Error(
        `Insufficient balance. Available to withdraw: ${params.currency} ${earnings.netEarnings}`
      );
    }

    const newPayout: Payout = {
      id: `payout_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      providerId: params.providerId,
      providerName: params.providerName,
      amount: params.amount,
      currency: params.currency,
      status: 'PENDING',
      paymentProvider: params.paymentProvider,
      destination: params.destination,
      reference: `ENE-WD-${Math.floor(100000 + Math.random() * 900000)}`,
      requestedAt: new Date().toISOString(),
    };

    const all = this.getAllPayouts();
    all.unshift(newPayout);
    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(all));

    return newPayout;
  }

  /**
   * Process payout (Admin only)
   */
  public static processPayout(
    payoutId: string,
    status: 'COMPLETED' | 'FAILED',
    notes?: string
  ): Payout {
    this.initStorage();
    const all = this.getAllPayouts();
    const idx = all.findIndex((p) => p.id === payoutId);
    if (idx === -1) {
      throw new Error('Payout not found');
    }

    all[idx].status = status;
    all[idx].processedAt = new Date().toISOString();
    all[idx].notes = notes;

    localStorage.setItem(PAYOUTS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }
}
