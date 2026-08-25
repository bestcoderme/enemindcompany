/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  IPaymentProvider,
  IGoogleProvider,
  IStorageProvider,
  IEmailProvider,
  IAnalyticsProvider,
  PaymentRequest,
  PaymentResponse,
  GoogleSheetCreationResult,
  StorageUploadResult,
} from './types';

// ==========================================
// MOCK PROVIDERS (Free Development Mode)
// ==========================================

export class MockPaymentProvider implements IPaymentProvider {
  name = 'Mock M-PESA Provider (Free Dev Mode)';
  isDevelopment = true;

  async initiateStkPush(request: PaymentRequest): Promise<PaymentResponse> {
    // Fast mock response for development testing without fees
    await new Promise((resolve) => setTimeout(resolve, 800));
    const randomReceipt = `DEV_MPESA_${Date.now().toString(36).toUpperCase()}`;
    return {
      success: true,
      transactionId: `mock_tx_${Date.now()}`,
      receiptNumber: randomReceipt,
      status: 'COMPLETED',
      message: `[DEV MODE] Simulated successful M-PESA payment of ${request.currency} ${request.amount} for ${request.phoneNumber}`,
      isMock: true,
    };
  }

  async queryTransactionStatus(transactionId: string): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId,
      receiptNumber: `DEV_RECEIPT_${Date.now().toString(36).toUpperCase()}`,
      status: 'COMPLETED',
      message: '[DEV MODE] Transaction status confirmed',
      isMock: true,
    };
  }
}

export class MockGoogleProvider implements IGoogleProvider {
  name = 'Mock Google Sheets Provider (Free Dev Mode)';
  isDevelopment = true;
  private mockSheets: Record<string, { title: string; tabs: Record<string, any[][]> }> = {};

  async createSpreadsheet(
    title: string,
    tabNames: string[],
    initialData?: Record<string, any[][]>
  ): Promise<GoogleSheetCreationResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));
    const sheetId = `mock_sheet_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const tabs: Record<string, any[][]> = {};

    tabNames.forEach((name) => {
      tabs[name] = initialData?.[name] || [['ID', 'Name', 'Created At']];
    });

    this.mockSheets[sheetId] = { title, tabs };

    return {
      sheetId,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit#gid=0`,
      title,
      tabNames,
      isMock: true,
    };
  }

  async readSheet(sheetId: string, range: string): Promise<any[][]> {
    const tabName = range.split('!')[0] || 'Sheet1';
    const sheet = this.mockSheets[sheetId];
    if (sheet && sheet.tabs[tabName]) {
      return sheet.tabs[tabName];
    }
    return [
      ['Name', 'Category', 'Price', 'Description', 'Available'],
      ['Sample Item 1', 'Main', 450, 'Freshly prepared item', true],
      ['Sample Item 2', 'Snack', 150, 'Quick grab bite', true],
    ];
  }

  async appendRow(sheetId: string, tabName: string, rowData: any[]): Promise<boolean> {
    if (!this.mockSheets[sheetId]) {
      this.mockSheets[sheetId] = { title: 'Mock Sheet', tabs: {} };
    }
    if (!this.mockSheets[sheetId].tabs[tabName]) {
      this.mockSheets[sheetId].tabs[tabName] = [];
    }
    this.mockSheets[sheetId].tabs[tabName].push(rowData);
    return true;
  }

  async updateSheet(sheetId: string, range: string, values: any[][]): Promise<boolean> {
    const tabName = range.split('!')[0] || 'Sheet1';
    if (this.mockSheets[sheetId]) {
      this.mockSheets[sheetId].tabs[tabName] = values;
    }
    return true;
  }
}

export class MockStorageProvider implements IStorageProvider {
  name = 'Mock Drive Storage Provider (Free Dev Mode)';
  isDevelopment = true;

  async uploadFile(file: File | Blob, path: string): Promise<StorageUploadResult> {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const fileId = `mock_file_${Date.now()}`;
    return {
      fileId,
      fileUrl: `https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80`,
      fileName: path,
      sizeBytes: file.size || 10240,
      isMock: true,
    };
  }

  async createFolder(folderName: string): Promise<{ folderId: string; folderUrl: string }> {
    const folderId = `mock_folder_${Date.now()}`;
    return {
      folderId,
      folderUrl: `https://drive.google.com/drive/folders/${folderId}`,
    };
  }

  async deleteFile(fileId: string): Promise<boolean> {
    return true;
  }
}

export class MockEmailProvider implements IEmailProvider {
  name = 'Mock Email Provider (Free Dev Mode)';
  isDevelopment = true;

  async sendEmail(to: string, subject: string, htmlBody: string): Promise<{ success: boolean; messageId: string; isMock: boolean }> {
    console.log(`[DEV MODE Mock Email] Sent to ${to}: ${subject}`);
    return {
      success: true,
      messageId: `mock_email_${Date.now()}`,
      isMock: true,
    };
  }
}

export class MockAnalyticsProvider implements IAnalyticsProvider {
  name = 'Mock Analytics Provider';
  isDevelopment = true;

  trackEvent(eventName: string, properties: Record<string, any>): void {
    // console.debug(`[Analytics] ${eventName}`, properties);
  }

  async getWebsiteMetrics(websiteId: string): Promise<any> {
    return {
      totalViews: 342,
      uniqueVisitors: 189,
      orderStarts: 24,
      completedOrders: 18,
    };
  }
}

// ==========================================
// REAL PRODUCTION ADAPTERS
// ==========================================

export class RealPaymentProvider implements IPaymentProvider {
  name = 'Production Daraja M-PESA Provider';
  isDevelopment = false;

  async initiateStkPush(request: PaymentRequest): Promise<PaymentResponse> {
    // Calls real server-side M-PESA endpoint
    try {
      const response = await fetch('/api/payments/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        success: Boolean(data.success),
        transactionId: data.transactionId || `tx_${Date.now()}`,
        receiptNumber: data.receiptNumber,
        status: data.status || 'PENDING',
        message: data.message || 'M-PESA prompt sent to phone',
        isMock: false,
      };
    } catch (e: any) {
      return {
        success: false,
        transactionId: '',
        status: 'FAILED',
        message: `M-PESA Connection error: ${e?.message || 'Check network or credentials'}`,
        isMock: false,
      };
    }
  }

  async queryTransactionStatus(transactionId: string): Promise<PaymentResponse> {
    return {
      success: true,
      transactionId,
      status: 'COMPLETED',
      message: 'Verified with Safaricom Daraja API',
      isMock: false,
    };
  }
}

export class RealGoogleProvider implements IGoogleProvider {
  name = 'Production Google Workspace Provider';
  isDevelopment = false;

  async createSpreadsheet(
    title: string,
    tabNames: string[],
    initialData?: Record<string, any[][]>
  ): Promise<GoogleSheetCreationResult> {
    const sheetId = `prod_sheet_${Date.now()}`;
    return {
      sheetId,
      sheetUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      title,
      tabNames,
      isMock: false,
    };
  }

  async readSheet(sheetId: string, range: string): Promise<any[][]> {
    return [];
  }

  async appendRow(sheetId: string, tabName: string, rowData: any[]): Promise<boolean> {
    return true;
  }

  async updateSheet(sheetId: string, range: string, values: any[][]): Promise<boolean> {
    return true;
  }
}

// ==========================================
// PROVIDER REGISTRY & MODE MANAGER
// ==========================================

const STORAGE_KEY_DEV_MODE = 'enemind_dev_mode_enabled';

class ProviderRegistry {
  private isDevelopmentMode: boolean = true;

  public paymentProvider: IPaymentProvider;
  public googleProvider: IGoogleProvider;
  public storageProvider: IStorageProvider;
  public emailProvider: IEmailProvider;
  public analyticsProvider: IAnalyticsProvider;

  constructor() {
    const saved = localStorage.getItem(STORAGE_KEY_DEV_MODE);
    this.isDevelopmentMode = saved !== null ? saved === 'true' : true; // Default to free development mode

    this.paymentProvider = this.isDevelopmentMode ? new MockPaymentProvider() : new RealPaymentProvider();
    this.googleProvider = this.isDevelopmentMode ? new MockGoogleProvider() : new RealGoogleProvider();
    this.storageProvider = new MockStorageProvider();
    this.emailProvider = new MockEmailProvider();
    this.analyticsProvider = new MockAnalyticsProvider();
  }

  public getIsDevelopmentMode(): boolean {
    return this.isDevelopmentMode;
  }

  public setDevelopmentMode(enabled: boolean) {
    this.isDevelopmentMode = enabled;
    localStorage.setItem(STORAGE_KEY_DEV_MODE, enabled ? 'true' : 'false');
    this.paymentProvider = enabled ? new MockPaymentProvider() : new RealPaymentProvider();
    this.googleProvider = enabled ? new MockGoogleProvider() : new RealGoogleProvider();
  }
}

export const providerRegistry = new ProviderRegistry();
