/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Store,
  Building2,
  MapPin,
  Phone,
  Mail,
  DollarSign,
  Sparkles,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { BusinessProfile, BusinessCategory } from '../../../types/business';
import { businessService } from '../../../services/campus/businessService';
import { googleSheetDeploymentService } from '../../../services/campus/googleSheetDeploymentService';
import { UserProfile } from '../../../types/user';

interface CreateBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onBusinessCreated: (business: BusinessProfile) => void;
}

export const CreateBusinessModal: React.FC<CreateBusinessModalProps> = ({
  isOpen,
  onClose,
  user,
  onBusinessCreated,
}) => {
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState<BusinessCategory>('RESTAURANT');
  const [description, setDescription] = useState('');
  const [campus, setCampus] = useState(user?.campus || 'Main Campus');
  const [city, setCity] = useState('Nairobi');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState(user?.phoneNumber || '');
  const [whatsappNumber, setWhatsappNumber] = useState(user?.phoneNumber || '');
  const [email, setEmail] = useState(user?.email || '');
  const [mpesaTillOrPaybill, setMpesaTillOrPaybill] = useState('');
  const [deploySheetDb, setDeploySheetDb] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName) return;

    setIsSubmitting(true);
    try {
      let biz: BusinessProfile;

      if (deploySheetDb) {
        // Deploy Google Drive Folder & Sheet
        const res = await googleSheetDeploymentService.deployProductForBusiness(
          category === 'RESTAURANT' || category === 'CAFE'
            ? 'db_prod_restaurant_pos'
            : category === 'HOSTEL' || category === 'HOTEL'
            ? 'db_prod_hostel_hotel_crm'
            : 'db_prod_salon_barber_crm',
          {
            businessName,
            category,
            campus,
            city,
            phone,
            email,
            ownerId: user?.email || 'user_owner',
            ownerName: user?.name || 'Campus Entrepreneur',
          }
        );
        biz = businessService.getBusinessById(res.businessId)!;
      } else {
        biz = businessService.createBusiness({
          ownerId: user?.email || 'user_owner',
          ownerName: user?.name || 'Campus Entrepreneur',
          businessName,
          slug: businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category,
          description: description || `Campus services by ${businessName} at ${campus}.`,
          shortDescription: `Serving students at ${campus}.`,
          logo: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=200&auto=format&fit=crop&q=80',
          coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&auto=format&fit=crop&q=80',
          phone,
          whatsappNumber,
          email,
          country: 'Kenya',
          city,
          campus,
          location: location || `${campus} Vicinity`,
          address: `${city}, Kenya`,
          openingHours: { monday: '8:00 AM - 9:00 PM', isOpenNow: true },
          services: [],
          products: [],
          menu: [],
          pricingRange: 'Student Friendly Rates',
          currency: 'KSh',
          paymentMethods: ['M-PESA Till', 'Cash'],
          bookingEnabled: true,
          orderingEnabled: true,
          deliveryEnabled: true,
          mpesaTillOrPaybill,
          isStudentOwned: true,
        });
      }

      onBusinessCreated(biz);
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-white">
                Register Campus Business / Service
              </h3>
              <span className="text-[11px] text-neutral-400">
                Launch micro-website & connect Google Sheet database
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
              Business / Service Name
            </label>
            <input
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g. Juja Shawarma Hub / Alpha Campus Salon"
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500"
              >
                <option value="RESTAURANT">Restaurant & Fast Food</option>
                <option value="CAFE">Cafe & Bakery</option>
                <option value="HOSTEL">Hostel & Student Housing</option>
                <option value="HOTEL">Hotel & Guest Rooms</option>
                <option value="BARBERSHOP">Barbershop & Grooming</option>
                <option value="SALON">Hair Salon & Spa</option>
                <option value="PRINTING">Printing, Cyber & Thesis</option>
                <option value="PHOTOGRAPHER">Photography & Media</option>
                <option value="STUDENT_BUSINESS">Student Venture / Retail</option>
                <option value="TUTOR">Peer Tutor & Academic Help</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                Campus Location
              </label>
              <input
                type="text"
                required
                value={campus}
                onChange={(e) => setCampus(e.target.value)}
                placeholder="e.g. Main Campus / Chiromo"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
              Physical Location / Landmark
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Gate B Commercial Center, Shop 4"
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
              Description & Offerings
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What do you offer to students and campus staff?"
              className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXX"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-700 uppercase tracking-wider text-[10px] mb-1">
                M-PESA Till / Paybill
              </label>
              <input
                type="text"
                value={mpesaTillOrPaybill}
                onChange={(e) => setMpesaTillOrPaybill(e.target.value)}
                placeholder="e.g. Till: 890123"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
            <input
              type="checkbox"
              id="deploy_sheet"
              checked={deploySheetDb}
              onChange={(e) => setDeploySheetDb(e.target.checked)}
              className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="deploy_sheet" className="text-emerald-950 font-medium cursor-pointer">
              <strong className="block font-bold text-emerald-900">Auto-create Google Sheet Database & Drive Folder</strong>
              Creates <code className="text-emerald-800 text-[10px]">/ENEMIND BUSINESS/{businessName || 'Your Business'}</code> in Google Drive and deploys custom micro-website.
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Store className="w-4 h-4" />
            <span>{isSubmitting ? 'Creating Business & Deploying Website...' : 'Register Business on Campus'}</span>
          </button>
        </form>
      </motion.div>
    </div>
  );
};
