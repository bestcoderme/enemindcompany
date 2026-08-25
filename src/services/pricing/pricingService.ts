/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PricingConfig {
  websiteMonthlyPrice: number;
  currency: string;
  currencySymbol: string;
  annualDiscountPercent: number;
  gracePeriodDays: number;
  freeTrialDays: number;
  isDevelopmentModeFree: boolean;
}

const STORAGE_KEY_PRICING = 'enemind_pricing_config_v1';

export const DEFAULT_PRICING_CONFIG: PricingConfig = {
  websiteMonthlyPrice: 150, // Centralized KES 150 / month as specified
  currency: 'KES',
  currencySymbol: 'KSh',
  annualDiscountPercent: 15,
  gracePeriodDays: 7,
  freeTrialDays: 14,
  isDevelopmentModeFree: true,
};

export class PricingService {
  private config: PricingConfig = { ...DEFAULT_PRICING_CONFIG };

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PRICING);
      if (stored) {
        this.config = { ...DEFAULT_PRICING_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load pricing config, using defaults:', e);
      this.config = { ...DEFAULT_PRICING_CONFIG };
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_PRICING, JSON.stringify(this.config));
    } catch (e) {
      console.warn('Failed to save pricing config:', e);
    }
  }

  public getWebsiteMonthlyPrice(): number {
    return this.config.websiteMonthlyPrice;
  }

  public getCurrency(): string {
    return this.config.currency;
  }

  public getCurrencySymbol(): string {
    return this.config.currencySymbol;
  }

  public getFormattedPrice(amount?: number): string {
    const price = amount !== undefined ? amount : this.config.websiteMonthlyPrice;
    return `${this.config.currency} ${price.toLocaleString()}`;
  }

  public getConfig(): PricingConfig {
    return { ...this.config };
  }

  public updateConfig(newConfig: Partial<PricingConfig>): PricingConfig {
    this.config = { ...this.config, ...newConfig };
    this.persist();
    return { ...this.config };
  }

  public resetToDefaults(): PricingConfig {
    this.config = { ...DEFAULT_PRICING_CONFIG };
    this.persist();
    return { ...this.config };
  }
}

export const pricingService = new PricingService();
