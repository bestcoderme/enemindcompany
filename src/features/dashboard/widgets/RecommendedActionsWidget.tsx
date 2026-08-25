/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { RecommendationService } from '../../../services/intelligence/recommendationService';

interface RecommendedActionsWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const RecommendedActionsWidget: React.FC<RecommendedActionsWidgetProps> = ({
  user,
  onNavigate,
}) => {
  const recommendations = RecommendationService.getRecommendations(user);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Recommended Actions & Next Steps</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Ethical, first-party intelligence</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
            Explainable AI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {recommendations.slice(0, 2).map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {rec.badge || 'Recommended'}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700">
                    {rec.score}% Fit
                  </span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900 mb-1">
                  {rec.title}
                </h4>
                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {rec.rationale}
                </p>
              </div>

              <button
                onClick={() => onNavigate(rec.targetView)}
                className="mt-3 w-full py-1.5 px-3 rounded-lg bg-neutral-900 text-white font-bold text-xs hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1"
              >
                <span>{rec.actionLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
        <span>Transparent first-party matching</span>
        <span className="text-emerald-700 font-semibold">Consent Enabled</span>
      </div>
    </div>
  );
};
