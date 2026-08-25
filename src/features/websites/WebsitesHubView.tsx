/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Plus,
  Search,
  Filter,
  ExternalLink,
  Edit3,
  Eye,
  FileSpreadsheet,
  BarChart3,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ShieldCheck,
  CreditCard,
  Layers,
  ShoppingBag,
  TrendingUp,
} from 'lucide-react';
import { WebsiteModel, WebsiteType } from '../../types/website';
import { websiteBuilderService } from '../../services/website/websiteBuilderService';
import { domainService } from '../../services/website/domainService';
import { pricingService } from '../../services/pricing/pricingService';
import { subscriptionService } from '../../services/subscription/subscriptionService';
import { providerRegistry } from '../../services/providers/providerRegistry';
import { UserProfile } from '../../types/user';
import { CreateWebsiteWizardModal } from './CreateWebsiteWizardModal';
import { WebsiteEditorModal } from './WebsiteEditorModal';
import { PublicWebsiteViewModal } from './PublicWebsiteViewModal';
import { CustomDomainSetupModal } from '../domain/CustomDomainSetupModal';

interface WebsitesHubViewProps {
  user: UserProfile;
}

export const WebsitesHubView: React.FC<WebsitesHubViewProps> = ({ user }) => {
  const [websites, setWebsites] = useState<WebsiteModel[]>(() => {
    return websiteBuilderService.getWebsitesByOwner(user.email || user.id);
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('ALL');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDomainModalOpen, setIsDomainModalOpen] = useState<boolean>(false);
  const [editingWebsite, setEditingWebsite] = useState<WebsiteModel | null>(null);
  const [previewingWebsite, setPreviewingWebsite] = useState<WebsiteModel | null>(null);

  // Syncing tracker
  const [syncingSiteId, setSyncingSiteId] = useState<string | null>(null);

  const isDevMode = providerRegistry.getIsDevelopmentMode();
  const formattedMonthlyPrice = pricingService.getFormattedPrice();

  const refreshWebsites = () => {
    setWebsites(websiteBuilderService.getWebsitesByOwner(user.email || user.id));
  };

  const handleCopyUrl = (url: string, slug: string) => {
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleQuickSync = async (siteId: string) => {
    setSyncingSiteId(siteId);
    try {
      const res = await websiteBuilderService.syncWithGoogleSheet(siteId);
      if (res.success) {
        refreshWebsites();
      } else {
        alert(res.message);
      }
    } catch (e: any) {
      alert('Sync failed');
    } finally {
      setSyncingSiteId(null);
    }
  };

  const filteredWebsites = websites.filter((site) => {
    const matchesSearch =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypeFilter === 'ALL' || site.type === selectedTypeFilter;
    return matchesSearch && matchesType;
  });

  const totalViews = websites.reduce((acc, site) => acc + (site.analytics?.totalViews || 0), 0);
  const activeSubsCount = websites.filter(
    (s) => s.subscriptionStatus === 'ACTIVE' || s.subscriptionStatus === 'DEVELOPMENT'
  ).length;
  const sheetsConnectedCount = websites.filter((s) => Boolean(s.googleSheetId)).length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-black text-2xl sm:text-3xl text-neutral-900 tracking-tight">
              My Websites
            </h1>
            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5" /> WaaS Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Build and manage high-speed websites powered by your personal Google Sheets database for {formattedMonthlyPrice}/month.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => setIsDomainModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span>Domain (enemindcompany.co.ke)</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Website</span>
          </button>
        </div>
      </div>

      {/* Free Development Stack Notice */}
      <div className="p-4 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-xs text-white">Free Development Stack Active</p>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                Zero Infrastructure Cost
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Create unlimited websites, simulate instant M-PESA subscriptions, and sync Google Sheets at zero cost during testing.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            const next = !isDevMode;
            providerRegistry.setDevelopmentMode(next);
            window.location.reload();
          }}
          className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-[11px] font-bold text-neutral-300 border border-neutral-700 transition-colors cursor-pointer"
        >
          {isDevMode ? 'Switch to Production API' : 'Switch to Free Dev Mode'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Total Websites</p>
          <p className="font-heading font-black text-2xl text-neutral-900 mt-1">{websites.length}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Active Subscriptions</p>
          <p className="font-heading font-black text-2xl text-emerald-600 mt-1">{activeSubsCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Google Sheets Connected</p>
          <p className="font-heading font-black text-2xl text-blue-600 mt-1">{sheetsConnectedCount}</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">Total Visitors</p>
          <p className="font-heading font-black text-2xl text-indigo-600 mt-1">{totalViews}</p>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search websites by name or subdomain..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-neutral-200 text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'BUSINESS', 'RESTAURANT', 'HOSTEL', 'PORTFOLIO', 'TUTOR', 'SHOP'].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedTypeFilter(filter)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                selectedTypeFilter === filter
                  ? 'bg-neutral-900 text-white'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              {filter.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Websites Grid */}
      {filteredWebsites.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-neutral-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-extrabold text-base text-neutral-900">
            No websites found
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Create your first website for only {formattedMonthlyPrice}/month and manage content effortlessly from Google Sheets.
          </p>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Website Now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWebsites.map((site) => {
            const hasSheet = Boolean(site.googleSheetId);
            const isSyncingThis = syncingSiteId === site.id;

            return (
              <motion.div
                key={site.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Header & Badges */}
                  <div className="p-5 pb-3 border-b border-neutral-100 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
                          {site.type.replace('_', ' ')}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            site.status === 'ACTIVE'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {site.status}
                        </span>
                      </div>
                      <h3 className="font-heading font-extrabold text-base text-neutral-900 mt-1.5 leading-snug">
                        {site.name}
                      </h3>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {site.isDevelopmentMode ? 'Dev Mode' : `${formattedMonthlyPrice}/mo`}
                      </span>
                    </div>
                  </div>

                  {/* Card Details */}
                  <div className="p-5 space-y-3">
                    {/* Subdomain URL */}
                    <div className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 border border-neutral-200/80 text-xs">
                      <a
                        href={site.publishedUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-700 hover:underline truncate mr-2"
                      >
                        {site.subdomain}.{domainService.getBaseDomain()}
                      </a>
                      <button
                        onClick={() => handleCopyUrl(site.publishedUrl, site.slug)}
                        className="p-1 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                        title="Copy live URL"
                      >
                        {copiedSlug === site.slug ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    {/* Google Sheet status */}
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                        <span className="text-neutral-600 font-medium">Google Sheet:</span>
                      </div>
                      {hasSheet ? (
                        <span className="font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                        </span>
                      ) : (
                        <span className="text-neutral-400 text-[11px]">Not Connected</span>
                      )}
                    </div>

                    {/* Pages count & Analytics */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
                      <span>{site.pages?.length || 0} Pages</span>
                      <span>{site.analytics?.totalViews || 0} Views</span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 bg-neutral-50/80 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingWebsite(site)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setPreviewingWebsite(site)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Preview</span>
                    </button>
                  </div>

                  <button
                    disabled={!hasSheet || isSyncingThis}
                    onClick={() => handleQuickSync(site.id)}
                    className="p-2 rounded-xl bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-600 hover:text-emerald-700 transition-colors cursor-pointer disabled:opacity-40"
                    title="Sync with Google Sheet"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingThis ? 'animate-spin text-emerald-600' : ''}`} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateModalOpen && (
        <CreateWebsiteWizardModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          user={user}
          onWebsiteCreated={(newSite) => {
            refreshWebsites();
          }}
        />
      )}

      {/* EDITOR MODAL */}
      {editingWebsite && (
        <WebsiteEditorModal
          isOpen={Boolean(editingWebsite)}
          onClose={() => setEditingWebsite(null)}
          website={editingWebsite}
          onWebsiteUpdated={(updated) => {
            setEditingWebsite(updated);
            refreshWebsites();
          }}
          onPreview={(site) => {
            setPreviewingWebsite(site);
          }}
        />
      )}

      {/* PUBLIC PREVIEW MODAL */}
      {previewingWebsite && (
        <PublicWebsiteViewModal
          isOpen={Boolean(previewingWebsite)}
          onClose={() => setPreviewingWebsite(null)}
          website={previewingWebsite}
        />
      )}

      {/* CUSTOM DOMAIN SETUP MODAL */}
      <CustomDomainSetupModal
        isOpen={isDomainModalOpen}
        onClose={() => setIsDomainModalOpen(false)}
      />
    </div>
  );
};
