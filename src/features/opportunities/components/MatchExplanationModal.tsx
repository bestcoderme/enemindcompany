import React from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  GraduationCap,
  Briefcase,
  Globe,
  Compass,
} from 'lucide-react';
import { Opportunity, OpportunityMatchResult } from '../../../types/opportunities';

interface MatchExplanationModalProps {
  opportunity: Opportunity | null;
  matchResult: OpportunityMatchResult | null;
  onClose: () => void;
}

export const MatchExplanationModal: React.FC<MatchExplanationModalProps> = ({
  opportunity,
  matchResult,
  onClose,
}) => {
  if (!opportunity || !matchResult) return null;

  const cb = matchResult.criteriaBreakdown;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Match Score Breakdown
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[280px]">
                {opportunity.title}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Overall Score Badge */}
        <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 block">
              Compatibility Tier
            </span>
            <span className="text-base font-black text-sky-400">
              {matchResult.tierLabel}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-100">
            {matchResult.score}%
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {matchResult.explanation}
        </p>

        {/* Criteria Breakdown Grid */}
        <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
          {/* 1. Programme Match */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Programme & Field Match
                </span>
                <span className="text-[11px] text-slate-400">
                  {cb.programmeMatch ? 'Matches student course/field' : 'General alignment'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-400">
              +{cb.programmeScore} pts
            </span>
          </div>

          {/* 2. Academic Level Match */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Award className="w-4 h-4 text-teal-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Academic Year / Level
                </span>
                <span className="text-[11px] text-slate-400">
                  {cb.academicLevelMatch ? 'Matches student year' : 'General level'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-teal-400">
              +{cb.levelScore} pts
            </span>
          </div>

          {/* 3. GPA Requirement Status */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {cb.gpaEligibility ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-amber-400" />
              )}
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  GPA Eligibility Check
                </span>
                <span className="text-[11px] text-slate-400">
                  {matchResult.gpaMessage}
                </span>
              </div>
            </div>
            <span
              className={`text-xs font-bold ${
                cb.gpaEligibility ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              +{cb.gpaScore} pts
            </span>
          </div>

          {/* 4. Skills Match */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Skills Compatibility
                </span>
                <span className="text-[11px] text-slate-400">
                  {cb.skillMatchCount > 0
                    ? `Matched ${cb.skillMatchCount} skills (${cb.matchedSkills.slice(0, 2).join(', ')})`
                    : 'Standard prerequisite profile'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-indigo-400">
              +{cb.skillScore} pts
            </span>
          </div>

          {/* 5. Country & Regional Eligibility */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Globe className="w-4 h-4 text-sky-400" />
              <div>
                <span className="text-xs font-semibold text-slate-200 block">
                  Location & Nationality
                </span>
                <span className="text-[11px] text-slate-400">
                  {cb.countryEligibility ? 'Eligible region / remote' : 'Regional check'}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-sky-400">
              +{cb.countryScore} pts
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
