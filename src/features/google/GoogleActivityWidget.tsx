/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Video,
  Mail,
  FolderLock,
  GraduationCap,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Shield,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { UserProfile } from '../../types';
import { GoogleCalendarEvent, GoogleDriveFileItem } from '../../types/google';
import { calendarService } from '../../services/google/calendarService';
import { driveService } from '../../services/google/driveService';
import { gmailService } from '../../services/google/gmailService';
import { classroomService } from '../../services/google/classroomService';
import { googleAccountService } from '../../services/google/googleAccountService';

interface GoogleActivityWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
  onOpenGoogleCenter: () => void;
}

export const GoogleActivityWidget: React.FC<GoogleActivityWidgetProps> = ({
  user,
  onNavigate,
  onOpenGoogleCenter,
}) => {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [recentFiles, setRecentFiles] = useState<GoogleDriveFileItem[]>([]);
  const [recentEmails, setRecentEmails] = useState<any[]>([]);
  const [account, setAccount] = useState(googleAccountService.getConnectionStatus());
  const [activeTab, setActiveTab] = useState<'schedule' | 'documents' | 'gmail'>('schedule');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setAccount(googleAccountService.getConnectionStatus());
    const upcoming = await calendarService.getUpcomingEvents(3);
    setEvents(upcoming);
    const files = await driveService.listFiles();
    setRecentFiles(files.slice(0, 3));
    const emails = await gmailService.getRecentMessages(3);
    setRecentEmails(emails);
  };

  return (
    <div className="p-5 rounded-3xl bg-white border border-neutral-200 shadow-sm flex flex-col justify-between h-full">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold font-heading text-neutral-900">
                  Google Workspace Activity
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-100" />
              </div>
              <p className="text-[11px] text-neutral-500">
                Live Calendar, Meet, Drive & Classroom Sync
              </p>
            </div>
          </div>

          <button
            onClick={onOpenGoogleCenter}
            className="px-2.5 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Shield className="w-3 h-3 text-emerald-600" />
            <span>Manage</span>
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-neutral-100 rounded-xl mb-3 text-[11px] font-bold">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'schedule' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Calendar ({events.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'documents' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Drive ({recentFiles.length})
          </button>
          <button
            onClick={() => setActiveTab('gmail')}
            className={`flex-1 py-1 px-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'gmail' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Gmail ({recentEmails.length})
          </button>
        </div>

        {/* Content Tabs */}
        {activeTab === 'schedule' && (
          <div className="space-y-2">
            {events.map((ev) => {
              const start = ev.start?.dateTime ? new Date(ev.start.dateTime) : new Date();
              return (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 hover:border-neutral-200 transition-all flex items-start justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">{ev.summary}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[10px] text-neutral-500">
                      <Clock className="w-3 h-3 text-neutral-400" />
                      <span>
                        {start.toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                        {start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {ev.meetUrl && (
                    <a
                      href={ev.meetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-[10px] font-bold flex items-center gap-1 shrink-0 border border-emerald-200"
                    >
                      <Video className="w-3 h-3" />
                      <span>Join Meet</span>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-2">
            {recentFiles.map((file) => (
              <div
                key={file.id}
                className="p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 hover:border-neutral-200 transition-all flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FolderLock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-neutral-900 truncate">{file.name}</p>
                    <span className="text-[10px] text-neutral-400 font-medium">
                      /Enemind/{file.folderCategory} · {file.size}
                    </span>
                  </div>
                </div>

                <a
                  href={file.webViewLink}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 rounded text-neutral-400 hover:text-neutral-900"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'gmail' && (
          <div className="space-y-2">
            {recentEmails.map((msg) => (
              <div
                key={msg.id}
                className="p-2.5 rounded-xl border border-neutral-100 bg-neutral-50/70 hover:border-neutral-200 transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-600 truncate max-w-[160px]">
                    {msg.from}
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {new Date(msg.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs font-bold text-neutral-900 truncate">{msg.subject}</p>
                <p className="text-[11px] text-neutral-500 line-clamp-1">{msg.snippet}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer link to Documents view */}
      <div className="pt-3 border-t border-neutral-100 mt-3 flex items-center justify-between text-xs font-bold">
        <button
          onClick={() => onNavigate('documents')}
          className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 cursor-pointer"
        >
          <span>Open Drive Locker</span>
          <ArrowRight className="w-3 h-3" />
        </button>

        <button
          onClick={() => onNavigate('mentorship')}
          className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
        >
          <span>Book Session</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
