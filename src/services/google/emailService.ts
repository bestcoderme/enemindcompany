/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EmailMessagePayload, EmailTemplateType, UserCommunicationPreferences } from '../../types/google';
import { gmailService } from './gmailService';
import { googleAuditService } from './googleAuditService';

const PREFERENCES_STORAGE_KEY = 'enemind_user_comm_preferences_v1';

const DEFAULT_PREFERENCES: UserCommunicationPreferences = {
  emailNotifications: true,
  marketingEmail: false,
  bookingNotifications: true,
  opportunityNotifications: true,
  careerNotifications: true,
  learningNotifications: true,
  marketplaceNotifications: true,
  chatNotifications: true,
  pushNotifications: true,
};

class EmailService {
  public getUserPreferences(userEmail?: string): UserCommunicationPreferences {
    try {
      const stored = localStorage.getItem(`${PREFERENCES_STORAGE_KEY}_${userEmail || 'default'}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load email preferences:', e);
    }
    return { ...DEFAULT_PREFERENCES };
  }

  public saveUserPreferences(prefs: UserCommunicationPreferences, userEmail?: string): void {
    try {
      localStorage.setItem(`${PREFERENCES_STORAGE_KEY}_${userEmail || 'default'}`, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Failed to save email preferences:', e);
    }
  }

  /**
   * High-level send method applying preference policies and template formatting.
   */
  public async sendTemplatedEmail(
    templateType: EmailTemplateType,
    recipientEmail: string,
    params: Record<string, any>,
    isTransactional: boolean = true
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    const prefs = this.getUserPreferences(recipientEmail);

    // If marketing and user opted out, reject
    if (!isTransactional && !prefs.marketingEmail) {
      return { success: false, error: 'User has opted out of marketing communications.' };
    }

    // If transactional notifications disabled
    if (isTransactional && !prefs.emailNotifications) {
      return { success: false, error: 'Transactional notifications disabled in settings.' };
    }

    const { subject, bodyHtml, bodyText } = this.renderTemplate(templateType, params);

    const payload: EmailMessagePayload = {
      to: recipientEmail,
      subject,
      bodyHtml,
      bodyText,
      templateType,
      isTransactional,
      metadata: params,
    };

    const res = await gmailService.sendEmail(payload);
    return res;
  }

  /**
   * Render HTML & Text version of email templates.
   */
  public renderTemplate(
    type: EmailTemplateType,
    p: Record<string, any>
  ): { subject: string; bodyHtml: string; bodyText: string } {
    const brandHeader = `
      <div style="font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: #0f172a; padding: 24px; text-align: center;">
          <h1 style="color: #10b981; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">ENEMIND</h1>
          <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px;">Global Student & Career Ecosystem</p>
        </div>
        <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
    `;

    const brandFooter = `
        </div>
        <div style="background: #f8fafc; padding: 20px 24px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #64748b;">
          <p style="margin: 0 0 4px 0;">This email was delivered securely via authenticated Google Workspace services.</p>
          <p style="margin: 0;">© 2026 ENEMIND Ecosystem · All rights reserved.</p>
        </div>
      </div>
    `;

    switch (type) {
      case 'welcome':
        return {
          subject: `Welcome to ENEMIND, ${p.userName || 'Student'}! 🎓`,
          bodyHtml: `
            ${brandHeader}
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Your Campus Journey Starts Here</h2>
            <p>Hi ${p.userName || 'Student'}, welcome to ENEMIND — your unified academic and career platform.</p>
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 16px; margin: 20px 0;">
              <p style="margin: 0; font-weight: 700; color: #166534; font-size: 13px;">What you can do right now:</p>
              <ul style="margin: 8px 0 0 0; padding-left: 20px; font-size: 12px; color: #15803d;">
                <li>Calculate & project your Degree GPA with credit weightings</li>
                <li>Connect Google Drive to secure your transcripts & certificates</li>
                <li>Book 1-on-1 mentorship with industry experts on Google Meet</li>
                <li>Explore TikTok-style hostel discovery and campus services</li>
              </ul>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="https://enemind.org" style="background: #0f172a; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 700; font-size: 13px; display: inline-block;">Open My Dashboard</a>
            </div>
            ${brandFooter}
          `,
          bodyText: `Welcome to ENEMIND! Your account is ready. Access GPA calculators, Google Drive sync, and 1-on-1 mentorship at https://enemind.org`,
        };

      case 'booking_confirmation':
        return {
          subject: `Confirmed: Mentorship Session with ${p.mentorName || 'Mentor'} 🗓️`,
          bodyHtml: `
            ${brandHeader}
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Mentorship Session Confirmed</h2>
            <p>Your advisory appointment has been scheduled and added to your <strong>Google Calendar</strong>.</p>
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Mentor:</strong> ${p.mentorName}</p>
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Topic:</strong> ${p.topic || 'Career & Academic Advisory'}</p>
              <p style="margin: 0 0 8px 0; font-size: 13px;"><strong>Time:</strong> ${p.scheduledTime || 'Tomorrow at 2:00 PM'}</p>
              <p style="margin: 0; font-size: 13px;"><strong>Google Meet:</strong> <a href="${p.meetUrl || 'https://meet.google.com'}" style="color: #0284c7; font-weight: 700;">${p.meetUrl || 'Join Meeting'}</a></p>
            </div>
            <div style="text-align: center; margin-top: 24px;">
              <a href="${p.meetUrl || 'https://meet.google.com'}" style="background: #10b981; color: #0f172a; text-decoration: none; padding: 12px 28px; border-radius: 10px; font-weight: 800; font-size: 13px; display: inline-block;">Join Google Meet</a>
            </div>
            ${brandFooter}
          `,
          bodyText: `Mentorship session confirmed with ${p.mentorName} on ${p.scheduledTime}. Join via Google Meet: ${p.meetUrl}`,
        };

      case 'payment_receipt':
        return {
          subject: `Payment Receipt: KSh ${p.amount || '200'} (${p.receiptNumber || 'M-PESA'}) 🧾`,
          bodyHtml: `
            ${brandHeader}
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Payment Confirmation</h2>
            <p>Thank you! Your payment has been received and your access is fully activated.</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 12px;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Receipt Number:</td><td style="padding: 8px 0; text-align: right; font-weight: 700; font-family: monospace;">${p.receiptNumber || 'QA49XJ892L'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Product / Plan:</td><td style="padding: 8px 0; text-align: right; font-weight: 700;">${p.productName || 'ENEMIND 1-Year Full Access'}</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0; color: #64748b;">Amount Paid:</td><td style="padding: 8px 0; text-align: right; font-weight: 800; color: #166534;">KSh ${p.amount || '200'}</td></tr>
              <tr><td style="padding: 8px 0; color: #64748b;">Date & Time:</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${new Date().toLocaleString()}</td></tr>
            </table>
            ${brandFooter}
          `,
          bodyText: `Payment Receipt for KSh ${p.amount}. Receipt: ${p.receiptNumber}. Thank you for using ENEMIND!`,
        };

      case 'opportunity_alert':
        return {
          subject: `Opportunity Alert: ${p.title || 'New Internship / Scholarship'} 🚀`,
          bodyHtml: `
            ${brandHeader}
            <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">New Opportunity Matching Your Profile</h2>
            <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px; margin: 20px 0;">
              <h3 style="margin: 0 0 6px 0; font-size: 15px; color: #1e40af;">${p.title}</h3>
              <p style="margin: 0 0 6px 0; font-size: 12px; color: #3b82f6; font-weight: 700;">${p.organization || 'Global Opportunity'}</p>
              <p style="margin: 0; font-size: 12px; color: #1e3a8a;">${p.description || 'Application window is now open. Attach your verified CV directly from your Google Drive locker.'}</p>
            </div>
            ${brandFooter}
          `,
          bodyText: `New opportunity: ${p.title} at ${p.organization}. Apply now on ENEMIND.`,
        };

      default:
        return {
          subject: p.subject || 'Notification from ENEMIND',
          bodyHtml: `
            ${brandHeader}
            <p>${p.message || 'You have received a new update from ENEMIND.'}</p>
            ${brandFooter}
          `,
          bodyText: p.message || 'You have received an update from ENEMIND.',
        };
    }
  }
}

export const emailService = new EmailService();
