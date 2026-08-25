/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Career } from '../../../types/career';
import { CareerIntegrationService } from '../../../services/career/careerIntegrationService';
import { CareerSkillsService } from '../../../services/career/careerSkillsService';
import {
  X,
  Sparkles,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Globe,
  BookOpen,
  Code,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';

interface CareerDetailModalProps {
  career: Career | null;
  studentEmail: string;
  onClose: () => void;
  onSetAsPrimaryGoal: (career: Career) => void;
  onNavigateToOpportunities: () => void;
}

export const CareerDetailModal: React.FC<CareerDetailModalProps> = ({
  career,
  studentEmail,
  onClose,
  onSetAsPrimaryGoal,
  onNavigateToOpportunities,
}) => {
  if (!career) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'skills_gap' | 'projects_learning' | 'pathways_opps'>('overview');

  const relatedOpps = CareerIntegrationService.getRelatedOpportunities(career);
  const skillGap = CareerSkillsService.analyzeSkillGap(career, studentEmail);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 flex items-start justify-between gap-4 bg-neutral-900 text-white shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white/10 text-emerald-300 border border-white/10">
                {career.category}
              </span>
              {career.remotePossible && (
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-400/20 flex items-center gap-1">
                  <Globe className="w-3 h-3" /> Remote Viable ({career.remotePotentialScore}%)
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              {career.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300">
              {career.tagline || career.description}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-100 bg-neutral-50 shrink-0 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Overview & Daily Role
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('skills_gap')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'skills_gap'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <span>Skills & Gap Analysis</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              {skillGap.readinessPercentage}% Ready
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('projects_learning')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'projects_learning'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            Projects & Resources ({career.projectTemplates.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('pathways_opps')}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pathways_opps'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <span>Live Opportunities</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-sky-100 text-sky-800 font-bold">
              {relatedOpps.totalCount}
            </span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-neutral-800">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Career Summary
                </h4>
                <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                  {career.description}
                </p>
              </div>

              {/* What professionals do */}
              <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                  <Briefcase className="w-4 h-4 text-emerald-600" />
                  What Professionals Do Day-to-Day
                </h4>
                <ul className="space-y-2">
                  {career.whatProfessionalsDo.map((item, idx) => (
                    <li key={idx} className="text-xs text-neutral-600 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Education & Entry Roles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-neutral-600" />
                    Education Pathways
                  </span>
                  <p className="text-xs font-bold text-neutral-900">
                    Recommended: {career.educationRequirements.recommendedMajor}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    Min Degree Level: {career.educationRequirements.minimumLevel}
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-neutral-200 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-neutral-600" />
                    Common Entry-Level Roles
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {career.entryLevelRoles.map((role, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[11px] bg-neutral-100 text-neutral-800 font-medium">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Salary Benchmarks */}
              <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Configured Compensation Benchmarks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {career.salaryInformation.map((sal, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-emerald-200/60 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 block">
                        {sal.country} ({sal.currency})
                      </span>
                      <p className="text-xs font-extrabold text-neutral-900">
                        {sal.entryLevel}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        Mid: {sal.midLevel}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS & GAP ANALYSIS */}
          {activeTab === 'skills_gap' && (
            <div className="space-y-6">
              {/* Readiness Score Box */}
              <div className="p-5 rounded-2xl bg-neutral-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                    Target Career Readiness
                  </span>
                  <h3 className="text-lg font-bold font-heading">
                    {skillGap.readinessPercentage}% Skill Profile Alignment
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Based on your declared skills compared against {career.title} requirements.
                  </p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-black text-emerald-400 shrink-0">
                  {skillGap.readinessPercentage}%
                </div>
              </div>

              {/* Next Recommended Skill Action Box */}
              {skillGap.nextRecommendedSkill && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    Priority Focus Skill To Learn
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                    {skillGap.nextRecommendedSkill.skillName}
                  </h4>
                  <p className="text-xs text-neutral-600">
                    {skillGap.nextRecommendedSkill.whyPriority}
                  </p>
                </div>
              )}

              {/* Skills Breakdown Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Required Skills */}
                <div className="p-4 rounded-xl border border-neutral-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Mandatory Core Skills
                  </h4>
                  <div className="space-y-1.5">
                    {career.requiredSkills.map((req, i) => {
                      const isMastered = skillGap.masteredSkills.includes(req);
                      const isInProg = skillGap.inProgressSkills.includes(req);
                      return (
                        <div
                          key={i}
                          className="p-2.5 rounded-lg bg-neutral-50 text-xs flex items-center justify-between"
                        >
                          <span className="font-semibold text-neutral-900">{req}</span>
                          {isMastered ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Mastered
                            </span>
                          ) : isInProg ? (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-sky-100 text-sky-800 font-bold">
                              In Progress
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] bg-neutral-200 text-neutral-600 font-bold">
                              To Learn
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommended & Future Skills */}
                <div className="p-4 rounded-xl border border-neutral-200 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                    Recommended & Future Horizons
                  </h4>
                  <div className="space-y-1.5">
                    {career.recommendedSkills.map((rec, i) => (
                      <div key={i} className="p-2.5 rounded-lg bg-neutral-50 text-xs flex items-center justify-between">
                        <span className="text-neutral-700">{rec}</span>
                        <span className="text-[10px] text-neutral-400">Competitive Edge</span>
                      </div>
                    ))}
                    {career.futureSkills.map((fut, i) => (
                      <div key={`fut-${i}`} className="p-2.5 rounded-lg bg-purple-50 text-xs flex items-center justify-between">
                        <span className="text-purple-900 font-medium">{fut}</span>
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-200 text-purple-800 font-bold">2026-2030+</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS & RESOURCES */}
          {activeTab === 'projects_learning' && (
            <div className="space-y-6">
              {/* Project Templates */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-emerald-600" />
                  Recommended Proof-of-Work Projects
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {career.projectTemplates.map((proj) => (
                    <div key={proj.id} className="p-4 rounded-xl border border-neutral-200 space-y-2 bg-neutral-50/50">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs sm:text-sm font-bold text-neutral-900">
                          {proj.title}
                        </h5>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                          {proj.difficulty} · ~{proj.estimatedHours} hrs
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {proj.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.skillsPracticed.map((sk, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-white border border-neutral-200 text-neutral-700">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Free Learning Resources */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  Verified Learning Resources
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {career.learningResources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl border border-neutral-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold text-emerald-700 uppercase">
                            {res.provider}
                          </span>
                          {res.isFree && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                              Free
                            </span>
                          )}
                        </div>
                        <h6 className="text-xs font-bold text-neutral-900 line-clamp-1 mb-1">
                          {res.title}
                        </h6>
                        <p className="text-[11px] text-neutral-500 line-clamp-2">
                          Skill: {res.skillTaught}
                        </p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                        <span>{res.durationEstimate || 'Self-paced'}</span>
                        <span className="font-semibold text-emerald-700 flex items-center gap-0.5">
                          Open Resource <ExternalLink className="w-3 h-3" />
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PATHWAYS & LIVE OPPORTUNITIES */}
          {activeTab === 'pathways_opps' && (
            <div className="space-y-6">
              {/* Entrepreneurship & Freelancing */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  Venture & Freelance Opportunities
                </h4>
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-neutral-800 block">
                    High-Potential Commercial Startup Concepts:
                  </span>
                  <ul className="space-y-1.5">
                    {career.entrepreneurshipIdeas?.map((idea, idx) => (
                      <li key={idx} className="text-xs text-neutral-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{idea}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Integrated Phase 3 Opportunities */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-sky-600" />
                    Live Matched Opportunities ({relatedOpps.totalCount})
                  </h4>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onNavigateToOpportunities();
                    }}
                    className="text-xs font-bold text-sky-600 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>View in Discovery Engine</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {relatedOpps.totalCount > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[...relatedOpps.attachments, ...relatedOpps.internships, ...relatedOpps.jobs].slice(0, 4).map((opp) => (
                      <div
                        key={opp.id}
                        className="p-3.5 rounded-xl border border-neutral-200 bg-white space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 uppercase">
                            {opp.type}
                          </span>
                          <span className="text-[11px] font-bold text-emerald-700">
                            {opp.fundingAmount || 'Competitive'}
                          </span>
                        </div>
                        <h5 className="text-xs font-bold text-neutral-900 line-clamp-1">
                          {opp.title}
                        </h5>
                        <p className="text-[11px] text-neutral-500 truncate">
                          {opp.organization} · {opp.location}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center bg-neutral-50 rounded-xl border border-neutral-100 text-xs text-neutral-400">
                    No active listings currently filed for this specific category.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTA */}
        <div className="p-4 sm:p-6 border-t border-neutral-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            Close Profile
          </button>

          <button
            type="button"
            onClick={() => onSetAsPrimaryGoal(career)}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <span>Set as My Primary Career Goal & Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
