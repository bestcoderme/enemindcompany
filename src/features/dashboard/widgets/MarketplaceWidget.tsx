/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserProfile } from '../../../types/user';
import { ShoppingBag, ChevronRight, Download, Star, ArrowUpRight } from 'lucide-react';
import { Badge } from '../../../components/common/Badge';

interface MarketplaceWidgetProps {
  user: UserProfile;
  onNavigate: (viewId: string) => void;
}

export const MarketplaceWidget: React.FC<MarketplaceWidgetProps> = ({
  onNavigate,
}) => {
  const trendingAutomations = [
    {
      id: 'item_1',
      title: 'Kenya KRA PAYE & NHIF Excel Automation',
      author: 'Kenya Sheet Masters',
      price: 'KSh 400',
      rating: '4.9',
      downloads: '142',
    },
    {
      id: 'item_2',
      title: 'M-PESA Business Till Auto-Reconciliation Sheet',
      author: 'Campus Automators',
      price: 'KSh 600',
      rating: '4.8',
      downloads: '98',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-xs flex flex-col justify-between h-full hover:border-amber-200 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 font-heading">EneHub Marketplace</h3>
              <p className="text-[11px] text-neutral-500 font-medium">Student-built Google Sheets & tools</p>
            </div>
          </div>
          <Badge variant="amber" size="sm">
            Instant Clone
          </Badge>
        </div>

        <div className="space-y-2.5">
          {trendingAutomations.map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('marketplace')}
              className="p-3 rounded-xl border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-amber-200 hover:shadow-xs transition-all cursor-pointer group flex items-center justify-between gap-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                    {item.price}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-neutral-500 font-medium">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{item.rating}</span>
                    <span>({item.downloads} downloads)</span>
                  </div>
                </div>
                <h4 className="text-xs font-bold text-neutral-900 group-hover:text-amber-700 transition-colors truncate">
                  {item.title}
                </h4>
                <p className="text-[10px] text-neutral-500 font-medium mt-0.5">
                  By {item.author}
                </p>
              </div>

              <div className="w-7 h-7 rounded-lg bg-neutral-200/50 flex items-center justify-center text-neutral-500 group-hover:bg-amber-500 group-hover:text-white transition-all shrink-0">
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
        <span className="text-[11px] text-neutral-500 font-medium">M-PESA Instant Delivery</span>
        <button
          onClick={() => onNavigate('marketplace')}
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 hover:underline"
        >
          <span>Browse Marketplace</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
