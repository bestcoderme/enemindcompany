/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../types/user';
import { SessionOffering, Booking, ProviderAvailability } from '../../types/mentorship';
import { BookingService, TimeSlot } from '../../services/mentorship/bookingService';
import { MentorService } from '../../services/mentorship/mentorService';
import { TeacherService } from '../../services/mentorship/teacherService';
import { paymentService } from '../../services/payments/paymentService';
import { GoogleCalendarMeetService } from '../../services/mentorship/googleCalendarMeetService';
import { calendarService } from '../../services/google/calendarService';
import { emailService } from '../../services/google/emailService';
import {
  X,
  Calendar,
  Clock,
  Globe,
  CreditCard,
  Phone,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Video,
  MessageSquare,
  Download,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  offering: SessionOffering;
  onBookingConfirmed: (booking: Booking) => void;
  onOpenSessionRoom: (booking: Booking) => void;
  onOpenChat: (conversationId: string) => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  user,
  offering,
  onBookingConfirmed,
  onOpenSessionRoom,
  onOpenChat,
}) => {
  const [step, setStep] = useState<'slot_picker' | 'review_notes' | 'payment' | 'confirmed'>('slot_picker');

  // Timezone & Date selection
  const [viewerTimezone, setViewerTimezone] = useState('Africa/Nairobi');
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  // Student notes & Focus area
  const [studentNotes, setStudentNotes] = useState('');

  // Payment state
  const isFree = offering.price === 0;
  const [paymentPhone, setPaymentPhone] = useState(user.phoneNumber || user.whatsappNumber || '0712345678');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Created booking result
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Load provider availability and slots
  useEffect(() => {
    if (!isOpen || !offering) return;

    let availability: ProviderAvailability | undefined;
    if (offering.providerType === 'MENTOR') {
      const mentor = MentorService.getMentorById(offering.providerId);
      availability = mentor?.availability;
    } else {
      const teacher = TeacherService.getTeacherById(offering.providerId);
      availability = teacher?.availability;
    }

    if (!availability) {
      availability = {
        days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        startTime: '09:00',
        endTime: '18:00',
        timezone: 'Africa/Nairobi',
        sessionDuration: offering.durationMinutes || 45,
        breakDuration: 15,
        blockedDates: [],
        vacationDates: [],
        recurringAvailability: true,
      };
    }

    const slots = BookingService.generateAvailableSlots(
      availability,
      offering.providerId,
      selectedDateStr,
      viewerTimezone
    );
    setAvailableSlots(slots);
    setSelectedSlot(slots.find((s) => s.isAvailable) || null);
  }, [isOpen, offering, selectedDateStr, viewerTimezone]);

  if (!isOpen || !offering) return null;

  const handleProceedToPaymentOrConfirm = () => {
    if (!selectedSlot) {
      setPaymentError('Please select an available time slot.');
      return;
    }

    if (isFree) {
      // Free session - instant confirm
      try {
        const booking = BookingService.createBooking({
          student: user,
          providerId: offering.providerId,
          providerType: offering.providerType,
          providerName: offering.providerName,
          providerAvatar: offering.providerAvatar,
          sessionOfferingId: offering.id,
          scheduledStart: selectedSlot.startUtc,
          scheduledEnd: selectedSlot.endUtc,
          timezone: viewerTimezone,
          notes: studentNotes,
          paymentMethod: 'free',
        });
        setConfirmedBooking(booking);
        setStep('confirmed');
        onBookingConfirmed(booking);

        // Sync to Google Calendar & send Gmail confirmation
        calendarService.createEvent({
          summary: `${offering.title} - ${offering.providerName}`,
          description: `ENEMIND Mentorship Session with ${offering.providerName}.\nMeet Link: ${booking.meetingUrl || 'https://meet.google.com'}\nNotes: ${studentNotes || 'None'}`,
          startTime: selectedSlot.startUtc,
          endTime: selectedSlot.endUtc,
          createMeetLink: true,
          attendeeEmails: [user.email || 'student@enemind.org'],
          eventType: 'mentorship',
        }).catch(console.warn);

        emailService.sendTemplatedEmail(
          'booking_confirmation',
          user.email || 'student@enemind.org',
          {
            userName: user.name,
            mentorName: offering.providerName,
            topic: offering.title,
            scheduledTime: new Date(selectedSlot.startUtc).toLocaleString(),
            meetUrl: booking.meetingUrl,
          }
        ).catch(console.warn);
      } catch (err: any) {
        setPaymentError(err?.message || 'Failed to confirm booking.');
      }
    } else {
      setStep('payment');
    }
  };

  const handleExecutePayment = async () => {
    if (!selectedSlot) return;
    setIsProcessingPayment(true);
    setPaymentError(null);

    try {
      // 1. Create booking in pending payment status
      const booking = BookingService.createBooking({
        student: user,
        providerId: offering.providerId,
        providerType: offering.providerType,
        providerName: offering.providerName,
        providerAvatar: offering.providerAvatar,
        sessionOfferingId: offering.id,
        scheduledStart: selectedSlot.startUtc,
        scheduledEnd: selectedSlot.endUtc,
        timezone: viewerTimezone,
        notes: studentNotes,
        paymentMethod: 'mpesa',
        mpesaPhone: paymentPhone,
      });

      // 2. STK Push through payment service
      const res = await paymentService.initiateMpesaPayment({
        phone: paymentPhone,
        amount: offering.price,
        purpose: offering.title,
        userEmail: user.email || 'student@enemind.org',
        accountReference: `ENE-BOOK-${booking.id.slice(-4)}`,
      });

      if (res.responseCode === '0') {
        const receipt = `QK${Math.floor(10000000 + Math.random() * 90000000)}`;
        const confirmed = BookingService.confirmBookingPayment(booking.id, receipt);
        setConfirmedBooking(confirmed);
        setStep('confirmed');
        onBookingConfirmed(confirmed);

        // Sync to Google Calendar & dispatch Gmail confirmation
        calendarService.createEvent({
          summary: `${offering.title} - ${offering.providerName}`,
          description: `ENEMIND Mentorship Session with ${offering.providerName}.\nReceipt: ${receipt}\nMeet Link: ${confirmed.meetingUrl || 'https://meet.google.com'}\nNotes: ${studentNotes || 'None'}`,
          startTime: selectedSlot.startUtc,
          endTime: selectedSlot.endUtc,
          createMeetLink: true,
          attendeeEmails: [user.email || 'student@enemind.org'],
          eventType: 'mentorship',
        }).catch(console.warn);

        emailService.sendTemplatedEmail(
          'booking_confirmation',
          user.email || 'student@enemind.org',
          {
            userName: user.name,
            mentorName: offering.providerName,
            topic: offering.title,
            scheduledTime: new Date(selectedSlot.startUtc).toLocaleString(),
            meetUrl: confirmed.meetingUrl,
          }
        ).catch(console.warn);

        emailService.sendTemplatedEmail(
          'payment_receipt',
          user.email || 'student@enemind.org',
          {
            userName: user.name,
            amount: offering.price,
            receiptNumber: receipt,
            productName: `Mentorship: ${offering.title}`,
          }
        ).catch(console.warn);
      } else {
        setPaymentError(res.customerMessage || 'Payment could not be verified.');
      }
    } catch (err: any) {
      setPaymentError(err?.message || 'Payment processing error.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleDownloadIcs = () => {
    if (!confirmedBooking) return;
    const icsContent = GoogleCalendarMeetService.generateIcsFile(confirmedBooking);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `session-${confirmedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 my-8 animate-in fade-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-6">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase">
                {offering.format.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-neutral-400 font-medium">· {offering.durationMinutes} mins</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-heading">{offering.title}</h2>
            <p className="text-xs text-neutral-500 font-medium">with {offering.providerName}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP 1: Date & Time Slot Picker */}
        {step === 'slot_picker' && (
          <div className="space-y-4">
            {/* Timezone Selector */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs">
              <div className="flex items-center gap-2 text-neutral-700 font-semibold">
                <Globe className="w-4 h-4 text-emerald-600" />
                <span>Displaying in timezone:</span>
              </div>
              <select
                value={viewerTimezone}
                onChange={(e) => setViewerTimezone(e.target.value)}
                className="p-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-900 focus:outline-hidden"
              >
                <option value="Africa/Nairobi">Africa/Nairobi (EAT, UTC+3)</option>
                <option value="Africa/Lagos">Africa/Lagos (WAT, UTC+1)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="America/New_York">America/New York (EST/EDT)</option>
                <option value="UTC">UTC (Universal Coordinated Time)</option>
              </select>
            </div>

            {/* Date Input */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                <span>Select Session Date</span>
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDateStr}
                onChange={(e) => setSelectedDateStr(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-semibold text-neutral-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {/* Available Time Slots Grid */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Select Available Time Slot</span>
              </label>

              {availableSlots.length === 0 ? (
                <div className="text-center py-6 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500">
                  No working hours scheduled by provider for this day. Please select another date.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                  {availableSlots.map((slot, idx) => (
                    <button
                      key={idx}
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedSlot(slot)}
                      className={`p-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                        !slot.isAvailable
                          ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed line-through opacity-60'
                          : selectedSlot?.startUtc === slot.startUtc
                          ? 'bg-neutral-900 text-white shadow-xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border border-neutral-200'
                      }`}
                    >
                      {slot.displayTime}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="text-xs font-bold text-neutral-700 block mb-1">
                What topics or projects would you like to cover?
              </label>
              <textarea
                rows={2}
                placeholder="Share your goals, questions, or repo links..."
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs focus:bg-white focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            {/* Footer Summary & Next */}
            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">Session Fee</span>
                <span className="text-sm font-black text-neutral-900">
                  {isFree ? 'Free / Volunteer' : `${offering.currency} ${offering.price}`}
                </span>
              </div>

              <button
                disabled={!selectedSlot}
                onClick={handleProceedToPaymentOrConfirm}
                className="py-2.5 px-6 rounded-xl bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <span>{isFree ? 'Confirm Free Booking' : 'Proceed to Checkout'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Payment Checkout (M-PESA / Card) */}
        {step === 'payment' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex justify-between font-semibold text-neutral-700">
                <span>Session:</span>
                <span className="text-neutral-900 font-bold">{offering.title}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Provider:</span>
                <span>{offering.providerName}</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Scheduled Time:</span>
                <span className="font-bold text-emerald-700">
                  {selectedSlot?.displayDate} at {selectedSlot?.displayTime}
                </span>
              </div>
              <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-sm text-neutral-900">
                <span>Total Due:</span>
                <span>
                  {offering.currency} {offering.price}
                </span>
              </div>
            </div>

            {/* M-PESA STK Push Form */}
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  M
                </div>
                <div>
                  <h4 className="font-bold text-neutral-900">M-PESA Express Checkout</h4>
                  <p className="text-[11px] text-neutral-500">Instant STK Push prompt to your phone</p>
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">M-PESA Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    value={paymentPhone}
                    onChange={(e) => setPaymentPhone(e.target.value)}
                    placeholder="0712345678 or 254..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-neutral-200 font-semibold focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setStep('slot_picker')}
                className="py-2 px-3 text-neutral-600 hover:bg-neutral-100 rounded-xl font-semibold flex items-center gap-1"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={handleExecutePayment}
                disabled={isProcessingPayment}
                className="py-2.5 px-6 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {isProcessingPayment
                    ? 'Awaiting M-PESA PIN...'
                    : `Pay ${offering.currency} ${offering.price}`}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Confirmed State */}
        {step === 'confirmed' && confirmedBooking && (
          <div className="text-center py-4 space-y-4 animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-base font-bold text-neutral-900 font-heading">Session Confirmed & Scheduled!</h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Your booking with {confirmedBooking.providerName} has been locked.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-left text-xs space-y-2">
              <div className="flex justify-between font-semibold text-neutral-800">
                <span>Date & Time:</span>
                <span className="text-emerald-800 font-bold">
                  {new Date(confirmedBooking.scheduledStart).toLocaleDateString([], {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}{' '}
                  at{' '}
                  {new Date(confirmedBooking.scheduledStart).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Meeting Method:</span>
                <span className="font-semibold text-neutral-900 flex items-center gap-1">
                  <Video className="w-3.5 h-3.5 text-blue-600" />
                  Google Meet
                </span>
              </div>
              {confirmedBooking.meetingUrl ? (
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 font-mono text-[11px] truncate">
                  {confirmedBooking.meetingUrl}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 italic">
                  Meeting link will be available once Google Calendar is connected in settings.
                </p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenSessionRoom(confirmedBooking);
                }}
                className="py-2.5 px-4 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Video className="w-3.5 h-3.5 text-emerald-400" />
                <span>Enter Session Room</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (confirmedBooking.conversationId) {
                    onOpenChat(confirmedBooking.conversationId);
                  }
                }}
                className="py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat with Provider</span>
              </button>
            </div>

            <div className="pt-2">
              <button
                onClick={handleDownloadIcs}
                className="text-[11px] text-neutral-500 hover:text-neutral-800 font-medium flex items-center justify-center gap-1 mx-auto"
              >
                <Download className="w-3 h-3" />
                <span>Download .ics Calendar File</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
