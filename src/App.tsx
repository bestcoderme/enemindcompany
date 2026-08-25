/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Preloader } from './components/Preloader';
import { AuthCard } from './components/AuthCard';
import { InstitutionSelector } from './components/InstitutionSelector';
import { CourseSelector } from './components/CourseSelector';
import { WelcomeDashboard } from './components/WelcomeDashboard';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { UserProfile, University, CourseItem } from './types';
import { getInitialSubscription } from './services/mpesaService';
import { authService } from './services/auth/authService';
import { AuthProvider } from './contexts/AuthContext';
import { RefreshCw } from 'lucide-react';

const ENEMIND_LOGO =
  'https://lh3.googleusercontent.com/a/ACg8ocK8OcG5hTyHl38gnft2YriG9VXV1g3fxqG25hYEPgzGas3C084=s100-c';

type FlowStep = 'auth' | 'university' | 'course' | 'dashboard';

export default function App() {
  const [isPreloading, setIsPreloading] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [flowStep, setFlowStep] = useState<FlowStep>(() => {
    const existing = authService.getCurrentUser();
    if (existing && existing.university && existing.course) {
      return 'dashboard';
    } else if (existing && existing.university) {
      return 'course';
    } else if (existing) {
      return 'university';
    }
    return 'dashboard';
  });

  const handlePreloaderComplete = useCallback(() => {
    setIsPreloading(false);
  }, []);

  const handleAuthSuccess = (user: UserProfile) => {
    const sub = getInitialSubscription(user.email);
    const userWithSub: UserProfile = {
      ...user,
      subscription: user.subscription || sub,
      roles: user.roles || ['STUDENT'],
    };
    setCurrentUser(userWithSub);
    authService.saveUser(userWithSub);
    // Proceed to university selection if not selected yet
    if (!userWithSub.university) {
      setFlowStep('university');
    } else if (!userWithSub.course) {
      setFlowStep('course');
    } else {
      setFlowStep('dashboard');
    }
  };

  const handleUniversitySelect = (uni: University) => {
    if (currentUser) {
      const updated = { ...currentUser, university: uni };
      setCurrentUser(updated);
      authService.saveUser(updated);
      setFlowStep('course');
    }
  };

  const handleCourseSelect = (course: CourseItem) => {
    if (currentUser) {
      const updatedUser: UserProfile = {
        ...currentUser,
        course,
        isProfileComplete: true,
      };
      setCurrentUser(updatedUser);
      authService.saveUser(updatedUser);
      setFlowStep('dashboard');
    }
  };

  const handleUpdateUser = (updatedUser: UserProfile) => {
    setCurrentUser(updatedUser);
    authService.saveUser(updatedUser);
  };

  const handleBackToUniversity = () => {
    setFlowStep('university');
  };

  const handleEditAcademicProfile = () => {
    setFlowStep('university');
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setFlowStep('auth');
  };

  const handleReplayIntro = () => {
    setIsPreloading(true);
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col justify-between overflow-x-hidden font-sans">
        {/* Preloader Phase */}
        <AnimatePresence mode="wait">
          {isPreloading && (
            <Preloader
              key="preloader"
              onComplete={handlePreloaderComplete}
              logoUrl={ENEMIND_LOGO}
            />
          )}
        </AnimatePresence>

        {/* Top Navbar for onboarding / auth */}
        {!isPreloading && flowStep !== 'dashboard' && (
          <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-6xl mx-auto px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-neutral-950 flex items-center justify-center text-white shadow-xs">
                <span className="font-extrabold text-sm tracking-wider font-heading text-emerald-400">EN</span>
              </div>
              <span className="font-heading font-black text-base text-neutral-900 tracking-tight">
                ENEMIND
              </span>
            </div>

            <div className="flex items-center gap-3">
              {currentUser && (
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white rounded-full border border-neutral-200/80 text-xs font-semibold text-neutral-700 shadow-2xs">
                  <span className="truncate max-w-[120px]">{currentUser.name}</span>
                </div>
              )}

              <button
                type="button"
                id="header-replay-intro"
                onClick={handleReplayIntro}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 border border-neutral-200 shadow-2xs transition-colors cursor-pointer"
                title="Replay intro animation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Intro</span>
              </button>
            </div>
          </motion.header>
        )}

        {/* Main Content Container */}
        <main
          className={`flex-1 flex flex-col items-center justify-center w-full ${
            flowStep === 'dashboard' ? 'p-0 max-w-none' : 'px-4 py-4 sm:py-6 my-auto max-w-4xl mx-auto'
          }`}
        >
          {!isPreloading && (
            <>
              {flowStep === 'auth' && (
                <div className="w-full max-w-md mx-auto mb-2">
                  <PwaInstallBanner />
                </div>
              )}
              <AnimatePresence mode="wait">
                {(flowStep === 'auth' || !currentUser) && (
                  <motion.div
                    key="auth"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="w-full flex justify-center"
                  >
                    <AuthCard
                      onSuccess={handleAuthSuccess}
                      logoUrl={ENEMIND_LOGO}
                    />
                  </motion.div>
                )}

                {flowStep === 'university' && currentUser && (
                  <motion.div
                    key="university-step"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="w-full flex justify-center"
                  >
                    <InstitutionSelector
                      userName={currentUser.name}
                      initialSelectedId={currentUser.university?.id}
                      onSelectUniversity={handleUniversitySelect}
                    />
                  </motion.div>
                )}

                {flowStep === 'course' && currentUser && currentUser.university && (
                  <motion.div
                    key="course-step"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="w-full flex justify-center"
                  >
                    <CourseSelector
                      university={currentUser.university}
                      initialCourseId={currentUser.course?.id}
                      onBack={handleBackToUniversity}
                      onComplete={handleCourseSelect}
                    />
                  </motion.div>
                )}

                {flowStep === 'dashboard' && currentUser && (
                  <motion.div
                    key="dashboard-step"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    <WelcomeDashboard
                      user={currentUser}
                      onLogout={handleLogout}
                      onReplayIntro={handleReplayIntro}
                      onEditAcademicProfile={handleEditAcademicProfile}
                      onUpdateUser={handleUpdateUser}
                      logoUrl={ENEMIND_LOGO}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </main>

        {/* Clean Minimal Footer (Onboarding only) */}
        {!isPreloading && flowStep !== 'dashboard' && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="pb-6 pt-3 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-neutral-400"
          >
            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-neutral-700 transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-neutral-700 transition-colors"
            >
              Terms of Service
            </a>
            <span>© 2026 ENEMIND. All rights reserved.</span>
          </motion.footer>
        )}
      </div>
    </AuthProvider>
  );
}
