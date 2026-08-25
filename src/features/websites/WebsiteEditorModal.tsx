/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Globe,
  FileSpreadsheet,
  Palette,
  Layers,
  Settings,
  ShieldAlert,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  RefreshCw,
  ExternalLink,
  Save,
  CheckCircle2,
  Inbox,
  Lock,
  Unlock,
  Sliders,
  ChevronRight,
  Layout,
  Menu as MenuIcon,
} from 'lucide-react';
import {
  WebsiteModel,
  WebsitePage,
  WebsiteSection,
  SectionType,
  SheetColumnMapping,
  PublicFieldRule,
} from '../../types/website';
import { websiteBuilderService } from '../../services/website/websiteBuilderService';
import { domainService } from '../../services/website/domainService';
import { pricingService } from '../../services/pricing/pricingService';
import { subscriptionService } from '../../services/subscription/subscriptionService';

interface WebsiteEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  website: WebsiteModel;
  onWebsiteUpdated: (updated: WebsiteModel) => void;
  onPreview: (site: WebsiteModel) => void;
}

type EditorTab =
  | 'PAGES'
  | 'DATABASE'
  | 'DESIGN'
  | 'NAVIGATION'
  | 'SEO'
  | 'INBOX'
  | 'SETTINGS';

export const WebsiteEditorModal: React.FC<WebsiteEditorModalProps> = ({
  isOpen,
  onClose,
  website: initialWebsite,
  onWebsiteUpdated,
  onPreview,
}) => {
  const [website, setWebsite] = useState<WebsiteModel>({ ...initialWebsite });
  const [activeTab, setActiveTab] = useState<EditorTab>('PAGES');
  const [activePageId, setActivePageId] = useState<string>(
    initialWebsite.pages[0]?.id || ''
  );
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    initialWebsite.pages[0]?.sections[0]?.id || null
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<boolean>(false);

  // New Page creation state
  const [isAddingPage, setIsAddingPage] = useState<boolean>(false);
  const [newPageTitle, setNewPageTitle] = useState<string>('');
  const [newPageSlug, setNewPageSlug] = useState<string>('');

  if (!isOpen) return null;

  const activePage =
    website.pages.find((p) => p.id === activePageId) || website.pages[0];
  const selectedSection = activePage?.sections.find(
    (s) => s.id === selectedSectionId
  );

  const handleSave = (updatedSite: WebsiteModel = website) => {
    const saved = websiteBuilderService.saveWebsite(updatedSite);
    setWebsite(saved);
    onWebsiteUpdated(saved);
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handlePublishToggle = () => {
    if (website.status === 'ACTIVE') {
      const draft = websiteBuilderService.unpublishWebsite(website.id);
      if (draft) {
        setWebsite(draft);
        onWebsiteUpdated(draft);
      }
    } else {
      const pubResult = websiteBuilderService.publishWebsite(website.id);
      if (pubResult.success && pubResult.website) {
        setWebsite(pubResult.website);
        onWebsiteUpdated(pubResult.website);
        alert('Website published successfully!');
      } else {
        alert(pubResult.error || 'Failed to publish');
      }
    }
  };

  const handleSyncWithSheet = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await websiteBuilderService.syncWithGoogleSheet(website.id);
      setSyncFeedback(res.message);
      if (res.success) {
        const refreshed = websiteBuilderService.getWebsiteById(website.id);
        if (refreshed) {
          setWebsite(refreshed);
          onWebsiteUpdated(refreshed);
        }
      }
    } catch (e: any) {
      setSyncFeedback(`Sync failed: ${e?.message || 'Check credentials'}`);
    } finally {
      setIsSyncing(false);
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  // Section operations
  const handleAddSection = (type: SectionType) => {
    if (!activePage) return;
    const newSection: WebsiteSection = {
      id: `sec_${type.toLowerCase()}_${Date.now()}`,
      type,
      title: `${type.charAt(0) + type.slice(1).toLowerCase()} Section`,
      subtitle: 'Add details and descriptions here',
      isVisible: true,
      order: activePage.sections.length,
      content: {
        headline: `${type} Title`,
        text: 'Detailed description for your visitors.',
      },
    };

    const updatedPages = website.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, sections: [...p.sections, newSection] };
      }
      return p;
    });

    const updatedWebsite = { ...website, pages: updatedPages };
    handleSave(updatedWebsite);
    setSelectedSectionId(newSection.id);
  };

  const handleMoveSection = (sectionId: string, direction: 'UP' | 'DOWN') => {
    if (!activePage) return;
    const sections = [...activePage.sections];
    const index = sections.findIndex((s) => s.id === sectionId);
    if (index === -1) return;

    if (direction === 'UP' && index > 0) {
      const temp = sections[index];
      sections[index] = sections[index - 1];
      sections[index - 1] = temp;
    } else if (direction === 'DOWN' && index < sections.length - 1) {
      const temp = sections[index];
      sections[index] = sections[index + 1];
      sections[index + 1] = temp;
    }

    const reordered = sections.map((s, i) => ({ ...s, order: i }));
    const updatedPages = website.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, sections: reordered };
      }
      return p;
    });

    handleSave({ ...website, pages: updatedPages });
  };

  const handleDeleteSection = (sectionId: string) => {
    if (!activePage) return;
    const updatedSections = activePage.sections.filter((s) => s.id !== sectionId);
    const updatedPages = website.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, sections: updatedSections };
      }
      return p;
    });
    handleSave({ ...website, pages: updatedPages });
    if (selectedSectionId === sectionId) {
      setSelectedSectionId(updatedSections[0]?.id || null);
    }
  };

  const handleSectionContentChange = (key: string, value: any) => {
    if (!activePage || !selectedSection) return;

    const updatedSections = activePage.sections.map((s) => {
      if (s.id === selectedSection.id) {
        return {
          ...s,
          content: { ...s.content, [key]: value },
        };
      }
      return s;
    });

    const updatedPages = website.pages.map((p) => {
      if (p.id === activePage.id) {
        return { ...p, sections: updatedSections };
      }
      return p;
    });

    const updatedSite = { ...website, pages: updatedPages };
    setWebsite(updatedSite);
    onWebsiteUpdated(updatedSite);
  };

  // Add Page
  const handleCreatePage = () => {
    if (!newPageTitle.trim()) return;
    const cleanSlug = domainService.sanitizeSlug(newPageSlug || newPageTitle);
    const newPage: WebsitePage = {
      id: `page_${Date.now()}`,
      title: newPageTitle,
      slug: cleanSlug,
      navLabel: newPageTitle,
      layout: 'STANDARD',
      sections: [
        {
          id: `sec_hero_${Date.now()}`,
          type: 'HERO',
          title: newPageTitle,
          subtitle: `Welcome to the ${newPageTitle} page`,
          isVisible: true,
          order: 0,
          content: { headline: newPageTitle, tagline: `Explore ${newPageTitle}` },
        },
      ],
      isPublished: true,
      isCustom: true,
      order: website.pages.length,
    };

    const updatedPages = [...website.pages, newPage];
    const updatedNav = [
      ...website.navigation,
      { id: `nav_${newPage.id}`, label: newPageTitle, path: `/${cleanSlug}`, isVisible: true, order: website.navigation.length },
    ];

    const updatedSite = { ...website, pages: updatedPages, navigation: updatedNav };
    handleSave(updatedSite);
    setActivePageId(newPage.id);
    setSelectedSectionId(newPage.sections[0]?.id || null);
    setIsAddingPage(false);
    setNewPageTitle('');
    setNewPageSlug('');
  };

  // Form Submissions Query
  const formSubmissionsKey = `enemind_forms_${website.id}`;
  const submissions: any[] = JSON.parse(
    localStorage.getItem(formSubmissionsKey) || '[]'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/80 backdrop-blur-sm overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="bg-white w-full max-w-6xl h-[92vh] rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
      >
        {/* TOP APP BAR */}
        <div className="px-6 py-3.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-black">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-neutral-900">
                  {website.name}
                </h3>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    website.status === 'ACTIVE'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {website.status}
                </span>
                {website.isDevelopmentMode && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                    Free Dev Mode
                  </span>
                )}
              </div>
              <a
                href={website.publishedUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-neutral-500 hover:text-emerald-700 font-medium flex items-center gap-1"
              >
                <span>{website.publishedUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saveFeedback && (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 mr-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <button
              onClick={() => onPreview(website)}
              className="px-3.5 py-2 rounded-xl bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Live Preview</span>
            </button>
            <button
              onClick={handlePublishToggle}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                website.status === 'ACTIVE'
                  ? 'bg-neutral-800 hover:bg-neutral-900 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {website.status === 'ACTIVE' ? 'Unpublish' : 'Publish Website'}
            </button>
            <button
              onClick={() => handleSave()}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-neutral-200 hover:bg-neutral-300 flex items-center justify-center text-neutral-600 transition-colors ml-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="px-6 bg-white border-b border-neutral-200 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: 'PAGES', label: 'Pages & Sections', icon: Layers },
            { id: 'DATABASE', label: 'Google Sheet CMS', icon: FileSpreadsheet },
            { id: 'DESIGN', label: 'Design & Theme', icon: Palette },
            { id: 'NAVIGATION', label: 'Menu & Nav', icon: MenuIcon },
            { id: 'SEO', label: 'SEO & Domain', icon: Sliders },
            { id: 'INBOX', label: `Inbox (${submissions.length})`, icon: Inbox },
            { id: 'SETTINGS', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as EditorTab)}
                className={`py-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB CONTENTS */}
        <div className="flex-1 overflow-y-auto bg-neutral-100/60 p-4 sm:p-6">
          {/* TAB 1: PAGES & SECTIONS */}
          {activeTab === 'PAGES' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
              {/* Left Column: Pages List & Sections Hierarchy */}
              <div className="md:col-span-4 space-y-4">
                {/* Pages Selector */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Website Pages
                    </p>
                    <button
                      onClick={() => setIsAddingPage(true)}
                      className="text-xs text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Page
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {website.pages.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePageId(p.id);
                          setSelectedSectionId(p.sections[0]?.id || null);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          activePageId === p.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800'
                        }`}
                      >
                        <span className="truncate">{p.title}</span>
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded ${
                            activePageId === p.id ? 'bg-emerald-700 text-white' : 'text-neutral-400'
                          }`}
                        >
                          /{p.slug}
                        </span>
                      </button>
                    ))}
                  </div>

                  {isAddingPage && (
                    <div className="mt-3 pt-3 border-t border-neutral-200 space-y-2">
                      <input
                        type="text"
                        placeholder="Page Title (e.g. Services)"
                        value={newPageTitle}
                        onChange={(e) => setNewPageTitle(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Slug (e.g. services)"
                        value={newPageSlug}
                        onChange={(e) => setNewPageSlug(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg border text-xs"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleCreatePage}
                          className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Create
                        </button>
                        <button
                          onClick={() => setIsAddingPage(false)}
                          className="px-3 py-1 bg-neutral-200 text-neutral-700 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sections List for Active Page */}
                <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
                      Page Sections ({activePage?.sections.length || 0})
                    </p>
                  </div>

                  <div className="space-y-2">
                    {activePage?.sections.map((sec, idx) => (
                      <div
                        key={sec.id}
                        onClick={() => setSelectedSectionId(sec.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-all cursor-pointer ${
                          selectedSectionId === sec.id
                            ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20 font-bold text-neutral-900'
                            : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="w-5 h-5 rounded-md bg-neutral-200 text-neutral-600 text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="truncate">{sec.title || sec.type}</span>
                        </div>

                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            disabled={idx === 0}
                            onClick={() => handleMoveSection(sec.id, 'UP')}
                            className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            disabled={idx === (activePage?.sections.length || 1) - 1}
                            onClick={() => handleMoveSection(sec.id, 'DOWN')}
                            className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sec.id)}
                            className="p-1 text-neutral-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Section Buttons */}
                  <div className="mt-4 pt-3 border-t border-neutral-200">
                    <p className="text-[11px] font-bold text-neutral-500 mb-2">Add Section</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {['HERO', 'ABOUT', 'MENU', 'ROOMS', 'PRODUCTS', 'PORTFOLIO', 'SERVICES', 'CONTACT', 'FAQS', 'TESTIMONIALS'].map(
                        (type) => (
                          <button
                            key={type}
                            onClick={() => handleAddSection(type as SectionType)}
                            className="text-left px-2.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-emerald-50 hover:text-emerald-800 text-[11px] font-bold text-neutral-700 transition-colors cursor-pointer"
                          >
                            + {type}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Section Content Editor */}
              <div className="md:col-span-8">
                {selectedSection ? (
                  <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-600">
                          {selectedSection.type} Section
                        </span>
                        <h4 className="font-heading font-extrabold text-base text-neutral-900 mt-1">
                          Edit Section Content
                        </h4>
                      </div>
                      <span className="text-xs text-neutral-400">
                        {activePage.title} &gt; {selectedSection.title}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={selectedSection.title || ''}
                          onChange={(e) => {
                            const updated = { ...selectedSection, title: e.target.value };
                            const updatedSecs = activePage.sections.map((s) =>
                              s.id === selectedSection.id ? updated : s
                            );
                            const updatedPages = website.pages.map((p) =>
                              p.id === activePage.id ? { ...p, sections: updatedSecs } : p
                            );
                            setWebsite({ ...website, pages: updatedPages });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-800 mb-1">
                          Subtitle / Supporting Text
                        </label>
                        <input
                          type="text"
                          value={selectedSection.subtitle || ''}
                          onChange={(e) => {
                            const updated = { ...selectedSection, subtitle: e.target.value };
                            const updatedSecs = activePage.sections.map((s) =>
                              s.id === selectedSection.id ? updated : s
                            );
                            const updatedPages = website.pages.map((p) =>
                              p.id === activePage.id ? { ...p, sections: updatedSecs } : p
                            );
                            setWebsite({ ...website, pages: updatedPages });
                          }}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                        />
                      </div>

                      {/* Content Fields Dynamic */}
                      {selectedSection.content?.headline !== undefined && (
                        <div>
                          <label className="block text-xs font-bold text-neutral-800 mb-1">
                            Headline
                          </label>
                          <input
                            type="text"
                            value={selectedSection.content.headline || ''}
                            onChange={(e) => handleSectionContentChange('headline', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      )}

                      {selectedSection.content?.story !== undefined && (
                        <div>
                          <label className="block text-xs font-bold text-neutral-800 mb-1">
                            Story / Main Description
                          </label>
                          <textarea
                            rows={4}
                            value={selectedSection.content.story || ''}
                            onChange={(e) => handleSectionContentChange('story', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      )}

                      {selectedSection.content?.coverImage !== undefined && (
                        <div>
                          <label className="block text-xs font-bold text-neutral-800 mb-1">
                            Cover Image URL (Unsplash or Google Drive)
                          </label>
                          <input
                            type="text"
                            value={selectedSection.content.coverImage || ''}
                            onChange={(e) => handleSectionContentChange('coverImage', e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium focus:bg-white focus:border-emerald-500 focus:outline-hidden"
                          />
                        </div>
                      )}

                      {selectedSection.content?.ctaPrimaryText !== undefined && (
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-neutral-800 mb-1">
                              CTA Button Label
                            </label>
                            <input
                              type="text"
                              value={selectedSection.content.ctaPrimaryText || ''}
                              onChange={(e) => handleSectionContentChange('ctaPrimaryText', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-neutral-800 mb-1">
                              CTA Target Link / Section
                            </label>
                            <input
                              type="text"
                              value={selectedSection.content.ctaPrimaryAction || ''}
                              onChange={(e) => handleSectionContentChange('ctaPrimaryAction', e.target.value)}
                              className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-12 rounded-2xl bg-white border border-neutral-200 text-center text-neutral-400">
                    <p className="text-sm font-medium">Select a section to edit its content</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE SHEET DATABASE & CMS */}
          {activeTab === 'DATABASE' && (
            <div className="space-y-6 max-w-4xl">
              {/* Header Sync Card */}
              <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-neutral-900">
                      Connected Google Sheet Database
                    </h4>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {website.googleSheetUrl ? (
                        <a
                          href={website.googleSheetUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-700 hover:underline flex items-center gap-1 font-semibold"
                        >
                          <span>{website.googleSheetUrl}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        'No Google Sheet connected. Create or connect one to use dynamic data.'
                      )}
                    </p>
                    {website.lastSyncedAt && (
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Last synced: {new Date(website.lastSyncedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={isSyncing || !website.googleSheetId}
                    onClick={handleSyncWithSheet}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'Syncing...' : 'Sync Database Now'}</span>
                  </button>
                </div>
              </div>

              {syncFeedback && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  {syncFeedback}
                </div>
              )}

              {/* Public vs Private Field Security Rule Box */}
              <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-emerald-600" />
                    <h5 className="font-heading font-extrabold text-sm text-neutral-900">
                      Public vs. Private Field Security Rules
                    </h5>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    Safe-Sanitization Active
                  </span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  Enemind guarantees that your sensitive business data is never exposed to public website visitors. Columns like <code className="bg-neutral-100 px-1 rounded text-rose-700">Cost</code>, <code className="bg-neutral-100 px-1 rounded text-rose-700">SupplierPhone</code>, <code className="bg-neutral-100 px-1 rounded text-rose-700">ProfitMargin</code>, and <code className="bg-neutral-100 px-1 rounded text-rose-700">InternalNotes</code> remain private to your sheet.
                </p>

                <div className="space-y-3 pt-2">
                  {website.publicFieldRules?.map((rule, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-xs text-neutral-900">
                          Tab: {rule.tabName}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1 mb-1">
                            <Unlock className="w-3 h-3" /> Safe Public Columns
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {rule.safeColumns.map((col) => (
                              <span key={col} className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="text-[11px] font-bold text-rose-700 flex items-center gap-1 mb-1">
                            <Lock className="w-3 h-3" /> Private / Hidden Columns
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {rule.restrictedColumns.map((col) => (
                              <span key={col} className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 text-[10px] font-semibold">
                                {col}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN & THEME */}
          {activeTab === 'DESIGN' && (
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs max-w-3xl space-y-6">
              <h4 className="font-heading font-extrabold text-base text-neutral-900">
                Visual Theme & Typography
              </h4>

              <div>
                <label className="block text-xs font-bold text-neutral-800 mb-2">
                  Color Presets
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'EMERALD_CAMPUS', name: 'Emerald Campus', primary: '#059669', bg: '#FFFFFF' },
                    { id: 'WARM_AMBER', name: 'Warm Amber Bistro', primary: '#D97706', bg: '#FFFFFF' },
                    { id: 'OCEAN_BLUE', name: 'Ocean Sky', primary: '#0284C7', bg: '#FFFFFF' },
                    { id: 'MODERN_DARK', name: 'Developer Dark', primary: '#6366F1', bg: '#0F172A' },
                    { id: 'ROSE_ELEGANCE', name: 'Rose Elegance', primary: '#E11D48', bg: '#FFFFFF' },
                    { id: 'MINIMAL_SLATE', name: 'Minimal Slate', primary: '#475569', bg: '#FFFFFF' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        const updatedTheme = {
                          ...website.theme,
                          themeName: p.id,
                          primaryColor: p.primary,
                          accentColor: p.primary,
                          backgroundColor: p.bg,
                        };
                        const updated = { ...website, theme: updatedTheme };
                        handleSave(updated);
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        website.theme.themeName === p.id
                          ? 'border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/40'
                          : 'border-neutral-200 hover:bg-neutral-50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: p.primary }} />
                      <span className="font-bold text-xs text-neutral-800">{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Custom Primary Hex
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={website.theme.primaryColor}
                      onChange={(e) => {
                        const updated = { ...website, theme: { ...website.theme, primaryColor: e.target.value } };
                        setWebsite(updated);
                      }}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-neutral-300"
                    />
                    <input
                      type="text"
                      value={website.theme.primaryColor}
                      onChange={(e) => {
                        const updated = { ...website, theme: { ...website.theme, primaryColor: e.target.value } };
                        setWebsite(updated);
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Font Hierarchy
                  </label>
                  <select
                    value={website.theme.fontPreset}
                    onChange={(e) => {
                      const updated = { ...website, theme: { ...website.theme, fontPreset: e.target.value as any } };
                      handleSave(updated);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-bold"
                  >
                    <option value="PLUS_JAKARTA">Plus Jakarta Sans & Inter</option>
                    <option value="OUTFIT">Outfit Display & Inter</option>
                    <option value="PLAYFAIR">Playfair Display & Sans</option>
                    <option value="INTER">Clean Inter Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: NAVIGATION */}
          {activeTab === 'NAVIGATION' && (
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs max-w-3xl space-y-4">
              <h4 className="font-heading font-extrabold text-base text-neutral-900">
                Navbar Links & Ordering
              </h4>
              <div className="space-y-2">
                {website.navigation.map((nav, idx) => (
                  <div
                    key={nav.id}
                    className="p-3 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs font-bold"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-400">{idx + 1}.</span>
                      <input
                        type="text"
                        value={nav.label}
                        onChange={(e) => {
                          const updatedNav = website.navigation.map((n) =>
                            n.id === nav.id ? { ...n, label: e.target.value } : n
                          );
                          setWebsite({ ...website, navigation: updatedNav });
                        }}
                        className="px-2 py-1 rounded bg-white border border-neutral-200 text-xs font-bold"
                      />
                      <span className="text-neutral-400 font-mono text-[11px]">{nav.path}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SEO & SUBDOMAIN */}
          {activeTab === 'SEO' && (
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs max-w-3xl space-y-4">
              <h4 className="font-heading font-extrabold text-base text-neutral-900">
                Search Engine Optimization & Custom Domains
              </h4>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Meta Title (Google Search Preview)
                  </label>
                  <input
                    type="text"
                    value={website.seo?.metaTitle || ''}
                    onChange={(e) => {
                      const updated = {
                        ...website,
                        seo: { ...website.seo, metaTitle: e.target.value },
                      };
                      setWebsite(updated);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={website.seo?.metaDescription || ''}
                    onChange={(e) => {
                      const updated = {
                        ...website,
                        seo: { ...website.seo, metaDescription: e.target.value },
                      };
                      setWebsite(updated);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1">
                    Custom Domain (e.g. www.campuschill.co.ke)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter domain (optional)"
                    value={website.customDomain || ''}
                    onChange={(e) => {
                      const updated = { ...website, customDomain: e.target.value };
                      setWebsite(updated);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-medium"
                  />
                  <p className="text-[11px] text-neutral-400 mt-1">
                    Point your CNAME record to <code className="bg-neutral-100 px-1">ingress.enemind.app</code>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INBOX */}
          {activeTab === 'INBOX' && (
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs max-w-4xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading font-extrabold text-base text-neutral-900">
                  Form Submissions & Inquiries ({submissions.length})
                </h4>
              </div>

              {submissions.length === 0 ? (
                <div className="p-12 text-center text-neutral-400">
                  <Inbox className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium">No submissions yet.</p>
                  <p className="text-[11px] text-neutral-400">
                    Visitor contact messages and orders will appear here and sync to your Google Sheet.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {submissions.map((sub: any) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900">
                          {sub.data?.name || sub.data?.customerName || 'Anonymous Visitor'}
                        </span>
                        <span className="text-[10px] font-semibold text-neutral-400">
                          {new Date(sub.submittedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-neutral-600">
                        {sub.data?.phone || sub.data?.email}
                      </p>
                      <p className="text-neutral-800 bg-white p-2 rounded-lg border border-neutral-200/80 mt-2">
                        {sub.data?.message || sub.data?.items || JSON.stringify(sub.data)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: SETTINGS & DANGER ZONE */}
          {activeTab === 'SETTINGS' && (
            <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs max-w-3xl space-y-6">
              <h4 className="font-heading font-extrabold text-base text-neutral-900">
                Website Settings & Lifecycle
              </h4>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-xs text-neutral-900">Campus Life Directory</p>
                  <p className="text-[11px] text-neutral-500">
                    List this website in the Enemind Campus Life directory for students to discover.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={website.isListedInCampusLife}
                  onChange={(e) => {
                    const updated = { ...website, isListedInCampusLife: e.target.checked };
                    handleSave(updated);
                  }}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
              </div>

              {/* Danger Zone */}
              <div className="pt-4 border-t border-rose-100 space-y-3">
                <h5 className="font-bold text-xs text-rose-800 uppercase tracking-wider">
                  Danger Zone
                </h5>
                <div className="flex items-center justify-between p-4 rounded-xl bg-rose-50 border border-rose-200">
                  <div>
                    <p className="font-bold text-xs text-rose-900">Delete Website</p>
                    <p className="text-[11px] text-rose-700">
                      Permanently delete this website. Your connected Google Sheet will remain untouched.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete "${website.name}"?`)) {
                        websiteBuilderService.deleteWebsite(website.id);
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Delete Website
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
