/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Cloud,
  FileSpreadsheet,
  HardDrive,
  Database,
  CheckCircle2,
  X,
  Copy,
  ExternalLink,
  RefreshCw,
  Zap,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Shield,
  Key,
  Clock,
  Lock,
  Unlock,
  Layers,
  Mail,
  Calendar,
  Video,
  GraduationCap,
  MessageSquare,
  Users,
  FolderLock,
  FileText,
  Code,
  Youtube,
  Download,
} from 'lucide-react';
import { UserProfile, CloudStorageConfig } from '../types';
import {
  GoogleServiceCapability,
  GoogleAccountInfo,
  GoogleAuditLogEntry,
} from '../types/google';
import { googleAccountService } from '../services/google/googleAccountService';
import { googleAuditService } from '../services/google/googleAuditService';
import {
  getCloudStorageConfig,
  saveCloudStorageConfig,
} from '../services/googleSheetsStorageService';

interface CloudDatabaseSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onOpenMpesaModal?: (purpose: 'enehub_activation' | 'findlocal_unlock' | 'findlocal_sheet') => void;
  onSyncComplete?: () => void;
  userEmail?: string;
  userName?: string;
  userUniversity?: string;
}

export const CloudDatabaseSettingsModal: React.FC<CloudDatabaseSettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenMpesaModal,
  onSyncComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'workspace' | 'legacy_sheet' | 'permissions' | 'audit' | 'mpesa'>('workspace');
  const [accountInfo, setAccountInfo] = useState<GoogleAccountInfo>(
    googleAccountService.getConnectionStatus()
  );
  const [services, setServices] = useState<GoogleServiceCapability[]>(
    googleAccountService.getAllServices()
  );
  const [auditLogs, setAuditLogs] = useState<GoogleAuditLogEntry[]>(googleAuditService.getLogs());
  const [config, setConfig] = useState<CloudStorageConfig>(getCloudStorageConfig());
  const [copied, setCopied] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authorizingService, setAuthorizingService] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    setAccountInfo(googleAccountService.getConnectionStatus());
    setServices(googleAccountService.getAllServices());
    setAuditLogs(googleAuditService.getLogs());
    setConfig(getCloudStorageConfig());
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConnectGoogle = async () => {
    setIsConnecting(true);
    try {
      const res = await googleAccountService.connectGoogle(user?.email);
      if (res.success) {
        showToast('Google Account & Workspace connected!');
        refreshData();
        if (onSyncComplete) onSyncComplete();
      } else {
        showToast(res.error || 'Failed to connect.');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const handleAuthorizeService = async (serviceKey: string) => {
    setAuthorizingService(serviceKey);
    try {
      const ok = await googleAccountService.authorizeService(serviceKey, user?.email);
      if (ok) {
        showToast(`Authorized ${serviceKey.toUpperCase()}!`);
        refreshData();
      } else {
        showToast(`Failed to authorize ${serviceKey}.`);
      }
    } finally {
      setAuthorizingService(null);
    }
  };

  const handleRevokeService = (serviceKey: string) => {
    googleAccountService.revokeService(serviceKey);
    showToast(`Revoked permission for ${serviceKey}.`);
    refreshData();
  };

  const handleDisconnect = () => {
    if (window.confirm('Disconnect Google Workspace services from ENEMIND?')) {
      googleAccountService.disconnectGoogle();
      showToast('Google services disconnected.');
      refreshData();
    }
  };

  const copyAppsScriptCode = () => {
    const code = `// Google Apps Script for ENEMIND Database
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  if (data.action === "ADD_LISTING") {
    sheet.appendRow([data.item.id, data.item.name, data.item.type, data.item.price, data.item.contact, data.item.whatsappNumber, new Date()]);
    return ContentService.createTextOutput(JSON.stringify({ status: "SUCCESS" })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail':
        return <Mail className="w-4 h-4" />;
      case 'FolderLock':
        return <FolderLock className="w-4 h-4" />;
      case 'Calendar':
        return <Calendar className="w-4 h-4" />;
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4" />;
      case 'Users':
        return <Users className="w-4 h-4" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-4 h-4" />;
      case 'FileText':
        return <FileText className="w-4 h-4" />;
      case 'Code':
        return <Code className="w-4 h-4" />;
      case 'Youtube':
        return <Youtube className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const permissions = googleAccountService.getGrantedPermissions();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/75 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 block">
                Google Workspace & Cloud Ecosystem
              </span>
              <h3 className="text-base font-bold font-heading text-white">
                Google Services, Drive Storage & Database Control
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Account Strip */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className={`w-3 h-3 rounded-full ${accountInfo.isConnected ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-neutral-300'}`} />
            <div>
              <span className="text-xs font-bold text-neutral-900">
                {accountInfo.isConnected ? (accountInfo.email || user?.email || 'Google Connected') : 'No Google Account Connected'}
              </span>
              <span className="text-[11px] text-neutral-500 block">
                {accountInfo.isConnected ? `${accountInfo.scopes.length} OAuth scopes active` : 'Connect Google account to sync Drive, Meet, Gmail & Calendar'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {accountInfo.isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleConnectGoogle}
                  disabled={isConnecting}
                  className="px-3 py-1 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-bold text-neutral-700 flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold text-rose-700 cursor-pointer"
                >
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectGoogle}
                disabled={isConnecting}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-200 px-6 gap-4 bg-white text-xs font-bold shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('workspace')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'workspace'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Google Services ({services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Scopes & Security ({permissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'audit'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Audit Trail ({auditLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mpesa')}
            className={`py-3 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'mpesa'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>M-Pesa Unlocks</span>
          </button>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-6 mt-3 p-2.5 bg-neutral-900 text-white text-xs font-bold rounded-xl flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMsg}</span>
              </div>
              <button type="button" onClick={() => setToastMsg(null)} className="text-neutral-400 hover:text-white">
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab 1: Google Services */}
        {activeTab === 'workspace' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {services.map((svc) => {
                const isAuth = svc.isAuthorized;
                const isPending = authorizingService === svc.service;

                return (
                  <div
                    key={svc.service}
                    className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                      isAuth
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                              isAuth ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {getServiceIcon(svc.iconName)}
                          </div>
                          <h4 className="text-xs font-bold text-neutral-900">{svc.name}</h4>
                        </div>

                        {isAuth ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Active</span>
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-600">
                            Available
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-neutral-600 leading-snug mb-2">
                        {svc.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">
                        {svc.requiredScopes.length} scope{svc.requiredScopes.length === 1 ? '' : 's'}
                      </span>

                      {isAuth ? (
                        <button
                          type="button"
                          onClick={() => handleRevokeService(svc.service)}
                          className="text-[10px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          Revoke
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAuthorizeService(svc.service)}
                          disabled={isPending}
                          className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[11px] font-bold cursor-pointer transition-all"
                        >
                          {isPending ? 'Connecting...' : 'Authorize'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Granted Scopes */}
        {activeTab === 'permissions' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
              <p className="text-xs text-emerald-900 leading-relaxed">
                ENEMIND acts as an orchestration client. We do not store Google passwords or intermediary copies of your private files.
              </p>
            </div>

            <div className="space-y-2">
              {permissions.map((p, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-neutral-900">{p.service}</span>
                    <p className="text-[11px] text-neutral-500">{p.description}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Granted
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Audit Trail */}
        {activeTab === 'audit' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs font-mono"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-800">
                      {log.service}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-sans">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-neutral-800 font-sans font-bold mt-1">{log.purpose}</p>
                  {log.details && (
                    <p className="text-[11px] text-neutral-500 font-sans italic">{log.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: M-Pesa Unlocks */}
        {activeTab === 'mpesa' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">EneHub 1-Year Access</span>
                  <span className="text-xs font-bold text-emerald-700">KSh 200</span>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Academic notes, verified exam past papers with solutions, GPA calculator.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenMpesaModal) onOpenMpesaModal('enehub_activation');
                  }}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Activate with M-PESA
                </button>
              </div>

              <div className="p-4 bg-white border border-neutral-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">FindLocal Directory Unlock</span>
                  <span className="text-xs font-bold text-purple-700">KSh 200</span>
                </div>
                <p className="text-neutral-500 text-[11px]">
                  Campus hostels TikTok feed, cyber, salon, food joints & WhatsApp bookings.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenMpesaModal) onOpenMpesaModal('findlocal_unlock');
                  }}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold cursor-pointer"
                >
                  Unlock FindLocal
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
