/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CurrencyCode } from '../../types/mentorship';

const PLATFORM_FEE_KEY = 'enemind_platform_fee_config_v1';

export interface FeeBreakdown {
  grossAmount: number;
  feePercentage: number;
  platformFee: number;
  providerAmount: number;
  currency: CurrencyCode;
}

export class PlatformFeeService {
  private static DEFAULT_FEE_PERCENT = 10; // Default 10% platform commission

  public static getFeePercentage(): number {
    try {
      const stored = localStorage.getItem(PLATFORM_FEE_KEY);
      if (stored) {
        const parsed = parseFloat(stored);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 50) {
          return parsed;
        }
      }
    } catch {}
    return this.DEFAULT_FEE_PERCENT;
  }

  public static setFeePercentage(percent: number, adminSecret?: string): boolean {
    if (percent < 0 || percent > 50) {
      throw new Error('Platform fee must be between 0% and 50%');
    }
    try {
      localStorage.setItem(PLATFORM_FEE_KEY, percent.toString());
      return true;
    } catch {
      return false;
    }
  }

  public static calculateFee(amount: number, currency: CurrencyCode): FeeBreakdown {
    if (amount <= 0) {
      return {
        grossAmount: 0,
        feePercentage: 0,
        platformFee: 0,
        providerAmount: 0,
        currency,
      };
    }

    const feePercentage = this.getFeePercentage();
    const platformFee = Math.round((amount * feePercentage) / 100);
    const providerAmount = Math.max(0, amount - platformFee);

    return {
      grossAmount: amount,
      feePercentage,
      platformFee,
      providerAmount,
      currency,
    };
  }
}
