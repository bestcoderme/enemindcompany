import React, { useState } from 'react';
import { X, Flag, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Opportunity, ReportReason } from '../../../types/opportunities';
import { OpportunityService } from '../../../services/opportunities/opportunityService';

interface ReportOpportunityModalProps {
  opportunity: Opportunity | null;
  studentEmail: string;
  onClose: () => void;
}

const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'expired', label: 'Deadline Expired / Closed Application' },
  { value: 'broken_link', label: 'Broken or 404 Application Link' },
  { value: 'wrong_info', label: 'Incorrect Eligibility / Details' },
  { value: 'scam', label: 'Suspicious / Potential Scam or Fee Request' },
  { value: 'duplicate', label: 'Duplicate Listing' },
  { value: 'other', label: 'Other Issue' },
];

export const ReportOpportunityModal: React.FC<ReportOpportunityModalProps> = ({
  opportunity,
  studentEmail,
  onClose,
}) => {
  if (!opportunity) return null;

  const [reason, setReason] = useState<ReportReason>('expired');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    OpportunityService.reportOpportunity({
      opportunityId: opportunity.id,
      studentEmail: studentEmail || 'student@enemind.com',
      reason,
      details: details.trim() || `Reported as ${reason}`,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Flag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Report Opportunity
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-[240px]">
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

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h4 className="text-sm font-bold text-slate-100">
              Report Submitted Successfully
            </h4>
            <p className="text-xs text-slate-400">
              Our moderation team will audit this opportunity source immediately. Thank you for keeping Enemind accurate!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Issue Category
              </label>
              <select
                aria-label="Report issue category"
                value={reason}
                onChange={(e) => setReason(e.target.value as ReportReason)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                {REPORT_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Additional Details (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Explain what is inaccurate or provide the correct official link..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                Submit Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
