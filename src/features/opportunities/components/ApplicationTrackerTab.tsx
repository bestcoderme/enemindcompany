import React, { useState } from 'react';
import {
  Kanban,
  List,
  Calendar,
  ExternalLink,
  Edit3,
  Trash2,
  Clock,
  Building,
  CheckCircle2,
  XCircle,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  Opportunity,
  StudentApplicationRecord,
  ApplicationStatus,
} from '../../../types/opportunities';
import { DeadlineUtils } from '../../../services/opportunities/deadlineUtils';

interface ApplicationTrackerTabProps {
  applications: StudentApplicationRecord[];
  allOpportunities: Opportunity[];
  onSelectOpportunity: (opportunity: Opportunity) => void;
  onUpdateStatus: (
    oppId: string,
    status: ApplicationStatus,
    notes?: string,
    dates?: { applicationDate?: string; interviewDate?: string; followUpDate?: string }
  ) => void;
  onDeleteApplication: (oppId: string) => void;
  onNavigateToDiscover: () => void;
}

const STAGES: { key: ApplicationStatus; label: string; color: string; bg: string }[] = [
  { key: 'saved', label: 'Saved / Bookmarked', color: 'text-amber-400', bg: 'border-amber-500/30 bg-amber-500/5' },
  { key: 'planning', label: 'In Planning', color: 'text-sky-400', bg: 'border-sky-500/30 bg-sky-500/5' },
  { key: 'applied', label: 'Submitted / Applied', color: 'text-indigo-400', bg: 'border-indigo-500/30 bg-indigo-500/5' },
  { key: 'interview', label: 'In Interview', color: 'text-purple-400', bg: 'border-purple-500/30 bg-purple-500/5' },
  { key: 'accepted', label: 'Accepted / Offer', color: 'text-emerald-400', bg: 'border-emerald-500/30 bg-emerald-500/5' },
  { key: 'rejected', label: 'Not Selected', color: 'text-slate-400', bg: 'border-slate-700 bg-slate-800/30' },
];

export const ApplicationTrackerTab: React.FC<ApplicationTrackerTabProps> = ({
  applications,
  allOpportunities,
  onSelectOpportunity,
  onUpdateStatus,
  onDeleteApplication,
  onNavigateToDiscover,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState('');

  // Map opportunity details for quick lookup
  const oppMap = new Map<string, Opportunity>();
  allOpportunities.forEach((o) => oppMap.set(o.id, o));

  const filteredApps = applications.filter((app) => {
    const opp = oppMap.get(app.opportunityId);
    if (!opp) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      (app.notes || '').toLowerCase().includes(q)
    );
  });

  const getAppsForStage = (stage: ApplicationStatus) => {
    return filteredApps.filter((a) => a.status === stage);
  };

  const handleStartEditNotes = (app: StudentApplicationRecord) => {
    setEditingNotesId(app.opportunityId);
    setTempNotes(app.notes || '');
  };

  const handleSaveNotes = (oppId: string, currentStatus: ApplicationStatus) => {
    onUpdateStatus(oppId, currentStatus, tempNotes);
    setEditingNotesId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header: Controls & Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 flex items-center gap-2">
            <Kanban className="w-5 h-5 text-sky-400" />
            My Application Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Track your applications from bookmark to offer in one place.
          </p>
        </div>

        {/* View mode toggle & search */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search tracked..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'kanban'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'list'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {STAGES.map((stg) => {
          const count = applications.filter((a) => a.status === stg.key).length;
          return (
            <div
              key={stg.key}
              className={`p-3.5 rounded-xl border ${stg.bg} flex flex-col justify-between`}
            >
              <span className="text-xs font-semibold text-slate-300 truncate">
                {stg.label}
              </span>
              <span className={`text-xl sm:text-2xl font-black mt-1 ${stg.color}`}>
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* Empty State if No Tracked Applications */}
      {applications.length === 0 && (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="w-12 h-12 rounded-full bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-200 mb-1">
            No Opportunities Tracked Yet
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-4">
            Discover scholarships, industrial attachments, internships, and jobs to start tracking your application pipeline.
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

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && applications.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {STAGES.map((stg) => {
            const stageApps = getAppsForStage(stg.key);
            return (
              <div
                key={stg.key}
                className="flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-4"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      {stg.label}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[11px] font-bold text-slate-300">
                    {stageApps.length}
                  </span>
                </div>

                {/* Stage Cards List */}
                <div className="flex-1 space-y-3 min-h-[140px]">
                  {stageApps.length === 0 ? (
                    <div className="h-full flex items-center justify-center p-4 border border-dashed border-slate-800/80 rounded-xl text-[11px] text-slate-500 text-center">
                      No items in {stg.label.toLowerCase()}
                    </div>
                  ) : (
                    stageApps.map((app) => {
                      const opp = oppMap.get(app.opportunityId);
                      if (!opp) return null;
                      const dInfo = DeadlineUtils.getDeadlineInfo(opp.deadline);
                      const isEditingThis = editingNotesId === app.opportunityId;

                      return (
                        <div
                          key={app.id}
                          className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-sky-500/40 transition-all shadow-sm flex flex-col justify-between gap-2.5"
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400">
                                {opp.type}
                              </span>
                              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-500" />
                                {dInfo.displayText}
                              </span>
                            </div>

                            <h4
                              onClick={() => onSelectOpportunity(opp)}
                              className="text-xs sm:text-sm font-bold text-slate-100 hover:text-sky-400 cursor-pointer mt-1.5 line-clamp-2"
                            >
                              {opp.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Building className="w-3 h-3 text-slate-500 flex-shrink-0" />
                              <span className="truncate">{opp.organization}</span>
                            </p>
                          </div>

                          {/* Notes view / editor */}
                          {isEditingThis ? (
                            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                              <textarea
                                rows={2}
                                value={tempNotes}
                                onChange={(e) => setTempNotes(e.target.value)}
                                placeholder="Add private notes..."
                                className="w-full p-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setEditingNotesId(null)}
                                  className="px-2 py-1 text-[11px] text-slate-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSaveNotes(opp.id, app.status)}
                                  className="px-2.5 py-1 text-[11px] font-bold rounded bg-sky-600 hover:bg-sky-500 text-white"
                                >
                                  Save
                                </button>
                              </div>
                            </div>
                          ) : (
                            app.notes && (
                              <div
                                onClick={() => handleStartEditNotes(app)}
                                className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-[11px] text-slate-300 italic cursor-pointer hover:bg-slate-900"
                                title="Click to edit notes"
                              >
                                "{app.notes}"
                              </div>
                            )
                          )}

                          {/* Card Footer: Stage Selector & Quick Actions */}
                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1 text-[11px]">
                            {/* Move Stage Selector */}
                            <select
                              aria-label="Change application stage"
                              value={app.status}
                              onChange={(e) =>
                                onUpdateStatus(
                                  opp.id,
                                  e.target.value as ApplicationStatus,
                                  app.notes
                                )
                              }
                              className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[11px] font-medium text-slate-200 focus:outline-none focus:border-sky-500"
                            >
                              {STAGES.map((s) => (
                                <option key={s.key} value={s.key}>
                                  Move to: {s.label}
                                </option>
                              ))}
                            </select>

                            <div className="flex items-center gap-1">
                              {!app.notes && !isEditingThis && (
                                <button
                                  type="button"
                                  onClick={() => handleStartEditNotes(app)}
                                  className="p-1 rounded text-slate-400 hover:text-slate-200"
                                  title="Add notes"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => onDeleteApplication(opp.id)}
                                className="p-1 rounded text-slate-400 hover:text-rose-400"
                                title="Remove from tracker"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST TABLE VIEW */}
      {viewMode === 'list' && applications.length > 0 && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Opportunity</th>
                  <th className="p-3.5">Organization</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Deadline</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Personal Notes</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {filteredApps.map((app) => {
                  const opp = oppMap.get(app.opportunityId);
                  if (!opp) return null;
                  const dInfo = DeadlineUtils.getDeadlineInfo(opp.deadline);

                  return (
                    <tr key={app.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-100">
                        <span
                          onClick={() => onSelectOpportunity(opp)}
                          className="hover:text-sky-400 cursor-pointer"
                        >
                          {opp.title}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300">{opp.organization}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400">
                          {opp.type}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-slate-300 font-medium">
                          {dInfo.displayText}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <select
                          aria-label="Change application status in table"
                          value={app.status}
                          onChange={(e) =>
                            onUpdateStatus(
                              opp.id,
                              e.target.value as ApplicationStatus,
                              app.notes
                            )
                          }
                          className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-700 text-xs font-semibold text-slate-200 capitalize focus:outline-none focus:border-sky-500"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3.5 text-slate-400 italic max-w-xs truncate">
                        {app.notes || '—'}
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onSelectOpportunity(opp)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                            title="View Details"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteApplication(opp.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
