/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  StudentSkillRecord,
  SkillLevel,
  CareerGoal,
  SkillGapAnalysis,
} from '../../../types/career';
import { CareerSkillsService } from '../../../services/career/careerSkillsService';
import { CareerService } from '../../../services/career/careerService';
import {
  CheckCircle2,
  Sparkles,
  Plus,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Zap,
  Target,
} from 'lucide-react';

interface CareerSkillsTabProps {
  studentEmail: string;
  skills: StudentSkillRecord[];
  activeGoal: CareerGoal | null;
  onUpdateSkill: (skillName: string, level: SkillLevel, notes?: string) => void;
}

export const CareerSkillsTab: React.FC<CareerSkillsTabProps> = ({
  studentEmail,
  skills,
  activeGoal,
  onUpdateSkill,
}) => {
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('learning');
  const [isAdding, setIsAdding] = useState(false);

  const activeCareer = activeGoal ? CareerService.getCareerById(activeGoal.careerId) : null;
  const skillGap: SkillGapAnalysis | null = activeCareer
    ? CareerSkillsService.analyzeSkillGap(activeCareer, studentEmail)
    : null;

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    onUpdateSkill(newSkillName.trim(), newSkillLevel);
    setNewSkillName('');
    setIsAdding(false);
  };

  const levelLabels: Record<SkillLevel, { label: string; color: string }> = {
    not_started: { label: 'Not Started', color: 'bg-neutral-100 text-neutral-600' },
    learning: { label: 'Learning Theory', color: 'bg-amber-50 text-amber-700 border border-amber-200' },
    practicing: { label: 'Practicing Builds', color: 'bg-sky-50 text-sky-700 border border-sky-200' },
    competent: { label: 'Competent / Working', color: 'bg-emerald-50 text-emerald-700 border border-emerald-200' },
    advanced: { label: 'Advanced Mastery', color: 'bg-purple-50 text-purple-700 border border-purple-200' },
  };

  return (
    <div className="space-y-6">
      {/* Skill Gap Banner if Active Goal Exists */}
      {skillGap && (
        <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Skills Gap Intelligence · {skillGap.careerTitle}
              </span>
              <h2 className="text-lg sm:text-xl font-bold font-heading">
                {skillGap.readinessPercentage}% Technical Readiness
              </h2>
              <p className="text-xs text-neutral-400">
                {skillGap.masteredSkills.length} core skills mastered · {skillGap.missingRequiredSkills.length} target skills to develop
              </p>
            </div>

            {skillGap.nextRecommendedSkill && (
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/10 space-y-1 shrink-0 max-w-sm">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Recommended Next Focus
                </span>
                <p className="text-xs font-bold text-white">
                  {skillGap.nextRecommendedSkill.skillName}
                </p>
                <p className="text-[11px] text-neutral-300">
                  {skillGap.nextRecommendedSkill.whyPriority}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills Matrix Header & Add Form */}
      <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-neutral-900 font-heading">
              My Technical & Professional Skills
            </h3>
            <p className="text-xs text-neutral-500">
              Track your self-assessed and coursework proficiencies.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsAdding(!isAdding)}
            className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Add Skill Form */}
        {isAdding && (
          <form onSubmit={handleAddSkill} className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-3">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
              Register New Skill
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="e.g. Docker, PLC Programming, Power BI..."
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                required
                className="sm:col-span-2 px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:outline-none focus:ring-2 focus:ring-neutral-900/10"
              />
              <select
                value={newSkillLevel}
                onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                className="px-3 py-2 rounded-xl bg-white border border-neutral-200 text-xs focus:outline-none"
              >
                <option value="learning">Learning Theory</option>
                <option value="practicing">Practicing Builds</option>
                <option value="competent">Competent / Working</option>
                <option value="advanced">Advanced Mastery</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg border border-neutral-200 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 cursor-pointer"
              >
                Save Skill
              </button>
            </div>
          </form>
        )}

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {skills.map((skill) => {
            const lvl = levelLabels[skill.level] || levelLabels.learning;
            return (
              <div
                key={skill.skillName}
                className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${lvl.color}`}>
                      {lvl.label}
                    </span>
                    {skill.verified && (
                      <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1">
                    {skill.skillName}
                  </h4>
                  {skill.evidenceNotes && (
                    <p className="text-[11px] text-neutral-500 line-clamp-2">
                      {skill.evidenceNotes}
                    </p>
                  )}
                </div>

                {/* Level Changer */}
                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">Update Stage:</span>
                  <select
                    value={skill.level}
                    onChange={(e) => onUpdateSkill(skill.skillName, e.target.value as SkillLevel)}
                    className="text-[11px] font-bold text-neutral-700 bg-transparent border-0 focus:ring-0 cursor-pointer text-right"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="learning">Learning</option>
                    <option value="practicing">Practicing</option>
                    <option value="competent">Competent</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curated Learning Resources from Target Career */}
      {activeCareer && activeCareer.learningResources.length > 0 && (
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-heading">
                Curated Learning Resources for {activeCareer.title}
              </h3>
              <p className="text-xs text-neutral-500">
                Verified high-yield open resources to bridge your technical skill gaps.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCareer.learningResources.map((res) => (
              <a
                key={res.id}
                href={res.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl border border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold uppercase text-emerald-700">
                      {res.provider}
                    </span>
                    {res.isFree && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        Free
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 mb-1 line-clamp-1">
                    {res.title}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Target Skill: {res.skillTaught}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                  <span>{res.durationEstimate || 'Flexible schedule'}</span>
                  <span className="font-semibold text-emerald-700 flex items-center gap-1">
                    Access Course <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
