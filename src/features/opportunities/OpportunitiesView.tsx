import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  Compass,
  GraduationCap,
  Briefcase,
  Building,
  Kanban,
  Calendar,
  ShieldCheck,
  Play,
  Plus,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import {
  Opportunity,
  OpportunityFilterOptions,
  OpportunityMatchResult,
  ApplicationStatus,
  StudentApplicationRecord,
} from '../../types/opportunities';
import { UserProfile, UserRole } from '../../types/user';
import { OpportunityService } from '../../services/opportunities/opportunityService';
import { OpportunityMatchingService, StudentMatchProfile } from '../../services/opportunities/opportunityMatchingService';
import { ApplicationTrackerService } from '../../services/opportunities/applicationTrackerService';
import { DeadlineUtils } from '../../services/opportunities/deadlineUtils';

import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityFilters } from './components/OpportunityFilters';
import { OpportunityDetailModal } from './components/OpportunityDetailModal';
import { ApplicationTrackerTab } from './components/ApplicationTrackerTab';
import { DeadlineCalendarTab } from './components/DeadlineCalendarTab';
import { AdminOpportunityPortal } from './components/AdminOpportunityPortal';
import { MatchExplanationModal } from './components/MatchExplanationModal';
import { ReportOpportunityModal } from './components/ReportOpportunityModal';
import { CreateEditOpportunityModal } from './components/CreateEditOpportunityModal';
import { OpportunityTestsModal } from './components/OpportunityTestsModal';

interface OpportunitiesViewProps {
  user?: UserProfile;
  activeRole?: UserRole;
  onNavigate?: (viewId: string) => void;
}

type MainTab =
  | 'discover'
  | 'recommended'
  | 'scholarships'
  | 'attachments'
  | 'jobs'
  | 'tracker'
  | 'calendar'
  | 'admin';

export const OpportunitiesView: React.FC<OpportunitiesViewProps> = ({
  user,
  activeRole = 'STUDENT',
  onNavigate,
}) => {
  const studentEmail = user?.email || 'student@enemind.com';
  const isAdmin =
    activeRole === 'ENEMIND_ADMIN' ||
    activeRole === 'UNIVERSITY_ADMIN' ||
    activeRole === 'EMPLOYER' ||
    user?.roles?.includes('ENEMIND_ADMIN');

  // State
  const [activeTab, setActiveTab] = useState<MainTab>('discover');
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<StudentApplicationRecord[]>([]);

  // Filter state
  const [filters, setFilters] = useState<OpportunityFilterOptions>({
    searchQuery: '',
    types: [],
    field: 'All',
    academicLevel: 'All Levels',
    deadlineFilter: 'all',
    remoteOnly: false,
    verifiedOnly: false,
    sortBy: 'recommended',
  });

  // Modal states
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<OpportunityMatchResult | null>(null);
  const [isMatchExplanationOpen, setIsMatchExplanationOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetOpp, setReportTargetOpp] = useState<Opportunity | null>(null);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);
  const [isTestsModalOpen, setIsTestsModalOpen] = useState(false);

  // Load Data
  const loadData = () => {
    const opps = OpportunityService.getAllOpportunities();
    setOpportunities(opps);
    const saved = ApplicationTrackerService.getSavedOpportunityIds(studentEmail);
    setSavedIds(saved);
    const apps = ApplicationTrackerService.getAllApplications(studentEmail);
    setApplications(apps);
  };

  useEffect(() => {
    loadData();
  }, [studentEmail]);

  // Extract student profile for matching
  const studentProfile: StudentMatchProfile = useMemo(() => {
    return OpportunityMatchingService.extractStudentProfile(user || null);
  }, [user]);

  // Precalculate match results map
  const matchMap = useMemo(() => {
    const map = new Map<string, OpportunityMatchResult>();
    opportunities.forEach((opp) => {
      const match = OpportunityMatchingService.calculateMatch(opp, studentProfile);
      map.set(opp.id, match);
    });
    return map;
  }, [opportunities, studentProfile]);

  // Handle Saves & Tracking Actions
  const handleToggleSave = (oppId: string) => {
    ApplicationTrackerService.toggleSave(studentEmail, oppId);
    loadData();
  };

  const handleUpdateApplicationStatus = (
    oppId: string,
    status: ApplicationStatus,
    notes?: string,
    dates?: { applicationDate?: string; interviewDate?: string; followUpDate?: string }
  ) => {
    ApplicationTrackerService.setApplicationStatus(
      studentEmail,
      oppId,
      status,
      notes,
      dates
    );
    loadData();
  };

  const handleDeleteApplication = (oppId: string) => {
    ApplicationTrackerService.deleteApplication(studentEmail, oppId);
    loadData();
  };

  // Filtered List Computation based on Active Tab
  const activeOpportunities = useMemo(() => {
    let baseList = [...opportunities];

    if (activeTab === 'recommended') {
      // Rank by match score descending
      baseList = OpportunityMatchingService.rankOpportunities(
        baseList,
        studentProfile
      ).map((r) => r.opportunity);
    } else if (activeTab === 'scholarships') {
      baseList = baseList.filter((o) => o.type === 'Scholarship');
    } else if (activeTab === 'attachments') {
      baseList = baseList.filter(
        (o) => o.type === 'Attachment' || o.type === 'Internship'
      );
    } else if (activeTab === 'jobs') {
      baseList = baseList.filter(
        (o) =>
          o.type === 'Job' ||
          o.type === 'Graduate Programme' ||
          o.type === 'Fellowship'
      );
    }

    // Apply global filters
    return OpportunityService.filterOpportunities({
      ...filters,
      types:
        activeTab === 'discover' || activeTab === 'recommended'
          ? filters.types
          : undefined,
    }).filter((item) => baseList.some((b) => b.id === item.id));
  }, [opportunities, activeTab, filters, studentProfile]);

  // Statistics Summary
  const stats = useMemo(() => {
    const highMatches = opportunities.filter((o) => {
      const m = matchMap.get(o.id);
      return m && m.score >= 70;
    }).length;
    const closingSoon = OpportunityService.getClosingSoon(7).length;
    const totalVerified = opportunities.filter((o) => o.verified).length;
    const activeTracked = applications.length;

    return {
      highMatches,
      closingSoon,
      totalVerified,
      activeTracked,
    };
  }, [opportunities, matchMap, applications]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 shadow-xl backdrop-blur-md">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              Phase 3 Discovery Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {stats.totalVerified} Verified Listings
            </span>
          </div>

          <h1 className="text-xl sm:text-3xl font-black text-slate-100 tracking-tight font-heading">
            Opportunities & Discovery Engine
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Personalized discovery for scholarships, industrial attachments, internships, and graduate programs tailored to your academic profile and GPA.
          </p>
        </div>

        {/* Action Controls in Header */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Run Tests Button */}
          <button
            id="btn-run-opportunity-tests"
            type="button"
            onClick={() => setIsTestsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
            title="Execute automated validation test suite"
          >
            <Play className="w-3.5 h-3.5 text-sky-400" />
            <span>Run Test Suite</span>
          </button>

          {/* Admin Add Opportunity Button */}
          {isAdmin && (
            <button
              id="btn-admin-add-opportunity"
              type="button"
              onClick={() => {
                setEditingOpp(null);
                setIsCreateEditModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post Listing</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar border-b border-slate-800">
        {[
          { key: 'discover', label: 'Explore All', icon: <Compass className="w-4 h-4" /> },
          {
            key: 'recommended',
            label: 'Recommended for You',
            icon: <Sparkles className="w-4 h-4 text-sky-400" />,
            badge: stats.highMatches > 0 ? `${stats.highMatches} High Matches` : undefined,
          },
          { key: 'scholarships', label: 'Scholarships & Grants', icon: <GraduationCap className="w-4 h-4" /> },
          { key: 'attachments', label: 'Industrial Attachments', icon: <Briefcase className="w-4 h-4" /> },
          { key: 'jobs', label: 'Jobs & Fellowships', icon: <Building className="w-4 h-4" /> },
          {
            key: 'tracker',
            label: 'My Pipeline Tracker',
            icon: <Kanban className="w-4 h-4 text-indigo-400" />,
            badge: stats.activeTracked > 0 ? String(stats.activeTracked) : undefined,
          },
          { key: 'calendar', label: 'Deadline Calendar', icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
          ...(isAdmin
            ? [{ key: 'admin', label: 'Admin Portal', icon: <ShieldCheck className="w-4 h-4 text-rose-400" /> }]
            : []),
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              id={`tab-opp-${tab.key}`}
              type="button"
              onClick={() => setActiveTab(tab.key as MainTab)}
              className={`flex-shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                isActive
                  ? 'bg-sky-500/20 text-sky-400 border-sky-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-sky-500 text-slate-950">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB VIEWS */}

      {/* 1. DISCOVERY & SEARCH TABS (Explore, Recommended, Scholarships, Attachments, Jobs) */}
      {(activeTab === 'discover' ||
        activeTab === 'recommended' ||
        activeTab === 'scholarships' ||
        activeTab === 'attachments' ||
        activeTab === 'jobs') && (
        <div className="space-y-6">
          {/* Personalized Matching Context Pill */}
          {activeTab === 'recommended' && (
            <div className="p-4 rounded-2xl bg-sky-950/30 border border-sky-800/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-200">
                    Recommendations for {studentProfile.programmeName} ({studentProfile.academicLevel})
                  </h3>
                  <p className="text-slate-400 mt-0.5">
                    Calculated against your verified {studentProfile.gpa > 0 ? `${studentProfile.gpa.toFixed(2)} GPA` : 'academic profile'} and skill endorsements.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 font-semibold text-slate-300">
                <span>Top Match:</span>
                <span className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 font-bold">
                  {activeOpportunities[0] ? `${matchMap.get(activeOpportunities[0].id)?.score || 95}% Fit` : '100%'}
                </span>
              </div>
            </div>
          )}

          {/* Search & Multi-Filters Component */}
          <OpportunityFilters
            filters={filters}
            onFilterChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
            onResetFilters={() =>
              setFilters({
                searchQuery: '',
                types: [],
                field: 'All',
                academicLevel: 'All Levels',
                deadlineFilter: 'all',
                remoteOnly: false,
                verifiedOnly: false,
                sortBy: 'recommended',
              })
            }
            totalResultsCount={activeOpportunities.length}
          />

          {/* Opportunities Card Grid */}
          {activeOpportunities.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-200 mb-1">
                No Opportunities Found
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
                Try widening your search terms, clearing active filters, or toggling remote options.
              </p>
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    searchQuery: '',
                    types: [],
                    field: 'All',
                    academicLevel: 'All Levels',
                    deadlineFilter: 'all',
                    remoteOnly: false,
                    verifiedOnly: false,
                    sortBy: 'recommended',
                  })
                }
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeOpportunities.map((opp) => {
                const matchRes = matchMap.get(opp.id);
                const isSaved = savedIds.includes(opp.id);
                const appRec = applications.find((a) => a.opportunityId === opp.id);

                return (
                  <OpportunityCard
                    key={opp.id}
                    opportunity={opp}
                    matchResult={matchRes}
                    isSaved={isSaved}
                    applicationStatus={appRec?.status}
                    onToggleSave={handleToggleSave}
                    onSelect={(selected) => setSelectedOpportunity(selected)}
                    onViewMatchExplanation={(selected, match) => {
                      setSelectedOpportunity(selected);
                      setSelectedMatch(match);
                      setIsMatchExplanationOpen(true);
                    }}
                    onUpdateStatus={handleUpdateApplicationStatus}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 2. PIPELINE APPLICATION TRACKER TAB */}
      {activeTab === 'tracker' && (
        <ApplicationTrackerTab
          applications={applications}
          allOpportunities={opportunities}
          onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
          onUpdateStatus={handleUpdateApplicationStatus}
          onDeleteApplication={handleDeleteApplication}
          onNavigateToDiscover={() => setActiveTab('discover')}
        />
      )}

      {/* 3. DEADLINE CALENDAR TAB */}
      {activeTab === 'calendar' && (
        <DeadlineCalendarTab
          allOpportunities={opportunities}
          savedOpportunityIds={savedIds}
          applications={applications}
          onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
          onNavigateToDiscover={() => setActiveTab('discover')}
        />
      )}

      {/* 4. ADMIN & VERIFICATION PORTAL TAB */}
      {activeTab === 'admin' && (
        <AdminOpportunityPortal
          opportunities={opportunities}
          onRefresh={loadData}
          onOpenCreateModal={() => {
            setEditingOpp(null);
            setIsCreateEditModalOpen(true);
          }}
          onOpenEditModal={(opp) => {
            setEditingOpp(opp);
            setIsCreateEditModalOpen(true);
          }}
          onSelectOpportunity={(opp) => setSelectedOpportunity(opp)}
        />
      )}

      {/* ALL MODALS */}

      {/* Detail Modal */}
      {selectedOpportunity && !isMatchExplanationOpen && (
        <OpportunityDetailModal
          opportunity={selectedOpportunity}
          matchResult={matchMap.get(selectedOpportunity.id)}
          isSaved={savedIds.includes(selectedOpportunity.id)}
          applicationRecord={applications.find(
            (a) => a.opportunityId === selectedOpportunity.id
          )}
          onClose={() => setSelectedOpportunity(null)}
          onToggleSave={handleToggleSave}
          onUpdateStatus={handleUpdateApplicationStatus}
          onOpenReportModal={(opp) => {
            setReportTargetOpp(opp);
            setIsReportModalOpen(true);
          }}
          onViewMatchExplanation={(opp, match) => {
            setSelectedMatch(match);
            setIsMatchExplanationOpen(true);
          }}
        />
      )}

      {/* Match Explanation Modal */}
      {isMatchExplanationOpen && selectedOpportunity && selectedMatch && (
        <MatchExplanationModal
          opportunity={selectedOpportunity}
          matchResult={selectedMatch}
          onClose={() => setIsMatchExplanationOpen(false)}
        />
      )}

      {/* Report Opportunity Modal */}
      {isReportModalOpen && reportTargetOpp && (
        <ReportOpportunityModal
          opportunity={reportTargetOpp}
          studentEmail={studentEmail}
          onClose={() => {
            setIsReportModalOpen(false);
            setReportTargetOpp(null);
          }}
        />
      )}

      {/* Create / Edit Opportunity Modal */}
      {isCreateEditModalOpen && (
        <CreateEditOpportunityModal
          initialData={editingOpp}
          authorEmail={studentEmail}
          onClose={() => {
            setIsCreateEditModalOpen(false);
            setEditingOpp(null);
          }}
          onSaved={loadData}
        />
      )}

      {/* Automated Tests Modal */}
      {isTestsModalOpen && (
        <OpportunityTestsModal onClose={() => setIsTestsModalOpen(false)} />
      )}
    </div>
  );
};
