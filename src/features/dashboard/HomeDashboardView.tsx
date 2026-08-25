/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { UserProfile, UserRole } from '../../types/user';
import { DashboardWidget, WidgetType } from '../../types/dashboard';
import { DashboardService } from '../../services/dashboard/dashboardService';
import { mpesaService } from '../../services/mpesaService';
import { Badge } from '../../components/common/Badge';
import { EmptyState } from '../../components/common/EmptyState';
import {
  GraduationCap,
  Briefcase,
  Compass,
  Users,
  Building2,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  RotateCcw,
  X,
  Eye,
  EyeOff,
  Activity,
  Award,
  BookOpen,
} from 'lucide-react';

// Widgets
import { AcademicSummaryWidget } from './widgets/AcademicSummaryWidget';
import { CareerProgressWidget } from './widgets/CareerProgressWidget';
import { CampaignBannerWidget } from './widgets/CampaignBannerWidget';
import { OpportunityWidget } from './widgets/OpportunityWidget';
import { MentorBookingWidget } from './widgets/MentorBookingWidget';
import { RecentChatsWidget } from './widgets/RecentChatsWidget';
import { MarketplaceWidget } from './widgets/MarketplaceWidget';
import { LearningProgressWidget } from './widgets/LearningProgressWidget';
import { MentorPerformanceWidget } from './widgets/MentorPerformanceWidget';
import { TeacherCoursesWidget } from './widgets/TeacherCoursesWidget';
import { SellerPerformanceWidget } from './widgets/SellerPerformanceWidget';
import { AdminGrowthWidget } from './widgets/AdminGrowthWidget';
import { CustomerInsightsWidget } from './widgets/CustomerInsightsWidget';
import { RecommendedActionsWidget } from './widgets/RecommendedActionsWidget';
import { NotificationsWidget } from './widgets/NotificationsWidget';

// Modals
import { MarketingPreferencesModal } from '../../components/MarketingPreferencesModal';
import { IntelligenceVerificationModal } from '../../components/IntelligenceVerificationModal';
import { GoogleActivityWidget } from '../google/GoogleActivityWidget';

interface HomeDashboardViewProps {
  user: UserProfile | null;
  onNavigate: (viewId: string) => void;
  onOpenHubDetail: (hubId: 'enehub' | 'findlocal') => void;
  onOpenPaymentModal: () => void;
  onOpenSheetLister: () => void;
  onOpenCloudSettings: () => void;
}

export const HomeDashboardView: React.FC<HomeDashboardViewProps> = ({
  user,
  onNavigate,
  onOpenHubDetail,
  onOpenPaymentModal,
  onOpenSheetLister,
  onOpenCloudSettings,
}) => {
  const trialDetails = mpesaService.getTrialDetails(user?.subscription);
  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
  const userEmail = user?.email || 'student@enemind.com';

  // Role simulation & widget state
  const [activeRole, setActiveRole] = useState<UserRole>(user?.roles?.[0] || 'STUDENT');
  const [dashboardConfig, setDashboardConfig] = useState(
    DashboardService.getUserDashboard(userEmail, activeRole)
  );

  // Modals state
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Greeting time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // Re-fetch dashboard when role changes
  useEffect(() => {
    const config = DashboardService.getUserDashboard(userEmail, activeRole);
    setDashboardConfig(config);
  }, [userEmail, activeRole]);

  const handleToggleWidget = (widgetId: string) => {
    const updated = DashboardService.toggleWidgetVisibility(userEmail, activeRole, widgetId);
    setDashboardConfig(updated);
  };

  const handleResetLayout = () => {
    const reset = DashboardService.resetToDefault(userEmail, activeRole);
    setDashboardConfig(reset);
  };

  // Render individual widget component by type
  const renderWidgetComponent = (widget: DashboardWidget) => {
    if (!user) return null;

    switch (widget.type) {
      case 'campaign_banner':
        return <CampaignBannerWidget user={user} onNavigate={onNavigate} />;
      case 'academic_summary':
        return <AcademicSummaryWidget user={user} onNavigate={onNavigate} />;
      case 'career_progress':
        return <CareerProgressWidget user={user} onNavigate={onNavigate} />;
      case 'opportunities_feed':
        return <OpportunityWidget user={user} onNavigate={onNavigate} />;
      case 'mentor_bookings':
        return <MentorBookingWidget user={user} onNavigate={onNavigate} />;
      case 'recent_chats':
        return <RecentChatsWidget user={user} onNavigate={onNavigate} />;
      case 'marketplace_feed':
        return <MarketplaceWidget user={user} onNavigate={onNavigate} />;
      case 'learning_progress':
        return <LearningProgressWidget user={user} onNavigate={onNavigate} />;
      case 'mentor_performance':
        return <MentorPerformanceWidget user={user} onNavigate={onNavigate} />;
      case 'teacher_courses':
        return <TeacherCoursesWidget user={user} onNavigate={onNavigate} />;
      case 'seller_performance':
        return <SellerPerformanceWidget user={user} onNavigate={onNavigate} />;
      case 'admin_growth':
        return <AdminGrowthWidget user={user} onNavigate={onNavigate} />;
      case 'customer_insights':
        return <CustomerInsightsWidget user={user} onNavigate={onNavigate} />;
      case 'recommended_actions':
        return <RecommendedActionsWidget user={user} onNavigate={onNavigate} />;
      case 'notifications_feed':
        return <NotificationsWidget user={user} onNavigate={onNavigate} />;
      default:
        return null;
    }
  };

  // Helper for responsive grid col-span based on widget.size
  const getWidgetGridClass = (size: string) => {
    switch (size) {
      case 'full':
        return 'col-span-1 md:col-span-2 lg:col-span-3';
      case 'large':
        return 'col-span-1 md:col-span-2';
      case 'medium':
        return 'col-span-1 md:col-span-1 lg:col-span-2';
      case 'small':
      default:
        return 'col-span-1';
    }
  };

  const visibleWidgets = dashboardConfig.widgets.filter((w) => w.isVisible);

  return (
    <div className="space-y-6">
      {/* 1. Personalized Header Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-48 h-48 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {greeting}, {firstName} 👋
              </span>
              <div className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-xs font-bold text-neutral-200">
                <span>Active Persona:</span>
                <select
                  value={activeRole}
                  onChange={(e) => setActiveRole(e.target.value as UserRole)}
                  className="bg-transparent text-emerald-400 font-extrabold focus:outline-hidden cursor-pointer"
                >
                  <option value="STUDENT" className="text-neutral-900">Student</option>
                  <option value="MENTOR" className="text-neutral-900">Industry Mentor</option>
                  <option value="TEACHER" className="text-neutral-900">Teacher / Faculty</option>
                  <option value="SELLER" className="text-neutral-900">Sheet Seller</option>
                  <option value="ENEMIND_ADMIN" className="text-neutral-900">Admin</option>
                </select>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              Personalized {activeRole.charAt(0) + activeRole.slice(1).toLowerCase()} Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-xl">
              {user?.university?.name || 'Global University Network'} · {user?.course?.name || 'Academic & Career Workspace'}
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Configure recommendations consent and privacy settings"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Privacy & Consent</span>
            </button>

            <button
              onClick={() => setIsCustomizeOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-neutral-200 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Customize dashboard widgets"
            >
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Customize Widgets</span>
            </button>

            <button
              onClick={() => setIsTestModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Test Suite</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Core Tri-Orbit Preserved Launchers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* EneHub Launcher */}
        <div
          onClick={() => onOpenHubDetail('enehub')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <Badge variant="emerald">EneHub</Badge>
            </div>
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors font-heading">
              Academic & Opportunities
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Browse semester revision notes, past papers with solutions, internships & industrial attachments.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600">
            <span>Open EneHub</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Find Local Launcher (Campus Life) */}
        <div
          onClick={() => onOpenHubDetail('findlocal')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-purple-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <Badge variant="purple">Campus Life</Badge>
            </div>
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-purple-600 transition-colors font-heading">
              Find Local Campus Life
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Hostel discovery with WhatsApp room booking, hotels, cyber cafes, salons & dining.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600">
            <span>Explore Hostels & Services</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Website Builder & Google Sheet Database Launcher */}
        <div
          onClick={() => onNavigate('websites')}
          className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5" />
              </div>
              <Badge variant="blue">KES 150/mo</Badge>
            </div>
            <h3 className="text-base font-bold text-neutral-900 group-hover:text-blue-600 transition-colors font-heading">
              Website-as-a-Service
            </h3>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Launch personal & business websites in seconds with Google Sheets as your zero-cost live database.
            </p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-blue-600">
            <span>Manage Websites</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* 2.5 Live Google Workspace Activity Widget */}
      {user && (
        <GoogleActivityWidget
          user={user}
          onNavigate={onNavigate}
          onOpenGoogleCenter={onOpenCloudSettings}
        />
      )}

      {/* 3. Modular Personalized Widget Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {visibleWidgets.map((widget) => (
          <div key={widget.id} className={`${getWidgetGridClass(widget.size)} h-full`}>
            {renderWidgetComponent(widget)}
          </div>
        ))}
      </div>

      {/* 4. Ecosystem Quick-Action Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => onNavigate('opportunities')}
          className="p-4 rounded-2xl bg-white border border-neutral-200 text-left hover:border-neutral-400 transition-all group cursor-pointer"
        >
          <Briefcase className="w-5 h-5 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-neutral-900">Scholarships & Jobs</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Attachments & Grants</p>
        </button>

        <button
          onClick={() => onNavigate('career')}
          className="p-4 rounded-2xl bg-white border border-neutral-200 text-left hover:border-neutral-400 transition-all group cursor-pointer"
        >
          <Compass className="w-5 h-5 text-amber-600 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-neutral-900">Career Roadmaps</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Skills gap & paths</p>
        </button>

        <button
          onClick={() => onNavigate('mentorship')}
          className="p-4 rounded-2xl bg-white border border-neutral-200 text-left hover:border-neutral-400 transition-all group cursor-pointer"
        >
          <Users className="w-5 h-5 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-neutral-900">Find Mentors</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Book 1-on-1 sessions</p>
        </button>

        <button
          onClick={() => onNavigate('chat')}
          className="p-4 rounded-2xl bg-white border border-neutral-200 text-left hover:border-neutral-400 transition-all group cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
          <p className="text-xs font-bold text-neutral-900">Internal Chat</p>
          <p className="text-[11px] text-neutral-500 mt-0.5">Encrypted messenger</p>
        </button>
      </div>

      {/* 5. Cloud & Tools Integration Footer Box */}
      <div className="p-4 rounded-2xl bg-neutral-100 border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-neutral-600">
          <Shield className="w-4 h-4 text-neutral-500" />
          <span>Connected Google Sheets & Drive sync enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSheetLister}
            className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Seller Sheet Lister
          </button>
          <button
            onClick={onOpenCloudSettings}
            className="px-3 py-1.5 rounded-lg bg-white border border-neutral-300 text-neutral-700 font-semibold hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Database Settings
          </button>
        </div>
      </div>

      {/* Widget Customization Drawer / Modal */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-heading text-neutral-900">
                    Customize Widgets
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Toggle cards for your {activeRole} dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {dashboardConfig.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 bg-neutral-50/50 hover:border-neutral-200 transition-all"
                >
                  <div>
                    <p className="text-xs font-bold text-neutral-900">{widget.title}</p>
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">
                      {widget.size} size
                    </span>
                  </div>

                  <button
                    onClick={() => handleToggleWidget(widget.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      widget.isVisible
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {widget.isVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-4">
              <button
                onClick={handleResetLayout}
                className="text-xs font-bold text-neutral-600 hover:text-neutral-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Defaults</span>
              </button>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marketing Preferences Modal */}
      {user && (
        <MarketingPreferencesModal
          isOpen={isPreferencesOpen}
          onClose={() => setIsPreferencesOpen(false)}
          user={user}
        />
      )}

      {/* Intelligence & Privacy Verification Modal */}
      {user && (
        <IntelligenceVerificationModal
          isOpen={isTestModalOpen}
          onClose={() => setIsTestModalOpen(false)}
          user={user}
        />
      )}
    </div>
  );
};
