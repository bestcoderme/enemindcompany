/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BusinessCategory =
  | 'HOSTEL'
  | 'HOTEL'
  | 'RESTAURANT'
  | 'CAFE'
  | 'SHOP'
  | 'SALON'
  | 'BARBERSHOP'
  | 'LAUNDRY'
  | 'PRINTING'
  | 'CYBER'
  | 'TRANSPORT'
  | 'GYM'
  | 'SPORTS'
  | 'ENTERTAINMENT'
  | 'EVENT_ORGANIZER'
  | 'PHOTOGRAPHER'
  | 'REPAIR_SERVICE'
  | 'TUTOR'
  | 'FREELANCER'
  | 'STUDENT_BUSINESS'
  | 'CAMPUS_ORGANIZATION'
  | 'OTHER';

export type BusinessVerificationStatus = 'UNVERIFIED' | 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED';

export interface BusinessMenuItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  image?: string;
  isAvailable: boolean;
  preparationTimeMinutes?: number;
  isPopular?: boolean;
  options?: { name: string; price: number }[];
}

export interface BusinessServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  durationMinutes: number;
  isAvailable: boolean;
  requiresBooking: boolean;
  image?: string;
}

export interface BusinessProductItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  stockQuantity: number;
  image?: string;
  isAvailable: boolean;
}

export interface BusinessRoomOption {
  id: string;
  name: string;
  roomType: 'Single' | 'Double' | 'One-Bedroom' | 'Bedsitter' | 'Studio' | 'Deluxe';
  priceMonthly: number;
  depositAmount: number;
  currency: string;
  availableUnits: number;
  amenities: string[];
  description: string;
  image?: string;
}

export interface BusinessReview {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  verifiedCustomer?: boolean;
  orderOrBookingRef?: string;
  ownerReply?: string;
}

export interface BusinessOpeningHours {
  monday?: string;
  tuesday?: string;
  wednesday?: string;
  thursday?: string;
  friday?: string;
  saturday?: string;
  sunday?: string;
  isOpenNow?: boolean;
}

export interface BusinessProfile {
  id: string;
  ownerId: string;
  ownerName?: string;
  businessName: string;
  slug: string;
  category: BusinessCategory;
  subcategory?: string;
  description: string;
  shortDescription: string;
  logo: string;
  coverImage: string;
  gallery?: string[];
  phone: string;
  whatsappNumber?: string;
  email: string;
  website?: string;
  country: string;
  city: string;
  campus: string;
  universityName?: string;
  location: string;
  address: string;
  distanceFromCampus?: string;
  latitude?: number;
  longitude?: number;
  openingHours: BusinessOpeningHours;
  services: BusinessServiceItem[];
  products: BusinessProductItem[];
  menu: BusinessMenuItem[];
  roomOptions?: BusinessRoomOption[];
  amenities?: string[];
  pricingRange: string;
  currency: string;
  paymentMethods: string[];
  bookingEnabled: boolean;
  orderingEnabled: boolean;
  deliveryEnabled: boolean;
  verificationStatus: BusinessVerificationStatus;
  rating: number;
  reviewCount: number;
  reviews?: BusinessReview[];
  googleDriveFolderId?: string;
  googleDriveFolderName?: string;
  googleSheetId?: string;
  googleSheetUrl?: string;
  websiteId?: string;
  isStudentOwned?: boolean;
  mpesaTillOrPaybill?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// MICRO-WEBSITE BUILDER MODELS
// -------------------------------------------------------------

import { WebsiteSection, WebsiteSectionType, WebsiteThemeConfig } from './website';
export type { WebsiteSection, WebsiteSectionType, WebsiteThemeConfig };

export interface BusinessWebsite {
  id: string;
  businessId: string;
  slug: string;
  title: string;
  tagline: string;
  theme: WebsiteThemeConfig;
  sections: WebsiteSection[];
  isPublished: boolean;
  publishedUrl: string;
  customDomain?: string;
  analytics: {
    totalViews: number;
    uniqueVisitors: number;
    menuViews: number;
    bookingClicks: number;
    orderClicks: number;
    contactClicks: number;
  };
  lastSyncedWithSheetAt?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// ORDERS & BOOKINGS MODELS
// -------------------------------------------------------------

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  specialInstructions?: string;
}

export interface BusinessOrder {
  id: string;
  businessId: string;
  businessName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  currency: string;
  deliveryMethod: 'DELIVERY' | 'PICKUP' | 'DINE_IN';
  deliveryAddress?: string;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'COMPLETED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: 'MPESA' | 'CASH_ON_DELIVERY' | 'CARD';
  mpesaReceiptNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BusinessBooking {
  id: string;
  businessId: string;
  businessName: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceId?: string;
  serviceName: string;
  date: string;
  timeSlot: string;
  guestsCount?: number;
  notes?: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  paymentStatus: 'PENDING' | 'PAID' | 'FREE';
  amount: number;
  currency: string;
  googleCalendarEventId?: string;
  googleMeetUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// CAMPUS EVENTS MODEL
// -------------------------------------------------------------

export type CampusEventType =
  | 'CONCERT'
  | 'SPORTS'
  | 'ACADEMIC'
  | 'CAREER'
  | 'NETWORKING'
  | 'CLUB'
  | 'ENTERTAINMENT'
  | 'WORKSHOP'
  | 'CONFERENCE'
  | 'PARTY'
  | 'COMMUNITY'
  | 'OTHER';

export interface CampusEvent {
  id: string;
  organizerId: string;
  organizerName: string;
  organizerType: 'STUDENT_LEADER' | 'CAMPUS_BUSINESS' | 'UNIVERSITY_DEPT' | 'CLUB' | 'EXTERNAL';
  title: string;
  description: string;
  category: CampusEventType;
  venue: string;
  campus: string;
  city: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: string;
  isFree: boolean;
  capacity?: number;
  registeredCount: number;
  registrationUrl?: string;
  image: string;
  status: 'UPCOMING' | 'LIVE' | 'PAST' | 'CANCELLED';
  tags: string[];
  googleCalendarLink?: string;
  createdAt: string;
  updatedAt: string;
}

// -------------------------------------------------------------
// AUTOMATED GOOGLE SHEET DATABASE PRODUCT
// -------------------------------------------------------------

export interface GoogleSheetDatabaseProduct {
  id: string;
  name: string;
  description: string;
  category: 'RESTAURANT' | 'HOTEL' | 'HOSTEL' | 'SALON' | 'INVENTORY' | 'CLUB' | 'GENERAL';
  templateId: string;
  sheetStructure: {
    tabNames: string[];
    columnHeaders: Record<string, string[]>;
    sampleRowCount: number;
  };
  appsScriptPackage: {
    hasMpesaWebhook: boolean;
    hasAutoConfirmEmail: boolean;
    hasInventoryAlerts: boolean;
    hasPdfInvoiceGenerator: boolean;
  };
  websiteTemplateId: string;
  features: string[];
  priceKSh: number;
  version: string;
  status: 'ACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
}
