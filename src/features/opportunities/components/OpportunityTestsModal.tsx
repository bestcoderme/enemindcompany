import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, XCircle, Play, RotateCcw, Sparkles } from 'lucide-react';
import {
  runOpportunityEngineTests,
  OpportunityTestResult,
} from '../../../services/opportunities/opportunityTestRunner';

interface OpportunityTestsModalProps {
  onClose: () => void;
}

export const OpportunityTestsModal: React.FC<OpportunityTestsModalProps> = ({ onClose }) => {
  const [results, setResults] = useState<OpportunityTestResult[]>([]);
  const [allPassed, setAllPassed] = useState<boolean | null>(null);
  const [running, setRunning] = useState(false);

  const runTests = () => {
    setRunning(true);
    setTimeout(() => {
      const outcome = runOpportunityEngineTests();
      setResults(outcome.results);
      setAllPassed(outcome.allPassed);
      setRunning(false);
    }, 300);
  };

  useEffect(() => {
    runTests();
  }, []);

  const passedCount = results.filter((r) => r.passed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-5 sm:p-6 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                Phase 3 Opportunity Discovery Test Suite
              </h3>
              <p className="text-xs text-slate-400">
                Automated verification of discovery, search, GPA eligibility, and tracking.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary Card */}
        <div className="my-4 p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {allPassed === true ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : allPassed === false ? (
              <XCircle className="w-8 h-8 text-rose-400" />
            ) : (
              <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
            )}
            <div>
              <span className="text-xs font-semibold text-slate-400 block">
                Test Execution Status
              </span>
              <span className="text-sm font-black text-slate-100">
                {allPassed === true
                  ? `All ${results.length} Tests Passed (100% Green)`
                  : allPassed === false
                  ? `${results.length - passedCount} Tests Failed`
                  : 'Running Tests...'}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={running}
            onClick={runTests}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
            <span>Re-run Suite</span>
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {results.map((res, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                res.passed
                  ? 'bg-slate-950/60 border-emerald-500/20 text-slate-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
              }`}
            >
              {res.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="text-xs font-bold text-slate-100 mb-0.5">
                  {res.name}
                </div>
                <div className="text-[11px] text-slate-400">{res.message}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white transition-colors"
          >
            Close Suite
          </button>
        </div>
      </div>
    </div>
  );
};
