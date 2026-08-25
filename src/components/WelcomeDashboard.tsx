/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, SubscriptionState, UserRole } from '../types';
import { DashboardShell } from './layout/DashboardShell';
import { HomeDashboardView } from '../features/dashboard/HomeDashboardView';
import { AcademicsView } from '../features/academics/AcademicsView';
import { OpportunitiesView } from '../features/opportunities/OpportunitiesView';
import { CareerView } from '../features/career/CareerView';
import { MentorshipView } from '../features/mentorship/MentorshipView';
import { LearningView } from '../features/learning/LearningView';
import { CommunityView } from '../features/community/CommunityView';
import { CampusLifeView } from '../features/campus/CampusLifeView';
import { MarketplaceView } from '../features/marketplace/MarketplaceView';
import { DocumentsView } from '../features/documents/DocumentsView';
import { ProfileView } from '../features/profile/ProfileView';
import { ChatView } from '../features/chat/ChatView';
import { AdminCustomerInsightsView } from '../features/dashboard/AdminCustomerInsightsView';
import { WebsitesHubView } from '../features/websites/WebsitesHubView';
import { GoogleServicesDashboardView } from '../features/google/GoogleServicesDashboardView';

import { HubFullPage, HubPageType } from './HubFullPage';
import { FindLocalTikTokView, LocalCategory } from './FindLocalTikTokView';
import { CompleteProfileModal } from './CompleteProfileModal';
import { MpesaPaymentModal, PaymentPurpose } from './MpesaPaymentModal';
import { GoogleSheetListerModal } from './GoogleSheetListerModal';
import { CloudDatabaseSettingsModal } from './CloudDatabaseSettingsModal';
import { getTrialDetails } from '../services/mpesaService';
import { CheckCircle2 } from 'lucide-react';

interface WelcomeDashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onReplayIntro: () => void;
  onEditAcademicProfile: () => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  logoUrl: string;
}

export const WelcomeDashboard: React.FC<WelcomeDashboardProps> = ({
  user,
  onLogout,
  onEditAcademicProfile,
  onUpdateUser,
  logoUrl,
}) => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [activeRole, setActiveRole] = useState<UserRole>(user.roles?.[0] || 'STUDENT');

  // Specific Hub subpage states (for full-screen Hub experience)
  const [activeHubPage, setActiveHubPage] = useState<HubPageType | null>(null);
  const [activeLocalCategory, setActiveLocalCategory] = useState<LocalCategory | null>(null);

  // Modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMpesaModalOpen, setIsMpesaModalOpen] = useState(false);
  const [mpesaPurpose, setMpesaPurpose] = useState<PaymentPurpose>('enehub_activation');
  const [isListerModalOpen, setIsListerModalOpen] = useState(false);
  const [isCloudDbModalOpen, setIsCloudDbModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const trial = getTrialDetails(
    user.subscription?.trialStartDate || new Date().toISOString(),
    !!user.subscription?.isEneHubPaid
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePaymentSuccess = (updatedSub: SubscriptionState, receipt: string) => {
    const updatedUser: UserProfile = {
      ...user,
      subscription: updatedSub,
    };
    onUpdateUser(updatedUser);
    setIsMpesaModalOpen(false);
    showToast(`Payment Confirmed (${receipt})! Access updated.`);
  };

  const handleRoleChange = (newRole: UserRole) => {
    setActiveRole(newRole);
    const existingRoles = user.roles || ['STUDENT'];
    if (!existingRoles.includes(newRole)) {
      const updatedRoles = [...existingRoles, newRole];
      onUpdateUser({ ...user, roles: updatedRoles });
    }
    showToast(`Persona switched to ${newRole}`);
  };

  const handleOpenHubDetail = (hubId: 'enehub' | 'findlocal') => {
    if (hubId === 'enehub') {
      setCurrentView('learning');
    } else {
      setCurrentView('campus');
    }
  };

  // If a full-screen Hub page is active
  if (activeHubPage) {
    return (
      <HubFullPage
        pageType={activeHubPage}
        onBack={() => setActiveHubPage(null)}
        userCourse={user.course?.name}
        userUniversityName={user.university?.name}
        userName={user.name}
        logoUrl={logoUrl}
      />
    );
  }

  // If a full-screen FindLocal category is active
  if (activeLocalCategory) {
    return (
      <FindLocalTikTokView
        initialCategory={activeLocalCategory}
        onBack={() => setActiveLocalCategory(null)}
        userUniversityName={user.university?.name}
        userName={user.name}
        logoUrl={logoUrl}
        user={user}
        onUpdateUser={onUpdateUser}
        onOpenListerModal={() => setIsListerModalOpen(true)}
      />
    );
  }

  return (
    <DashboardShell
      user={user}
      activeRole={activeRole}
      currentView={currentView}
      onRoleChange={handleRoleChange}
      onNavigate={(viewId) => setCurrentView(viewId)}
      onOpenProfile={() => setIsProfileModalOpen(true)}
      onOpenPaymentModal={() => {
        setMpesaPurpose('enehub_activation');
        setIsMpesaModalOpen(true);
      }}
      onOpenCloudSettings={() => setIsCloudDbModalOpen(true)}
      onLogout={onLogout}
      isTrial={!user.subscription?.isEneHubPaid}
    >
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-neutral-900 text-white rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 border border-neutral-700"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Navigation Content */}
      <div className="w-full">
        {currentView === 'websites' && (
          <WebsitesHubView user={user} />
        )}

        {currentView === 'google-services' && (
          <GoogleServicesDashboardView user={user} />
        )}

        {currentView === 'home' && (
          <HomeDashboardView
            user={user}
            onNavigate={(viewId) => setCurrentView(viewId)}
            onOpenHubDetail={handleOpenHubDetail}
            onOpenPaymentModal={() => {
              setMpesaPurpose('enehub_activation');
              setIsMpesaModalOpen(true);
            }}
            onOpenSheetLister={() => setIsListerModalOpen(true)}
            onOpenCloudSettings={() => setIsCloudDbModalOpen(true)}
          />
        )}

        {currentView === 'chat' && (
          <ChatView user={user} onNavigate={(viewId) => setCurrentView(viewId)} />
        )}

        {currentView === 'insights' && (
          <AdminCustomerInsightsView user={user} onNavigate={(viewId) => setCurrentView(viewId)} />
        )}

        {currentView === 'academics' && (
          <AcademicsView user={user} onNavigate={(viewId) => setCurrentView(viewId)} />
        )}

        {currentView === 'opportunities' && (
          <OpportunitiesView
            user={user}
            activeRole={activeRole}
            onNavigate={(viewId) => setCurrentView(viewId)}
          />
        )}

        {currentView === 'career' && (
          <CareerView user={user} onNavigate={(viewId) => setCurrentView(viewId)} />
        )}

        {currentView === 'mentorship' && (
          <MentorshipView user={user} onNavigate={(viewId) => setCurrentView(viewId)} />
        )}

        {currentView === 'learning' && (
          <LearningView
            user={user}
            onOpenCloudSettings={() => setIsCloudDbModalOpen(true)}
          />
        )}

        {currentView === 'community' && <CommunityView />}

        {currentView === 'campus' && (
          <CampusLifeView
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPaymentModal={() => {
              setMpesaPurpose('findlocal_unlock');
              setIsMpesaModalOpen(true);
            }}
            onOpenSheetLister={() => setIsListerModalOpen(true)}
            isUnlocked={Boolean(user.subscription?.isFindLocalUnlocked)}
            hasSheet={Boolean(user.hasGoogleSheetConnected)}
          />
        )}

        {currentView === 'marketplace' && (
          <MarketplaceView
            onOpenPaymentModal={() => {
              setMpesaPurpose('enehub_activation');
              setIsMpesaModalOpen(true);
            }}
            onOpenSheetLister={() => setIsListerModalOpen(true)}
          />
        )}

        {currentView === 'documents' && (
          <DocumentsView onOpenCloudSettings={() => setIsCloudDbModalOpen(true)} />
        )}

        {currentView === 'profile' && (
          <ProfileView
            user={user}
            activeRole={activeRole}
            onRoleChange={handleRoleChange}
            onOpenCompleteProfile={() => setIsProfileModalOpen(true)}
            onOpenPaymentModal={() => {
              setMpesaPurpose('enehub_activation');
              setIsMpesaModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Global Modals */}
      <CompleteProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onSave={(updated) => {
          onUpdateUser(updated);
          setIsProfileModalOpen(false);
          showToast('Profile updated successfully!');
        }}
        onSaveProfile={(updated) => {
          onUpdateUser(updated);
          setIsProfileModalOpen(false);
          showToast('Profile updated successfully!');
        }}
      />

      <MpesaPaymentModal
        isOpen={isMpesaModalOpen}
        onClose={() => setIsMpesaModalOpen(false)}
        user={user}
        purpose={mpesaPurpose}
        onSuccess={handlePaymentSuccess}
      />

      <GoogleSheetListerModal
        isOpen={isListerModalOpen}
        onClose={() => setIsListerModalOpen(false)}
        user={user}
        userEmail={user?.email}
        userName={user?.name}
        userUniversity={user?.university?.name}
        onInitiatePayment={() => {
          setIsListerModalOpen(false);
          setMpesaPurpose('findlocal_sheet');
          setIsMpesaModalOpen(true);
        }}
      />

      <CloudDatabaseSettingsModal
        isOpen={isCloudDbModalOpen}
        onClose={() => setIsCloudDbModalOpen(false)}
        user={user}
        userEmail={user?.email}
        userName={user?.name}
        userUniversity={user?.university?.name}
        onOpenMpesaModal={(purpose) => {
          setIsCloudDbModalOpen(false);
          setMpesaPurpose(purpose);
          setIsMpesaModalOpen(true);
        }}
        onSyncComplete={() => showToast('Database sync completed!')}
      />
    </DashboardShell>
  );
};
