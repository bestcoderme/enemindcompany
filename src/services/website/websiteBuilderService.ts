/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  WebsiteModel,
  WebsiteType,
  WebsiteTemplate,
  WebsitePage,
  WebsiteSection,
  WebsiteThemeConfig,
  WebsiteNavigationItem,
  WebsiteStatus,
} from '../../types/website';
import { pricingService } from '../pricing/pricingService';
import { subscriptionService } from '../subscription/subscriptionService';
import { domainService } from './domainService';
import { websiteDatabaseService } from './websiteDatabaseService';
import { websiteCacheService } from './websiteCacheService';
import { providerRegistry } from '../providers/providerRegistry';

const STORAGE_KEY_WEBSITES_V2 = 'enemind_user_websites_v2';

export const DEFAULT_THEME: WebsiteThemeConfig = {
  themeName: 'EMERALD_CAMPUS',
  primaryColor: '#059669', // Emerald 600
  accentColor: '#10B981', // Emerald 500
  backgroundColor: '#FFFFFF',
  textColor: '#171717',
  fontPreset: 'PLUS_JAKARTA',
  radiusPreset: 'xl',
  layoutStyle: 'MODERN_CLEAN',
};

export class WebsiteBuilderService {
  private websites: Record<string, WebsiteModel> = {};

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WEBSITES_V2);
      if (stored) {
        this.websites = JSON.parse(stored);
      } else {
        this.initializeSeedWebsites();
      }
    } catch (e) {
      console.warn('Error loading websites:', e);
      this.initializeSeedWebsites();
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_WEBSITES_V2, JSON.stringify(this.websites));
    } catch (e) {
      console.error('Failed to save websites to local storage:', e);
    }
  }

  public getTemplates(): WebsiteTemplate[] {
    return [
      {
        id: 'tpl_restaurant',
        name: 'Campus Bistro & Grill',
        category: 'RESTAURANT',
        description: 'Appetizing visual hero, categorized food menu, online ordering checkout with M-PESA, and table reservations.',
        thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80',
        previewImages: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
        ],
        defaultTheme: {
          themeName: 'WARM_AMBER',
          primaryColor: '#D97706',
          accentColor: '#F59E0B',
          backgroundColor: '#FFFFFF',
          textColor: '#18181B',
          fontPreset: 'PLUS_JAKARTA',
          radiusPreset: 'xl',
          layoutStyle: 'MODERN_CLEAN',
        },
        badge: 'Popular for Cafes',
        defaultPages: [],
        recommendedSchema: websiteDatabaseService.getRecommendedSchema('RESTAURANT'),
      },
      {
        id: 'tpl_hostel',
        name: 'Student Residency & Hostels',
        category: 'HOSTEL',
        description: 'Room options cards, monthly pricing & deposits, 360 amenities list, campus distance badge, and tenant booking forms.',
        thumbnail: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80',
        previewImages: [
          'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600',
          'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600',
        ],
        defaultTheme: {
          themeName: 'EMERALD_CAMPUS',
          primaryColor: '#059669',
          accentColor: '#10B981',
          backgroundColor: '#FFFFFF',
          textColor: '#111827',
          fontPreset: 'PLUS_JAKARTA',
          radiusPreset: 'xl',
          layoutStyle: 'BOLD_CAMPUS',
        },
        badge: 'Hostels & Rentals',
        defaultPages: [],
        recommendedSchema: websiteDatabaseService.getRecommendedSchema('HOSTEL'),
      },
      {
        id: 'tpl_portfolio',
        name: 'Developer & Creative Portfolio',
        category: 'PORTFOLIO',
        description: 'Interactive project showcase, tech stack pills, case study modals, GitHub/Live links, and lead intake form.',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=80',
        previewImages: [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600',
        ],
        defaultTheme: {
          themeName: 'MODERN_DARK',
          primaryColor: '#6366F1',
          accentColor: '#818CF8',
          backgroundColor: '#0F172A',
          textColor: '#F8FAFC',
          fontPreset: 'OUTFIT',
          radiusPreset: 'lg',
          layoutStyle: 'CREATIVE_GRID',
        },
        badge: 'Freelancers & Devs',
        defaultPages: [],
        recommendedSchema: websiteDatabaseService.getRecommendedSchema('PORTFOLIO'),
      },
      {
        id: 'tpl_creator',
        name: 'Creator & Personal Brand',
        category: 'CREATOR',
        description: 'Social links hub, video embeds, digital product downloads, event tickets, and collaboration booking form.',
        thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        previewImages: [
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
        ],
        defaultTheme: {
          themeName: 'ROSE_ELEGANCE',
          primaryColor: '#E11D48',
          accentColor: '#F43F5E',
          backgroundColor: '#FFFFFF',
          textColor: '#1E293B',
          fontPreset: 'PLUS_JAKARTA',
          radiusPreset: 'full',
          layoutStyle: 'MODERN_CLEAN',
        },
        badge: 'Influencers & Artists',
        defaultPages: [],
        recommendedSchema: websiteDatabaseService.getRecommendedSchema('CREATOR'),
      },
      {
        id: 'tpl_tutor',
        name: 'Academic Tutor & Mentor',
        category: 'TUTOR',
        description: 'Subjects catalog, group workshop schedule, hourly rates, student testimonials, and 1-on-1 session booking.',
        thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&auto=format&fit=crop&q=80',
        previewImages: [
          'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600',
        ],
        defaultTheme: {
          themeName: 'OCEAN_BLUE',
          primaryColor: '#0284C7',
          accentColor: '#38BDF8',
          backgroundColor: '#FFFFFF',
          textColor: '#0F172A',
          fontPreset: 'PLUS_JAKARTA',
          radiusPreset: 'xl',
          layoutStyle: 'MODERN_CLEAN',
        },
        badge: 'Educators & Tutors',
        defaultPages: [],
        recommendedSchema: websiteDatabaseService.getRecommendedSchema('TUTOR'),
      },
      {
        id: 'tpl_shop',
        name: 'Campus Shop & Retail',
        category: 'SHOP',
        description: 'Product catalog with stock badges, shopping cart, M-PESA checkout, pickup point selection, and customer inquiries.',
        thumbnail: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=80',
        previewImages: [
          'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600',
        ],
        defaultTheme: {
          themeName: 'EMERALD_CAMPUS',
          primaryColor: '#059669',
          accentColor: '#10B981',
          backgroundColor: '#FFFFFF',
          textColor: '#18181B',
          fontPreset: 'PLUS_JAKARTA',
          radiusPreset: 'xl',
          layoutStyle: 'MODERN_CLEAN',
        },
        badge: 'E-commerce & Store',
        defaultPages: [],
        recommendedSchema: websiteDatabaseService.getRecommendedSchema('SHOP'),
      },
      {
        id: 'tpl_service',
        name: 'Professional Services Hub',
        category: 'SERVICE',
        description: 'Service packages, pricing matrix, team bios, customer reviews, appointment scheduling, and FAQ accordion.',
        thumbnail: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&auto=format&fit=crop&q=80',
        previewImages: [
          'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=600',
        ],
        defaultTheme: {
          themeName: 'MINIMAL_SLATE',
          primaryColor: '#475569',
          accentColor: '#64748B',
          backgroundColor: '#FFFFFF',
          textColor: '#0F172A',
          fontPreset: 'INTER',
          radiusPreset: 'md',
          layoutStyle: 'MINIMAL_LUXE',
        },
        badge: 'Cyber, Salon & Repairs',
        defaultPages: [],
        recommendedSchema: websiteDatabaseService.getRecommendedSchema('SERVICE'),
      },
    ];
  }

  private initializeSeedWebsites() {
    // Seed initial realistic websites for demo accounts
    const seed1: WebsiteModel = this.createDefaultWebsiteInstance({
      ownerId: 'alex.kimani@students.uonbi.ac.ke',
      ownerName: 'Alex Kimani',
      name: 'Alex Kimani Portfolio',
      slug: 'alex-kimani',
      description: 'Electrical & Information Engineering student building IoT & clean energy systems.',
      type: 'PORTFOLIO',
      templateId: 'tpl_portfolio',
      isDevelopmentMode: true,
    });
    seed1.status = 'ACTIVE';

    const seed2: WebsiteModel = this.createDefaultWebsiteInstance({
      ownerId: 'alex.kimani@students.uonbi.ac.ke',
      ownerName: 'Alex Kimani',
      name: 'Campus Chill & Grill Cafe',
      slug: 'campuschill',
      description: 'Artisanal burgers, loaded fries and fresh fruit smoothies next to UoN Hall 3.',
      type: 'RESTAURANT',
      templateId: 'tpl_restaurant',
      isDevelopmentMode: true,
    });
    seed2.status = 'ACTIVE';

    const seed3: WebsiteModel = this.createDefaultWebsiteInstance({
      ownerId: 'alex.kimani@students.uonbi.ac.ke',
      ownerName: 'Alex Kimani',
      name: 'Executive Palms Student Hostels',
      slug: 'executive-palms',
      description: 'Secure, modern self-contained single rooms & bedsitters 5 mins from campus gate.',
      type: 'HOSTEL',
      templateId: 'tpl_hostel',
      isDevelopmentMode: true,
    });
    seed3.status = 'ACTIVE';

    this.websites[seed1.id] = seed1;
    this.websites[seed2.id] = seed2;
    this.websites[seed3.id] = seed3;

    this.persist();
  }

  public getWebsites(): WebsiteModel[] {
    return Object.values(this.websites);
  }

  public getWebsitesByOwner(ownerId: string): WebsiteModel[] {
    const target = (ownerId || '').toLowerCase().trim();
    return Object.values(this.websites).filter(
      (w) => (w.ownerId || '').toLowerCase().trim() === target || (w.ownerName || '').toLowerCase().trim() === target
    );
  }

  public getWebsiteById(id: string): WebsiteModel | undefined {
    return this.websites[id];
  }

  public getWebsiteBySlug(slug: string): WebsiteModel | undefined {
    const cleanSlug = domainService.sanitizeSlug(slug);
    return Object.values(this.websites).find((w) => w.slug === cleanSlug);
  }

  /**
   * Instantiates a new website with complete pages, sections, database schema, and navigation
   */
  public createDefaultWebsiteInstance(params: {
    ownerId: string;
    ownerName: string;
    name: string;
    slug: string;
    description: string;
    type: WebsiteType;
    templateId?: string;
    isDevelopmentMode?: boolean;
    googleSheetId?: string;
    googleSheetUrl?: string;
  }): WebsiteModel {
    const websiteId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const cleanSlug = domainService.sanitizeSlug(params.slug);
    const template = this.getTemplates().find((t) => t.id === params.templateId) || this.getTemplates()[0];
    const theme = template?.defaultTheme || DEFAULT_THEME;
    const schema = websiteDatabaseService.getRecommendedSchema(params.type);
    const publishedUrl = domainService.getPublishedUrl(cleanSlug);

    // Build Home Page Sections
    const homeSections: WebsiteSection[] = [
      {
        id: `sec_hero_${Date.now()}`,
        type: 'HERO',
        title: params.name,
        subtitle: params.description,
        isVisible: true,
        order: 0,
        content: {
          headline: params.name,
          tagline: params.description,
          coverImage: template.thumbnail,
          ctaPrimaryText:
            params.type === 'RESTAURANT' ? 'View Menu & Order' : params.type === 'HOSTEL' ? 'Explore Rooms' : 'Contact Me',
          ctaPrimaryAction:
            params.type === 'RESTAURANT' ? '#menu' : params.type === 'HOSTEL' ? '#rooms' : '#contact',
          ctaSecondaryText: 'About Us',
          badge: `${params.type.replace('_', ' ')} • Verified on Enemind`,
        },
      },
      {
        id: `sec_about_${Date.now()}`,
        type: 'ABOUT',
        title: 'About Us',
        subtitle: 'Our story and commitment to the campus community',
        isVisible: true,
        order: 1,
        content: {
          story: `${params.name} is dedicated to delivering exceptional quality, speed, and personalized service. Established to cater to student and professional needs with transparent pricing and direct support.`,
          highlights: ['Student discounts & flexible terms', 'Fast delivery & responsive support', 'Verified M-PESA transactions'],
          image: template.previewImages[0] || template.thumbnail,
        },
      },
    ];

    // Add Type-Specific Sections to Home Page
    if (params.type === 'RESTAURANT' || params.type === 'CAFE') {
      homeSections.push({
        id: `sec_menu_${Date.now()}`,
        type: 'MENU',
        title: 'Popular Menu',
        subtitle: 'Freshly prepared meals, snacks, and refreshing drinks',
        isVisible: true,
        order: 2,
        dataSource: 'GOOGLE_SHEET',
        sheetTab: 'Menu',
        content: {
          items: schema.recommendedTabs.find((t) => t.tabName === 'Menu')?.sampleData || [],
        },
      });
      homeSections.push({
        id: `sec_booking_${Date.now()}`,
        type: 'BOOKING',
        title: 'Table Reservations',
        subtitle: 'Reserve your dining spot for study groups and events',
        isVisible: true,
        order: 3,
        content: { bookingType: 'TABLE_RESERVATION' },
      });
    } else if (params.type === 'HOSTEL' || params.type === 'HOTEL') {
      homeSections.push({
        id: `sec_rooms_${Date.now()}`,
        type: 'ROOMS',
        title: 'Available Rooms',
        subtitle: 'Select from our spacious, fully-equipped student rooms',
        isVisible: true,
        order: 2,
        dataSource: 'GOOGLE_SHEET',
        sheetTab: 'Rooms',
        content: {
          items: schema.recommendedTabs.find((t) => t.tabName === 'Rooms')?.sampleData || [],
        },
      });
      homeSections.push({
        id: `sec_amenities_${Date.now()}`,
        type: 'SERVICES',
        title: 'Included Amenities',
        subtitle: 'Everything you need for safe and comfortable living',
        isVisible: true,
        order: 3,
        content: {
          items: schema.recommendedTabs.find((t) => t.tabName === 'Amenities')?.sampleData || [],
        },
      });
    } else if (params.type === 'PORTFOLIO' || params.type === 'FREELANCER') {
      homeSections.push({
        id: `sec_projects_${Date.now()}`,
        type: 'PORTFOLIO',
        title: 'Featured Projects',
        subtitle: 'A selection of recent systems, prototypes, and digital products',
        isVisible: true,
        order: 2,
        dataSource: 'GOOGLE_SHEET',
        sheetTab: 'Projects',
        content: {
          items: schema.recommendedTabs.find((t) => t.tabName === 'Projects')?.sampleData || [],
        },
      });
      homeSections.push({
        id: `sec_services_${Date.now()}`,
        type: 'SERVICES',
        title: 'Services & Packages',
        subtitle: 'Available for freelance development and consulting',
        isVisible: true,
        order: 3,
        dataSource: 'GOOGLE_SHEET',
        sheetTab: 'Services',
        content: {
          items: schema.recommendedTabs.find((t) => t.tabName === 'Services')?.sampleData || [],
        },
      });
    } else if (params.type === 'TUTOR' || params.type === 'TEACHER' || params.type === 'MENTOR') {
      homeSections.push({
        id: `sec_courses_${Date.now()}`,
        type: 'SERVICES',
        title: 'Tutoring Modules & Courses',
        subtitle: 'Structured revision and personalized concept coaching',
        isVisible: true,
        order: 2,
        dataSource: 'GOOGLE_SHEET',
        sheetTab: 'Courses',
        content: {
          items: schema.recommendedTabs.find((t) => t.tabName === 'Courses')?.sampleData || [],
        },
      });
    } else {
      homeSections.push({
        id: `sec_products_${Date.now()}`,
        type: 'PRODUCTS',
        title: 'Our Offerings',
        subtitle: 'High-quality products and verified campus essentials',
        isVisible: true,
        order: 2,
        dataSource: 'GOOGLE_SHEET',
        sheetTab: 'Products',
        content: {
          items: schema.recommendedTabs.find((t) => t.tabName === 'Products')?.sampleData || [],
        },
      });
    }

    // Contact & Footer Sections
    homeSections.push({
      id: `sec_contact_${Date.now()}`,
      type: 'CONTACT',
      title: 'Get In Touch',
      subtitle: 'Send us a direct message or inquiry',
      isVisible: true,
      order: 4,
      content: {
        email: `${cleanSlug}@enemind.app`,
        phone: '+254 712 345 678',
        location: 'Campus Centre, Nairobi',
      },
    });

    homeSections.push({
      id: `sec_footer_${Date.now()}`,
      type: 'FOOTER',
      title: 'Footer',
      isVisible: true,
      order: 5,
      content: {
        copyright: `© ${new Date().getFullYear()} ${params.name}. Powered by Enemind WaaS.`,
      },
    });

    // Default Pages
    const pages: WebsitePage[] = [
      {
        id: `page_home_${websiteId}`,
        title: 'Home',
        slug: '',
        navLabel: 'Home',
        layout: 'STANDARD',
        sections: homeSections,
        isPublished: true,
        isCustom: false,
        order: 0,
        metaDescription: params.description,
      },
      {
        id: `page_about_${websiteId}`,
        title: 'About',
        slug: 'about',
        navLabel: 'About',
        layout: 'STANDARD',
        sections: [
          {
            id: `sec_about_pg_${Date.now()}`,
            type: 'ABOUT',
            title: `About ${params.name}`,
            subtitle: 'Our journey, mission and principles',
            isVisible: true,
            order: 0,
            content: {
              story: `Founded with a focus on student empowerment, ${params.name} bridges quality and affordability across universities in Kenya.`,
              highlights: ['Direct owner communication', 'Real-time database sync', 'Safe payments'],
            },
          },
        ],
        isPublished: true,
        isCustom: false,
        order: 1,
      },
      {
        id: `page_contact_${websiteId}`,
        title: 'Contact',
        slug: 'contact',
        navLabel: 'Contact',
        layout: 'STANDARD',
        sections: [
          {
            id: `sec_contact_pg_${Date.now()}`,
            type: 'CONTACT',
            title: 'Contact Us',
            subtitle: 'We respond to inquiries within 1 hour',
            isVisible: true,
            order: 0,
            content: {
              email: `${cleanSlug}@enemind.app`,
              phone: '+254 712 345 678',
              location: 'University Avenue, Nairobi',
            },
          },
        ],
        isPublished: true,
        isCustom: false,
        order: 2,
      },
    ];

    // Navigation
    const navigation: WebsiteNavigationItem[] = [
      { id: 'nav_home', label: 'Home', path: '/', isVisible: true, order: 0 },
      { id: 'nav_about', label: 'About', path: '/about', isVisible: true, order: 1 },
      { id: 'nav_contact', label: 'Contact', path: '/contact', isVisible: true, order: 2 },
    ];

    const isDev = params.isDevelopmentMode ?? providerRegistry.getIsDevelopmentMode();

    const newWebsite: WebsiteModel = {
      id: websiteId,
      ownerId: params.ownerId,
      ownerName: params.ownerName,
      name: params.name,
      slug: cleanSlug,
      description: params.description,
      type: params.type,
      templateId: params.templateId || template.id,
      status: 'DRAFT',
      subscriptionPlan: {
        planId: 'plan_enemind_standard',
        name: 'Enemind Website Standard',
        price: pricingService.getWebsiteMonthlyPrice(), // Centralized KES 150/mo
        currency: pricingService.getCurrency(),
        billingCycle: 'MONTHLY',
        features: [
          'Enemind subdomain (slug.enemind.app)',
          'Visual drag-and-drop website editor',
          'Google Sheets 2-way database connection',
          'Google Drive media integration',
          'Live M-PESA payment integration',
          'Basic SEO & mobile-responsive design',
          'Visitor analytics & lead inbox',
        ],
      },
      subscriptionStatus: isDev ? 'DEVELOPMENT' : 'TRIAL',
      isDevelopmentMode: isDev,
      googleSheetId: params.googleSheetId,
      googleSheetUrl: params.googleSheetUrl,
      sheetMappings: [],
      publicFieldRules: websiteDatabaseService.getDefaultPublicFieldRules(params.type),
      subdomain: cleanSlug,
      publishedUrl,
      isListedInCampusLife: true,
      theme,
      pages,
      navigation,
      seo: {
        metaTitle: `${params.name} | Official Website`,
        metaDescription: params.description,
        keywords: [params.name, params.type.toLowerCase(), 'campus', 'enemind', 'kenya'],
        robotsIndex: true,
        structuredDataType: 'LocalBusiness',
      },
      analytics: {
        totalViews: 0,
        uniqueVisitors: 0,
        popularPages: [{ slug: '', title: 'Home', views: 0 }],
        popularItems: [],
        contactClicks: 0,
        bookingClicks: 0,
        orderStarts: 0,
        completedOrders: 0,
        dailyViews: [],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return newWebsite;
  }

  public saveWebsite(website: WebsiteModel): WebsiteModel {
    website.updatedAt = new Date().toISOString();
    this.websites[website.id] = website;
    this.persist();
    websiteCacheService.invalidateWebsite(website.id, website.slug);
    return website;
  }

  /**
   * Publishes a website after verifying subscription or development mode
   */
  public publishWebsite(websiteId: string): { success: boolean; website?: WebsiteModel; error?: string } {
    const site = this.websites[websiteId];
    if (!site) return { success: false, error: 'Website not found' };

    const pubCheck = subscriptionService.canPublishWebsite(site);
    if (!pubCheck.allowed) {
      return { success: false, error: pubCheck.reason };
    }

    site.status = 'ACTIVE';
    site.updatedAt = new Date().toISOString();
    this.websites[websiteId] = site;
    this.persist();
    websiteCacheService.invalidateWebsite(site.id, site.slug);

    return { success: true, website: site };
  }

  public unpublishWebsite(websiteId: string): WebsiteModel | undefined {
    const site = this.websites[websiteId];
    if (!site) return undefined;
    site.status = 'DRAFT';
    site.updatedAt = new Date().toISOString();
    this.persist();
    websiteCacheService.invalidateWebsite(site.id, site.slug);
    return site;
  }

  public duplicateWebsite(websiteId: string, newName?: string): WebsiteModel | undefined {
    const original = this.websites[websiteId];
    if (!original) return undefined;

    const newId = `site_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const newSlug = domainService.sanitizeSlug(`${original.slug}-copy-${Date.now().toString().slice(-4)}`);

    const copy: WebsiteModel = JSON.parse(JSON.stringify(original));
    copy.id = newId;
    copy.name = newName || `${original.name} (Copy)`;
    copy.slug = newSlug;
    copy.subdomain = newSlug;
    copy.publishedUrl = domainService.getPublishedUrl(newSlug);
    copy.status = 'DRAFT';
    copy.createdAt = new Date().toISOString();
    copy.updatedAt = new Date().toISOString();

    this.websites[newId] = copy;
    this.persist();
    return copy;
  }

  public archiveWebsite(websiteId: string): WebsiteModel | undefined {
    const site = this.websites[websiteId];
    if (!site) return undefined;
    site.status = 'ARCHIVED';
    site.updatedAt = new Date().toISOString();
    this.persist();
    websiteCacheService.invalidateWebsite(site.id, site.slug);
    return site;
  }

  public deleteWebsite(websiteId: string): boolean {
    if (!this.websites[websiteId]) return false;
    const slug = this.websites[websiteId].slug;
    delete this.websites[websiteId];
    this.persist();
    websiteCacheService.invalidateWebsite(websiteId, slug);
    return true;
  }

  /**
   * Synchronizes data between Google Sheet and Website sections
   */
  public async syncWithGoogleSheet(websiteId: string): Promise<{ success: boolean; message: string; rowsUpdated: number }> {
    const site = this.websites[websiteId];
    if (!site) return { success: false, message: 'Website not found', rowsUpdated: 0 };

    if (!site.googleSheetId) {
      return { success: false, message: 'No Google Sheet connected to this website.', rowsUpdated: 0 };
    }

    try {
      const sheetData = await providerRegistry.googleProvider.readSheet(site.googleSheetId, 'Menu!A1:Z50');
      site.lastSyncedAt = new Date().toISOString();
      site.updatedAt = new Date().toISOString();
      this.persist();
      websiteCacheService.invalidateWebsite(site.id, site.slug);

      return {
        success: true,
        message: `Successfully synchronized with Google Sheet (${sheetData.length} records processed).`,
        rowsUpdated: sheetData.length,
      };
    } catch (e: any) {
      return {
        success: false,
        message: `Sync failed: ${e?.message || 'Check Google permissions'}`,
        rowsUpdated: 0,
      };
    }
  }
}

export const websiteBuilderService = new WebsiteBuilderService();
