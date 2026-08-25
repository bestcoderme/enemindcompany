/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleDriveFileItem } from '../../types/google';
import { googleAuthService } from './googleAuthService';
import { googleAuditService } from './googleAuditService';

const DRIVE_FILES_STORAGE_KEY = 'enemind_google_drive_files_v1';

export const ENEMIND_FOLDER_CATEGORIES = [
  'Academic',
  'Certificates',
  'CV',
  'Applications',
  'Notes',
  'Projects',
  'Mentorship',
  'Marketplace',
] as const;

export type EnemindDriveCategory = typeof ENEMIND_FOLDER_CATEGORIES[number];

class DriveService {
  private localFiles: GoogleDriveFileItem[] = [];

  constructor() {
    this.loadLocalFiles();
  }

  private loadLocalFiles() {
    try {
      const stored = localStorage.getItem(DRIVE_FILES_STORAGE_KEY);
      if (stored) {
        this.localFiles = JSON.parse(stored);
      } else {
        // Initial sample files matching standard campus documents
        this.localFiles = [
          {
            id: 'drive_cv_01',
            name: 'Resume_Software_Engineering_2026.pdf',
            mimeType: 'application/pdf',
            webViewLink: 'https://drive.google.com/file/d/demo_resume/view',
            size: '240 KB',
            modifiedTime: new Date(Date.now() - 3600 * 1000 * 48).toISOString(),
            folderCategory: 'CV',
            isPrivate: true,
          },
          {
            id: 'drive_transcript_01',
            name: 'Official_University_Transcript_Year_3.pdf',
            mimeType: 'application/pdf',
            webViewLink: 'https://drive.google.com/file/d/demo_transcript/view',
            size: '512 KB',
            modifiedTime: new Date(Date.now() - 3600 * 1000 * 120).toISOString(),
            folderCategory: 'Academic',
            isPrivate: true,
          },
          {
            id: 'drive_cert_01',
            name: 'AWS_Certified_Cloud_Practitioner.pdf',
            mimeType: 'application/pdf',
            webViewLink: 'https://drive.google.com/file/d/demo_cert/view',
            size: '1.2 MB',
            modifiedTime: new Date(Date.now() - 3600 * 1000 * 200).toISOString(),
            folderCategory: 'Certificates',
            isPrivate: true,
          },
          {
            id: 'drive_notes_01',
            name: 'CSC_311_Distributed_Systems_Notes.gdoc',
            mimeType: 'application/vnd.google-apps.document',
            webViewLink: 'https://docs.google.com/document/d/demo_notes/edit',
            size: '45 KB',
            modifiedTime: new Date(Date.now() - 3600 * 1000 * 12).toISOString(),
            folderCategory: 'Notes',
            isPrivate: true,
          },
          {
            id: 'drive_sheet_01',
            name: 'GPA_Projection_&_Credit_Planner.gsheet',
            mimeType: 'application/vnd.google-apps.spreadsheet',
            webViewLink: 'https://docs.google.com/spreadsheets/d/demo_gpa/edit',
            size: '18 KB',
            modifiedTime: new Date(Date.now() - 3600 * 1000 * 4).toISOString(),
            folderCategory: 'Academic',
            isPrivate: true,
          },
        ];
        this.saveLocalFiles();
      }
    } catch (e) {
      console.warn('Failed to load local drive files:', e);
    }
  }

  private saveLocalFiles() {
    try {
      localStorage.setItem(DRIVE_FILES_STORAGE_KEY, JSON.stringify(this.localFiles));
    } catch (e) {
      console.warn('Failed to save local drive files:', e);
    }
  }

  /**
   * List files in dedicated Enemind Google Drive directory.
   */
  public async listFiles(category?: EnemindDriveCategory): Promise<GoogleDriveFileItem[]> {
    const token = googleAuthService.getAccessToken();
    const account = googleAuthService.getAccountInfo();

    if (token && !token.startsWith('enemind_authorized_token_') && !token.startsWith('demo_')) {
      try {
        const query = encodeURIComponent("trashed = false and 'root' in parents");
        const res = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name,mimeType,webViewLink,webContentLink,size,modifiedTime,iconLink)&pageSize=20`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.files && Array.isArray(data.files)) {
            const remoteFiles: GoogleDriveFileItem[] = data.files.map((f: any) => ({
              id: f.id,
              name: f.name,
              mimeType: f.mimeType,
              webViewLink: f.webViewLink || `https://drive.google.com/file/d/${f.id}/view`,
              webContentLink: f.webContentLink,
              iconLink: f.iconLink,
              size: f.size ? `${(parseInt(f.size, 10) / 1024).toFixed(0)} KB` : 'Cloud Doc',
              modifiedTime: f.modifiedTime || new Date().toISOString(),
              folderCategory: this.inferCategory(f.name),
              isPrivate: true,
            }));

            // Merge with local records
            const merged = [...remoteFiles, ...this.localFiles.filter((l) => !remoteFiles.some((r) => r.id === l.id))];
            return category ? merged.filter((f) => f.folderCategory === category) : merged;
          }
        }
      } catch (err) {
        console.warn('Google Drive list API call failed:', err);
      }
    }

    const files = this.localFiles;
    return category ? files.filter((f) => f.folderCategory === category) : files;
  }

  private inferCategory(fileName: string): EnemindDriveCategory {
    const lower = fileName.toLowerCase();
    if (lower.includes('cv') || lower.includes('resume')) return 'CV';
    if (lower.includes('transcript') || lower.includes('gpa') || lower.includes('grade')) return 'Academic';
    if (lower.includes('cert') || lower.includes('award') || lower.includes('badge')) return 'Certificates';
    if (lower.includes('note') || lower.includes('lecture') || lower.includes('revision')) return 'Notes';
    if (lower.includes('project') || lower.includes('capstone') || lower.includes('code')) return 'Projects';
    if (lower.includes('apply') || lower.includes('cover') || lower.includes('internship')) return 'Applications';
    if (lower.includes('mentor') || lower.includes('feedback')) return 'Mentorship';
    return 'Academic';
  }

  /**
   * Upload or register a new document in user's Drive folder.
   */
  public async uploadDocument(
    name: string,
    fileType: string,
    category: EnemindDriveCategory,
    contentPreview?: string,
    isPrivate: boolean = true
  ): Promise<GoogleDriveFileItem> {
    const account = googleAuthService.getAccountInfo();
    const newFile: GoogleDriveFileItem = {
      id: `drive_doc_${Date.now()}`,
      name,
      mimeType: fileType.includes('pdf') ? 'application/pdf' : 'application/vnd.google-apps.document',
      webViewLink: `https://drive.google.com/file/d/enemind_doc_${Date.now()}/view`,
      size: '320 KB',
      modifiedTime: new Date().toISOString(),
      folderCategory: category,
      isPrivate,
    };

    this.localFiles.unshift(newFile);
    this.saveLocalFiles();

    googleAuditService.log(
      'drive',
      'UPLOAD_FILE',
      account.email || 'user@enemind.org',
      `Uploaded file "${name}" to /Enemind/${category}`,
      'SUCCESS',
      `File ID: ${newFile.id}, Private: ${isPrivate}`
    );

    return newFile;
  }

  /**
   * Delete a document from Drive locker.
   */
  public async deleteDocument(fileId: string): Promise<boolean> {
    const account = googleAuthService.getAccountInfo();
    const target = this.localFiles.find((f) => f.id === fileId);
    this.localFiles = this.localFiles.filter((f) => f.id !== fileId);
    this.saveLocalFiles();

    googleAuditService.log(
      'drive',
      'DELETE_FILE',
      account.email || 'user@enemind.org',
      `Deleted file "${target?.name || fileId}" from Drive locker`,
      'SUCCESS'
    );

    return true;
  }

  /**
   * Request user confirmation before sharing a private document.
   */
  public confirmDocumentShare(fileId: string, recipientEmail: string): boolean {
    const target = this.localFiles.find((f) => f.id === fileId);
    if (!target) return false;

    if (!target.sharedWith) {
      target.sharedWith = [];
    }
    if (!target.sharedWith.includes(recipientEmail)) {
      target.sharedWith.push(recipientEmail);
    }
    this.saveLocalFiles();

    googleAuditService.log(
      'drive',
      'SHARE_DOCUMENT_CONSENT',
      googleAuthService.getAccountInfo().email || 'user@enemind.org',
      `Authorized read access for "${target.name}" to ${recipientEmail}`,
      'SUCCESS'
    );

    return true;
  }

  /**
   * Create a file or folder in Google Drive.
   */
  public async createFile(options: {
    name: string;
    mimeType?: string;
    folderCategory?: EnemindDriveCategory;
    tags?: string[];
  }): Promise<GoogleDriveFileItem> {
    const account = googleAuthService.getAccountInfo();
    const isFolder = options.mimeType === 'application/vnd.google-apps.folder';
    const newFile: GoogleDriveFileItem = {
      id: `drive_${isFolder ? 'folder' : 'file'}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: options.name,
      mimeType: options.mimeType || 'application/vnd.google-apps.document',
      webViewLink: isFolder
        ? `https://drive.google.com/drive/folders/enemind_folder_${Date.now()}`
        : `https://drive.google.com/file/d/enemind_file_${Date.now()}/view`,
      size: isFolder ? '0 KB' : '45 KB',
      modifiedTime: new Date().toISOString(),
      folderCategory: options.folderCategory || 'Marketplace',
      isPrivate: false,
    };

    this.localFiles.unshift(newFile);
    this.saveLocalFiles();

    googleAuditService.log(
      'drive',
      isFolder ? 'CREATE_FOLDER' : 'CREATE_FILE',
      account.email || 'user@enemind.org',
      `Created Drive item "${options.name}" in category ${options.folderCategory || 'Marketplace'}`,
      'SUCCESS',
      `Item ID: ${newFile.id}`
    );

    return newFile;
  }
}

export const driveService = new DriveService();
