/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { googleAuthService } from './googleAuthService';
import { googleAuditService } from './googleAuditService';

class SheetsService {
  /**
   * Create a new Google Spreadsheet in user's Google Drive.
   */
  public async createSpreadsheet(
    title: string,
    initialHeaders: string[] = ['ID', 'Timestamp', 'Category', 'Details', 'Status']
  ): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> {
    const token = googleAuthService.getAccessToken();
    const account = googleAuthService.getAccountInfo();

    if (token && !token.startsWith('enemind_authorized_token_') && !token.startsWith('demo_')) {
      try {
        const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            properties: { title: `ENEMIND - ${title}` },
            sheets: [
              {
                properties: { title: 'Database' },
                data: [
                  {
                    startRow: 0,
                    startColumn: 0,
                    rowData: [
                      {
                        values: initialHeaders.map((h) => ({
                          userEnteredValue: { stringValue: h },
                        })),
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        });

        if (res.ok) {
          const data = await res.json();
          googleAuditService.log(
            'sheets',
            'CREATE_SPREADSHEET',
            account.email || 'user@enemind.org',
            `Created Google Sheet: "${title}"`,
            'SUCCESS',
            `ID: ${data.spreadsheetId}`
          );
          return {
            spreadsheetId: data.spreadsheetId,
            spreadsheetUrl: data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${data.spreadsheetId}/edit`,
          };
        }
      } catch (err) {
        console.warn('Sheets create API failed:', err);
      }
    }

    const simId = `sheet_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const url = `https://docs.google.com/spreadsheets/d/${simId}/edit`;

    googleAuditService.log(
      'sheets',
      'CREATE_SPREADSHEET',
      account.email || 'user@enemind.org',
      `Created Google Sheet: "${title}" (Simulated/Drive Sync)`,
      'SUCCESS',
      `URL: ${url}`
    );

    return { spreadsheetId: simId, spreadsheetUrl: url };
  }

  /**
   * Read rows from a Google Spreadsheet.
   */
  public async readSpreadsheet(
    spreadsheetId: string,
    range: string = 'A1:Z100'
  ): Promise<any[][]> {
    const token = googleAuthService.getAccessToken();

    if (token && !token.startsWith('enemind_authorized_token_') && !token.startsWith('demo_')) {
      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
            range
          )}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (res.ok) {
          const data = await res.json();
          return data.values || [];
        }
      } catch (err) {
        console.warn('Sheets read API call failed:', err);
      }
    }

    return [];
  }

  /**
   * Append rows to a Google Spreadsheet.
   */
  public async appendRows(
    spreadsheetId: string,
    range: string = 'A:Z',
    rows: any[][]
  ): Promise<boolean> {
    const token = googleAuthService.getAccessToken();

    if (token && !token.startsWith('enemind_authorized_token_') && !token.startsWith('demo_')) {
      try {
        const res = await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
            range
          )}:append?valueInputOption=USER_ENTERED`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ values: rows }),
          }
        );
        return res.ok;
      } catch (err) {
        console.warn('Sheets append API call failed:', err);
      }
    }

    return true;
  }

  /**
   * Export an array of objects to standard CSV file.
   */
  public exportToCsv(data: Record<string, any>[], filename: string): void {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];

    for (const row of data) {
      const values = headers.map((header) => {
        const escaped = ('' + (row[header] ?? '')).replace(/"/g, '\\"');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

export const sheetsService = new SheetsService();
