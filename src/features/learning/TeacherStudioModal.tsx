/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  DollarSign,
  Users,
  Award,
  BookOpen,
  GraduationCap,
  FolderLock,
  Video,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Layers,
} from 'lucide-react';
import { Course, Lesson, CourseType, CourseLevel } from '../../types/learning';
import { UserProfile } from '../../types/user';
import { learningService } from '../../services/learning/learningService';

interface TeacherStudioModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onCourseCreated: () => void;
}

export const TeacherStudioModal: React.FC<TeacherStudioModalProps> = ({
  user,
  isOpen,
  onClose,
  onCourseCreated,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'analytics'>('create');

  // Course Form
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState('Computer Science');
  const [subject, setSubject] = useState('Software Engineering');
  const [level, setLevel] = useState<CourseLevel>('BEGINNER');
  const [courseType, setCourseType] = useState<CourseType>('SELF_PACED');
  const [skills, setSkills] = useState('Python, SQL, Cloud');
  const [careerPaths, setCareerPaths] = useState('Software Engineer');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState('4 Weeks');
  const [thumbnail, setThumbnail] = useState(
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  );
  const [googleClassroomId, setGoogleClassroomId] = useState('');
  const [googleMeetUrl, setGoogleMeetUrl] = useState('');

  // Lessons Form
  const [lessons, setLessons] = useState<Array<Omit<Lesson, 'id' | 'courseId' | 'createdAt' | 'updatedAt'>>>([
    {
      title: '01. Introduction & Environment Setup',
      description: 'Foundational concepts and cloud workspace setup.',
      order: 1,
      type: 'DOCUMENT',
      duration: '45 mins',
      status: 'AVAILABLE',
      googleDocUrl: '',
    },
  ]);

  // Payout Form
  const [payoutPhone, setPayoutPhone] = useState('0712345678');
  const [payoutRequested, setPayoutRequested] = useState(false);

  if (!isOpen) return null;

  const teacherAnalytics = learningService.getTeacherAnalytics(user?.id || 'provider_eng_mwangi');

  const handleAddLesson = () => {
    setLessons([
      ...lessons,
      {
        title: `0${lessons.length + 1}. Module Title`,
        description: 'Module objectives and study guides.',
        order: lessons.length + 1,
        type: 'DOCUMENT',
        duration: '45 mins',
        status: 'AVAILABLE',
      },
    ]);
  };

  const handleRemoveLesson = (idx: number) => {
    if (lessons.length <= 1) return;
    setLessons(lessons.filter((_, i) => i !== idx));
  };

  const handleLessonChange = (idx: number, field: string, value: any) => {
    const updated = [...lessons];
    updated[idx] = { ...updated[idx], [field]: value };
    setLessons(updated);
  };

  const handlePublishCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !user) return;

    const courseLessons: Lesson[] = lessons.map((l, i) => ({
      ...l,
      id: `lsn_t_${Date.now()}_${i}`,
      courseId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    learningService.createCourse({
      title: title.trim(),
      shortDescription: shortDesc.trim() || title.trim(),
      description: desc.trim() || title.trim(),
      providerId: user.id,
      providerName: user.name,
      providerAvatar: user.avatar,
      providerType: 'TEACHER',
      category,
      subject,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      careerPaths: careerPaths.split(',').map((c) => c.trim()).filter(Boolean),
      level,
      language: 'English',
      thumbnail,
      duration,
      requirements: ['Basic computer knowledge'],
      price: isFree ? 0 : Number(price),
      currency: 'KSh',
      isFree,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
      courseType,
      googleClassroomId: googleClassroomId.trim() || undefined,
      googleMeetUrl: googleMeetUrl.trim() || undefined,
      certificateAvailable: true,
      lessons: courseLessons,
    });

    alert('Course created and published to the ENEMIND campus directory successfully!');
    onCourseCreated();
    onClose();
  };

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    setPayoutRequested(true);
    setTimeout(() => {
      alert(`M-Pesa payout request of KSh ${teacherAnalytics.pendingPayout.toLocaleString()} submitted to ${payoutPhone}! Disbursement processing.`);
      setPayoutRequested(false);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/70 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-white">Teacher & Instructor Studio</h2>
              <p className="text-xs text-neutral-400">Publish campus courses, sync Google Classroom, and monetize.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-white/10 rounded-xl p-0.5">
              <button
                type="button"
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'create' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Create Course
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'analytics' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-300 hover:text-white'
                }`}
              >
                Earnings & Analytics
              </button>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'create' ? (
            <form onSubmit={handlePublishCourse} className="space-y-6">
              {/* Course Basics */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">1. Course Details</h3>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Course Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Distributed Cloud Computing & Microservices"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden bg-white"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Business">Business</option>
                      <option value="Cybersecurity">Cybersecurity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Subject / Unit</label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Level</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as CourseLevel)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden bg-white"
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                      <option value="ALL_LEVELS">All Levels</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Detailed Description</label>
                  <textarea
                    rows={3}
                    placeholder="Explain learning outcomes, target students, and university alignment..."
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full p-3 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Google Workspace Connections */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  2. Google Education Ecosystem Links
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Google Classroom Course ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. cls_course_01"
                      value={googleClassroomId}
                      onChange={(e) => setGoogleClassroomId(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-700 mb-1">
                      Live Google Meet Room URL (Optional)
                    </label>
                    <input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={googleMeetUrl}
                      onChange={(e) => setGoogleMeetUrl(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing & Monetization */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  3. Pricing & Marketplace
                </h3>

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={isFree}
                      onChange={() => {
                        setIsFree(true);
                        setPrice(0);
                      }}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span>Free Community Course</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isFree}
                      onChange={() => setIsFree(false)}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <span>Paid (M-Pesa / Card)</span>
                  </label>
                </div>

                {!isFree && (
                  <div className="max-w-xs">
                    <label className="block text-xs font-bold text-neutral-700 mb-1">Price (KSh)</label>
                    <input
                      type="number"
                      min={100}
                      step={50}
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-neutral-300 focus:outline-hidden font-bold"
                    />
                    <p className="text-[11px] text-neutral-500 mt-1">
                      Enemind platform fee is 10%. You keep 90% paid out to M-Pesa.
                    </p>
                  </div>
                )}
              </div>

              {/* Lessons Syllabus */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    4. Course Syllabus ({lessons.length} Modules)
                  </h3>
                  <button
                    type="button"
                    onClick={handleAddLesson}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Module</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {lessons.map((lsn, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-900">Module {idx + 1}</span>
                        {lessons.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLesson(idx)}
                            className="text-neutral-400 hover:text-rose-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Module Title</label>
                          <input
                            type="text"
                            value={lsn.title}
                            onChange={(e) => handleLessonChange(idx, 'title', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-neutral-300"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">Google Doc / Slide URL</label>
                          <input
                            type="url"
                            placeholder="https://docs.google.com/..."
                            value={lsn.googleDocUrl || ''}
                            onChange={(e) => handleLessonChange(idx, 'googleDocUrl', e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-white rounded-xl border border-neutral-300"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-neutral-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 cursor-pointer shadow-md"
                >
                  Publish Course to ENEMIND
                </button>
              </div>
            </form>
          ) : (
            /* Analytics & Payouts Tab */
            <div className="space-y-6">
              {/* Stat Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Total Students</span>
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="text-2xl font-black text-neutral-900 font-heading">
                    {teacherAnalytics.totalStudents}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center justify-between text-neutral-500 text-xs mb-1">
                    <span>Gross Revenue</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-black text-neutral-900 font-heading">
                    KSh {teacherAnalytics.totalRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center justify-between text-emerald-700 text-xs mb-1">
                    <span>Pending M-Pesa Payout</span>
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                  </div>
                  <p className="text-2xl font-black text-emerald-950 font-heading">
                    KSh {teacherAnalytics.pendingPayout.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Payout Form */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Request Immediate M-Pesa Payout
                </h4>
                <p className="text-xs text-neutral-500">
                  Withdraw your net teaching earnings instantly via Safaricom M-Pesa B2C payout.
                </p>

                <form onSubmit={handleRequestPayout} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="tel"
                    placeholder="07XXXXXXXX"
                    value={payoutPhone}
                    onChange={(e) => setPayoutPhone(e.target.value)}
                    className="px-3.5 py-2 text-xs bg-white rounded-xl border border-neutral-300 focus:outline-hidden max-w-xs"
                  />
                  <button
                    type="submit"
                    disabled={payoutRequested || teacherAnalytics.pendingPayout === 0}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-xs"
                  >
                    {payoutRequested ? 'Processing...' : `Withdraw KSh ${teacherAnalytics.pendingPayout.toLocaleString()}`}
                  </button>
                </form>
              </div>

              {/* Published Courses Table */}
              <div>
                <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-3">
                  Your Published Course Performance
                </h4>

                <div className="space-y-2">
                  {teacherAnalytics.courseStats.map((c) => (
                    <div
                      key={c.courseId}
                      className="p-3.5 rounded-2xl bg-white border border-neutral-200 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-neutral-900">{c.title}</p>
                        <p className="text-neutral-500 text-[11px]">
                          {c.enrollments} enrollments · {c.completionRate}% completion rate
                        </p>
                      </div>
                      <span className="font-bold text-emerald-700">KSh {c.revenue.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
