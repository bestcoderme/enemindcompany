/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Globe,
  ExternalLink,
  ShoppingBag,
  Calendar,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Star,
  Check,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  BusinessProfile,
  BusinessWebsite,
  WebsiteSection,
  OrderItem,
  BusinessMenuItem,
  BusinessServiceItem,
  BusinessRoomOption,
} from '../../../types/business';
import { websiteBuilderService } from '../../../services/campus/websiteBuilderService';
import { OrderCheckoutModal } from './OrderCheckoutModal';
import { BookingModal } from './BookingModal';
import { UserProfile } from '../../../types/user';

interface PublicWebsiteViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  user: UserProfile | null;
}

export const PublicWebsiteViewerModal: React.FC<PublicWebsiteViewerModalProps> = ({
  isOpen,
  onClose,
  business,
  user,
}) => {
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BusinessServiceItem | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<BusinessRoomOption | null>(null);
  const [activeMenuCategory, setActiveMenuCategory] = useState<string>('All');

  if (!isOpen) return null;

  const website = websiteBuilderService.getWebsiteByBusinessId(business.id) || {
    id: `web_${business.id}`,
    businessId: business.id,
    slug: business.slug,
    title: business.businessName,
    tagline: business.shortDescription,
    theme: {
      themeName: 'EMERALD_CAMPUS' as const,
      primaryColor: '#059669',
      accentColor: '#10B981',
      backgroundColor: '#FAFAFA',
      textColor: '#171717',
      fontPreset: 'PLUS_JAKARTA' as const,
      radiusPreset: 'xl' as const,
      layoutStyle: 'MODERN_CLEAN' as const,
    },
    sections: [],
    isPublished: true,
    publishedUrl: `https://${business.slug}.enemind.app`,
    analytics: { totalViews: 10, uniqueVisitors: 8, menuViews: 5, bookingClicks: 2, orderClicks: 3, contactClicks: 1 },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const theme = website.theme;
  const primaryColor = theme?.primaryColor || '#059669';

  const addToCart = (item: BusinessMenuItem) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.itemId === item.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [
        ...prev,
        {
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const totalCartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const totalCartAmount = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const filterMenuItems = () => {
    if (!business.menu) return [];
    if (activeMenuCategory === 'All') return business.menu;
    return business.menu.filter((m) => m.category === activeMenuCategory);
  };

  const categories = ['All', ...new Set((business.menu || []).map((m) => m.category))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/90 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="bg-neutral-900 rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden border border-neutral-800 text-neutral-100 my-4 h-[94vh] flex flex-col"
      >
        {/* Browser Top Navigation Bar */}
        <div className="px-4 py-3 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 mr-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>

            {/* Simulated Domain Bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold text-emerald-400">https://</span>
              <span>{website.slug}.enemind.app</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-bold ml-1">
                SSL SECURED
              </span>
            </div>
          </div>

          {/* Device Switcher */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
            {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setDeviceView(mode)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                  deviceView === mode
                    ? 'bg-neutral-800 text-white shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {totalCartCount > 0 && (
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer animate-pulse"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Cart ({totalCartCount}) • KSh {totalCartAmount}</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Website Frame Canvas */}
        <div className="flex-1 overflow-y-auto bg-neutral-950 p-2 sm:p-4 flex justify-center">
          <div
            className={`transition-all duration-300 bg-white text-neutral-900 overflow-y-auto rounded-2xl shadow-2xl ${
              deviceView === 'mobile'
                ? 'w-[375px] min-h-full'
                : deviceView === 'tablet'
                ? 'w-[768px] min-h-full'
                : 'w-full max-w-5xl min-h-full'
            }`}
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {/* 1. Website Header Navigation */}
            <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100 px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={business.logo}
                  alt={business.businessName}
                  referrerPolicy="no-referrer"
                  className="w-9 h-9 rounded-xl object-cover border border-neutral-200"
                />
                <div>
                  <h1 className="text-sm font-black text-neutral-900 font-heading tracking-tight leading-tight">
                    {business.businessName}
                  </h1>
                  <span className="text-[10px] text-neutral-500 block">
                    {business.category.replace('_', ' ')} • {business.campus}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {business.whatsappNumber && (
                  <a
                    href={`https://wa.me/${business.whatsappNumber.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">WhatsApp</span>
                  </a>
                )}
                {business.orderingEnabled && (
                  <button
                    onClick={() => {
                      const el = document.getElementById('menu-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Order Online
                  </button>
                )}
                {business.bookingEnabled && (
                  <button
                    onClick={() => {
                      setSelectedService(business.services?.[0] || null);
                      setIsBookingModalOpen(true);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </header>

            {/* 2. Hero Section */}
            <section className="relative p-6 sm:p-10 bg-linear-to-b from-neutral-900 to-neutral-950 text-white overflow-hidden rounded-b-3xl">
              <div className="absolute inset-0 opacity-25">
                <img
                  src={business.coverImage}
                  alt={business.businessName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="relative z-10 max-w-2xl">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-3 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Campus Business • {business.universityName || business.campus}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-black font-heading tracking-tight leading-tight mb-3">
                  {business.businessName}
                </h2>

                <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
                  {business.description}
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  {business.orderingEnabled && (
                    <button
                      onClick={() => {
                        const el = document.getElementById('menu-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Browse Campus Menu</span>
                    </button>
                  )}

                  {business.bookingEnabled && (
                    <button
                      onClick={() => {
                        setSelectedService(business.services?.[0] || null);
                        setIsBookingModalOpen(true);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-100 transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Visit / Service</span>
                    </button>
                  )}

                  <a
                    href={`tel:${business.phone}`}
                    className="px-4 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 border border-neutral-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{business.phone}</span>
                  </a>
                </div>
              </div>
            </section>

            {/* 3. Hostel / Hotel Room Matrix (if accommodation) */}
            {business.roomOptions && business.roomOptions.length > 0 && (
              <section className="p-6 sm:p-10 border-b border-neutral-100">
                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block">
                    Campus Accommodation
                  </span>
                  <h3 className="text-xl font-bold font-heading text-neutral-900">
                    Available Rooms & Executive Suites
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Direct landlord pricing with zero middleman broker fees.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {business.roomOptions.map((room) => (
                    <div
                      key={room.id}
                      className="p-4 rounded-2xl border border-neutral-200 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between bg-neutral-50/50"
                    >
                      <div>
                        {room.image && (
                          <img
                            src={room.image}
                            alt={room.name}
                            referrerPolicy="no-referrer"
                            className="w-full aspect-video rounded-xl object-cover mb-3"
                          />
                        )}
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            {room.roomType}
                          </span>
                          <span className="text-xs text-emerald-700 font-semibold">
                            {room.availableUnits} units available
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900 font-heading mb-1">{room.name}</h4>
                        <p className="text-xs text-neutral-600 line-clamp-2 mb-3">{room.description}</p>

                        <div className="space-y-1 mb-4">
                          {room.amenities.map((am, i) => (
                            <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>{am}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-neutral-400 block font-medium">Monthly Rent</span>
                          <span className="text-sm font-black text-neutral-900">
                            KSh {room.priceMonthly.toLocaleString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedRoom(room);
                            setSelectedService(null);
                            setIsBookingModalOpen(true);
                          }}
                          className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
                        >
                          Book Visit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 4. Digital Food Menu Section (if restaurant/cafe) */}
            {business.menu && business.menu.length > 0 && (
              <section id="menu-section" className="p-6 sm:p-10 border-b border-neutral-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 block">
                      Fast Campus Delivery
                    </span>
                    <h3 className="text-xl font-bold font-heading text-neutral-900">
                      Digital Menu & Food Ordering
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Delivered steaming hot to campus halls in 15–20 minutes.
                    </p>
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setActiveMenuCategory(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          activeMenuCategory === cat
                            ? 'bg-neutral-900 text-white shadow-xs'
                            : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filterMenuItems().map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl border border-neutral-200 hover:border-neutral-300 hover:shadow-xs transition-all flex gap-4 bg-white"
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                        />
                      )}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h4 className="text-xs font-bold text-neutral-900 font-heading">{item.name}</h4>
                            {item.isPopular && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800 shrink-0">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 line-clamp-2 mb-2 leading-relaxed">
                            {item.description}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-700">
                            KSh {item.price}
                          </span>
                          <button
                            onClick={() => addToCart(item)}
                            className="px-3 py-1.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-xs"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 5. Services & Pricing Catalog (if services) */}
            {business.services && business.services.length > 0 && (
              <section className="p-6 sm:p-10 border-b border-neutral-100">
                <div className="mb-6">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-purple-600 block">
                    Verified Services
                  </span>
                  <h3 className="text-xl font-bold font-heading text-neutral-900">
                    Service Catalog & Instant Booking
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Book an appointment with Google Calendar instant synchronization.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {business.services.map((srv) => (
                    <div
                      key={srv.id}
                      className="p-4 rounded-2xl border border-neutral-200 hover:border-purple-300 hover:shadow-xs transition-all flex justify-between gap-4 bg-white"
                    >
                      <div className="flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 block w-fit mb-1.5">
                          {srv.category} • {srv.durationMinutes} mins
                        </span>
                        <h4 className="text-xs font-bold text-neutral-900 font-heading mb-1">{srv.name}</h4>
                        <p className="text-[11px] text-neutral-500 leading-relaxed mb-3">{srv.description}</p>
                      </div>

                      <div className="flex flex-col justify-between items-end shrink-0">
                        <span className="text-sm font-black text-neutral-900">
                          KSh {srv.price}
                        </span>
                        <button
                          onClick={() => {
                            setSelectedService(srv);
                            setSelectedRoom(null);
                            setIsBookingModalOpen(true);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-600 transition-all shadow-xs cursor-pointer"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 6. Photo Gallery */}
            {business.gallery && business.gallery.length > 0 && (
              <section className="p-6 sm:p-10 border-b border-neutral-100">
                <h3 className="text-base font-bold font-heading text-neutral-900 mb-4">
                  Facility Gallery & Media
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {business.gallery.map((img, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-neutral-100">
                      <img
                        src={img}
                        alt="Gallery"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 7. Verified Reviews */}
            {business.reviews && business.reviews.length > 0 && (
              <section className="p-6 sm:p-10 border-b border-neutral-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold font-heading text-neutral-900">
                    Student Reviews (★ {business.rating} / 5.0)
                  </h3>
                  <span className="text-xs text-neutral-500">{business.reviewCount} verified reviews</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {business.reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                            {rev.userName.charAt(0)}
                          </div>
                          <span className="text-xs font-bold text-neutral-900">{rev.userName}</span>
                        </div>
                        <span className="text-xs font-bold text-amber-500">
                          {'★'.repeat(rev.rating)}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* 8. Location & Operating Hours Footer */}
            <footer className="p-6 sm:p-10 bg-neutral-900 text-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-white font-heading mb-2">{business.businessName}</h4>
                  <p className="text-neutral-400 leading-relaxed mb-3">{business.shortDescription}</p>
                  <p className="text-neutral-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{business.location} • {business.address}</span>
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-heading mb-2">Operating Hours</h4>
                  <div className="space-y-1 text-neutral-400 text-[11px]">
                    <div className="flex justify-between">
                      <span>Mon - Fri:</span>
                      <span className="text-white font-medium">{business.openingHours?.monday || '8:00 AM - 9:00 PM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday:</span>
                      <span className="text-white font-medium">{business.openingHours?.saturday || '8:00 AM - 9:00 PM'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday:</span>
                      <span className="text-white font-medium">{business.openingHours?.sunday || '9:00 AM - 8:00 PM'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white font-heading mb-2">Direct Contact</h4>
                  <div className="space-y-2 text-neutral-400">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{business.phone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{website.slug}.enemind.app</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-500">
                <span>© {new Date().getFullYear()} {business.businessName}. All rights reserved.</span>
                <span className="flex items-center gap-1 text-neutral-400">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  Powered by Enemind Campus Business Engine & Google Cloud
                </span>
              </div>
            </footer>
          </div>
        </div>

        {/* Modals for Order / Booking */}
        {isOrderModalOpen && (
          <OrderCheckoutModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            business={business}
            cartItems={cartItems}
            user={user}
            onOrderSuccess={(order) => {
              setCartItems([]);
              setIsOrderModalOpen(false);
            }}
          />
        )}

        {isBookingModalOpen && (
          <BookingModal
            isOpen={isBookingModalOpen}
            onClose={() => setIsBookingModalOpen(false)}
            business={business}
            service={selectedService}
            room={selectedRoom}
            user={user}
            onBookingSuccess={() => {
              setIsBookingModalOpen(false);
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
