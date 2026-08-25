/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  FolderLock,
  FileText,
  Upload,
  Shield,
  Lock,
  Unlock,
  ExternalLink,
  Plus,
  Trash2,
  Share2,
  FileSpreadsheet,
  CheckCircle2,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { GoogleDriveFileItem } from '../../types/google';
import { driveService, ENEMIND_FOLDER_CATEGORIES, EnemindDriveCategory } from '../../services/google/driveService';
import { docsService } from '../../services/google/docsService';
import { sheetsService } from '../../services/google/sheetsService';
import { googleAccountService } from '../../services/google/googleAccountService';

interface DocumentsViewProps {
  onOpenCloudSettings: () => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ onOpenCloudSettings }) => {
  const [files, setFiles] = useState<GoogleDriveFileItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedFileForShare, setSelectedFileForShare] = useState<GoogleDriveFileItem | null>(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isCreatingDoc, setIsCreatingDoc] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Upload state
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCategory, setUploadCategory] = useState<EnemindDriveCategory>('CV');
  const [uploadIsPrivate, setUploadIsPrivate] = useState(true);

  useEffect(() => {
    loadFiles();
  }, [selectedCategory]);

  const loadFiles = async () => {
    const cat = selectedCategory === 'All' ? undefined : (selectedCategory as EnemindDriveCategory);
    const list = await driveService.listFiles(cat);
    setFiles(list);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim()) return;

    await driveService.uploadDocument(
      uploadFileName.trim(),
      uploadFileName.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.google-apps.document',
      uploadCategory,
      undefined,
      uploadIsPrivate
    );

    setIsUploadModalOpen(false);
    setUploadFileName('');
    showToast(`Uploaded "${uploadFileName}" to /Enemind/${uploadCategory}`);
    loadFiles();
  };

  const handleCreateDoc = async () => {
    setIsCreatingDoc(true);
    try {
      const doc = await docsService.createDocument('New Study Notes & Academic Draft');
      showToast('Created Google Doc in your Drive locker!');
      loadFiles();
      window.open(doc.documentUrl, '_blank');
    } finally {
      setIsCreatingDoc(false);
    }
  };

  const handleCreateSheet = async () => {
    const sheet = await sheetsService.createSpreadsheet('Academic & Research Database');
    showToast('Created Google Sheet in your Drive locker!');
    loadFiles();
    window.open(sheet.spreadsheetUrl, '_blank');
  };

  const handleDelete = async (fileId: string) => {
    if (window.confirm('Are you sure you want to remove this document from your locker?')) {
      await driveService.deleteDocument(fileId);
      showToast('Document deleted.');
      loadFiles();
    }
  };

  const handleShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileForShare || !recipientEmail.trim()) return;

    driveService.confirmDocumentShare(selectedFileForShare.id, recipientEmail.trim());
    setIsShareModalOpen(false);
    setRecipientEmail('');
    setSelectedFileForShare(null);
    showToast(`Read permission authorized for ${recipientEmail}!`);
    loadFiles();
  };

  const filteredFiles = files.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.folderCategory && f.folderCategory.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
              Google Drive Digital Document Locker
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
              /Enemind Hierarchy
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Encrypted storage hierarchy in your personal Google Drive for transcripts, certificates, CVs, and project code.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-emerald-400" />
            <span>Upload Document</span>
          </button>

          <button
            onClick={handleCreateDoc}
            disabled={isCreatingDoc}
            className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>+ Google Doc</span>
          </button>

          <button
            onClick={handleCreateSheet}
            className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>+ Google Sheet</span>
          </button>

          <button
            onClick={onOpenCloudSettings}
            className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors cursor-pointer"
            title="Google Workspace Settings"
          >
            <Shield className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Security Privacy Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
        <Lock className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
        <div className="text-xs text-emerald-950 leading-relaxed">
          <strong>Private by Default:</strong> Your academic transcripts, ID documents, and CV drafts are stored securely in your private Google Drive account. Documents are never exposed to other users or mentors without your explicit sharing confirmation.
        </div>
      </div>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="p-3 bg-neutral-900 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Search & Folder Categories */}
      <div className="space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by name, category, or keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'All'
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            All Folders ({files.length})
          </button>

          {ENEMIND_FOLDER_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              /Enemind/{cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid / Table */}
      {filteredFiles.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-neutral-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
            <FolderLock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900">No documents found in this folder</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Upload your degree certificates, resume, or course notes to sync them with Google Drive.
          </p>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer"
          >
            Upload to /Enemind/{selectedCategory === 'All' ? 'Academic' : selectedCategory}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="p-4 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0">
                    {file.mimeType.includes('spreadsheet') ? (
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                    ) : file.mimeType.includes('pdf') ? (
                      <FileText className="w-5 h-5 text-rose-600" />
                    ) : (
                      <FileText className="w-5 h-5 text-blue-600" />
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-neutral-100 text-neutral-700">
                      {file.folderCategory}
                    </span>
                    {file.isPrivate && (
                      <span
                        className="p-1 rounded-md bg-emerald-50 text-emerald-700"
                        title="Private Document"
                      >
                        <Lock className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xs font-bold text-neutral-900 leading-snug break-words mb-1 line-clamp-2">
                  {file.name}
                </h3>
                <p className="text-[11px] text-neutral-400 font-medium">
                  {file.size} · Modified {new Date(file.modifiedTime).toLocaleDateString()}
                </p>

                {file.sharedWith && file.sharedWith.length > 0 && (
                  <div className="mt-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded-lg">
                    Shared with {file.sharedWith.join(', ')}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-neutral-100 mt-3 flex items-center justify-between">
                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  <span>Open in Drive</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setSelectedFileForShare(file);
                      setIsShareModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                    title="Share with consent"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <h3 className="text-base font-bold font-heading text-neutral-900 mb-1">
              Upload Document to Google Drive
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Saved directly in your dedicated /Enemind cloud storage folder.
            </p>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Document Title / File Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KCSE_Certificate_2025.pdf"
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Folder Category
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as EnemindDriveCategory)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500 bg-white"
                >
                  {ENEMIND_FOLDER_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      /Enemind/{cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900">Private Document</p>
                  <p className="text-[11px] text-neutral-500">Require consent before sharing</p>
                </div>
                <input
                  type="checkbox"
                  checked={uploadIsPrivate}
                  onChange={(e) => setUploadIsPrivate(e.target.checked)}
                  className="w-4 h-4 accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 cursor-pointer"
                >
                  Confirm Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Share Confirmation Modal (Privacy Enforcement) */}
      {isShareModalOpen && selectedFileForShare && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-neutral-900 mb-1">
              Confirm Document Access Permission
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              You are about to authorize access to <strong>"{selectedFileForShare.name}"</strong>.
            </p>

            <form onSubmit={handleShareSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  Recipient Email (Mentor, Recruiter, or University)
                </label>
                <input
                  type="email"
                  required
                  placeholder="mentor@enemind.org"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                By confirming, you grant read-only view access to this recipient via Google Drive sharing controls.
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 cursor-pointer"
                >
                  Authorize Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
