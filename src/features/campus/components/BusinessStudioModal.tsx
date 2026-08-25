/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Store,
  Layout,
  Plus,
  ShoppingBag,
  Calendar,
  DollarSign,
  Users,
  Eye,
  TrendingUp,
  FileSpreadsheet,
  Folder,
  Globe,
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  ExternalLink,
  RefreshCw,
  Edit2,
  Trash2,
} from 'lucide-react';
import {
  BusinessProfile,
  BusinessOrder,
  BusinessBooking,
  BusinessMenuItem,
  BusinessServiceItem,
  BusinessRoomOption,
} from '../../../types/business';
import { businessService } from '../../../services/campus/businessService';
import { businessOrdersService } from '../../../services/campus/businessOrdersService';
import { websiteBuilderService } from '../../../services/campus/websiteBuilderService';
import { websiteDataSyncService } from '../../../services/campus/websiteDataSyncService';
import { WebsiteBuilderModal } from './WebsiteBuilderModal';
import { PublicWebsiteViewerModal } from './PublicWebsiteViewerModal';
import { UserProfile } from '../../../types/user';

interface BusinessStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  user: UserProfile | null;
  onBusinessUpdated?: (updated: BusinessProfile) => void;
}

export const BusinessStudioModal: React.FC<BusinessStudioModalProps> = ({
  isOpen,
  onClose,
  business,
  user,
  onBusinessUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ORDERS' | 'BOOKINGS' | 'CATALOG' | 'GOOGLE_SYNC'>('DASHBOARD');
  const [isWebsiteBuilderOpen, setIsWebsiteBuilderOpen] = useState(false);
  const [isWebsiteViewerOpen, setIsWebsiteViewerOpen] = useState(false);

  // Orders & Bookings live list
  const [orders, setOrders] = useState<BusinessOrder[]>(() =>
    businessOrdersService.getOrdersForBusiness(business.id)
  );
  const [bookings, setBookings] = useState<BusinessBooking[]>(() =>
    businessOrdersService.getBookingsForBusiness(business.id)
  );

  // Catalog item editing
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState<Partial<BusinessMenuItem>>({
    name: '',
    category: 'Main Dishes',
    price: 250,
    description: '',
    isAvailable: true,
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const website = websiteBuilderService.getWebsiteByBusinessId(business.id);
  const analytics = website?.analytics || {
    totalViews: 342,
    uniqueVisitors: 198,
    menuViews: 145,
    bookingClicks: 42,
    orderClicks: 68,
    contactClicks: 29,
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'PAID' ? o.totalAmount : 0), 0) +
    bookings.reduce((sum, b) => sum + (b.paymentStatus === 'PAID' ? b.amount : 0), 0);

  const handleUpdateOrderStatus = (orderId: string, status: BusinessOrder['status']) => {
    const updated = businessOrdersService.updateOrderStatus(orderId, status);
    if (updated) {
      setOrders(businessOrdersService.getOrdersForBusiness(business.id));
    }
  };

  const handleUpdateBookingStatus = (bookingId: string, status: BusinessBooking['status']) => {
    const updated = businessOrdersService.updateBookingStatus(bookingId, status);
    if (updated) {
      setBookings(businessOrdersService.getBookingsForBusiness(business.id));
    }
  };

  const handleAddMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuItem.name) return;

    const item: BusinessMenuItem = {
      id: `menu_${Date.now()}`,
      name: newMenuItem.name,
      category: newMenuItem.category || 'Specials',
      price: Number(newMenuItem.price) || 200,
      description: newMenuItem.description || '',
      currency: 'KSh',
      isAvailable: true,
    };

    const updatedMenu = [...(business.menu || []), item];
    const updatedBiz = businessService.updateBusiness(business.id, { menu: updatedMenu });
    if (updatedBiz && onBusinessUpdated) onBusinessUpdated(updatedBiz);

    setShowAddMenuModal(false);
    setNewMenuItem({ name: '', category: 'Main Dishes', price: 250, description: '' });
  };

  const handleRunSync = async () => {
    setIsSyncing(true);
    setSyncMsg('Synchronizing catalog and orders with Google Sheet DB...');
    try {
      const log = await websiteDataSyncService.syncWebsiteToSheet(business.id);
      setSyncMsg(`✓ ${log.details}`);
    } catch (e: any) {
      setSyncMsg(`Sync error: ${e.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/90 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-neutral-900 rounded-3xl max-w-6xl w-full shadow-2xl overflow-hidden border border-neutral-800 text-neutral-100 my-4 h-[92vh] flex flex-col"
      >
        {/* Top Studio Header */}
        <div className="px-6 py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={business.logo}
              alt={business.businessName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-xl object-cover border border-neutral-700 bg-white"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white font-heading">{business.businessName}</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Business Owner Studio
                </span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">
                {business.slug}.enemind.app • {business.campus}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsWebsiteBuilderOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Edit Website</span>
            </button>

            <button
              onClick={() => setIsWebsiteViewerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-neutral-700 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Live Website</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-800 px-6 bg-neutral-950 text-xs font-bold">
          {[
            { id: 'DASHBOARD', label: 'Analytics & KPIs', icon: TrendingUp },
            { id: 'ORDERS', label: `Orders (${orders.length})`, icon: ShoppingBag },
            { id: 'BOOKINGS', label: `Bookings (${bookings.length})`, icon: Calendar },
            { id: 'CATALOG', label: 'Menu & Services Catalog', icon: Store },
            { id: 'GOOGLE_SYNC', label: 'Google Sheet Database', icon: FileSpreadsheet },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Studio Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* 1. DASHBOARD TAB */}
          {activeTab === 'DASHBOARD' && (
            <div className="space-y-6">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Gross Sales (KSh)</span>
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="text-2xl font-black text-white font-heading">
                    KSh {totalRevenue.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400 block mt-1">M-PESA & Cash Settled</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Website Visitors</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-2xl font-black text-white font-heading">
                    {analytics.uniqueVisitors}
                  </span>
                  <span className="text-[10px] text-blue-400 block mt-1">{analytics.totalViews} total page impressions</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Orders Received</span>
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                  </div>
                  <span className="text-2xl font-black text-white font-heading">{orders.length}</span>
                  <span className="text-[10px] text-amber-400 block mt-1">
                    {orders.filter((o) => o.status === 'COMPLETED').length} fulfilled
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider">Bookings & Visits</span>
                    <Calendar className="w-4 h-4 text-purple-400" />
                  </div>
                  <span className="text-2xl font-black text-white font-heading">{bookings.length}</span>
                  <span className="text-[10px] text-purple-400 block mt-1">Google Calendar Synced</span>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <h4 className="text-sm font-bold text-white font-heading">Recent Orders & Deliveries</h4>
                  {orders.length === 0 ? (
                    <p className="text-neutral-500">No customer orders placed yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {orders.slice(0, 3).map((ord) => (
                        <div key={ord.id} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">
                              #{ord.id} • {ord.customerName}
                            </div>
                            <span className="text-[11px] text-neutral-400">
                              {ord.items.length} items • KSh {ord.totalAmount}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                            {ord.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4">
                  <h4 className="text-sm font-bold text-white font-heading">Scheduled Bookings</h4>
                  {bookings.length === 0 ? (
                    <p className="text-neutral-500">No customer appointments booked yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {bookings.slice(0, 3).map((bk) => (
                        <div key={bk.id} className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-white">{bk.serviceName}</div>
                            <span className="text-[11px] text-neutral-400">
                              {bk.customerName} • {bk.date} at {bk.timeSlot}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                            {bk.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 2. ORDERS TAB */}
          {activeTab === 'ORDERS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-heading">
                  Customer Orders ({orders.length})
                </h4>
              </div>

              {orders.length === 0 ? (
                <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 text-neutral-500">
                  No orders placed yet. Orders made on your website or campus discovery will appear here live.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div key={ord.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-emerald-400 text-sm">#{ord.id}</span>
                          <span className="text-white font-bold">{ord.customerName}</span>
                          <span className="text-neutral-400">({ord.customerPhone})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded font-mono bg-neutral-800 text-neutral-300">
                            {ord.mpesaReceiptNumber || 'MPESA'}
                          </span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-bold"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PREPARING">PREPARING</option>
                            <option value="READY">READY FOR DELIVERY</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex justify-between text-neutral-300 text-xs">
                            <span>
                              {it.quantity}x {it.name}
                            </span>
                            <span className="font-mono font-bold">KSh {it.price * it.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {ord.deliveryAddress && (
                        <div className="text-[11px] text-neutral-400">
                          <strong>Delivery Destination:</strong> {ord.deliveryAddress}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. BOOKINGS TAB */}
          {activeTab === 'BOOKINGS' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white font-heading">
                Customer Bookings & Appointments ({bookings.length})
              </h4>

              {bookings.length === 0 ? (
                <div className="p-8 text-center bg-neutral-950 rounded-2xl border border-neutral-800 text-neutral-500">
                  No appointments booked yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {bookings.map((bk) => (
                    <div key={bk.id} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-purple-400">#{bk.id}</span>
                          <span className="text-white font-bold">{bk.serviceName}</span>
                        </div>
                        <p className="text-neutral-400 mt-1">
                          Client: <strong>{bk.customerName}</strong> ({bk.customerPhone}) • Date:{' '}
                          <strong>{bk.date}</strong> at <strong>{bk.timeSlot}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={bk.status}
                          onChange={(e) => handleUpdateBookingStatus(bk.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs font-bold"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. CATALOG TAB */}
          {activeTab === 'CATALOG' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white font-heading">Catalog & Menu Items</h4>
                <button
                  onClick={() => setShowAddMenuModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              {showAddMenuModal && (
                <form onSubmit={handleAddMenuItem} className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">Item / Meal Name</label>
                      <input
                        type="text"
                        required
                        value={newMenuItem.name}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                        placeholder="e.g. Loaded Shawarma Roll"
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-400 mb-1">Price in KSh</label>
                      <input
                        type="number"
                        required
                        value={newMenuItem.price}
                        onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-400 mb-1">Short Description</label>
                    <input
                      type="text"
                      value={newMenuItem.description}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                      placeholder="Ingredients or details..."
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold cursor-pointer">
                      Save to Menu
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddMenuModal(false)}
                      className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(business.menu || []).map((m) => (
                  <div key={m.id} className="p-3.5 rounded-2xl bg-neutral-950 border border-neutral-800 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-white font-heading">{m.name}</h5>
                      <span className="text-[11px] text-neutral-400">{m.category}</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">KSh {m.price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. GOOGLE SYNC TAB */}
          {activeTab === 'GOOGLE_SYNC' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                  <span>Google Sheet Database Connection</span>
                </div>
                <p className="text-emerald-200/80 leading-relaxed text-xs">
                  Your website data and orders are anchored directly to your Google Sheet database in Google Drive. You own and control 100% of your customer records.
                </p>
              </div>

              {syncMsg && (
                <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-400 font-mono text-xs">
                  {syncMsg}
                </div>
              )}

              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Google Drive Folder:</span>
                  <span className="font-mono font-bold text-white">{business.googleDriveFolderName || 'ENEMIND BUSINESS/' + business.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Connected Sheet DB:</span>
                  <span className="font-mono font-bold text-emerald-400">{business.googleSheetId || 'Live Connected Sheet'}</span>
                </div>
                <div className="pt-3 border-t border-neutral-800">
                  <button
                    onClick={handleRunSync}
                    disabled={isSyncing}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Push Website Updates to Google Sheet'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sub-modals */}
        {isWebsiteBuilderOpen && (
          <WebsiteBuilderModal
            isOpen={isWebsiteBuilderOpen}
            onClose={() => setIsWebsiteBuilderOpen(false)}
            business={business}
          />
        )}

        {isWebsiteViewerOpen && (
          <PublicWebsiteViewerModal
            isOpen={isWebsiteViewerOpen}
            onClose={() => setIsWebsiteViewerOpen(false)}
            business={business}
            user={user}
          />
        )}
      </motion.div>
    </div>
  );
};
