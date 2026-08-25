/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleSheetDatabaseProduct, BusinessProfile } from '../../types/business';
import { driveService } from '../google/driveService';
import { sheetsService } from '../google/sheetsService';
import { businessService } from './businessService';
import { websiteBuilderService } from './websiteBuilderService';

export const SHEET_DATABASE_PRODUCTS: GoogleSheetDatabaseProduct[] = [
  {
    id: 'db_prod_restaurant_pos',
    name: 'Enemind Restaurant, Cafe & Fast Food Management System',
    description:
      'Complete cloud Google Sheet database with digital menu sync, live M-PESA order webhook listener, kitchen queue tracker, and daily sales profit & loss reports.',
    category: 'RESTAURANT',
    templateId: 'tpl_restaurant_pos_v2',
    sheetStructure: {
      tabNames: ['Settings', 'Menu_Items', 'Orders', 'Daily_Sales', 'Inventory', 'Customers', 'Analytics'],
      columnHeaders: {
        Menu_Items: ['ID', 'Item Name', 'Category', 'Price (KSh)', 'Availability', 'Prep Time (Mins)', 'Options'],
        Orders: ['Order ID', 'Timestamp', 'Customer Name', 'Phone', 'Items', 'Total (KSh)', 'Status', 'M-PESA Receipt'],
        Daily_Sales: ['Date', 'Total Orders', 'Gross Revenue (KSh)', 'Cost of Goods', 'Net Profit', 'Top Item'],
      },
      sampleRowCount: 25,
    },
    appsScriptPackage: {
      hasMpesaWebhook: true,
      hasAutoConfirmEmail: true,
      hasInventoryAlerts: true,
      hasPdfInvoiceGenerator: true,
    },
    websiteTemplateId: 'tpl_web_restaurant',
    features: [
      'Automatic Two-Way Digital Menu Sync',
      'Instant M-PESA Buy Goods Webhook',
      'Kitchen Order Ticket (KOT) Auto-Logger',
      'Automated End-of-Day WhatsApp/Email Summary',
      'Hostel Room Delivery Address Mapper',
    ],
    priceKSh: 500,
    version: '2.4.0',
    status: 'ACTIVE',
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-08-15T08:00:00Z',
  },
  {
    id: 'db_prod_hostel_hotel_crm',
    name: 'Campus Hostel & Hotel Booking Management System',
    description:
      'Automated room inventory matrix, tenant rent tracking, deposit ledger, maintenance request manager, and visitor gate pass logger.',
    category: 'HOSTEL',
    templateId: 'tpl_hostel_crm_v2',
    sheetStructure: {
      tabNames: ['Settings', 'Room_Matrix', 'Tenants', 'Bookings', 'Rent_Ledger', 'Maintenance', 'Gate_Logs'],
      columnHeaders: {
        Room_Matrix: ['Room No', 'Type', 'Rent/Mo (KSh)', 'Deposit', 'Status', 'Current Tenant', 'Meter Reading'],
        Bookings: ['Booking ID', 'Student Name', 'University', 'Phone', 'Room Requested', 'Status', 'Payment Ref'],
        Rent_Ledger: ['Receipt No', 'Date', 'Tenant Name', 'Room No', 'Month', 'Amount Paid', 'Balance', 'M-PESA Code'],
      },
      sampleRowCount: 40,
    },
    appsScriptPackage: {
      hasMpesaWebhook: true,
      hasAutoConfirmEmail: true,
      hasInventoryAlerts: false,
      hasPdfInvoiceGenerator: true,
    },
    websiteTemplateId: 'tpl_web_hostel',
    features: [
      'Live Room Availability Matrix',
      'Automated Rent Due & Receipt SMS/Email',
      'Digital Tenancy Agreement PDF Creator',
      'Hostel Amenities & Rules Sync with Website',
      'Emergency Water/Electricity Token Tracker',
    ],
    priceKSh: 750,
    version: '2.3.0',
    status: 'ACTIVE',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-08-20T08:00:00Z',
  },
  {
    id: 'db_prod_salon_barber_crm',
    name: 'Salon, Barbershop & Spa Appointment Manager',
    description:
      'Multi-chair stylist scheduler, customer appointment calendar sync, service catalog pricing, and staff commission tracker.',
    category: 'SALON',
    templateId: 'tpl_salon_crm_v1',
    sheetStructure: {
      tabNames: ['Settings', 'Services', 'Stylists', 'Appointments', 'Commissions', 'Customer_Retention'],
      columnHeaders: {
        Services: ['Service ID', 'Service Name', 'Duration (Mins)', 'Price (KSh)', 'Stylist Assigned'],
        Appointments: ['Appt ID', 'Client Name', 'Phone', 'Service', 'Date & Time', 'Stylist', 'Status'],
      },
      sampleRowCount: 20,
    },
    appsScriptPackage: {
      hasMpesaWebhook: true,
      hasAutoConfirmEmail: true,
      hasInventoryAlerts: false,
      hasPdfInvoiceGenerator: false,
    },
    websiteTemplateId: 'tpl_web_salon',
    features: [
      'Live Stylist Availability Calendar',
      'Google Calendar Two-Way Appointment Sync',
      'Automated 1-Hour Reminder Emails',
      'Customer Loyalty Points & Discount Codes',
    ],
    priceKSh: 400,
    version: '1.8.0',
    status: 'ACTIVE',
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-08-18T08:00:00Z',
  },
];

export interface DeploymentResult {
  success: boolean;
  businessId: string;
  folderId: string;
  folderName: string;
  sheetId: string;
  sheetUrl: string;
  websiteId: string;
  websiteUrl: string;
  deployedTabs: string[];
  message: string;
}

export class GoogleSheetDeploymentService {
  public getProducts(): GoogleSheetDatabaseProduct[] {
    return SHEET_DATABASE_PRODUCTS;
  }

  public getProductById(id: string): GoogleSheetDatabaseProduct | undefined {
    return SHEET_DATABASE_PRODUCTS.find((p) => p.id === id);
  }

  public async deployProductForBusiness(
    productId: string,
    businessData: {
      businessName: string;
      category: BusinessProfile['category'];
      campus: string;
      city: string;
      phone: string;
      email: string;
      ownerId: string;
      ownerName: string;
    }
  ): Promise<DeploymentResult> {
    const product = this.getProductById(productId) || SHEET_DATABASE_PRODUCTS[0];
    const folderName = `ENEMIND BUSINESS/${businessData.businessName}`;

    // 1. Create Business Google Drive Folder
    const driveFolder = await driveService.createFile({
      name: businessData.businessName,
      mimeType: 'application/vnd.google-apps.folder',
      folderCategory: 'Marketplace',
      tags: ['BusinessDatabase', 'EnemindPhase7', product.category],
    });

    // 2. Create and initialize Google Sheet
    const sheetTitle = `${businessData.businessName} — Management System DB [v${product.version}]`;
    const createdSheet = await sheetsService.createSpreadsheet(sheetTitle);

    // 3. Create or update Business Profile
    const existingBiz = businessService.getBusinessesByOwner(businessData.ownerId)[0];
    let biz: BusinessProfile;

    if (existingBiz) {
      biz = businessService.updateBusiness(existingBiz.id, {
        googleDriveFolderId: driveFolder.id,
        googleDriveFolderName: folderName,
        googleSheetId: createdSheet.spreadsheetId,
        googleSheetUrl: createdSheet.spreadsheetUrl,
      })!;
    } else {
      biz = businessService.createBusiness({
        ownerId: businessData.ownerId,
        ownerName: businessData.ownerName,
        businessName: businessData.businessName,
        slug: businessData.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        category: businessData.category,
        description: `Official campus services by ${businessData.businessName} at ${businessData.campus}. Managed via Enemind Cloud Database.`,
        shortDescription: `Verified provider at ${businessData.campus}.`,
        logo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&auto=format&fit=crop&q=80',
        coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
        phone: businessData.phone,
        email: businessData.email,
        country: 'Kenya',
        city: businessData.city,
        campus: businessData.campus,
        location: `${businessData.campus} Vicinity`,
        address: `${businessData.city}, Kenya`,
        openingHours: { monday: '8:00 AM - 8:00 PM', isOpenNow: true },
        services: [],
        products: [],
        menu: [],
        pricingRange: 'KSh 100 - 15,000',
        currency: 'KSh',
        paymentMethods: ['M-PESA Till', 'Paybill'],
        bookingEnabled: true,
        orderingEnabled: true,
        deliveryEnabled: true,
        googleDriveFolderId: driveFolder.id,
        googleDriveFolderName: folderName,
        googleSheetId: createdSheet.spreadsheetId,
        googleSheetUrl: createdSheet.spreadsheetUrl,
      });
    }

    // 4. Generate Micro-website
    const website = websiteBuilderService.generateDefaultWebsiteForBusiness(biz);

    return {
      success: true,
      businessId: biz.id,
      folderId: driveFolder.id,
      folderName,
      sheetId: createdSheet.spreadsheetId,
      sheetUrl: createdSheet.spreadsheetUrl,
      websiteId: website.id,
      websiteUrl: website.publishedUrl,
      deployedTabs: product.sheetStructure.tabNames,
      message: `Successfully deployed "${product.name}" with automated Google Sheet database & live micro-website.`,
    };
  }
}

export const googleSheetDeploymentService = new GoogleSheetDeploymentService();
