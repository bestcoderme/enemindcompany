import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Sparkles,
  Building,
  Flag,
  RotateCcw,
} from 'lucide-react';
import { Opportunity, OpportunityReport } from '../../../types/opportunities';
import { OpportunityService } from '../../../services/opportunities/opportunityService';

interface AdminOpportunityPortalProps {
  opportunities: Opportunity[];
  onRefresh: () => void;
  onOpenCreateModal: () => void;
  onOpenEditModal: (opp: Opportunity) => void;
  onSelectOpportunity: (opp: Opportunity) => void;
}

export const AdminOpportunityPortal: React.FC<AdminOpportunityPortalProps> = ({
  opportunities,
  onRefresh,
  onOpenCreateModal,
  onOpenEditModal,
  onSelectOpportunity,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'reports'>('listings');
  const reports = OpportunityService.getAllReports();
  const stats = OpportunityService.getAdminStats();

  const handleToggleVerify = (opp: Opportunity) => {
    if (opp.verified) {
      OpportunityService.unverifyOpportunity(opp.id);
    } else {
      OpportunityService.verifyOpportunity(opp.id, 'Admin Authority');
    }
    onRefresh();
  };

  const handleToggleFeatured = (opp: Opportunity) => {
    OpportunityService.featureOpportunity(opp.id, !opp.featured);
    onRefresh();
  };

  const handleDelete = (oppId: string) => {
    if (window.confirm('Are you sure you want to permanently delete this opportunity listing?')) {
      OpportunityService.deleteOpportunity(oppId);
      onRefresh();
    }
  };

  const handleResolveReport = (reportId: string, action: 'dismiss' | 'archive_opportunity') => {
    OpportunityService.resolveReport(reportId, action);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Top Admin Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Admin & Verification Portal
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-100 mt-1">
            Opportunity Engine Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify official listings, audit reported links, and manage student discovery pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Opportunity</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold">Total Listings</span>
          <span className="text-xl sm:text-2xl font-black text-slate-100 block mt-1">
            {stats.totalOpportunities}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified
          </span>
          <span className="text-xl sm:text-2xl font-black text-emerald-400 block mt-1">
            {stats.verifiedCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Unverified
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 block mt-1">
            {stats.unverifiedCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20">
          <span className="text-xs text-sky-400 font-semibold">Scholarships</span>
          <span className="text-xl sm:text-2xl font-black text-sky-400 block mt-1">
            {stats.scholarshipsCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
          <span className="text-xs text-indigo-400 font-semibold">Attachments</span>
          <span className="text-xl sm:text-2xl font-black text-indigo-400 block mt-1">
            {stats.attachmentsCount}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20">
          <span className="text-xs text-rose-400 font-semibold flex items-center gap-1">
            <Flag className="w-3.5 h-3.5" />
            Reports Queue
          </span>
          <span className="text-xl sm:text-2xl font-black text-rose-400 block mt-1">
            {stats.pendingReportsCount}
          </span>
        </div>
      </div>

      {/* Tabs Switcher: Listings vs Reports */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'listings'
              ? 'bg-sky-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Listings ({opportunities.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            activeTab === 'reports'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Moderation & Reports Queue ({stats.pendingReportsCount})
        </button>
      </div>

      {/* TAB 1: ALL LISTINGS */}
      {activeTab === 'listings' && (
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Title & Organization</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Verification</th>
                  <th className="p-3.5">Featured</th>
                  <th className="p-3.5">Source</th>
                  <th className="p-3.5 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {opportunities.map((opp) => (
                  <tr key={opp.id} className="hover:bg-slate-850/50 transition-colors">
                    <td className="p-3.5 max-w-xs">
                      <div
                        onClick={() => onSelectOpportunity(opp)}
                        className="font-bold text-slate-100 hover:text-sky-400 cursor-pointer line-clamp-1"
                      >
                        {opp.title}
                      </div>
                      <div className="text-[11px] text-slate-400">{opp.organization}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-400">
                        {opp.type}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleVerify(opp)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                          opp.verified
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        }`}
                      >
                        {opp.verified ? (
                          <>
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verified
                          </>
                        ) : (
                          <>
                            <ShieldAlert className="w-3.5 h-3.5" />
                            Unverified (Click to verify)
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(opp)}
                        className={`p-1.5 rounded-lg border text-[11px] font-semibold transition-colors ${
                          opp.featured
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-800 text-slate-500 border-slate-700 hover:text-slate-300'
                        }`}
                        title={opp.featured ? 'Featured listing' : 'Mark as featured'}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </td>

                    <td className="p-3.5 text-slate-400 max-w-xs truncate">
                      {opp.source}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenEditModal(opp)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                          title="Edit Opportunity"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(opp.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                          title="Delete Opportunity"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REPORTS & MODERATION */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-200">
                All Reports Clear
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                No active student moderation reports in the queue.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep) => {
                const targetOpp = opportunities.find((o) => o.id === rep.opportunityId);
                return (
                  <div
                    key={rep.id}
                    className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-rose-500/20 text-rose-300">
                          {rep.reason.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500">
                          Status: <strong className="capitalize text-slate-300">{rep.status}</strong>
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-200">
                        Listing: {targetOpp?.title || rep.opportunityId}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Student Note: "{rep.details}"
                      </p>
                      <span className="text-[11px] text-slate-500 mt-1 block">
                        Reported by: {rep.studentEmail}
                      </span>
                    </div>

                    {rep.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleResolveReport(rep.id, 'dismiss')}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        >
                          Dismiss Report
                        </button>
                        <button
                          type="button"
                          onClick={() => handleResolveReport(rep.id, 'archive_opportunity')}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                        >
                          Archive Opportunity
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
