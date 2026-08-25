/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { Briefcase, Building2, MapPin, ChevronRight, Bookmark, ArrowUpRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface OpportunityWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const OpportunityWidget: React.FC<OpportunityWidgetProps> = ({
  onNavigate,
}) => {
  const topOpportunities = [
    {
      id: 'opp_1',
      title: 'Safaricom Cloud Engineering Apprenticeship 2026',
      organization: 'Safaricom PLC',
      location: 'Nairobi, Kenya (Hybrid)',
      matchRate: 98,
      type: 'Industrial Attachment',
      deadline: 'in 14 days',
    },
    {
      id: 'opp_2',
      title: 'Equity Bank African Leaders Fellowship',
      organization: 'Equity Group Foundation',
      location: 'East Africa Region',
      matchRate: 94,
      type: 'Scholarship / Fellowship',
      deadline: 'in 5 days',
    },
    {
      id: 'opp_3',
      title: 'KCB Bank Tech Innovation Attachment',
      organization: 'KCB Bank Group',
      location: 'Nairobi HQ',
      matchRate: 91,
      type: 'Internship',
      deadline: 'in 21 days',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Recommended Opportunities</h3>
              <p className="text-[11px] text-neutral-500 font-medium">
                Curated for your course & career roadmap
              </p>
            </div>
          </div>
          <Badge variant="emerald" size="sm">
            3 New Matches
          </Badge>
        </div>

        {/* Opportunity cards list */}
        <div className="space-y-2.5">
          {topOpportunities.map((opp) => (
            <div
              key={opp.id}
              onClick={() => onNavigate('opportunities')}
              className="p-3 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-emerald-200 hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {opp.matchRate}% Match
                  </span>
                  <span className="text-[10px] text-neutral-500 font-medium truncate">
                    {opp.type}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-neutral-900 group-hover:text-emerald-700 transition-colors truncate">
                  {opp.title}
                </h4>
                <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                  <span className="flex items-center gap-1 font-medium truncate">
                    <Building2 className="w-3 h-3 text-neutral-400" />
                    {opp.organization}
                  </span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-[10px] text-amber-700 font-semibold">
                    Closes {opp.deadline}
                  </span>
                </div>
              </div>

              <div className="w-7 h-7 rounded-lg bg-neutral-200/50 flex items-center justify-center text-neutral-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">Showing 3 of 42 opportunities</span>
        <button
          onClick={() => onNavigate('opportunities')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          <span>Explore All Opportunities</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
