import React from 'react';
import { EnemindNavbar } from './EnemindNavbar';
import { EnemindSidebar } from './EnemindSidebar';
import { EnemindBottomNav } from './EnemindBottomNav';
import { UserProfile, UserRole } from '../../types';

interface DashboardShellProps {
  user: UserProfile | null;
  activeRole: UserRole;
  currentView: string;
  onRoleChange: (role: UserRole) => void;
  onNavigate: (viewId: string) => void;
  onOpenProfile: () => void;
  onOpenPaymentModal: () => void;
  onOpenCloudSettings: () => void;
  onLogout: () => void;
  isTrial: boolean;
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  user,
  activeRole,
  currentView,
  onRoleChange,
  onNavigate,
  onOpenProfile,
  onOpenPaymentModal,
  onOpenCloudSettings,
  onLogout,
  isTrial,
  children,
}) => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <EnemindNavbar
        user={user}
        activeRole={activeRole}
        onRoleChange={onRoleChange}
        onOpenProfile={onOpenProfile}
        onOpenPaymentModal={onOpenPaymentModal}
        onOpenCloudSettings={onOpenCloudSettings}
        onLogout={onLogout}
        onNavigate={onNavigate}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <EnemindSidebar
          currentView={currentView}
          onNavigate={onNavigate}
          onOpenPaymentModal={onOpenPaymentModal}
          isTrial={isTrial}
        />

        {/* Dynamic Viewport Content */}
        <main className="flex-1 min-w-0 pb-20 md:pb-8 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <EnemindBottomNav
        currentView={currentView}
        onNavigate={onNavigate}
      />
    </div>
  );
};
