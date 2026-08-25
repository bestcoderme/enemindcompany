/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleServiceCapability, GoogleServiceType, GoogleServiceStatus } from '../../types/google';
import { googleAuthService, SERVICE_SCOPE_MAP } from './googleAuthService';

class GoogleCapabilityService {
  private capabilities: Record<GoogleServiceType, Omit<GoogleServiceCapability, 'status' | 'isAuthorized' | 'isAvailable' | 'isWorkspaceDetected'>> = {
    gmail: {
      service: 'gmail',
      name: 'Gmail Communication',
      description: 'Send booking confirmations, application alerts, and read authorized academic emails.',
      iconName: 'Mail',
      requiredScopes: SERVICE_SCOPE_MAP.gmail,
      isWorkspaceRequired: false,
    },
    drive: {
      service: 'drive',
      name: 'Google Drive Locker',
      description: 'Dedicated /Enemind cloud storage folder for CVs, transcripts, certificates, and projects.',
      iconName: 'FolderLock',
      requiredScopes: SERVICE_SCOPE_MAP.drive,
      isWorkspaceRequired: false,
    },
    calendar: {
      service: 'calendar',
      name: 'Google Calendar Events',
      description: 'Create and synchronize 1-on-1 mentorship bookings, class schedules, and deadlines.',
      iconName: 'Calendar',
      requiredScopes: SERVICE_SCOPE_MAP.calendar,
      isWorkspaceRequired: false,
    },
    meet: {
      service: 'meet',
      name: 'Google Meet Rooms',
      description: 'Generate high-definition video classrooms, screen sharing, and recording links.',
      iconName: 'Video',
      requiredScopes: SERVICE_SCOPE_MAP.meet,
      isWorkspaceRequired: false,
    },
    classroom: {
      service: 'classroom',
      name: 'Google Classroom',
      description: 'Sync university coursework, assignments, announcements, and submissions directly.',
      iconName: 'GraduationCap',
      requiredScopes: SERVICE_SCOPE_MAP.classroom,
      isWorkspaceRequired: false, // Available to .edu & consumer accounts with Classroom enabled
    },
    chat: {
      service: 'chat',
      name: 'Google Chat Spaces',
      description: 'Real-time collaborative spaces and group discussion channels.',
      iconName: 'MessageSquare',
      requiredScopes: SERVICE_SCOPE_MAP.chat,
      isWorkspaceRequired: true, // Google Chat spaces API requires Google Workspace
    },
    groups: {
      service: 'groups',
      name: 'Google Groups Collaboration',
      description: 'Campus club distribution lists and community discussions.',
      iconName: 'Users',
      requiredScopes: SERVICE_SCOPE_MAP.groups,
      isWorkspaceRequired: false,
    },
    sheets: {
      service: 'sheets',
      name: 'Google Sheets Automation',
      description: 'Read, write, update, and deploy automated spreadsheets as serverless databases.',
      iconName: 'FileSpreadsheet',
      requiredScopes: SERVICE_SCOPE_MAP.sheets,
      isWorkspaceRequired: false,
    },
    docs: {
      service: 'docs',
      name: 'Google Docs Reports',
      description: 'Collaborative academic reports, CV generation, and learning notes.',
      iconName: 'FileText',
      requiredScopes: SERVICE_SCOPE_MAP.docs,
      isWorkspaceRequired: false,
    },
    slides: {
      service: 'slides',
      name: 'Google Slides Decks',
      description: 'Create presentation slides for project showcases and campus coursework.',
      iconName: 'Presentation',
      requiredScopes: ['https://www.googleapis.com/auth/drive.file'],
      isWorkspaceRequired: false,
    },
    forms: {
      service: 'forms',
      name: 'Google Forms & Surveys',
      description: 'Collect student feedback, campus event RSVPs, and peer evaluations.',
      iconName: 'CheckSquare',
      requiredScopes: ['https://www.googleapis.com/auth/drive.file'],
      isWorkspaceRequired: false,
    },
    youtube: {
      service: 'youtube',
      name: 'YouTube Education',
      description: 'Curated video lectures, coding tutorials, and campus media.',
      iconName: 'Youtube',
      requiredScopes: SERVICE_SCOPE_MAP.youtube,
      isWorkspaceRequired: false,
    },
    appsScript: {
      service: 'appsScript',
      name: 'Google Apps Script Engine',
      description: 'Automated macros, webhooks, and backend triggers for marketplace spreadsheets.',
      iconName: 'Code',
      requiredScopes: SERVICE_SCOPE_MAP.appsScript,
      isWorkspaceRequired: false,
    },
  };

  /**
   * Determine the capability status for a given service.
   */
  public getServiceCapability(service: GoogleServiceType): GoogleServiceCapability {
    const base = this.capabilities[service];
    const account = googleAuthService.getAccountInfo();
    const isAuthorized = googleAuthService.isServiceAuthorized(service);
    const isWorkspaceDetected = Boolean(account.isWorkspaceAccount);

    let status: GoogleServiceStatus = 'DISCONNECTED';

    if (account.isConnected) {
      if (base.isWorkspaceRequired && !isWorkspaceDetected) {
        status = 'REQUIRES_WORKSPACE';
      } else if (isAuthorized) {
        status = 'CONNECTED';
      } else {
        status = 'REQUIRES_AUTHORIZATION';
      }
    } else {
      status = 'AVAILABLE';
    }

    return {
      ...base,
      status,
      isAvailable: status !== 'REQUIRES_WORKSPACE',
      isAuthorized,
      isWorkspaceDetected,
    };
  }

  /**
   * Get capability list for all supported services.
   */
  public getAllCapabilities(): GoogleServiceCapability[] {
    const keys = Object.keys(this.capabilities) as GoogleServiceType[];
    return keys.map((key) => this.getServiceCapability(key));
  }

  /**
   * Quick check helpers
   */
  public isGmailAvailable(): boolean {
    return this.getServiceCapability('gmail').isAuthorized;
  }

  public isDriveAvailable(): boolean {
    return this.getServiceCapability('drive').isAuthorized;
  }

  public isCalendarAvailable(): boolean {
    return this.getServiceCapability('calendar').isAuthorized;
  }

  public isMeetAvailable(): boolean {
    return this.getServiceCapability('meet').isAuthorized;
  }

  public isClassroomAvailable(): boolean {
    return this.getServiceCapability('classroom').isAuthorized;
  }

  public isChatAvailable(): boolean {
    return this.getServiceCapability('chat').isAuthorized && this.getServiceCapability('chat').status === 'CONNECTED';
  }

  public isSheetsAvailable(): boolean {
    return this.getServiceCapability('sheets').isAuthorized;
  }

  public isDocsAvailable(): boolean {
    return this.getServiceCapability('docs').isAuthorized;
  }

  public isAppsScriptAvailable(): boolean {
    return this.getServiceCapability('appsScript').isAuthorized;
  }
}

export const googleCapabilityService = new GoogleCapabilityService();
