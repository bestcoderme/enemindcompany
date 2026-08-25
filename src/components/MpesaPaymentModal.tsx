import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  Zap,
  ArrowRight,
  FileSpreadsheet,
  Lock,
  Sparkles,
} from 'lucide-react';
import {
  formatKenyanPhone,
  isValidKenyanPhone,
  generateMpesaReceipt,
  saveSubscription,
  PRICE_ENEHUB_ACTIVATION,
  PRICE_FINDLOCAL_UNLOCK,
  PRICE_FINDLOCAL_SHEET,
} from '../services/mpesaService';
import { generateUserGoogleSheet } from '../services/googleSheetsStorageService';
import { MpesaTransaction, SubscriptionState, UserProfile } from '../types';

export type PaymentPurpose = 'enehub_activation' | 'findlocal_unlock' | 'findlocal_sheet';

interface MpesaPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  purpose: PaymentPurpose;
  user?: UserProfile | null;
  onSuccess: (updatedSub: SubscriptionState, receipt: string) => void;
}

export const MpesaPaymentModal: React.FC<MpesaPaymentModalProps> = ({
  isOpen,
  onClose,
  purpose,
  user,
  onSuccess,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || user?.whatsappNumber || '07');
  const [step, setStep] = useState<'input' | 'prompting' | 'pin_entry' | 'success' | 'failed'>('input');
  const [pin, setPin] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [receiptNumber, setReceiptNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const amount =
    purpose === 'enehub_activation'
      ? PRICE_ENEHUB_ACTIVATION
      : purpose === 'findlocal_unlock'
      ? PRICE_FINDLOCAL_UNLOCK
      : PRICE_FINDLOCAL_SHEET;

  const userName = user?.name || 'Student';
  const userAccountTag = (user?.studentIdNumber || userName.slice(0, 4)).toUpperCase();

  const purposeDetails = {
    enehub_activation: {
      title: 'Activate Enemind Hub (EneHub)',
      badge: '1-Year Full Pass',
      desc: 'Your 7-day free trial has concluded. Activate your full student access to all academic notes, past papers, group study circles, and attachment boards.',
      highlight: 'Only KSh 200 • Unlimited Access',
      accountNumber: 'ENEHUB-' + userAccountTag,
    },
    findlocal_unlock: {
      title: 'Unlock Find Local Hub',
      badge: 'Full Directory Access',
      desc: 'Access verified student hostels, hotels, laptop repairs, hair salons, laundry, peer coaching, and campus health triage.',
      highlight: 'Only KSh 200 • Lifetime Access',
      accountNumber: 'LOCAL-' + (userName.slice(0, 4) || 'STUD').toUpperCase(),
    },
    findlocal_sheet: {
      title: 'Buy Find Local Seller Google Sheet',
      badge: 'Merchant Database',
      desc: `Get your personal Google Sheet database named "${userName} - Find Local Listings Database" to list unlimited hostels, services, or entertainment directly on Find Local! (Note: Enemind Hub listings remain 100% free)`,
      highlight: 'Only KSh 100 • Own Your Database',
      accountNumber: 'SHEET-' + (userName.slice(0, 4) || 'STUD').toUpperCase(),
    },
  }[purpose] || {
    title: 'M-Pesa Express Checkout',
    badge: 'Secure Payment',
    desc: 'Complete your instant M-Pesa transaction.',
    highlight: 'Instant STK Push',
    accountNumber: 'ENE-' + userAccountTag,
  };

  useEffect(() => {
    if (isOpen) {
      setStep('input');
      setPin('');
      setCountdown(30);
      setErrorMessage('');
      if (user?.phoneNumber) {
        setPhoneNumber(user.phoneNumber);
      }
    }
  }, [isOpen, user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'prompting' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (step === 'prompting' && countdown === 0) {
      setStep('failed');
      setErrorMessage('STK Prompt timed out. Please verify your phone and try again.');
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendStkPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidKenyanPhone(phoneNumber)) {
      setErrorMessage('Please enter a valid Safaricom number (e.g. 0712345678 or 0112345678).');
      return;
    }

    setErrorMessage('');
    setStep('prompting');
    setCountdown(25);

    // After 2.5 seconds, bring up the simulated STK Pin Dialog
    setTimeout(() => {
      setStep('pin_entry');
    }, 2000);
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) {
      setErrorMessage('Please enter a 4-digit M-Pesa PIN');
      return;
    }

    // Process payment success
    const receipt = generateMpesaReceipt();
    setReceiptNumber(receipt);

    const newTx: MpesaTransaction = {
      id: 'tx_' + Date.now(),
      phoneNumber: formatKenyanPhone(phoneNumber),
      amount,
      purpose,
      purposeLabel: purposeDetails.title,
      status: 'completed',
      mpesaReceiptNumber: receipt,
      timestamp: new Date().toISOString(),
    };

    const currentSub = user?.subscription || {
      trialStartDate: new Date().toISOString(),
      isEneHubPaid: false,
      isFindLocalUnlocked: false,
      hasFindLocalGoogleSheet: false,
      transactions: [],
    };

    let updatedSub: SubscriptionState = {
      ...currentSub,
      transactions: [newTx, ...(currentSub.transactions || [])],
      mpesaPhone: formatKenyanPhone(phoneNumber),
    };

    if (purpose === 'enehub_activation') {
      updatedSub.isEneHubPaid = true;
    } else if (purpose === 'findlocal_unlock') {
      updatedSub.isFindLocalUnlocked = true;
    } else if (purpose === 'findlocal_sheet') {
      const sheetData = generateUserGoogleSheet(user?.name || 'Student');
      updatedSub.hasFindLocalGoogleSheet = true;
      updatedSub.findLocalSheetName = sheetData.sheetName;
      updatedSub.findLocalSheetUrl = sheetData.sheetUrl;
    }

    if (user?.email) {
      saveSubscription(user.email, updatedSub);
    }
    setStep('success');

    setTimeout(() => {
      onSuccess(updatedSub, receipt);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900"
      >
        {/* Header with Safaricom Brand Accent */}
        <div className="bg-[#008751] text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-extrabold text-white text-base border border-white/30">
              M
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-100 block">
                Safaricom Daraja Express
              </span>
              <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                <span>Lipa na M-PESA</span>
                <span className="px-2 py-0.5 bg-white text-[#008751] rounded-full text-[10px] font-extrabold">
                  Instant STK
                </span>
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* STEP 1: Phone & Payment Confirmation */}
          {step === 'input' && (
            <form onSubmit={handleSendStkPush} className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {purposeDetails.badge}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-950">
                    KSh {amount}.00
                  </span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900">{purposeDetails.title}</h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {purposeDetails.desc}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center justify-between">
                  <span>Enter M-PESA Phone Number</span>
                  <span className="text-[10px] font-medium text-neutral-400">Safaricom Only</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-xs font-bold text-neutral-500">
                    <Smartphone className="w-4 h-4 text-emerald-600" />
                    <span>+254</span>
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber.replace(/^\+?254/, '0')}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="0712 345 678"
                    className="w-full pl-18 pr-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm font-semibold text-neutral-900 outline-none focus:border-[#008751] focus:bg-white shadow-xs"
                    required
                  />
                </div>
                <p className="text-[11px] text-neutral-400 mt-1">
                  You will receive an automatic PIN prompt on this phone.
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-3 bg-neutral-50 rounded-2xl text-[11px] text-neutral-500 space-y-1">
                <div className="flex justify-between">
                  <span>Paybill / Account:</span>
                  <span className="font-mono font-bold text-neutral-800">{purposeDetails.accountNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transaction Amount:</span>
                  <span className="font-bold text-neutral-900">KSh {amount}.00</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#008751] hover:bg-[#007345] text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>Send M-PESA STK Push (KSh {amount})</span>
              </button>
            </form>
          )}

          {/* STEP 2: STK Prompt Sent Animation */}
          {step === 'prompting' && (
            <div className="py-8 flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-[#008751] animate-pulse">
                  <Smartphone className="w-8 h-8" />
                </div>
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-[#008751] text-white font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
                  {countdown}s
                </span>
              </div>
              <div>
                <h4 className="font-bold text-base text-neutral-900">STK Push Sent to Phone</h4>
                <p className="text-xs text-neutral-500 max-w-xs mt-1">
                  Please check your phone screen for the Safaricom PIN prompt to pay{' '}
                  <strong>KSh {amount}.00</strong>.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Simulated Phone Screen PIN Prompt */}
          {step === 'pin_entry' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-900 text-white rounded-2xl shadow-inner border border-neutral-700 space-y-3 font-mono">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-[10px] text-neutral-400">
                  <span>SAFARICOM M-PESA</span>
                  <span>SIM 1</span>
                </div>
                <div className="text-xs text-emerald-400 space-y-1">
                  <p>Do you want to pay <strong>KSh {amount}.00</strong> to <strong>ENEHUB / FINDLOCAL</strong>?</p>
                  <p className="text-neutral-300 text-[11px]">Acc: {purposeDetails.accountNumber}</p>
                </div>
                <div className="space-y-1 pt-1">
                  <label className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                    Enter M-PESA PIN:
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="••••"
                    autoFocus
                    className="w-full bg-neutral-800 text-center text-lg tracking-[0.5em] text-white font-bold py-2 rounded-xl border border-neutral-700 outline-none focus:border-emerald-400"
                  />
                </div>
              </div>

              {errorMessage && (
                <p className="text-xs text-rose-600 text-center font-medium">{errorMessage}</p>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep('input')}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPin}
                  className="flex-2 py-3 bg-[#008751] hover:bg-[#007345] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Authorize & Pay</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success Receipt */}
          {step === 'success' && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#008751] flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-lg text-neutral-900">Payment Confirmed!</h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Receipt: <span className="font-mono font-bold text-neutral-800">{receiptNumber}</span>
                </p>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-left w-full text-xs text-neutral-700 space-y-1 font-mono">
                <p className="text-emerald-800 font-bold">
                  {receiptNumber} Confirmed. Ksh{amount}.00 sent to ENEHUB for {purposeDetails.title} on{' '}
                  {new Date().toLocaleDateString()}.
                </p>
                <p className="text-[10px] text-neutral-500 pt-1">
                  Access unlocked instantaneously. Synchronizing your Google Sheets & Cloud database...
                </p>
              </div>
            </div>
          )}

          {/* STEP 5: Failed State */}
          {step === 'failed' && (
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-xs">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-base text-neutral-900">Transaction Incomplete</h4>
                <p className="text-xs text-neutral-500 mt-1 max-w-xs">{errorMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setStep('input')}
                className="w-full py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
