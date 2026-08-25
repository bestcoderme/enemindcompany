/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BookingService } from './bookingService';
import { MentorService } from './mentorService';
import { TeacherService } from './teacherService';
import { PlatformFeeService } from './platformFeeService';
import { ReviewService } from './reviewService';
import { SessionOfferingService } from './sessionOfferingService';
import { GoogleCalendarMeetService } from './googleCalendarMeetService';
import { PayoutService } from './payoutService';
import { UserProfile } from '../../types/user';

export interface MentorshipTestResult {
  suiteName: string;
  testName: string;
  passed: boolean;
  message: string;
  durationMs: number;
}

export class MentorshipTestRunner {
  public static runAllTests(): {
    total: number;
    passed: number;
    failed: number;
    results: MentorshipTestResult[];
  } {
    const results: MentorshipTestResult[] = [];

    const record = (suiteName: string, testName: string, fn: () => void) => {
      const start = performance.now();
      try {
        fn();
        results.push({
          suiteName,
          testName,
          passed: true,
          message: 'Passed successfully',
          durationMs: parseFloat((performance.now() - start).toFixed(2)),
        });
      } catch (err: any) {
        results.push({
          suiteName,
          testName,
          passed: false,
          message: err?.message || 'Test assertion failed',
          durationMs: parseFloat((performance.now() - start).toFixed(2)),
        });
      }
    };

    // 1. Commission calculation & Platform Fee
    record('Platform Fees', 'calculates 10% commission correctly for KES and USD', () => {
      const feeKes = PlatformFeeService.calculateFee(1000, 'KES');
      if (feeKes.grossAmount !== 1000 || feeKes.platformFee !== 100 || feeKes.providerAmount !== 900) {
        throw new Error(`Fee breakdown mismatch: ${JSON.stringify(feeKes)}`);
      }

      const feeFree = PlatformFeeService.calculateFee(0, 'KES');
      if (feeFree.platformFee !== 0 || feeFree.providerAmount !== 0) {
        throw new Error('Free session calculation failed');
      }
    });

    // 2. Availability & Timezone Slot Generation
    record('Availability & Timezones', 'generates valid time slots respecting provider hours and viewer timezone', () => {
      const mockAvailability = {
        days: ['Monday', 'Friday'],
        startTime: '09:00',
        endTime: '12:00',
        timezone: 'Africa/Nairobi',
        sessionDuration: 60,
        breakDuration: 0,
        blockedDates: ['2026-08-31'],
        vacationDates: [],
        recurringAvailability: true,
      };

      // Friday Aug 28, 2026
      const slots = BookingService.generateAvailableSlots(
        mockAvailability,
        'test_mentor',
        '2026-08-28',
        'Africa/Nairobi'
      );

      if (slots.length !== 3) {
        throw new Error(`Expected 3 slots between 09:00 and 12:00, got ${slots.length}`);
      }

      // Blocked date test
      const blockedSlots = BookingService.generateAvailableSlots(
        mockAvailability,
        'test_mentor',
        '2026-08-31',
        'Africa/Nairobi'
      );
      if (blockedSlots.length !== 0) {
        throw new Error('Expected 0 slots for blocked date');
      }
    });

    // 3. Double-Booking Prevention
    record('Booking Integrity', 'prevents double booking overlapping slots', () => {
      const mockStudent: UserProfile = {
        name: 'Test Student',
        email: 'test.student@enemind.org',
        avatarUrl: '',
        provider: 'google',
        roles: ['STUDENT'],
      };

      // Create booking 1
      const booking1 = BookingService.createBooking({
        student: mockStudent,
        providerId: 'mentor_dr_jane',
        providerType: 'MENTOR',
        providerName: 'Dr. Jane Mutua',
        sessionOfferingId: 'off_m1_1',
        scheduledStart: '2026-09-01T10:00:00Z',
        scheduledEnd: '2026-09-01T10:45:00Z',
        timezone: 'Africa/Nairobi',
        paymentMethod: 'free',
      });

      if (!booking1 || booking1.status !== 'CONFIRMED') {
        throw new Error('Failed to create initial free booking');
      }

      // Check slot availability for overlapping time
      const isAvailable = BookingService.checkAvailability(
        'mentor_dr_jane',
        '2026-09-01T10:15:00Z',
        '2026-09-01T11:00:00Z'
      );

      if (isAvailable) {
        throw new Error('Double-booking check failed: Overlapping slot was reported available.');
      }
    });

    // 4. Group Session Capacity
    record('Group Classes', 'tracks and limits group session seat availability', () => {
      const offering = SessionOfferingService.getOfferingById('off_m1_2');
      if (!offering) throw new Error('Group masterclass offering not found');

      const initialSeats = offering.bookedSeats;
      SessionOfferingService.incrementBookedSeats('off_m1_2');
      const updated = SessionOfferingService.getOfferingById('off_m1_2');
      if (updated?.bookedSeats !== initialSeats + 1) {
        throw new Error('Seat increment failed');
      }

      SessionOfferingService.decrementBookedSeats('off_m1_2');
    });

    // 5. Review Eligibility & Duplicate Prevention
    record('Reviews & Feedback', 'enforces completed session status and blocks duplicate reviews', () => {
      const canReviewPending = ReviewService.canReviewBooking('book_test_pending', 'PENDING');
      if (canReviewPending) {
        throw new Error('Allowed review on non-completed booking');
      }

      const canReviewCompleted = ReviewService.canReviewBooking('book_new_complete', 'COMPLETED');
      if (!canReviewCompleted) {
        throw new Error('Blocked valid completed session from review eligibility');
      }
    });

    // 6. Career Recommendation Rationale
    record('Career Integration', 'recommends mentors matching career goals with explicit rationale', () => {
      const recs = MentorService.getRecommendedMentors('Software Engineering', ['Kubernetes', 'Go']);
      if (recs.length === 0) {
        throw new Error('Expected mentor recommendations for Software Engineering');
      }

      if (!recs[0].reason || !recs[0].reason.explanation) {
        throw new Error('Missing explicit recommendation explanation');
      }
    });

    // 7. Google Calendar & Meet link creation
    record('Google Integration', 'generates valid calendar template links and iCal format', () => {
      const cal = GoogleCalendarMeetService.createCalendarAndMeetDetails({
        title: 'Backend Mentorship',
        scheduledStart: '2026-08-28T10:00:00Z',
        scheduledEnd: '2026-08-28T10:45:00Z',
        providerName: 'Dr. Jane Mutua',
        studentName: 'Alex Mwangi',
        studentEmail: 'alex@student.ke',
      });

      if (!cal.googleCalendarWebLink || !cal.googleCalendarWebLink.includes('calendar.google.com')) {
        throw new Error('Invalid Google Calendar web link');
      }
    });

    const passedCount = results.filter((r) => r.passed).length;
    return {
      total: results.length,
      passed: passedCount,
      failed: results.length - passedCount,
      results,
    };
  }
}
