/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { Layers, Users, TrendingUp, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { AnalyticsService } from '../../../services/analytics/analyticsService';
import { MarketingService } from '../../../services/intelligence/marketingService';

interface CustomerInsightsWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
  onOpenCustomerInsightsModal?: () => void;
}

export const CustomerInsightsWidget: React.FC<CustomerInsightsWidgetProps> = () => {
  const stats = AnalyticsService.getAggregatedAnalytics();
  const segments = MarketingService.getAllSegments();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-blue-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Customer Intelligence & Funnels</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Consented Marketing & Sales Conversion</p>
            </div>
          </div>
          <Badge variant="blue" size="sm">
            Privacy Guarded
          </Badge>
        </div>

        {/* E-Commerce Funnel */}
        <div className="mb-4">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Marketplace Purchase Funnel
          </p>
          <div className="space-y-2">
            {stats.salesFunnel.map((step) => (
              <div key={step.stepNumber} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-neutral-700">{step.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 text-[11px] font-medium">{step.count} events</span>
                    <span className="text-emerald-700 font-bold">{step.conversionRate}%</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${step.overallConversionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top skills in demand */}
        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-100">
          <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">
            Top Skills In Demand by Kenyan Employers
          </p>
          <div className="flex flex-wrap gap-1.5">
            {stats.topRequestedSkills.slice(0, 4).map((s) => (
              <span key={s.skill} className="text-[10px] font-semibold bg-white border border-neutral-200 px-2 py-0.5 rounded-md text-neutral-700">
                {s.skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[10px] text-neutral-400 font-medium">
          Zero exposure of private student records
        </span>
        <Badge variant="neutral" size="sm">
          {segments.length} Active Segments
        </Badge>
      </div>
    </div>
  );
};
