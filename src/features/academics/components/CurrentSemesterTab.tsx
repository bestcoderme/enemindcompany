import React, { useState } from 'react';
import { Semester, StudentAcademicRecord, UniversityGradingSystem } from '../../../types';
import { Plus, Edit2, Trash2, BookOpen, AlertCircle, CheckCircle2, ChevronRight, Calculator } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface CurrentSemesterTabProps {
  semesters: Semester[];
  activeSemesterId: string | null;
  records: StudentAcademicRecord[];
  gradingSystem: UniversityGradingSystem;
  onSelectSemester: (semesterId: string) => void;
  onOpenAddSemester: () => void;
  onOpenAddUnit: () => void;
  onEditUnit: (record: StudentAcademicRecord) => void;
  onDeleteUnit: (recordId: string) => void;
}

export const CurrentSemesterTab: React.FC<CurrentSemesterTabProps> = ({
  semesters,
  activeSemesterId,
  records,
  gradingSystem,
  onSelectSemester,
  onOpenAddSemester,
  onOpenAddUnit,
  onEditUnit,
  onDeleteUnit,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const activeSemester = semesters.find((s) => s.id === activeSemesterId) || semesters[0];

  // Calculate live current semester stats
  const activeRecords = activeSemester
    ? records.filter((r) => r.semesterId === activeSemester.id)
    : [];

  let totalCredits = 0;
  let totalPoints = 0;
  for (const r of activeRecords) {
    totalCredits += r.creditHours;
    totalPoints += r.weightedPoints;
  }
  const currentSemesterGpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  if (semesters.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200 text-center shadow-xs">
        <BookOpen className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-900 font-heading">
          No Semesters Created Yet
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1 mb-5">
          Add your active or past academic semester to begin recording units and tracking your GPA.
        </p>
        <button
          type="button"
          id="current-sem-add-first-btn"
          onClick={onOpenAddSemester}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all cursor-pointer"
        >
          Create Semester
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Semester Switcher Navigation Pill Bar */}
      <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          {semesters.map((sem) => {
            const isActive = sem.id === activeSemester?.id;
            return (
              <button
                key={sem.id}
                type="button"
                id={`semester-tab-${sem.id}`}
                onClick={() => onSelectSemester(sem.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
                }`}
              >
                <span>{sem.academicYearName} — {sem.name}</span>
                {sem.status === 'active' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          id="add-new-semester-pill-btn"
          onClick={onOpenAddSemester}
          className="px-3.5 py-2 rounded-xl bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-600" />
          <span>New Semester</span>
        </button>
      </div>

      {/* Active Semester Summary Banner */}
      {activeSemester && (
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-neutral-900 font-heading">
                {activeSemester.academicYearName} · {activeSemester.name}
              </h2>
              <Badge variant={activeSemester.status === 'active' ? 'emerald' : 'neutral'}>
                {String(activeSemester.status || 'active').toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Enrolled in {activeRecords.length} unit{activeRecords.length === 1 ? '' : 's'} · {totalCredits} Total Credits
            </p>
          </div>

          <div className="flex items-center gap-4 sm:border-l sm:border-neutral-100 sm:pl-6">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block">
                Semester GPA
              </span>
              <span className="text-2xl font-black text-emerald-600 font-heading">
                {currentSemesterGpa}
              </span>
            </div>

            <button
              type="button"
              id="add-unit-button"
              onClick={onOpenAddUnit}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Unit / Marks</span>
            </button>
          </div>
        </div>
      )}

      {/* Units Table */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-neutral-900 font-heading">
            Enrolled Units & Assessments
          </h3>
          <span className="text-xs text-neutral-500 font-medium">
            Grading Rule: {gradingSystem.name}
          </span>
        </div>

        {activeRecords.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-neutral-200 rounded-xl">
            <BookOpen className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-neutral-700">No units added in this semester.</p>
            <p className="text-[11px] text-neutral-400 mt-0.5 mb-3">
              Click &apos;Add Unit / Marks&apos; to record coursework CAT and examination scores.
            </p>
            <button
              type="button"
              id="empty-add-unit-btn"
              onClick={onOpenAddUnit}
              className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold cursor-pointer"
            >
              Add First Unit
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 text-neutral-500 font-semibold">
                  <th className="pb-3">Unit Code</th>
                  <th className="pb-3">Unit Name</th>
                  <th className="pb-3 text-center">Credits</th>
                  <th className="pb-3 text-center">CAT (30)</th>
                  <th className="pb-3 text-center">Exam (70)</th>
                  <th className="pb-3 text-center">Total (100)</th>
                  <th className="pb-3 text-center">Grade</th>
                  <th className="pb-3 text-center">Grade Point</th>
                  <th className="pb-3 text-center">Quality Pts</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-700">
                {activeRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3.5 font-bold text-neutral-900">{rec.unitCode}</td>
                    <td className="py-3.5 font-medium text-neutral-800">{rec.unitName}</td>
                    <td className="py-3.5 text-center font-semibold text-neutral-700">
                      {rec.creditHours}
                    </td>
                    <td className="py-3.5 text-center text-neutral-600">
                      {rec.assessments.catScore ?? 0}
                    </td>
                    <td className="py-3.5 text-center text-neutral-600">
                      {rec.assessments.examScore ?? 0}
                    </td>
                    <td className="py-3.5 text-center font-bold text-neutral-900">
                      {rec.totalMarks}%
                    </td>
                    <td className="py-3.5 text-center">
                      <span className="inline-block px-2 py-0.5 rounded-md font-bold text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rec.grade}
                      </span>
                    </td>
                    <td className="py-3.5 text-center font-bold text-neutral-900">
                      {rec.gradePoint.toFixed(1)}
                    </td>
                    <td className="py-3.5 text-center font-bold text-emerald-700">
                      {rec.weightedPoints.toFixed(1)}
                    </td>
                    <td className="py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          id={`edit-unit-${rec.id}`}
                          onClick={() => onEditUnit(rec)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="Edit Marks"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {deleteConfirmId === rec.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteUnit(rec.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-2 py-1 rounded bg-rose-600 text-white text-[10px] font-bold cursor-pointer"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-2 py-1 rounded bg-neutral-200 text-neutral-700 text-[10px] cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            id={`delete-unit-${rec.id}`}
                            onClick={() => setDeleteConfirmId(rec.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Unit"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
