/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserProfile } from '../types/user';
import { IntelligenceTestRunner, TestResult } from '../services/intelligence/intelligenceTestRunner';
import { LearningTestRunner, LearningTestResult } from '../services/learning/learningTestRunner';
import { ShieldCheck, Play, CheckCircle2, XCircle, RefreshCw, X, Award, AlertCircle, BookOpen, GraduationCap } from 'lucide-react';
import { Badge } from './common/Badge';

interface IntelligenceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
}

export const IntelligenceVerificationModal: React.FC<IntelligenceVerificationModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [activeSuite, setActiveSuite] = useState<'intelligence' | 'learning'>('learning');
  const [isRunning, setIsRunning] = useState(false);
  const [intelResults, setIntelResults] = useState<TestResult[] | null>(null);
  const [learningResults, setLearningResults] = useState<LearningTestResult[] | null>(null);

  if (!isOpen) return null;

  const handleRunTests = async () => {
    setIsRunning(true);
    try {
      if (activeSuite === 'learning') {
        const res = await LearningTestRunner.runAllTests(user);
        setLearningResults(res);
      } else {
        const res = await IntelligenceTestRunner.runAllTests(user);
        setIntelResults(res);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsRunning(false);
    }
  };

  const currentResults = activeSuite === 'learning' ? learningResults : intelResults;
  const totalTests = currentResults ? currentResults.length : 0;
  const passedTests = currentResults ? currentResults.filter((r) => r.passed).length : 0;

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-heading text-neutral-900">
                  Enemind System & Architectural Test Suite
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  22 Verification Checks
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Automated tests across Learning, Google Workspace, Documents Locker & Intelligence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Suite Selector Tabs */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl mb-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSuite('learning')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSuite === 'learning'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Phase 6: Learning & Google Education</span>
            <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded-md">10 Tests</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSuite('intelligence')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeSuite === 'intelligence'
                ? 'bg-white text-neutral-900 shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            <span>Intelligence & Privacy Suite</span>
            <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded-md">12 Tests</span>
          </button>
        </div>

        {/* Action / Overview */}
        <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 mb-4 shrink-0 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-neutral-800">
              {currentResults
                ? `Suite Completed: ${passedTests} of ${totalTests} verification checks passed`
                : activeSuite === 'learning'
                ? 'Validates course enrollments, 100% certificate issuance, notes sync, study groups, Google Classroom & document locker privacy.'
                : 'Validates role adaptation, chat authorization, event telemetry, lifecycle tracking & zero-leak privacy.'}
            </p>
          </div>

          <button
            onClick={handleRunTests}
            disabled={isRunning}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-sm shrink-0 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{currentResults ? 'Re-run Tests' : 'Run Suite'}</span>
              </>
            )}
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 divide-y divide-neutral-100">
          {currentResults ? (
            currentResults.map((test) => (
              <div key={test.id} className="pt-2.5 pb-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  {test.passed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900">
                        {test.name}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-neutral-200/70 text-neutral-700">
                        {test.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 mt-0.5 leading-snug">
                      {test.message}
                    </p>
                  </div>
                </div>

                <Badge variant={test.passed ? 'emerald' : 'rose'} size="sm">
                  {test.passed ? 'PASSED' : 'FAILED'}
                </Badge>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-neutral-400 text-xs">
              Press "Run Suite" to execute live system tests.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-neutral-100 mt-4 shrink-0 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500 font-medium">
            Strict Zero-Leak Privacy & Google Education Ecosystem Certified
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
