/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserProfile } from '../../types/user';
import {
  Career,
  CareerMatch,
  CareerGoal,
  StudentSkillRecord,
  SkillLevel,
  StudentProject,
  StudentPortfolio,
  CareerAssessmentAttempt,
  NextBestAction,
} from '../../types/career';

// Services
import { CareerService } from '../../services/career/careerService';
import { CareerAssessmentService } from '../../services/career/careerAssessmentService';
import { CareerMatchingService } from '../../services/career/careerMatchingService';
import { CareerSkillsService } from '../../services/career/careerSkillsService';
import { CareerGoalService } from '../../services/career/careerGoalService';
import { CareerProjectService } from '../../services/career/careerProjectService';
import { CareerPortfolioService } from '../../services/career/careerPortfolioService';
import { NextBestActionService } from '../../services/career/nextBestActionService';

// Sub-components
import { CareerExplorerTab } from './components/CareerExplorerTab';
import { CareerRoadmapTab } from './components/CareerRoadmapTab';
import { CareerSkillsTab } from './components/CareerSkillsTab';
import { CareerProjectsTab } from './components/CareerProjectsTab';
import { CareerPortfolioTab } from './components/CareerPortfolioTab';
import { CareerAssessmentTab } from './components/CareerAssessmentTab';
import { CareerDetailModal } from './components/CareerDetailModal';
import { CareerComparisonModal } from './components/CareerComparisonModal';
import { CareerTestsModal } from './components/CareerTestsModal';
import { AdminCareerModal } from './components/AdminCareerModal';

// Icons
import {
  Compass,
  Map,
  Zap,
  Code,
  FileText,
  Sparkles,
  ShieldCheck,
  Settings,
  ArrowRight,
  Target,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface CareerViewProps {
  user?: UserProfile;
  onNavigate?: (viewId: string) => void;
}

type CareerTab = 'explorer' | 'roadmap' | 'skills' | 'projects' | 'portfolio' | 'assessment';

export const CareerView: React.FC<CareerViewProps> = ({ user, onNavigate }) => {
  const studentEmail = user?.email || 'guest@enemind.org';

  // Active Tab State
  const [activeTab, setActiveTab] = useState<CareerTab>('explorer');

  // Core Data States
  const [careers, setCareers] = useState<Career[]>(() => CareerService.getAllCareers());
  const [skills, setSkills] = useState<StudentSkillRecord[]>(() =>
    CareerSkillsService.getStudentSkills(studentEmail)
  );
  const [projects, setProjects] = useState<StudentProject[]>(() =>
    CareerProjectService.getStudentProjects(studentEmail)
  );
  const [goals, setGoals] = useState<CareerGoal[]>(() =>
    CareerGoalService.getGoals(studentEmail)
  );
  const [portfolio, setPortfolio] = useState<StudentPortfolio>(() =>
    CareerPortfolioService.getPortfolio(user || null)
  );
  const [latestAssessment, setLatestAssessment] = useState<CareerAssessmentAttempt | null>(() =>
    CareerAssessmentService.getLatestAssessment(studentEmail)
  );

  // Modals & Selection States
  const [selectedCareerDetail, setSelectedCareerDetail] = useState<Career | null>(null);
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const [isTestsModalOpen, setIsTestsModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Active Primary Goal
  const activeGoal = useMemo(() => {
    return goals.find((g) => g.isPrimary && g.status === 'active') || goals[0] || null;
  }, [goals]);

  // Derived Student Career Profile & Matches
  const studentProfile = useMemo(() => {
    return CareerMatchingService.extractProfile(user || null);
  }, [user]);

  const careerMatches: CareerMatch[] = useMemo(() => {
    return CareerMatchingService.matchAllCareers(careers, studentProfile, latestAssessment);
  }, [careers, studentProfile, latestAssessment]);

  // Next Best Actions
  const nextActions: NextBestAction[] = useMemo(() => {
    return NextBestActionService.getNextBestActions(user || null);
  }, [user, latestAssessment, goals, skills, projects]);

  const primaryNextAction = nextActions[0];

  // Refresh all state handler
  const refreshAllState = useCallback(() => {
    setCareers(CareerService.getAllCareers());
    setSkills(CareerSkillsService.getStudentSkills(studentEmail));
    setProjects(CareerProjectService.getStudentProjects(studentEmail));
    setGoals(CareerGoalService.getGoals(studentEmail));
    setPortfolio(CareerPortfolioService.getPortfolio(user || null));
    setLatestAssessment(CareerAssessmentService.getLatestAssessment(studentEmail));
  }, [studentEmail, user]);

  // Handler: Set Career as Primary Goal
  const handleSetAsPrimaryGoal = (career: Career) => {
    const newGoal = CareerGoalService.createGoal(
      studentEmail,
      career.id,
      'Corporate Employment',
      '2028-06-30'
    );
    refreshAllState();
    setSelectedCareerDetail(null);
    setActiveTab('roadmap');
  };

  // Handler: Select Goal in Roadmap
  const handleSelectGoal = (goalId: string) => {
    CareerGoalService.setPrimaryGoal(studentEmail, goalId);
    setGoals(CareerGoalService.getGoals(studentEmail));
  };

  // Handler: Toggle Task Completion
  const handleToggleTask = (goalId: string, taskId: string) => {
    CareerGoalService.toggleTaskCompletion(studentEmail, goalId, taskId);
    setGoals(CareerGoalService.getGoals(studentEmail));
  };

  // Handler: Update Skill Level
  const handleUpdateSkill = (skillName: string, level: SkillLevel, notes?: string) => {
    CareerSkillsService.updateSkillLevel(studentEmail, skillName, level, notes);
    setSkills(CareerSkillsService.getStudentSkills(studentEmail));
  };

  // Handler: Start Project from Template
  const handleStartTemplate = (careerId: string, templateId: string) => {
    CareerProjectService.startProjectFromTemplate(studentEmail, careerId, templateId);
    setProjects(CareerProjectService.getStudentProjects(studentEmail));
    setActiveTab('projects');
  };

  // Handler: Complete Project
  const handleCompleteProject = (
    projectId: string,
    githubUrl?: string,
    liveUrl?: string,
    learnings?: string
  ) => {
    CareerProjectService.completeProject(studentEmail, projectId, githubUrl, liveUrl, learnings);
    setProjects(CareerProjectService.getStudentProjects(studentEmail));
  };

  // Handler: Create Custom Project
  const handleCreateCustomProject = (project: Omit<StudentProject, 'id' | 'studentEmail'>) => {
    CareerProjectService.createCustomProject(studentEmail, project);
    setProjects(CareerProjectService.getStudentProjects(studentEmail));
  };

  // Handler: Update Portfolio
  const handleUpdatePortfolio = (updated: StudentPortfolio) => {
    CareerPortfolioService.savePortfolio(updated);
    setPortfolio(updated);
  };

  // Handler: Toggle Compare
  const handleToggleCompare = (careerId: string) => {
    setSelectedForCompare((prev) =>
      prev.includes(careerId) ? prev.filter((id) => id !== careerId) : [...prev, careerId].slice(0, 3)
    );
  };

  // Handler: Execute Next Best Action Jump
  const handleExecuteAction = (action: NextBestAction) => {
    if (action.actionTargetView === 'opportunities') {
      if (onNavigate) onNavigate('opportunities');
      return;
    }
    if (action.actionTargetView === 'career-assessment') {
      setActiveTab('assessment');
    } else if (action.actionTargetView === 'career-explorer') {
      setActiveTab('explorer');
    } else if (action.actionTargetView === 'career-roadmap') {
      setActiveTab('roadmap');
    } else if (action.actionTargetView === 'career-skills') {
      setActiveTab('skills');
    } else if (action.actionTargetView === 'career-projects') {
      setActiveTab('projects');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              Phase 4 Engine
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
              Career Identification & Development
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Empowering students to identify target paths, master essential skills, build verified proof-of-work, and transition into employment or entrepreneurship.
          </p>
        </div>

        {/* Global Action Triggers */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsTestsModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Test Suite</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAdminModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Settings className="w-4 h-4 text-neutral-500" />
            <span>Admin</span>
          </button>
        </div>
      </div>

      {/* Intelligent "Next Best Action" Highlight Banner */}
      {primaryNextAction && (
        <div className="p-4 sm:p-5 rounded-2xl bg-linear-to-r from-neutral-900 via-neutral-900 to-neutral-800 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-neutral-800">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Recommended Next Step
              </span>
              <h3 className="text-sm font-bold text-white font-heading">
                {primaryNextAction.title}
              </h3>
              <p className="text-xs text-neutral-300 leading-relaxed max-w-2xl">
                {primaryNextAction.description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleExecuteAction(primaryNextAction)}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer shrink-0"
          >
            <span>{primaryNextAction.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Navigation Tab Bar */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-neutral-100/80 border border-neutral-200/80 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('explorer')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'explorer'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>Discover Careers</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-200 text-neutral-700">
            {careers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>6-Stage Roadmap</span>
          {activeGoal && (
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'skills'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>Skills & Gaps</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-200 text-neutral-700">
            {skills.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>Project Lab</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-neutral-200 text-neutral-700">
            {projects.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('portfolio')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'portfolio'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Verified CV / Portfolio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('assessment')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'assessment'
              ? 'bg-white text-neutral-950 shadow-xs'
              : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>Career Assessment</span>
          {latestAssessment && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              ✓ Done
            </span>
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'explorer' && (
          <CareerExplorerTab
            careerMatches={careerMatches}
            onSelectCareer={(career) => setSelectedCareerDetail(career)}
            onOpenComparison={(ids) => {
              setSelectedForCompare(ids);
              setIsComparisonOpen(true);
            }}
            selectedForCompare={selectedForCompare}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activeTab === 'roadmap' && (
          <CareerRoadmapTab
            studentEmail={studentEmail}
            activeGoal={activeGoal}
            allGoals={goals}
            onSelectGoal={handleSelectGoal}
            onToggleTask={handleToggleTask}
            onBrowseCareers={() => setActiveTab('explorer')}
          />
        )}

        {activeTab === 'skills' && (
          <CareerSkillsTab
            studentEmail={studentEmail}
            skills={skills}
            activeGoal={activeGoal}
            onUpdateSkill={handleUpdateSkill}
          />
        )}

        {activeTab === 'projects' && (
          <CareerProjectsTab
            studentEmail={studentEmail}
            projects={projects}
            activeGoal={activeGoal}
            onStartTemplate={handleStartTemplate}
            onCompleteProject={handleCompleteProject}
            onCreateCustomProject={handleCreateCustomProject}
          />
        )}

        {activeTab === 'portfolio' && (
          <CareerPortfolioTab
            portfolio={portfolio}
            onUpdatePortfolio={handleUpdatePortfolio}
            onTogglePublic={(isPublic) => {
              const updated = CareerPortfolioService.togglePublicVisibility(studentEmail, isPublic);
              setPortfolio(updated);
            }}
          />
        )}

        {activeTab === 'assessment' && (
          <CareerAssessmentTab
            studentEmail={studentEmail}
            onComplete={(attempt) => {
              setLatestAssessment(attempt);
              refreshAllState();
            }}
            onViewMatches={() => setActiveTab('explorer')}
          />
        )}
      </div>

      {/* MODALS */}

      {/* Career Detail Modal */}
      {selectedCareerDetail && (
        <CareerDetailModal
          career={selectedCareerDetail}
          studentEmail={studentEmail}
          onClose={() => setSelectedCareerDetail(null)}
          onSetAsPrimaryGoal={handleSetAsPrimaryGoal}
          onNavigateToOpportunities={() => {
            if (onNavigate) onNavigate('opportunities');
          }}
        />
      )}

      {/* Comparison Modal */}
      {isComparisonOpen && selectedForCompare.length > 0 && (
        <CareerComparisonModal
          careerIds={selectedForCompare}
          onClose={() => setIsComparisonOpen(false)}
          onSelectCareer={(career) => {
            setIsComparisonOpen(false);
            setSelectedCareerDetail(career);
          }}
          onSetAsPrimaryGoal={(career) => {
            setIsComparisonOpen(false);
            handleSetAsPrimaryGoal(career);
          }}
        />
      )}

      {/* Automated Tests Modal */}
      {isTestsModalOpen && (
        <CareerTestsModal onClose={() => setIsTestsModalOpen(false)} />
      )}

      {/* Admin Taxonomy Modal */}
      {isAdminModalOpen && (
        <AdminCareerModal
          onClose={() => setIsAdminModalOpen(false)}
          onRefresh={refreshAllState}
        />
      )}
    </div>
  );
};
