/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Globe,
  ExternalLink,
  Smartphone,
  Tablet,
  Monitor,
  CheckCircle2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  ShoppingBag,
  Send,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { WebsiteModel, WebsitePage, WebsiteSection } from '../../types/website';
import { websiteDatabaseService } from '../../services/website/websiteDatabaseService';
import { websiteAnalyticsService } from '../../services/website/websiteAnalyticsService';
import { ENEMIND_LOGO_URL } from '../../constants/brand';

interface PublicWebsiteViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: WebsiteModel;
}

type DeviceMode = 'DESKTOP' | 'TABLET' | 'MOBILE';

export const PublicWebsiteViewModal: React.FC<PublicWebsiteViewModalProps> = ({
  isOpen,
  onClose,
  website,
}) => {
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('DESKTOP');
  const [activePageSlug, setActivePageSlug] = useState<string>('');

  // Interactive Form States
  const [contactName, setContactName] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');
  const [contactMessage, setContactMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  // Active Order / Booking Modal
  const [orderingItem, setOrderingItem] = useState<any | null>(null);
  const [orderPhone, setOrderPhone] = useState<string>('0712345678');
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const activePage =
    website.pages.find((p) => p.slug === activePageSlug) ||
    website.pages[0] || {
      id: 'default',
      title: 'Home',
      slug: '',
      navLabel: 'Home',
      layout: 'STANDARD',
      sections: [],
      isPublished: true,
      isCustom: false,
      order: 0,
    };

  const primaryColor = website.theme?.primaryColor || '#059669';

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await websiteDatabaseService.submitWebsiteForm({
        websiteId: website.id,
        googleSheetId: website.googleSheetId,
        formType: 'CONTACT',
        formData: {
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          message: contactMessage,
        },
      });
      websiteAnalyticsService.recordEvent(website.id, 'contact_click');
      setSubmitSuccess(true);
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setContactMessage('');
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch (err) {
      alert('Failed to submit message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingItem) return;

    setIsSubmitting(true);
    try {
      await websiteDatabaseService.submitWebsiteForm({
        websiteId: website.id,
        googleSheetId: website.googleSheetId,
        formType: 'ORDER',
        formData: {
          customerPhone: orderPhone,
          items: orderingItem.Name || orderingItem.RoomType || orderingItem.Title || 'Product',
          amount: orderingItem.Price || orderingItem.MonthlyPrice || 0,
        },
      });
      websiteAnalyticsService.recordEvent(website.id, 'order_complete', orderingItem.Name);
      setOrderSuccess(true);
      setTimeout(() => {
        setOrderSuccess(false);
        setOrderingItem(null);
      }, 2500);
    } catch (err) {
      alert('Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-neutral-950/90 backdrop-blur-md overflow-hidden">
      {/* Top Preview Bar */}
      <div className="h-14 px-4 sm:px-6 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs text-white truncate max-w-[200px]">
                {website.name}
              </span>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.5 rounded font-mono">
                {website.subdomain}.enemind.app
              </span>
            </div>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="hidden sm:flex items-center bg-neutral-800 rounded-xl p-1 border border-neutral-700">
          <button
            onClick={() => setDeviceMode('DESKTOP')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              deviceMode === 'DESKTOP' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Desktop View"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('TABLET')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              deviceMode === 'TABLET' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Tablet View"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button
            onClick={() => setDeviceMode('MOBILE')}
            className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              deviceMode === 'MOBILE' ? 'bg-neutral-900 text-white shadow-xs' : 'text-neutral-400 hover:text-white'
            }`}
            title="Mobile View"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href={website.publishedUrl}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Open in Tab</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Website View Container */}
      <div className="flex-1 overflow-y-auto p-2 sm:p-6 flex justify-center items-start bg-neutral-950">
        <div
          className={`bg-white transition-all duration-300 shadow-2xl rounded-2xl overflow-hidden flex flex-col min-h-[85vh] ${
            deviceMode === 'MOBILE'
              ? 'w-[375px] max-w-full'
              : deviceMode === 'TABLET'
              ? 'w-[768px] max-w-full'
              : 'w-full max-w-5xl'
          }`}
        >
          {/* Live Website Header / Navigation */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-neutral-100 px-6 py-3.5 flex items-center justify-between">
            <div
              onClick={() => setActivePageSlug('')}
              className="font-heading font-extrabold text-base text-neutral-900 cursor-pointer flex items-center gap-2"
            >
              <div
                className="w-7 h-7 rounded-lg text-white flex items-center justify-center font-bold text-xs shadow-xs"
                style={{ backgroundColor: primaryColor }}
              >
                {website.name.charAt(0)}
              </div>
              <span className="truncate">{website.name}</span>
            </div>

            <nav className="flex items-center gap-1 sm:gap-4 text-xs font-bold text-neutral-600">
              {website.pages.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActivePageSlug(p.slug)}
                  className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    activePageSlug === p.slug
                      ? 'text-white'
                      : 'hover:text-neutral-900 hover:bg-neutral-100'
                  }`}
                  style={activePageSlug === p.slug ? { backgroundColor: primaryColor } : {}}
                >
                  {p.navLabel || p.title}
                </button>
              ))}
            </nav>
          </header>

          {/* Page Sections Render */}
          <main className="flex-1">
            {activePage.sections.map((sec) => (
              <React.Fragment key={sec.id}>
                {/* HERO SECTION */}
                {sec.type === 'HERO' && (
                  <section className="relative px-6 py-12 sm:py-20 bg-neutral-50 overflow-hidden border-b border-neutral-100">
                    <div className="max-w-3xl mx-auto text-center space-y-4">
                      {sec.content?.badge && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {sec.content.badge}
                        </span>
                      )}
                      <h1 className="font-heading font-black text-3xl sm:text-5xl text-neutral-900 tracking-tight leading-tight">
                        {sec.content?.headline || sec.title}
                      </h1>
                      <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
                        {sec.content?.tagline || sec.subtitle}
                      </p>
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                        {sec.content?.ctaPrimaryText && (
                          <a
                            href={sec.content.ctaPrimaryAction || '#contact'}
                            className="px-6 py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: primaryColor }}
                          >
                            {sec.content.ctaPrimaryText}
                          </a>
                        )}
                        {sec.content?.ctaSecondaryText && (
                          <button
                            onClick={() => setActivePageSlug('about')}
                            className="px-5 py-3 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm hover:bg-neutral-100 transition-colors"
                          >
                            {sec.content.ctaSecondaryText}
                          </button>
                        )}
                      </div>
                    </div>
                  </section>
                )}

                {/* ABOUT SECTION */}
                {sec.type === 'ABOUT' && (
                  <section className="px-6 py-12 max-w-4xl mx-auto space-y-6">
                    <div className="text-center max-w-2xl mx-auto">
                      <h2 className="font-heading font-extrabold text-2xl text-neutral-900">
                        {sec.title}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">{sec.subtitle}</p>
                    </div>
                    <p className="text-sm text-neutral-700 leading-relaxed text-center">
                      {sec.content?.story || 'Empowering the campus community with top-tier offerings.'}
                    </p>
                  </section>
                )}

                {/* MENU / RESTAURANT ITEMS SECTION */}
                {sec.type === 'MENU' && (
                  <section id="menu" className="px-6 py-12 bg-neutral-50 border-y border-neutral-100">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-heading font-extrabold text-2xl text-neutral-900">
                            {sec.title}
                          </h2>
                          <p className="text-xs text-neutral-500 mt-0.5">{sec.subtitle}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" /> Google Sheets Synced
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(sec.content?.items || []).map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between gap-3"
                          >
                            <div>
                              <p className="font-bold text-sm text-neutral-900">{item.Name}</p>
                              <p className="text-xs text-neutral-500 mt-0.5">{item.Description}</p>
                              <p className="font-bold text-xs text-emerald-700 mt-2">
                                KES {Number(item.Price || 0).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => setOrderingItem(item)}
                              className="px-3.5 py-2 rounded-xl text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Order
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ROOMS / HOSTEL SECTION */}
                {sec.type === 'ROOMS' && (
                  <section id="rooms" className="px-6 py-12 bg-neutral-50 border-y border-neutral-100">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="font-heading font-extrabold text-2xl text-neutral-900">
                            {sec.title}
                          </h2>
                          <p className="text-xs text-neutral-500 mt-0.5">{sec.subtitle}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(sec.content?.items || []).map((room: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-bold text-sm text-neutral-900">{room.RoomType}</p>
                                <p className="text-xs text-neutral-500 mt-0.5">{room.Description}</p>
                              </div>
                              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                                KES {Number(room.MonthlyPrice || 0).toLocaleString()}/mo
                              </span>
                            </div>
                            {room.Amenities && (
                              <p className="text-[11px] text-neutral-600 bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                                Amenities: {room.Amenities}
                              </p>
                            )}
                            <button
                              onClick={() => setOrderingItem(room)}
                              className="w-full py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer shadow-xs"
                              style={{ backgroundColor: primaryColor }}
                            >
                              Book Room Tour
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* PROJECTS / PORTFOLIO SECTION */}
                {sec.type === 'PORTFOLIO' && (
                  <section id="projects" className="px-6 py-12 bg-neutral-50 border-y border-neutral-100">
                    <div className="max-w-4xl mx-auto space-y-6">
                      <div className="text-center max-w-xl mx-auto">
                        <h2 className="font-heading font-extrabold text-2xl text-neutral-900">
                          {sec.title}
                        </h2>
                        <p className="text-xs text-neutral-500 mt-0.5">{sec.subtitle}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(sec.content?.items || []).map((proj: any, idx: number) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-2"
                          >
                            <p className="font-bold text-sm text-neutral-900">{proj.Title}</p>
                            <p className="text-xs text-neutral-600 leading-relaxed">{proj.Description}</p>
                            {proj.Technologies && (
                              <p className="text-[11px] font-mono text-indigo-700 font-semibold">
                                {proj.Technologies}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* CONTACT SECTION */}
                {sec.type === 'CONTACT' && (
                  <section id="contact" className="px-6 py-12 max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <h2 className="font-heading font-extrabold text-2xl text-neutral-900">
                            {sec.title}
                          </h2>
                          <p className="text-xs text-neutral-500 mt-1">{sec.subtitle}</p>
                        </div>

                        <div className="space-y-2.5 text-xs text-neutral-700">
                          <div className="flex items-center gap-2.5">
                            <Phone className="w-4 h-4 text-emerald-600" />
                            <span>{sec.content?.phone || '+254 712 345 678'}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Mail className="w-4 h-4 text-emerald-600" />
                            <span>{sec.content?.email || 'support@enemind.app'}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <MapPin className="w-4 h-4 text-emerald-600" />
                            <span>{sec.content?.location || 'University Campus, Nairobi'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Form */}
                      <form onSubmit={handleContactSubmit} className="space-y-3 p-5 rounded-2xl bg-neutral-50 border border-neutral-200">
                        {submitSuccess && (
                          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Message sent to owner's Google Sheet!
                          </div>
                        )}
                        <div>
                          <input
                            type="text"
                            required
                            placeholder="Your Full Name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                          />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                        <div>
                          <textarea
                            rows={3}
                            required
                            placeholder="Your Message..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
                          style={{ backgroundColor: primaryColor }}
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                        </button>
                      </form>
                    </div>
                  </section>
                )}
              </React.Fragment>
            ))}
          </main>

          {/* Website Footer */}
          <footer className="px-6 py-6 border-t border-neutral-100 text-center text-xs text-neutral-500 bg-white space-y-2">
            <p>© {new Date().getFullYear()} {website.name}. All rights reserved.</p>
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-400">
              <img
                src={ENEMIND_LOGO_URL}
                alt="ENEMIND"
                referrerPolicy="no-referrer"
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>Powered by <strong className="text-neutral-700 font-bold">ENEMIND WaaS Platform</strong> (enemindcompany.co.ke)</span>
            </div>
          </footer>
        </div>
      </div>

      {/* Interactive Order / Booking Checkout Modal */}
      {orderingItem && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 border border-neutral-200">
            <div className="flex items-center justify-between">
              <h4 className="font-heading font-bold text-base text-neutral-900">
                Confirm Order & Booking
              </h4>
              <button
                onClick={() => setOrderingItem(null)}
                className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {orderSuccess ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm text-neutral-900">Order Confirmed!</p>
                <p className="text-xs text-neutral-500">
                  Logged directly to the owner's Google Sheet database.
                </p>
              </div>
            ) : (
              <form onSubmit={handleOrderSubmit} className="space-y-3">
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">
                  <p className="font-bold text-neutral-900">
                    {orderingItem.Name || orderingItem.RoomType || orderingItem.Title}
                  </p>
                  <p className="text-emerald-700 font-extrabold mt-1">
                    KES {Number(orderingItem.Price || orderingItem.MonthlyPrice || 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    M-PESA Phone Number for Checkout
                  </label>
                  <input
                    type="text"
                    required
                    value={orderPhone}
                    onChange={(e) => setOrderPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-neutral-300 text-xs font-bold text-neutral-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  style={{ backgroundColor: primaryColor }}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isSubmitting ? 'Processing...' : 'Complete with M-PESA'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
