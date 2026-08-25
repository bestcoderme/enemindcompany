/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { ShoppingBag, DollarSign, TrendingUp, Download, Plus, ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface SellerPerformanceWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const SellerPerformanceWidget: React.FC<SellerPerformanceWidgetProps> = ({
  onNavigate,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-amber-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Creator & Template Revenue</h3>
              <p className="text-[11px] text-neutral-500 font-medium">EneHub Google Sheet Creator</p>
            </div>
          </div>
          <Badge variant="amber" size="sm">
            M-PESA Instant
          </Badge>
        </div>

        {/* Revenue metrics */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">Templates</p>
            <p className="text-xl font-black text-neutral-900 font-heading mt-0.5">4</p>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">Total Sales</p>
            <p className="text-xl font-black text-neutral-900 font-heading mt-0.5">82</p>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">Total Payouts</p>
            <p className="text-xl font-black text-emerald-600 font-heading mt-0.5">KSh 32,800</p>
          </div>
        </div>

        <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-neutral-900">Kenya KRA PAYE & NHIF Template</p>
            <p className="text-[11px] text-neutral-500">64 sales · KSh 400 unit price</p>
          </div>
          <span className="text-xs font-black text-emerald-700">KSh 25,600</span>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">Automatic delivery active</span>
        <button
          onClick={() => onNavigate('marketplace')}
          className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish New Automation</span>
        </button>
      </div>
    </div>
  );
};
