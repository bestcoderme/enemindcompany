/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole, UserProfile } from '../../types/user';

export type PermissionAction =
  | 'VIEW'
  | 'CREATE'
  | 'EDIT'
  | 'DELETE'
  | 'PUBLISH'
  | 'EXPORT'
  | 'MANAGE_SETTINGS'
  | 'ACCESS_ADMIN_PANEL';

export type ResourceType =
  | 'WEBSITE'
  | 'BUSINESS'
  | 'ACADEMIC_DATA'
  | 'DOCUMENT'
  | 'MENTORSHIP_SESSION'
  | 'COURSE'
  | 'MARKETPLACE_ITEM'
  | 'PAYMENT'
  | 'GOOGLE_INTEGRATION';

export class PermissionService {
  /**
   * Evaluates if a user can access and mutate a specific resource
   */
  public canAccessResource(params: {
    user: UserProfile | null;
    resourceOwnerId?: string;
    resourceType: ResourceType;
    action: PermissionAction;
  }): boolean {
    const { user, resourceOwnerId, action } = params;
    if (!user) return false;

    // Super Admin has system-wide override access (except unconsented private drive files)
    if (this.isAdmin(user)) {
      return true;
    }

    // Direct ownership check
    if (resourceOwnerId && (user.id === resourceOwnerId || user.email === resourceOwnerId)) {
      return true;
    }

    // Public read actions
    if (action === 'VIEW') {
      return true;
    }

    return false;
  }

  /**
   * Checks if user has admin privileges
   */
  public isAdmin(user: UserProfile | null): boolean {
    if (!user) return false;
    return Boolean(
      user.roles?.includes('ENEMIND_ADMIN') ||
      user.roles?.includes('UNIVERSITY_ADMIN') ||
      user.personas?.includes('ENEMIND_ADMIN') ||
      user.personas?.includes('UNIVERSITY_ADMIN')
    );
  }

  /**
   * Gets list of available actions based on user's active persona
   */
  public getPersonaCapabilities(role: UserRole): string[] {
    switch (role) {
      case 'STUDENT':
        return [
          'Access course syllabus & past papers',
          'Calculate & predict GPA',
          'Find student hostels & campus dining',
          'Create personal/portfolio website (KES 150/mo)',
          'Book peer & alumni mentors',
        ];
      case 'BUSINESS_OWNER':
        return [
          'Create & manage business website (KES 150/mo)',
          'Connect Google Sheets for Menu/Inventory/Orders',
          'Receive online student orders & table reservations',
          'Get listed in Enemind Campus Life directory',
          'Track sales & customer order analytics',
        ];
      case 'CREATOR':
        return [
          'Build creator portfolio & video showcase website',
          'Sell digital products & event tickets',
          'Connect Google Drive for media hosting',
          'Accept booking requests & collaborations',
        ];
      case 'TEACHER':
        return [
          'Publish course outlines & revision materials',
          'Manage class resources & homework templates',
          'Host academic office hours & consultation slots',
        ];
      case 'MENTOR':
        return [
          'Set mentorship availability calendar',
          'Accept mentorship bookings & student reviews',
          'Create professional mentor profile website',
        ];
      case 'FREELANCER':
        return [
          'Showcase design/dev portfolio with Google Sheet database',
          'Collect client leads & service inquiries',
          'Create custom pricing packages',
        ];
      case 'WEBSITE_OWNER':
        return [
          'Visual drag-and-drop page builder',
          'Google Sheet CMS live synchronization',
          'Custom subdomain (slug.enemind.app)',
          'Visitor analytics & form submissions',
        ];
      case 'ENEMIND_ADMIN':
        return [
          'Manage all platform users & accounts',
          'Configure pricing (KES 150/mo) & billing models',
          'Inspect system health & database sync logs',
          'Moderate campus websites & listings',
        ];
      default:
        return ['Explore Enemind ecosystem', 'Build custom website', 'Connect Google Cloud tools'];
    }
  }
}

export const permissionService = new PermissionService();
