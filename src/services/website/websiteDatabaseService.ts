/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  WebsiteType,
  WebsiteDatabaseSchema,
  SheetColumnMapping,
  PublicFieldRule,
  WebsiteFormSubmission,
} from '../../types/website';
import { providerRegistry } from '../providers/providerRegistry';

export class WebsiteDatabaseService {
  /**
   * Generates recommended Google Sheet database schemas tailored to website purpose
   */
  public getRecommendedSchema(type: WebsiteType): WebsiteDatabaseSchema {
    switch (type) {
      case 'RESTAURANT':
      case 'CAFE':
        return {
          websiteType: type,
          schemaName: 'Restaurant & Dining Database',
          description: 'Tracks menu items, prices, active orders, table bookings, customer reviews, and daily inventory.',
          recommendedTabs: [
            {
              tabName: 'Settings',
              description: 'General establishment info, contact, and opening hours',
              columns: ['BusinessName', 'Tagline', 'Phone', 'WhatsApp', 'Email', 'Location', 'Campus', 'OpeningHours', 'Currency'],
              sampleData: [
                {
                  BusinessName: 'Campus Chill & Grill',
                  Tagline: 'Best burgers, wraps & smoothies near Gate B',
                  Phone: '+254712345678',
                  WhatsApp: '+254712345678',
                  Email: 'orders@campuschill.co.ke',
                  Location: 'Student Centre, 1st Floor',
                  Campus: 'Main Campus',
                  OpeningHours: 'Mon-Sat 8:00 AM - 10:00 PM',
                  Currency: 'KES',
                },
              ],
            },
            {
              tabName: 'Menu',
              description: 'Public meal items, categories, pricing, and availability',
              columns: ['ID', 'Name', 'Category', 'Description', 'Price', 'IsAvailable', 'PreparationMinutes', 'ImageUrl', 'Cost', 'InternalNotes'],
              sampleData: [
                { ID: 'm1', Name: 'Smash Beef Burger & Fries', Category: 'Mains', Description: 'Double beef patty with cheddar cheese and seasoned chips', Price: 450, IsAvailable: true, PreparationMinutes: 15, ImageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', Cost: 220, InternalNotes: 'Order fresh buns daily from Bakers' },
                { ID: 'm2', Name: 'Crispy Chicken Wings (6pcs)', Category: 'Mains', Description: 'Spicy peri-peri glazed fried wings with garlic dip', Price: 380, IsAvailable: true, PreparationMinutes: 12, ImageUrl: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=500', Cost: 180, InternalNotes: 'Sauce batch prepared every morning' },
                { ID: 'm3', Name: 'Passion Fruit Smoothie', Category: 'Drinks', Description: 'Fresh local passion blend with honey and mint', Price: 180, IsAvailable: true, PreparationMinutes: 5, ImageUrl: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=500', Cost: 60, InternalNotes: 'Fruit supplier: Mama Mary' },
              ],
            },
            {
              tabName: 'Orders',
              description: 'Customer order logs with delivery address and payment receipts',
              columns: ['OrderID', 'CustomerName', 'CustomerPhone', 'CustomerEmail', 'Items', 'TotalAmount', 'PaymentMethod', 'ReceiptNumber', 'Status', 'Timestamp'],
              sampleData: [
                { OrderID: 'ORD-101', CustomerName: 'Brian Omondi', CustomerPhone: '+254701234567', CustomerEmail: 'brian@student.uonbi.ac.ke', Items: 'Smash Beef Burger x1, Passion Smoothie x1', TotalAmount: 630, PaymentMethod: 'MPESA', ReceiptNumber: 'QK89102938', Status: 'COMPLETED', Timestamp: new Date().toISOString() },
              ],
            },
            {
              tabName: 'Bookings',
              description: 'Table reservations and group bookings',
              columns: ['BookingID', 'CustomerName', 'CustomerPhone', 'GuestsCount', 'Date', 'TimeSlot', 'Notes', 'Status'],
              sampleData: [
                { BookingID: 'BK-201', CustomerName: 'Grace Wanjiru', CustomerPhone: '+254722334455', GuestsCount: 4, Date: '2026-09-01', TimeSlot: '19:00', Notes: 'Corner booth preferred', Status: 'CONFIRMED' },
              ],
            },
            {
              tabName: 'Reviews',
              description: 'Customer ratings and feedback',
              columns: ['ReviewID', 'CustomerName', 'Rating', 'Comment', 'Date', 'IsVerified'],
              sampleData: [
                { ReviewID: 'REV-1', CustomerName: 'Alex K.', Rating: 5, Comment: 'Portions are great and food arrives hot in Hall 3!', Date: '2026-08-20', IsVerified: true },
              ],
            },
          ],
        };

      case 'HOSTEL':
      case 'HOTEL':
        return {
          websiteType: type,
          schemaName: 'Hostel & Accommodations Database',
          description: 'Manages student room types, available units, tenant bookings, amenities, and rental payments.',
          recommendedTabs: [
            {
              tabName: 'Settings',
              description: 'Hostel name, caretaker contacts, gate rules, and university distance',
              columns: ['HostelName', 'Tagline', 'Phone', 'WhatsApp', 'Email', 'Location', 'DistanceFromCampus', 'GateCurfew', 'DepositRule'],
              sampleData: [
                { HostelName: 'Executive Palms Student Residences', Tagline: 'Modern, secure & serene hostels 5 mins from campus gate', Phone: '+254711223344', WhatsApp: '+254711223344', Email: 'caretaker@executivepalms.co.ke', Location: 'Lower Kabete Road, Plot 14', DistanceFromCampus: '350 meters (5 min walk)', GateCurfew: '11:00 PM', DepositRule: '1 Month Rent Refundable' },
              ],
            },
            {
              tabName: 'Rooms',
              description: 'Room options, monthly rates, deposits, and unit availability',
              columns: ['ID', 'RoomType', 'MonthlyPrice', 'DepositAmount', 'AvailableUnits', 'Amenities', 'Description', 'ImageUrl', 'LandlordShare', 'InternalMaintenanceNotes'],
              sampleData: [
                { ID: 'r1', RoomType: 'Deluxe Single (En-suite)', MonthlyPrice: 12000, DepositAmount: 12000, AvailableUnits: 3, Amenities: 'Private Bathroom, High-speed WiFi, Study Table, Wardrobe, Balcony', Description: 'Spacious self-contained room with tiled floors and hot shower', ImageUrl: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500', LandlordShare: 10500, InternalMaintenanceNotes: 'Repainted August 2026' },
                { ID: 'r2', RoomType: 'Modern Bedsitter', MonthlyPrice: 16000, DepositAmount: 16000, AvailableUnits: 2, Amenities: 'Private Kitchenette, En-suite Bathroom, Unlimited WiFi, Backup Generator, CCTV', Description: 'Full bedsitter with cooking counter and fitted sink', ImageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500', LandlordShare: 14000, InternalMaintenanceNotes: 'Water meters checked monthly' },
                { ID: 'r3', RoomType: 'Standard Shared Double', MonthlyPrice: 7500, DepositAmount: 7500, AvailableUnits: 6, Amenities: 'Shared Bathroom, WiFi, 2 Study Desks, 2 Wardrobes', Description: 'Economical double room with bunk/twin arrangement', ImageUrl: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=500', LandlordShare: 6500, InternalMaintenanceNotes: 'Mattresses inspected each semester' },
              ],
            },
            {
              tabName: 'Bookings',
              description: 'Room reservations and visit appointments',
              columns: ['BookingID', 'StudentName', 'StudentPhone', 'StudentEmail', 'RoomType', 'MoveInDate', 'DepositReceipt', 'Status', 'CreatedAt'],
              sampleData: [
                { BookingID: 'HST-301', StudentName: 'Faith Chebet', StudentPhone: '+254703998877', StudentEmail: 'faith@students.ku.ac.ke', RoomType: 'Deluxe Single (En-suite)', MoveInDate: '2026-09-05', DepositReceipt: 'DEV_MPESA_001', Status: 'CONFIRMED', CreatedAt: new Date().toISOString() },
              ],
            },
            {
              tabName: 'Amenities',
              description: 'Hostel features and security installations',
              columns: ['Amenity', 'Category', 'Description', 'IsIncluded'],
              sampleData: [
                { Amenity: 'High-speed Fiber WiFi', Category: 'Utilities', Description: '100Mbps dedicated connection on all floors', IsIncluded: true },
                { Amenity: '24/7 CCTV & Biometric Gate Access', Category: 'Security', Description: 'Guard on duty with electric perimeter fence', IsIncluded: true },
                { Amenity: 'Hot Showers & Borehole Water', Category: 'Utilities', Description: 'Solar backup hot water with constant water supply', IsIncluded: true },
              ],
            },
          ],
        };

      case 'PORTFOLIO':
      case 'FREELANCER':
      case 'CREATOR':
      case 'PERSONAL':
        return {
          websiteType: type,
          schemaName: 'Portfolio, Creator & Freelancer Database',
          description: 'Highlights projects, services, client testimonials, media items, and collaboration inquiries.',
          recommendedTabs: [
            {
              tabName: 'Settings',
              description: 'Bio, headline, contact handles, and social links',
              columns: ['FullName', 'ProfessionalHeadline', 'Bio', 'Email', 'Phone', 'Location', 'GitHub', 'LinkedIn', 'Instagram', 'Twitter'],
              sampleData: [
                { FullName: 'Kevin Mutua', ProfessionalHeadline: 'Full-Stack Developer & UI/UX Designer', Bio: 'Computer Science finalist building resilient web systems and delightful digital experiences.', Email: 'kevin.mutua@dev.ke', Phone: '+254799887766', Location: 'Nairobi, Kenya', GitHub: 'https://github.com/kevinmutua', LinkedIn: 'https://linkedin.com/in/kevinmutua', Instagram: '@kevindev', Twitter: '@kevin_tech' },
              ],
            },
            {
              tabName: 'Projects',
              description: 'Completed projects, case studies, and code links',
              columns: ['ID', 'Title', 'Category', 'Description', 'Technologies', 'LiveUrl', 'GitHubUrl', 'ImageUrl', 'ClientName', 'InternalBudget'],
              sampleData: [
                { ID: 'p1', Title: 'SokoBora — University Campus Marketplace', Category: 'Web Application', Description: 'Real-time student trading hub with instant M-PESA escrow payments and campus pickup points', Technologies: 'React, TypeScript, Tailwind, Node.js, Express', LiveUrl: 'https://sokobora.enemind.app', GitHubUrl: 'https://github.com/kevinmutua/sokobora', ImageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500', ClientName: 'Self-initiated', InternalBudget: 0 },
                { ID: 'p2', Title: 'FinTrack — Micro-Savings & Budgeting Mobile App', Category: 'Fintech UI', Description: 'Chama & student budget organizer with automated expense categorization', Technologies: 'React Native, Tailwind, Chart.js', LiveUrl: 'https://fintrack.enemind.app', GitHubUrl: 'https://github.com/kevinmutua/fintrack', ImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500', ClientName: 'Campus Fintech Club', InternalBudget: 25000 },
              ],
            },
            {
              tabName: 'Services',
              description: 'Freelance offerings, packages, and pricing',
              columns: ['ID', 'ServiceName', 'PriceFrom', 'Duration', 'Description', 'Deliverables'],
              sampleData: [
                { ID: 's1', ServiceName: 'Custom Web Development & MVP Building', PriceFrom: 15000, Duration: '1-2 Weeks', Description: 'Full responsive website built with modern React, SEO optimization and Google Sheets backend', Deliverables: 'Source code, hosting setup, CMS setup, 30 days support' },
                { ID: 's2', ServiceName: 'UI/UX Design & Interactive Prototypes', PriceFrom: 8000, Duration: '3-5 Days', Description: 'Clean, modern Figma designs tailored to Kenyan mobile user workflows', Deliverables: 'Figma file, design system, interactive prototype' },
              ],
            },
            {
              tabName: 'Testimonials',
              description: 'Client reviews and feedback quotes',
              columns: ['ID', 'ClientName', 'ClientRole', 'Company', 'Rating', 'Quote'],
              sampleData: [
                { ID: 't1', ClientName: 'Dr. Esther Kariuki', ClientRole: 'Department Head', Company: 'School of Computing', Rating: 5, Quote: 'Kevin delivered our department symposium portal on time with excellent attention to detail.' },
              ],
            },
            {
              tabName: 'Inquiries',
              description: 'Contact form leads and project briefs',
              columns: ['ID', 'SenderName', 'SenderEmail', 'SenderPhone', 'ProjectSubject', 'Message', 'Budget', 'Timestamp'],
              sampleData: [
                { ID: 'inq-1', SenderName: 'Dennis Kimathi', SenderEmail: 'dennis@biznest.co.ke', SenderPhone: '+254711998877', ProjectSubject: 'E-commerce platform inquiry', Message: 'Looking to build a clothing store website for campus students', Budget: 'KES 25,000', Timestamp: new Date().toISOString() },
              ],
            },
          ],
        };

      case 'TUTOR':
      case 'TEACHER':
      case 'MENTOR':
        return {
          websiteType: type,
          schemaName: 'Tutor, Educator & Mentor Database',
          description: 'Manages subjects taught, tutoring schedules, hourly rates, booking requests, and study materials.',
          recommendedTabs: [
            {
              tabName: 'Settings',
              description: 'Tutor profile, subjects, rates, and educational background',
              columns: ['TutorName', 'Headline', 'Subjects', 'HourlyRate', 'Email', 'Phone', 'Campus', 'AvailableHours', 'MeetLink'],
              sampleData: [
                { TutorName: 'Caleb Ombongi', Headline: 'Engineering Math & Data Structures Specialist', Subjects: 'Calculus, Linear Algebra, Python, C++, Data Structures', HourlyRate: 600, Email: 'caleb.tutor@gmail.com', Phone: '+254712990011', Campus: 'Chiromo Campus', AvailableHours: 'Mon-Fri 4PM-8PM, Sat 9AM-2PM', MeetLink: 'https://meet.google.com/abc-defg-hij' },
              ],
            },
            {
              tabName: 'Courses',
              description: 'Topics, syllabus coverage, and group workshop dates',
              columns: ['ID', 'CourseTitle', 'Level', 'Description', 'PricePerStudent', 'Schedule', 'MaxStudents'],
              sampleData: [
                { ID: 'c1', CourseTitle: 'Engineering Mathematics II Intensive Revision', Level: 'Year 1 & 2', Description: 'Complete coverage of Differential Equations, Laplace Transforms & Vector Calculus with past paper drill', PricePerStudent: 1500, Schedule: 'Saturdays 10:00 AM - 1:00 PM', MaxStudents: 15 },
              ],
            },
            {
              tabName: 'Bookings',
              description: 'Tutoring session bookings and inquiries',
              columns: ['BookingID', 'StudentName', 'StudentPhone', 'Subject', 'Date', 'TimeSlot', 'Status'],
              sampleData: [
                { BookingID: 'TB-101', StudentName: 'Samuel Maina', StudentPhone: '+254722114477', Subject: 'Calculus II', Date: '2026-08-28', TimeSlot: '16:00', Status: 'CONFIRMED' },
              ],
            },
          ],
        };

      case 'SHOP':
      case 'BUSINESS':
      default:
        return {
          websiteType: type,
          schemaName: 'General Business & Shop Database',
          description: 'Versatile database for catalog items, stock levels, orders, and customer queries.',
          recommendedTabs: [
            {
              tabName: 'Settings',
              description: 'Store name, contacts, delivery policy, and location',
              columns: ['StoreName', 'Tagline', 'Phone', 'WhatsApp', 'Email', 'Location', 'DeliveryFee', 'Currency'],
              sampleData: [
                { StoreName: 'Campus Essentials Hub', Tagline: 'Electronics, stationery, printing & student accessories', Phone: '+254712009988', WhatsApp: '+254712009988', Email: 'support@campusessentials.co.ke', Location: 'Hostel A Arcade, Shop 3', DeliveryFee: '50', Currency: 'KES' },
              ],
            },
            {
              tabName: 'Products',
              description: 'Inventory items, prices, stock count, and images',
              columns: ['ID', 'Name', 'Category', 'Description', 'Price', 'StockQuantity', 'ImageUrl', 'IsAvailable', 'Cost', 'SupplierPhone', 'ProfitMargin'],
              sampleData: [
                { ID: 'prod-1', Name: 'Scientific Calculator fx-991EX ClassWiz', Category: 'Stationery', Description: 'Original Casio solar-powered scientific calculator with matrix & equation solver', Price: 2800, StockQuantity: 12, ImageUrl: 'https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=500', IsAvailable: true, Cost: 2100, SupplierPhone: '+254720112233', ProfitMargin: 700 },
                { ID: 'prod-2', Name: 'Type-C Fast Charging Cable (2M Nylon Braided)', Category: 'Electronics', Description: 'Heavy-duty 65W charging & high-speed data transfer cable', Price: 450, StockQuantity: 30, ImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500', IsAvailable: true, Cost: 180, SupplierPhone: '+254720112233', ProfitMargin: 270 },
                { ID: 'prod-3', Name: 'Spiral Bound Quad Notebook (200 Pages)', Category: 'Stationery', Description: 'Heavy GSM ruled student notebook with divider pockets', Price: 250, StockQuantity: 45, ImageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500', IsAvailable: true, Cost: 120, SupplierPhone: '+254720112233', ProfitMargin: 130 },
              ],
            },
            {
              tabName: 'Orders',
              description: 'Customer purchase orders with M-PESA confirmation',
              columns: ['OrderID', 'CustomerName', 'CustomerPhone', 'CustomerEmail', 'Items', 'TotalAmount', 'PaymentReceipt', 'DeliveryLocation', 'Status', 'Timestamp'],
              sampleData: [
                { OrderID: 'ORD-901', CustomerName: 'Mercy Achieng', CustomerPhone: '+254714556677', CustomerEmail: 'mercy@student.egerton.ac.ke', Items: 'Scientific Calculator fx-991EX x1', TotalAmount: 2850, PaymentReceipt: 'DEV_MPESA_998', DeliveryLocation: 'Taifa Hall Room 12', Status: 'COMPLETED', Timestamp: new Date().toISOString() },
              ],
            },
            {
              tabName: 'Messages',
              description: 'Customer inquiries and feedback notes',
              columns: ['ID', 'Name', 'Phone', 'Email', 'Message', 'Timestamp'],
              sampleData: [
                { ID: 'msg-1', Name: 'Evans Kiprop', Phone: '+254799112233', Email: 'evans@gmail.com', Message: 'Do you offer bulk printing for class lab manuals?', Timestamp: new Date().toISOString() },
              ],
            },
          ],
        };
    }
  }

  /**
   * Generates default safe public field rules
   * Prevents exposure of sensitive business data (costs, profit, internal notes, supplier numbers)
   */
  public getDefaultPublicFieldRules(type: WebsiteType): PublicFieldRule[] {
    return [
      {
        tabName: 'Settings',
        safeColumns: ['BusinessName', 'HostelName', 'StoreName', 'TutorName', 'FullName', 'Tagline', 'Headline', 'ProfessionalHeadline', 'Bio', 'Phone', 'WhatsApp', 'Email', 'Location', 'Campus', 'OpeningHours', 'Currency', 'DistanceFromCampus', 'GateCurfew', 'GitHub', 'LinkedIn', 'Instagram', 'Twitter', 'Subjects', 'HourlyRate', 'AvailableHours'],
        restrictedColumns: ['InternalOwnerNotes', 'Password', 'SecretKey', 'AdminPin'],
      },
      {
        tabName: 'Menu',
        safeColumns: ['ID', 'Name', 'Category', 'Description', 'Price', 'IsAvailable', 'PreparationMinutes', 'ImageUrl'],
        restrictedColumns: ['Cost', 'Supplier', 'SupplierPhone', 'Profit', 'InternalNotes', 'ChefNotes'],
      },
      {
        tabName: 'Rooms',
        safeColumns: ['ID', 'RoomType', 'MonthlyPrice', 'DepositAmount', 'AvailableUnits', 'Amenities', 'Description', 'ImageUrl'],
        restrictedColumns: ['LandlordShare', 'InternalMaintenanceNotes', 'CaretakerPasscode', 'ProfitMargin'],
      },
      {
        tabName: 'Products',
        safeColumns: ['ID', 'Name', 'Category', 'Description', 'Price', 'StockQuantity', 'ImageUrl', 'IsAvailable'],
        restrictedColumns: ['Cost', 'Supplier', 'SupplierPhone', 'ProfitMargin', 'WholesalePrice', 'WarehouseBin'],
      },
      {
        tabName: 'Projects',
        safeColumns: ['ID', 'Title', 'Category', 'Description', 'Technologies', 'LiveUrl', 'GitHubUrl', 'ImageUrl'],
        restrictedColumns: ['InternalBudget', 'ClientContactPhone', 'ContractRate', 'PrivateRepositoryKey'],
      },
      {
        tabName: 'Reviews',
        safeColumns: ['ReviewID', 'CustomerName', 'Rating', 'Comment', 'Date', 'IsVerified'],
        restrictedColumns: ['CustomerPhone', 'IPAddress', 'InternalFlag'],
      },
      {
        tabName: 'Testimonials',
        safeColumns: ['ID', 'ClientName', 'ClientRole', 'Company', 'Rating', 'Quote'],
        restrictedColumns: ['ClientPhone', 'ClientPrivateEmail'],
      },
      {
        tabName: 'Services',
        safeColumns: ['ID', 'ServiceName', 'PriceFrom', 'Duration', 'Description', 'Deliverables'],
        restrictedColumns: ['CostOfDelivery', 'SubcontractorRate', 'InternalNotes'],
      },
      {
        tabName: 'Courses',
        safeColumns: ['ID', 'CourseTitle', 'Level', 'Description', 'PricePerStudent', 'Schedule', 'MaxStudents'],
        restrictedColumns: ['TutorPayout', 'AdminNotes'],
      },
      {
        tabName: 'Amenities',
        safeColumns: ['Amenity', 'Category', 'Description', 'IsIncluded'],
        restrictedColumns: ['InstallationCost', 'Vendor'],
      },
    ];
  }

  /**
   * Public Safe Data Sanitizer: Strips out restricted / private fields before sending to visitor UI
   */
  public sanitizePublicData(
    tabName: string,
    rawRecords: Record<string, any>[],
    rules: PublicFieldRule[]
  ): Record<string, any>[] {
    const rule = rules.find((r) => r.tabName.toLowerCase() === tabName.toLowerCase());
    if (!rule) {
      // Default safe whitelist
      const sensitiveKeywords = ['cost', 'profit', 'supplier', 'supplierphone', 'password', 'pin', 'secret', 'landlordshare', 'internalnotes', 'maintenancenotes', 'budget'];
      return rawRecords.map((item) => {
        const clean: Record<string, any> = {};
        Object.keys(item).forEach((k) => {
          if (!sensitiveKeywords.includes(k.toLowerCase())) {
            clean[k] = item[k];
          }
        });
        return clean;
      });
    }

    return rawRecords.map((item) => {
      const clean: Record<string, any> = {};
      Object.keys(item).forEach((k) => {
        const isRestricted = rule.restrictedColumns.some((rc) => rc.toLowerCase() === k.toLowerCase());
        if (!isRestricted) {
          clean[k] = item[k];
        }
      });
      return clean;
    });
  }

  /**
   * Auto-detects columns and generates mapping for connecting an existing Google Sheet
   */
  public generateExistingSheetMapping(
    detectedHeadersByTab: Record<string, string[]>,
    websiteType: WebsiteType
  ): SheetColumnMapping[] {
    const schema = this.getRecommendedSchema(websiteType);
    const mappings: SheetColumnMapping[] = [];

    schema.recommendedTabs.forEach((recommendedTab) => {
      // Find closest tab name in detected tabs
      const availableTabs = Object.keys(detectedHeadersByTab);
      const matchedTab =
        availableTabs.find((t) => t.toLowerCase() === recommendedTab.tabName.toLowerCase()) ||
        availableTabs[0] ||
        recommendedTab.tabName;

      const detectedColumns = detectedHeadersByTab[matchedTab] || [];

      recommendedTab.columns.forEach((colName) => {
        // Find best column match
        const matchedCol =
          detectedColumns.find((dc) => dc.toLowerCase().trim() === colName.toLowerCase().trim()) ||
          detectedColumns.find((dc) => dc.toLowerCase().includes(colName.toLowerCase())) ||
          colName;

        const isPublic = !['cost', 'profit', 'supplier', 'notes', 'internal'].some((w) =>
          colName.toLowerCase().includes(w)
        );

        mappings.push({
          fieldKey: `${recommendedTab.tabName.toLowerCase()}_${colName.toLowerCase()}`,
          fieldLabel: `${recommendedTab.tabName} > ${colName}`,
          sheetTab: matchedTab,
          sheetColumn: matchedCol,
          dataType: ['Price', 'Amount', 'Count', 'Stock', 'Minutes', 'Rating', 'MonthlyPrice'].some((w) =>
            colName.includes(w)
          )
            ? 'number'
            : ['IsAvailable', 'IsIncluded', 'IsVerified'].some((w) => colName.includes(w))
            ? 'boolean'
            : ['ImageUrl', 'Image'].some((w) => colName.includes(w))
            ? 'image'
            : 'string',
          isPublic,
          isReadOnly: false,
        });
      });
    });

    return mappings;
  }

  /**
   * Processes and appends a website form submission to the Google Sheet database
   */
  public async submitWebsiteForm(params: {
    websiteId: string;
    googleSheetId?: string;
    formType: 'CONTACT' | 'BOOKING' | 'ORDER' | 'REGISTRATION' | 'INQUIRY' | 'FEEDBACK';
    formData: Record<string, any>;
  }): Promise<{ success: boolean; submissionId: string; message: string }> {
    const { websiteId, googleSheetId, formType, formData } = params;
    const submissionId = `subm_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;

    const submission: WebsiteFormSubmission = {
      id: submissionId,
      websiteId,
      formType,
      data: formData,
      submittedAt: new Date().toISOString(),
      syncedToSheet: false,
      status: 'NEW',
    };

    // Save locally
    const storageKey = `enemind_forms_${websiteId}`;
    try {
      const existing: WebsiteFormSubmission[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      existing.unshift(submission);
      localStorage.setItem(storageKey, JSON.stringify(existing));
    } catch (e) {
      console.warn('Form storage error:', e);
    }

    // Append to Google Sheet if connected
    if (googleSheetId) {
      try {
        const targetTab =
          formType === 'ORDER'
            ? 'Orders'
            : formType === 'BOOKING'
            ? 'Bookings'
            : formType === 'FEEDBACK'
            ? 'Reviews'
            : 'Inquiries';

        const rowValues = [
          submissionId,
          formData.name || formData.customerName || formData.fullName || 'Anonymous',
          formData.phone || formData.customerPhone || '',
          formData.email || formData.customerEmail || '',
          formData.message || formData.notes || formData.items || JSON.stringify(formData),
          new Date().toLocaleString(),
          'NEW',
        ];

        await providerRegistry.googleProvider.appendRow(googleSheetId, targetTab, rowValues);
        submission.syncedToSheet = true;
      } catch (err) {
        console.warn('Failed to append to Google Sheet:', err);
      }
    }

    return {
      success: true,
      submissionId,
      message: 'Your submission has been received and logged to the website database.',
    };
  }
}

export const websiteDatabaseService = new WebsiteDatabaseService();
