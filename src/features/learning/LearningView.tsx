/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  PlayCircle,
  GraduationCap,
  FileText,
  Users,
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  FolderLock,
  ArrowRight,
  Filter,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Course, Enrollment, Certificate, CourseLevel, CourseType } from '../../types/learning';
import { UserProfile } from '../../types/user';
import { learningService } from '../../services/learning/learningService';
import { CourseCard } from './CourseCard';
import { CourseDetailAndPlayerModal } from './CourseDetailAndPlayerModal';
import { MyNotesWorkspace } from './MyNotesWorkspace';
import { StudyGroupsWorkspace } from './StudyGroupsWorkspace';
import { GoogleClassroomTab } from './GoogleClassroomTab';
import { TeacherStudioModal } from './TeacherStudioModal';
import { CertificateModal } from './CertificateModal';
import { SafetyReportModal } from './SafetyReportModal';

interface LearningViewProps {
  user?: UserProfile | null;
  onOpenCloudSettings?: () => void;
}

export const LearningView: React.FC<LearningViewProps> = ({
  user = null,
  onOpenCloudSettings = () => {},
}) => {
  const [activeTab, setActiveTab] = useState<
    'discover' | 'my_learning' | 'notes' | 'groups' | 'classroom' | 'certificates'
  >('my_learning');

  // Search & Catalog Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState<CourseLevel | 'ALL'>('ALL');
  const [onlyClassroom, setOnlyClassroom] = useState(false);
  const [onlyFree, setOnlyFree] = useState<boolean | undefined>(undefined);

  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [studyPlan, setStudyPlan] = useState(
    learningService.getStudyPlan(user?.id || 'usr_default')
  );

  // Modal State
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isTeacherStudioOpen, setIsTeacherStudioOpen] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [reportedCourse, setReportedCourse] = useState<Course | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Note creation helper for lesson linking
  const [noteCourseLink, setNoteCourseLink] = useState<{ course?: Course; lesson?: any }>({});

  useEffect(() => {
    loadLearningData();
  }, [searchQuery, selectedCategory, selectedLevel, onlyClassroom, onlyFree]);

  const loadLearningData = () => {
    const studentId = user?.id || 'usr_default';
    const courseList = learningService.getCourses({
      search: searchQuery,
      category: selectedCategory === 'All' ? undefined : selectedCategory,
      level: selectedLevel === 'ALL' ? undefined : selectedLevel,
      hasGoogleClassroom: onlyClassroom || undefined,
      isFree: onlyFree,
    });
    setCourses(courseList);

    const userEnrollments = learningService.getEnrollments(studentId);
    setEnrollments(userEnrollments);

    const userCerts = learningService.getStudentCertificates(studentId);
    setCertificates(userCerts);

    const plan = learningService.getStudyPlan(studentId);
    setStudyPlan(plan);
  };

  const handleEnroll = async (course: Course) => {
    const studentId = user?.id || 'usr_default';
    const studentName = user?.name || 'Alex Muli';
    const studentEmail = user?.email || 'student@enemind.org';

    await learningService.enrollCourse(studentId, course.id, studentName, studentEmail);
    loadLearningData();
    setSelectedCourse(course);
    setIsPlayerOpen(true);
  };

  const handleOpenCourse = (course: Course) => {
    setSelectedCourse(course);
    setIsPlayerOpen(true);
  };

  const handleOpenCertificate = (cert: Certificate) => {
    setSelectedCertificate(cert);
    setIsCertModalOpen(true);
  };

  const handleToggleStudyTask = (taskId: string, currentDone: boolean) => {
    const studentId = user?.id || 'usr_default';
    const updated = learningService.updateStudyPlanTask(studentId, taskId, !currentDone);
    setStudyPlan({ ...updated });
  };

  // Recommendations
  const recommendations = learningService.getRecommendations({
    careerGoal: 'Software Engineer & Cloud Architect',
    skillsGap: ['Docker', 'Kubernetes', 'Cloud DevOps', 'TypeScript'],
    enrolledCourseIds: enrollments.map((e) => e.courseId),
  });

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const activeEnrolledCourses = courses.filter((c) => enrolledCourseIds.has(c.id));
  const studentAssignments = learningService.getAssignmentsForStudent(user?.id || 'usr_default');

  return (
    <div className="space-y-6">
      {/* Top Banner & Phase 6 Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
              ENEMIND Learning & Google Education Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Phase 6 Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Orchestrating academic courses, lecture notes, Google Classroom, and verified certificates in your campus operating system.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
          <button
            type="button"
            onClick={() => setIsTeacherStudioOpen(true)}
            className="px-3.5 py-2 bg-white hover:bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <GraduationCap className="w-4 h-4 text-amber-500" />
            <span>Teacher Studio</span>
          </button>

          <button
            type="button"
            onClick={onOpenCloudSettings}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Google Workspace Services</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-neutral-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('my_learning')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'my_learning'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>My Learning ({enrollments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('discover')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'discover'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Search className="w-4 h-4" />
          <span>Discover Courses</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Personal Notes & Docs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('groups')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'groups'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Study Circles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('classroom')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'classroom'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <GraduationCap className="w-4 h-4 text-amber-500" />
          <span>Google Classroom</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certificates')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'certificates'
              ? 'bg-neutral-900 text-white shadow-xs'
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <Award className="w-4 h-4 text-emerald-500" />
          <span>Certificates ({certificates.length})</span>
        </button>
      </div>

      {/* TAB 1: MY LEARNING DASHBOARD */}
      {activeTab === 'my_learning' && (
        <div className="space-y-8">
          {/* Continue Learning Row */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold font-heading text-neutral-900">
                  Continue Learning
                </h2>
                <p className="text-xs text-neutral-500">Pick up where you left off across your active courses.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('discover')}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>Browse More</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeEnrolledCourses.length === 0 ? (
              <div className="p-8 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-3">
                <BookOpen className="w-10 h-10 mx-auto text-neutral-300" />
                <h3 className="text-sm font-bold text-neutral-800">You have no active courses</h3>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Explore academic courses, live bootcamps, and skill tracks designed for university students.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('discover')}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Explore Course Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeEnrolledCourses.map((course) => {
                  const enrollment = enrollments.find((e) => e.courseId === course.id);
                  return (
                    <CourseCard
                      key={course.id}
                      course={course}
                      enrollment={enrollment}
                      onSelect={handleOpenCourse}
                      onEnroll={handleEnroll}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* 2-Column Split: Study Plan Checklist & Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Weekly Study Plan (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-bold font-heading text-neutral-900">
                      Weekly Study Roadmap
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">{studyPlan.title}</p>
                </div>

                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold">
                  {studyPlan.weeklyHoursTarget} hrs/week target
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-2.5">
                {studyPlan.tasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => handleToggleStudyTask(task.id, task.done)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      task.done
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-400 line-through'
                        : 'bg-white border-neutral-200 hover:border-neutral-300 text-neutral-800'
                    }`}
                  >
                    <button
                      type="button"
                      className="mt-0.5 text-neutral-400 hover:text-emerald-600 transition-colors shrink-0"
                    >
                      {task.done ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-neutral-300" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium leading-relaxed">{task.text}</p>
                      {task.courseTitle && (
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          Linked: {task.courseTitle}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Active Assignments & Google Forms (6 cols) */}
            <div className="lg:col-span-6 bg-white rounded-3xl border border-neutral-200 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-bold font-heading text-neutral-900">
                    Coursework & Due Dates
                  </h3>
                </div>
                <span className="text-xs text-neutral-400 font-medium">
                  {studentAssignments.length} active tasks
                </span>
              </div>

              <div className="space-y-3">
                {studentAssignments.map((asg) => (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-2xl bg-neutral-50/80 border border-neutral-200 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {asg.courseTitle || 'Academic Assignment'}
                      </span>
                      <span className="text-[11px] text-rose-600 font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Due {new Date(asg.dueDate).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-neutral-900">{asg.title}</h4>
                    <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                      {asg.description}
                    </p>

                    <div className="pt-2 border-t border-neutral-200 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">Max Points: {asg.maxScore}</span>
                      {asg.submission ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Submitted</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const c = courses.find((crs) => crs.id === asg.courseId);
                            if (c) handleOpenCourse(c);
                          }}
                          className="text-xs font-bold text-neutral-900 hover:text-emerald-700 cursor-pointer"
                        >
                          Submit Work →
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Skill-Gap Recommendations Row */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <h2 className="text-base sm:text-lg font-bold font-heading text-neutral-900">
                    Recommended For Your Career Roadmap
                  </h2>
                </div>
                <p className="text-xs text-neutral-500">
                  Targeted courses derived from your identified skill gaps and career objectives.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.courseId}
                  className="p-5 rounded-3xl bg-neutral-900 text-white flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-neutral-950">
                        {rec.matchedSkill} Gap
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">
                        {rec.course.duration}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold font-heading leading-snug">{rec.course.title}</h3>
                    <p className="text-xs text-neutral-300 leading-relaxed">{rec.reason}</p>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      {rec.course.isFree ? 'FREE' : `${rec.course.currency} ${rec.course.price}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleEnroll(rec.course)}
                      className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-900 rounded-xl text-xs font-bold cursor-pointer transition-all"
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISCOVER COURSES */}
      {activeTab === 'discover' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by topic, unit code, skill (e.g. Python, Docker), or instructor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white rounded-2xl border border-neutral-200 text-xs text-neutral-900 focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 focus:outline-hidden"
            >
              <option value="All">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Business">Business</option>
            </select>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="px-3 py-2 bg-white rounded-2xl border border-neutral-200 text-xs font-bold text-neutral-700 focus:outline-hidden"
            >
              <option value="ALL">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>

            {/* Google Classroom Toggle */}
            <button
              type="button"
              onClick={() => setOnlyClassroom(!onlyClassroom)}
              className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                onlyClassroom
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
              <span>Google Classroom</span>
            </button>
          </div>

          {/* Course Grid */}
          {courses.length === 0 ? (
            <div className="p-12 text-center text-neutral-400 text-xs">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-neutral-300" />
              <p>No courses found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course) => {
                const enrollment = enrollments.find((e) => e.courseId === course.id);
                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    enrollment={enrollment}
                    onSelect={handleOpenCourse}
                    onEnroll={handleEnroll}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NOTES WORKSPACE */}
      {activeTab === 'notes' && (
        <MyNotesWorkspace
          user={user}
          initialCourseId={noteCourseLink.course?.id}
          initialCourseTitle={noteCourseLink.course?.title}
          initialLessonId={noteCourseLink.lesson?.id}
          initialLessonTitle={noteCourseLink.lesson?.title}
          onOpenCloudSettings={onOpenCloudSettings}
        />
      )}

      {/* TAB 4: STUDY CIRCLES & PEER GROUPS */}
      {activeTab === 'groups' && <StudyGroupsWorkspace user={user} />}

      {/* TAB 5: GOOGLE CLASSROOM TAB */}
      {activeTab === 'classroom' && (
        <GoogleClassroomTab user={user} onOpenCloudSettings={onOpenCloudSettings} />
      )}

      {/* TAB 6: CERTIFICATES OF COMPLETION */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-heading text-neutral-900">
              Verified Academic Credentials & Certificates
            </h2>
            <p className="text-xs text-neutral-500">
              Credentials automatically issued upon 100% syllabus completion and stored in Google Drive /Enemind/Certificates.
            </p>
          </div>

          {certificates.length === 0 ? (
            <div className="p-10 rounded-3xl bg-neutral-50 border border-neutral-200 text-center space-y-2">
              <Award className="w-10 h-10 mx-auto text-neutral-300" />
              <h3 className="text-sm font-bold text-neutral-800">No Certificates Earned Yet</h3>
              <p className="text-xs text-neutral-500">
                Complete all modules and assignments in an enrolled course to receive your verified certificate.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="bg-white rounded-3xl border border-neutral-200 p-5 flex flex-col justify-between hover:shadow-md transition-all space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                        <Award className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {cert.certificateNumber}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold font-heading text-neutral-900 leading-snug">
                      {cert.courseTitle}
                    </h3>
                    <p className="text-xs text-neutral-500">Instructor: {cert.providerName}</p>

                    <div className="flex flex-wrap gap-1 pt-2">
                      {cert.skills.map((sk) => (
                        <span key={sk} className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-semibold text-neutral-700">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                    <span className="text-[11px] text-emerald-700 font-bold">
                      {cert.gradeScore || 'Completed'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleOpenCertificate(cert)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      View & Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      <CourseDetailAndPlayerModal
        course={selectedCourse}
        enrollment={enrollments.find((e) => e.courseId === selectedCourse?.id)}
        user={user}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        onEnroll={handleEnroll}
        onOpenCertificate={handleOpenCertificate}
        onCreateNoteForLesson={(course, lesson) => {
          setNoteCourseLink({ course, lesson });
          setIsPlayerOpen(false);
          setActiveTab('notes');
        }}
        onOpenReport={(course) => {
          setReportedCourse(course);
          setIsReportModalOpen(true);
        }}
        onProgressUpdated={loadLearningData}
      />

      <TeacherStudioModal
        user={user}
        isOpen={isTeacherStudioOpen}
        onClose={() => setIsTeacherStudioOpen(false)}
        onCourseCreated={loadLearningData}
      />

      <CertificateModal
        certificate={selectedCertificate}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />

      <SafetyReportModal
        course={reportedCourse}
        user={user}
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
};
