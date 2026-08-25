/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Booking } from '../../types/mentorship';

const GOOGLE_AUTH_STORAGE_KEY = 'enemind_google_calendar_auth_v1';

export interface GoogleCalendarAuthStatus {
  isConnected: boolean;
  email?: string;
  scopes?: string[];
  lastConnectedAt?: string;
}

export class GoogleCalendarMeetService {
  /**
   * Get current Google Calendar / Meet integration status
   */
  public static getAuthStatus(): GoogleCalendarAuthStatus {
    try {
      const stored = localStorage.getItem(GOOGLE_AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return {
      isConnected: false,
    };
  }

  /**
   * Toggle or connect Google Calendar (Mock/Real OAuth wrapper)
   */
  public static setAuthStatus(status: GoogleCalendarAuthStatus): void {
    try {
      localStorage.setItem(GOOGLE_AUTH_STORAGE_KEY, JSON.stringify(status));
    } catch {}
  }

  /**
   * Generate calendar event details and Google Meet link if connected
   */
  public static createCalendarAndMeetDetails(booking: {
    title: string;
    description?: string;
    scheduledStart: string; // ISO UTC
    scheduledEnd: string; // ISO UTC
    providerName: string;
    studentName: string;
    studentEmail: string;
  }): {
    meetingId?: string;
    meetingUrl?: string;
    meetingProvider: string;
    calendarEventId: string;
    googleCalendarWebLink: string;
  } {
    const auth = this.getAuthStatus();
    const eventId = `gcal_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Format timestamps for Google Calendar Web URL (YYYYMMDDTHHMMSSZ)
    const formatGCalTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
    };

    const startFormatted = formatGCalTime(booking.scheduledStart);
    const endFormatted = formatGCalTime(booking.scheduledEnd);
    const titleEncoded = encodeURIComponent(`ENEMIND: ${booking.title}`);
    const detailsEncoded = encodeURIComponent(
      `Session between ${booking.providerName} and ${booking.studentName}.\n\nBooking ID: ${eventId}\nPlatform: ENEMIND Ecosystem\n${booking.description || ''}`
    );

    const googleCalendarWebLink = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titleEncoded}&dates=${startFormatted}/${endFormatted}&details=${detailsEncoded}`;

    // If Google account is connected, assign Google Meet room
    if (auth.isConnected) {
      const meetCode = `ene-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}`;
      const meetUrl = `https://meet.google.com/${meetCode}`;
      return {
        meetingId: meetCode,
        meetingUrl: meetUrl,
        meetingProvider: 'google_meet',
        calendarEventId: eventId,
        googleCalendarWebLink,
      };
    }

    return {
      meetingProvider: 'google_meet',
      calendarEventId: eventId,
      googleCalendarWebLink,
      meetingUrl: undefined, // "Meeting link will be available once Google Calendar is connected."
    };
  }

  /**
   * Export booking as .ics (iCalendar) file
   */
  public static generateIcsFile(booking: Booking): string {
    const startDate = new Date(booking.scheduledStart).toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(booking.scheduledEnd).toISOString().replace(/-|:|\.\d\d\d/g, '');

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ENEMIND Ecosystem//Mentorship Booking//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VEVENT
UID:${booking.id}@enemind.ecosystem
DTSTAMP:${new Date().toISOString().replace(/-|:|\.\d\d\d/g, '')}
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:ENEMIND Session: ${booking.sessionTitle}
DESCRIPTION:Session with ${booking.providerName}. Status: ${booking.status}. Meeting: ${booking.meetingUrl || 'Pending Google Connect'}
ORGANIZER;CN=ENEMIND:mailto:support@enemind.org
ATTENDEE;ROLE=REQ-PARTICIPANT;PARTSTAT=ACCEPTED;CN=${booking.studentName}:mailto:${booking.studentEmail}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;
  }
}
