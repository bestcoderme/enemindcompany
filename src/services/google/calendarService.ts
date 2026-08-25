/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleCalendarEvent, GoogleMeetSession } from '../../types/google';
import { googleAuthService } from './googleAuthService';
import { googleAuditService } from './googleAuditService';

const CALENDAR_STORAGE_KEY = 'enemind_google_calendar_events_v1';

class CalendarService {
  private events: GoogleCalendarEvent[] = [];

  constructor() {
    this.loadEvents();
  }

  private loadEvents() {
    try {
      const stored = localStorage.getItem(CALENDAR_STORAGE_KEY);
      if (stored) {
        this.events = JSON.parse(stored);
      } else {
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 3600 * 1000);
        const dayAfter = new Date(now.getTime() + 48 * 3600 * 1000);

        this.events = [
          {
            id: 'cal_event_01',
            summary: '1-on-1 Mentorship: Dr. Wanjiku Mwangi (AI & Career Strategy)',
            description: 'Structured advisory session covering machine learning career trajectory, GitHub portfolio review, and CV optimization.',
            start: { dateTime: new Date(tomorrow.setHours(14, 0, 0, 0)).toISOString() },
            end: { dateTime: new Date(tomorrow.setHours(15, 0, 0, 0)).toISOString() },
            htmlLink: 'https://calendar.google.com/calendar/event?eid=demo_mentor_01',
            meetUrl: 'https://meet.google.com/ene-ment-wjm',
            eventType: 'mentorship',
            attendees: [
              { email: 'w.mwangi@uonbi.ac.ke', displayName: 'Dr. Wanjiku Mwangi', responseStatus: 'accepted' },
              { email: 'student@enemind.org', displayName: 'Student', responseStatus: 'accepted' },
            ],
          },
          {
            id: 'cal_event_02',
            summary: 'CSC 311: Distributed Systems Mid-Semester Exam',
            description: 'Mid-term continuous assessment covering distributed shared memory, consensus, and fault tolerance.',
            start: { dateTime: new Date(dayAfter.setHours(9, 0, 0, 0)).toISOString() },
            end: { dateTime: new Date(dayAfter.setHours(11, 0, 0, 0)).toISOString() },
            htmlLink: 'https://calendar.google.com/calendar/event?eid=demo_exam_02',
            location: 'Science Complex Lecture Hall 4',
            eventType: 'exam',
          },
          {
            id: 'cal_event_03',
            summary: 'Safaricom Graduate Scheme Application Deadline',
            description: 'Final submission deadline for Software Engineering Graduate Trainee applications.',
            start: { dateTime: new Date(now.getTime() + 5 * 24 * 3600 * 1000).toISOString() },
            end: { dateTime: new Date(now.getTime() + 5 * 24 * 3600 * 1000 + 3600 * 1000).toISOString() },
            htmlLink: 'https://calendar.google.com/calendar/event?eid=demo_deadline_03',
            eventType: 'career',
          },
        ];
        this.saveEvents();
      }
    } catch (e) {
      console.warn('Failed to load Google Calendar events:', e);
    }
  }

  private saveEvents() {
    try {
      localStorage.setItem(CALENDAR_STORAGE_KEY, JSON.stringify(this.events));
    } catch (e) {
      console.warn('Failed to save Google Calendar events:', e);
    }
  }

  /**
   * Get upcoming events from Google Calendar.
   */
  public async getUpcomingEvents(maxResults: number = 10): Promise<GoogleCalendarEvent[]> {
    const token = googleAuthService.getAccessToken();

    if (token && !token.startsWith('enemind_authorized_token_') && !token.startsWith('demo_')) {
      try {
        const timeMin = encodeURIComponent(new Date().toISOString());
        const res = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${timeMin}&singleEvents=true&orderBy=startTime&maxResults=${maxResults}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            const remoteEvents: GoogleCalendarEvent[] = data.items.map((item: any) => ({
              id: item.id,
              summary: item.summary || 'Untitled Event',
              description: item.description,
              start: item.start,
              end: item.end,
              location: item.location,
              htmlLink: item.htmlLink,
              meetUrl: item.hangoutLink || item.conferenceData?.entryPoints?.[0]?.uri,
              attendees: item.attendees,
              eventType: 'general',
            }));

            return remoteEvents;
          }
        }
      } catch (err) {
        console.warn('Calendar API call failed, using local events:', err);
      }
    }

    return this.events.slice(0, maxResults);
  }

  /**
   * Create a new Google Calendar event with optional Google Meet link.
   */
  public async createEvent(
    eventData: {
      summary: string;
      description?: string;
      location?: string;
      startTime: string;
      endTime: string;
      attendeeEmails?: string[];
      createMeetLink?: boolean;
      eventType?: 'mentorship' | 'class' | 'exam' | 'deadline' | 'career' | 'general';
    }
  ): Promise<GoogleCalendarEvent> {
    const token = googleAuthService.getAccessToken();
    const account = googleAuthService.getAccountInfo();
    const meetId = `ene-meet-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`;
    const meetUrl = eventData.createMeetLink ? `https://meet.google.com/${meetId}` : undefined;

    const newEvent: GoogleCalendarEvent = {
      id: `cal_event_${Date.now()}`,
      summary: eventData.summary,
      description: eventData.description,
      location: eventData.location,
      start: { dateTime: new Date(eventData.startTime).toISOString() },
      end: { dateTime: new Date(eventData.endTime).toISOString() },
      htmlLink: `https://calendar.google.com/calendar/event?eid=${Date.now()}`,
      meetUrl,
      hangoutLink: meetUrl,
      eventType: eventData.eventType || 'general',
      attendees: eventData.attendeeEmails?.map((email) => ({
        email,
        responseStatus: 'needsAction',
      })),
    };

    // If real token available, attempt Calendar API insertion
    if (token && !token.startsWith('enemind_authorized_token_') && !token.startsWith('demo_')) {
      try {
        const body: any = {
          summary: eventData.summary,
          description: eventData.description,
          location: eventData.location,
          start: { dateTime: new Date(eventData.startTime).toISOString() },
          end: { dateTime: new Date(eventData.endTime).toISOString() },
          attendees: eventData.attendeeEmails?.map((e) => ({ email: e })),
        };

        if (eventData.createMeetLink) {
          body.conferenceData = {
            createRequest: {
              requestId: `req_${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          };
        }

        const res = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
          }
        );

        if (res.ok) {
          const created = await res.json();
          newEvent.id = created.id;
          newEvent.htmlLink = created.htmlLink;
          newEvent.meetUrl = created.hangoutLink || created.conferenceData?.entryPoints?.[0]?.uri || meetUrl;
        }
      } catch (err) {
        console.warn('Google Calendar event creation API error:', err);
      }
    }

    this.events.unshift(newEvent);
    this.saveEvents();

    googleAuditService.log(
      'calendar',
      'CREATE_CALENDAR_EVENT',
      account.email || 'user@enemind.org',
      `Created calendar event: "${newEvent.summary}"`,
      'SUCCESS',
      `Meet Link: ${newEvent.meetUrl || 'None'}`
    );

    return newEvent;
  }

  /**
   * Delete event
   */
  public async deleteEvent(eventId: string): Promise<boolean> {
    this.events = this.events.filter((e) => e.id !== eventId);
    this.saveEvents();

    googleAuditService.log(
      'calendar',
      'DELETE_CALENDAR_EVENT',
      googleAuthService.getAccountInfo().email || 'user@enemind.org',
      `Deleted event ${eventId}`,
      'SUCCESS'
    );

    return true;
  }
}

export const calendarService = new CalendarService();
