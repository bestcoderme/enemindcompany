/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const BASE_DOMAIN = 'enemindcompany.co.ke';
const FALLBACK_DOMAIN = 'enemind.app';

export interface DnsRecordConfig {
  type: 'A' | 'CNAME' | 'TXT';
  host: string;
  value: string;
  ttl: string;
  description: string;
}

export class DomainService {
  public readonly primaryDomain = 'enemindcompany.co.ke';

  /**
   * Sanitizes a raw input string into a clean URL-friendly subdomain slug
   */
  public sanitizeSlug(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .substring(0, 40);
  }

  /**
   * Validates if a slug meets platform safety and DNS naming requirements
   */
  public validateSlug(slug: string, existingSlugs: string[] = [], currentWebsiteId?: string): {
    isValid: boolean;
    error?: string;
  } {
    const sanitized = this.sanitizeSlug(slug);

    if (!sanitized || sanitized.length < 3) {
      return { isValid: false, error: 'Slug must be at least 3 characters long.' };
    }

    if (sanitized.length > 40) {
      return { isValid: false, error: 'Slug cannot exceed 40 characters.' };
    }

    const reservedSlugs = [
      'admin',
      'api',
      'app',
      'auth',
      'dashboard',
      'help',
      'mail',
      'payments',
      'preview',
      'root',
      'static',
      'support',
      'sys',
      'www',
    ];

    if (reservedSlugs.includes(sanitized)) {
      return { isValid: false, error: `The name "${sanitized}" is reserved by Enemind platform.` };
    }

    // Check collision
    if (existingSlugs.includes(sanitized)) {
      return { isValid: false, error: `The subdomain "${sanitized}.${BASE_DOMAIN}" is already taken.` };
    }

    return { isValid: true };
  }

  /**
   * Formats the public live URL for a website
   */
  public getPublishedUrl(slug: string, customDomain?: string): string {
    if (customDomain && customDomain.trim()) {
      return `https://${customDomain.trim().toLowerCase()}`;
    }
    const cleanSlug = this.sanitizeSlug(slug);
    return `https://${cleanSlug}.${BASE_DOMAIN}`;
  }

  public getBaseDomain(): string {
    return BASE_DOMAIN;
  }

  /**
   * Returns DNS records required to link enemindcompany.co.ke with GitHub Pages
   */
  public getGitHubDnsRecords(): DnsRecordConfig[] {
    return [
      {
        type: 'A',
        host: '@',
        value: '185.199.108.153',
        ttl: '3600 (Auto)',
        description: 'GitHub Pages IP 1',
      },
      {
        type: 'A',
        host: '@',
        value: '185.199.109.153',
        ttl: '3600 (Auto)',
        description: 'GitHub Pages IP 2',
      },
      {
        type: 'A',
        host: '@',
        value: '185.199.110.153',
        ttl: '3600 (Auto)',
        description: 'GitHub Pages IP 3',
      },
      {
        type: 'A',
        host: '@',
        value: '185.199.111.153',
        ttl: '3600 (Auto)',
        description: 'GitHub Pages IP 4',
      },
      {
        type: 'CNAME',
        host: 'www',
        value: 'enemindcompany.co.ke',
        ttl: '3600 (Auto)',
        description: 'Directs www traffic to the root domain',
      },
    ];
  }
}

export const domainService = new DomainService();
