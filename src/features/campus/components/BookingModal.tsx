/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Calendar,
  Clock,
  User,
  Phone,
  CheckCircle2,
  Sparkles,
  MapPin,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { BusinessProfile, BusinessServiceItem, BusinessRoomOption, BusinessBooking } from '../../../types/business';
import { businessOrdersService } from '../../../services/campus/businessOrdersService';
import { UserProfile } from '../../../types/user';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
  service?: BusinessServiceItem | null;
  room?: BusinessRoomOption | null;
  user: UserProfile | null;
  onBookingSuccess: (booking: BusinessBooking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  business,
  service,
  room,
  user,
  onBookingSuccess,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phoneNumber || '0712345678');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BusinessBooking | null>(null);

  if (!isOpen) return null;

  const itemName = service ? service.name : room ? `${room.name} Viewing & Reservation` : 'Campus Appointment';
  const itemPrice = service ? service.price : room ? 0 : 0; // Room viewing is free reservation

  const TIME_SLOTS = [
    '08:30 AM',
    '10:00 AM',
    '11:30 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM',
    '07:00 PM',
  ];

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const booking = await businessOrdersService.createBooking({
        businessId: business.id,
        customerId: user?.email || 'guest_user',
        customerName: customerName || 'Campus Student',
        customerPhone: customerPhone || '0700000000',
        customerEmail: customerEmail || user?.email || 'student@enemind.org',
        serviceId: service?.id || room?.id,
        serviceName: itemName,
        date,
        timeSlot,
        notes,
        amount: itemPrice,
      });

      setCreatedBooking(booking);
      onBookingSuccess(booking);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-5 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-purple-400 block">
                {business.businessName}
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                {createdBooking ? 'Booking Confirmed!' : 'Schedule Appointment / Visit'}
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

        {createdBooking ? (
          <div className="p-6 space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-lg font-bold text-neutral-900 font-heading">
                Booking #{createdBooking.id} Confirmed!
              </h4>
              <p className="text-xs text-neutral-600 mt-1 max-w-xs mx-auto">
                Your appointment for <strong className="text-neutral-900">{createdBooking.serviceName}</strong> has been scheduled and added to Google Calendar.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-neutral-500">Service / Booking:</span>
                <span className="font-bold text-neutral-900">{createdBooking.serviceName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Date & Time:</span>
                <span className="font-bold text-neutral-900">
                  {createdBooking.date} at {createdBooking.timeSlot}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Location:</span>
                <span className="font-bold text-neutral-900">{business.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Google Calendar:</span>
                <span className="font-bold text-emerald-600">✓ Synchronized</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all shadow-md cursor-pointer"
            >
              Done & Return to Campus
            </button>
          </div>
        ) : (
          <form onSubmit={handleBooking} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
            {/* Target Item Card */}
            <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider block">
                  Booking Selection
                </span>
                <h4 className="text-xs font-bold text-purple-950 font-heading">{itemName}</h4>
                <p className="text-[11px] text-purple-800 mt-0.5">{business.location}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-purple-600 block">Rate</span>
                <span className="text-sm font-black text-purple-950">
                  {itemPrice > 0 ? `KSh ${itemPrice}` : 'Free Visit'}
                </span>
              </div>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                required
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            {/* Time Slot Picker */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1.5">
                Preferred Time Slot
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTimeSlot(slot)}
                    className={`py-2 px-1.5 rounded-xl border text-center font-bold text-[11px] transition-all cursor-pointer ${
                      timeSlot === slot
                        ? 'border-purple-600 bg-purple-600 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Student Name"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="07XXXXXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 mb-1">
                Notes or Preferences (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Specific haircut style / Semester 1 move-in date"
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-hidden"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-600 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Scheduling & Syncing Google Calendar...'
                  : itemPrice > 0
                  ? `Confirm & Pay KSh ${itemPrice} via M-PESA`
                  : 'Confirm Appointment (Free)'}
              </span>
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
