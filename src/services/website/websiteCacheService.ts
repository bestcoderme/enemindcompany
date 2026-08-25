/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

export class WebsiteCacheService {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes cache default

  public get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const now = Date.now();
    if (now - entry.timestamp > entry.ttlMs) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public set<T>(key: string, data: T, ttlMs: number = this.defaultTTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttlMs,
    });
  }

  /**
   * Invalidates cached data when website is published, sheet is synced, or content is modified
   */
  public invalidateWebsite(websiteId: string, slug?: string): void {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, k) => {
      if (k.includes(websiteId) || (slug && k.includes(slug))) {
        keysToDelete.push(k);
      }
    });

    keysToDelete.forEach((k) => this.cache.delete(k));
  }

  public clearAll(): void {
    this.cache.clear();
  }
}

export const websiteCacheService = new WebsiteCacheService();
