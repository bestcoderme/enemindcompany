import React, { useState } from 'react';
import { runAcademicEngineTests, TestResult } from '../../../services/academic/testRunner';
import { CheckCircle2, XCircle, Play, X, ShieldCheck, RefreshCw } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface AcademicTestRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicTestRunnerModal: React.FC<AcademicTestRunnerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [testResults, setTestResults] = useState<{
    allPassed: boolean;
    results: TestResult[];
  }>(() => runAcademicEngineTests());

  if (!isOpen) return null;

  const handleRerun = () => {
    const res = runAcademicEngineTests();
    setTestResults(res);
  };

  const passedCount = testResults.results.filter((r) => r.passed).length;
  const totalCount = testResults.results.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 font-heading">
                Academic Calculation Engine Verification
              </h3>
              <p className="text-xs text-neutral-500">Unit test suite for institutional math formulas</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="flex items-center justify-between bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-neutral-900 font-heading">
                  All Engine Tests Status:
                </span>
                <Badge variant={testResults.allPassed ? 'emerald' : 'rose'}>
                  {testResults.allPassed ? 'ALL TESTS PASSED' : 'TESTS FAILED'}
                </Badge>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                {passedCount} of {totalCount} unit test criteria passed with exact numerical precision.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRerun}
              className="px-3.5 py-2 rounded-xl bg-white border border-neutral-300 hover:bg-neutral-100 text-xs font-bold text-neutral-800 flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Rerun Suite</span>
            </button>
          </div>

          <div className="space-y-2">
            {testResults.results.map((test, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                  test.passed
                    ? 'bg-emerald-50/40 border-emerald-200 text-emerald-950'
                    : 'bg-rose-50/40 border-rose-200 text-rose-950'
                }`}
              >
                {test.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <span className="font-bold block">{test.name}</span>
                  <span className="text-neutral-600 text-[11px] mt-0.5 block">{test.message}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
