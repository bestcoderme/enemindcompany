/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CareerGoal, RoadmapTask } from '../../../types/career';
import { CareerGoalService } from '../../../services/career/careerGoalService';
import {
  CheckCircle2,
  Circle,
  Calendar,
  Sparkles,
  Layers,
  Briefcase,
  Target,
  ArrowRight,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface CareerRoadmapTabProps {
  studentEmail: string;
  activeGoal: CareerGoal | null;
  allGoals: CareerGoal[];
  onSelectGoal: (goalId: string) => void;
  onToggleTask: (goalId: string, taskId: string) => void;
  onBrowseCareers: () => void;
}

export const CareerRoadmapTab: React.FC<CareerRoadmapTabProps> = ({
  studentEmail,
  activeGoal,
  allGoals,
  onSelectGoal,
  onToggleTask,
  onBrowseCareers,
}) => {
  if (!activeGoal) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-neutral-200 p-8 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Target className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-neutral-900 font-heading">
            No Active Career Roadmap Set
          </h3>
          <p className="text-xs text-neutral-500">
            Choose a target career pathway to generate an interactive 6-stage milestone progression plan.
          </p>
        </div>
        <button
          type="button"
          onClick={onBrowseCareers}
          className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-colors cursor-pointer"
        >
          Explore Career Catalog
        </button>
      </div>
    );
  }

  const structure = CareerGoalService.getRoadmapStructure(activeGoal);

  return (
    <div className="space-y-6">
      {/* Goal Banner & Progress */}
      <div className="p-6 rounded-3xl bg-neutral-900 text-white shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-emerald-400 border border-white/10">
                Primary Goal · {activeGoal.targetPathway}
              </span>
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Target: {activeGoal.targetDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              {activeGoal.careerTitle} Roadmap
            </h2>
            <p className="text-xs text-neutral-400">
              Structured 6-stage milestone pathway from university foundations to industry employment or venture launch.
            </p>
          </div>

          {/* Goals Switcher */}
          {allGoals.length > 1 && (
            <div className="flex items-center gap-1.5 shrink-0 bg-white/10 p-1 rounded-xl">
              {allGoals.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => onSelectGoal(g.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    g.id === activeGoal.id
                      ? 'bg-white text-neutral-950 shadow-xs'
                      : 'text-neutral-300 hover:text-white'
                  }`}
                >
                  {g.careerTitle.split(' ')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress Metric Bar */}
        <div className="space-y-2 pt-2 border-t border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-semibold">
              Roadmap Progress: {structure.completedTasks} of {structure.totalTasks} Tasks Completed
            </span>
            <span className="text-emerald-400 font-black text-sm">
              {structure.progressPercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${structure.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 6-Stage Timeline */}
      <div className="space-y-6">
        {structure.stages.map((stage) => (
          <div
            key={stage.stage}
            className={`p-6 rounded-2xl border transition-all ${
              stage.isStageComplete
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-neutral-200'
            }`}
          >
            {/* Stage Header */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                    stage.isStageComplete
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  {stage.isStageComplete ? <CheckCircle2 className="w-4 h-4" /> : stage.stageNumber}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-heading">
                    {stage.stageLabel}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {stage.description}
                  </p>
                </div>
              </div>

              {stage.isStageComplete && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider shrink-0">
                  Stage Mastered
                </span>
              )}
            </div>

            {/* Stage Tasks List */}
            <div className="space-y-2.5">
              {stage.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(activeGoal.id, task.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                    task.isCompleted
                      ? 'bg-white border-emerald-200/80 shadow-xs'
                      : 'bg-neutral-50 border-neutral-200/80 hover:bg-neutral-100/60'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center mt-0.5 text-xs transition-colors shrink-0 ${
                      task.isCompleted
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-neutral-300 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`text-xs font-bold ${
                          task.isCompleted ? 'text-neutral-500 line-through' : 'text-neutral-900'
                        }`}
                      >
                        {task.title}
                      </h4>
                      {task.completedAt && (
                        <span className="text-[10px] text-emerald-600 font-medium shrink-0">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      {task.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
