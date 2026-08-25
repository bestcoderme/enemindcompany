import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Zap,
  X,
  Plus,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  Info,
} from 'lucide-react';
import { UserProfile, SubscriptionState } from '../types';
import { exportListingsToGoogleSheetsCsv, generateUserGoogleSheet } from '../services/googleSheetsStorageService';
import { LocalListingItem, INITIAL_LOCAL_LISTINGS } from '../data/hubData';

interface GoogleSheetListerModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onInitiatePayment?: () => void;
  onListingCreated?: (item: LocalListingItem) => void;
  userEmail?: string;
  userName?: string;
  userUniversity?: string;
}

export const GoogleSheetListerModal: React.FC<GoogleSheetListerModalProps> = ({
  isOpen,
  onClose,
  user,
  onInitiatePayment,
  onListingCreated,
  userName: propUserName,
}) => {
  const displayName = user?.name || propUserName || 'Student';
  const hasSheet = Boolean(user?.subscription?.hasFindLocalGoogleSheet);
  const sheetName = user?.subscription?.findLocalSheetName || `${displayName} - Find Local Listings Database`;
  const sheetUrl = user?.subscription?.findLocalSheetUrl || 'https://docs.google.com/spreadsheets/';

  const [isCreatingListing, setIsCreatingListing] = useState(false);
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'Hostel' | 'Hotel' | 'Service' | 'Entertainment' | 'Health'>('Service');
  const [formServiceCat, setFormServiceCat] = useState('Tech & Laptop Repairs');
  const [formDistance, setFormDistance] = useState('50m from Gate A');
  const [formPrice, setFormPrice] = useState('From KSh 500');
  const [formContact, setFormContact] = useState(user?.phoneNumber || '+254 700 000 000');
  const [formWhatsApp, setFormWhatsApp] = useState(user?.whatsappNumber || '254700000000');
  const [formDescription, setFormDescription] = useState('');
  const [formAmenities, setFormAmenities] = useState('Fast Turnaround, Student Discount, Free Diagnostic');
  const [formSuccess, setFormSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCreateListingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formDescription.trim()) return;

    const newItem: LocalListingItem = {
      id: 'loc-usr-' + Date.now(),
      name: formName.trim(),
      type: formType,
      serviceCategory: formType === 'Service' ? (formServiceCat as any) : undefined,
      distance: formDistance,
      price: formPrice,
      rating: 5.0,
      image:
        formType === 'Service'
          ? 'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=1000&auto=format&fit=crop&q=80'
          : formType === 'Hostel'
          ? 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=1000&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1588508065123-287b28e013da?w=800&auto=format&fit=crop&q=80',
      ],
      youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      whatsappNumber: formWhatsApp.replace(/[^0-9]/g, ''),
      badge: 'Verified Student Merchant',
      address: 'Campus Business Center, Ground Floor',
      contact: formContact,
      caretakerName: displayName,
      description: formDescription.trim(),
      amenities: formAmenities.split(',').map((s) => s.trim()),
      likesCount: 1,
      sharesCount: 0,
      reviewsCount: 1,
      operatingHours: 'Mon - Sat: 8:00 AM - 7:00 PM',
      reviews: [
        {
          user: displayName,
          avatar: user?.avatarUrl,
          rating: 5,
          comment: 'Official verified listing active on campus network.',
          date: 'Just now',
        },
      ],
    };

    if (onListingCreated) {
      onListingCreated(newItem);
    }
    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setIsCreatingListing(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8"
      >
        {/* Modal Header */}
        <div className="p-6 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                Find Local Merchant Database
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                {hasSheet ? 'Your Personal Google Sheet' : 'Get Lister Google Sheet'}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Rules clarification notice */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-neutral-900">
              <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Listing Rules & Guidelines</span>
            </div>
            <ul className="space-y-1 text-neutral-600 text-[11px] list-disc pl-4">
              <li>
                <strong>Enemind Hub:</strong> 100% <strong>FREE</strong> to list and add study notes, past papers, assignments, and jobs.
              </li>
              <li>
                <strong>Find Local Hub:</strong> To publish hostels, hotels, repair services, or entertainment, you acquire your personal Google Sheet named <strong>"{displayName} - Find Local Listings Database"</strong> for <strong>KSh 100</strong> via M-Pesa.
              </li>
            </ul>
          </div>

          {!hasSheet ? (
            /* User DOES NOT have the Sheet yet -> Prompt to buy for 100 KSh */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    One-Time Purchase
                  </span>
                  <span className="text-sm font-extrabold text-emerald-950">
                    KSh 100.00
                  </span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900">
                  {displayName} - Find Local Listings Database
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Your dedicated Google Sheet database links directly to the Gen-Z Hub cloud. Add, edit, and manage your campus listings with instant real-time synchronization.
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Listings • Live WhatsApp & Phone Sync • Full Ownership</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onInitiatePayment) onInitiatePayment();
                }}
                className="w-full py-3.5 bg-[#008751] hover:bg-[#007345] text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-98"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Google Sheet via M-PESA (KSh 100)</span>
              </button>
            </div>
          ) : (
            /* User ALREADY OWNS the Sheet -> Show management & add listing */
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                    Active & Connected
                  </span>
                  <span className="text-xs font-bold text-emerald-900 font-mono">
                    Owner: {displayName}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>{sheetName}</span>
                </h4>
                <p className="text-xs text-neutral-600">
                  Your Google Sheet is active. You have verified privileges to publish listings on Find Local.
                </p>

                <div className="pt-2 flex flex-wrap gap-2">
                  <a
                    href={sheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-50 shadow-2xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                    <span>Open in Google Sheets</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => exportListingsToGoogleSheetsCsv(INITIAL_LOCAL_LISTINGS)}
                    className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-50 shadow-2xs cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export CSV Backup</span>
                  </button>
                </div>
              </div>

              {!isCreatingListing ? (
                <button
                  type="button"
                  onClick={() => setIsCreatingListing(true)}
                  className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>Post New Listing to Find Local</span>
                </button>
              ) : (
                /* Add listing form */
                <form onSubmit={handleCreateListingSubmit} className="space-y-3 pt-2 border-t border-neutral-100">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-neutral-700">
                    Publish New Item to Find Local
                  </h4>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Business or Service Title
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Kelvin's Fast Laptop Screen Repairs"
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:border-neutral-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Category
                      </label>
                      <select
                        value={formType}
                        onChange={(e) => setFormType(e.target.value as any)}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:border-neutral-900"
                      >
                        <option value="Service">Find a Service</option>
                        <option value="Hostel">Hostel</option>
                        <option value="Hotel">Hotel</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Health">Health</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Rates / Price
                      </label>
                      <input
                        type="text"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="e.g. From KSh 500"
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:border-neutral-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Description & Special Offers
                    </label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Describe your services, warranty, and special student discounts..."
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:border-neutral-900"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        WhatsApp Number
                      </label>
                      <input
                        type="text"
                        value={formWhatsApp}
                        onChange={(e) => setFormWhatsApp(e.target.value)}
                        placeholder="254712345678"
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Location / Distance
                      </label>
                      <input
                        type="text"
                        value={formDistance}
                        onChange={(e) => setFormDistance(e.target.value)}
                        placeholder="e.g. Student Center Floor 2"
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 outline-none focus:border-neutral-900"
                      />
                    </div>
                  </div>

                  {formSuccess ? (
                    <div className="p-3 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Listing Published & Saved to your Google Sheet!</span>
                    </div>
                  ) : (
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingListing(false)}
                        className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-2 py-2 bg-[#008751] hover:bg-[#007345] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                      >
                        Save & Sync to Sheet
                      </button>
                    </div>
                  )}
                </form>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
