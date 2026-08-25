/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { BookOpen, FileText, CheckCircle2, ChevronRight, Download } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface LearningProgressWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const LearningProgressWidget: React.FC<LearningProgressWidgetProps> = ({
  onNavigate,
}) => {
  const currentUnits = [
    { code: 'CS 301', title: 'Distributed Database Systems', progress: 85, files: 12 },
    { code: 'CS 304', title: 'Computer Networks & Security', progress: 60, files: 8 },
    { code: 'CS 308', title: 'Software Engineering Methodologies', progress: 95, files: 14 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Course Units & Notes</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Lecture notes, slides & past papers</p>
            </div>
          </div>
          <Badge variant="emerald" size="sm">
            34 PDFs
          </Badge>
        </div>

        <div className="space-y-3">
          {currentUnits.map((unit) => (
            <div key={unit.code} className="p-3 rounded-xl bg-neutral-50 border border-neutral-100">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800">
                    {unit.code}
                  </span>
                  <span className="text-xs font-bold text-neutral-900 truncate">
                    {unit.title}
                  </span>
                </div>
                <span className="text-[11px] font-bold text-emerald-700">
                  {unit.progress}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${unit.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">Verified Campus Syllabus</span>
        <button
          onClick={() => onNavigate('learning')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          <span>Access All Notes</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
