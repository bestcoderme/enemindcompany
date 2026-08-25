/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Home,
  GraduationCap,
  Briefcase,
  Compass,
  Users,
  BookOpen,
  MessageSquare,
  Building2,
  ShoppingBag,
  FolderLock,
  User,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Layers,
  Globe,
  FileSpreadsheet,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string;
  badgeVariant?: 'emerald' | 'amber' | 'blue' | 'purple';
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'websites', label: 'My Websites', icon: Globe, badge: 'KES 150', badgeVariant: 'emerald' },
  { id: 'google-services', label: 'Google Cloud Hub', icon: FileSpreadsheet, badge: 'Sheets', badgeVariant: 'blue' },
  { id: 'chat', label: 'Chat & Channels', icon: MessageSquare, badge: 'Direct', badgeVariant: 'emerald' },
  { id: 'academics', label: 'Academics', icon: GraduationCap, badge: 'GPA' },
  { id: 'opportunities', label: 'Opportunities', icon: Briefcase, badge: 'New', badgeVariant: 'emerald' },
  { id: 'career', label: 'Career', icon: Compass },
  { id: 'mentorship', label: 'Mentors', icon: Users },
  { id: 'learning', label: 'Learning & Notes', icon: BookOpen },
  { id: 'community', label: 'Community', icon: MessageSquare },
  { id: 'campus', label: 'Campus Life', icon: Building2, badge: 'TikTok UI', badgeVariant: 'purple' },
  { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag, badge: 'Auto', badgeVariant: 'blue' },
  { id: 'insights', label: 'Customer Intelligence', icon: Layers, badge: 'Admin', badgeVariant: 'purple' },
  { id: 'documents', label: 'Documents', icon: FolderLock },
  { id: 'profile', label: 'Profile', icon: User },
];

interface EnemindSidebarProps {
  currentView: string;
  onNavigate: (viewId: string) => void;
  onOpenPaymentModal: () => void;
  isTrial: boolean;
}

export const EnemindSidebar: React.FC<EnemindSidebarProps> = ({
  currentView,
  onNavigate,
  onOpenPaymentModal,
  isTrial,
}) => {
  return (
    <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)] p-4">
      {/* Navigation Links */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-neutral-400 mb-2">
          Platform Ecosystem
        </p>

        {MAIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                isActive
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-neutral-400 group-hover:text-neutral-900'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : item.badgeVariant === 'purple'
                      ? 'bg-purple-100 text-purple-700'
                      : item.badgeVariant === 'emerald'
                      ? 'bg-emerald-100 text-emerald-700'
                      : item.badgeVariant === 'blue'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-neutral-200 text-neutral-700'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Upgrade Banner in Sidebar */}
      {isTrial && (
        <div className="mt-6 p-4 rounded-2xl bg-linear-to-br from-neutral-900 to-neutral-800 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 rounded-full bg-emerald-500/20 blur-xl"></div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 font-heading">
              ENEMIND PRO
            </span>
          </div>
          <p className="text-[11px] text-neutral-300 mb-3 leading-relaxed">
            Unlock complete notes, past papers, hostel concierge & GPA calculators via M-PESA.
          </p>
          <button
            onClick={onOpenPaymentModal}
            className="w-full py-2 px-3 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>Activate KSh 200</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </aside>
  );
};
