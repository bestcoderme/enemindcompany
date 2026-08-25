/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleAccountInfo, GoogleServiceCapability } from '../../types/google';
import { googleAuthService, ALL_GOOGLE_SCOPES, SERVICE_SCOPE_MAP } from './googleAuthService';
import { googleCapabilityService } from './googleCapabilityService';
import { googleAuditService } from './googleAuditService';

class GoogleAccountService {
  /**
   * Connect Google Account with user consent.
   */
  public async connectGoogle(userEmail?: string, customScopes?: string[]): Promise<{
    success: boolean;
    account: GoogleAccountInfo;
    error?: string;
  }> {
    const scopes = customScopes || ALL_GOOGLE_SCOPES;
    const result = await googleAuthService.requestAuthorization(scopes, userEmail);

    if (result.success) {
      const account = googleAuthService.getAccountInfo();
      googleAuditService.log(
        'drive',
        'GOOGLE_ACCOUNT_CONNECTED',
        account.email || userEmail || 'user@enemind.org',
        'Connected Google Account and granted requested workspace scopes',
        'SUCCESS',
        `Scopes granted: ${result.grantedScopes.length}`
      );
      return { success: true, account };
    } else {
      googleAuditService.log(
        'drive',
        'GOOGLE_ACCOUNT_CONNECT_FAILED',
        userEmail || 'unknown',
        'Failed to connect Google Account',
        'FAILED',
        result.error
      );
      return {
        success: false,
        account: googleAuthService.getAccountInfo(),
        error: result.error || 'Failed to authorize Google Workspace scopes.',
      };
    }
  }

  /**
   * Authorize a single specific service progressively.
   */
  public async authorizeService(serviceKey: string, userEmail?: string): Promise<boolean> {
    const scopes = SERVICE_SCOPE_MAP[serviceKey] || [];
    if (scopes.length === 0) return true;

    const result = await googleAuthService.requestAuthorization(scopes, userEmail);
    if (result.success) {
      const account = googleAuthService.getAccountInfo();
      googleAuditService.log(
        serviceKey as any,
        'SERVICE_AUTHORIZED',
        account.email || userEmail || 'user@enemind.org',
        `Progressive authorization for ${serviceKey}`,
        'SUCCESS'
      );
      return true;
    }
    return false;
  }

  /**
   * Revoke single service authorization without disconnecting entire account.
   */
  public revokeService(serviceKey: string): void {
    const account = googleAuthService.getAccountInfo();
    googleAuthService.revokeServiceScopes(serviceKey);
    googleAuditService.log(
      serviceKey as any,
      'SERVICE_REVOKED',
      account.email || 'user@enemind.org',
      `Revoked permissions for ${serviceKey}`,
      'SUCCESS'
    );
  }

  /**
   * Disconnect Google Account completely.
   */
  public disconnectGoogle(): void {
    const account = googleAuthService.getAccountInfo();
    googleAuthService.disconnect();
    googleAuditService.log(
      'drive',
      'GOOGLE_ACCOUNT_DISCONNECTED',
      account.email || 'user@enemind.org',
      'User disconnected Google account and revoked active session tokens',
      'SUCCESS'
    );
  }

  /**
   * Reconnect / Refresh Token.
   */
  public async refreshAuthorization(userEmail?: string): Promise<boolean> {
    const result = await googleAuthService.requestAuthorization(ALL_GOOGLE_SCOPES, userEmail);
    return result.success;
  }

  /**
   * Get current account status and details.
   */
  public getConnectionStatus(): GoogleAccountInfo {
    return googleAuthService.getAccountInfo();
  }

  /**
   * Get all service capabilities with statuses.
   */
  public getAllServices(): GoogleServiceCapability[] {
    return googleCapabilityService.getAllCapabilities();
  }

  /**
   * Get formatted granted permissions list.
   */
  public getGrantedPermissions(): { scope: string; description: string; service: string }[] {
    const account = googleAuthService.getAccountInfo();
    const permissions: { scope: string; description: string; service: string }[] = [];

    account.scopes.forEach((scope) => {
      let desc = 'General user profile and email access';
      let service = 'Google Account';

      if (scope.includes('gmail.send')) {
        desc = 'Send transactional emails & booking confirmations on your behalf';
        service = 'Gmail';
      } else if (scope.includes('gmail.readonly')) {
        desc = 'Read notifications & course emails';
        service = 'Gmail';
      } else if (scope.includes('drive')) {
        desc = 'Store & manage documents in dedicated Enemind Drive folder';
        service = 'Google Drive';
      } else if (scope.includes('calendar')) {
        desc = 'Schedule & sync mentorship appointments & class deadlines';
        service = 'Google Calendar';
      } else if (scope.includes('spreadsheets')) {
        desc = 'Create and sync automated spreadsheet databases';
        service = 'Google Sheets';
      } else if (scope.includes('documents')) {
        desc = 'Create & edit collaborative reports and CVs';
        service = 'Google Docs';
      } else if (scope.includes('classroom')) {
        desc = 'Sync enrolled courses, coursework, and assignment deadlines';
        service = 'Google Classroom';
      }

      permissions.push({ scope, description: desc, service });
    });

    return permissions;
  }
}

export const googleAccountService = new GoogleAccountService();
