export interface AutomationProduct {
  id: string;
  title: string;
  category: 'Business & CRM' | 'Finance & Payroll' | 'Academic & School' | 'Productivity & Tools' | 'E-commerce & Inventory';
  tagline: string;
  description: string;
  priceKSh: number;
  priceUSD: number;
  originalPriceKSh: number;
  screenshots: string[];
  features: string[];
  googleServices: ('Google Sheets' | 'Google Apps Script' | 'Google Drive' | 'Google Forms' | 'Gmail Automation')[];
  demoSheetUrl: string;
  templateCopyUrl?: string;
  author: string;
  version: string;
  rating: number;
  downloadsCount: number;
  updatedAt: string;
}

export interface AutomationOrder {
  id: string;
  productId: string;
  productTitle: string;
  amountKSh: number;
  customerEmail: string;
  customerPhone: string;
  mpesaReceiptNumber: string;
  connectedGoogleAccount?: string;
  deployedSheetUrl?: string;
  status: 'pending' | 'deployed' | 'completed';
  createdAt: string;
}
