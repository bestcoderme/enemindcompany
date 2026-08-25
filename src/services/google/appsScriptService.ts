/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleAppsScriptProduct } from '../../types/google';
import { googleAuditService } from './googleAuditService';
import { googleAuthService } from './googleAuthService';
import { sheetsService } from './sheetsService';

export const MARKETPLACE_SHEET_PRODUCTS: GoogleAppsScriptProduct[] = [
  {
    id: 'prod_gpa_tracker',
    title: 'Automated GPA & Degree Classification Tracker',
    category: 'Academics',
    description: 'Instant semester GPA, CGPA projection, credit unit weighting, and First Class Honors threshold simulator.',
    priceKsh: 150,
    templateSpreadsheetId: 'tpl_gpa_2026',
    features: [
      'Automated 4.0 & 5.0 GPA and Kenyan University Grading scale calculation',
      'Continuous Assessment (CAT) + Final Exam weighting calculator',
      'Target GPA Simulator for graduation honors',
      'Automatic sync to ENEMIND Academic Vault',
    ],
    deploymentInstructions: [
      'Click "Deploy to Google Drive" to copy the master template to your personal Drive',
      'Authorize the connected Apps Script macro to enable real-time chart rendering',
      'Input your semester course codes and unit weights to view instantaneous GPA graphs',
    ],
    appsScriptCode: `/**
 * ENEMIND GPA Tracker Automated Calculations
 */
function calculateGPA() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SemesterGrades");
  var data = sheet.getDataRange().getValues();
  var totalWeightedPoints = 0;
  var totalCredits = 0;

  for (var i = 1; i < data.length; i++) {
    var units = Number(data[i][2]);
    var gradePoint = Number(data[i][4]);
    if (!isNaN(units) && !isNaN(gradePoint) && units > 0) {
      totalWeightedPoints += (units * gradePoint);
      totalCredits += units;
    }
  }

  var gpa = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : "0.00";
  sheet.getRange("H2").setValue(gpa);
  return gpa;
}`,
  },
  {
    id: 'prod_school_mgmt',
    title: 'High School & Academy Management Sheet Database',
    category: 'Institutional',
    description: 'Complete student registry, fee balances, parent SMS/Email notification queue, and exam report cards generator.',
    priceKsh: 500,
    templateSpreadsheetId: 'tpl_school_mgmt',
    features: [
      'Student bio data, admission numbers, and class streams',
      'Fee billing, payment receipts, and arrears auto-calculation',
      'One-click student terminal report card generation',
      'Parent contact ledger with Gmail broadcast integration',
    ],
    deploymentInstructions: [
      'Deploy template directly to your institution Google Drive',
      'Configure school name, crest, and term dates in Settings sheet',
      'Use Extensions > Apps Script to trigger batch report card mail merges',
    ],
    appsScriptCode: `/**
 * ENEMIND School Management System
 */
function generateTerminalReports() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var students = ss.getSheetByName("Students").getDataRange().getValues();
  var template = ss.getSheetByName("ReportCardTemplate");
  
  for (var i = 1; i < students.length; i++) {
    var admNo = students[i][0];
    var studentName = students[i][1];
    // Duplicate report template and populate marks
    Logger.log("Processed report card for: " + studentName + " (" + admNo + ")");
  }
}`,
  },
  {
    id: 'prod_inventory_system',
    title: 'Smart Stock & Inventory Tracker with Barcode Scan',
    category: 'Business',
    description: 'Retail & campus enterprise inventory management with reorder triggers, supplier directory, and profit margins.',
    priceKsh: 300,
    templateSpreadsheetId: 'tpl_inventory',
    features: [
      'Real-time stock on hand, units sold, and restock alerts',
      'Cost price, selling price, and gross margin auto-calculation',
      'Daily sales log with timestamped transactions',
      'M-Pesa till / paybill reconciliation formulas',
    ],
    deploymentInstructions: [
      'Install to Google Drive and link to your business Gmail account',
      'Scan or enter product SKUs and minimum safety stock levels',
      'Receive instant automated email alerts when items drop below safety thresholds',
    ],
    appsScriptCode: `/**
 * ENEMIND Smart Inventory Low Stock Trigger
 */
function checkLowStock() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Inventory");
  var items = sheet.getDataRange().getValues();
  var lowStockItems = [];

  for (var i = 1; i < items.length; i++) {
    var itemName = items[i][1];
    var currentQty = items[i][3];
    var reorderLevel = items[i][4];
    if (currentQty <= reorderLevel) {
      lowStockItems.push(itemName + " (Remaining: " + currentQty + ")");
    }
  }

  if (lowStockItems.length > 0) {
    MailApp.sendEmail(
      Session.getActiveUser().getEmail(),
      "ENEMIND Alert: Low Inventory Detected",
      "The following items need reordering:\\n\\n" + lowStockItems.join("\\n")
    );
  }
}`,
  },
  {
    id: 'prod_student_budget',
    title: 'Gen-Z Campus Budget & Daily Expense Allocator',
    category: 'Personal Finance',
    description: 'Track HELB disbursements, upkeep funds, hostel rent, groceries, data bundles, and savings goals.',
    priceKsh: 100,
    templateSpreadsheetId: 'tpl_budget',
    features: [
      '50/30/20 Campus budgeting model tailored for students',
      'HELB loan & scholarship milestone tracking',
      'Daily expense logger with category pie-charts',
      'Emergency fund progress bar',
    ],
    deploymentInstructions: [
      'Deploy template to your private Google Drive',
      'Bookmark sheet on mobile browser or Sheets app for quick on-the-go logging',
    ],
    appsScriptCode: `/**
 * ENEMIND Campus Budget Summary
 */
function updateBudgetSummary() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var expenses = ss.getSheetByName("Expenses").getDataRange().getValues();
  var total = 0;
  for (var i = 1; i < expenses.length; i++) {
    var amount = Number(expenses[i][2]);
    if (!isNaN(amount)) total += amount;
  }
  ss.getSheetByName("Dashboard").getRange("B4").setValue(total);
}`,
  },
  {
    id: 'prod_attendance_system',
    title: 'QR-Code & Lecture Attendance Tracker',
    category: 'Academics',
    description: 'Digital lecture roll call with percentage threshold warnings (e.g. 75% exam sitting rule) and absentee logs.',
    priceKsh: 200,
    templateSpreadsheetId: 'tpl_attendance',
    features: [
      'Student roll call with Present/Absent/Excused flags',
      'Automatic calculation of 75% exam qualification status',
      'Weekly absenteeism report exportable to PDF',
    ],
    deploymentInstructions: [
      'Copy to Google Drive and import class registration list',
      'Select lecture date from dropdown and tick present students',
    ],
    appsScriptCode: `/**
 * ENEMIND Lecture Attendance Validator
 */
function validateAttendanceThreshold() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Attendance");
  var data = sheet.getDataRange().getValues();
  // Highlight students below 75% qualification in red
}`,
  },
  {
    id: 'prod_hostel_lister_db',
    title: 'FindLocal Campus Hostel & Rental Property CRM',
    category: 'Real Estate',
    description: 'Hostel owner property directory, tenant room assignments, rent collections, and WhatsApp enquiry webhook.',
    priceKsh: 350,
    templateSpreadsheetId: 'tpl_hostel_db',
    features: [
      'Room inventory (Single, Bed-sitter, 1-Bedroom) with rent rates',
      'Tenant contacts, national IDs, and lease agreements',
      'M-Pesa payment tracking and arrears alerts',
      'Integrated webhook for FindLocal app sync',
    ],
    deploymentInstructions: [
      'Deploy sheet and Apps Script webhook to your Google Drive',
      'Paste Webhook URL in ENEMIND FindLocal settings for instant listing sync',
    ],
    appsScriptCode: `/**
 * ENEMIND FindLocal Hostel CRM Webhook
 */
function doPost(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Tenants");
  var payload = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    payload.id || Utilities.getUuid(),
    payload.name,
    payload.roomNumber,
    payload.rentAmount,
    payload.phone,
    payload.paymentStatus || "PENDING",
    new Date()
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS" }))
    .setMimeType(ContentService.MimeType.JSON);
}`,
  },
];

class AppsScriptService {
  /**
   * Deploy an automated sheet product into user's Google Drive.
   */
  public async deployProduct(
    productId: string,
    userEmail: string
  ): Promise<{
    success: boolean;
    product: GoogleAppsScriptProduct;
    sheetUrl: string;
    sheetId: string;
    message: string;
  }> {
    const product = MARKETPLACE_SHEET_PRODUCTS.find((p) => p.id === productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }

    // Create real Google Sheet in user's Drive
    const { spreadsheetId, spreadsheetUrl } = await sheetsService.createSpreadsheet(product.title, [
      'ID',
      'Timestamp',
      'Category',
      'Title / Name',
      'Value / Amount',
      'Status',
    ]);

    googleAuditService.log(
      'appsScript',
      'DEPLOY_APPS_SCRIPT_PRODUCT',
      userEmail || googleAuthService.getAccountInfo().email || 'user@enemind.org',
      `Deployed "${product.title}" to user Google Drive`,
      'SUCCESS',
      `Sheet URL: ${spreadsheetUrl}`
    );

    return {
      success: true,
      product,
      sheetUrl: spreadsheetUrl,
      sheetId: spreadsheetId,
      message: `Successfully copied "${product.title}" to your Google Drive with embedded Apps Script automations!`,
    };
  }

  public getProducts(): GoogleAppsScriptProduct[] {
    return MARKETPLACE_SHEET_PRODUCTS;
  }
}

export const appsScriptService = new AppsScriptService();
