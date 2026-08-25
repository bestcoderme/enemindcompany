/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../../types/user';
import { NotificationItem } from '../../../types/intelligence';
import { NotificationService } from '../../../services/intelligence/notificationService';
import { Bell, CheckCheck, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface NotificationsWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const NotificationsWidget: React.FC<NotificationsWidgetProps> = ({
  user,
  onNavigate,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const list = NotificationService.getNotifications(user.email);
    setNotifications(list.slice(0, 3));
  }, [user]);

  const handleMarkAllRead = () => {
    NotificationService.markAllAsRead(user.email);
    setNotifications(NotificationService.getNotifications(user.email).slice(0, 3));
  };

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-neutral-300 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">System Notifications</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Activity alerts & security logs</p>
            </div>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="text-[11px] font-bold text-neutral-500 hover:text-neutral-900 flex items-center gap-1"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => notif.linkView && onNavigate(notif.linkView)}
              className={`p-3 rounded-xl border transition-all cursor-pointer ${
                !notif.isRead
                  ? 'bg-amber-50/50 border-amber-200'
                  : 'bg-neutral-50 border-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-neutral-900 truncate">
                  {notif.title}
                </span>
                <span className="text-[10px] text-neutral-400">
                  {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] text-neutral-600 leading-snug">
                {notif.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">Real-time alerts</span>
        <span className="text-xs font-bold text-emerald-600">Database Synced</span>
      </div>
    </div>
  );
};
