/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet,
  FolderOpen,
  Mail,
  Calendar,
  ShieldCheck,
  ExternalLink,
  Plus,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Lock,
  Database,
  Cloud,
} from 'lucide-react';
import { UserProfile } from '../../types/user';
import { websiteBuilderService } from '../../services/website/websiteBuilderService';
import { providerRegistry } from '../../services/providers/providerRegistry';

interface GoogleServicesDashboardViewProps {
  user: UserProfile;
}

export const GoogleServicesDashboardView: React.FC<GoogleServicesDashboardViewProps> = ({
  user,
}) => {
  const websites = websiteBuilderService.getWebsitesByOwner(user.email || user.id);
  const [isCreatingSheet, setIsCreatingSheet] = useState<boolean>(false);
  const [newSheetTitle, setNewSheetTitle] = useState<string>('');
  const [createdSheetUrl, setCreatedSheetUrl] = useState<string | null>(null);

  const handleCreateNewSheet = async (type: string) => {
    setIsCreatingSheet(true);
    try {
      const title = newSheetTitle.trim() || `Enemind ${type} Database`;
      const res = await providerRegistry.googleProvider.createSpreadsheet(
        title,
        ['Settings', 'Catalog', 'Orders', 'Inquiries']
      );
      setCreatedSheetUrl(res.sheetUrl);
      setNewSheetTitle('');
    } catch (e: any) {
      alert('Error creating sheet');
    } finally {
      setIsCreatingSheet(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight">
              Google Cloud & Workspace Hub
            </h1>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center gap-1">
              <Cloud className="w-3.5 h-3.5" /> User-Owned Storage
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Enemind uses your authorized Google Cloud storage as a zero-cost database layer for your websites and applications.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Google Sheets */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-neutral-900">
              Google Sheets (Database)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Live tables, product catalogs, menu items, room rates, and form submissions.
            </p>
          </div>
          <p className="text-xs font-bold text-emerald-700">
            {websites.filter((w) => Boolean(w.googleSheetId)).length} Connected Databases
          </p>
        </div>

        {/* Google Drive */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <FolderOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-neutral-900">
              Google Drive (Media Hosting)
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Images, brochures, course PDFs, and food menu photos stored in your Drive.
            </p>
          </div>
          <p className="text-xs font-bold text-blue-700">
            Folder: /ENEMIND_WEBSITES
          </p>
        </div>

        {/* Google Forms / Mail */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-neutral-900">
              Inquiries & Alerts
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Receive customer orders and website inquiries directly to your Gmail inbox.
            </p>
          </div>
          <p className="text-xs font-bold text-amber-700">
            Real-time notifications active
          </p>
        </div>
      </div>

      {/* Connected Website Databases Table */}
      <div className="p-6 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <h3 className="font-heading font-extrabold text-lg text-neutral-900">
          Connected Website Spreadsheets
        </h3>

        <div className="divide-y divide-neutral-100 overflow-x-auto">
          {websites.map((site) => (
            <div key={site.id} className="py-3.5 flex items-center justify-between gap-4 text-xs">
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-neutral-900">{site.name}</p>
                  <span className="text-[10px] bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded font-mono">
                    {site.slug}.enemind.app
                  </span>
                </div>
                <p className="text-neutral-500 text-[11px] mt-0.5">
                  Database Type: {site.type} • Subscriptions: KES 150/mo
                </p>
              </div>

              <div className="flex items-center gap-3">
                {site.googleSheetUrl ? (
                  <a
                    href={site.googleSheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Open Sheet</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-neutral-400 text-xs font-medium">No Sheet Linked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Standalone Google Sheet Creator */}
      <div className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-4">
        <h3 className="font-heading font-extrabold text-base text-neutral-900">
          Quick Google Spreadsheet Provisioner
        </h3>
        <p className="text-xs text-neutral-600">
          Generate an instant formatted Google Sheet with schema tabs for your business, hostel, cafe, or portfolio.
        </p>

        {createdSheetUrl && (
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Spreadsheet created successfully!
            </span>
            <a
              href={createdSheetUrl}
              target="_blank"
              rel="noreferrer"
              className="underline flex items-center gap-1"
            >
              Open in Google Sheets <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {['Restaurant Menu & Orders', 'Hostel Rooms & Bookings', 'Developer Portfolio', 'Tutor Classes', 'Store Inventory'].map(
            (label) => (
              <button
                key={label}
                disabled={isCreatingSheet}
                onClick={() => handleCreateNewSheet(label)}
                className="px-4 py-2 bg-white hover:bg-emerald-50 hover:border-emerald-300 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-600" />
                <span>Create {label}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
