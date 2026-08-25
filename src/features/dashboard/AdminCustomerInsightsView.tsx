/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../../types/user';
import { CustomerInsightProfile, SalesFunnelStep } from '../../types/analytics';
import { AnalyticsService } from '../../services/analytics/analyticsService';
import {
  Users,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  Briefcase,
  BookOpen,
  ShoppingBag,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

interface AdminCustomerInsightsViewProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const AdminCustomerInsightsView: React.FC<AdminCustomerInsightsViewProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('ALL');

  const analytics = AnalyticsService.getAggregatedAnalytics();
  const profiles = AnalyticsService.getCustomerInsightProfiles();

  const filteredProfiles = profiles.filter((p) => {
    if (selectedRoleFilter !== 'ALL' && !p.roles.includes(selectedRoleFilter as any)) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.universityName?.toLowerCase().includes(q) ||
        p.programmeName?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admin Intelligence & Lifecycle
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              Customer Insights & Funnel Telemetry
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl leading-relaxed">
              Consented behavioral segments, monetization funnels & campus engagement metrics.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3.5 py-2 rounded-2xl text-xs text-emerald-300">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">Zero Private Chat/Mark Leakage</span>
          </div>
        </div>
      </div>

      {/* Funnel & Conversion Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marketplace Funnel */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-neutral-900 font-heading">
                Marketplace Sales Funnel
              </h3>
            </div>
            <span className="text-xs font-black text-emerald-700">
              KSh {(analytics.totalRevenueKES / 1000).toFixed(0)}k Gross
            </span>
          </div>

          <div className="space-y-3">
            {analytics.salesFunnel.map((step) => (
              <div key={step.stepNumber} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-neutral-700">{step.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-500 text-[11px] font-medium">{step.count} users</span>
                    <span className="text-emerald-700 font-bold">{step.conversionRate}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-amber-500 to-emerald-500 rounded-full"
                    style={{ width: `${step.overallConversionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Demands */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-sky-600" />
                <h3 className="text-sm font-bold text-neutral-900 font-heading">
                  High-Demand Skills & Careers
                </h3>
              </div>
              <Badge variant="blue" size="sm">
                Industry Align
              </Badge>
            </div>

            <div className="space-y-2 mb-3">
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Most Searched Careers
              </p>
              <div className="grid grid-cols-2 gap-2">
                {analytics.topSearchedCareers.map((c) => (
                  <div key={c.careerTitle} className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-neutral-800 truncate">{c.careerTitle}</span>
                    <span className="font-bold text-neutral-500 text-[10px]">{c.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                Top Requested Technical Skills
              </p>
              <div className="flex flex-wrap gap-1.5">
                {analytics.topRequestedSkills.map((s) => (
                  <span key={s.skill} className="text-[10px] font-semibold bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md text-neutral-700">
                    {s.skill} ({s.count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Profiles List */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-heading">
              Consented Customer Profiles & Lifecycle
            </h3>
            <p className="text-xs text-neutral-500">
              Aggregated user engagement, segment memberships, and transaction records
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs rounded-xl bg-neutral-50 border border-neutral-200 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>

            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="text-xs py-1.5 px-2.5 rounded-xl border border-neutral-200 bg-white"
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="MENTOR">Mentors</option>
              <option value="SELLER">Sellers</option>
            </select>
          </div>
        </div>

        {/* Profiles Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50/50 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Role & Campus</th>
                <th className="py-3 px-3">Lifecycle Stage</th>
                <th className="py-3 px-3">Segments</th>
                <th className="py-3 px-3 text-right">Transactions</th>
                <th className="py-3 px-3 text-center">Marketing Consent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredProfiles.map((p) => (
                <tr key={p.userId} className="hover:bg-neutral-50/60 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-neutral-900">{p.name}</p>
                    <p className="text-[11px] text-neutral-500">{p.email}</p>
                  </td>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-neutral-800">{p.universityName}</p>
                    <p className="text-[11px] text-neutral-500">{p.programmeName}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      {p.lifecycleStage}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {p.segmentMemberships.map((s) => (
                        <span key={s} className="text-[9px] font-bold bg-neutral-200 text-neutral-700 px-1.5 py-0.2 rounded">
                          {s}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <p className="font-bold text-emerald-700">KSh {p.totalSpentKES}</p>
                    <p className="text-[10px] text-neutral-500">{p.totalPurchasesCount} orders · {p.totalBookingsCount} bookings</p>
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.hasMarketingConsent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Consented
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                        Opted-out
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
