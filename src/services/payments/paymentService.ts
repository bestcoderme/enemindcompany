import { MpesaPaymentRequest, MpesaPaymentResponse, MpesaReceipt, mpesaService } from '../mpesaService';
import { MpesaTransaction } from '../../types';

export interface PaymentProvider {
  id: 'mpesa' | 'card' | 'paypal' | 'googlepay';
  name: string;
  isAvailable: boolean;
  supportedCurrencies: string[];
}

export const AVAILABLE_PAYMENT_PROVIDERS: PaymentProvider[] = [
  { id: 'mpesa', name: 'M-PESA (Kenya Safaricom)', isAvailable: true, supportedCurrencies: ['KES'] },
  { id: 'card', name: 'Credit / Debit Card (Global)', isAvailable: false, supportedCurrencies: ['USD', 'GBP', 'EUR', 'KES'] },
  { id: 'googlepay', name: 'Google Pay', isAvailable: false, supportedCurrencies: ['USD', 'KES'] },
];

export const paymentService = {
  getAvailableProviders(): PaymentProvider[] {
    return AVAILABLE_PAYMENT_PROVIDERS;
  },

  async initiateMpesaPayment(req: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
    return mpesaService.initiateStkPush(req);
  },

  generateReceipt(response: MpesaPaymentResponse, req: MpesaPaymentRequest): MpesaReceipt {
    return mpesaService.createReceiptRecord(response, req);
  },

  recordTransaction(userEmail: string, transaction: MpesaTransaction): void {
    const key = `enemind_tx_${userEmail}`;
    try {
      const existing = JSON.parse(localStorage.getItem(key) || '[]') as MpesaTransaction[];
      existing.unshift(transaction);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch {
      // Ignore
    }
  },

  getUserTransactions(userEmail: string): MpesaTransaction[] {
    const key = `enemind_tx_${userEmail}`;
    try {
      return JSON.parse(localStorage.getItem(key) || '[]') as MpesaTransaction[];
    } catch {
      return [];
    }
  }
};
