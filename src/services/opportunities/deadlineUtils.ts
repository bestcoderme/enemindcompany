import { Opportunity } from '../../types/opportunities';

export interface DeadlineInfo {
  isExpired: boolean;
  isToday: boolean;
  isTomorrow: boolean;
  isClosingSoon: boolean; // within 7 days
  daysRemaining: number;
  displayText: string;
  badgeVariant: 'red' | 'amber' | 'emerald' | 'neutral';
  formattedDate: string;
}

export const DeadlineUtils = {
  /**
   * Parse deadline string and return structured deadline details.
   * Handles ISO strings, YYYY-MM-DD, rolling deadlines, and empty inputs.
   */
  getDeadlineInfo(deadlineStr?: string | null): DeadlineInfo {
    if (!deadlineStr || deadlineStr.toLowerCase().includes('rolling') || deadlineStr.toLowerCase().includes('open')) {
      return {
        isExpired: false,
        isToday: false,
        isTomorrow: false,
        isClosingSoon: false,
        daysRemaining: 999,
        displayText: 'Rolling / Ongoing',
        badgeVariant: 'emerald',
        formattedDate: deadlineStr || 'Ongoing',
      };
    }

    const targetDate = new Date(deadlineStr);
    if (isNaN(targetDate.getTime())) {
      return {
        isExpired: false,
        isToday: false,
        isTomorrow: false,
        isClosingSoon: false,
        daysRemaining: 999,
        displayText: deadlineStr,
        badgeVariant: 'neutral',
        formattedDate: deadlineStr,
      };
    }

    const now = new Date();
    // Normalize both to start of day for integer day calculations
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const targetStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), targetDate.getDate()).getTime();

    const diffMs = targetStart - todayStart;
    const daysRemaining = Math.round(diffMs / (1000 * 60 * 60 * 24));

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    const formattedDate = targetDate.toLocaleDateString('en-US', options);

    if (daysRemaining < 0) {
      return {
        isExpired: true,
        isToday: false,
        isTomorrow: false,
        isClosingSoon: false,
        daysRemaining,
        displayText: 'Deadline passed',
        badgeVariant: 'neutral',
        formattedDate,
      };
    }

    if (daysRemaining === 0) {
      return {
        isExpired: false,
        isToday: true,
        isTomorrow: false,
        isClosingSoon: true,
        daysRemaining: 0,
        displayText: 'Closes today',
        badgeVariant: 'red',
        formattedDate,
      };
    }

    if (daysRemaining === 1) {
      return {
        isExpired: false,
        isToday: false,
        isTomorrow: true,
        isClosingSoon: true,
        daysRemaining: 1,
        displayText: 'Closes tomorrow',
        badgeVariant: 'red',
        formattedDate,
      };
    }

    if (daysRemaining <= 3) {
      return {
        isExpired: false,
        isToday: false,
        isTomorrow: false,
        isClosingSoon: true,
        daysRemaining,
        displayText: `${daysRemaining} days remaining`,
        badgeVariant: 'red',
        formattedDate,
      };
    }

    if (daysRemaining <= 7) {
      return {
        isExpired: false,
        isToday: false,
        isTomorrow: false,
        isClosingSoon: true,
        daysRemaining,
        displayText: `${daysRemaining} days remaining`,
        badgeVariant: 'amber',
        formattedDate,
      };
    }

    if (daysRemaining <= 30) {
      const weeks = Math.floor(daysRemaining / 7);
      return {
        isExpired: false,
        isToday: false,
        isTomorrow: false,
        isClosingSoon: false,
        daysRemaining,
        displayText: weeks === 1 ? '1 week remaining' : `${weeks} weeks remaining`,
        badgeVariant: 'emerald',
        formattedDate,
      };
    }

    const months = Math.floor(daysRemaining / 30);
    return {
      isExpired: false,
      isToday: false,
      isTomorrow: false,
      isClosingSoon: false,
      daysRemaining,
      displayText: months === 1 ? '1 month remaining' : `${months} months remaining`,
      badgeVariant: 'emerald',
      formattedDate,
    };
  },

  /**
   * Generates a Google Calendar event creation URL for the opportunity deadline.
   */
  generateGoogleCalendarUrl(opp: Opportunity): string {
    const title = encodeURIComponent(`[ENEMIND Deadline] Apply: ${opp.title} (${opp.organization})`);
    
    // Parse deadline
    const deadlineDate = new Date(opp.deadline);
    let startIso: string;
    let endIso: string;

    if (!isNaN(deadlineDate.getTime())) {
      const start = new Date(deadlineDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(deadlineDate);
      end.setHours(17, 0, 0, 0);
      
      const formatGCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      startIso = formatGCal(start);
      endIso = formatGCal(end);
    } else {
      const now = new Date();
      now.setDate(now.getDate() + 7);
      const formatGCal = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      startIso = formatGCal(now);
      endIso = formatGCal(now);
    }

    const details = encodeURIComponent(
      `Opportunity: ${opp.title}\n` +
      `Organization: ${opp.organization}\n` +
      `Type: ${opp.type}\n` +
      `Location: ${opp.location}\n` +
      `Application Link: ${opp.applicationUrl}\n` +
      `Official Source: ${opp.source}\n\n` +
      `Summary: ${opp.description.slice(0, 300)}...`
    );

    const location = encodeURIComponent(opp.location || 'Online / Remote');

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
  },
};
