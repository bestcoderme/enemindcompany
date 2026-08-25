import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, Semester, StudentAcademicRecord, SemesterStatus } from '../../types';
import { AcademicService } from '../../services/academic/academicService';
import { AcademicRulesResolver } from '../../services/academic/academicRulesResolver';
import { Badge } from '../../components/common/Badge';
import { AcademicOverviewTab } from './components/AcademicOverviewTab';
import { CurrentSemesterTab } from './components/CurrentSemesterTab';
import { AcademicHistoryTab } from './components/AcademicHistoryTab';
import { TargetGpaTab } from './components/TargetGpaTab';
import { AddUnitModal } from './components/AddUnitModal';
import { AddSemesterModal } from './components/AddSemesterModal';
import { GradingRulesReferenceModal } from './components/GradingRulesReferenceModal';
import { AcademicTestRunnerModal } from './components/AcademicTestRunnerModal';

import {
  GraduationCap,
  Calculator,
  Award,
  BookOpen,
  Calendar,
  Target,
  Download,
  ShieldCheck,
  Plus,
  RefreshCw,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';

interface AcademicsViewProps {
  user: UserProfile | null;
  onNavigate: (viewId: string) => void;
}

type TabType = 'overview' | 'current' | 'history' | 'target';

export const AcademicsView: React.FC<AcademicsViewProps> = ({ user }) => {
  const userEmail = user?.email || 'student@enemind.com';
  const university = user?.university;
  const programmeCategory = user?.course?.category;

  // Resolve official institutional grading rules
  const gradingSystem = AcademicRulesResolver.resolveGradingSystem(
    university?.id,
    university?.country,
    user?.course?.id
  );

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Academic State
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [records, setRecords] = useState<StudentAcademicRecord[]>([]);
  const [activeSemesterId, setActiveSemesterId] = useState<string | null>(null);

  // Modals state
  const [isAddSemesterOpen, setIsAddSemesterOpen] = useState(false);
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false);
  const [editingUnitRecord, setEditingUnitRecord] = useState<StudentAcademicRecord | null>(null);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isTestRunnerOpen, setIsTestRunnerOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Load user data
  const refreshData = useCallback(() => {
    const sems = AcademicService.getSemesters(userEmail);
    const recs = AcademicService.getAcademicRecords(userEmail);
    setSemesters(sems);
    setRecords(recs);

    // Auto-select active semester or first semester
    if (sems.length > 0) {
      const active = sems.find((s) => s.status === 'active') || sems[0];
      setActiveSemesterId((prev) => (prev && sems.some((s) => s.id === prev) ? prev : active.id));
    } else {
      setActiveSemesterId(null);
    }
  }, [userEmail]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Compute live summary
  const summary = AcademicService.getAcademicSummary(
    userEmail,
    university?.id,
    programmeCategory
  );

  const activeSemester = semesters.find((s) => s.id === activeSemesterId) || semesters[0];

  // Handler: Create Semester
  const handleSaveSemester = (data: {
    name: string;
    academicYearName: string;
    semesterNumber: number;
    status: SemesterStatus;
  }) => {
    const created = AcademicService.createSemester(userEmail, data);
    refreshData();
    setActiveSemesterId(created.id);
    setActiveTab('current');
    showToast(`Semester "${data.name}" created successfully.`);
  };

  // Handler: Update Semester Status
  const handleUpdateSemesterStatus = (semesterId: string, status: SemesterStatus) => {
    AcademicService.updateSemester(userEmail, semesterId, { status });
    refreshData();
    showToast(`Semester status updated to ${status}.`);
  };

  // Handler: Archive Semester
  const handleArchiveSemester = (semesterId: string) => {
    AcademicService.archiveSemester(userEmail, semesterId);
    refreshData();
    showToast('Semester archived.');
  };

  // Handler: Delete Semester
  const handleDeleteSemester = (semesterId: string) => {
    AcademicService.deleteSemester(userEmail, semesterId);
    refreshData();
    showToast('Semester and attached unit records deleted.');
  };

  // Handler: Save Unit (Create or Update)
  const handleSaveUnit = (data: {
    semesterId: string;
    unitCode: string;
    unitName: string;
    creditHours: number;
    catScore?: number;
    catMax?: number;
    examScore?: number;
    examMax?: number;
    remarks?: string;
  }) => {
    if (editingUnitRecord) {
      const res = AcademicService.updateAcademicRecord(userEmail, editingUnitRecord.id, {
        ...data,
        universityId: university?.id,
        programmeCategory,
      });
      if (res.error) return { error: res.error };
      refreshData();
      showToast(`Unit ${data.unitCode} updated.`);
      return {};
    } else {
      const res = AcademicService.createAcademicRecord(userEmail, {
        ...data,
        universityId: university?.id,
        programmeCategory,
      });
      if (res.error) return { error: res.error };
      refreshData();
      showToast(`Unit ${data.unitCode} added with marks.`);
      return {};
    }
  };

  // Handler: Delete Unit
  const handleDeleteUnit = (recordId: string) => {
    AcademicService.deleteAcademicRecord(userEmail, recordId);
    refreshData();
    showToast('Unit removed.');
  };

  // Handler: Save Target GPA
  const handleSaveTargetGpa = (targetGpa: number) => {
    AcademicService.setTargetGpa(userEmail, targetGpa);
    refreshData();
  };

  // Handler: Seed Sample Demo Data
  const handleSeedDemo = () => {
    AcademicService.seedDemoAcademicData(userEmail, university?.id);
    refreshData();
    showToast('Sample academic transcript loaded.');
  };

  // Handler: Export CSV
  const handleExportCsv = () => {
    AcademicService.exportToCsv(
      userEmail,
      user?.name || 'Student',
      university?.name || 'University',
      user?.course?.name || 'Degree Programme'
    );
    showToast('Academic transcript exported to CSV.');
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 px-4 py-2.5 bg-neutral-900 text-white text-xs font-bold rounded-2xl shadow-xl border border-neutral-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
              Academic Engine & GPA
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            {university?.name || 'Your University'}
            {user?.course?.name ? ` · ${user.course.name}` : ''}
          </p>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Institutional Grading System Pill */}
          <button
            type="button"
            id="open-grading-rules-btn"
            onClick={() => setIsRulesModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="View institutional grading rules"
          >
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>{gradingSystem.name}</span>
          </button>

          {/* Test Suite Verification Runner */}
          <button
            type="button"
            id="open-engine-tests-btn"
            onClick={() => setIsTestRunnerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Run 10 Unit Tests on Academic Engine"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verify Math</span>
          </button>

          {/* Export CSV Transcript */}
          {summary.semesters.length > 0 && (
            <button
              type="button"
              id="export-transcript-csv-btn"
              onClick={handleExportCsv}
              className="px-3 py-1.5 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              title="Download official CSV transcript"
            >
              <Download className="w-3.5 h-3.5 text-neutral-500" />
              <span>Export CSV</span>
            </button>
          )}

          {/* Add Semester Button */}
          <button
            type="button"
            id="header-add-semester-btn"
            onClick={() => setIsAddSemesterOpen(true)}
            className="px-4 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Semester</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-neutral-200 pb-px overflow-x-auto">
        <button
          type="button"
          id="tab-academic-overview"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'overview'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Overview</span>
        </button>

        <button
          type="button"
          id="tab-current-semester"
          onClick={() => setActiveTab('current')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'current'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Current Semester & Marks</span>
          {activeSemester && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          type="button"
          id="tab-academic-history"
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'history'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Academic History ({semesters.length})</span>
        </button>

        <button
          type="button"
          id="tab-target-gpa"
          onClick={() => setActiveTab('target')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'target'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Target className="w-4 h-4 text-emerald-600" />
          <span>Target GPA & &quot;What-If&quot;</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === 'overview' && (
          <AcademicOverviewTab
            summary={summary}
            gradingSystem={gradingSystem}
            onOpenTargetCalculator={() => setActiveTab('target')}
            onOpenAddSemester={() => setIsAddSemesterOpen(true)}
            onOpenDemoLoader={handleSeedDemo}
          />
        )}

        {activeTab === 'current' && (
          <CurrentSemesterTab
            semesters={semesters}
            activeSemesterId={activeSemesterId}
            records={records}
            gradingSystem={gradingSystem}
            onSelectSemester={(semId) => setActiveSemesterId(semId)}
            onOpenAddSemester={() => setIsAddSemesterOpen(true)}
            onOpenAddUnit={() => {
              setEditingUnitRecord(null);
              setIsAddUnitOpen(true);
            }}
            onEditUnit={(record) => {
              setEditingUnitRecord(record);
              setIsAddUnitOpen(true);
            }}
            onDeleteUnit={handleDeleteUnit}
          />
        )}

        {activeTab === 'history' && (
          <AcademicHistoryTab
            semesters={summary.semesters}
            gradingSystem={gradingSystem}
            onUpdateSemesterStatus={handleUpdateSemesterStatus}
            onArchiveSemester={handleArchiveSemester}
            onDeleteSemester={handleDeleteSemester}
          />
        )}

        {activeTab === 'target' && (
          <TargetGpaTab
            summary={summary}
            gradingSystem={gradingSystem}
            onSaveTargetGpa={handleSaveTargetGpa}
          />
        )}
      </div>

      {/* Add / Edit Unit Modal */}
      {activeSemester && (
        <AddUnitModal
          isOpen={isAddUnitOpen}
          onClose={() => {
            setIsAddUnitOpen(false);
            setEditingUnitRecord(null);
          }}
          semesterId={activeSemester.id}
          semesterName={`${activeSemester.academicYearName} — ${activeSemester.name}`}
          gradingSystem={gradingSystem}
          editingRecord={editingUnitRecord}
          onSave={handleSaveUnit}
        />
      )}

      {/* Add Semester Modal */}
      <AddSemesterModal
        isOpen={isAddSemesterOpen}
        onClose={() => setIsAddSemesterOpen(false)}
        onSave={handleSaveSemester}
      />

      {/* Institutional Grading Rules Reference Modal */}
      <GradingRulesReferenceModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        gradingSystem={gradingSystem}
        university={university}
      />

      {/* Test Runner Suite Modal */}
      <AcademicTestRunnerModal
        isOpen={isTestRunnerOpen}
        onClose={() => setIsTestRunnerOpen(false)}
      />
    </div>
  );
};
