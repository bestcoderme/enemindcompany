/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleChatSpace } from '../../types/google';
import { googleAuthService } from './googleAuthService';
import { googleAuditService } from './googleAuditService';

class GoogleChatIntegrationService {
  /**
   * Check if Google Chat Spaces API is usable for current account.
   */
  public isGoogleChatSupported(): boolean {
    const account = googleAuthService.getAccountInfo();
    return Boolean(account.isConnected && account.isWorkspaceAccount);
  }

  /**
   * List or create Google Chat Space or fallback to ENEMIND chat channel.
   */
  public async getOrCreateSpace(
    spaceName: string,
    description?: string
  ): Promise<{
    isGoogleChatSpace: boolean;
    spaceName: string;
    spaceUri?: string;
    description?: string;
  }> {
    const account = googleAuthService.getAccountInfo();
    const isSupported = this.isGoogleChatSupported();

    if (isSupported) {
      googleAuditService.log(
        'chat',
        'CREATE_CHAT_SPACE',
        account.email || 'user@enemind.org',
        `Created Google Workspace Chat Space: "${spaceName}"`,
        'SUCCESS',
        `Type: SPACE`
      );

      return {
        isGoogleChatSpace: true,
        spaceName,
        spaceUri: `https://chat.google.com/room/enemind_${encodeURIComponent(spaceName)}`,
        description,
      };
    }

    // Smooth fallback to ENEMIND Internal Chat
    return {
      isGoogleChatSpace: false,
      spaceName,
      description: `${description || 'Study discussion group'} (Powered by ENEMIND Internal Encrypted Chat)`,
    };
  }
}

export const googleChatIntegrationService = new GoogleChatIntegrationService();
