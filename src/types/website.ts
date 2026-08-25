/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type WebsiteType =
  | 'BUSINESS'
  | 'PORTFOLIO'
  | 'PERSONAL'
  | 'CREATOR'
  | 'RESTAURANT'
  | 'CAFE'
  | 'HOSTEL'
  | 'HOTEL'
  | 'SHOP'
  | 'SERVICE'
  | 'TUTOR'
  | 'TEACHER'
  | 'MENTOR'
  | 'EVENT'
  | 'ORGANIZATION'
  | 'COMMUNITY'
  | 'CLUB'
  | 'PROFESSIONAL'
  | 'FREELANCER'
  | 'OTHER';

export type WebsiteStatus = 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'EXPIRED' | 'ARCHIVED';

export type WebsiteSubscriptionStatus =
  | 'TRIAL'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'SUSPENDED'
  | 'DEVELOPMENT';

export interface WebsiteSubscriptionPlan {
  planId: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  features: string[];
}

export interface WebsiteThemeConfig {
  themeName: 'EMERALD_CAMPUS' | 'MODERN_DARK' | 'WARM_AMBER' | 'OCEAN_BLUE' | 'ROSE_ELEGANCE' | 'MINIMAL_SLATE';
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  fontPreset: 'PLUS_JAKARTA' | 'OUTFIT' | 'INTER' | 'PLAYFAIR' | 'GEIST';
  radiusPreset: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  layoutStyle: 'MODERN_CLEAN' | 'BOLD_CAMPUS' | 'MINIMAL_LUXE' | 'CREATIVE_GRID';
}

export type WebsiteSectionType =
  | 'HERO'
  | 'ABOUT'
  | 'SERVICES'
  | 'PRODUCTS'
  | 'MENU'
  | 'ROOMS'
  | 'PROJECTS'
  | 'PORTFOLIO'
  | 'PRICING'
  | 'GALLERY'
  | 'REVIEWS'
  | 'TESTIMONIALS'
  | 'TEAM'
  | 'BOOKING'
  | 'ORDERING'
  | 'EVENTS'
  | 'POSTS'
  | 'LOCATION'
  | 'CONTACT'
  | 'FAQ'
  | 'SOCIAL_LINKS'
  | 'CALL_TO_ACTION'
  | 'FOOTER'
  | 'CUSTOM_HTML';

export type SectionType = WebsiteSectionType;

export interface WebsiteSection {
  id: string;
  type: WebsiteSectionType;
  title: string;
  subtitle?: string;
  isVisible: boolean;
  order: number;
  content: Record<string, any>;
  dataSource?: 'STATIC' | 'GOOGLE_SHEET' | 'HYBRID';
  sheetTab?: string;
}

export interface WebsitePage {
  id: string;
  title: string;
  slug: string; // e.g. '', 'about', 'services', 'menu', 'contact'
  navLabel: string;
  layout: 'STANDARD' | 'FULL_WIDTH' | 'LANDING';
  sections: WebsiteSection[];
  isPublished: boolean;
  isCustom: boolean;
  order: number;
  metaDescription?: string;
}

export interface WebsiteNavigationItem {
  id: string;
  label: string;
  path: string;
  pageId?: string;
  isExternal?: boolean;
  externalUrl?: string;
  isVisible: boolean;
  order: number;
}

export interface SheetColumnMapping {
  fieldKey: string;
  fieldLabel: string;
  sheetTab: string;
  sheetColumn: string;
  dataType: 'string' | 'number' | 'boolean' | 'date' | 'image' | 'array';
  isPublic: boolean;
  isReadOnly: boolean;
  defaultValue?: any;
}

export interface WebsiteDatabaseSchema {
  websiteType: WebsiteType;
  schemaName: string;
  description: string;
  recommendedTabs: {
    tabName: string;
    description: string;
    columns: string[];
    sampleData: Record<string, any>[];
  }[];
}

export interface PublicFieldRule {
  tabName: string;
  safeColumns: string[];
  restrictedColumns: string[]; // e.g. 'cost', 'supplier', 'profit', 'internal_notes', 'customer_phone'
}

export interface WebsiteFormSubmission {
  id: string;
  websiteId: string;
  formType: 'CONTACT' | 'BOOKING' | 'ORDER' | 'REGISTRATION' | 'INQUIRY' | 'FEEDBACK';
  data: Record<string, any>;
  submittedAt: string;
  syncedToSheet: boolean;
  ipHash?: string;
  status: 'NEW' | 'PROCESSED' | 'SPAM' | 'ARCHIVED';
}

export interface WebsiteAnalyticsSummary {
  totalViews: number;
  uniqueVisitors: number;
  popularPages: { slug: string; title: string; views: number }[];
  popularItems: { name: string; category: string; clicks: number }[];
  contactClicks: number;
  bookingClicks: number;
  orderStarts: number;
  completedOrders: number;
  dailyViews: { date: string; views: number }[];
}

export interface WebsiteSEOConfig {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords: string[];
  robotsIndex: boolean;
  structuredDataType?: 'Organization' | 'LocalBusiness' | 'Person' | 'Restaurant' | 'Event';
}

export interface WebsiteModel {
  id: string;
  ownerId: string;
  ownerName: string;
  name: string;
  slug: string; // e.g. "chef-brian" -> "chef-brian.enemind.app"
  description: string;
  type: WebsiteType;
  templateId: string;
  status: WebsiteStatus;
  subscriptionPlan: WebsiteSubscriptionPlan;
  subscriptionStatus: WebsiteSubscriptionStatus;
  subscriptionExpiresAt?: string;
  gracePeriodEndsAt?: string;
  isDevelopmentMode?: boolean;

  // Google ecosystem integration
  googleSheetId?: string;
  googleSheetUrl?: string;
  googleDriveFolderId?: string;
  googleDriveFolderName?: string;
  isExistingSheetConnected?: boolean;
  sheetMappings: SheetColumnMapping[];
  publicFieldRules: PublicFieldRule[];
  lastSyncedAt?: string;

  // Domain & Routing
  customDomain?: string;
  subdomain: string; // e.g. "chef-brian"
  publishedUrl: string; // e.g. "https://chef-brian.enemind.app"
  isListedInCampusLife: boolean;

  // Design & Architecture
  theme: WebsiteThemeConfig;
  pages: WebsitePage[];
  navigation: WebsiteNavigationItem[];
  seo: WebsiteSEOConfig;
  analytics: WebsiteAnalyticsSummary;

  // Metadata
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  description: string;
  category: WebsiteType;
  thumbnail: string;
  previewImages: string[];
  defaultTheme: WebsiteThemeConfig;
  defaultPages: WebsitePage[];
  recommendedSchema: WebsiteDatabaseSchema;
  badge?: string;
}
