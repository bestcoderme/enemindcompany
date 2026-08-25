import React from 'react';
import { UniversityGradingSystem, University } from '../../../types';
import { Award, X, BookOpen, Layers, CheckCircle } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface GradingRulesReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  gradingSystem: UniversityGradingSystem;
  university?: University | null;
}

export const GradingRulesReferenceModal: React.FC<GradingRulesReferenceModalProps> = ({
  isOpen,
  onClose,
  gradingSystem,
  university,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-neutral-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 sm:p-6 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 font-heading">
                {university?.name || 'Institution'} Grading Scale
              </h3>
              <p className="text-xs text-neutral-500">Official configured academic boundaries</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Overview Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Scale Type</span>
              <span className="text-xs font-bold text-neutral-900 mt-0.5 block">{gradingSystem.name}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Maximum GP</span>
              <span className="text-base font-black text-emerald-600 mt-0.5 block">{gradingSystem.maxPoint.toFixed(1)} max</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block">Pass Mark</span>
              <span className="text-base font-black text-neutral-900 mt-0.5 block">{gradingSystem.passMarkPercentage}% min</span>
            </div>
          </div>

          {/* Grade Rules Table */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 mb-2">Grade Points & Mark Boundaries</h4>
            <div className="overflow-x-auto rounded-xl border border-neutral-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600">
                  <tr>
                    <th className="py-2.5 px-3.5 font-bold">Grade</th>
                    <th className="py-2.5 px-3.5 font-semibold">Marks Range</th>
                    <th className="py-2.5 px-3.5 font-semibold text-center">Grade Point</th>
                    <th className="py-2.5 px-3.5 font-semibold">Academic Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {gradingSystem.gradeRules.map((r) => (
                    <tr key={r.grade} className="hover:bg-neutral-50/50">
                      <td className="py-2.5 px-3.5 font-bold text-neutral-900">{r.grade}</td>
                      <td className="py-2.5 px-3.5">{r.minScore}% - {r.maxScore}%</td>
                      <td className="py-2.5 px-3.5 font-bold text-emerald-600 text-center">{r.gradePoint.toFixed(1)}</td>
                      <td className="py-2.5 px-3.5 text-neutral-600">{r.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Honours Classification Rules */}
          {gradingSystem.classificationRules && (
            <div>
              <h4 className="text-xs font-bold text-neutral-900 mb-2">Degree Classification Standards</h4>
              <div className="space-y-1.5 text-xs text-neutral-700">
                <div className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                  <span className="font-semibold">First Class Honours</span>
                  <span className="font-black text-emerald-600">≥ {gradingSystem.classificationRules.firstClassMin.toFixed(2)} GPA</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                  <span className="font-semibold">Second Class Honours (Upper Division)</span>
                  <span className="font-bold text-neutral-900">≥ {gradingSystem.classificationRules.secondUpperMin.toFixed(2)} GPA</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                  <span className="font-semibold">Second Class Honours (Lower Division)</span>
                  <span className="font-bold text-neutral-900">≥ {gradingSystem.classificationRules.secondLowerMin.toFixed(2)} GPA</span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 flex items-center justify-between">
                  <span className="font-semibold">Pass Degree</span>
                  <span className="font-bold text-neutral-900">≥ {gradingSystem.classificationRules.passMin.toFixed(2)} GPA</span>
                </div>
              </div>
            </div>
          )}

          {/* GPA Formula */}
          <div className="p-4 rounded-2xl bg-neutral-900 text-white space-y-1 text-xs">
            <span className="font-bold text-neutral-300 block">Weighted GPA Calculation Formula</span>
            <p className="font-mono text-emerald-400 text-[11px] pt-1">
              GPA = Σ(Grade Point × Credit Hours) ÷ Σ(Credit Hours)
            </p>
            <p className="text-[11px] text-neutral-400 pt-1">
              Quality Points are computed per course unit and divided by total completed credit hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
