/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { BookOpen, Users, FileText, Upload, Plus, ChevronRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface TeacherCoursesWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const TeacherCoursesWidget: React.FC<TeacherCoursesWidgetProps> = ({
  onNavigate,
}) => {
  const classes = [
    { code: 'CS 301', title: 'Distributed Database Systems', students: 148, notesCount: 14 },
    { code: 'CS 402', title: 'Advanced Cloud Architectures', students: 86, notesCount: 9 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-emerald-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">Departmental Courses & Roster</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Lecturer & Faculty View</p>
            </div>
          </div>
          <Badge variant="emerald" size="sm">
            2 Active Classes
          </Badge>
        </div>

        <div className="space-y-2.5">
          {classes.map((c) => (
            <div key={c.code} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-[10px] font-black px-1.5 py-0.5 bg-neutral-200 text-neutral-800 rounded">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold text-neutral-900">{c.title}</span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-neutral-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-neutral-400" />
                    {c.students} Enrolled
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-neutral-400" />
                    {c.notesCount} Resources Uploaded
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigate('learning')}
                className="px-2.5 py-1.5 rounded-lg bg-white border border-neutral-200 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">CAT 2 Solutions pending</span>
        <button
          onClick={() => onNavigate('learning')}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Course Unit Materials</span>
        </button>
      </div>
    </div>
  );
};
