import React, { useState, useEffect } from 'react';
import { AcademicSummary, UniversityGradingSystem } from '../../../types';
import { AcademicCalculationService } from '../../../services/academic/academicCalculationService';
import { Target, Sparkles, TrendingUp, HelpCircle, CheckCircle2, AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface TargetGpaTabProps {
  summary: AcademicSummary;
  gradingSystem: UniversityGradingSystem;
  onSaveTargetGpa: (targetGpa: number) => void;
}

export const TargetGpaTab: React.FC<TargetGpaTabProps> = ({
  summary,
  gradingSystem,
  onSaveTargetGpa,
}) => {
  const maxPoint = gradingSystem.maxPoint || 4.0;

  // Simulator Inputs
  const [currentGpa, setCurrentGpa] = useState<number>(summary.cumulativeGpa || 3.42);
  const [currentCredits, setCurrentCredits] = useState<number>(summary.totalCreditsCompleted || 72);
  const [targetGpa, setTargetGpa] = useState<number>(summary.targetGpa || 3.7);
  const [remainingCredits, setRemainingCredits] = useState<number>(48);

  // Custom What-If Input
  const [customGradePoint, setCustomGradePoint] = useState<number>(3.5);

  // Sync with actual summary when summary updates and inputs are untouched
  useEffect(() => {
    if (summary.cumulativeGpa > 0) {
      setCurrentGpa(summary.cumulativeGpa);
    }
    if (summary.totalCreditsCompleted > 0) {
      setCurrentCredits(summary.totalCreditsCompleted);
    }
    if (summary.targetGpa) {
      setTargetGpa(summary.targetGpa);
    }
  }, [summary]);

  // Run calculation
  const simulation = AcademicCalculationService.calculateTargetGPA(
    currentGpa,
    currentCredits,
    targetGpa,
    remainingCredits,
    gradingSystem
  );

  // Run What-If scenarios
  const whatIfScenarios = AcademicCalculationService.simulateWhatIfScenarios(
    currentGpa,
    currentCredits,
    remainingCredits,
    gradingSystem
  );

  // Custom What-If scenario
  const customFuturePoints = customGradePoint * remainingCredits;
  const customTotalCredits = currentCredits + remainingCredits;
  const customProjectedGpa =
    customTotalCredits > 0
      ? Math.round(((currentGpa * currentCredits + customFuturePoints) / customTotalCredits) * 100) / 100
      : 0;

  return (
    <div className="space-y-8">
      {/* Target GPA Engine Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 font-heading">
                Target GPA Calculator & Academic Roadmap
              </h3>
              <p className="text-xs text-neutral-500">
                Determine the exact average grade point required in your remaining units to hit your graduation goal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCurrentGpa(summary.cumulativeGpa || 3.42);
                setCurrentCredits(summary.totalCreditsCompleted || 72);
                setRemainingCredits(48);
              }}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset from Records</span>
            </button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Current Cumulative GPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={maxPoint}
              id="target-calc-current-gpa"
              value={currentGpa}
              onChange={(e) => setCurrentGpa(parseFloat(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">Max scale: {maxPoint.toFixed(1)}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Completed Credits
            </label>
            <input
              type="number"
              min="0"
              id="target-calc-current-credits"
              value={currentCredits}
              onChange={(e) => setCurrentCredits(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">Units already completed</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-emerald-800 mb-1">
              Target Cumulative GPA
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={maxPoint}
              id="target-calc-target-gpa"
              value={targetGpa}
              onChange={(e) => {
                const val = parseFloat(e.target.value) || 0;
                setTargetGpa(val);
                onSaveTargetGpa(val);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border-2 border-emerald-500 text-sm font-black text-emerald-700 focus:ring-2 focus:ring-emerald-500 outline-none bg-emerald-50/30"
            />
            <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Your graduation goal</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">
              Remaining Credits
            </label>
            <input
              type="number"
              min="1"
              id="target-calc-remaining-credits"
              value={remainingCredits}
              onChange={(e) => setRemainingCredits(parseInt(e.target.value, 10) || 0)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-sm font-bold text-neutral-900 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">Future units (e.g. 48 credits)</span>
          </div>
        </div>

        {/* Calculation Result Display Box */}
        <div
          className={`p-5 sm:p-6 rounded-2xl border ${
            simulation.isAchievable
              ? 'bg-emerald-50/60 border-emerald-200'
              : 'bg-rose-50/60 border-rose-200'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                {simulation.isAchievable ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                )}
                <h4 className="text-sm font-bold text-neutral-900 font-heading">
                  {simulation.isAchievable
                    ? 'Target is Mathematically Achievable'
                    : 'Target Exceeds Maximum Possible Scale'}
                </h4>
              </div>
              <p className="text-xs text-neutral-600 mt-1 max-w-xl leading-relaxed">
                {simulation.recommendation}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0 bg-white p-3.5 rounded-xl border border-neutral-200/80 shadow-2xs">
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Required Future GPA
                </span>
                <span
                  className={`text-2xl font-black font-heading ${
                    simulation.isAchievable ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {simulation.requiredGpa.toFixed(2)}
                </span>
              </div>
              <div className="h-8 w-px bg-neutral-200" />
              <div className="text-center px-2">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                  Max Possible GPA
                </span>
                <span className="text-2xl font-black text-neutral-900 font-heading">
                  {simulation.maxPossibleGpa.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Suggested Units Breakdown */}
          {simulation.isAchievable && simulation.suggestedGradesBreakdown.length > 0 && (
            <div className="mt-4 pt-4 border-t border-emerald-200/60">
              <span className="text-xs font-bold text-neutral-800 block mb-2">
                Suggested Grade Breakdown in Remaining {remainingCredits} Credits:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {simulation.suggestedGradesBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className="px-3 py-1.5 rounded-lg bg-white border border-emerald-300 text-xs font-bold text-neutral-800 flex items-center gap-2"
                  >
                    <span className="text-emerald-700">{item.estimatedUnits} Units with Grade {item.grade}</span>
                    <span className="text-neutral-400 text-[10px]">({item.gradePoint.toFixed(1)} GP)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* "What If?" Scenario Simulator */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-neutral-200 shadow-xs space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-neutral-900 font-heading">
              &quot;What If?&quot; Academic Scenario Simulator
            </h3>
            <p className="text-xs text-neutral-500">
              Simulate hypothetical performance across your remaining {remainingCredits} credits. (Does not modify actual records).
            </p>
          </div>
        </div>

        {/* What-If Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {whatIfScenarios.map((scenario) => {
            const isPositive = scenario.gpaDifference >= 0;
            return (
              <div
                key={scenario.id}
                className="p-4 rounded-2xl bg-neutral-50/80 border border-neutral-200/80 hover:border-neutral-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{scenario.title}</span>
                    <span
                      className={`text-xs font-black ${
                        isPositive ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {isPositive ? `+${scenario.gpaDifference.toFixed(2)}` : scenario.gpaDifference.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 leading-snug">
                    {scenario.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/50 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Projected GPA
                  </span>
                  <span className="text-lg font-black text-neutral-900 font-heading">
                    {scenario.projectedCumulativeGpa.toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom What-If Interactive Slider */}
        <div className="p-5 rounded-2xl bg-neutral-900 text-white space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-sm font-bold font-heading">Custom Projected Performance</h4>
              <p className="text-xs text-neutral-400">
                Test custom average grade points in future {remainingCredits} credits:
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-neutral-400">Average Future GP:</span>
              <span className="text-xl font-black text-emerald-400 font-heading">
                {customGradePoint.toFixed(2)}
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max={maxPoint}
            step="0.05"
            value={customGradePoint}
            onChange={(e) => setCustomGradePoint(parseFloat(e.target.value))}
            className="w-full h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs">
            <span className="text-neutral-400">
              Current Cumulative: <strong className="text-white">{currentGpa.toFixed(2)}</strong>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Projected Cumulative:</span>
              <span className="text-base font-black text-emerald-400 font-heading">
                {customProjectedGpa.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
