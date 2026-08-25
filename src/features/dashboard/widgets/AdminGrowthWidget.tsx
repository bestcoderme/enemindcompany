/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { ShieldCheck, TrendingUp, Users, Activity, DollarSign, University } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';
import { AnalyticsService } from '../../../services/analytics/analyticsService';

interface AdminGrowthWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const AdminGrowthWidget: React.FC<AdminGrowthWidgetProps> = () => {
  const stats = AnalyticsService.getAggregatedAnalytics();

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Ecosystem Growth & Active Users</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Real-time Telemetry & KPIs</p>
            </div>
          </div>
          <Badge variant="emerald" size="sm">
            Live Platform
          </Badge>
        </div>

        {/* 4-Stat Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">DAU</p>
            <p className="text-xl font-black text-neutral-900 font-heading mt-0.5">{stats.dau}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">+12% vs yesterday</span>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">WAU</p>
            <p className="text-xl font-black text-neutral-900 font-heading mt-0.5">{stats.wau}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">+8% this week</span>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">MAU</p>
            <p className="text-xl font-black text-neutral-900 font-heading mt-0.5">{stats.mau}</p>
            <span className="text-[10px] text-emerald-600 font-semibold">Active Base</span>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">M-PESA Gross</p>
            <p className="text-xl font-black text-emerald-600 font-heading mt-0.5">
              KSh {(stats.totalRevenueKES / 1000).toFixed(0)}k
            </p>
            <span className="text-[10px] text-neutral-500 font-semibold">Processed</span>
          </div>
        </div>

        {/* Top Active Universities */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
            Top Engaged Campuses
          </p>
          <div className="grid grid-cols-2 gap-2">
            {stats.activeUniversities.slice(0, 4).map((uni) => (
              <div key={uni.universityName} className="p-2 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-800 truncate">{uni.universityName}</span>
                <span className="font-bold text-neutral-500 text-[11px] shrink-0">{uni.activeUsersCount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">99.98% API Uptime</span>
        <span className="text-xs font-bold text-neutral-700">Enemind Engine v4.2</span>
      </div>
    </div>
  );
};
