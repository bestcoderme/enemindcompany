import React, { useState } from 'react';
import { Badge } from '../../components/common/Badge';
import { ShoppingBag, FileSpreadsheet, Check, ExternalLink, Sparkles, Download, ArrowRight } from 'lucide-react';

interface MarketplaceViewProps {
  onOpenPaymentModal: () => void;
  onOpenSheetLister: () => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  onOpenPaymentModal,
  onOpenSheetLister,
}) => {
  const AUTOMATION_PRODUCTS = [
    {
      id: 'auto-1',
      title: 'Automated Student GPA & Semester Marks Engine',
      category: 'Academic & School',
      priceKSh: 350,
      downloads: 420,
      rating: 4.9,
      features: ['Automatic Weighted GPA Calculation', 'Multi-University Scale Config', 'One-Click PDF Transcript Export', 'Google Drive Cloud Sync'],
      description: 'Production-ready Google Sheet with Apps Script macros that calculates cumulative GPA, predicts honours classification, and alerts on failed courses.',
    },
    {
      id: 'auto-2',
      title: 'Campus Merchant & Hostel Booking CRM',
      category: 'Business & CRM',
      priceKSh: 500,
      downloads: 680,
      rating: 5.0,
      features: ['M-PESA Payment Webhook Listener', 'WhatsApp Automated Confirmations', 'Room Availability Matrix', 'Financial Profit & Loss Sheet'],
      description: 'Complete CRM for hostel wardens and student entrepreneurs selling electronics, hair styling, or room rentals.',
    },
    {
      id: 'auto-3',
      title: 'Smart University Club & Event Ticket Automation',
      category: 'Productivity & Tools',
      priceKSh: 250,
      downloads: 310,
      rating: 4.8,
      features: ['Google Forms Registration Sync', 'QR Code Pass Generator', 'Automated Email Confirmation', 'Check-In Scanner Integration'],
      description: 'Streamline campus hackathons, seminars, and club registrations directly through Google Sheets & Gmail.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-neutral-900 font-heading tracking-tight">
            Enemind Automation Marketplace
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
            Ready-to-deploy automated Google Sheets and Google Apps Script systems for students and campus founders.
          </p>
        </div>

        <button
          onClick={onOpenSheetLister}
          className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Launch Free Sheet Lister</span>
        </button>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {AUTOMATION_PRODUCTS.map((prod) => (
          <div
            key={prod.id}
            className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="emerald">{prod.category}</Badge>
                <span className="text-xs font-bold text-emerald-600">★ {prod.rating}</span>
              </div>

              <h3 className="text-sm font-bold text-neutral-900 font-heading mb-2">{prod.title}</h3>
              <p className="text-xs text-neutral-600 leading-relaxed mb-4">{prod.description}</p>

              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 block mb-1">
                  Built-in Automation
                </span>
                {prod.features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-1.5 text-xs text-neutral-700">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
              <div>
                <span className="text-[10px] text-neutral-400 block font-medium">Price</span>
                <span className="text-sm font-black text-neutral-900">KSh {prod.priceKSh}</span>
              </div>

              <button
                onClick={onOpenPaymentModal}
                className="py-2 px-3.5 rounded-xl bg-neutral-900 text-white text-xs font-bold hover:bg-neutral-800 transition-all flex items-center gap-1 shadow-xs active:scale-95"
              >
                <span>Deploy System</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
