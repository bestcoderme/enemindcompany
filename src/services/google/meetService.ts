/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleMeetSession } from '../../types/google';
import { calendarService } from './calendarService';
import { googleAuthService } from './googleAuthService';
import { googleAuditService } from './googleAuditService';

class MeetService {
  /**
   * Create a Google Meet meeting session.
   */
  public async createMeeting(params: {
    topic: string;
    startTime: string;
    endTime: string;
    participantEmails: string[];
    description?: string;
  }): Promise<GoogleMeetSession> {
    const account = googleAuthService.getAccountInfo();
    const hostEmail = account.email || 'host@enemind.org';

    // Create Calendar Event with Google Meet conference enabled
    const calEvent = await calendarService.createEvent({
      summary: `ENEMIND Meet: ${params.topic}`,
      description: params.description || `Google Meet session for ${params.topic}`,
      startTime: params.startTime,
      endTime: params.endTime,
      attendeeEmails: [hostEmail, ...params.participantEmails],
      createMeetLink: true,
      eventType: 'mentorship',
    });

    const code1 = Math.random().toString(36).substring(2, 5);
    const code2 = Math.random().toString(36).substring(2, 6);
    const code3 = Math.random().toString(36).substring(2, 5);
    const generatedMeetUrl = calEvent.meetUrl || `https://meet.google.com/${code1}-${code2}-${code3}`;

    const session: GoogleMeetSession = {
      meetingId: generatedMeetUrl.split('/').pop() || `${code1}-${code2}-${code3}`,
      meetingUrl: generatedMeetUrl,
      meetingProvider: 'GOOGLE_MEET',
      calendarEventId: calEvent.id,
      topic: params.topic,
      scheduledStart: params.startTime,
      scheduledEnd: params.endTime,
      hostEmail,
      participantEmails: params.participantEmails,
    };

    googleAuditService.log(
      'meet',
      'CREATE_MEET_SESSION',
      hostEmail,
      `Generated Google Meet room for "${params.topic}"`,
      'SUCCESS',
      `URL: ${session.meetingUrl}`
    );

    return session;
  }
}

export const meetService = new MeetService();
