/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  FileSpreadsheet,
  X,
  CheckCircle2,
  ExternalLink,
  Copy,
  Download,
  Code,
  Zap,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { GoogleAppsScriptProduct } from '../../types/google';
import { appsScriptService, MARKETPLACE_SHEET_PRODUCTS } from '../../services/google/appsScriptService';

interface AutomatedSheetDeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: GoogleAppsScriptProduct | null;
  userEmail?: string;
  onSuccess?: (sheetUrl: string) => void;
}

export const AutomatedSheetDeploymentModal: React.FC<AutomatedSheetDeploymentModalProps> = ({
  isOpen,
  onClose,
  product: initialProduct,
  userEmail,
  onSuccess,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<GoogleAppsScriptProduct>(
    initialProduct || MARKETPLACE_SHEET_PRODUCTS[0]
  );
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployedResult, setDeployedResult] = useState<{
    sheetUrl: string;
    sheetId: string;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    setIsDeploying(true);
    try {
      const res = await appsScriptService.deployProduct(
        selectedProduct.id,
        userEmail || 'student@enemind.org'
      );
      setDeployedResult({ sheetUrl: res.sheetUrl, sheetId: res.sheetId });
      if (onSuccess) onSuccess(res.sheetUrl);
    } finally {
      setIsDeploying(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(selectedProduct.appsScriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                Google Sheets & Apps Script Marketplace
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                Automated Sheet Deployment Engine
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Product selector if multiple */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-500 mb-2">
              Select Sheet Product to Deploy
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MARKETPLACE_SHEET_PRODUCTS.map((prod) => (
                <button
                  key={prod.id}
                  type="button"
                  onClick={() => {
                    setSelectedProduct(prod);
                    setDeployedResult(null);
                  }}
                  className={`p-3 text-left rounded-2xl border transition-all cursor-pointer ${
                    selectedProduct.id === prod.id
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-sm'
                      : 'bg-neutral-50 border-neutral-200 text-neutral-800 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{prod.title}</span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        selectedProduct.id === prod.id
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : 'bg-neutral-200 text-neutral-700'
                      }`}
                    >
                      KSh {prod.priceKsh}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] mt-1 line-clamp-1 ${
                      selectedProduct.id === prod.id ? 'text-neutral-300' : 'text-neutral-500'
                    }`}
                  >
                    {prod.category} · {prod.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Product Details */}
          <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-neutral-900">{selectedProduct.title}</h4>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800">
                  Ready for Instant Deployment
                </span>
              </div>
              <p className="text-xs text-neutral-600 mt-1">{selectedProduct.description}</p>
            </div>

            <div className="space-y-1 pt-2 border-t border-emerald-100">
              <span className="text-[11px] font-bold uppercase text-emerald-900">Key Capabilities:</span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-neutral-700">
                {selectedProduct.features.map((f, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Deployment Status / Success Card */}
          {deployedResult ? (
            <div className="p-4 bg-emerald-100 text-emerald-950 rounded-2xl space-y-3 border border-emerald-300 animate-in zoom-in-95">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                <div>
                  <h4 className="text-xs font-black">Sheet Successfully Created in Your Google Drive!</h4>
                  <p className="text-[11px] text-emerald-800">
                    Template copied and macros ready to execute in your personal Drive account.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-emerald-200">
                <span className="text-xs font-mono font-bold text-neutral-900 truncate">
                  {selectedProduct.title}.gsheet
                </span>
                <a
                  href={deployedResult.sheetUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <span>Open Google Sheet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div>
                <h5 className="text-xs font-bold text-neutral-900">Zero Server Cost Hosting</h5>
                <p className="text-[11px] text-neutral-500">
                  Runs directly on Google Drive using Google Apps Script runtime.
                </p>
              </div>
              <button
                type="button"
                onClick={handleDeploy}
                disabled={isDeploying}
                className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-black flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>{isDeploying ? 'Deploying to Drive...' : 'Deploy to My Google Drive'}</span>
              </button>
            </div>
          )}

          {/* Embedded Apps Script Source Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-neutral-500" />
                <span>Embedded Google Apps Script Source</span>
              </span>
              <button
                type="button"
                onClick={copyCode}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Script Code'}</span>
              </button>
            </div>
            <pre className="p-3 bg-neutral-900 text-neutral-200 text-[11px] font-mono rounded-2xl max-h-36 overflow-y-auto leading-relaxed">
              {selectedProduct.appsScriptCode}
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
