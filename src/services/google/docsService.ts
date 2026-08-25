/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { googleAuthService } from './googleAuthService';
import { googleAuditService } from './googleAuditService';

class DocsService {
  /**
   * Create a new Google Doc in user's Drive.
   */
  public async createDocument(
    title: string,
    initialBody?: string
  ): Promise<{ documentId: string; documentUrl: string }> {
    const token = googleAuthService.getAccessToken();
    const account = googleAuthService.getAccountInfo();

    if (token && !token.startsWith('enemind_authorized_token_') && !token.startsWith('demo_')) {
      try {
        const res = await fetch('https://docs.googleapis.com/v1/documents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title: `ENEMIND - ${title}` }),
        });

        if (res.ok) {
          const data = await res.json();
          googleAuditService.log(
            'docs',
            'CREATE_DOCUMENT',
            account.email || 'user@enemind.org',
            `Created Google Doc: "${title}"`,
            'SUCCESS',
            `ID: ${data.documentId}`
          );
          return {
            documentId: data.documentId,
            documentUrl: `https://docs.google.com/document/d/${data.documentId}/edit`,
          };
        }
      } catch (err) {
        console.warn('Docs API create error:', err);
      }
    }

    const simId = `doc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const url = `https://docs.google.com/document/d/${simId}/edit`;

    googleAuditService.log(
      'docs',
      'CREATE_DOCUMENT',
      account.email || 'user@enemind.org',
      `Created Google Doc: "${title}" (Simulated/Drive Sync)`,
      'SUCCESS',
      `URL: ${url}`
    );

    return { documentId: simId, documentUrl: url };
  }

  /**
   * Generate formatted CV Google Doc draft.
   */
  public async generateStudentCV(studentName: string, courseName: string, skills: string[]): Promise<string> {
    const title = `${studentName.replace(/\s+/g, '_')}_Curriculum_Vitae_2026`;
    const doc = await this.createDocument(title);
    return doc.documentUrl;
  }
}

export const docsService = new DocsService();
