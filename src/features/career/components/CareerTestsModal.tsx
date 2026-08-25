/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerTestSuiteReport, CareerTestRunner } from '../../../services/career/careerTestRunner';
import {
  X,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';

interface CareerTestsModalProps {
  onClose: () => void;
}

export const CareerTestsModal: React.FC<CareerTestsModalProps> = ({ onClose }) => {
  const [report, setReport] = useState<CareerTestSuiteReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const suiteReport = CareerTestRunner.runAllTests();
      setReport(suiteReport);
      setIsRunning(false);
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl max-h-[85vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between gap-4 bg-neutral-900 text-white shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-bold font-heading">
                Phase 4 Automated Verification Suite
              </h2>
            </div>
            <p className="text-xs text-neutral-400">
              Validates career catalog integrity, assessment algorithms, matching weights, and roadmap progression.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Action & Metric Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
            <div>
              <span className="text-xs font-bold text-neutral-800">
                {report ? `Last Run: ${new Date(report.timestamp).toLocaleTimeString()}` : 'Ready to execute validation suite'}
              </span>
              {report && (
                <p className="text-xs text-emerald-700 font-semibold">
                  {report.passedCount} Passed · {report.failedCount} Failed ({report.successRate}% Success)
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleRunTests}
              disabled={isRunning}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Running Suite...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>{report ? 'Re-run Tests' : 'Run Test Suite'}</span>
                </>
              )}
            </button>
          </div>

          {/* Test Results List */}
          {report && (
            <div className="space-y-2.5">
              {report.results.map((test) => {
                const isPassed = test.status === 'passed';
                return (
                  <div
                    key={test.id}
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 transition-all ${
                      isPassed
                        ? 'bg-white border-emerald-200/80 shadow-xs'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 shrink-0 ${
                        isPassed
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-neutral-900">{test.name}</h4>
                          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600">
                            {test.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400 flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" /> {test.durationMs}ms
                        </span>
                      </div>
                      <p className="text-neutral-600 leading-relaxed">
                        {test.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
