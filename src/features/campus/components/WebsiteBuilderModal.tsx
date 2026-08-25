/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Globe,
  Layout,
  Palette,
  Eye,
  Save,
  CheckCircle2,
  RefreshCw,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Monitor,
  Tablet,
  Smartphone,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Layers,
  Settings2,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BusinessProfile,
  BusinessWebsite,
  WebsiteSection,
  WebsiteSectionType,
  WebsiteThemeConfig,
} from '../../../types/business';
import { websiteBuilderService } from '../../../services/campus/websiteBuilderService';
import { websiteDataSyncService } from '../../../services/campus/websiteDataSyncService';

interface WebsiteBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: BusinessProfile;
}

export const WebsiteBuilderModal: React.FC<WebsiteBuilderModalProps> = ({
  isOpen,
  onClose,
  business,
}) => {
  const [website, setWebsite] = useState<BusinessWebsite>(() => {
    return (
      websiteBuilderService.getWebsiteByBusinessId(business.id) ||
      websiteBuilderService.generateDefaultWebsiteForBusiness(business)
    );
  });

  const [activeTab, setActiveTab] = useState<'SECTIONS' | 'THEME' | 'SYNC'>('SECTIONS');
  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    website.sections[0]?.id || ''
  );
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const selectedSection = website.sections.find((s) => s.id === selectedSectionId) || website.sections[0];

  const handleUpdateSectionContent = (key: string, value: any) => {
    if (!selectedSection) return;
    const updatedContent = { ...selectedSection.content, [key]: value };
    const updatedSections = website.sections.map((s) =>
      s.id === selectedSection.id ? { ...s, content: updatedContent } : s
    );
    setWebsite((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleToggleSectionVisibility = (secId: string) => {
    const updatedSections = website.sections.map((s) =>
      s.id === secId ? { ...s, isVisible: !s.isVisible } : s
    );
    setWebsite((prev) => ({ ...prev, sections: updatedSections }));
  };

  const handleMoveSection = (index: number, direction: 'UP' | 'DOWN') => {
    const targetIdx = direction === 'UP' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= website.sections.length) return;

    const reordered = [...website.sections];
    const temp = reordered[index];
    reordered[index] = reordered[targetIdx];
    reordered[targetIdx] = temp;

    const final = reordered.map((s, i) => ({ ...s, order: i }));
    setWebsite((prev) => ({ ...prev, sections: final }));
  };

  const handleSaveAndPublish = () => {
    setIsSaving(true);
    websiteBuilderService.updateWebsite(business.id, {
      ...website,
      isPublished: true,
    });
    setTimeout(() => {
      setIsSaving(false);
    }, 600);
  };

  const handleTriggerSync = async () => {
    setIsSyncing(true);
    setSyncStatusMsg('Reading Google Sheet Database & syncing to website...');
    try {
      const log = await websiteDataSyncService.syncSheetToWebsite(business.id);
      setSyncStatusMsg(`✓ ${log.details}`);
      // Refresh local website
      const fresh = websiteBuilderService.getWebsiteByBusinessId(business.id);
      if (fresh) setWebsite(fresh);
    } catch (e: any) {
      setSyncStatusMsg(`Sync error: ${e.message || 'Check Sheet connection'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const THEME_COLORS = [
    { name: 'Emerald Campus', primary: '#059669', accent: '#10B981' },
    { name: 'Indigo Corporate', primary: '#4338CA', accent: '#6366F1' },
    { name: 'Sapphire Ocean', primary: '#0284C7', accent: '#38BDF8' },
    { name: 'Amber Bistro', primary: '#D97706', accent: '#F59E0B' },
    { name: 'Rose & Spa', primary: '#E11D48', accent: '#FB7185' },
    { name: 'Slate Obsidian', primary: '#1E293B', accent: '#64748B' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/90 backdrop-blur-xs overflow-hidden">
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        className="bg-neutral-900 rounded-3xl max-w-7xl w-full shadow-2xl overflow-hidden border border-neutral-800 text-neutral-100 h-[95vh] flex flex-col"
      >
        {/* Top App Bar */}
        <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-white font-heading">
                  Website Studio: {business.businessName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  {website.isPublished ? 'Live on Campus' : 'Draft'}
                </span>
              </div>
              <span className="text-[11px] text-neutral-400 font-mono">
                https://{website.slug}.enemind.app
              </span>
            </div>
          </div>

          {/* Center Device Switcher */}
          <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800">
            <button
              onClick={() => setDevicePreview('desktop')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                devicePreview === 'desktop' ? 'bg-neutral-800 text-white' : 'text-neutral-500'
              }`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevicePreview('tablet')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                devicePreview === 'tablet' ? 'bg-neutral-800 text-white' : 'text-neutral-500'
              }`}
              title="Tablet View"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDevicePreview('mobile')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                devicePreview === 'mobile' ? 'bg-neutral-800 text-white' : 'text-neutral-500'
              }`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleTriggerSync}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-bold transition-all flex items-center gap-1.5 border border-neutral-700 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync from Sheet</span>
            </button>

            <button
              onClick={handleSaveAndPublish}
              disabled={isSaving}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Publish Website'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {syncStatusMsg && (
          <div className="bg-emerald-950/80 border-b border-emerald-800 px-4 py-1.5 text-xs text-emerald-300 flex items-center justify-between">
            <span>{syncStatusMsg}</span>
            <button onClick={() => setSyncStatusMsg(null)} className="text-emerald-400 font-bold hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* 3-Panel Main Studio Layout */}
        <div className="flex-1 flex overflow-hidden">
          {/* Panel 1: Left Navigation & Themes (280px) */}
          <div className="w-72 bg-neutral-950 border-r border-neutral-800 flex flex-col shrink-0">
            <div className="flex border-b border-neutral-800 text-xs font-bold">
              <button
                onClick={() => setActiveTab('SECTIONS')}
                className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'SECTIONS' ? 'bg-neutral-900 text-emerald-400 border-b-2 border-emerald-500' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Sections</span>
              </button>
              <button
                onClick={() => setActiveTab('THEME')}
                className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'THEME' ? 'bg-neutral-900 text-emerald-400 border-b-2 border-emerald-500' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Theme</span>
              </button>
              <button
                onClick={() => setActiveTab('SYNC')}
                className={`flex-1 py-2.5 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  activeTab === 'SYNC' ? 'bg-neutral-900 text-emerald-400 border-b-2 border-emerald-500' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Sheet DB</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {activeTab === 'SECTIONS' && (
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 px-1 mb-1">
                    Page Sections (Click to Edit)
                  </div>

                  {website.sections.map((sec, idx) => (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                        selectedSection?.id === sec.id
                          ? 'border-emerald-500/80 bg-emerald-950/40 text-white'
                          : 'border-neutral-800 bg-neutral-900/60 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[10px] font-mono text-neutral-500 w-4">{idx + 1}</span>
                        <div className="truncate">
                          <span className="text-xs font-bold block truncate">{sec.title || sec.type}</span>
                          <span className="text-[9px] text-neutral-500 uppercase">{sec.type}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleMoveSection(idx, 'UP')}
                          disabled={idx === 0}
                          className="p-1 rounded-md text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(idx, 'DOWN')}
                          disabled={idx === website.sections.length - 1}
                          className="p-1 rounded-md text-neutral-400 hover:text-white disabled:opacity-20 cursor-pointer"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleToggleSectionVisibility(sec.id)}
                          className={`p-1 rounded-md text-xs cursor-pointer ${
                            sec.isVisible ? 'text-emerald-400' : 'text-neutral-600'
                          }`}
                          title={sec.isVisible ? 'Visible' : 'Hidden'}
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'THEME' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Color Palette Presets
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {THEME_COLORS.map((col) => (
                        <button
                          key={col.name}
                          onClick={() =>
                            setWebsite((prev) => ({
                              ...prev,
                              theme: {
                                ...prev.theme,
                                primaryColor: col.primary,
                                accentColor: col.accent,
                              },
                            }))
                          }
                          className="p-2.5 rounded-xl border border-neutral-800 bg-neutral-900 text-left hover:border-neutral-700 transition-all flex flex-col gap-1.5 cursor-pointer"
                        >
                          <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: col.primary }} />
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: col.accent }} />
                          </div>
                          <span className="text-[11px] font-bold text-neutral-200">{col.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Font Hierarchy
                    </label>
                    <select
                      value={website.theme?.fontPreset || 'PLUS_JAKARTA'}
                      onChange={(e) =>
                        setWebsite((prev) => ({
                          ...prev,
                          theme: { ...prev.theme, fontPreset: e.target.value as any },
                        }))
                      }
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="PLUS_JAKARTA">Plus Jakarta Sans & Outfit (Modern App)</option>
                      <option value="OUTFIT">Outfit Display & Inter (Bistro/Casual)</option>
                      <option value="INTER">Inter Sans (Clean Tech/Corporate)</option>
                      <option value="PLAYFAIR">Playfair Display (Luxury/Editorial)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
                      Corner Radius Preset
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['md', 'xl', '2xl'].map((rad) => (
                        <button
                          key={rad}
                          onClick={() =>
                            setWebsite((prev) => ({
                              ...prev,
                              theme: { ...prev.theme, radiusPreset: rad as any },
                            }))
                          }
                          className={`py-2 rounded-xl border text-center font-bold text-xs cursor-pointer ${
                            website.theme?.radiusPreset === rad
                              ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                              : 'border-neutral-800 bg-neutral-900 text-neutral-400'
                          }`}
                        >
                          {rad.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'SYNC' && (
                <div className="p-3 bg-neutral-900 rounded-2xl border border-neutral-800 space-y-3 text-xs">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Live Google Sheet Connected</span>
                  </div>
                  <p className="text-neutral-400 text-[11px] leading-relaxed">
                    This website automatically synchronizes prices, rooms, and menu items with your Google Sheet database in Drive.
                  </p>
                  <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-1 text-[10px] font-mono">
                    <div className="text-neutral-500">Sheet ID:</div>
                    <div className="text-neutral-300 truncate">{business.googleSheetId || 'Live Connected Sheet'}</div>
                  </div>
                  <button
                    onClick={handleTriggerSync}
                    disabled={isSyncing}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>Run Full Sync Now</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Panel 2: Center Live Canvas Preview */}
          <div className="flex-1 bg-neutral-950 p-4 overflow-y-auto flex justify-center items-start">
            <div
              className={`bg-white text-neutral-900 rounded-2xl shadow-2xl overflow-y-auto transition-all duration-300 border border-neutral-300 ${
                devicePreview === 'mobile'
                  ? 'w-[375px] min-h-[600px]'
                  : devicePreview === 'tablet'
                  ? 'w-[720px] min-h-[700px]'
                  : 'w-full max-w-4xl min-h-[800px]'
              }`}
            >
              {/* Header Preview */}
              <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={business.logo} alt="Logo" referrerPolicy="no-referrer" className="w-8 h-8 rounded-lg object-cover" />
                  <span className="font-bold text-xs text-neutral-900">{business.businessName}</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {business.campus}
                </span>
              </div>

              {/* Sections Preview */}
              <div className="p-6 space-y-6">
                {website.sections
                  .filter((s) => s.isVisible)
                  .map((sec) => (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        selectedSection?.id === sec.id
                          ? 'border-emerald-500 bg-emerald-50/20'
                          : 'border-transparent hover:border-neutral-200'
                      }`}
                    >
                      {sec.type === 'HERO' && (
                        <div className="space-y-3">
                          <h2 className="text-2xl font-black font-heading text-neutral-900 leading-tight">
                            {sec.content.headline || business.businessName}
                          </h2>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {sec.content.tagline || business.shortDescription}
                          </p>
                          <div className="flex gap-2">
                            <span className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                              {sec.content.ctaPrimaryText || 'Order / Book'}
                            </span>
                            <span className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-700 font-bold text-xs">
                              Contact Us
                            </span>
                          </div>
                        </div>
                      )}

                      {sec.type === 'ABOUT' && (
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-neutral-900 font-heading">About Our Business</h3>
                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {sec.content.description || business.description}
                          </p>
                        </div>
                      )}

                      {sec.type === 'MENU' && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-neutral-900 font-heading">Campus Menu</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {(business.menu || []).slice(0, 4).map((m) => (
                              <div key={m.id} className="p-2 rounded-lg border border-neutral-200 text-xs flex justify-between">
                                <span className="font-bold">{m.name}</span>
                                <span className="text-emerald-700 font-bold">KSh {m.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.type === 'ROOMS' && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-neutral-900 font-heading">Available Rooms</h3>
                          <div className="grid grid-cols-2 gap-2">
                            {(business.roomOptions || []).map((r) => (
                              <div key={r.id} className="p-2.5 rounded-lg border border-neutral-200 text-xs">
                                <div className="font-bold">{r.name}</div>
                                <div className="text-emerald-700 font-bold">KSh {r.priceMonthly}/mo</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.type === 'SERVICES' && (
                        <div className="space-y-3">
                          <h3 className="text-sm font-bold text-neutral-900 font-heading">Services & Pricing</h3>
                          <div className="space-y-1.5">
                            {(business.services || []).map((s) => (
                              <div key={s.id} className="p-2 rounded-lg border border-neutral-200 text-xs flex justify-between">
                                <span>{s.name}</span>
                                <span className="font-bold">KSh {s.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sec.type === 'LOCATION' && (
                        <div className="space-y-1 text-xs text-neutral-600">
                          <h3 className="font-bold text-neutral-900">Location</h3>
                          <p>{business.location} • {business.address}</p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Panel 3: Right Section Inspector (320px) */}
          <div className="w-80 bg-neutral-950 border-l border-neutral-800 p-4 overflow-y-auto space-y-4 shrink-0 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block">
                  Section Inspector
                </span>
                <h3 className="font-bold text-white font-heading text-sm">
                  {selectedSection?.title || selectedSection?.type}
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 font-mono">
                {selectedSection?.type}
              </span>
            </div>

            {selectedSection && (
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Section Display Title
                  </label>
                  <input
                    type="text"
                    value={selectedSection.title || ''}
                    onChange={(e) => {
                      const updated = website.sections.map((s) =>
                        s.id === selectedSection.id ? { ...s, title: e.target.value } : s
                      );
                      setWebsite((prev) => ({ ...prev, sections: updated }));
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {selectedSection.type === 'HERO' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Headline
                      </label>
                      <input
                        type="text"
                        value={selectedSection.content.headline || ''}
                        onChange={(e) => handleUpdateSectionContent('headline', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Tagline / Subtext
                      </label>
                      <textarea
                        rows={3}
                        value={selectedSection.content.tagline || ''}
                        onChange={(e) => handleUpdateSectionContent('tagline', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Primary CTA Button Text
                      </label>
                      <input
                        type="text"
                        value={selectedSection.content.ctaPrimaryText || ''}
                        onChange={(e) => handleUpdateSectionContent('ctaPrimaryText', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                      />
                    </div>
                  </>
                )}

                {selectedSection.type === 'ABOUT' && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                      Business Story & Description
                    </label>
                    <textarea
                      rows={5}
                      value={selectedSection.content.description || ''}
                      onChange={(e) => handleUpdateSectionContent('description', e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-800">
                  <button
                    onClick={() => handleToggleSectionVisibility(selectedSection.id)}
                    className={`w-full py-2 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                      selectedSection.isVisible
                        ? 'border-neutral-700 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
                        : 'border-emerald-600 bg-emerald-950/40 text-emerald-400'
                    }`}
                  >
                    {selectedSection.isVisible ? 'Hide this Section' : 'Show this Section'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
