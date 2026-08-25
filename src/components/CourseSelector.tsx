import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Check, GraduationCap, X, ArrowLeft, Sparkles, BookOpen } from 'lucide-react';
import { University, CourseItem } from '../types.ts';
import { INITIAL_COURSES } from '../data/institutions.ts';

interface CourseSelectorProps {
  university: University;
  onBack: () => void;
  onComplete: (course: CourseItem) => void;
  initialCourseId?: string;
}

export const CourseSelector: React.FC<CourseSelectorProps> = ({
  university,
  onBack,
  onComplete,
  initialCourseId,
}) => {
  const [courses, setCourses] = useState<CourseItem[]>(() => {
    try {
      const saved = localStorage.getItem('genz_custom_courses');
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...INITIAL_COURSES, ...parsed];
      }
    } catch {
      // fallback
    }
    return INITIAL_COURSES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(() => {
    if (initialCourseId) {
      return courses.find((c) => c.id === initialCourseId) || null;
    }
    return null;
  });

  // Modal for adding a custom course
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Tech & Engineering');
  const [newCourseCode, setNewCourseCode] = useState('');

  // Course categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    courses.forEach((c) => {
      if (c && c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [courses]);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    const q = (searchQuery || '').toLowerCase();
    return courses.filter((c) => {
      if (!c) return false;
      const matchesSearch =
        (c.name || '').toLowerCase().includes(q) ||
        (c.code ? c.code.toLowerCase().includes(q) : false) ||
        (c.category || '').toLowerCase().includes(q);
      const matchesCat = activeCategory === 'All' || c.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [courses, searchQuery, activeCategory]);

  const handleAddCustomCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const customId = `custom-course-${Date.now()}`;
    const newCourse: CourseItem = {
      id: customId,
      name: newCourseName.trim(),
      category: newCourseCategory,
      code: newCourseCode.trim() || undefined,
    };

    const updated = [newCourse, ...courses];
    setCourses(updated);
    try {
      const customList = updated.filter((c) => c.id.startsWith('custom-course-'));
      localStorage.setItem('genz_custom_courses', JSON.stringify(customList));
    } catch {
      // ignore
    }

    setSelectedCourse(newCourse);
    setIsAddModalOpen(false);
    setNewCourseName('');
    setNewCourseCode('');
  };

  const handleFinish = () => {
    if (selectedCourse) {
      onComplete(selectedCourse);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col items-center pb-8">
      {/* Header with Selected University Badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <span className="inline-block px-3 py-1 bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-full mb-2">
          Step 2 of 2 • Degree & Course Setup
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 font-heading">
          Select Your Major / Course
        </h1>
        
        {/* Selected Campus Pill */}
        <div className="inline-flex items-center gap-2 mt-2 px-3.5 py-1.5 bg-white rounded-full border border-neutral-200 shadow-xs">
          <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
            <img
              src={university.logoUrl}
              alt={university.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-semibold text-neutral-700">{university.name}</span>
          <button
            type="button"
            onClick={onBack}
            className="text-xs text-neutral-400 hover:text-neutral-900 underline ml-1 cursor-pointer font-medium"
          >
            Change
          </button>
        </div>
      </motion.div>

      {/* Main Container Card */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white rounded-3xl shadow-xl p-6 sm:p-8 flex flex-col border border-neutral-100/80"
      >
        {/* Search Bar and Add Course Button */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              id="course-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search major (e.g. Computer Science, Medicine, Law)..."
              className="w-full pl-11 pr-10 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl focus:border-neutral-900 focus:bg-white text-sm text-neutral-900 placeholder:text-neutral-400 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Add Course Button */}
          <button
            type="button"
            id="open-add-course-btn"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-sm font-semibold rounded-2xl transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Course</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Courses List */}
        <div className="max-h-[360px] overflow-y-auto pr-1 space-y-2.5">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-10 px-4 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <BookOpen className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-neutral-700">Course not found</h3>
              <p className="text-xs text-neutral-500 mt-1 mb-4">
                Don&apos;t see &ldquo;{searchQuery}&rdquo;? Add your degree program now.
              </p>
              <button
                type="button"
                onClick={() => {
                  setNewCourseName(searchQuery);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl hover:bg-neutral-800"
              >
                <Plus className="w-4 h-4" />
                <span>Add &ldquo;{searchQuery}&rdquo;</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredCourses.map((course) => {
                const isSelected = selectedCourse?.id === course.id;
                return (
                  <div
                    key={course.id}
                    id={`course-card-${course.id}`}
                    onClick={() => setSelectedCourse(course)}
                    className={`flex items-center gap-3.5 p-3.5 rounded-2xl border transition-all cursor-pointer select-none text-left ${
                      isSelected
                        ? 'bg-neutral-900 text-white border-neutral-900 shadow-md ring-2 ring-neutral-900'
                        : 'bg-neutral-50 hover:bg-neutral-100/80 border-neutral-200/80 text-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-neutral-800 text-white' : 'bg-white text-neutral-700 shadow-2xs border border-neutral-200'
                      }`}
                    >
                      <GraduationCap className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-sm truncate">
                        {course.name}
                      </div>
                      <div
                        className={`text-xs mt-0.5 ${
                          isSelected ? 'text-neutral-300' : 'text-neutral-500'
                        }`}
                      >
                        {course.category} {course.code ? `• ${course.code}` : ''}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBack}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-semibold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Campus</span>
          </button>

          <button
            type="button"
            id="finish-onboarding-btn"
            onClick={handleFinish}
            disabled={!selectedCourse}
            className={`w-full sm:w-auto px-7 py-3 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              selectedCourse
                ? 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            <span>Enter Gen-Z Hub</span>
            <Sparkles className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </motion.div>

      {/* Modal: Add Custom Course */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl z-10 text-neutral-900"
            >
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="mb-5">
                <h3 className="text-xl font-bold font-heading text-neutral-900">Add Academic Program</h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Specify your degree or specialty to connect with fellow classmates.
                </p>
              </div>

              <form onSubmit={handleAddCustomCourse} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Course / Major Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                    placeholder="e.g. Mechanical & Aerospace Engineering"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Department
                    </label>
                    <select
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                    >
                      <option value="Tech & Engineering">Tech & Engineering</option>
                      <option value="Design & Media">Design & Media</option>
                      <option value="Business & Finance">Business & Finance</option>
                      <option value="Health & Sciences">Health & Sciences</option>
                      <option value="Humanities & Law">Humanities & Law</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Course Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={newCourseCode}
                      onChange={(e) => setNewCourseCode(e.target.value)}
                      placeholder="e.g. ME401"
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:border-neutral-900 focus:bg-white text-sm outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl shadow-sm"
                  >
                    Save & Select
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
