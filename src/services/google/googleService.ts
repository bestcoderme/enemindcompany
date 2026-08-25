/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { googleAccountService } from './googleAccountService';
import { googleAuthService, ALL_GOOGLE_SCOPES, SERVICE_SCOPE_MAP } from './googleAuthService';
import { googleCapabilityService } from './googleCapabilityService';
import { googleAuditService } from './googleAuditService';
import { gmailService } from './gmailService';
import { driveService, ENEMIND_FOLDER_CATEGORIES, EnemindDriveCategory } from './driveService';
import { calendarService } from './calendarService';
import { meetService } from './meetService';
import { classroomService } from './classroomService';
import { sheetsService } from './sheetsService';
import { docsService } from './docsService';
import { appsScriptService, MARKETPLACE_SHEET_PRODUCTS } from './appsScriptService';
import { emailService } from './emailService';
import { googleChatIntegrationService } from './chatService';
import { groupsService, SAMPLE_GROUPS } from './groupsService';
import { youtubeService, CURATED_EDUCATIONAL_VIDEOS } from './youtubeService';
import { googleSheetsStorageService } from '../googleSheetsStorageService';
import { CloudStorageConfig } from '../../types';

export const googleService = {
  // Account & Authorization
  account: googleAccountService,
  auth: googleAuthService,
  capabilities: googleCapabilityService,
  audit: googleAuditService,

  // Individual Functional Services
  gmail: gmailService,
  drive: driveService,
  calendar: calendarService,
  meet: meetService,
  classroom: classroomService,
  sheets: sheetsService,
  docs: docsService,
  appsScript: appsScriptService,
  email: emailService,
  chat: googleChatIntegrationService,
  groups: groupsService,
  youtube: youtubeService,

  // Constants & Static Collections
  ALL_GOOGLE_SCOPES,
  SERVICE_SCOPE_MAP,
  ENEMIND_FOLDER_CATEGORIES,
  MARKETPLACE_SHEET_PRODUCTS,
  SAMPLE_GROUPS,
  CURATED_EDUCATIONAL_VIDEOS,

  // Backward compatibility methods
  getStorageConfig(): CloudStorageConfig {
    return googleSheetsStorageService.getConfig();
  },

  saveStorageConfig(config: CloudStorageConfig): void {
    googleSheetsStorageService.saveConfig(config);
  },

  generateAppsScriptCode(sheetName: string): string {
    return googleSheetsStorageService.generateGoogleAppsScriptCode(sheetName);
  },

  exportToCsv(data: any[], filename: string): void {
    googleSheetsStorageService.exportToCsv(data, filename);
  },

  syncToGoogleSheet(data: any[]): Promise<{ success: boolean; message: string }> {
    return googleSheetsStorageService.syncToGoogleSheet(data);
  },
};

export {
  googleAccountService,
  googleAuthService,
  googleCapabilityService,
  googleAuditService,
  gmailService,
  driveService,
  calendarService,
  meetService,
  classroomService,
  sheetsService,
  docsService,
  appsScriptService,
  emailService,
  googleChatIntegrationService,
  groupsService,
  youtubeService,
};
