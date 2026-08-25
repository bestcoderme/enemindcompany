import { MpesaTransaction, SubscriptionState } from '../types';

const STORAGE_KEY_PREFIX = 'enemind_subscription_';

export const ENEHUB_TRIAL_DAYS = 7;
export const PRICE_ENEHUB_ACTIVATION = 200; // KSh 200
export const PRICE_FINDLOCAL_UNLOCK = 200; // KSh 200
export const PRICE_FINDLOCAL_SHEET = 100; // KSh 100

export interface MpesaPaymentRequest {
  phone: string;
  amount: number;
  purpose: string;
  userEmail: string;
  accountReference?: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  checkoutRequestId: string;
  merchantRequestId: string;
  responseCode: string;
  responseDescription: string;
  customerMessage: string;
  receiptNumber: string;
  timestamp: string;
}

export interface MpesaReceipt {
  receiptNumber: string;
  amount: number;
  phone: string;
  purpose: string;
  date: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}

export function getInitialSubscription(userEmail?: string): SubscriptionState {
  const defaultState: SubscriptionState = {
    trialStartDate: new Date().toISOString(),
    isEneHubPaid: false,
    isFindLocalUnlocked: false,
    hasFindLocalGoogleSheet: false,
    transactions: [],
  };

  if (!userEmail) return defaultState;

  try {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}${userEmail}`) || localStorage.getItem(`genzhub_subscription_${userEmail}`);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error reading subscription state:', e);
  }

  // Save initial trial
  saveSubscription(userEmail, defaultState);
  return defaultState;
}

export function saveSubscription(userEmail: string, state: SubscriptionState): void {
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${userEmail}`, JSON.stringify(state));
    localStorage.setItem(`genzhub_subscription_${userEmail}`, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving subscription state:', e);
  }
}

export function getTrialDetails(
  trialStartDateIso?: string,
  isPaid?: boolean
): {
  isExpired: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  trialExpiresAt: Date;
  statusLabel: string;
  isPaid: boolean;
  daysLeft: number;
} {
  const paid = Boolean(isPaid);
  if (paid) {
    return {
      isExpired: false,
      daysRemaining: 365,
      hoursRemaining: 8760,
      trialExpiresAt: new Date(Date.now() + 365 * 24 * 3600 * 1000),
      statusLabel: 'Lifetime Active Member',
      isPaid: true,
      daysLeft: 365,
    };
  }

  const start = new Date(trialStartDateIso || Date.now()).getTime();
  const trialDurationMs = ENEHUB_TRIAL_DAYS * 24 * 60 * 60 * 1000;
  const expires = start + trialDurationMs;
  const now = Date.now();
  const diffMs = expires - now;

  if (diffMs <= 0) {
    return {
      isExpired: true,
      daysRemaining: 0,
      hoursRemaining: 0,
      trialExpiresAt: new Date(expires),
      statusLabel: '7-Day Free Trial Expired',
      isPaid: false,
      daysLeft: 0,
    };
  }

  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diffMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  return {
    isExpired: false,
    daysRemaining: days,
    hoursRemaining: hours,
    trialExpiresAt: new Date(expires),
    statusLabel: days > 0 ? `${days} day${days > 1 ? 's' : ''} trial remaining` : `${hours} hour${hours > 1 ? 's' : ''} trial remaining`,
    isPaid: false,
    daysLeft: days,
  };
}

export function generateMpesaReceipt(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const nums = '0123456789';
  let ref = 'QH';
  for (let i = 0; i < 6; i++) {
    ref += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  for (let i = 0; i < 2; i++) {
    ref += nums.charAt(Math.floor(Math.random() * nums.length));
  }
  return ref;
}

export function formatKenyanPhone(phone: string): string {
  let cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.slice(1);
  } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
    cleaned = '254' + cleaned;
  }
  return cleaned;
}

export function isValidKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/[^0-9]/g, '');
  return (
    (cleaned.length === 10 && (cleaned.startsWith('07') || cleaned.startsWith('01'))) ||
    (cleaned.length === 12 && (cleaned.startsWith('2547') || cleaned.startsWith('2541')))
  );
}

export const mpesaService = {
  getInitialSubscription,
  saveSubscription,
  getTrialDetails,
  generateMpesaReceipt,
  formatKenyanPhone,
  isValidKenyanPhone,

  async initiateStkPush(req: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    // Standard STK push simulation / API connection
    await new Promise((res) => setTimeout(res, 1200));
    const receipt = generateMpesaReceipt();
    return {
      success: true,
      checkoutRequestId: `ws_CO_${Date.now()}`,
      merchantRequestId: `MR_${Date.now()}`,
      responseCode: '0',
      responseDescription: 'Success. Request accepted for processing',
      customerMessage: 'Success. Check your phone to enter M-PESA PIN',
      receiptNumber: receipt,
      timestamp: new Date().toISOString(),
    };
  },

  createReceiptRecord(resp: MpesaPaymentResponse, req: MpesaPaymentRequest): MpesaReceipt {
    return {
      receiptNumber: resp.receiptNumber,
      amount: req.amount,
      phone: req.phone,
      purpose: req.purpose,
      date: resp.timestamp,
      status: 'COMPLETED',
    };
  },
};
