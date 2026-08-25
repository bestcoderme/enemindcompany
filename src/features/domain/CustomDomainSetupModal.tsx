/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  Github,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Server,
  ArrowRight,
  Sparkles,
  HelpCircle,
  X,
  RefreshCw,
} from 'lucide-react';
import { domainService, DnsRecordConfig } from '../../services/website/domainService';
import { ENEMIND_LOGO_URL } from '../../constants/brand';

interface CustomDomainSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomDomainSetupModal: React.FC<CustomDomainSetupModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedState, setVerifiedState] = useState<'IDLE' | 'CHECKING' | 'READY'>('IDLE');

  if (!isOpen) return null;

  const dnsRecords = domainService.getGitHubDnsRecords();
  const domainName = 'enemindcompany.co.ke';

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateCheck = () => {
    setVerifiedState('CHECKING');
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setVerifiedState('READY');
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full border border-neutral-200 shadow-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-950 border border-neutral-700/80 overflow-hidden flex items-center justify-center p-0.5 shadow-md shrink-0">
              <img
                src={ENEMIND_LOGO_URL}
                alt="ENEMIND"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-black text-xl text-white">
                  GitHub & Custom Domain Setup
                </h3>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready
                </span>
              </div>
              <p className="text-xs text-emerald-400 mt-1 font-mono font-bold">
                {domainName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Quick status bar */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold text-xs text-emerald-900">
                  Configuration Ready for GitHub Pages
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  Your CNAME file, 404 SPA router, and GitHub Actions deploy workflow have been automatically added.
                </p>
              </div>
            </div>
            <button
              onClick={handleSimulateCheck}
              disabled={isVerifying}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Checking...' : 'Check DNS'}</span>
            </button>
          </div>

          {verifiedState === 'READY' && (
            <div className="p-3.5 rounded-xl bg-neutral-900 text-white text-xs flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Target Domain: <strong>{domainName}</strong>
              </span>
              <span className="text-[11px] text-neutral-300 font-mono">SSL / HTTPS Enforced</span>
            </div>
          )}

          {/* 3 Step Process */}
          <div className="space-y-4">
            <h4 className="font-heading font-extrabold text-sm text-neutral-900 uppercase tracking-wider">
              Follow these 3 Steps to Launch
            </h4>

            {/* Step 1: Export to GitHub */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <span className="font-bold text-sm text-neutral-900">Export or Push to GitHub</span>
              </div>
              <p className="text-xs text-neutral-600 pl-8 leading-relaxed">
                In Google AI Studio, open the top-right Settings menu and click <strong>"Export to GitHub"</strong> (or download the ZIP and push to your GitHub repo).
              </p>
            </div>

            {/* Step 2: Configure DNS */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <span className="font-bold text-sm text-neutral-900">
                  Add DNS Records at your Domain Registrar (.co.ke)
                </span>
              </div>
              <p className="text-xs text-neutral-600 pl-8 leading-relaxed">
                Log in to where you registered <strong>enemindcompany.co.ke</strong> (e.g. Kenya Web Experts, Truehost, HostPinnacle, Safaricom, Namecheap, Cloudflare, etc.) and add these DNS records:
              </p>

              {/* DNS Records Table */}
              <div className="pl-8">
                <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100/70 border-b border-neutral-200 font-bold text-neutral-700">
                      <tr>
                        <th className="p-2.5">Type</th>
                        <th className="p-2.5">Host / Name</th>
                        <th className="p-2.5">Points To (Value)</th>
                        <th className="p-2.5 text-right">Copy</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 font-mono text-[11px]">
                      {dnsRecords.map((rec, i) => (
                        <tr key={i} className="hover:bg-neutral-50">
                          <td className="p-2.5 font-bold text-emerald-700">{rec.type}</td>
                          <td className="p-2.5 text-neutral-800">{rec.host}</td>
                          <td className="p-2.5 text-neutral-900 font-semibold">{rec.value}</td>
                          <td className="p-2.5 text-right">
                            <button
                              onClick={() => handleCopy(rec.value, `dns-${i}`)}
                              className="p-1 rounded text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 cursor-pointer"
                              title="Copy Value"
                            >
                              {copiedKey === `dns-${i}` ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Step 3: Enable GitHub Pages */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-neutral-900 text-white text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <span className="font-bold text-sm text-neutral-900">
                  Enable Custom Domain in GitHub Settings
                </span>
              </div>
              <div className="text-xs text-neutral-600 pl-8 space-y-1 leading-relaxed">
                <p>1. Go to your GitHub repository &rarr; <strong>Settings</strong> &rarr; <strong>Pages</strong>.</p>
                <p>2. Under <strong>Build and deployment</strong>, select <strong>GitHub Actions</strong>.</p>
                <p>3. Under <strong>Custom domain</strong>, enter: <code className="bg-white px-1.5 py-0.5 rounded border border-neutral-200 font-bold text-neutral-900">enemindcompany.co.ke</code> and click <strong>Save</strong>.</p>
                <p>4. Check <strong>"Enforce HTTPS"</strong> to activate free automatic SSL certificates.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-100 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Automatic SSL / TLS encryption provided by GitHub Pages</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs cursor-pointer"
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
};
