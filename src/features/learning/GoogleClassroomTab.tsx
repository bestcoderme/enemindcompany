/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Calendar,
  Clock,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileText,
  Users,
  RefreshCw,
  FolderLock,
  Sparkles,
} from 'lucide-react';
import { classroomService } from '../../services/google/classroomService';
import { GoogleClassroomCourse, GoogleClassroomCourseWork } from '../../types/google';
import { UserProfile } from '../../types/user';

interface GoogleClassroomTabProps {
  user: UserProfile | null;
  onOpenCloudSettings: () => void;
}

export const GoogleClassroomTab: React.FC<GoogleClassroomTabProps> = ({
  user,
  onOpenCloudSettings,
}) => {
  const [courses, setCourses] = useState<GoogleClassroomCourse[]>([]);
  const [coursework, setCoursework] = useState<Record<string, GoogleClassroomCourseWork[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchClassroomData();
  }, []);

  const fetchClassroomData = async () => {
    setIsLoading(true);
    try {
      const clsCourses = await classroomService.getCourses();
      setCourses(clsCourses);
      if (clsCourses.length > 0) {
        setSelectedCourseId(clsCourses[0].id);
        const workMap: Record<string, GoogleClassroomCourseWork[]> = {};
        for (const c of clsCourses) {
          const works = await classroomService.getCourseWork(c.id);
          workMap[c.id] = works;
        }
        setCoursework(workMap);
      }
    } catch (e) {
      console.warn('Classroom fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const activeCoursework = selectedCourseId ? coursework[selectedCourseId] || [] : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
              Google Classroom Ecosystem
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
              Live Google Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Access your university and instructor-led Google Classroom courses, active coursework, and due dates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={fetchClassroomData}
            className="p-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl transition-all cursor-pointer"
            title="Refresh Classroom Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href="https://classroom.google.com"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Google Classroom</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-neutral-400 text-xs">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-neutral-300" />
          <p>Syncing courses and coursework from Google Classroom API...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="p-10 bg-white rounded-3xl border border-neutral-200 text-center space-y-3">
          <GraduationCap className="w-12 h-12 mx-auto text-neutral-300" />
          <h3 className="text-sm font-bold text-neutral-900">No Google Classroom Courses Linked</h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            Connect your university Google account with Classroom permissions enabled to sync active campus modules.
          </p>
          <button
            type="button"
            onClick={onOpenCloudSettings}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Manage Google Permissions</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Course Selector (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-neutral-200 p-3 space-y-2 max-h-[640px] overflow-y-auto">
            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
              Enrolled Campus Courses ({courses.length})
            </h3>

            {courses.map((cls) => {
              const isSelected = cls.id === selectedCourseId;
              const worksCount = coursework[cls.id]?.length || 0;

              return (
                <div
                  key={cls.id}
                  onClick={() => setSelectedCourseId(cls.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-neutral-50/70 border-neutral-200 hover:bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        isSelected ? 'bg-amber-400 text-neutral-950' : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {cls.section || 'Classroom'}
                    </span>
                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? 'text-neutral-300' : 'text-neutral-400'
                      }`}
                    >
                      {worksCount} assignments
                    </span>
                  </div>

                  <h4 className="text-xs font-bold leading-snug line-clamp-1 mb-1">{cls.name}</h4>
                  <p
                    className={`text-[11px] line-clamp-2 leading-relaxed mb-3 ${
                      isSelected ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {cls.descriptionHeading || cls.room || 'University Academic Unit'}
                  </p>

                  <div className="pt-2 border-t border-neutral-200/40 text-[10px] flex items-center justify-between">
                    <span className={isSelected ? 'text-neutral-300' : 'text-neutral-400'}>
                      Class Code: {cls.enrollmentCode || 'Direct'}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold">
                      <span>View Tasks</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Coursework & Assignment Stream (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-neutral-200 p-6 flex flex-col justify-between space-y-6">
            {selectedCourse ? (
              <div className="space-y-6">
                {/* Course Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900">
                        {selectedCourse.section || 'Academic Unit'}
                      </span>
                      {selectedCourse.room && (
                        <span className="text-xs text-neutral-400 font-medium">
                          Room: {selectedCourse.room}
                        </span>
                      )}
                    </div>
                    <h2 className="text-base sm:text-lg font-bold font-heading text-neutral-900">
                      {selectedCourse.name}
                    </h2>
                    <p className="text-xs text-neutral-600 mt-1">
                      {selectedCourse.descriptionHeading || 'Google Classroom Stream'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={selectedCourse.alternateLink}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Open Course in Classroom</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                {/* Coursework List */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Active Coursework & Assignments ({activeCoursework.length})</span>
                  </h4>

                  {activeCoursework.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-center text-xs text-neutral-400">
                      <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-emerald-500" />
                      <p className="font-bold text-neutral-700">All caught up!</p>
                      <p>No pending coursework assignments for this class.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activeCoursework.map((cw) => {
                        const dueDateStr = cw.dueDate
                          ? `${cw.dueDate.year}-${String(cw.dueDate.month).padStart(2, '0')}-${String(cw.dueDate.day).padStart(2, '0')}`
                          : null;

                        return (
                          <div
                            key={cw.id}
                            className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200 hover:border-neutral-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                          >
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase">
                                  {cw.workType || 'ASSIGNMENT'}
                                </span>
                                {dueDateStr && (
                                  <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    <span>Due: {dueDateStr}</span>
                                  </span>
                                )}
                              </div>
                              <h3 className="text-xs sm:text-sm font-bold text-neutral-900">{cw.title}</h3>
                              {cw.description && (
                                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                                  {cw.description}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {cw.maxPoints && (
                                <span className="text-xs font-bold text-neutral-700">
                                  {cw.maxPoints} pts
                                </span>
                              )}
                              <a
                                href={cw.alternateLink}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <span>Turn In</span>
                                <ExternalLink className="w-3 h-3 text-neutral-400" />
                              </a>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-24 text-neutral-400">
                <GraduationCap className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
                <p className="text-sm font-bold text-neutral-700">No Course Selected</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
