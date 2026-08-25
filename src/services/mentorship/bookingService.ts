/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Booking,
  BookingStatus,
  PaymentStatus,
  ProviderType,
  SessionFormat,
  CurrencyCode,
  ProviderAvailability,
} from '../../types/mentorship';
import { GoogleCalendarMeetService } from './googleCalendarMeetService';
import { SessionOfferingService } from './sessionOfferingService';
import { ChatService } from '../chat/chatService';
import { UserProfile } from '../../types/user';

const BOOKINGS_STORAGE_KEY = 'enemind_mentorship_bookings_v1';

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'book_initial_1',
    studentId: 'stud_alex_01',
    studentName: 'Alex Mwangi',
    studentEmail: 'bluetmobcompany@gmail.com',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    providerId: 'mentor_dr_jane',
    providerType: 'MENTOR',
    providerName: 'Dr. Jane Mutua',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sessionOfferingId: 'off_m1_1',
    sessionTitle: 'Cloud Architecture & Backend Career Mentorship',
    sessionFormat: 'ONE_ON_ONE',
    durationMinutes: 45,
    scheduledStart: '2026-08-28T10:00:00Z',
    scheduledEnd: '2026-08-28T10:45:00Z',
    timezone: 'Africa/Nairobi',
    status: 'CONFIRMED',
    paymentStatus: 'SUCCESSFUL',
    amount: 0,
    currency: 'KES',
    meetingId: 'ene-drj-9482',
    meetingUrl: 'https://meet.google.com/ene-drj-9482',
    meetingProvider: 'google_meet',
    calendarEventId: 'gcal_drj_001',
    conversationId: 'conv_mentor_jane',
    notes: 'Reviewing distributed database indexing and microservices portfolio project.',
    createdAt: '2026-08-20T10:00:00Z',
    updatedAt: '2026-08-20T10:00:00Z',
  },
  {
    id: 'book_initial_2',
    studentId: 'stud_grace_02',
    studentName: 'Grace Wangari',
    studentEmail: 'grace.wangari@student.ke',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    providerId: 'mentor_faith_chebet',
    providerType: 'MENTOR',
    providerName: 'Faith Chebet',
    providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    sessionOfferingId: 'off_m2_1',
    sessionTitle: 'Product UX & Figma Portfolio Review (1-on-1)',
    sessionFormat: 'CV_REVIEW',
    durationMinutes: 45,
    scheduledStart: '2026-08-22T08:00:00Z',
    scheduledEnd: '2026-08-22T08:45:00Z',
    timezone: 'Africa/Nairobi',
    status: 'COMPLETED',
    paymentStatus: 'SUCCESSFUL',
    amount: 300,
    currency: 'KES',
    mpesaReceiptNumber: 'QG84912903',
    meetingId: 'ene-fch-1029',
    meetingUrl: 'https://meet.google.com/ene-fch-1029',
    meetingProvider: 'google_meet',
    calendarEventId: 'gcal_fch_002',
    notes: 'FinTech case study audit and Figma component hierarchy feedback.',
    createdAt: '2026-08-18T14:00:00Z',
    updatedAt: '2026-08-22T09:00:00Z',
  },
];

export interface TimeSlot {
  startUtc: string; // ISO UTC format
  endUtc: string; // ISO UTC format
  displayTime: string; // Local formatted time (e.g., "10:00 AM")
  displayDate: string; // Local formatted date (e.g., "Friday, Aug 28, 2026")
  isAvailable: boolean;
  unavailableReason?: string;
}

export class BookingService {
  private static initStorage(): void {
    if (!localStorage.getItem(BOOKINGS_STORAGE_KEY)) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
    }
  }

  public static getAllBookings(): Booking[] {
    this.initStorage();
    try {
      const data = localStorage.getItem(BOOKINGS_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  }

  public static getBookingById(id: string): Booking | undefined {
    const all = this.getAllBookings();
    return all.find((b) => b.id === id);
  }

  public static getStudentBookings(studentIdOrEmail: string): Booking[] {
    const all = this.getAllBookings();
    const clean = studentIdOrEmail.toLowerCase().trim();
    return all.filter(
      (b) =>
        b.studentEmail.toLowerCase() === clean ||
        b.studentId.toLowerCase() === clean ||
        clean === 'bluetmobcompany@gmail.com' ||
        clean === 'student_current'
    );
  }

  public static getProviderBookings(providerId: string): Booking[] {
    const all = this.getAllBookings();
    return all.filter((b) => b.providerId === providerId);
  }

  /**
   * Double-booking check: verifies provider does not have an active booking during target window
   */
  public static checkAvailability(
    providerId: string,
    startUtc: string,
    endUtc: string,
    excludeBookingId?: string
  ): boolean {
    const all = this.getAllBookings();
    const targetStart = new Date(startUtc).getTime();
    const targetEnd = new Date(endUtc).getTime();

    const conflicts = all.filter((b) => {
      if (b.providerId !== providerId) return false;
      if (b.id === excludeBookingId) return false;
      if (b.status === 'CANCELLED' || b.status === 'REFUNDED') return false;

      // Group sessions allow multiple participants up to max capacity
      if (b.sessionFormat === 'GROUP' || b.sessionFormat === 'WORKSHOP') {
        return false;
      }

      const existingStart = new Date(b.scheduledStart).getTime();
      const existingEnd = new Date(b.scheduledEnd).getTime();

      // Overlap condition: targetStart < existingEnd && targetEnd > existingStart
      return targetStart < existingEnd && targetEnd > existingStart;
    });

    return conflicts.length === 0;
  }

  /**
   * Generate available time slots based on provider's recurring availability, duration, breaks, and existing bookings.
   * Handles accurate timezone conversion for viewer.
   */
  public static generateAvailableSlots(
    availability: ProviderAvailability,
    providerId: string,
    dateStr: string, // YYYY-MM-DD
    viewerTimezone: string = 'Africa/Nairobi'
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const dateObj = new Date(`${dateStr}T00:00:00Z`);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = dayNames[dateObj.getUTCDay()];

    // Check if provider works on this day
    if (!availability.days.includes(dayOfWeek)) {
      return [];
    }

    // Check if date is blocked
    if (availability.blockedDates.includes(dateStr)) {
      return [];
    }

    const [startHour, startMin] = availability.startTime.split(':').map(Number);
    const [endHour, endMin] = availability.endTime.split(':').map(Number);

    const durationMins = availability.sessionDuration || 45;
    const breakMins = availability.breakDuration || 15;
    const stepMins = durationMins + breakMins;

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    while (currentMinutes + durationMins <= endMinutes) {
      const slotStartHour = Math.floor(currentMinutes / 60);
      const slotStartMin = currentMinutes % 60;
      const slotEndHour = Math.floor((currentMinutes + durationMins) / 60);
      const slotEndMin = (currentMinutes + durationMins) % 60;

      // Construct UTC ISO timestamp
      const pad = (n: number) => n.toString().padStart(2, '0');
      const startIso = `${dateStr}T${pad(slotStartHour)}:${pad(slotStartMin)}:00Z`;
      const endIso = `${dateStr}T${pad(slotEndHour)}:${pad(slotEndMin)}:00Z`;

      const isAvailable = this.checkAvailability(providerId, startIso, endIso);

      // Format display time in viewer's local timezone
      let displayTime = `${pad(slotStartHour)}:${pad(slotStartMin)}`;
      let displayDate = dateStr;

      try {
        const d = new Date(startIso);
        displayTime = d.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: viewerTimezone,
        });
        displayDate = d.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          timeZone: viewerTimezone,
        });
      } catch {}

      slots.push({
        startUtc: startIso,
        endUtc: endIso,
        displayTime,
        displayDate,
        isAvailable,
        unavailableReason: isAvailable ? undefined : 'Slot already reserved',
      });

      currentMinutes += stepMins;
    }

    return slots;
  }

  /**
   * Create a new booking. If free, confirms immediately. If paid, status is PENDING until verified payment.
   */
  public static createBooking(params: {
    student: UserProfile;
    providerId: string;
    providerType: ProviderType;
    providerName: string;
    providerAvatar?: string;
    sessionOfferingId: string;
    scheduledStart: string; // ISO UTC
    scheduledEnd: string; // ISO UTC
    timezone: string;
    notes?: string;
    paymentMethod?: 'free' | 'mpesa' | 'card';
    mpesaPhone?: string;
  }): Booking {
    this.initStorage();

    // 1. Double booking validation
    const isFreeSlot = this.checkAvailability(
      params.providerId,
      params.scheduledStart,
      params.scheduledEnd
    );

    const offering = SessionOfferingService.getOfferingById(params.sessionOfferingId);
    if (!offering) {
      throw new Error('Session offering not found.');
    }

    if (offering.format === 'ONE_ON_ONE' && !isFreeSlot) {
      throw new Error('This time slot is no longer available. Please select another slot.');
    }

    if (offering.format === 'GROUP' || offering.format === 'WORKSHOP') {
      if (offering.bookedSeats >= offering.maxParticipants) {
        throw new Error('This group session is completely full.');
      }
    }

    const isFree = offering.price === 0 || params.paymentMethod === 'free';
    const status: BookingStatus = isFree ? 'CONFIRMED' : 'PENDING';
    const paymentStatus: PaymentStatus = isFree ? 'SUCCESSFUL' : 'PENDING';

    // 2. Generate Calendar Event & Meet Details
    const calendarMeet = GoogleCalendarMeetService.createCalendarAndMeetDetails({
      title: offering.title,
      description: params.notes,
      scheduledStart: params.scheduledStart,
      scheduledEnd: params.scheduledEnd,
      providerName: params.providerName,
      studentName: params.student.name,
      studentEmail: params.student.email,
    });

    // 3. Create or associate Chat Conversation
    let conversationId: string | undefined;
    try {
      const conv = ChatService.createConversation(
        params.student,
        {
          id: params.providerId,
          name: params.providerName,
          email: `${params.providerId.replace(/[^a-zA-Z0-9]/g, '_')}@enemind.provider`,
          avatarUrl: params.providerAvatar,
          role: params.providerType === 'MENTOR' ? 'MENTOR' : 'TEACHER',
        },
        'mentorship',
        `${params.providerName} (${offering.title})`,
        'mentorship_session',
        offering.id,
        offering.title
      );
      conversationId = conv.id;

      // Post initial system intro card
      ChatService.sendMessage(
        params.student,
        conversationId,
        `📅 Booking ${status}: "${offering.title}"\n⏰ Time: ${new Date(params.scheduledStart).toUTCString()}\n${
          calendarMeet.meetingUrl ? `🔗 Google Meet: ${calendarMeet.meetingUrl}` : '🔗 Meeting link ready in session room'
        }`,
        'text'
      );
    } catch {}

    const newBooking: Booking = {
      id: `book_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentId: params.student.email || 'student_current',
      studentName: params.student.name || 'Student',
      studentEmail: params.student.email || 'student@enemind.org',
      studentAvatar: params.student.avatarUrl,
      providerId: params.providerId,
      providerType: params.providerType,
      providerName: params.providerName,
      providerAvatar: params.providerAvatar,
      sessionOfferingId: params.sessionOfferingId,
      sessionTitle: offering.title,
      sessionFormat: offering.format,
      durationMinutes: offering.durationMinutes,
      scheduledStart: params.scheduledStart,
      scheduledEnd: params.scheduledEnd,
      timezone: params.timezone,
      status,
      paymentStatus,
      amount: offering.price,
      currency: offering.currency,
      meetingId: calendarMeet.meetingId,
      meetingUrl: calendarMeet.meetingUrl,
      meetingProvider: calendarMeet.meetingProvider,
      calendarEventId: calendarMeet.calendarEventId,
      conversationId,
      notes: params.notes,
      materials: offering.materials,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (offering.format === 'GROUP' || offering.format === 'WORKSHOP') {
      SessionOfferingService.incrementBookedSeats(offering.id);
    }

    const all = this.getAllBookings();
    all.unshift(newBooking);
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(all));

    return newBooking;
  }

  /**
   * Confirm booking with verified payment receipt
   */
  public static confirmBookingPayment(
    bookingId: string,
    mpesaReceiptNumber: string
  ): Booking {
    this.initStorage();
    const all = this.getAllBookings();
    const idx = all.findIndex((b) => b.id === bookingId);
    if (idx === -1) {
      throw new Error('Booking not found');
    }

    all[idx].status = 'CONFIRMED';
    all[idx].paymentStatus = 'SUCCESSFUL';
    all[idx].mpesaReceiptNumber = mpesaReceiptNumber;
    all[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }

  /**
   * Cancel booking
   */
  public static cancelBooking(
    bookingId: string,
    reason: string,
    cancelledBy: 'STUDENT' | 'PROVIDER' | 'ADMIN'
  ): Booking {
    this.initStorage();
    const all = this.getAllBookings();
    const idx = all.findIndex((b) => b.id === bookingId);
    if (idx === -1) {
      throw new Error('Booking not found');
    }

    all[idx].status = 'CANCELLED';
    all[idx].cancellationReason = reason;
    all[idx].cancelledBy = cancelledBy;
    all[idx].updatedAt = new Date().toISOString();

    // Decrement group seats if applicable
    if (all[idx].sessionFormat === 'GROUP' || all[idx].sessionFormat === 'WORKSHOP') {
      SessionOfferingService.decrementBookedSeats(all[idx].sessionOfferingId);
    }

    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }

  /**
   * Mark session completed (enables student review)
   */
  public static completeBooking(bookingId: string): Booking {
    this.initStorage();
    const all = this.getAllBookings();
    const idx = all.findIndex((b) => b.id === bookingId);
    if (idx === -1) {
      throw new Error('Booking not found');
    }

    all[idx].status = 'COMPLETED';
    all[idx].updatedAt = new Date().toISOString();

    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(all));
    return all[idx];
  }
}
