/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BusinessProfile,
  BusinessWebsite,
  WebsiteSection,
  WebsiteSectionType,
  WebsiteThemeConfig,
} from '../../types/business';
import { businessService } from './businessService';

const STORAGE_KEY_WEBSITES = 'enemind_websites_v1';

export const DEFAULT_THEME_CONFIG: WebsiteThemeConfig = {
  themeName: 'EMERALD_CAMPUS',
  primaryColor: '#059669', // Emerald 600
  accentColor: '#10B981', // Emerald 500
  backgroundColor: '#FAFAFA',
  textColor: '#171717',
  fontPreset: 'PLUS_JAKARTA',
  radiusPreset: 'xl',
  layoutStyle: 'MODERN_CLEAN',
};

export class WebsiteBuilderService {
  private websites: Record<string, BusinessWebsite> = {};

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WEBSITES);
      if (stored) {
        this.websites = JSON.parse(stored);
      } else {
        this.initializeDefaultWebsites();
      }
    } catch (e) {
      console.warn('Error loading websites:', e);
      this.initializeDefaultWebsites();
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_WEBSITES, JSON.stringify(this.websites));
    } catch (e) {
      console.error(e);
    }
  }

  private initializeDefaultWebsites() {
    // Seed initial websites for seed businesses
    const seedBusinesses = businessService.getBusinesses();
    for (const biz of seedBusinesses) {
      const site = this.generateDefaultWebsiteForBusiness(biz);
      this.websites[biz.id] = site;
    }
    this.persist();
  }

  public generateDefaultWebsiteForBusiness(biz: BusinessProfile): BusinessWebsite {
    const slug = biz.slug;
    const sections: WebsiteSection[] = [];
    let order = 0;

    // 1. HERO Section
    sections.push({
      id: `sec_hero_${biz.id}`,
      type: 'HERO',
      title: biz.businessName,
      subtitle: biz.shortDescription,
      isVisible: true,
      order: order++,
      content: {
        headline: biz.businessName,
        tagline: biz.shortDescription,
        coverImage: biz.coverImage,
        logo: biz.logo,
        ctaPrimaryText: biz.orderingEnabled ? 'Order Online' : biz.bookingEnabled ? 'Book Now' : 'Contact Us',
        ctaPrimaryAction: biz.orderingEnabled ? '#order-section' : biz.bookingEnabled ? '#booking-section' : '#contact-section',
        ctaSecondaryText: 'Explore Offerings',
        badge: `${biz.category.replace('_', ' ')} • ${biz.campus}`,
        showRating: true,
        rating: biz.rating,
        reviewCount: biz.reviewCount,
      },
    });

    // 2. ABOUT Section
    sections.push({
      id: `sec_about_${biz.id}`,
      type: 'ABOUT',
      title: 'About Our Business',
      subtitle: 'Serving the university community with distinction',
      isVisible: true,
      order: order++,
      content: {
        description: biz.description,
        highlights: [
          `Verified Campus Partner (${biz.campus})`,
          biz.openingHours?.monday ? `Open Daily: ${biz.openingHours.monday}` : 'Open Daily',
          biz.paymentMethods?.length ? `Accepts: ${biz.paymentMethods.join(', ')}` : 'Instant M-PESA',
        ],
        image: biz.gallery?.[0] || biz.coverImage,
      },
    });

    // 3. MENU / ROOMS / SERVICES Section depending on category
    if (biz.category === 'RESTAURANT' || biz.category === 'CAFE') {
      sections.push({
        id: `sec_menu_${biz.id}`,
        type: 'MENU',
        title: 'Our Campus Menu',
        subtitle: 'Freshly prepared, generous student portions & rapid delivery',
        isVisible: true,
        order: order++,
        content: {
          categories: ['All', 'Shawarma & Wraps', 'Burgers', 'Sides & Fries', 'Drinks & Smoothies'],
          showOrderButtons: true,
          items: biz.menu || [],
        },
      });
    } else if (biz.category === 'HOSTEL' || biz.category === 'HOTEL') {
      sections.push({
        id: `sec_rooms_${biz.id}`,
        type: 'ROOMS',
        title: 'Available Rooms & Suites',
        subtitle: 'Secure, modern rooms with 24/7 water and dedicated study desks',
        isVisible: true,
        order: order++,
        content: {
          rooms: biz.roomOptions || [],
          amenities: biz.amenities || [],
          showBookingButton: true,
        },
      });
    } else if (biz.services && biz.services.length > 0) {
      sections.push({
        id: `sec_services_${biz.id}`,
        type: 'SERVICES',
        title: 'Services & Pricing',
        subtitle: 'Fast, professional services with student-friendly rates',
        isVisible: true,
        order: order++,
        content: {
          services: biz.services || [],
          showBookingButton: true,
        },
      });
    }

    // 4. GALLERY Section
    if (biz.gallery && biz.gallery.length > 0) {
      sections.push({
        id: `sec_gallery_${biz.id}`,
        type: 'GALLERY',
        title: 'Photo Gallery',
        subtitle: 'Take a virtual tour of our facility and work',
        isVisible: true,
        order: order++,
        content: {
          images: biz.gallery,
        },
      });
    }

    // 5. REVIEWS Section
    sections.push({
      id: `sec_reviews_${biz.id}`,
      type: 'REVIEWS',
      title: 'Customer Testimonials',
      subtitle: 'What students and campus peers say about us',
      isVisible: true,
      order: order++,
      content: {
        reviews: biz.reviews || [],
        averageRating: biz.rating,
        totalCount: biz.reviewCount,
      },
    });

    // 6. LOCATION & HOURS Section
    sections.push({
      id: `sec_location_${biz.id}`,
      type: 'LOCATION',
      title: 'Find Us On Campus',
      subtitle: `${biz.location} • ${biz.address}`,
      isVisible: true,
      order: order++,
      content: {
        location: biz.location,
        address: biz.address,
        distanceFromCampus: biz.distanceFromCampus,
        phone: biz.phone,
        whatsappNumber: biz.whatsappNumber,
        email: biz.email,
        openingHours: biz.openingHours,
      },
    });

    // 7. FOOTER Section
    sections.push({
      id: `sec_footer_${biz.id}`,
      type: 'FOOTER',
      title: 'Footer',
      isVisible: true,
      order: order++,
      content: {
        copyright: `© ${new Date().getFullYear()} ${biz.businessName}. Powered by Enemind Campus Life.`,
        phone: biz.phone,
        email: biz.email,
        whatsapp: biz.whatsappNumber,
      },
    });

    return {
      id: `web_${biz.id}`,
      businessId: biz.id,
      slug,
      title: `${biz.businessName} — Official Campus Website`,
      tagline: biz.shortDescription,
      theme: { ...DEFAULT_THEME_CONFIG },
      sections,
      isPublished: true,
      publishedUrl: `https://${slug}.enemind.app`,
      analytics: {
        totalViews: 342,
        uniqueVisitors: 198,
        menuViews: 145,
        bookingClicks: 42,
        orderClicks: 68,
        contactClicks: 29,
      },
      lastSyncedWithSheetAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  public getWebsiteByBusinessId(businessId: string): BusinessWebsite | undefined {
    if (!this.websites[businessId]) {
      const biz = businessService.getBusinessById(businessId);
      if (biz) {
        const site = this.generateDefaultWebsiteForBusiness(biz);
        this.websites[businessId] = site;
        this.persist();
        return site;
      }
    }
    return this.websites[businessId];
  }

  public getWebsiteBySlug(slug: string): BusinessWebsite | undefined {
    return Object.values(this.websites).find((w) => w.slug.toLowerCase() === slug.toLowerCase());
  }

  public updateWebsite(businessId: string, patch: Partial<BusinessWebsite>): BusinessWebsite | null {
    const existing = this.getWebsiteByBusinessId(businessId);
    if (!existing) return null;

    const updated: BusinessWebsite = {
      ...existing,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    this.websites[businessId] = updated;
    this.persist();
    return updated;
  }

  public updateSection(
    businessId: string,
    sectionId: string,
    patch: Partial<WebsiteSection>
  ): BusinessWebsite | null {
    const site = this.getWebsiteByBusinessId(businessId);
    if (!site) return null;

    const updatedSections = site.sections.map((sec) => {
      if (sec.id === sectionId) {
        return {
          ...sec,
          ...patch,
          content: { ...sec.content, ...(patch.content || {}) },
        };
      }
      return sec;
    });

    return this.updateWebsite(businessId, { sections: updatedSections });
  }

  public addSection(
    businessId: string,
    type: WebsiteSectionType,
    title?: string
  ): BusinessWebsite | null {
    const site = this.getWebsiteByBusinessId(businessId);
    if (!site) return null;

    const newSec: WebsiteSection = {
      id: `sec_${type.toLowerCase()}_${Date.now()}`,
      type,
      title: title || `${type.charAt(0) + type.slice(1).toLowerCase()} Section`,
      isVisible: true,
      order: site.sections.length,
      content: {},
    };

    return this.updateWebsite(businessId, { sections: [...site.sections, newSec] });
  }

  public removeSection(businessId: string, sectionId: string): BusinessWebsite | null {
    const site = this.getWebsiteByBusinessId(businessId);
    if (!site) return null;

    const updatedSections = site.sections.filter((s) => s.id !== sectionId);
    return this.updateWebsite(businessId, { sections: updatedSections });
  }

  public reorderSections(businessId: string, sectionIds: string[]): BusinessWebsite | null {
    const site = this.getWebsiteByBusinessId(businessId);
    if (!site) return null;

    const updatedSections = [...site.sections].sort((a, b) => {
      const idxA = sectionIds.indexOf(a.id);
      const idxB = sectionIds.indexOf(b.id);
      return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
    }).map((s, idx) => ({ ...s, order: idx }));

    return this.updateWebsite(businessId, { sections: updatedSections });
  }

  public publishWebsite(businessId: string): BusinessWebsite | null {
    return this.updateWebsite(businessId, { isPublished: true });
  }

  public unpublishWebsite(businessId: string): BusinessWebsite | null {
    return this.updateWebsite(businessId, { isPublished: false });
  }

  public incrementMetric(
    businessId: string,
    metric: 'totalViews' | 'uniqueVisitors' | 'menuViews' | 'bookingClicks' | 'orderClicks' | 'contactClicks'
  ) {
    const site = this.getWebsiteByBusinessId(businessId);
    if (!site) return;

    site.analytics[metric] = (site.analytics[metric] || 0) + 1;
    this.persist();
  }
}

export const websiteBuilderService = new WebsiteBuilderService();
