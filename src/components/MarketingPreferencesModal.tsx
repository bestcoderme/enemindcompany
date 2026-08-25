/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types/user';
import { MarketingPreference } from '../types/intelligence';
import { MarketingService } from '../services/intelligence/marketingService';
import { Shield, Lock, CheckCircle2, X, Sparkles, Bell, Mail, BarChart3, ShoppingBag } from 'lucide-react';

interface MarketingPreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave?: () => void;
}

export const MarketingPreferencesModal: React.FC<MarketingPreferencesModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [preferences, setPreferences] = useState<MarketingPreference>({
    userId: user.email,
    personalizedRecommendations: true,
    marketingEmails: true,
    marketingNotifications: true,
    productRecommendations: true,
    analyticsTracking: true,
    lastUpdated: new Date().toISOString(),
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = MarketingService.getPreferences(user.email);
      setPreferences(current);
      setSavedSuccess(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleToggle = (key: keyof Omit<MarketingPreference, 'userId' | 'lastUpdated'>) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    MarketingService.savePreferences(preferences);
    setSavedSuccess(true);
    setTimeout(() => {
      onClose();
      if (onSave) onSave();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-neutral-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold font-heading text-neutral-900">
                Privacy & Intelligence Preferences
              </h3>
              <p className="text-xs text-neutral-500 font-medium">
                Transparent consent control for recommendations and communications
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Strict Data Isolation Box */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 mb-5 flex items-start gap-3">
          <Lock className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-emerald-950">
              Enemind Zero-Leak Privacy Guarantee
            </h4>
            <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
              Your raw academic examination marks, private documents in Google Drive, and internal chat conversations are strictly isolated. They are <strong>never</strong> used for marketing segmentation or exposed to external advertisers.
            </p>
          </div>
        </div>

        {/* Toggles list */}
        <div className="space-y-3.5 mb-6">
          {/* Personalized Recommendations */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-900">Personalized Recommendations</p>
                <p className="text-[11px] text-neutral-500">
                  Suggest scholarships, mentors, and career roadmaps based on your degree
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('personalizedRecommendations')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferences.personalizedRecommendations ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  preferences.personalizedRecommendations ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Product & Template Recommendations */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-900">Marketplace & Automation Suggestions</p>
                <p className="text-[11px] text-neutral-500">
                  Display verified student-built Google Sheet templates and study tools
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('productRecommendations')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferences.productRecommendations ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  preferences.productRecommendations ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Marketing Notifications */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <Bell className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-900">In-App Career Alerts & Spotlights</p>
                <p className="text-[11px] text-neutral-500">
                  Receive notifications about approaching scholarship deadlines & internships
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('marketingNotifications')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferences.marketingNotifications ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  preferences.marketingNotifications ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>

          {/* Analytics Telemetry */}
          <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors bg-neutral-50/50">
            <div className="flex items-start gap-3">
              <BarChart3 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-neutral-900">Anonymous Usage Telemetry</p>
                <p className="text-[11px] text-neutral-500">
                  Help improve GPA grading algorithms and platform search speed
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleToggle('analyticsTracking')}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                preferences.analyticsTracking ? 'bg-emerald-500' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                  preferences.analyticsTracking ? 'left-6' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-2 shadow-sm active:scale-95 cursor-pointer"
          >
            {savedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <span>Save Preferences</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
