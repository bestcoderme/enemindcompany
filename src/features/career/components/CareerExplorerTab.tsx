/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Career, CareerMatch, CareerCategory } from '../../../types/career';
import { CareerService } from '../../../services/career/careerService';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Globe,
  Briefcase,
  Layers,
  ArrowRight,
  TrendingUp,
  Check,
  Plus,
} from 'lucide-react';

interface CareerExplorerTabProps {
  careerMatches: CareerMatch[];
  onSelectCareer: (career: Career) => void;
  onOpenComparison: (careerIds: string[]) => void;
  selectedForCompare: string[];
  onToggleCompare: (careerId: string) => void;
}

export const CareerExplorerTab: React.FC<CareerExplorerTabProps> = ({
  careerMatches,
  onSelectCareer,
  onOpenComparison,
  selectedForCompare,
  onToggleCompare,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [entrepreneurshipOnly, setEntrepreneurshipOnly] = useState(false);

  const categories = useMemo(() => ['All', ...CareerService.getAllCategories()], []);

  const filteredMatches = useMemo(() => {
    return careerMatches.filter(({ career }) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const titleMatch = career.title.toLowerCase().includes(q);
        const descMatch = career.description.toLowerCase().includes(q);
        const skillMatch = [...career.requiredSkills, ...career.recommendedSkills].some((s) =>
          s.toLowerCase().includes(q)
        );
        const progMatch = career.relatedProgrammes.some((p) => p.toLowerCase().includes(q));
        if (!titleMatch && !descMatch && !skillMatch && !progMatch) return false;
      }

      // Category
      if (selectedCategory !== 'All' && career.category !== selectedCategory) {
        return false;
      }

      // Remote
      if (remoteOnly && (!career.remotePossible || career.remotePotentialScore < 60)) {
        return false;
      }

      // Entrepreneurship
      if (entrepreneurshipOnly && career.entrepreneurshipPotentialScore < 70) {
        return false;
      }

      return true;
    });
  }, [careerMatches, searchQuery, selectedCategory, remoteOnly, entrepreneurshipOnly]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative w-full flex-1">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search careers, degree programmes, skills (e.g. PLC, Python, Civil)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <button
              type="button"
              onClick={() => setRemoteOnly(!remoteOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                remoteOnly
                  ? 'bg-sky-50 border-sky-300 text-sky-700 font-bold'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Remote Viable</span>
            </button>

            <button
              type="button"
              onClick={() => setEntrepreneurshipOnly(!entrepreneurshipOnly)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                entrepreneurshipOnly
                  ? 'bg-amber-50 border-amber-300 text-amber-700 font-bold'
                  : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Venture & Startup</span>
            </button>
          </div>
        </div>

        {/* Category Pills Carousel */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Drawer Trigger */}
      {selectedForCompare.length > 0 && (
        <div className="p-3.5 rounded-xl bg-neutral-900 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold">
              {selectedForCompare.length} Career(s) selected for side-by-side comparison
            </span>
          </div>
          <button
            type="button"
            onClick={() => onOpenComparison(selectedForCompare)}
            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold transition-colors cursor-pointer"
          >
            Compare Now →
          </button>
        </div>
      )}

      {/* Results Count & Tier Legend */}
      <div className="flex items-center justify-between text-xs text-neutral-500 px-1">
        <span>Showing {filteredMatches.length} career pathways</span>
        <span className="hidden sm:inline">Recommendations ranked by alignment with your degree & assessment</span>
      </div>

      {/* Career Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMatches.map(({ career, matchScore, matchTier, matchTierLabel, summaryExplanation }) => {
          const isComparing = selectedForCompare.includes(career.id);
          const salary = career.salaryInformation.find((s) => s.country === 'Kenya') || career.salaryInformation[0];

          let tierBadgeColor = 'bg-neutral-100 text-neutral-700 border-neutral-200';
          if (matchTier === 'excellent') tierBadgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          else if (matchTier === 'strong') tierBadgeColor = 'bg-sky-50 text-sky-800 border-sky-200';
          else if (matchTier === 'good') tierBadgeColor = 'bg-indigo-50 text-indigo-800 border-indigo-200';

          return (
            <div
              key={career.id}
              className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
                    {career.category}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${tierBadgeColor}`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{matchTierLabel}</span>
                    </span>
                  </div>
                </div>

                {/* Career Title & Description */}
                <h3 className="text-sm sm:text-base font-bold text-neutral-900 font-heading mb-1">
                  {career.title}
                </h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mb-3 leading-relaxed">
                  {career.tagline || career.description}
                </p>

                {/* Match Explanation Snippet */}
                <div className="p-2.5 rounded-xl bg-neutral-50 border border-neutral-100 text-[11px] text-neutral-600 mb-4 line-clamp-2 leading-relaxed">
                  <span className="font-bold text-neutral-800">Why fit: </span>
                  {summaryExplanation}
                </div>

                {/* Key Skills Tags */}
                <div className="space-y-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    Core Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {career.requiredSkills.slice(0, 3).map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {career.requiredSkills.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-neutral-400">
                        +{career.requiredSkills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Meta & Actions */}
              <div className="pt-3 border-t border-neutral-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-400 font-medium">Est. Entry Pay</span>
                  <span className="font-bold text-emerald-700">
                    {salary?.entryLevel || 'Competitive'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCareer(career)}
                    className="flex-1 py-2 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>Career Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleCompare(career.id)}
                    title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
                    className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                      isComparing
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    {isComparing ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMatches.length === 0 && (
        <div className="py-12 text-center bg-white rounded-2xl border border-neutral-200 p-6 space-y-2">
          <Briefcase className="w-8 h-8 text-neutral-300 mx-auto" />
          <h4 className="text-sm font-bold text-neutral-800">No matching careers found</h4>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search terms or clearing the category and remote filters.
          </p>
        </div>
      )}
    </div>
  );
};
