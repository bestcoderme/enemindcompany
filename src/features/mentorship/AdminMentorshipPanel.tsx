/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MentorService } from '../../services/mentorship/mentorService';
import { TeacherService } from '../../services/mentorship/teacherService';
import { SafetyModerationService } from '../../services/mentorship/safetyModerationService';
import { PlatformFeeService } from '../../services/mentorship/platformFeeService';
import { BookingService } from '../../services/mentorship/bookingService';
import { PayoutService } from '../../services/mentorship/payoutService';
import { MentorshipTestRunner, MentorshipTestResult } from '../../services/mentorship/mentorshipTestRunner';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Percent,
  RefreshCw,
  Award,
  DollarSign,
  Users,
  Search,
  Check,
} from 'lucide-react';

export const AdminMentorshipPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'verifications' | 'disputes' | 'fees' | 'payouts' | 'test_runner'>('verifications');

  const mentors = MentorService.getAllMentors();
  const teachers = TeacherService.getAllTeachers();
  const reports = SafetyModerationService.getAllReports();
  const payouts = PayoutService.getAllPayouts();

  // Fee state
  const [feePercent, setFeePercent] = useState<number>(PlatformFeeService.getFeePercentage());
  const [feeUpdated, setFeeUpdated] = useState(false);

  // Test Runner state
  const [testResults, setTestResults] = useState<{
    total: number;
    passed: number;
    failed: number;
    results: MentorshipTestResult[];
  } | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);

  const handleVerify = (id: string, type: 'MENTOR' | 'TEACHER', approve: boolean) => {
    if (type === 'MENTOR') {
      MentorService.setVerificationStatus(id, approve ? 'VERIFIED' : 'REJECTED', approve ? 'Admin verified' : 'Declined');
    } else {
      TeacherService.setVerificationStatus(id, approve ? 'VERIFIED' : 'REJECTED', approve ? 'Admin verified' : 'Declined');
    }
  };

  const handleUpdateFee = (e: React.FormEvent) => {
    e.preventDefault();
    PlatformFeeService.setFeePercentage(feePercent);
    setFeeUpdated(true);
    setTimeout(() => setFeeUpdated(false), 2000);
  };

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTimeout(() => {
      const res = MentorshipTestRunner.runAllTests();
      setTestResults(res);
      setIsRunningTests(false);
    }, 400);
  };

  return (
    <div className="p-6 bg-white rounded-3xl border border-neutral-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800 uppercase tracking-wide">
              Admin Governance & Safety Console
            </span>
          </div>
          <h2 className="text-xl font-black text-neutral-900 font-heading">
            Mentorship Ecosystem Operations
          </h2>
          <p className="text-xs text-neutral-500">
            Provider verification queue, dispute resolution center, commission controls, and test suite.
          </p>
        </div>

        <button
          onClick={handleRunTests}
          disabled={isRunningTests}
          className="py-2 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          <Play className="w-3.5 h-3.5" />
          <span>{isRunningTests ? 'Executing Unit Tests...' : 'Run Mentorship Test Suite'}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-100 text-xs font-bold">
        <button
          onClick={() => setActiveTab('verifications')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'verifications'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Verification Queue ({mentors.concat(teachers as any).filter((p: any) => p.verificationStatus === 'PENDING').length})
        </button>

        <button
          onClick={() => setActiveTab('disputes')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'disputes'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Disputes & Safety ({reports.filter((r) => r.status === 'OPEN').length})
        </button>

        <button
          onClick={() => setActiveTab('payouts')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'payouts'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          M-PESA Payout Queue ({payouts.filter((p) => p.status === 'PENDING').length})
        </button>

        <button
          onClick={() => setActiveTab('fees')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'fees'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Platform Commission Rate ({feePercent}%)
        </button>

        <button
          onClick={() => setActiveTab('test_runner')}
          className={`pb-2.5 px-3 border-b-2 transition-all cursor-pointer ${
            activeTab === 'test_runner'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          Automated Test Suite
        </button>
      </div>

      {/* TAB 1: Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mentors
              .map((m) => ({ ...m, providerType: 'MENTOR' as const }))
              .concat(teachers.map((t) => ({ ...t, providerType: 'TEACHER' as const })) as any)
              .map((p: any) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-neutral-200 text-neutral-800">
                        {p.providerType}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          p.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.verificationStatus === 'PENDING'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.verificationStatus}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900">{p.name}</h4>
                    <p className="text-xs text-neutral-600 mt-0.5">{p.headline}</p>

                    <div className="mt-2 text-[11px] text-neutral-500 space-y-1">
                      <div>Education: {p.education}</div>
                      <div>Proof notes: {p.verificationNotes || 'No notes provided'}</div>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 pt-3 mt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleVerify(p.id, p.providerType, false)}
                      className="px-3 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 text-xs font-semibold hover:bg-neutral-100"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(p.id, p.providerType, true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 flex items-center gap-1"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Approve & Verify</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 2: Disputes */}
      {activeTab === 'disputes' && (
        <div className="space-y-3">
          {reports.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs bg-neutral-50 rounded-2xl">
              No disputes or reports submitted.
            </div>
          ) : (
            reports.map((report) => (
              <div key={report.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-rose-700 uppercase">{report.reason}</span>
                  <span className="text-neutral-400">{new Date(report.createdAt).toLocaleString()}</span>
                </div>
                <p className="text-neutral-800">{report.description}</p>
                <div className="text-neutral-500 text-[11px]">
                  Reported by: {report.reporterName} ({report.reporterRole}) against {report.reportedName}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => SafetyModerationService.resolveReport(report.id, 'RESOLVED', 'Refund issued to student', true)}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                  >
                    Resolve & Issue Refund
                  </button>
                  <button
                    onClick={() => SafetyModerationService.resolveReport(report.id, 'DISMISSED', 'No infraction found', false)}
                    className="px-3 py-1 rounded-lg border border-neutral-300 text-neutral-600 text-xs"
                  >
                    Dismiss Report
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Payout Queue */}
      {activeTab === 'payouts' && (
        <div className="space-y-3">
          {payouts.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs bg-neutral-50 rounded-2xl">
              No withdrawal requests in queue.
            </div>
          ) : (
            payouts.map((payout) => (
              <div key={payout.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-neutral-900 block">{payout.providerName}</span>
                  <span className="text-neutral-500">M-PESA: {payout.destination} · Ref: {payout.reference}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-black text-neutral-900">{payout.currency} {payout.amount}</span>
                  {payout.status === 'PENDING' && (
                    <button
                      onClick={() => PayoutService.processPayout(payout.id, 'COMPLETED', 'Approved')}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 text-white font-bold"
                    >
                      Authorize M-PESA Transfer
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 4: Fee Controller */}
      {activeTab === 'fees' && (
        <form onSubmit={handleUpdateFee} className="max-w-md space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
            <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-emerald-600" />
              <span>Platform Take-Rate Configuration</span>
            </h4>
            <p className="text-neutral-600">
              Set the standard commission percentage automatically deducted from paid student bookings.
            </p>
            <div>
              <label className="font-bold text-neutral-700 block mb-1">Commission Percentage (0% - 50%)</label>
              <input
                type="number"
                min="0"
                max="50"
                value={feePercent}
                onChange={(e) => setFeePercent(parseFloat(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl bg-white border border-neutral-200 font-black text-sm"
              />
            </div>
            {feeUpdated && (
              <p className="text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>Commission rate updated successfully!</span>
              </p>
            )}
            <button
              type="submit"
              className="py-2 px-5 rounded-xl bg-neutral-900 text-white font-bold hover:bg-neutral-800"
            >
              Save Fee Rate
            </button>
          </div>
        </form>
      )}

      {/* TAB 5: Automated Test Suite */}
      {activeTab === 'test_runner' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-neutral-900 font-heading">
              Phase 5 Mentorship Automated Unit Tests
            </h4>
            <button
              onClick={handleRunTests}
              className="py-1.5 px-3 rounded-lg bg-neutral-900 text-white font-bold text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Re-run Tests</span>
            </button>
          </div>

          {!testResults ? (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-200 text-xs text-neutral-500">
              Click "Run Mentorship Test Suite" to execute assertions across availability, double-booking prevention, commission rates, and review integrity.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  {testResults.passed} Passed
                </span>
                {testResults.failed > 0 && (
                  <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800">
                    {testResults.failed} Failed
                  </span>
                )}
                <span className="text-neutral-500">Total: {testResults.total} assertions</span>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.results.map((res, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                      res.passed ? 'bg-emerald-50/50 border-emerald-200' : 'bg-rose-50 border-rose-200'
                    }`}
                  >
                    <div>
                      <span className="font-extrabold uppercase text-[10px] tracking-wider text-neutral-500 block">
                        {res.suiteName}
                      </span>
                      <span className="font-bold text-neutral-900">{res.testName}</span>
                      <p className="text-[11px] text-neutral-600 mt-0.5">{res.message}</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-neutral-400">{res.durationMs}ms</span>
                      {res.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
