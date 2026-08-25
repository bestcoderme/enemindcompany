import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  ExternalLink,
  Calendar,
  MapPin,
  Sparkles,
  Building,
  DollarSign,
  GraduationCap,
  Briefcase,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  Flag,
  Share2,
  Check,
  FileText,
  ChevronRight,
} from 'lucide-react';
import {
  Opportunity,
  OpportunityMatchResult,
  ApplicationStatus,
  StudentApplicationRecord,
} from '../../../types/opportunities';
import { DeadlineUtils } from '../../../services/opportunities/deadlineUtils';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  matchResult?: OpportunityMatchResult;
  isSaved?: boolean;
  applicationRecord?: StudentApplicationRecord | null;
  onClose: () => void;
  onToggleSave: (oppId: string) => void;
  onUpdateStatus: (
    oppId: string,
    status: ApplicationStatus,
    notes?: string,
    dates?: { applicationDate?: string; interviewDate?: string; followUpDate?: string }
  ) => void;
  onOpenReportModal: (opportunity: Opportunity) => void;
  onViewMatchExplanation?: (opp: Opportunity, match: OpportunityMatchResult) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  matchResult,
  isSaved = false,
  applicationRecord,
  onClose,
  onToggleSave,
  onUpdateStatus,
  onOpenReportModal,
  onViewMatchExplanation,
}) => {
  if (!opportunity) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'tracking'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);
  const [notesInput, setNotesInput] = useState(applicationRecord?.notes || '');
  const [selectedStatus, setSelectedStatus] = useState<ApplicationStatus>(
    applicationRecord?.status || 'saved'
  );
  const [notesSaved, setNotesSaved] = useState(false);

  const deadlineInfo = DeadlineUtils.getDeadlineInfo(opportunity.deadline);
  const googleCalUrl = DeadlineUtils.generateGoogleCalendarUrl(opportunity);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSaveNotes = () => {
    onUpdateStatus(opportunity.id, selectedStatus, notesInput);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  };

  const handleStatusChange = (newStatus: ApplicationStatus) => {
    setSelectedStatus(newStatus);
    onUpdateStatus(opportunity.id, newStatus, notesInput);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div
        id={`modal-opportunity-${opportunity.id}`}
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden"
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-slate-800 bg-slate-900/90">
          <div className="flex-1 pr-2">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {opportunity.type}
              </span>

              {opportunity.verified && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Official Verified Listing
                </span>
              )}

              {matchResult && (
                <button
                  type="button"
                  onClick={() => onViewMatchExplanation?.(opportunity, matchResult)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/25 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  {matchResult.score}% Match Score
                </button>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-bold text-slate-100 mb-1 leading-snug">
              {opportunity.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-300">
              <span className="flex items-center gap-1.5 font-medium text-slate-200">
                <Building className="w-4 h-4 text-slate-400" />
                {opportunity.organization}
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {opportunity.location}
              </span>
              {opportunity.fundingAmount && (
                <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                  <DollarSign className="w-3.5 h-3.5" />
                  {opportunity.fundingAmount}
                </span>
              )}
            </div>
          </div>

          {/* Close & Action buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(opportunity.id)}
              className={`p-2 rounded-xl border transition-all ${
                isSaved
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>

            <button
              type="button"
              onClick={handleCopyLink}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all"
              title="Share / Copy Link"
            >
              {copiedLink ? (
                <Check className="w-5 h-5 text-emerald-400" />
              ) : (
                <Share2 className="w-5 h-5" />
              )}
            </button>

            <button
              id="btn-close-opportunity-modal"
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-800 bg-slate-900/60 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'overview'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Overview & Funding
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('eligibility')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'eligibility'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Academic Requirements & Eligibility
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tracking')}
            className={`py-3 px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all ${
              activeTab === 'tracking'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            My Application Tracker
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: OVERVIEW & FUNDING */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Match Highlights Card */}
              {matchResult && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex-shrink-0">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">
                        {matchResult.tierLabel} ({matchResult.score}% Compatibility)
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {matchResult.explanation}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onViewMatchExplanation?.(opportunity, matchResult)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                  >
                    View Breakdown
                  </button>
                </div>
              )}

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Program Description
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {opportunity.description}
                </p>
              </div>

              {/* Scholarship Coverage Details (if scholarship) */}
              {opportunity.scholarshipDetails && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4" />
                    Scholarship Financial Coverage
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1">Tuition</span>
                      <span className="font-semibold text-slate-200">
                        {opportunity.scholarshipDetails.tuitionCoverage
                          ? '100% Covered'
                          : 'Partial'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1">Accommodation</span>
                      <span className="font-semibold text-slate-200">
                        {opportunity.scholarshipDetails.accommodationCoverage
                          ? 'Included'
                          : 'Not Included'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1">Travel & Flights</span>
                      <span className="font-semibold text-slate-200">
                        {opportunity.scholarshipDetails.travelCoverage
                          ? 'Covered'
                          : 'Self-Funded'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
                      <span className="text-slate-400 block mb-1">Living Stipend</span>
                      <span className="font-semibold text-emerald-400">
                        {opportunity.scholarshipDetails.monthlyStipendAmount || 'Provided'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Key Timeline & Deadlines */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Clock className="w-4 h-4 text-sky-400" />
                    <span>Application Deadline</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {deadlineInfo.formattedDate}
                  </div>
                  <div className="text-xs text-sky-400 font-medium mt-1">
                    {deadlineInfo.displayText}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Calendar className="w-4 h-4 text-teal-400" />
                    <span>Program Duration</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100">
                    {opportunity.duration || 'Not specified'}
                  </div>
                  {opportunity.startDate && (
                    <div className="text-xs text-slate-400 mt-1">
                      Starts: {opportunity.startDate}
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <MapPin className="w-4 h-4 text-indigo-400" />
                    <span>Location & Mode</span>
                  </div>
                  <div className="text-sm font-bold text-slate-100 truncate">
                    {opportunity.location}
                  </div>
                  <div className="text-xs text-indigo-400 font-medium mt-1">
                    {opportunity.remote ? 'Remote / Hybrid Available' : 'On-Site Only'}
                  </div>
                </div>
              </div>

              {/* Verification & Source Authenticity */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start gap-3.5">
                <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-xs">
                  <h4 className="font-bold text-slate-200">
                    Verified Authentic Source
                  </h4>
                  <p className="text-slate-400 mt-1">
                    Source: <strong className="text-slate-300">{opportunity.source}</strong>
                  </p>
                  {opportunity.sourceUrl && (
                    <a
                      href={opportunity.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold mt-1.5"
                    >
                      <span>Visit Official Provider Bulletin</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC REQUIREMENTS & ELIGIBILITY */}
          {activeTab === 'eligibility' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* GPA Requirement Box */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <GraduationCap className="w-5 h-5 text-sky-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-200">
                    GPA Requirement
                  </h4>
                  {opportunity.minimumGPA ? (
                    <p className="text-xs text-slate-300 mt-1">
                      Minimum stated GPA:{' '}
                      <strong className="text-sky-400 text-sm">
                        {opportunity.minimumGPA.toFixed(2)}
                      </strong>{' '}
                      (on 4.0 standard scale).
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 mt-1">
                      No explicit GPA minimum cutoff specified by provider.
                    </p>
                  )}
                </div>
              </div>

              {/* Eligible Programmes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Eligible Academic Programmes
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.eligibleProgrammes && opportunity.eligibleProgrammes.length > 0 ? (
                    opportunity.eligibleProgrammes.map((prog, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        {prog}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      Open to all academic degree programmes.
                    </span>
                  )}
                </div>
              </div>

              {/* Eligible Academic Levels */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Eligible Academic Levels
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.eligibleAcademicLevels &&
                  opportunity.eligibleAcademicLevels.length > 0 ? (
                    opportunity.eligibleAcademicLevels.map((lvl, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-200"
                      >
                        {lvl}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">
                      Open to all undergraduate and graduate levels.
                    </span>
                  )}
                </div>
              </div>

              {/* Required & Preferred Skills */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Required & Preferred Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {opportunity.requiredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-sky-500/15 border border-sky-500/30 text-sky-300"
                    >
                      {skill} (Required)
                    </span>
                  ))}
                  {opportunity.preferredSkills?.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-slate-300"
                    >
                      {skill} (Preferred)
                    </span>
                  ))}
                </div>
              </div>

              {/* Eligible Countries */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Eligible Nationalities / Regions
                </h4>
                <p className="text-xs text-slate-300">
                  Primary Country: <strong>{opportunity.country}</strong>
                  {opportunity.countries && opportunity.countries.length > 0 && (
                    <span className="block text-slate-400 mt-1">
                      Eligible: {opportunity.countries.join(', ')}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: MY APPLICATION TRACKER */}
          {activeTab === 'tracking' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Current Application Status
                </h4>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {(
                    [
                      'saved',
                      'planning',
                      'applied',
                      'interview',
                      'accepted',
                      'rejected',
                    ] as ApplicationStatus[]
                  ).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(status)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold capitalize border transition-all ${
                        selectedStatus === status
                          ? 'bg-sky-600 text-white border-sky-500 shadow-md font-bold'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-850'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                {/* Personal Notes Box */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Personal Application Notes & Deadlines
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Write private notes (e.g. CV version used, interview date, essay focus)..."
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-slate-500">
                      Private to your account.
                    </span>
                    <button
                      type="button"
                      onClick={handleSaveNotes}
                      className="px-4 py-1.5 rounded-lg text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors"
                    >
                      {notesSaved ? 'Saved!' : 'Save Notes'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-900 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={googleCalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Add application deadline to your Google Calendar"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Add to Google Calendar</span>
            </a>

            <button
              type="button"
              onClick={() => onOpenReportModal(opportunity)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
              title="Report outdated, incorrect, or broken opportunity"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="btn-apply-official-portal"
              href={opportunity.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                // Auto mark as planning or prompt to track
                if (selectedStatus === 'saved') {
                  onUpdateStatus(opportunity.id, 'planning');
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <span>APPLY NOW (Official Portal)</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
