/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CareerAssessmentQuestion,
  CareerAssessmentAttempt,
} from '../../../types/career';
import { CareerAssessmentService } from '../../../services/career/careerAssessmentService';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  History,
  Compass,
  Zap,
} from 'lucide-react';

interface CareerAssessmentTabProps {
  studentEmail: string;
  onComplete: (attempt: CareerAssessmentAttempt) => void;
  onViewMatches: () => void;
}

export const CareerAssessmentTab: React.FC<CareerAssessmentTabProps> = ({
  studentEmail,
  onComplete,
  onViewMatches,
}) => {
  const questions = CareerAssessmentService.getQuestions();
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastAttempt, setLastAttempt] = useState<CareerAssessmentAttempt | null>(() =>
    CareerAssessmentService.getLatestAssessment(studentEmail)
  );
  const [showHistory, setShowHistory] = useState(false);

  const historyAttempts = CareerAssessmentService.getAssessmentHistory(studentEmail);
  const currentQuestion: CareerAssessmentQuestion = questions[currentStep];

  const handleSelectOption = (optionId: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit assessment
      const attempt = CareerAssessmentService.submitAssessment(studentEmail, selectedAnswers);
      setLastAttempt(attempt);
      setIsCompleted(true);
      onComplete(attempt);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const progressPercentage = Math.round(((currentStep + (isCompleted ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-heading">
              Career Discovery Assessment
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Multi-signal assessment analyzing your natural interests, technical affinities, strengths, and work preferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {historyAttempts.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory(!showHistory)}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-neutral-500" />
              <span>History ({historyAttempts.length})</span>
            </button>
          )}

          {(isCompleted || lastAttempt) && (
            <button
              type="button"
              onClick={handleRetake}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-xs font-semibold text-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span>Retake Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* History Drawer */}
      {showHistory && (
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
          <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">
            Previous Assessment Attempts
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {historyAttempts.map((att, idx) => (
              <div
                key={att.id}
                className="p-3 rounded-xl bg-white border border-neutral-200 text-xs flex items-center justify-between"
              >
                <div>
                  <p className="font-bold text-neutral-900">
                    Attempt #{historyAttempts.length - idx}
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    {new Date(att.completedAt).toLocaleDateString()} at{' '}
                    {new Date(att.completedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isCompleted ? (
        <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-600">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="font-extrabold text-emerald-600">
                {progressPercentage}% Completed
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          {/* Question Title */}
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-neutral-100 text-neutral-600">
              {currentQuestion.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-neutral-900 font-heading pt-1">
              {currentQuestion.question}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-400/20 shadow-xs'
                      : 'bg-white border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-xs transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-neutral-300 text-transparent'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900">
                      {opt.label}
                    </h4>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                currentStep === 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!selectedAnswers[currentQuestion.id]}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedAnswers[currentQuestion.id]
                  ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              <span>{currentStep === questions.length - 1 ? 'Analyze & See Results' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Completed State Banner */
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-7 h-7" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="text-lg font-black text-neutral-900 font-heading">
              Assessment Successfully Analyzed!
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              We have synthesized your assessment signals alongside your degree programme and academic foundation to generate personalized career recommendations.
            </p>
          </div>

          {lastAttempt && (
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 max-w-md mx-auto text-left space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Key Extracted Signals
              </span>
              <div className="flex flex-wrap gap-1.5">
                {lastAttempt.declaredStrengths.map((st, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200/50">
                    Strength: {st}
                  </span>
                ))}
                {lastAttempt.declaredPreferences.map((pr, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-sky-50 text-sky-800 text-[11px] font-semibold border border-sky-200/50">
                    Preference: {pr}
                  </span>
                ))}
                {lastAttempt.declaredGoals.map((g, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-purple-50 text-purple-800 text-[11px] font-semibold border border-purple-200/50">
                    Goal: {g}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onViewMatches}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>Explore My Career Matches</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRetake}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Retake Questions
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
