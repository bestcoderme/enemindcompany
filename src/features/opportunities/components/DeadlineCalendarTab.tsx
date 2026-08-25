import React from 'react';
import {
  Calendar,
  Clock,
  ExternalLink,
  Building,
  AlertTriangle,
  Sparkles,
  CalendarCheck,
} from 'lucide-react';
import { Opportunity, StudentApplicationRecord } from '../../../types/opportunities';
import { DeadlineUtils } from '../../../services/opportunities/deadlineUtils';

interface DeadlineCalendarTabProps {
  allOpportunities: Opportunity[];
  savedOpportunityIds: string[];
  applications: StudentApplicationRecord[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onNavigateToDiscover: () => void;
}

export const DeadlineCalendarTab: React.FC<DeadlineCalendarTabProps> = ({
  allOpportunities,
  savedOpportunityIds,
  applications,
  onSelectOpportunity,
  onNavigateToDiscover,
}) => {
  // Collect all tracked or saved opportunities
  const trackedOppIds = new Set([
    ...savedOpportunityIds,
    ...applications.map((a) => a.opportunityId),
  ]);

  const trackedOpps = allOpportunities.filter((o) => trackedOppIds.has(o.id));

  // Sort chronologically by deadline days remaining
  const sortedTracked = [...trackedOpps].sort((a, b) => {
    const da = DeadlineUtils.getDeadlineInfo(a.deadline).daysRemaining;
    const db = DeadlineUtils.getDeadlineInfo(b.deadline).daysRemaining;
    return da - db;
  });

  const urgentList = sortedTracked.filter((o) => {
    const info = DeadlineUtils.getDeadlineInfo(o.deadline);
    return !info.isExpired && info.daysRemaining >= 0 && info.daysRemaining <= 7;
  });

  const thisMonthList = sortedTracked.filter((o) => {
    const info = DeadlineUtils.getDeadlineInfo(o.deadline);
    return !info.isExpired && info.daysRemaining > 7 && info.daysRemaining <= 30;
  });

  const upcomingList = sortedTracked.filter((o) => {
    const info = DeadlineUtils.getDeadlineInfo(o.deadline);
    return !info.isExpired && info.daysRemaining > 30 && info.daysRemaining < 900;
  });

  const rollingList = sortedTracked.filter((o) => {
    const info = DeadlineUtils.getDeadlineInfo(o.deadline);
    return info.daysRemaining >= 900;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            My Opportunity Deadline Calendar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Key milestones and submission dates for your saved & tracked opportunities.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300">
            {trackedOpps.length} Total Deadlines Monitored
          </span>
        </div>
      </div>

      {/* Empty State */}
      {trackedOpps.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-3">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200 mb-1">
            No Deadlines Tracked Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
            Bookmark or track scholarships and attachments to monitor their closing dates here.
          </p>
          <button
            type="button"
            onClick={onNavigateToDiscover}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition-colors"
          >
            Explore Opportunities
          </button>
        </div>
      )}

      {/* Section 1: Urgent (≤ 7 Days) */}
      {urgentList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">
              Closing Soon (Next 7 Days) — Action Required
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {urgentList.map((opp) => (
              <DeadlineItemCard
                key={opp.id}
                opp={opp}
                onSelect={() => onSelectOpportunity(opp)}
                isUrgent
              />
            ))}
          </div>
        </div>
      )}

      {/* Section 2: This Month */}
      {thisMonthList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Within 30 Days
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {thisMonthList.map((opp) => (
              <DeadlineItemCard
                key={opp.id}
                opp={opp}
                onSelect={() => onSelectOpportunity(opp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Upcoming / Later */}
      {upcomingList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-400" />
            Future Deadlines
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingList.map((opp) => (
              <DeadlineItemCard
                key={opp.id}
                opp={opp}
                onSelect={() => onSelectOpportunity(opp)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Section 4: Rolling Deadlines */}
      {rollingList.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Rolling / Ongoing Opportunities
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rollingList.map((opp) => (
              <DeadlineItemCard
                key={opp.id}
                opp={opp}
                onSelect={() => onSelectOpportunity(opp)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const DeadlineItemCard: React.FC<{
  opp: Opportunity;
  onSelect: () => void;
  isUrgent?: boolean;
}> = ({ opp, onSelect, isUrgent = false }) => {
  const dInfo = DeadlineUtils.getDeadlineInfo(opp.deadline);
  const gcalUrl = DeadlineUtils.generateGoogleCalendarUrl(opp);

  return (
    <div
      className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
        isUrgent
          ? 'bg-rose-500/5 border-rose-500/30 hover:border-rose-500/60'
          : 'bg-slate-900/80 border-slate-800 hover:border-sky-500/40'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-[11px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
            {opp.type}
          </span>
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              isUrgent
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            {dInfo.displayText}
          </span>
        </div>

        <h4
          onClick={onSelect}
          className="text-sm font-bold text-slate-100 hover:text-sky-400 cursor-pointer line-clamp-1"
        >
          {opp.title}
        </h4>
        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
          <Building className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          <span className="truncate">{opp.organization}</span>
        </p>
      </div>

      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <span className="text-xs text-slate-400 font-medium">
          Date: <strong className="text-slate-200">{dInfo.formattedDate}</strong>
        </span>

        <div className="flex items-center gap-2">
          <a
            href={gcalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Add to Google Calendar"
          >
            <Calendar className="w-3 h-3 text-sky-400" />
            <span>Calendar</span>
          </a>

          <button
            type="button"
            onClick={onSelect}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
};
