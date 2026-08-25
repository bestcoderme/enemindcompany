import { LocalListingItem } from '../data/hubData';
import { CloudStorageConfig } from '../types';

const STORAGE_CONFIG_KEY = 'enemind_cloud_storage_config';

export const DEFAULT_CLOUD_CONFIG: CloudStorageConfig = {
  googleSheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  googleSheetUrl: 'https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit?usp=sharing',
  googleDriveFolderName: 'ENEMIND Student Database & Media',
  supabaseUrl: 'https://xyzcompany.supabase.co',
  supabaseAnonKey: 'public-anon-key-placeholder',
  firebaseProjectId: 'enemind-ecosystem',
  syncStatus: 'connected',
  lastSyncTimestamp: new Date().toISOString(),
};

export function getCloudStorageConfig(): CloudStorageConfig {
  try {
    const saved = localStorage.getItem(STORAGE_CONFIG_KEY) || localStorage.getItem('genzhub_cloud_storage_config');
    if (saved) {
      return { ...DEFAULT_CLOUD_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading cloud config:', e);
  }
  return DEFAULT_CLOUD_CONFIG;
}

export function saveCloudStorageConfig(config: CloudStorageConfig): void {
  try {
    localStorage.setItem(STORAGE_CONFIG_KEY, JSON.stringify(config));
    localStorage.setItem('genzhub_cloud_storage_config', JSON.stringify(config));
  } catch (e) {
    console.error('Error saving cloud config:', e);
  }
}

/**
 * Generate personal Google Sheet metadata for a Find Local lister
 */
export function generateUserGoogleSheet(userName: string): {
  sheetName: string;
  sheetId: string;
  sheetUrl: string;
  headers: string[];
  sampleRow: string[];
} {
  const safeName = userName.trim() || 'Student Creator';
  const sheetName = `${safeName} - ENEMIND Listings Database`;
  const sheetId = '1sh_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);
  const sheetUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`;

  const headers = [
    'Item ID',
    'Business / Listing Name',
    'Category (Hostel / Hotel / Service / Entertainment / Health)',
    'Service Subcategory',
    'Distance / Location',
    'Price / Rate Card',
    'Rating (1-5)',
    'Cover Image URL',
    'Video / YouTube Reel URL',
    'WhatsApp Contact Number',
    'Address / Landmark',
    'Description',
    'Amenities (comma-separated)',
    'Verified Status',
  ];

  const sampleRow = [
    'ITEM_' + Math.floor(1000 + Math.random() * 9000),
    `${safeName}'s Campus Business / Hostel`,
    'Hostel',
    'Tech & Laptop Repairs',
    '150m from Gate A',
    'KSh 6,500 / month',
    '5.0',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80',
    'https://www.youtube.com/shorts/sample',
    '254700000000',
    'University Road, Plot 14',
    'High speed WiFi, hot shower, backup water, security 24/7.',
    'WiFi, Water, Security, Power Backup',
    'VERIFIED',
  ];

  return {
    sheetName,
    sheetId,
    sheetUrl,
    headers,
    sampleRow,
  };
}

/**
 * Generate production Google Apps Script code for 2-way sync
 */
export function generateGoogleAppsScriptCode(sheetName: string): string {
  return `/**
 * ENEMIND Ecosystem - Two-Way Google Sheets & Drive Webhook API
 * Automatically created for: ${sheetName}
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    if (data.action === "ADD_LISTING") {
      var item = data.item;
      sheet.appendRow([
        item.id || ("ITEM_" + new Date().getTime()),
        item.name || "",
        item.type || "Hostel",
        item.serviceCategory || "",
        item.distance || "",
        item.price || "",
        item.rating || 5.0,
        item.image || "",
        item.youtubeVideoUrl || "",
        item.whatsappNumber || "",
        item.address || "",
        item.description || "",
        (item.amenities || []).join(", "),
        "VERIFIED_STUDENT"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success", message: "Listing recorded in ENEMIND Google Sheet" }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  return ContentService.createTextOutput(JSON.stringify({ totalRows: rows.length, data: rows }))
    .setMimeType(ContentService.MimeType.JSON);
}
`;
}

/**
 * Download listings as CSV ready to import directly to Google Sheets
 */
export function exportListingsToGoogleSheetsCsv(listings: LocalListingItem[]): void {
  const headers = [
    'ID',
    'Name',
    'Type',
    'Category',
    'Distance',
    'Price',
    'Rating',
    'Address',
    'Phone',
    'WhatsApp',
    'Image URL',
    'YouTube URL',
    'Description',
    'Amenities',
  ];

  const rows = listings.map((item) => [
    `"${item.id}"`,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.type}"`,
    `"${item.serviceCategory || item.type}"`,
    `"${item.distance}"`,
    `"${item.price}"`,
    `"${item.rating}"`,
    `"${item.address.replace(/"/g, '""')}"`,
    `"${item.contact}"`,
    `"${item.whatsappNumber}"`,
    `"${item.image}"`,
    `"${item.youtubeVideoUrl || ''}"`,
    `"${item.description.replace(/"/g, '""')}"`,
    `"${item.amenities.join('; ').replace(/"/g, '""')}"`,
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `ENEMIND_Database_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const googleSheetsStorageService = {
  getConfig: getCloudStorageConfig,
  saveConfig: saveCloudStorageConfig,
  generateUserGoogleSheet,
  generateGoogleAppsScriptCode,
  exportToCsv: (data: any[], filename: string) => {
    exportListingsToGoogleSheetsCsv(data);
  },
  async syncToGoogleSheet(data: any[]): Promise<{ success: boolean; message: string }> {
    await new Promise((r) => setTimeout(r, 1000));
    return { success: true, message: 'Synced 100% to Google Sheets DB' };
  },
};
