/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  BookOpen,
  Clock,
  Star,
  Users,
  Award,
  Video,
  FileText,
  GraduationCap,
  PlayCircle,
  FolderLock,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Course, Enrollment } from '../../types/learning';

interface CourseCardProps {
  course: Course;
  enrollment?: Enrollment;
  onSelect: (course: Course) => void;
  onEnroll?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  enrollment,
  onSelect,
  onEnroll,
}) => {
  const isEnrolled = !!enrollment;
  const isCompleted = enrollment?.status === 'COMPLETED';

  return (
    <div className="bg-white rounded-3xl border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group">
      {/* Top Banner & Thumbnail */}
      <div className="relative h-44 w-full bg-neutral-100 overflow-hidden cursor-pointer" onClick={() => onSelect(course)}>
        <img
          src={course.thumbnail}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-neutral-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-xs text-neutral-900 shadow-xs">
              {course.category}
            </span>
            {course.googleClassroomId && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-950 flex items-center gap-1 shadow-xs">
                <GraduationCap className="w-3 h-3" />
                <span>Classroom</span>
              </span>
            )}
          </div>

          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shadow-xs ${
            course.isFree
              ? 'bg-emerald-500 text-white'
              : 'bg-neutral-900 text-white'
          }`}>
            {course.isFree ? 'FREE' : `${course.currency} ${course.price}`}
          </span>
        </div>

        {/* Level & Course Format Pill */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs font-semibold">
              {course.level}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs">
              {course.courseType.replace('_', ' ')}
            </span>
          </div>

          <div className="flex items-center gap-1 text-amber-300 font-bold bg-black/50 px-2 py-0.5 rounded-md backdrop-blur-xs">
            <Star className="w-3 h-3 fill-amber-300" />
            <span>{course.rating}</span>
            <span className="text-[10px] text-white/70 font-normal">({course.ratingCount})</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between cursor-pointer" onClick={() => onSelect(course)}>
        <div>
          {/* Provider / Instructor Info */}
          <div className="flex items-center gap-2 mb-2.5">
            {course.providerAvatar ? (
              <img
                src={course.providerAvatar}
                alt={course.providerName}
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded-full object-cover"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-[10px] font-bold text-neutral-700">
                {course.providerName.charAt(0)}
              </div>
            )}
            <span className="text-xs text-neutral-600 font-semibold truncate">
              {course.providerName}
            </span>
          </div>

          <h3 className="text-sm font-bold text-neutral-900 font-heading leading-snug mb-1.5 line-clamp-2 group-hover:text-emerald-700 transition-colors">
            {course.title}
          </h3>

          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed mb-3">
            {course.shortDescription}
          </p>

          {/* Skills Badges */}
          <div className="flex flex-wrap gap-1 mb-4">
            {course.skills.slice(0, 3).map((sk) => (
              <span
                key={sk}
                className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-md text-[10px] font-medium"
              >
                {sk}
              </span>
            ))}
            {course.skills.length > 3 && (
              <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded-md text-[10px]">
                +{course.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Progress Bar (If Enrolled) */}
        {isEnrolled && (
          <div className="mb-4 pt-3 border-t border-neutral-100">
            <div className="flex items-center justify-between text-[11px] font-bold mb-1.5">
              <span className={isCompleted ? 'text-emerald-700 font-bold' : 'text-neutral-700'}>
                {isCompleted ? 'Completed (100%)' : `${enrollment.progress}% Finished`}
              </span>
              <span className="text-neutral-400 font-medium">
                {enrollment.completedLessons?.length || 0} / {course.lessons?.length || 0} lessons
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  isCompleted ? 'bg-emerald-500' : 'bg-neutral-900'
                }`}
                style={{ width: `${enrollment.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Card Footer */}
        <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>{course.duration}</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-neutral-400" />
              <span>{course.enrollmentCount} students</span>
            </span>
          </div>

          {isEnrolled ? (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Continue</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onEnroll) onEnroll(course);
                else onSelect(course);
              }}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              {course.isFree ? 'Enroll Free' : `Enroll (${course.currency} ${course.price})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
