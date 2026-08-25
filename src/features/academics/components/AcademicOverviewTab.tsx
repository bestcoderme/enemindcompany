import React from 'react';
import { AcademicSummary, UniversityGradingSystem } from '../../../types';
import { Award, BookOpen, CheckCircle, TrendingUp, Sparkles, Layers, ArrowUpRight, BarChart3 } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface AcademicOverviewTabProps {
  summary: AcademicSummary;
  gradingSystem: UniversityGradingSystem;
  onOpenTargetCalculator: () => void;
  onOpenAddSemester: () => void;
  onOpenDemoLoader: () => void;
}

export const AcademicOverviewTab: React.FC<AcademicOverviewTabProps> = ({
  summary,
  gradingSystem,
  onOpenTargetCalculator,
  onOpenAddSemester,
  onOpenDemoLoader,
}) => {
  const maxPoint = gradingSystem.maxPoint || 4.0;
  const gpaPercentage = maxPoint > 0 ? (summary.cumulativeGpa / maxPoint) * 100 : 0;

  if (summary.semesters.length === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-white border border-neutral-200 text-center shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
          <BookOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-black text-neutral-900 font-heading">
          Your academic journey starts here.
        </h3>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          Record your course units, CAT coursework, and final examination marks. ENEMIND will
          automatically calculate your official semester and cumulative GPA using {gradingSystem.name}.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            type="button"
            id="academic-add-first-semester-btn"
            onClick={onOpenAddSemester}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Add Your First Semester
          </button>
          <button
            type="button"
            id="academic-load-demo-btn"
            onClick={onOpenDemoLoader}
            className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold transition-all cursor-pointer"
          >
            Load Sample Transcript
          </button>
        </div>
      </div>
    );
  }

  // Calculate total grades count for distribution percentage
  const totalGrades = Object.values(summary.gradeDistribution || {}).reduce<number>(
    (a, b) => a + (Number(b) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Top Academic Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Cumulative GPA Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-850 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-neutral-300">Cumulative GPA</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
              {maxPoint.toFixed(1)} Scale
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3.5xl sm:text-4xl font-black font-heading tracking-tight text-white">
              {summary.cumulativeGpa > 0 ? summary.cumulativeGpa.toFixed(2) : '0.00'}
            </span>
            <span className="text-xs text-neutral-400 font-medium">/ {maxPoint.toFixed(2)}</span>
          </div>

          {/* Progress bar towards max GPA */}
          <div className="mt-3 w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, gpaPercentage)}%` }}
            />
          </div>

          <p className="mt-2.5 text-[11px] text-emerald-300 font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{summary.academicClassification}</span>
          </p>
        </div>

        {/* Total Credits Card */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500">Credits Completed</span>
            <p className="text-3xl font-black text-neutral-900 font-heading mt-2">
              {summary.totalCreditsCompleted}
            </p>
          </div>
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Total Quality Points</span>
            <span className="font-bold text-neutral-900">{summary.totalQualityPoints.toFixed(1)}</span>
          </div>
        </div>

        {/* Semesters & Units Card */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-neutral-500">Total Units Graded</span>
            <p className="text-3xl font-black text-neutral-900 font-heading mt-2">
              {summary.unitsCompletedCount}
            </p>
          </div>
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
            <span>Recorded Semesters</span>
            <span className="font-bold text-neutral-900">{summary.semestersCount}</span>
          </div>
        </div>

        {/* Target GPA Preview Card */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500">Target Goal</span>
              <button
                type="button"
                onClick={onOpenTargetCalculator}
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-0.5"
              >
                Simulate <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
            <p className="text-3xl font-black text-neutral-900 font-heading mt-2">
              {summary.targetGpa ? summary.targetGpa.toFixed(2) : '3.80'}
            </p>
          </div>
          <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
            <span className="font-medium text-neutral-600">
              {summary.targetGpa && summary.cumulativeGpa >= summary.targetGpa
                ? 'Target reached'
                : 'Target simulator active'}
            </span>
          </div>
        </div>
      </div>

      {/* Grade Distribution & Performance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grade Distribution */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-neutral-700" />
              <h3 className="text-sm font-bold text-neutral-900 font-heading">
                Grade Distribution
              </h3>
            </div>
            <span className="text-[11px] text-neutral-400">{totalGrades} units</span>
          </div>

          <div className="space-y-2.5">
            {gradingSystem.gradeRules.map((rule) => {
              const count: number = Number(summary.gradeDistribution?.[rule.grade]) || 0;
              const pct = totalGrades > 0 ? (count / totalGrades) * 100 : 0;
              return (
                <div key={rule.grade} className="flex items-center gap-3 text-xs">
                  <span className="w-8 font-bold text-neutral-900">{rule.grade}</span>
                  <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-neutral-500 font-semibold">
                    {count} ({Math.round(pct)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* GPA Trajectory History */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-neutral-900 font-heading">
                Semester GPA Trajectory
              </h3>
            </div>
            <span className="text-[11px] text-neutral-500">Official weighted progress</span>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[450px] space-y-3">
              {summary.gpaTrend.map((trend, idx) => (
                <div
                  key={trend.semesterId || idx}
                  className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/70 flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-neutral-900">
                      {trend.academicYearName} — {trend.semesterName}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-xs">
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Semester GPA</span>
                      <span className="font-black text-neutral-900">
                        {trend.semesterGpa.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-neutral-400 block">Cumulative GPA</span>
                      <span className="font-black text-emerald-600">
                        {trend.cumulativeGpa.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Subjects Showcase */}
      {summary.strongestUnits.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <h4 className="text-xs font-bold text-neutral-900 font-heading mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Highest Performing Units</span>
            </h4>
            <div className="space-y-2">
              {summary.strongestUnits.map((u) => (
                <div
                  key={u.id}
                  className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-bold text-neutral-900">{u.unitCode}</span>
                    <span className="text-neutral-500 ml-1.5 truncate">{u.unitName}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-neutral-900">{u.percentage}%</span>
                    <Badge variant="emerald">{u.grade}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs">
            <h4 className="text-xs font-bold text-neutral-900 font-heading mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-neutral-500" />
              <span>Institutional Grading Classification Rule</span>
            </h4>
            <div className="space-y-2 text-xs text-neutral-600">
              <div className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                <span>First Class Honours</span>
                <span className="font-bold text-neutral-900">
                  ≥ {gradingSystem.classificationRules?.firstClassMin.toFixed(2) || '3.70'} GPA
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                <span>Second Class Upper Division</span>
                <span className="font-bold text-neutral-900">
                  ≥ {gradingSystem.classificationRules?.secondUpperMin.toFixed(2) || '3.00'} GPA
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                <span>Second Class Lower Division</span>
                <span className="font-bold text-neutral-900">
                  ≥ {gradingSystem.classificationRules?.secondLowerMin.toFixed(2) || '2.50'} GPA
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
