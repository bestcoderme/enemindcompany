/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../../../types/user';
import { Campaign } from '../../../types/intelligence';
import { MarketingService } from '../../../services/intelligence/marketingService';
import { AnalyticsService } from '../../../services/analytics/analyticsService';
import { Sparkles, ArrowRight, X, GraduationCap, ShoppingBag, Users, Compass } from 'lucide-react';

interface CampaignBannerWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const CampaignBannerWidget: React.FC<CampaignBannerWidgetProps> = ({
  user,
  onNavigate,
}) => {
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const userEvents = AnalyticsService.getUserEvents(user.email);
    const qualifiedSegments = MarketingService.evaluateUserSegments(user.email, userEvents, user);
    const campaigns = MarketingService.getEligibleCampaigns(user.email, qualifiedSegments, 'dashboard_card');

    if (campaigns.length > 0) {
      const selected = campaigns[0];
      setActiveCampaign(selected);
      MarketingService.recordCampaignImpression(user.email, selected.id);
      AnalyticsService.track('CAMPAIGN_VIEWED', { campaignId: selected.id }, user);
    }
  }, [user]);

  if (!activeCampaign || dismissed) {
    return null;
  }

  const handleAction = () => {
    AnalyticsService.track('CAMPAIGN_CLICKED', { campaignId: activeCampaign.id }, user);
    onNavigate(activeCampaign.actionTargetView);
  };

  const getIcon = () => {
    switch (activeCampaign.iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-emerald-300" />;
      case 'ShoppingBag':
        return <ShoppingBag className="w-5 h-5 text-amber-300" />;
      case 'Users':
        return <Users className="w-5 h-5 text-purple-300" />;
      case 'Compass':
      default:
        return <Compass className="w-5 h-5 text-blue-300" />;
    }
  };

  return (
    <div className="relative rounded-2xl bg-neutral-900 text-white p-5 shadow-md border border-neutral-800 overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5 max-w-3xl">
          <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Personalized Recommendation
              </span>
            </div>
            <h3 className="text-sm font-bold text-white font-heading">
              {activeCampaign.title}
            </h3>
            <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
              {activeCampaign.message}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleAction}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-neutral-950 font-bold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
          >
            <span>{activeCampaign.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {activeCampaign.dismissible && (
            <button
              onClick={() => setDismissed(true)}
              className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
