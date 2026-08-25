/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { Users, Calendar, Video, ChevronRight, MessageSquare } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface MentorBookingWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const MentorBookingWidget: React.FC<MentorBookingWidgetProps> = ({
  onNavigate,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-purple-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Upcoming Mentorship</h3>
              <p className="text-[11px] text-neutral-500 font-medium">1-on-1 industry guidance</p>
            </div>
          </div>
          <Badge variant="purple" size="sm">
            Confirmed
          </Badge>
        </div>

        {/* Next session card */}
        <div className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50 mb-3">
          <div className="flex items-center gap-3 mb-2">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
              alt="Dr. Jane Mutua"
              className="w-10 h-10 rounded-xl object-cover border border-neutral-200"
            />
            <div>
              <h4 className="text-xs font-bold text-neutral-900">Dr. Jane Mutua</h4>
              <p className="text-[10px] text-neutral-500 font-medium">Cloud Architect at AWS · Nairobi</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-semibold text-purple-900 bg-purple-50/80 p-2 rounded-lg border border-purple-100/60 mb-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-purple-600" />
              <span>Friday, Aug 28 · 4:00 PM EAT</span>
            </div>
            <span className="text-[10px] font-bold text-purple-700 bg-purple-200/50 px-1.5 py-0.5 rounded">
              Google Meet
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('chat')}
              className="flex-1 py-1.5 px-2.5 rounded-lg bg-neutral-900 text-white font-bold text-[11px] hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3 h-3" />
              <span>Message Mentor</span>
            </button>
            <button
              onClick={() => onNavigate('mentorship')}
              className="py-1.5 px-2.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 font-bold text-[11px] hover:bg-neutral-100 transition-colors"
            >
              Details
            </button>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">1 Session scheduled</span>
        <button
          onClick={() => onNavigate('mentorship')}
          className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1 hover:underline"
        >
          <span>Find More Mentors</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
