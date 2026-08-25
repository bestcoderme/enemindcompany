/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { Compass, CheckCircle2, ChevronRight, Sparkles, Layers } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface CareerProgressWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const CareerProgressWidget: React.FC<CareerProgressWidgetProps> = ({
  onNavigate,
}) => {
  const currentCareer = 'Cloud Software Engineer';
  const stage = 3;
  const stageName = 'Stage 3: Advanced Specialization';
  const nextMilestone = 'Deploy REST API Microservice on GCP Cloud Run';

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Career Roadmap</h3>
              <p className="text-[11px] text-neutral-500 font-medium truncate max-w-[200px]">
                {currentCareer}
              </p>
            </div>
          </div>
          <Badge variant="blue" size="sm">
            Stage {stage} of 6
          </Badge>
        </div>

        {/* Current milestone highlight */}
        <div className="bg-neutral-50 p-3.5 rounded-xl border border-neutral-100 mb-4">
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-500" />
            <span>Next Recommended Milestone</span>
          </div>
          <p className="text-xs font-bold text-neutral-900 leading-snug">
            {nextMilestone}
          </p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 font-bold">
              Project Lab
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">
              +15% Portfolio Proof Score
            </span>
          </div>
        </div>

        {/* 6-stage mini stepper */}
        <div className="grid grid-cols-6 gap-1.5 mb-2">
          {[1, 2, 3, 4, 5, 6].map((stg) => (
            <div
              key={stg}
              className={`h-1.5 rounded-full ${
                stg < stage
                  ? 'bg-emerald-500'
                  : stg === stage
                  ? 'bg-blue-600'
                  : 'bg-neutral-200'
              }`}
            />
          ))}
        </div>
        <p className="text-[10px] text-neutral-400 font-medium text-right mb-2">
          {stageName}
        </p>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">3 Verified Projects</span>
        <button
          onClick={() => onNavigate('career')}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
        >
          <span>View 6-Stage Roadmap</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
