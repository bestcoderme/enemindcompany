import React from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  ShieldCheck,
  Globe,
  GraduationCap,
  Sparkles,
  RotateCcw,
  Check,
} from 'lucide-react';
import {
  OpportunityFilterOptions,
  OpportunityType,
  AcademicLevel,
} from '../../../types/opportunities';

interface OpportunityFiltersProps {
  filters: OpportunityFilterOptions;
  onFilterChange: (updated: Partial<OpportunityFilterOptions>) => void;
  onResetFilters: () => void;
  totalResultsCount: number;
}

const OPPORTUNITY_TYPES: OpportunityType[] = [
  'Scholarship',
  'Attachment',
  'Internship',
  'Job',
  'Fellowship',
  'Competition',
  'Graduate Programme',
  'Volunteering',
  'Training',
];

const ACADEMIC_LEVELS: AcademicLevel[] = [
  'All Levels',
  'Year 1',
  'Year 2',
  'Year 3',
  'Year 4',
  'Postgraduate',
  'Masters',
  'Recent Graduate',
];

const FIELDS_LIST = [
  'All',
  'Engineering',
  'Technology',
  'Computer Science',
  'Business & Finance',
  'Health & Medicine',
  'Sciences',
  'Law',
  'Agriculture',
];

export const OpportunityFilters: React.FC<OpportunityFiltersProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResultsCount,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const activeFilterCount = [
    Boolean(filters.types && filters.types.length > 0),
    Boolean(filters.field && filters.field !== 'All'),
    Boolean(filters.academicLevel && filters.academicLevel !== 'All Levels'),
    Boolean(filters.remoteOnly),
    Boolean(filters.verifiedOnly),
    Boolean(filters.deadlineFilter && filters.deadlineFilter !== 'all'),
    Boolean(filters.minStudentGpa && filters.minStudentGpa > 0),
  ].filter(Boolean).length;

  const toggleType = (type: OpportunityType) => {
    const current = filters.types || [];
    if (current.includes(type)) {
      const next = current.filter((t) => t !== type);
      onFilterChange({ types: next });
    } else {
      onFilterChange({ types: [...current, type] });
    }
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-slate-900/90 border border-slate-800 p-4 sm:p-5 shadow-lg backdrop-blur-md">
      {/* Top Row: Search Input + Filter Toggle + Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="input-opportunity-search"
            type="text"
            placeholder="Search by role, company, skill (e.g., Python, Safaricom, Mastercard, KenGen)..."
            value={filters.searchQuery || ''}
            onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
          />
          {filters.searchQuery && (
            <button
              type="button"
              onClick={() => onFilterChange({ searchQuery: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Buttons: Filter Drawer Toggle & Sort */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-advanced-filters"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
              showAdvanced || activeFilterCount > 0
                ? 'bg-sky-600/20 text-sky-400 border-sky-500/40'
                : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 font-bold text-[11px] flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Sort selector */}
          <select
            id="select-opportunity-sort"
            aria-label="Sort opportunities"
            value={filters.sortBy || 'recommended'}
            onChange={(e) =>
              onFilterChange({
                sortBy: e.target.value as OpportunityFilterOptions['sortBy'],
              })
            }
            className="px-3 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-xs font-medium text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="recommended">Best Match First</option>
            <option value="deadline_asc">Deadline (Soonest)</option>
            <option value="created_desc">Newly Added</option>
            <option value="gpa_asc">GPA Requirement (Lowest)</option>
          </select>
        </div>
      </div>

      {/* Horizontal Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar pt-1">
        <button
          type="button"
          onClick={() => onFilterChange({ types: [] })}
          className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            !filters.types || filters.types.length === 0
              ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-sm font-bold'
              : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          All Types
        </button>

        {OPPORTUNITY_TYPES.map((type) => {
          const isSelected = (filters.types || []).includes(type);
          return (
            <button
              key={type}
              type="button"
              onClick={() => toggleType(type)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm font-semibold'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
              }`}
            >
              {isSelected && <Check className="w-3 h-3 text-sky-400" />}
              {type}
            </button>
          );
        })}
      </div>

      {/* Advanced Filter Drawer */}
      {showAdvanced && (
        <div className="pt-4 mt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-200">
          {/* Field / Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Study Field / Domain
            </label>
            <select
              aria-label="Study Field or Domain"
              value={filters.field || 'All'}
              onChange={(e) => onFilterChange({ field: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {FIELDS_LIST.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Level */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Academic Level
            </label>
            <select
              aria-label="Academic Level"
              value={filters.academicLevel || 'All Levels'}
              onChange={(e) =>
                onFilterChange({
                  academicLevel: e.target.value as AcademicLevel,
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {ACADEMIC_LEVELS.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Deadline Urgency */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Deadline Urgency
            </label>
            <select
              aria-label="Deadline Urgency"
              value={filters.deadlineFilter || 'all'}
              onChange={(e) =>
                onFilterChange({
                  deadlineFilter: e.target
                    .value as OpportunityFilterOptions['deadlineFilter'],
                })
              }
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            >
              <option value="all">All Deadlines</option>
              <option value="closing_soon">Closing Soon (≤ 7 days)</option>
              <option value="this_month">Within 30 Days</option>
              <option value="today">Closes Today</option>
              <option value="no_deadline">Rolling / No Deadline</option>
            </select>
          </div>

          {/* Toggle Switches: Remote Only & Verified Only */}
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200">
              <input
                type="checkbox"
                checked={Boolean(filters.remoteOnly)}
                onChange={(e) => onFilterChange({ remoteOnly: e.target.checked })}
                className="w-4 h-4 rounded text-sky-500 focus:ring-sky-500 focus:ring-offset-slate-900 border-slate-700 bg-slate-950"
              />
              <Globe className="w-3.5 h-3.5 text-sky-400" />
              <span>Remote Only</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-slate-200">
              <input
                type="checkbox"
                checked={Boolean(filters.verifiedOnly)}
                onChange={(e) =>
                  onFilterChange({ verifiedOnly: e.target.checked })
                }
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 border-slate-700 bg-slate-950"
              />
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Results Count & Reset row */}
      <div className="flex items-center justify-between pt-2 text-xs text-slate-400">
        <span>
          Found <strong className="text-slate-200">{totalResultsCount}</strong> opportunities
        </span>

        {(activeFilterCount > 0 || filters.searchQuery) && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  );
};
