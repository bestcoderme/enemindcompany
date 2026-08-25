/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  StudentProject,
  CareerGoal,
  CareerProjectTemplate,
} from '../../../types/career';
import { CareerService } from '../../../services/career/careerService';
import {
  Code,
  Plus,
  CheckCircle2,
  Clock,
  Github,
  ExternalLink,
  Sparkles,
  Layers,
  Award,
} from 'lucide-react';

interface CareerProjectsTabProps {
  studentEmail: string;
  projects: StudentProject[];
  activeGoal: CareerGoal | null;
  onStartTemplate: (careerId: string, templateId: string) => void;
  onCompleteProject: (projectId: string, githubUrl?: string, liveUrl?: string, learnings?: string) => void;
  onCreateCustomProject: (project: Omit<StudentProject, 'id' | 'studentEmail'>) => void;
}

export const CareerProjectsTab: React.FC<CareerProjectsTabProps> = ({
  studentEmail,
  projects,
  activeGoal,
  onStartTemplate,
  onCompleteProject,
  onCreateCustomProject,
}) => {
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState<string | null>(null);

  // Custom project state
  const [customTitle, setCustomTitle] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customCategory, setCustomCategory] = useState('Engineering & Tech');
  const [customDifficulty, setCustomDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [customSkills, setCustomSkills] = useState('');

  // Complete project state
  const [completeGithub, setCompleteGithub] = useState('');
  const [completeDemo, setCompleteDemo] = useState('');
  const [completeLearnings, setCompleteLearnings] = useState('');

  const activeCareer = activeGoal ? CareerService.getCareerById(activeGoal.careerId) : null;
  const projectTemplates: CareerProjectTemplate[] = activeCareer ? activeCareer.projectTemplates : [];

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    onCreateCustomProject({
      title: customTitle.trim(),
      description: customDesc.trim(),
      category: customCategory,
      difficulty: customDifficulty,
      skillsUsed: customSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      status: 'in_progress',
      startDate: new Date().toISOString().split('T')[0],
      isFeaturedInPortfolio: true,
    });

    setCustomTitle('');
    setCustomDesc('');
    setCustomSkills('');
    setShowCustomModal(false);
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCompleteModal) return;

    onCompleteProject(
      showCompleteModal,
      completeGithub.trim() || undefined,
      completeDemo.trim() || undefined,
      completeLearnings.trim() || undefined
    );

    setShowCompleteModal(null);
    setCompleteGithub('');
    setCompleteDemo('');
    setCompleteLearnings('');
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-neutral-200 shadow-xs">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-heading">
            Applied Project Lab & Proof of Work
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Build verifiable technical projects to validate your skills for recruiters and scholarship panels.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCustomModal(true)}
          className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Project</span>
        </button>
      </div>

      {/* Active Student Projects Grid */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 px-1">
          My Active & Completed Projects ({projects.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => {
            const isDone = proj.status === 'completed';
            return (
              <div
                key={proj.id}
                className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                      {proj.difficulty} · {proj.category}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                        isDone
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      <span>{isDone ? 'Completed' : 'In Progress'}</span>
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-neutral-900 font-heading mb-1.5">
                    {proj.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {proj.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {proj.skillsUsed.map((sk, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700 font-medium"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>

                  {proj.keyLearnings && (
                    <div className="p-3 rounded-xl bg-neutral-50 text-[11px] text-neutral-600 space-y-1">
                      <span className="font-bold text-neutral-800">Key Outcomes: </span>
                      {proj.keyLearnings}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        title="View GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {proj.liveDemoUrl && (
                      <a
                        href={proj.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
                        title="View Live Demo"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {!isDone && (
                    <button
                      type="button"
                      onClick={() => setShowCompleteModal(proj.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Mark Complete & Add Links
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Suggested Templates from Active Career */}
      {projectTemplates.length > 0 && (
        <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-heading">
                Recommended Project Blueprints for {activeCareer?.title}
              </h3>
              <p className="text-xs text-neutral-500">
                Industry-aligned challenges specifically requested by employers during hiring interviews.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projectTemplates.map((template) => (
              <div
                key={template.id}
                className="p-5 rounded-2xl bg-white border border-neutral-200 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {template.difficulty}
                    </span>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      ~{template.estimatedHours} hrs effort
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">
                    {template.title}
                  </h4>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {template.skillsPracticed.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => onStartTemplate(activeCareer!.id, template.id)}
                    className="w-full py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Start This Project
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Complete Project Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCompleteSubmit}
            className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-neutral-200 space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 font-heading">
                Complete Project & Showcase Artifacts
              </h3>
              <p className="text-xs text-neutral-500">
                Attach public repository and demo URLs to verify this project in your career portfolio.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  GitHub / Repository URL
                </label>
                <input
                  type="url"
                  placeholder="https://github.com/your-username/project-repo"
                  value={completeGithub}
                  onChange={(e) => setCompleteGithub(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Live Demo / Video Link
                </label>
                <input
                  type="url"
                  placeholder="https://your-live-demo.app"
                  value={completeDemo}
                  onChange={(e) => setCompleteDemo(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Key Technical Learnings & Outcomes
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize architectural decisions, algorithms implemented, and problem-solving techniques..."
                  value={completeLearnings}
                  onChange={(e) => setCompleteLearnings(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCompleteModal(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                Save & Verify Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Custom Project Modal */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <form
            onSubmit={handleCreateCustom}
            className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-neutral-200 space-y-4"
          >
            <div className="space-y-1">
              <h3 className="text-base font-bold text-neutral-900 font-heading">
                Create Custom Student Project
              </h3>
              <p className="text-xs text-neutral-500">
                Log a personal project, research capstone, or commercial build.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. IoT Smart Irrigation Controller"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={customDifficulty}
                    onChange={(e) => setCustomDifficulty(e.target.value as 'Beginner' | 'Intermediate' | 'Advanced')}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Description & Objective
                </label>
                <textarea
                  rows={3}
                  placeholder="What does this system accomplish? Who is it built for?"
                  value={customDesc}
                  onChange={(e) => setCustomDesc(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Skills & Tools Used (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arduino, C++, LoRaWan, MQTT, SQLite"
                  value={customSkills}
                  onChange={(e) => setCustomSkills(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
