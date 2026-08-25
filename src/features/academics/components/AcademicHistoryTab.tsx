import React, { useState } from 'react';
import { SemesterSummary, UniversityGradingSystem, SemesterStatus } from '../../../types';
import { Calendar, CheckCircle2, Archive, Trash2, ChevronDown, ChevronUp, BookOpen, AlertTriangle } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface AcademicHistoryTabProps {
  semesters: SemesterSummary[];
  gradingSystem: UniversityGradingSystem;
  onUpdateSemesterStatus: (semesterId: string, status: SemesterStatus) => void;
  onArchiveSemester: (semesterId: string) => void;
  onDeleteSemester: (semesterId: string) => void;
}

export const AcademicHistoryTab: React.FC<AcademicHistoryTabProps> = ({
  semesters,
  gradingSystem,
  onUpdateSemesterStatus,
  onArchiveSemester,
  onDeleteSemester,
}) => {
  const [expandedSemesterId, setExpandedSemesterId] = useState<string | null>(
    semesters.length > 0 ? semesters[0].semesterId : null
  );
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  if (semesters.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200 text-center shadow-xs">
        <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-base font-bold text-neutral-900 font-heading">
          No Academic History Recorded
        </h3>
        <p className="text-xs text-neutral-500 max-w-sm mx-auto mt-1">
          As you complete academic semesters, your historical performance and quality points will be
          preserved here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-neutral-900 font-heading">
          All Semesters & Transcripts ({semesters.length})
        </h3>
        <span className="text-xs text-neutral-500">Scale: {gradingSystem.maxPoint.toFixed(1)} max</span>
      </div>

      <div className="space-y-3">
        {semesters.map((sem) => {
          const isExpanded = expandedSemesterId === sem.semesterId;
          return (
            <div
              key={sem.semesterId}
              className="rounded-2xl bg-white border border-neutral-200 shadow-xs overflow-hidden transition-all"
            >
              {/* Header Accordion Bar */}
              <div
                id={`history-sem-${sem.semesterId}`}
                onClick={() => setExpandedSemesterId(isExpanded ? null : sem.semesterId)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer hover:bg-neutral-50/70 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-800">
                    S{sem.semesterNumber}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-neutral-900 font-heading">
                        {sem.academicYearName} — {sem.semesterName}
                      </h4>
                      <Badge variant={sem.status === 'completed' ? 'emerald' : sem.status === 'active' ? 'neutral' : 'amber'}>
                        {String(sem.status || 'active').toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {sem.unitsCount} units · {sem.totalCredits} credits · {sem.totalWeightedPoints.toFixed(1)} quality points
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                      Semester GPA
                    </span>
                    <span className="text-xl font-black text-neutral-900 font-heading">
                      {sem.semesterGpa.toFixed(2)}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-neutral-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-neutral-400" />
                  )}
                </div>
              </div>

              {/* Expanded Units Details */}
              {isExpanded && (
                <div className="p-4 sm:p-5 border-t border-neutral-100 bg-neutral-50/40 space-y-4">
                  {/* Semester Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-neutral-200/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-neutral-600">Status:</span>
                      <select
                        id={`select-status-${sem.semesterId}`}
                        value={sem.status}
                        onChange={(e) =>
                          onUpdateSemesterStatus(
                            sem.semesterId,
                            e.target.value as SemesterStatus
                          )
                        }
                        className="text-xs font-bold rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-neutral-800"
                      >
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="upcoming">Upcoming</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        id={`archive-sem-${sem.semesterId}`}
                        onClick={() => onArchiveSemester(sem.semesterId)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-neutral-200 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" />
                        <span>Archive</span>
                      </button>

                      {confirmDeleteId === sem.semesterId ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => onDeleteSemester(sem.semesterId)}
                            className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1.5 rounded-lg text-xs bg-neutral-200 text-neutral-700 cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          id={`delete-sem-${sem.semesterId}`}
                          onClick={() => setConfirmDeleteId(sem.semesterId)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Units List */}
                  {sem.records.length === 0 ? (
                    <p className="text-xs text-neutral-500 italic py-2">
                      No units entered for this semester.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="text-neutral-500 font-semibold border-b border-neutral-200">
                            <th className="pb-2">Code</th>
                            <th className="pb-2">Name</th>
                            <th className="pb-2 text-center">Credits</th>
                            <th className="pb-2 text-center">CAT</th>
                            <th className="pb-2 text-center">Exam</th>
                            <th className="pb-2 text-center">Total</th>
                            <th className="pb-2 text-center">Grade</th>
                            <th className="pb-2 text-right">Points</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                          {sem.records.map((r) => (
                            <tr key={r.id}>
                              <td className="py-2.5 font-bold text-neutral-900">{r.unitCode}</td>
                              <td className="py-2.5 font-medium text-neutral-700">{r.unitName}</td>
                              <td className="py-2.5 text-center">{r.creditHours}</td>
                              <td className="py-2.5 text-center">{r.assessments.catScore ?? '—'}</td>
                              <td className="py-2.5 text-center">{r.assessments.examScore ?? '—'}</td>
                              <td className="py-2.5 text-center font-bold text-neutral-900">{r.totalMarks}%</td>
                              <td className="py-2.5 text-center font-bold text-emerald-600">{r.grade}</td>
                              <td className="py-2.5 text-right font-bold text-neutral-900">{r.weightedPoints.toFixed(1)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
