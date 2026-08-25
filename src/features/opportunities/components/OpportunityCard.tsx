import React from 'react';
import {
  ShieldCheck,
  Calendar,
  MapPin,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  ExternalLink,
  GraduationCap,
  Briefcase,
  Award,
  DollarSign,
  Info,
  Clock,
  Building,
} from 'lucide-react';
import { Opportunity, OpportunityMatchResult, ApplicationStatus } from '../../../types/opportunities';
import { DeadlineUtils } from '../../../services/opportunities/deadlineUtils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  matchResult?: OpportunityMatchResult;
  isSaved?: boolean;
  applicationStatus?: ApplicationStatus;
  onToggleSave: (oppId: string) => void;
  onSelect: (opportunity: Opportunity) => void;
  onViewMatchExplanation?: (opp: Opportunity, match: OpportunityMatchResult) => void;
  onUpdateStatus?: (oppId: string, status: ApplicationStatus) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  matchResult,
  isSaved = false,
  applicationStatus,
  onToggleSave,
  onSelect,
  onViewMatchExplanation,
  onUpdateStatus,
}) => {
  const deadlineInfo = DeadlineUtils.getDeadlineInfo(opportunity.deadline);

  // Type badge styling
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Scholarship':
        return {
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          icon: <GraduationCap className="w-3.5 h-3.5" />,
        };
      case 'Attachment':
        return {
          bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
          icon: <Briefcase className="w-3.5 h-3.5" />,
        };
      case 'Internship':
        return {
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          icon: <Briefcase className="w-3.5 h-3.5" />,
        };
      case 'Job':
      case 'Graduate Programme':
        return {
          bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
          icon: <Building className="w-3.5 h-3.5" />,
        };
      case 'Fellowship':
      case 'Competition':
        return {
          bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
          icon: <Award className="w-3.5 h-3.5" />,
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
          icon: <Sparkles className="w-3.5 h-3.5" />,
        };
    }
  };

  const typeConfig = getTypeBadge(opportunity.type);

  // Deadline badge styling
  const getDeadlineBadge = () => {
    if (deadlineInfo.isExpired) {
      return 'bg-slate-800 text-slate-400 border-slate-700';
    }
    if (deadlineInfo.badgeVariant === 'red') {
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse';
    }
    if (deadlineInfo.badgeVariant === 'amber') {
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
    return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div
      id={`opp-card-${opportunity.id}`}
      className="group relative flex flex-col justify-between rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-sky-500/40 p-5 transition-all duration-200 hover:shadow-xl hover:shadow-sky-950/20 backdrop-blur-sm"
    >
      <div>
        {/* Top Header: Type, Match Badge & Save Button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Type badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${typeConfig.bg}`}
            >
              {typeConfig.icon}
              {opportunity.type}
            </span>

            {/* Verified badge */}
            {opportunity.verified && (
              <span
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                title={`Verified by ${opportunity.verifiedBy || 'Enemind Verification Office'}`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Verified
              </span>
            )}

            {/* Match score badge (if calculated) */}
            {matchResult && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMatchExplanation?.(opportunity, matchResult);
                }}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                  matchResult.tier === 'strong'
                    ? 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25'
                    : matchResult.tier === 'good'
                    ? 'bg-teal-500/15 text-teal-300 border-teal-500/30 hover:bg-teal-500/25'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
                title="Click to view match explanation"
              >
                <Sparkles className="w-3 h-3 text-sky-400" />
                <span>{matchResult.score}% Match</span>
                <Info className="w-2.5 h-2.5 opacity-70 ml-0.5" />
              </button>
            )}
          </div>

          {/* Bookmark / Save Button */}
          <button
            id={`btn-save-${opportunity.id}`}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(opportunity.id);
            }}
            className={`p-2 rounded-lg border transition-all ${
              isSaved
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 text-amber-400" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Opportunity Title & Organization */}
        <div className="cursor-pointer" onClick={() => onSelect(opportunity)}>
          <h3 className="text-base sm:text-lg font-bold text-slate-100 group-hover:text-sky-400 transition-colors line-clamp-2 mb-1">
            {opportunity.title}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-300 flex items-center gap-1.5 mb-3">
            <Building className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{opportunity.organization}</span>
          </p>
        </div>

        {/* Location & Remote metadata */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {opportunity.location}
          </span>
          {opportunity.remote && (
            <span className="px-1.5 py-0.5 rounded text-[11px] bg-slate-800 text-sky-300 font-medium">
              {opportunity.remote === true ? 'Remote' : typeof opportunity.remote === 'string' ? opportunity.remote.replace('_', ' ') : 'Remote'}
            </span>
          )}
          {opportunity.fundingAmount && (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <DollarSign className="w-3.5 h-3.5" />
              <span className="truncate max-w-[200px]">{opportunity.fundingAmount}</span>
            </span>
          )}
        </div>

        {/* Description summary */}
        <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed mb-3">
          {opportunity.description}
        </p>

        {/* GPA Eligibility Banner if present */}
        {matchResult?.gpaStatus === 'below_requirement' && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Requires min {opportunity.minimumGPA?.toFixed(1)} GPA</span>
          </div>
        )}

        {/* Skills Chips */}
        {opportunity.requiredSkills && opportunity.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.requiredSkills.slice(0, 3).map((skill, idx) => {
              const isMatched = matchResult?.criteriaBreakdown.matchedSkills.includes(skill);
              return (
                <span
                  key={idx}
                  className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${
                    isMatched
                      ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-300'
                  }`}
                >
                  {skill}
                </span>
              );
            })}
            {opportunity.requiredSkills.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-slate-800/50 text-slate-300">
                +{opportunity.requiredSkills.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Deadline & Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Deadline Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-semibold border ${getDeadlineBadge()}`}
          >
            <Clock className="w-3.5 h-3.5" />
            {deadlineInfo.displayText}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Tracker stage quick status */}
          {applicationStatus && applicationStatus !== 'saved' && (
            <span className="text-[11px] font-semibold px-2 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 capitalize">
              {applicationStatus}
            </span>
          )}

          <button
            id={`btn-view-details-${opportunity.id}`}
            type="button"
            onClick={() => onSelect(opportunity)}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors shadow-sm"
          >
            <span>View & Apply</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
