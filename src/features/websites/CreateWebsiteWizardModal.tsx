/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe,
  FileSpreadsheet,
  FolderOpen,
  Layers,
  Palette,
  ShieldCheck,
  CreditCard,
  Phone,
  HelpCircle,
  ExternalLink,
  Laptop,
  Check,
} from 'lucide-react';
import { WebsiteType, WebsiteTemplate, WebsiteModel } from '../../types/website';
import { websiteBuilderService } from '../../services/website/websiteBuilderService';
import { domainService } from '../../services/website/domainService';
import { pricingService } from '../../services/pricing/pricingService';
import { subscriptionService } from '../../services/subscription/subscriptionService';
import { providerRegistry } from '../../services/providers/providerRegistry';
import { UserProfile } from '../../types/user';

interface CreateWebsiteWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onWebsiteCreated: (newSite: WebsiteModel) => void;
  initialType?: WebsiteType;
}

type WizardStep =
  | 'PURPOSE'
  | 'TEMPLATE'
  | 'IDENTITY'
  | 'GOOGLE_DB'
  | 'CUSTOMIZE'
  | 'PREVIEW'
  | 'SUBSCRIBE'
  | 'SUCCESS';

export const CreateWebsiteWizardModal: React.FC<CreateWebsiteWizardModalProps> = ({
  isOpen,
  onClose,
  user,
  onWebsiteCreated,
  initialType = 'BUSINESS',
}) => {
  const [step, setStep] = useState<WizardStep>('PURPOSE');

  // Form State
  const [selectedType, setSelectedType] = useState<WebsiteType>(initialType);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tpl_restaurant');
  const [websiteName, setWebsiteName] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [databaseOption, setDatabaseOption] = useState<'NEW_SHEET' | 'EXISTING_SHEET' | 'LOCAL_DEMO'>('NEW_SHEET');
  const [existingSheetUrl, setExistingSheetUrl] = useState<string>('');
  const [accentColor, setAccentColor] = useState<string>('#059669');
  const [mpesaPhone, setMpesaPhone] = useState<string>(user.phoneNumber || user.phone || '0712345678');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [createdWebsite, setCreatedWebsite] = useState<WebsiteModel | null>(null);
  const [slugError, setSlugError] = useState<string | null>(null);

  if (!isOpen) return null;

  const templates = websiteBuilderService.getTemplates();
  const filteredTemplates = templates.filter(
    (t) => t.category === selectedType || ['BUSINESS', 'PORTFOLIO', 'SHOP', 'RESTAURANT', 'HOSTEL', 'TUTOR', 'CREATOR', 'SERVICE'].includes(t.category)
  );
  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const monthlyPrice = pricingService.getWebsiteMonthlyPrice();
  const formattedPrice = pricingService.getFormattedPrice(monthlyPrice);

  const handleNameChange = (name: string) => {
    setWebsiteName(name);
    if (!slug || slug === domainService.sanitizeSlug(websiteName)) {
      const generatedSlug = domainService.sanitizeSlug(name);
      setSlug(generatedSlug);
      validateSlug(generatedSlug);
    }
  };

  const handleSlugChange = (rawSlug: string) => {
    const clean = domainService.sanitizeSlug(rawSlug);
    setSlug(clean);
    validateSlug(clean);
  };

  const validateSlug = (testSlug: string) => {
    const existingWebsites = websiteBuilderService.getWebsites();
    const existingSlugs = existingWebsites.map((w) => w.slug);
    const result = domainService.validateSlug(testSlug, existingSlugs);
    if (!result.isValid) {
      setSlugError(result.error || 'Invalid slug');
      return false;
    } else {
      setSlugError(null);
      return true;
    }
  };

  const handlePurposeSelect = (type: WebsiteType) => {
    setSelectedType(type);
    const matchedTpl = templates.find((t) => t.category === type) || templates[0];
    setSelectedTemplateId(matchedTpl.id);
    setStep('TEMPLATE');
  };

  const handleCreateAndSubscribe = async (useDevBypass: boolean = false) => {
    if (!websiteName.trim()) return;
    setIsProcessingPayment(true);

    try {
      // 1. Create Google Sheet and Drive folder if requested
      let sheetId: string | undefined = undefined;
      let sheetUrl: string | undefined = undefined;

      if (databaseOption === 'NEW_SHEET') {
        const sheetResult = await providerRegistry.googleProvider.createSpreadsheet(
          `${websiteName} - Database`,
          ['Settings', 'Products', 'Orders', 'Inquiries']
        );
        sheetId = sheetResult.sheetId;
        sheetUrl = sheetResult.sheetUrl;
      } else if (databaseOption === 'EXISTING_SHEET' && existingSheetUrl) {
        sheetUrl = existingSheetUrl;
        sheetId = `ext_${Date.now()}`;
      }

      // 2. Instantiate Website Model
      const newSite = websiteBuilderService.createDefaultWebsiteInstance({
        ownerId: user.email || user.id,
        ownerName: user.name || user.displayName || 'Website Owner',
        name: websiteName,
        slug: slug || domainService.sanitizeSlug(websiteName),
        description: description || `Official website for ${websiteName}`,
        type: selectedType,
        templateId: selectedTemplateId,
        isDevelopmentMode: useDevBypass || providerRegistry.getIsDevelopmentMode(),
        googleSheetId: sheetId,
        googleSheetUrl: sheetUrl,
      });

      // Apply theme custom color
      newSite.theme.primaryColor = accentColor;
      newSite.theme.accentColor = accentColor;

      // 3. Process Subscription (KES 150/mo or Free Dev Mode bypass)
      if (useDevBypass || providerRegistry.getIsDevelopmentMode()) {
        subscriptionService.activateDevelopmentSubscription(newSite.id, user.email || user.id, user.email || user.id);
        newSite.subscriptionStatus = 'DEVELOPMENT';
        newSite.status = 'ACTIVE'; // Instant publish in Dev mode
      } else {
        const payRes = await providerRegistry.paymentProvider.initiateStkPush({
          amount: monthlyPrice,
          currency: 'KES',
          phoneNumber: mpesaPhone,
          accountReference: newSite.slug.toUpperCase(),
          transactionDesc: `Enemind Website Subscription: ${newSite.name}`,
        });

        if (payRes.success) {
          subscriptionService.activateWebsiteSubscription({
            websiteId: newSite.id,
            ownerId: user.email || user.id,
            ownerEmail: user.email || user.id,
            phoneNumber: mpesaPhone,
            receiptNumber: payRes.receiptNumber || `MPESA_${Date.now()}`,
            isDevelopmentMode: false,
          });
          newSite.subscriptionStatus = 'ACTIVE';
          newSite.status = 'ACTIVE';
        } else {
          throw new Error(payRes.message || 'M-PESA transaction failed');
        }
      }

      // 4. Save and return
      const saved = websiteBuilderService.saveWebsite(newSite);
      setCreatedWebsite(saved);
      onWebsiteCreated(saved);
      setStep('SUCCESS');
    } catch (e: any) {
      alert(`Error creating website: ${e?.message || 'Please check configuration'}`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col my-8"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-sm">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-neutral-900">
                  Create Your Website
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {formattedPrice} / month
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Enemind Website-as-a-Service + Google Sheets Database Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Tracker */}
        {step !== 'SUCCESS' && (
          <div className="px-6 py-2.5 bg-neutral-100/60 border-b border-neutral-200/60 flex items-center justify-between text-xs font-semibold text-neutral-600 overflow-x-auto gap-2">
            <span className={step === 'PURPOSE' ? 'text-emerald-700 font-bold' : ''}>1. Purpose</span>
            <span>&gt;</span>
            <span className={step === 'TEMPLATE' ? 'text-emerald-700 font-bold' : ''}>2. Template</span>
            <span>&gt;</span>
            <span className={step === 'IDENTITY' ? 'text-emerald-700 font-bold' : ''}>3. Name & URL</span>
            <span>&gt;</span>
            <span className={step === 'GOOGLE_DB' ? 'text-emerald-700 font-bold' : ''}>4. Google Sheet</span>
            <span>&gt;</span>
            <span className={step === 'SUBSCRIBE' ? 'text-emerald-700 font-bold' : ''}>5. Launch</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {/* STEP 1: PURPOSE */}
          {step === 'PURPOSE' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-heading font-extrabold text-lg text-neutral-900">
                  What is this website for?
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Websites on Enemind belong to everyone — student creators, local cafes, freelancers, hostels, tutors, and clubs.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { type: 'BUSINESS', label: 'Business & Shop', desc: 'Retail, printing, electronics & campus store' },
                  { type: 'RESTAURANT', label: 'Restaurant & Cafe', desc: 'Menu, fast food, online orders & table bookings' },
                  { type: 'HOSTEL', label: 'Hostel & Rental', desc: 'Room bookings, monthly rent, deposits & amenities' },
                  { type: 'PORTFOLIO', label: 'Portfolio & CV', desc: 'Projects, code links, client case studies & bio' },
                  { type: 'FREELANCER', label: 'Freelancer & Dev', desc: 'Services, client intake, pricing packages & leads' },
                  { type: 'CREATOR', label: 'Creator & Artist', desc: 'Social links, video embeds, merch & tickets' },
                  { type: 'TUTOR', label: 'Tutor & Teacher', desc: 'Subject coaching, revision schedules & 1-on-1 bookings' },
                  { type: 'EVENT', label: 'Event & Workshop', desc: 'Campus events, speaker lineup & RSVP tickets' },
                  { type: 'COMMUNITY', label: 'Club & Community', desc: 'Student organization, gallery & member join' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => handlePurposeSelect(item.type as WebsiteType)}
                    className={`text-left p-3.5 rounded-2xl border transition-all cursor-pointer hover:border-emerald-500 hover:shadow-sm ${
                      selectedType === item.type
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20'
                        : 'border-neutral-200 bg-white hover:bg-neutral-50'
                    }`}
                  >
                    <p className="font-bold text-xs text-neutral-900">{item.label}</p>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-snug">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: TEMPLATE SELECTION */}
          {step === 'TEMPLATE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-neutral-900">
                    Choose a Design Template
                  </h4>
                  <p className="text-xs text-neutral-500">
                    All templates include full mobile responsiveness and live Google Sheets database sync.
                  </p>
                </div>
                <button
                  onClick={() => setStep('PURPOSE')}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredTemplates.map((tpl) => (
                  <div
                    key={tpl.id}
                    onClick={() => setSelectedTemplateId(tpl.id)}
                    className={`rounded-2xl border p-3.5 transition-all cursor-pointer overflow-hidden ${
                      selectedTemplateId === tpl.id
                        ? 'border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-500/20 shadow-md'
                        : 'border-neutral-200 hover:border-neutral-300 hover:shadow-xs'
                    }`}
                  >
                    <div className="h-36 rounded-xl overflow-hidden bg-neutral-100 relative mb-3">
                      <img
                        src={tpl.thumbnail}
                        alt={tpl.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      {tpl.badge && (
                        <span className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] font-bold">
                          {tpl.badge}
                        </span>
                      )}
                      {selectedTemplateId === tpl.id && (
                        <div className="absolute inset-0 bg-emerald-900/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                            <Check className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="font-bold text-xs text-neutral-900">{tpl.name}</p>
                    <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug line-clamp-2">
                      {tpl.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setStep('IDENTITY')}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Continue to Name & Slug</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: IDENTITY & SUBDOMAIN */}
          {step === 'IDENTITY' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-neutral-900">
                    Website Name & Subdomain
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Your website gets a free high-speed subdomain on Enemind.
                  </p>
                </div>
                <button
                  onClick={() => setStep('TEMPLATE')}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Website Title / Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Campus Chill Cafe, Kevin Mutua Portfolio, Sunrise Hostels"
                    value={websiteName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Subdomain URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center rounded-xl bg-neutral-50 border border-neutral-200 overflow-hidden focus-within:border-emerald-500 focus-within:bg-white">
                    <span className="pl-3.5 pr-1 text-xs font-medium text-neutral-400 select-none">
                      https://
                    </span>
                    <input
                      type="text"
                      placeholder="my-name"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      className="flex-1 py-2.5 text-xs bg-transparent focus:outline-hidden font-bold text-emerald-800"
                    />
                    <span className="pr-3.5 pl-1 text-xs font-bold text-neutral-500 bg-neutral-100 py-2.5 border-l border-neutral-200 select-none">
                      .{domainService.getBaseDomain()}
                    </span>
                  </div>
                  {slugError && (
                    <p className="text-[11px] font-semibold text-rose-600 mt-1">{slugError}</p>
                  )}
                  {!slugError && slug && (
                    <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Subdomain is available!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Short Description / Tagline
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief 1-sentence description for visitors and search engines"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  disabled={!websiteName.trim() || Boolean(slugError)}
                  onClick={() => setStep('GOOGLE_DB')}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 disabled:opacity-50 flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Continue to Google Database</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: GOOGLE SHEETS DATABASE */}
          {step === 'GOOGLE_DB' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-neutral-900">
                    Google Sheets Database Integration
                  </h4>
                  <p className="text-xs text-neutral-500">
                    You own your data. Google Sheets acts as your real-time content management system.
                  </p>
                </div>
                <button
                  onClick={() => setStep('IDENTITY')}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              <div className="space-y-3">
                {/* Option A: Create New Sheet */}
                <div
                  onClick={() => setDatabaseOption('NEW_SHEET')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    databaseOption === 'NEW_SHEET'
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                        <span>Auto-create New Google Sheet</span>
                        <span className="text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded">Recommended</span>
                      </p>
                      <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed">
                        Enemind will create a formatted spreadsheet in your Google Drive with pre-structured tabs ({activeTemplate.recommendedSchema.recommendedTabs.map((t) => t.tabName).join(', ')}).
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option B: Connect Existing Sheet */}
                <div
                  onClick={() => setDatabaseOption('EXISTING_SHEET')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    databaseOption === 'EXISTING_SHEET'
                      ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20'
                      : 'border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xs text-neutral-900">
                        Connect Existing Google Sheet
                      </p>
                      <p className="text-[11px] text-neutral-600 mt-0.5 leading-relaxed">
                        Use a spreadsheet you already own. We will detect your columns and map fields without modifying existing data.
                      </p>
                      {databaseOption === 'EXISTING_SHEET' && (
                        <div className="mt-2.5">
                          <input
                            type="text"
                            placeholder="Paste Google Sheet URL (https://docs.google.com/spreadsheets/d/...)"
                            value={existingSheetUrl}
                            onChange={(e) => setExistingSheetUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Accent Color Customization */}
              <div className="pt-2">
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Choose Brand Accent Color
                </label>
                <div className="flex items-center gap-3">
                  {[
                    { color: '#059669', name: 'Emerald' },
                    { color: '#D97706', name: 'Amber' },
                    { color: '#0284C7', name: 'Sky' },
                    { color: '#6366F1', name: 'Indigo' },
                    { color: '#E11D48', name: 'Rose' },
                    { color: '#475569', name: 'Slate' },
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setAccentColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className={`w-8 h-8 rounded-full transition-transform cursor-pointer ${
                        accentColor === c.color ? 'scale-125 ring-4 ring-neutral-300' : 'hover:scale-110'
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  onClick={() => setStep('SUBSCRIBE')}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 flex items-center gap-2 shadow-xs cursor-pointer"
                >
                  <span>Review & Subscribe ({formattedPrice}/mo)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: SUBSCRIPTION & PUBLISH */}
          {step === 'SUBSCRIBE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-extrabold text-lg text-neutral-900">
                    Subscribe & Publish Website
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Standard plan provides full hosting, subdomain, and 2-way Google Sheets sync.
                  </p>
                </div>
                <button
                  onClick={() => setStep('GOOGLE_DB')}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>
              </div>

              {/* Plan Card */}
              <div className="p-5 rounded-2xl bg-neutral-950 text-white shadow-xl relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 uppercase tracking-wider">
                      Enemind Website Plan
                    </span>
                    <h5 className="font-heading font-black text-xl mt-1 text-white">{websiteName}</h5>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      https://{slug}.{domainService.getBaseDomain()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-black text-2xl text-emerald-400">{formattedPrice}</p>
                    <p className="text-[11px] text-neutral-400">per month</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800 grid grid-cols-2 gap-2 text-xs text-neutral-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Enemind subdomain</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Google Sheets Database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Visual Page Editor</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>M-PESA checkout forms</span>
                  </div>
                </div>
              </div>

              {/* Payment Input */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                <label className="block text-xs font-bold text-neutral-800 mb-1">
                  M-PESA Phone Number for Billing
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-800 focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  An STK Push of {formattedPrice} will be sent to your phone to activate your website.
                </p>
              </div>

              {/* Action Buttons: Real M-PESA vs Free Development Bypass */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-between">
                {/* Free Development Bypass Button */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleCreateAndSubscribe(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs border border-emerald-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Test without fees (Development Mode)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Free Dev Mode (Instant Activate)</span>
                </button>

                {/* Production M-PESA Activation */}
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={() => handleCreateAndSubscribe(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay {formattedPrice} via M-PESA</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS */}
          {step === 'SUCCESS' && createdWebsite && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h4 className="font-heading font-black text-2xl text-neutral-900">
                  Website Published Successfully!
                </h4>
                <p className="text-xs text-neutral-600 mt-1 max-w-md mx-auto">
                  Your website is now live on the Enemind network with full Google Sheets database integration.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 max-w-md mx-auto text-left">
                <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Live URL</p>
                <a
                  href={createdWebsite.publishedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-sm text-emerald-700 hover:underline flex items-center gap-1.5 mt-0.5"
                >
                  <span>{createdWebsite.publishedUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                {createdWebsite.googleSheetUrl && (
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Connected Google Sheet</p>
                    <a
                      href={createdWebsite.googleSheetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Open Database Spreadsheet</span>
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer"
                >
                  Done & Go to My Websites
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
