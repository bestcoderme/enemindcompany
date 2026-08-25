/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Flag, AlertTriangle, ShieldAlert } from 'lucide-react';
import { Course } from '../../types/learning';
import { UserProfile } from '../../types/user';
import { adminEducationService } from '../../services/learning/adminEducationService';

interface SafetyReportModalProps {
  course: Course | null;
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SafetyReportModal: React.FC<SafetyReportModalProps> = ({
  course,
  user,
  isOpen,
  onClose,
}) => {
  const [reason, setReason] = useState<
    'SCAM' | 'MISREPRESENTATION' | 'COPYRIGHT' | 'HARASSMENT' | 'INAPPROPRIATE' | 'SPAM' | 'OTHER'
  >('MISREPRESENTATION');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !course) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    setIsSubmitting(true);
    try {
      adminEducationService.submitSafetyReport({
        reporterId: user?.id || 'usr_default',
        reporterName: user?.name,
        targetType: 'COURSE',
        targetId: course.id,
        targetName: course.title,
        reason,
        details,
      });

      alert('Thank you. Your report has been submitted to the ENEMIND Academic Moderation Committee.');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Report Course or Content</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-neutral-500 mb-4">
          Reporting: <strong className="text-neutral-900">{course.title}</strong> by {course.providerName}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Reason for Report</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as any)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 bg-white focus:outline-hidden"
            >
              <option value="MISREPRESENTATION">Misrepresentation / False Curriculum</option>
              <option value="SCAM">Scam or Financial Fraud</option>
              <option value="COPYRIGHT">Copyright or Stolen Slides</option>
              <option value="INAPPROPRIATE">Inappropriate or Harmful Content</option>
              <option value="SPAM">Spam or Low-Quality AI Dump</option>
              <option value="OTHER">Other Academic Integrity Issue</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Specific Details & Proof</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the issue, timestamp, or reference URL..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
