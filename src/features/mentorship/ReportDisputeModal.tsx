/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../../types/user';
import { Booking } from '../../types/mentorship';
import { SafetyModerationService } from '../../services/mentorship/safetyModerationService';
import { X, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ReportDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  booking?: Booking;
}

export const ReportDisputeModal: React.FC<ReportDisputeModalProps> = ({
  isOpen,
  onClose,
  user,
  booking,
}) => {
  const [reason, setReason] = useState<'NO_SHOW' | 'HARASSMENT' | 'MISREPRESENTATION' | 'FRAUD' | 'OTHER'>('NO_SHOW');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      SafetyModerationService.submitReport({
        bookingId: booking?.id,
        reporterId: user.email || 'user_current',
        reporterName: user.name || 'Student',
        reporterRole: 'STUDENT',
        reportedId: booking?.providerId || 'provider_unknown',
        reportedName: booking?.providerName || 'Provider',
        targetType: booking ? 'SESSION' : 'PROVIDER',
        reason,
        description,
      });
      setIsSubmitted(true);
    } catch (err: any) {
      alert(err?.message || 'Failed to submit dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-neutral-200 animate-in fade-in">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h3 className="text-base font-bold text-neutral-900 font-heading">
              Submit Dispute or Safety Report
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h4 className="text-sm font-bold text-neutral-900">Report Received</h4>
            <p className="text-xs text-neutral-500 max-w-xs mx-auto">
              Our safety and dispute team will review this case. If a session did not occur, an automatic refund will be processed.
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-5 py-2 rounded-xl bg-neutral-900 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            {booking && (
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                <span className="font-bold text-neutral-900 block">{booking.sessionTitle}</span>
                <span className="text-neutral-500">Provider: {booking.providerName}</span>
              </div>
            )}

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200 font-semibold"
              >
                <option value="NO_SHOW">Provider Did Not Show Up to Session</option>
                <option value="MISREPRESENTATION">Session Content Did Not Match Description</option>
                <option value="HARASSMENT">Inappropriate Communication or Harassment</option>
                <option value="FRAUD">Payment or Identity Irregularity</option>
                <option value="OTHER">Other Dispute / Issue</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-neutral-700 block mb-1">Detailed Explanation</label>
              <textarea
                required
                rows={3}
                placeholder="Please describe what happened in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-neutral-50 border border-neutral-200"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-neutral-600 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
