/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { Users, Star, DollarSign, Calendar, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface MentorPerformanceWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const MentorPerformanceWidget: React.FC<MentorPerformanceWidgetProps> = ({
  onNavigate,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-purple-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Mentor Impact & Honorarium</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Verified Industry Mentor Dashboard</p>
            </div>
          </div>
          <Badge variant="purple" size="sm">
            Top Rated
          </Badge>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">Sessions</p>
            <p className="text-xl font-black text-neutral-900 font-heading mt-0.5">24</p>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">Rating</p>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-xl font-black text-neutral-900 font-heading">4.95</span>
            </div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 text-center">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">M-PESA Earnings</p>
            <p className="text-xl font-black text-emerald-600 font-heading mt-0.5">KSh 36k</p>
          </div>
        </div>

        {/* Student feedback snippet */}
        <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
          <p className="text-[11px] text-neutral-700 italic">
            "Dr. Jane gave me incredible cloud deployment architecture feedback that directly landed me an internship interview."
          </p>
          <p className="text-[10px] text-purple-900 font-bold mt-1.5">— Brian K., UoN Computer Science</p>
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">Availability: 6 slots open</span>
        <button
          onClick={() => onNavigate('mentorship')}
          className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline"
        >
          Manage Calendar & Slots
        </button>
      </div>
    </div>
  );
};
