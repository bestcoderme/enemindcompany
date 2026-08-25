/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CareerComparison, Career } from '../../../types/career';
import { CareerService } from '../../../services/career/careerService';
import {
  X,
  Sparkles,
  CheckCircle2,
  DollarSign,
  Globe,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface CareerComparisonModalProps {
  careerIds: string[];
  onClose: () => void;
  onSelectCareer: (career: Career) => void;
  onSetAsPrimaryGoal: (career: Career) => void;
}

export const CareerComparisonModal: React.FC<CareerComparisonModalProps> = ({
  careerIds,
  onClose,
  onSelectCareer,
  onSetAsPrimaryGoal,
}) => {
  const comparison: CareerComparison = CareerService.compareCareers(careerIds);

  if (comparison.careers.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between gap-4 bg-neutral-900 text-white shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
              Comparative Analysis Matrix
            </span>
            <h2 className="text-xl font-bold font-heading">
              Comparing {comparison.careers.length} Career Pathways
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comparison Table Grid */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Shared Skills Callout */}
          {comparison.skillOverlap.length > 0 && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Transferable Shared Skills Overlap
              </span>
              <p className="text-xs text-emerald-950 font-semibold">
                {comparison.skillOverlap.join(' · ')}
              </p>
              <p className="text-[11px] text-emerald-700">
                Mastering these skills gives you cross-disciplinary mobility across both paths.
              </p>
            </div>
          )}

          {/* Matrix Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparison.careers.map((career) => {
              const salary = comparison.salaryComparison[career.id];
              return (
                <div
                  key={career.id}
                  className="p-5 rounded-2xl border border-neutral-200 bg-white space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Category & Remote */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                        {career.category}
                      </span>
                      {career.remotePossible && (
                        <span className="text-[10px] font-bold text-sky-700 flex items-center gap-1">
                          <Globe className="w-3 h-3" /> Remote ({career.remotePotentialScore}%)
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 font-heading">
                      {career.title}
                    </h3>
                    <p className="text-xs text-neutral-500 line-clamp-2">
                      {career.tagline || career.description}
                    </p>

                    {/* Salary */}
                    <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1 text-xs">
                      <span className="text-[10px] font-bold uppercase text-neutral-400 block">
                        Estimated Pay (Kenya)
                      </span>
                      <p className="font-extrabold text-neutral-900">
                        Entry: {salary?.entryLevel || 'Competitive'}
                      </p>
                      <p className="text-neutral-500 text-[11px]">
                        Mid-Level: {salary?.midLevel || 'Competitive'}
                      </p>
                    </div>

                    {/* Core Skills */}
                    <div className="space-y-1.5 text-xs">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">
                        Required Core Skills
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {career.requiredSkills.map((sk, i) => (
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                              comparison.skillOverlap.includes(sk)
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Venture Score */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-neutral-500 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Venture Potential
                      </span>
                      <span className="font-bold text-neutral-900">
                        {career.entrepreneurshipPotentialScore}/100
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-neutral-100 space-y-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectCareer(career);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold transition-colors cursor-pointer"
                    >
                      View Full Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSetAsPrimaryGoal(career);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    >
                      Choose as Primary Goal
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
