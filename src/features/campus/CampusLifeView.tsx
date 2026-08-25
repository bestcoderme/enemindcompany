/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Building2,
  Film,
  LayoutGrid,
  Phone,
  MessageCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Store,
  Calendar,
  Star,
  Globe,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Home,
  Utensils,
  Scissors,
  Printer,
  ChevronRight,
  TrendingUp,
  Map as MapIcon,
  Tag,
  ExternalLink,
  Users,
} from 'lucide-react';
import { FindLocalTikTokView } from '../../components/FindLocalTikTokView';
import { Badge } from '../../components/common/Badge';
import {
  BusinessProfile,
  BusinessCategory,
  CampusEvent,
} from '../../types/business';
import { businessService } from '../../services/campus/businessService';
import { BusinessDetailModal } from './components/BusinessDetailModal';
import { PublicWebsiteViewerModal } from './components/PublicWebsiteViewerModal';
import { WebsiteBuilderModal } from './components/WebsiteBuilderModal';
import { BusinessStudioModal } from './components/BusinessStudioModal';
import { EventDetailModal } from './components/EventDetailModal';
import { CreateBusinessModal } from './components/CreateBusinessModal';
import { UserProfile } from '../../types/user';

interface CampusLifeViewProps {
  onBack: () => void;
  onOpenPaymentModal: () => void;
  onOpenSheetLister: () => void;
  isUnlocked: boolean;
  hasSheet: boolean;
  user?: UserProfile | null;
}

export const CampusLifeView: React.FC<CampusLifeViewProps> = ({
  onBack,
  onOpenPaymentModal,
  onOpenSheetLister,
  isUnlocked,
  hasSheet,
  user = null,
}) => {
  const [activeMainTab, setActiveMainTab] = useState<'DIRECTORY' | 'EVENTS' | 'MAP' | 'TIKTOK'>('DIRECTORY');
  const [selectedCategory, setSelectedCategory] = useState<BusinessCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampus, setSelectedCampus] = useState<string>('ALL');
  const [studentOwnedOnly, setStudentOwnedOnly] = useState(false);
  const [orderingOnly, setOrderingOnly] = useState(false);

  // Selected entities for modals
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessProfile | null>(null);
  const [websiteViewerBusiness, setWebsiteViewerBusiness] = useState<BusinessProfile | null>(null);
  const [websiteBuilderBusiness, setWebsiteBuilderBusiness] = useState<BusinessProfile | null>(null);
  const [studioBusiness, setStudioBusiness] = useState<BusinessProfile | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CampusEvent | null>(null);
  const [isCreateBusinessOpen, setIsCreateBusinessOpen] = useState(false);

  // Data
  const [businesses, setBusinesses] = useState<BusinessProfile[]>(() => businessService.getBusinesses());
  const [events, setEvents] = useState<CampusEvent[]>(() => businessService.getEvents());

  const stats = businessService.getDirectoryStats();

  const filteredBusinesses = useMemo(() => {
    return businessService.getBusinesses({
      category: selectedCategory,
      campus: selectedCampus !== 'ALL' ? selectedCampus : undefined,
      searchQuery: searchQuery.trim() || undefined,
      studentOwnedOnly: studentOwnedOnly || undefined,
      orderingEnabledOnly: orderingOnly || undefined,
    });
  }, [selectedCategory, selectedCampus, searchQuery, studentOwnedOnly, orderingOnly, businesses]);

  const CATEGORIES: { id: BusinessCategory | 'ALL'; label: string; icon: any }[] = [
    { id: 'ALL', label: 'All Listings', icon: LayoutGrid },
    { id: 'HOSTEL', label: 'Hostels & Suites', icon: Home },
    { id: 'RESTAURANT', label: 'Food & Dining', icon: Utensils },
    { id: 'PRINTING', label: 'Cyber & Printing', icon: Printer },
    { id: 'BARBERSHOP', label: 'Barbershops', icon: Scissors },
    { id: 'SALON', label: 'Salons & Spa', icon: Sparkles },
    { id: 'STUDENT_BUSINESS', label: 'Student Ventures', icon: Store },
  ];

  const CAMPUSES = [
    'ALL',
    'Main Campus',
    'Chiromo Campus',
    'Madaraka Campus',
    'Juja Main Campus',
    'Parklands Campus',
  ];

  // User's own businesses if any
  const myBusinesses = useMemo(() => {
    if (!user) return [];
    return businessService.getBusinessesByOwner(user.email || user.name || '');
  }, [user, businesses]);

  // Render TikTok View if selected
  if (activeMainTab === 'TIKTOK') {
    return (
      <div className="relative space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="purple">TikTok Reel Mode</Badge>
            <span className="text-xs text-neutral-500">Immersive swipeable campus directory</span>
          </div>
          <button
            onClick={() => setActiveMainTab('DIRECTORY')}
            className="px-3 py-1.5 rounded-xl bg-white border border-neutral-300 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 flex items-center gap-1.5 cursor-pointer"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Switch to Directory Grid</span>
          </button>
        </div>

        <FindLocalTikTokView
          onBack={onBack}
          onOpenPaymentModal={onOpenPaymentModal}
          onOpenSheetLister={onOpenSheetLister}
          isUnlocked={isUnlocked}
          hasSheet={hasSheet}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Quick Controls */}
      <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-r from-neutral-900 via-neutral-900 to-neutral-950 text-white shadow-xl relative overflow-hidden border border-neutral-800">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold mb-3 border border-emerald-500/30">
            <Store className="w-3.5 h-3.5" />
            <span>Enemind Phase 7 • Campus Life & Micro-Websites</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white leading-tight mb-2">
            Campus Life, Local Businesses & Websites
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed mb-6">
            Discover verified hostels, campus dining, cyber printing, and student services. Powered by Google Sheets databases and instant custom micro-websites.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsCreateBusinessOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register Business / Service</span>
            </button>

            {myBusinesses.length > 0 ? (
              <button
                onClick={() => setStudioBusiness(myBusinesses[0])}
                className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>My Business Studio ({myBusinesses.length})</span>
              </button>
            ) : (
              <button
                onClick={() => setStudioBusiness(businesses[0])}
                className="px-4 py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-white font-bold text-xs transition-all flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Merchant Studio Demo</span>
              </button>
            )}

            <button
              onClick={() => setActiveMainTab('TIKTOK')}
              className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-900 text-purple-200 font-bold text-xs transition-all flex items-center gap-1.5 border border-purple-700 cursor-pointer"
            >
              <Film className="w-3.5 h-3.5 text-purple-300" />
              <span>TikTok Reel View</span>
            </button>
          </div>
        </div>

        {/* Directory Stat Pills */}
        <div className="mt-6 pt-6 border-t border-neutral-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20 font-bold">
              {stats.verifiedBusinesses}
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Verified</span>
              <span className="font-bold text-white">Campus Merchants</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 font-bold">
              {stats.hostelsCount}
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Hostels</span>
              <span className="font-bold text-white">Student Suites</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20 font-bold">
              {stats.diningCount}
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Dining</span>
              <span className="font-bold text-white">Fast Campus Delivery</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20 font-bold">
              {stats.upcomingEventsCount}
            </div>
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">Events</span>
              <span className="font-bold text-white">Summits & Galas</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Tab Selector (Directory | Events | Campus Map) */}
      <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveMainTab('DIRECTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'DIRECTORY'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Business Directory ({businesses.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('EVENTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'EVENTS'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Campus Events & Galas ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveMainTab('MAP')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeMainTab === 'MAP'
                ? 'bg-neutral-900 text-white shadow-xs'
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Interactive Campus Map</span>
          </button>
        </div>
      </div>

      {/* 3. DIRECTORY TAB CONTENT */}
      {activeMainTab === 'DIRECTORY' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hostels, shawarma, thesis binding, barbershops, haircuts..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Campus Selector */}
              <select
                value={selectedCampus}
                onChange={(e) => setSelectedCampus(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-2.5 rounded-2xl bg-white border border-neutral-200 text-xs font-bold text-neutral-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                {CAMPUSES.map((c) => (
                  <option key={c} value={c}>
                    {c === 'ALL' ? '🏫 All Campus Locations' : `📍 ${c}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Pills & Toggles */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                      selectedCategory === cat.id
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    <cat.icon className="w-3.5 h-3.5" />
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStudentOwnedOnly(!studentOwnedOnly)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                    studentOwnedOnly
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  🎓 Student Ventures Only
                </button>

                <button
                  onClick={() => setOrderingOnly(!orderingOnly)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                    orderingOnly
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  ⚡ Online Ordering
                </button>
              </div>
            </div>
          </div>

          {/* Business Listing Grid */}
          {filteredBusinesses.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
              <Store className="w-10 h-10 text-neutral-400 mx-auto" />
              <h3 className="text-base font-bold text-neutral-900 font-heading">No listings found</h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                No campus businesses matched your current filter criteria. Try searching with different keywords or switch categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSearchQuery('');
                  setSelectedCampus('ALL');
                }}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBusinesses.map((biz) => (
                <div
                  key={biz.id}
                  onClick={() => setSelectedBusiness(biz)}
                  className="p-5 rounded-3xl bg-white border border-neutral-200 hover:border-emerald-500 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
                >
                  <div>
                    {/* Cover & Badges */}
                    <div className="aspect-video w-full rounded-2xl overflow-hidden mb-3 relative bg-neutral-100">
                      <img
                        src={biz.coverImage}
                        alt={biz.businessName}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                        <span className="px-2.5 py-0.5 rounded-md bg-neutral-950/80 backdrop-blur-xs text-white text-[10px] font-black uppercase tracking-wider">
                          {biz.category.replace('_', ' ')}
                        </span>
                        {biz.isStudentOwned && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-600/90 text-white text-[10px] font-bold">
                            Student
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-neutral-900 text-[11px] font-black flex items-center gap-1 shadow-xs">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{biz.rating}</span>
                      </div>
                    </div>

                    {/* Title & Info */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold text-neutral-900 font-heading leading-tight group-hover:text-emerald-700 transition-colors">
                        {biz.businessName}
                      </h3>
                      {biz.verificationStatus === 'VERIFIED' && (
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Verified Business" />
                      )}
                    </div>

                    <p className="text-[11px] text-neutral-500 flex items-center gap-1 mb-2 font-medium">
                      <MapPin className="w-3 h-3 text-neutral-400 shrink-0" />
                      <span className="truncate">{biz.location} ({biz.distanceFromCampus || biz.campus})</span>
                    </p>

                    <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed mb-4">
                      {biz.shortDescription || biz.description}
                    </p>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-neutral-400 block font-medium">Starting from</span>
                      <span className="text-xs font-black text-neutral-900">{biz.pricingRange}</span>
                    </div>

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setWebsiteViewerBusiness(biz)}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title="Open Micro-Website"
                      >
                        <Globe className="w-3 h-3 text-emerald-600" />
                        <span>Website</span>
                      </button>

                      {biz.whatsappNumber && (
                        <a
                          href={`https://wa.me/${biz.whatsappNumber.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        onClick={() => setSelectedBusiness(biz)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                      >
                        {biz.orderingEnabled ? 'Order' : biz.bookingEnabled ? 'Book' : 'View'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. EVENTS TAB CONTENT */}
      {activeMainTab === 'EVENTS' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 font-heading">
                Campus Events, Tech Summits & Sports
              </h2>
              <p className="text-xs text-neutral-500">
                Official student conferences, derbies, and concerts with Google Calendar synchronization.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {events.map((evt) => (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className="p-5 rounded-3xl bg-white border border-neutral-200 hover:border-purple-500 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="aspect-video w-full rounded-2xl overflow-hidden mb-3 relative bg-neutral-100">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-0.5 rounded-md bg-purple-900/90 text-white text-[10px] font-bold">
                        {evt.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-bold mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(evt.startDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 font-heading leading-tight mb-1.5 group-hover:text-purple-700 transition-colors">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-neutral-600 line-clamp-2 mb-3 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-400 block font-medium">Ticket</span>
                    <span className="text-xs font-black text-neutral-900">
                      {evt.isFree ? 'Free Pass' : `KSh ${evt.price}`}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedEvent(evt)}
                    className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    View & Register
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. INTERACTIVE MAP TAB CONTENT */}
      {activeMainTab === 'MAP' && (
        <div className="p-6 rounded-3xl bg-white border border-neutral-200 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 font-heading">
                Interactive University Map & Location Pins
              </h2>
              <p className="text-xs text-neutral-500">
                Visual campus proximity matrix around University of Nairobi & surrounding hubs.
              </p>
            </div>
          </div>

          <div className="relative aspect-21/9 rounded-2xl bg-neutral-900 overflow-hidden border border-neutral-800 flex items-center justify-center text-white">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1400&auto=format&fit=crop&q=80"
              alt="Map"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-radial from-transparent to-neutral-950/90" />

            {/* Pins on Map */}
            <div className="absolute inset-0 p-8 flex flex-wrap items-center justify-around">
              {businesses.map((biz) => (
                <button
                  key={biz.id}
                  onClick={() => setSelectedBusiness(biz)}
                  className="px-3 py-1.5 rounded-xl bg-neutral-950/90 border border-emerald-500 text-white hover:bg-emerald-600 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 cursor-pointer backdrop-blur-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-xs font-bold">{biz.businessName}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick List from Map */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {businesses.map((biz) => (
              <div
                key={biz.id}
                onClick={() => setSelectedBusiness(biz)}
                className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-emerald-500 transition-all cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-xs text-neutral-900">{biz.businessName}</h4>
                  <span className="text-[11px] text-neutral-500">{biz.location}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Active Modals */}
      {selectedBusiness && (
        <BusinessDetailModal
          isOpen={!!selectedBusiness}
          onClose={() => setSelectedBusiness(null)}
          business={selectedBusiness}
          user={user}
          onBusinessUpdated={(updated) => {
            setBusinesses(businessService.getBusinesses());
            setSelectedBusiness(updated);
          }}
        />
      )}

      {websiteViewerBusiness && (
        <PublicWebsiteViewerModal
          isOpen={!!websiteViewerBusiness}
          onClose={() => setWebsiteViewerBusiness(null)}
          business={websiteViewerBusiness}
          user={user}
        />
      )}

      {websiteBuilderBusiness && (
        <WebsiteBuilderModal
          isOpen={!!websiteBuilderBusiness}
          onClose={() => setWebsiteBuilderBusiness(null)}
          business={websiteBuilderBusiness}
        />
      )}

      {studioBusiness && (
        <BusinessStudioModal
          isOpen={!!studioBusiness}
          onClose={() => setStudioBusiness(null)}
          business={studioBusiness}
          user={user}
          onBusinessUpdated={(updated) => {
            setBusinesses(businessService.getBusinesses());
            setStudioBusiness(updated);
          }}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          user={user}
          onEventUpdated={(updated) => {
            setEvents(businessService.getEvents());
            setSelectedEvent(updated);
          }}
        />
      )}

      {isCreateBusinessOpen && (
        <CreateBusinessModal
          isOpen={isCreateBusinessOpen}
          onClose={() => setIsCreateBusinessOpen(false)}
          user={user}
          onBusinessCreated={(biz) => {
            setBusinesses(businessService.getBusinesses());
            setStudioBusiness(biz);
          }}
        />
      )}
    </div>
  );
};
