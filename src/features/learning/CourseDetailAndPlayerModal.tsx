/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  BookOpen,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Video,
  ExternalLink,
  GraduationCap,
  Download,
  Award,
  Clock,
  Users,
  Star,
  Lock,
  Calendar,
  Layers,
  FolderLock,
  FileSpreadsheet,
  HelpCircle,
  Flag,
  Share2,
  Sparkles,
  ChevronRight,
  Send,
} from 'lucide-react';
import { Course, Lesson, Enrollment, Certificate } from '../../types/learning';
import { UserProfile } from '../../types/user';
import { learningService } from '../../services/learning/learningService';

interface CourseDetailAndPlayerModalProps {
  course: Course | null;
  enrollment?: Enrollment;
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (course: Course) => void;
  onOpenCertificate: (certificate: Certificate) => void;
  onCreateNoteForLesson: (course: Course, lesson: Lesson) => void;
  onOpenReport: (course: Course) => void;
  onProgressUpdated?: () => void;
}

export const CourseDetailAndPlayerModal: React.FC<CourseDetailAndPlayerModalProps> = ({
  course,
  enrollment,
  user,
  isOpen,
  onClose,
  onEnroll,
  onOpenCertificate,
  onCreateNoteForLesson,
  onOpenReport,
  onProgressUpdated,
}) => {
  const [selectedLessonIndex, setSelectedLessonIndex] = useState(0);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionDocUrl, setSubmissionDocUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'resources' | 'discussion'>('content');
  const [generatedCert, setGeneratedCert] = useState<Certificate | null>(null);

  if (!isOpen || !course) return null;

  const isEnrolled = !!enrollment;
  const currentLesson: Lesson | undefined = course.lessons[selectedLessonIndex] || course.lessons[0];
  const isLessonCompleted = currentLesson && enrollment?.completedLessons?.includes(currentLesson.id);

  const handleToggleLessonComplete = (lessonId: string) => {
    if (!enrollment || !user) return;
    const isCurrentlyDone = enrollment.completedLessons?.includes(lessonId);
    const res = learningService.updateLessonProgress(
      user.id,
      course.id,
      lessonId,
      !isCurrentlyDone,
      user.name,
      user.email
    );

    if (res.certificate) {
      setGeneratedCert(res.certificate);
    }
    if (onProgressUpdated) onProgressUpdated();
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !currentLesson) return;
    setIsSubmitting(true);
    try {
      learningService.submitAssignment({
        assignmentId: currentLesson.id,
        studentId: user.id,
        studentName: user.name,
        submissionText,
        googleDocUrl: submissionDocUrl,
      });
      alert('Assignment submitted successfully! Your teacher will review it.');
      setSubmissionText('');
      setSubmissionDocUrl('');
      handleToggleLessonComplete(currentLesson.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-4 max-h-[92vh] flex flex-col"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                  {course.category} · {course.subject}
                </span>
                {course.googleClassroomId && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    Google Classroom Synced
                  </span>
                )}
              </div>
              <h2 className="text-sm sm:text-base font-bold font-heading text-white line-clamp-1">
                {course.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenReport(course)}
              className="p-2 text-neutral-400 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
              title="Report course"
            >
              <Flag className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Banner (If completed) */}
        {(enrollment?.status === 'COMPLETED' || generatedCert) && (
          <div className="bg-emerald-600 text-white p-3.5 px-6 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-amber-300 shrink-0" />
              <div>
                <p className="text-xs font-bold font-heading">
                  Congratulations! You have completed 100% of this course syllabus.
                </p>
                <p className="text-[11px] text-emerald-100">
                  Your verified ENEMIND academic certificate is ready and stored in /Enemind/Certificates.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                const cert = generatedCert || learningService.getStudentCertificates(user?.id || 'usr_default').find(c => c.courseId === course.id);
                if (cert) onOpenCertificate(cert);
              }}
              className="px-3 py-1.5 bg-white text-emerald-900 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>View Certificate</span>
            </button>
          </div>
        )}

        {/* Main Content Body */}
        {!isEnrolled ? (
          /* Unenrolled Overview Screen */
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left 2 Cols: Details & Syllabus */}
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-bold font-heading text-neutral-900 mb-2">About This Course</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{course.description}</p>
                </div>

                {/* Skills Acquired */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Skills You Will Master</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {course.skills.map((sk) => (
                      <span key={sk} className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-xl text-xs font-semibold">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Prerequisites & Requirements</h4>
                  <ul className="space-y-1 text-xs text-neutral-600 list-disc list-inside">
                    {course.requirements.map((req, idx) => (
                      <li key={idx}>{req}</li>
                    ))}
                  </ul>
                </div>

                {/* Syllabus Outline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3">
                    Course Syllabus ({course.lessons.length} Modules)
                  </h4>
                  <div className="space-y-2">
                    {course.lessons.map((lsn, idx) => (
                      <div key={lsn.id} className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-white border border-neutral-300 text-neutral-700 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{lsn.title}</p>
                            <p className="text-[11px] text-neutral-500">{lsn.description}</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-neutral-400 font-medium whitespace-nowrap">{lsn.duration}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Sidebar: Instructor & Enrollment Card */}
              <div className="space-y-4">
                <div className="p-5 rounded-3xl bg-neutral-50 border border-neutral-200 space-y-4">
                  <div className="flex items-center gap-3">
                    {course.providerAvatar ? (
                      <img src={course.providerAvatar} alt={course.providerName} className="w-12 h-12 rounded-2xl object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-neutral-200 flex items-center justify-center font-bold text-neutral-700">
                        {course.providerName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-neutral-400 uppercase font-bold tracking-widest block">Instructor</span>
                      <h4 className="text-xs font-bold text-neutral-900">{course.providerName}</h4>
                      <p className="text-[11px] text-neutral-500">{course.providerType}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 space-y-2 text-xs text-neutral-600">
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Duration:</span>
                      <span className="font-bold text-neutral-800">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Level:</span>
                      <span className="font-bold text-neutral-800">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Language:</span>
                      <span className="font-bold text-neutral-800">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-400">Price:</span>
                      <span className="font-bold text-emerald-700">{course.isFree ? 'FREE' : `${course.currency} ${course.price}`}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onEnroll(course)}
                    className="w-full py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-2xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-400" />
                    <span>{course.isFree ? 'Enroll Free & Start Learning' : `Enroll for ${course.currency} ${course.price}`}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Enrolled Player Layout */
          <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
            {/* Left Sidebar: Lessons Navigation */}
            <div className="w-full lg:w-80 bg-neutral-50 border-r border-neutral-200 flex flex-col shrink-0 max-h-60 lg:max-h-none overflow-y-auto">
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-neutral-900">Your Progress</span>
                  <span className="font-bold text-emerald-700">{enrollment.progress}%</span>
                </div>
                <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${enrollment.progress}%` }} />
                </div>
              </div>

              {/* Module List */}
              <div className="p-2 space-y-1">
                {course.lessons.map((lsn, idx) => {
                  const isCurrent = idx === selectedLessonIndex;
                  const isDone = enrollment.completedLessons?.includes(lsn.id);

                  return (
                    <button
                      key={lsn.id}
                      type="button"
                      onClick={() => setSelectedLessonIndex(idx)}
                      className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-white shadow-xs border border-neutral-300 text-neutral-900'
                          : 'hover:bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLessonComplete(lsn.id);
                        }}
                        className="mt-0.5 text-neutral-400 hover:text-emerald-600 transition-colors"
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs font-bold truncate ${isCurrent ? 'text-neutral-900' : 'text-neutral-700'}`}>
                          {lsn.title}
                        </p>
                        <div className="flex items-center gap-2 text-[10px] text-neutral-400 mt-0.5">
                          <span>{lsn.type.replace('_', ' ')}</span>
                          <span>·</span>
                          <span>{lsn.duration}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Main Viewer */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {currentLesson ? (
                <>
                  {/* Lesson Title & Top Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-bold text-neutral-700 uppercase">
                          Lesson {selectedLessonIndex + 1} of {course.lessons.length}
                        </span>
                        <span className="text-xs text-neutral-400 font-medium">({currentLesson.duration})</span>
                      </div>
                      <h2 className="text-base sm:text-lg font-bold font-heading text-neutral-900 mt-1">
                        {currentLesson.title}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onCreateNoteForLesson(course, currentLesson)}
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Take Note</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleLessonComplete(currentLesson.id)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isLessonCompleted
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-900 text-white hover:bg-neutral-800'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isLessonCompleted ? 'Completed' : 'Mark as Complete'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Google Resource Badges / Links */}
                  <div className="flex flex-wrap items-center gap-2">
                    {currentLesson.googleDocUrl && (
                      <a
                        href={currentLesson.googleDocUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>Open Google Doc</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {currentLesson.googleSlidesUrl && (
                      <a
                        href={currentLesson.googleSlidesUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Layers className="w-3.5 h-3.5 text-amber-600" />
                        <span>Open Google Slides</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {currentLesson.googleFormUrl && (
                      <a
                        href={currentLesson.googleFormUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-purple-600" />
                        <span>Open Google Form Quiz</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {currentLesson.googleMeetUrl && (
                      <a
                        href={currentLesson.googleMeetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <Video className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Join Live Google Meet</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}

                    {course.googleClassroomId && (
                      <a
                        href={`https://classroom.google.com/c/${course.googleClassroomId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
                      >
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>Google Classroom Stream</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* Main Lesson Content Body */}
                  <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-200 space-y-4">
                    <p className="text-xs text-neutral-700 font-medium leading-relaxed">
                      {currentLesson.description}
                    </p>

                    {currentLesson.content && (
                      <div className="bg-white p-4 rounded-xl border border-neutral-200 text-xs text-neutral-800 font-mono whitespace-pre-wrap leading-relaxed">
                        {currentLesson.content}
                      </div>
                    )}

                    {/* If Assignment or Project: Submission Form */}
                    {(currentLesson.type === 'ASSIGNMENT' || currentLesson.type === 'PROJECT') && (
                      <div className="mt-4 pt-4 border-t border-neutral-200">
                        <h4 className="text-xs font-bold text-neutral-900 mb-2">Submit Your Solution</h4>
                        <form onSubmit={handleAssignmentSubmit} className="space-y-3">
                          <div>
                            <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                              Google Doc / Google Drive Link (Preferred)
                            </label>
                            <input
                              type="url"
                              placeholder="https://docs.google.com/document/d/..."
                              value={submissionDocUrl}
                              onChange={(e) => setSubmissionDocUrl(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-emerald-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                              Notes / Solution Summary
                            </label>
                            <textarea
                              rows={3}
                              placeholder="Explain your approach, key formulas, or GitHub repo URL..."
                              value={submissionText}
                              onChange={(e) => setSubmissionText(e.target.value)}
                              className="w-full px-3 py-2 bg-white rounded-xl border border-neutral-300 text-xs text-neutral-900 focus:outline-hidden focus:border-emerald-500"
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Submitting...' : 'Submit to Teacher'}</span>
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-neutral-400">
                  <p>Select a lesson from the left syllabus to start studying.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
