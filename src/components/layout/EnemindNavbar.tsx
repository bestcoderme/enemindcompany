/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../../types';
import { Badge } from '../common/Badge';
import {
  Sparkles,
  Shield,
  User,
  LogOut,
  CheckCircle,
  Bell,
  Search,
  Compass,
  MessageSquare,
  Globe,
  FileSpreadsheet,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { mpesaService } from '../../services/mpesaService';
import { ChatService } from '../../services/chat/chatService';
import { notificationService } from '../../services/notifications/notificationService';
import { providerRegistry } from '../../services/providers/providerRegistry';
import { CustomDomainSetupModal } from '../../features/domain/CustomDomainSetupModal';
import { ENEMIND_LOGO_URL } from '../../constants/brand';

interface EnemindNavbarProps {
  user: UserProfile | null;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenProfile: () => void;
  onOpenPaymentModal: () => void;
  onOpenCloudSettings: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const ALL_PERSONAS: { role: UserRole; label: string }[] = [
  { role: 'STUDENT', label: 'Student' },
  { role: 'BUSINESS_OWNER', label: 'Business Owner' },
  { role: 'CREATOR', label: 'Creator' },
  { role: 'FREELANCER', label: 'Freelancer' },
  { role: 'TUTOR' as any, label: 'Tutor' },
  { role: 'TEACHER', label: 'Teacher / Lecturer' },
  { role: 'MENTOR', label: 'Mentor' },
  { role: 'EVENT_ORGANIZER', label: 'Event Organizer' },
  { role: 'WEBSITE_OWNER', label: 'Website Owner' },
  { role: 'ALUMNI', label: 'Alumni' },
  { role: 'RECRUITER', label: 'Recruiter' },
  { role: 'ENEMIND_ADMIN', label: 'Admin' },
];

export const EnemindNavbar: React.FC<EnemindNavbarProps> = ({
  user,
  activeRole,
  onRoleChange,
  onOpenProfile,
  onOpenPaymentModal,
  onOpenCloudSettings,
  onLogout,
  onNavigate,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifMenuOpen, setNotifMenuOpen] = useState(false);
  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const trialDetails = mpesaService.getTrialDetails(user?.subscription);
  const [unreadCount, setUnreadCount] = useState(0);
  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    if (user?.email) {
      setUnreadCount(ChatService.getTotalUnreadCount(user.email));
      setUnreadNotifsCount(notificationService.getUnreadCount(user.email));
    }
  }, [user]);

  const availableRoles: UserRole[] = user?.personas || user?.roles || ['STUDENT', 'WEBSITE_OWNER', 'BUSINESS_OWNER'];
  const isDevMode = providerRegistry.getIsDevelopmentMode();
  const notifications = user ? notificationService.getNotificationsForUser(user.email || user.id) : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo & Tag */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 overflow-hidden border border-neutral-200/80 shadow-xs flex items-center justify-center shrink-0">
            <img
              src={ENEMIND_LOGO_URL}
              alt="ENEMIND Logo"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-black text-base tracking-tight text-neutral-900">
                ENEMIND
              </span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Platform
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-medium hidden sm:block">
              {user?.university?.shortName || user?.university?.name || 'User & Website Platform'}
            </p>
          </div>
        </div>

        {/* Search Bar / Quick Action (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md items-center relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Search websites, notes, scholarships, mentors, hostels..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-neutral-100/80 border border-transparent focus:border-emerald-500 focus:bg-white focus:outline-hidden transition-all placeholder:text-neutral-400"
            onFocus={() => {}}
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Websites Shortcut */}
          <button
            onClick={() => onNavigate('websites')}
            className="p-2 rounded-xl text-neutral-600 hover:text-emerald-700 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="My Websites (KES 150/mo)"
          >
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="hidden xl:inline text-xs font-bold text-neutral-700">My Websites</span>
          </button>

          {/* Google Workspace Services Quick Button */}
          <button
            onClick={() => onNavigate('google-services')}
            className="p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Google Workspace & Drive Hub"
          >
            <FileSpreadsheet className="w-4 h-4 text-blue-600" />
            <span className="hidden xl:inline text-xs font-bold text-neutral-700">Google Hub</span>
          </button>

          {/* Quick Chat Messenger Button */}
          <button
            onClick={() => onNavigate('chat')}
            className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Open Chat & Channels"
          >
            <MessageSquare className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="relative p-2 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>

            {notifMenuOpen && (
              <div
                className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setNotifMenuOpen(false)}
              >
                <div className="px-4 py-2.5 border-b border-neutral-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-900">Notifications</span>
                  <button
                    onClick={() => {
                      if (user?.email) notificationService.markAllAsRead(user.email);
                      setUnreadNotifsCount(0);
                    }}
                    className="text-[10px] text-emerald-700 font-bold hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-neutral-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-neutral-400">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-3 hover:bg-neutral-50 text-xs">
                        <p className="font-bold text-neutral-900">{notif.title}</p>
                        <p className="text-neutral-500 text-[11px] mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Development Mode Pill / Trial */}
          {isDevMode ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Free Dev Mode</span>
            </div>
          ) : trialDetails.isPaid ? (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Full Access</span>
            </div>
          ) : (
            <button
              onClick={onOpenPaymentModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium hover:bg-amber-100 transition-all active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
              <span className="font-semibold">{trialDetails.daysLeft}d Trial</span>
              <span className="hidden sm:inline text-amber-700 font-bold">· Unlock</span>
            </button>
          )}

          {/* User Menu Trigger */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-100 transition-colors border border-neutral-200 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-neutral-200 flex items-center justify-center">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-neutral-600" />
                )}
              </div>
              <span className="text-xs font-semibold text-neutral-800 hidden lg:inline max-w-[120px] truncate">
                {user?.name || 'My Account'}
              </span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-72 rounded-2xl bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setMenuOpen(false)}
              >
                {/* User summary */}
                <div className="px-4 py-3 border-b border-neutral-100">
                  <p className="text-xs font-bold text-neutral-900 truncate">{user?.name || 'Enemind User'}</p>
                  <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    <Badge variant="emerald" size="sm">
                      {activeRole.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>

                {/* Persona Switcher (Multi-Persona Architecture) */}
                <div className="px-4 py-2 border-b border-neutral-100">
                  <p className="text-[10px] uppercase font-bold text-neutral-400 mb-1.5">
                    Switch Active Persona
                  </p>
                  <div className="grid grid-cols-2 gap-1 max-h-40 overflow-y-auto">
                    {ALL_PERSONAS.map((p) => (
                      <button
                        key={p.role}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRoleChange(p.role);
                        }}
                        className={`text-left text-[11px] px-2 py-1.5 rounded-lg font-semibold transition-all cursor-pointer truncate ${
                          activeRole === p.role
                            ? 'bg-neutral-900 text-white'
                            : 'text-neutral-700 hover:bg-neutral-100'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setDomainModalOpen(true);
                      setMenuOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    Custom Domain (enemindcompany.co.ke)
                  </button>

                  <button
                    onClick={() => onNavigate('websites')}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    My Websites (KES 150/mo)
                  </button>

                  <button
                    onClick={() => onNavigate('google-services')}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
                    Google Cloud & Drive Hub
                  </button>

                  <button
                    onClick={onOpenProfile}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <User className="w-3.5 h-3.5 text-neutral-500" />
                    Complete / Edit Profile
                  </button>

                  <button
                    onClick={onOpenPaymentModal}
                    className="w-full text-left px-4 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Subscription & M-PESA
                  </button>
                </div>

                <div className="border-t border-neutral-100 pt-1">
                  <button
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CustomDomainSetupModal
        isOpen={domainModalOpen}
        onClose={() => setDomainModalOpen(false)}
      />
    </header>
  );
};
