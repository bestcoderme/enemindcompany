/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PaymentRequest {
  amount: number;
  currency: string;
  phoneNumber: string;
  accountReference: string;
  transactionDesc: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  transactionId: string;
  receiptNumber?: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  message: string;
  isMock: boolean;
}

export interface IPaymentProvider {
  name: string;
  isDevelopment: boolean;
  initiateStkPush(request: PaymentRequest): Promise<PaymentResponse>;
  queryTransactionStatus(transactionId: string): Promise<PaymentResponse>;
}

export interface GoogleSheetCreationResult {
  sheetId: string;
  sheetUrl: string;
  title: string;
  tabNames: string[];
  isMock: boolean;
}

export interface IGoogleProvider {
  name: string;
  isDevelopment: boolean;
  createSpreadsheet(title: string, tabNames: string[], initialData?: Record<string, any[][]>): Promise<GoogleSheetCreationResult>;
  readSheet(sheetId: string, range: string): Promise<any[][]>;
  appendRow(sheetId: string, tabName: string, rowData: any[]): Promise<boolean>;
  updateSheet(sheetId: string, range: string, values: any[][]): Promise<boolean>;
}

export interface StorageUploadResult {
  fileId: string;
  fileUrl: string;
  fileName: string;
  sizeBytes: number;
  isMock: boolean;
}

export interface IStorageProvider {
  name: string;
  isDevelopment: boolean;
  uploadFile(file: File | Blob, path: string): Promise<StorageUploadResult>;
  createFolder(folderName: string, parentFolderId?: string): Promise<{ folderId: string; folderUrl: string }>;
  deleteFile(fileId: string): Promise<boolean>;
}

export interface IEmailProvider {
  name: string;
  isDevelopment: boolean;
  sendEmail(to: string, subject: string, htmlBody: string): Promise<{ success: boolean; messageId: string; isMock: boolean }>;
}

export interface IAnalyticsProvider {
  name: string;
  isDevelopment: boolean;
  trackEvent(eventName: string, properties: Record<string, any>): void;
  getWebsiteMetrics(websiteId: string): Promise<any>;
}
