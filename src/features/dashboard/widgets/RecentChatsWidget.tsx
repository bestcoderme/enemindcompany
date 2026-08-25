/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../../types/user';
import { Conversation } from '../../../types/chat';
import { ChatService } from '../../../services/chat/chatService';
import { MessageSquare, ChevronRight, CheckCheck, Circle } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface RecentChatsWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const RecentChatsWidget: React.FC<RecentChatsWidgetProps> = ({
  user,
  onNavigate,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    const list = ChatService.getConversationsForUser(user.email);
    setConversations(list.slice(0, 3));
  }, [user]);

  const totalUnread = ChatService.getTotalUnreadCount(user.email);

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Recent Messages</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Internal chat & channels</p>
            </div>
          </div>
          {totalUnread > 0 ? (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white animate-pulse">
              {totalUnread} new
            </span>
          ) : (
            <Badge variant="neutral" size="sm">
              Up to date
            </Badge>
          )}
        </div>

        {/* Conversations list */}
        <div className="space-y-2">
          {conversations.map((conv) => {
            const hasUnread = (conv.unreadCounts[user.email] || 0) > 0;
            return (
              <div
                key={conv.id}
                onClick={() => onNavigate('chat')}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  hasUnread
                    ? 'bg-emerald-50/50 border-emerald-200 shadow-xs'
                    : 'bg-neutral-50 border-neutral-100 hover:bg-white hover:border-neutral-200'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {conv.title.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-900 truncate">
                      {conv.title}
                    </h4>
                    {hasUnread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                    {conv.lastMessagePreview || 'Click to view discussion'}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">Encrypted & Isolated</span>
        <button
          onClick={() => onNavigate('chat')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 hover:underline"
        >
          <span>Open Chat Messenger</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
