/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  MapPin,
  Phone,
  MessageCircle,
  Globe,
  Clock,
  Star,
  CheckCircle2,
  ShieldCheck,
  ShoppingBag,
  Calendar,
  Layers,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Share2,
  FileSpreadsheet,
  Folder,
  SlidersHorizontal,
  Home,
  Utensils,
  Scissors,
  Printer,
} from 'lucide-react';
import {
  BusinessProfile,
  BusinessMenuItem,
  BusinessServiceItem,
  BusinessRoomOption,
  OrderItem,
} from '../../../types/business';
import { UserProfile } from '../../../types/user';
import { PublicWebsiteViewerModal } from './PublicWebsiteViewerModal';
import { WebsiteBuilderModal } from './WebsiteBuilderModal';
import { OrderCheckoutModal } from './OrderCheckoutModal';
import { BookingModal } from './BookingModal';
import { businessService } from '../../../services/campus/businessService';

interface BusinessDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  user: UserProfile | null;
  onBusinessUpdated?: (updated: BusinessProfile) => void;
}

export const BusinessDetailModal: React.FC<BusinessDetailModalProps> = ({
  isOpen,
  onClose,
  business,
  user,
  onBusinessUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ROOMS' | 'MENU' | 'SERVICES' | 'REVIEWS' | 'GOOGLE_DB'>(
    business.category === 'HOSTEL' || business.category === 'HOTEL'
      ? 'ROOMS'
      : business.category === 'RESTAURANT' || business.category === 'CAFE'
      ? 'MENU'
      : business.services && business.services.length > 0
      ? 'SERVICES'
      : 'OVERVIEW'
  );

  const [isWebsiteViewerOpen, setIsWebsiteViewerOpen] = useState(false);
  const [isWebsiteBuilderOpen, setIsWebsiteBuilderOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<BusinessServiceItem | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<BusinessRoomOption | null>(null);
  const [cartItems, setCartItems] = useState<OrderItem[]>([]);

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!isOpen) return null;

  const isOwner = user?.email === business.ownerId || user?.name === business.ownerName || user?.role === 'SUPER_ADMIN';

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const res = businessService.addReview(business.id, {
      userId: user?.email || 'student_reviewer',
      userName: user?.name || 'Campus Student',
      rating: reviewRating,
      comment: reviewComment,
      verifiedCustomer: true,
    });

    if (res) {
      const updated = businessService.getBusinessById(business.id);
      if (updated && onBusinessUpdated) onBusinessUpdated(updated);
      setShowReviewForm(false);
      setReviewComment('');
    }
  };

  const addToCart = (item: BusinessMenuItem) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.itemId === item.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += 1;
        return copy;
      }
      return [...prev, { itemId: item.id, name: item.name, price: item.price, quantity: 1 }];
    });
    setIsOrderModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/85 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-4 max-h-[92vh] flex flex-col"
      >
        {/* Cover Header Banner */}
        <div className="relative h-48 sm:h-60 bg-neutral-900 shrink-0 overflow-hidden">
          <img
            src={business.coverImage}
            alt={business.businessName}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 to-transparent" />

          {/* Close & Action Buttons */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={() => setIsWebsiteViewerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/30 shadow-md cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Launch Website</span>
            </button>

            {isOwner && (
              <button
                onClick={() => setIsWebsiteBuilderOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Website Builder</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Business Badges & Identity */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div className="flex items-center gap-4">
              <img
                src={business.logo}
                alt={business.businessName}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-xl bg-white"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500 text-neutral-950 text-[10px] font-black uppercase tracking-wider">
                    {business.category.replace('_', ' ')}
                  </span>
                  {business.verificationStatus === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-400/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified Partner</span>
                    </span>
                  )}
                  {business.isStudentOwned && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-400/30">
                      Student Owned
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white font-heading leading-tight mt-1">
                  {business.businessName}
                </h2>
                <p className="text-xs text-neutral-300 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{business.location} • {business.distanceFromCampus || business.campus}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end text-white">
              <div className="flex items-center gap-1 text-amber-400 text-sm font-bold">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{business.rating}</span>
                <span className="text-neutral-400 text-xs font-normal">({business.reviewCount})</span>
              </div>
              <span className="text-[11px] text-emerald-400 font-medium">
                {business.openingHours?.isOpenNow ? '● Open Now' : 'Closed'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Contact & Action Ribbon */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 text-xs">
            <a
              href={`tel:${business.phone}`}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-800 font-bold hover:bg-neutral-100 flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Call {business.phone}</span>
            </a>

            {business.whatsappNumber && (
              <a
                href={`https://wa.me/${business.whatsappNumber.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 flex items-center gap-1.5 transition-colors shadow-2xs"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Chat</span>
              </a>
            )}

            <button
              onClick={() => setIsWebsiteViewerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>{business.slug}.enemind.app</span>
            </button>
          </div>

          <div className="text-xs text-neutral-500 font-mono">
            {business.mpesaTillOrPaybill && <span>{business.mpesaTillOrPaybill}</span>}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 px-6 bg-white overflow-x-auto shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
              activeTab === 'OVERVIEW'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Overview & Amenities
          </button>

          {business.roomOptions && business.roomOptions.length > 0 && (
            <button
              onClick={() => setActiveTab('ROOMS')}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ROOMS'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Hostel Rooms ({business.roomOptions.length})</span>
            </button>
          )}

          {business.menu && business.menu.length > 0 && (
            <button
              onClick={() => setActiveTab('MENU')}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'MENU'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Campus Menu ({business.menu.length})</span>
            </button>
          )}

          {business.services && business.services.length > 0 && (
            <button
              onClick={() => setActiveTab('SERVICES')}
              className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SERVICES'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-neutral-500 hover:text-neutral-900'
              }`}
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>Services & Rates ({business.services.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('REVIEWS')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'REVIEWS'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Reviews ({business.reviews?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('GOOGLE_DB')}
            className={`py-3 px-4 border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'GOOGLE_DB'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cloud Database & Drive</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 font-heading mb-2">About the Business</h3>
                <p className="text-neutral-700 leading-relaxed text-xs sm:text-sm">{business.description}</p>
              </div>

              {business.amenities && business.amenities.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-heading mb-3">Key Features & Amenities</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {business.amenities.map((am, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-neutral-800">{am}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {business.gallery && business.gallery.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-heading mb-3">Facility Photos</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {business.gallery.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Gallery"
                        referrerPolicy="no-referrer"
                        className="aspect-video rounded-xl object-cover border border-neutral-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-neutral-900 font-heading mb-3">Operating Hours & Campus Location</h3>
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Address / Landmark:</span>
                    <span className="font-bold text-neutral-900">{business.address} ({business.location})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Campus Distance:</span>
                    <span className="font-bold text-emerald-700">{business.distanceFromCampus || 'Adjacent to campus'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Weekdays:</span>
                    <span className="font-bold text-neutral-900">{business.openingHours?.monday || '8:00 AM - 9:00 PM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Weekends:</span>
                    <span className="font-bold text-neutral-900">{business.openingHours?.saturday || '8:00 AM - 9:00 PM'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ROOMS TAB */}
          {activeTab === 'ROOMS' && business.roomOptions && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600 font-medium">
                  Showing all verified student room options. Zero agency fee.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {business.roomOptions.map((room) => (
                  <div key={room.id} className="p-4 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex flex-col justify-between">
                    <div>
                      {room.image && (
                        <img src={room.image} alt={room.name} referrerPolicy="no-referrer" className="w-full aspect-video rounded-xl object-cover mb-3" />
                      )}
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          {room.roomType}
                        </span>
                        <span className="text-emerald-700 font-bold">{room.availableUnits} units left</span>
                      </div>
                      <h4 className="text-sm font-bold text-neutral-900 font-heading mb-1">{room.name}</h4>
                      <p className="text-neutral-600 mb-3 leading-relaxed">{room.description}</p>
                      <div className="space-y-1 mb-4">
                        {room.amenities.map((am, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-neutral-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{am}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-neutral-500 block">Monthly Rate</span>
                        <span className="text-sm font-black text-neutral-900">KSh {room.priceMonthly.toLocaleString()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedRoom(room);
                          setSelectedService(null);
                          setIsBookingModalOpen(true);
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-xs cursor-pointer"
                      >
                        Schedule Free Visit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. MENU TAB */}
          {activeTab === 'MENU' && business.menu && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {business.menu.map((item) => (
                  <div key={item.id} className="p-3.5 rounded-2xl border border-neutral-200 bg-white flex gap-3 hover:border-neutral-300 transition-all">
                    {item.image && (
                      <img src={item.image} alt={item.name} referrerPolicy="no-referrer" className="w-16 h-16 rounded-xl object-cover shrink-0" />
                    )}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-neutral-900 font-heading">{item.name}</h4>
                          <span className="text-xs font-black text-emerald-700">KSh {item.price}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">{item.description}</p>
                      </div>

                      <div className="flex items-center justify-end mt-2">
                        <button
                          onClick={() => addToCart(item)}
                          className="px-3 py-1 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SERVICES TAB */}
          {activeTab === 'SERVICES' && business.services && (
            <div className="space-y-3">
              {business.services.map((srv) => (
                <div key={srv.id} className="p-4 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 block w-fit mb-1">
                      {srv.category} • {srv.durationMinutes} mins
                    </span>
                    <h4 className="font-bold text-neutral-900 font-heading text-sm">{srv.name}</h4>
                    <p className="text-neutral-500 mt-0.5">{srv.description}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="text-sm font-black text-neutral-900">KSh {srv.price}</span>
                    <button
                      onClick={() => {
                        setSelectedService(srv);
                        setSelectedRoom(null);
                        setIsBookingModalOpen(true);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-bold transition-all shadow-xs cursor-pointer"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 5. REVIEWS TAB */}
          {activeTab === 'REVIEWS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-neutral-900 font-heading">
                    Peer Ratings (★ {business.rating} / 5.0)
                  </h4>
                  <p className="text-neutral-500 text-[11px]">Based on {business.reviewCount} customer transactions</p>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  Write Review
                </button>
              </div>

              {showReviewForm && (
                <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className={`text-lg cursor-pointer ${star <= reviewRating ? 'text-amber-500' : 'text-neutral-300'}`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block font-bold text-neutral-700 mb-1">Review Comment</label>
                    <textarea
                      rows={3}
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience (food quality, wifi, speed of service, landlord hospitality)..."
                      className="w-full px-3 py-2 rounded-xl border border-neutral-300 bg-white"
                    />
                  </div>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 cursor-pointer">
                    Submit Review
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {(business.reviews || []).map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-900">{rev.userName}</span>
                        {rev.verifiedCustomer && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">
                            Verified Customer
                          </span>
                        )}
                      </div>
                      <span className="text-amber-500 font-bold">{'★'.repeat(rev.rating)}</span>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. GOOGLE DATABASE TAB */}
          {activeTab === 'GOOGLE_DB' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                  <span>Google Sheets-as-a-Database Architecture</span>
                </div>
                <p className="text-emerald-800 leading-relaxed">
                  All menu items, bookings, hostel rooms, customer reviews, and M-PESA receipts for <strong>{business.businessName}</strong> are stored inside the business owner&apos;s personal Google Drive folder.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Google Drive Folder:</span>
                  <span className="font-mono font-bold text-neutral-900">{business.googleDriveFolderName || 'ENEMIND BUSINESS/' + business.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Google Sheet Database:</span>
                  <span className="font-mono font-bold text-emerald-700">{business.googleSheetId || 'Connected Sheet Database'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Website URL:</span>
                  <a href={`https://${business.slug}.enemind.app`} target="_blank" rel="noreferrer" className="font-mono font-bold text-blue-600 hover:underline">
                    https://{business.slug}.enemind.app
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals for Public Website Viewer & Website Builder & Checkout */}
        {isWebsiteViewerOpen && (
          <PublicWebsiteViewerModal
            isOpen={isWebsiteViewerOpen}
            onClose={() => setIsWebsiteViewerOpen(false)}
            business={business}
            user={user}
          />
        )}

        {isWebsiteBuilderOpen && (
          <WebsiteBuilderModal
            isOpen={isWebsiteBuilderOpen}
            onClose={() => setIsWebsiteBuilderOpen(false)}
            business={business}
          />
        )}

        {isOrderModalOpen && (
          <OrderCheckoutModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
            business={business}
            cartItems={cartItems}
            user={user}
            onOrderSuccess={() => {
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
