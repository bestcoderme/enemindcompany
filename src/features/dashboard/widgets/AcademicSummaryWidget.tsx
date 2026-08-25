/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { GraduationCap, TrendingUp, Sparkles, ChevronRight, Award } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface AcademicSummaryWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const AcademicSummaryWidget: React.FC<AcademicSummaryWidgetProps> = ({
  user,
  onNavigate,
}) => {
  const currentGpa = 3.78;
  const targetGpa = 3.85;
  const degreeClassification = 'First Class Honours';

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Academic Snapshot</h3>
              <p className="text-[11px] text-neutral-500 font-medium truncate max-w-[200px]">
                {user.course?.name || 'Computer Science'}
              </p>
            </div>
          </div>
          <Badge variant="emerald" size="sm">
            {degreeClassification}
          </Badge>
        </div>

        {/* GPA metrics row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <p className="text-[11px] text-neutral-500 font-medium">Cumulative GPA</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-neutral-900 font-heading">{currentGpa}</span>
              <span className="text-[11px] text-neutral-400 font-bold">/ 4.00</span>
            </div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <p className="text-[11px] text-neutral-500 font-medium">Target Graduation</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-black text-emerald-600 font-heading">{targetGpa}</span>
              <span className="text-[11px] text-neutral-400 font-bold">/ 4.00</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-600 mb-1">
            <span>Trajectory to First Class</span>
            <span className="text-emerald-700 font-bold">94.5%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: '94.5%' }}></div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">Year 3 Semester 2</span>
        <button
          onClick={() => onNavigate('academics')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          <span>Open GPA Simulator</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
