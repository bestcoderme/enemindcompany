/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Shield,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Lock,
  Unlock,
  Key,
  FileSpreadsheet,
  FileText,
  Mail,
  Calendar,
  Video,
  GraduationCap,
  MessageSquare,
  Users,
  FolderLock,
  Code,
  Youtube,
  Clock,
  Download,
  Trash2,
  Zap,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { UserProfile } from '../../types';
import {
  GoogleServiceCapability,
  GoogleAccountInfo,
  GoogleAuditLogEntry,
  GoogleServiceType,
} from '../../types/google';
import { googleAccountService } from '../../services/google/googleAccountService';
import { googleAuditService } from '../../services/google/googleAuditService';

interface GoogleServiceCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: UserProfile | null;
  onOpenMpesaModal?: (purpose: any) => void;
  onSyncComplete?: () => void;
}

export const GoogleServiceCenterModal: React.FC<GoogleServiceCenterModalProps> = ({
  isOpen,
  onClose,
  user,
  onOpenMpesaModal,
  onSyncComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'services' | 'permissions' | 'audit'>('services');
  const [accountInfo, setAccountInfo] = useState<GoogleAccountInfo>(
    googleAccountService.getConnectionStatus()
  );
  const [services, setServices] = useState<GoogleServiceCapability[]>(
    googleAccountService.getAllServices()
  );
  const [auditLogs, setAuditLogs] = useState<GoogleAuditLogEntry[]>(googleAuditService.getLogs());
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
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleConnectAll = async () => {
    setIsConnecting(true);
    try {
      const result = await googleAccountService.connectGoogle(user?.email);
      if (result.success) {
        showToast('Google Account & Workspace services connected successfully!');
        refreshData();
        if (onSyncComplete) onSyncComplete();
      } else {
        showToast(result.error || 'Failed to connect Google Account.');
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
        showToast(`Authorized ${serviceKey.toUpperCase()} successfully!`);
        refreshData();
      } else {
        showToast(`Authorization failed for ${serviceKey}.`);
      }
    } finally {
      setAuthorizingService(null);
    }
  };

  const handleRevokeService = (serviceKey: string) => {
    googleAccountService.revokeService(serviceKey);
    showToast(`Permissions revoked for ${serviceKey}.`);
    refreshData();
  };

  const handleDisconnectAll = () => {
    if (window.confirm('Are you sure you want to disconnect all Google services from your ENEMIND account?')) {
      googleAccountService.disconnectGoogle();
      showToast('Google services disconnected.');
      refreshData();
    }
  };

  const handleExportAudit = () => {
    const data = googleAuditService.exportAuditLogs();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enemind_google_audit_${Date.now()}.json`;
    a.click();
    showToast('Audit log exported.');
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Mail':
        return <Mail className="w-5 h-5" />;
      case 'FolderLock':
        return <FolderLock className="w-5 h-5" />;
      case 'Calendar':
        return <Calendar className="w-5 h-5" />;
      case 'Video':
        return <Video className="w-5 h-5" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Users':
        return <Users className="w-5 h-5" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Code':
        return <Code className="w-5 h-5" />;
      case 'Youtube':
        return <Youtube className="w-5 h-5" />;
      default:
        return <Shield className="w-5 h-5" />;
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
        className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-8 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="p-6 bg-neutral-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-black tracking-widest text-emerald-400">
                  Google Workspace & Cloud Ecosystem
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Client OAuth 2.0
                </span>
              </div>
              <h2 className="text-lg font-black font-heading text-white tracking-tight">
                Google Service Center & Access Control
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Account Status Strip */}
        <div className="px-6 py-4 bg-neutral-50 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-3.5 h-3.5 rounded-full ${accountInfo.isConnected ? 'bg-emerald-500 ring-4 ring-emerald-100' : 'bg-neutral-300'}`} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-900">
                  {accountInfo.isConnected ? (accountInfo.email || user?.email || 'Connected Google Account') : 'No Google Account Linked'}
                </span>
                {accountInfo.isConnected && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                )}
                {accountInfo.isWorkspaceAccount && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-blue-100 text-blue-800">
                    Google Workspace
                  </span>
                )}
              </div>
              <p className="text-[11px] text-neutral-500">
                {accountInfo.isConnected
                  ? `${accountInfo.scopes.length} OAuth scopes granted · Zero password storage`
                  : 'Connect your Google account to enable Drive sync, Gmail alerts, Meet & Calendar'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {accountInfo.isConnected ? (
              <>
                <button
                  type="button"
                  onClick={handleConnectAll}
                  disabled={isConnecting}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isConnecting ? 'animate-spin' : ''}`} />
                  <span>Refresh Auth</span>
                </button>
                <button
                  type="button"
                  onClick={handleDisconnectAll}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Disconnect</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleConnectAll}
                disabled={isConnecting}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>{isConnecting ? 'Connecting...' : 'Connect Google Workspace'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 px-6 gap-6 bg-white shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('services')}
            className={`py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'services'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Google Services Hub ({services.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('permissions')}
            className={`py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'permissions'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Granted Scopes & Security ({permissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`py-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'audit'
                ? 'border-neutral-900 text-neutral-900'
                : 'border-transparent text-neutral-400 hover:text-neutral-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Audit Trail Logs ({auditLogs.length})</span>
          </button>
        </div>

        {/* Toast Alert */}
        <AnimatePresence>
          {toastMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-6 mt-4 p-3 bg-neutral-900 text-white text-xs font-bold rounded-2xl flex items-center justify-between shadow-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{toastMsg}</span>
              </div>
              <button type="button" onClick={() => setToastMsg(null)} className="text-neutral-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab 1: Services Grid */}
        {activeTab === 'services' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {services.map((svc) => {
                const isAuth = svc.isAuthorized;
                const isPending = authorizingService === svc.service;

                return (
                  <div
                    key={svc.service}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                      isAuth
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : svc.status === 'REQUIRES_WORKSPACE'
                        ? 'bg-neutral-50 border-neutral-200 opacity-80'
                        : 'bg-white border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                              isAuth
                                ? 'bg-emerald-100 text-emerald-700'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {getServiceIcon(svc.iconName)}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-neutral-900">{svc.name}</h3>
                            <span className="text-[10px] text-neutral-400 uppercase font-mono">
                              google/{svc.service}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        {isAuth ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Connected</span>
                          </span>
                        ) : svc.status === 'REQUIRES_WORKSPACE' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                            Workspace Only
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-200 text-neutral-700">
                            Available
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                        {svc.description}
                      </p>
                    </div>

                    {/* Service Actions */}
                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400 font-medium">
                        {svc.requiredScopes.length} scope{svc.requiredScopes.length === 1 ? '' : 's'}
                      </span>

                      {isAuth ? (
                        <button
                          type="button"
                          onClick={() => handleRevokeService(svc.service)}
                          className="text-[11px] font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                        >
                          Revoke Permission
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleAuthorizeService(svc.service)}
                          disabled={isPending}
                          className="px-3 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                        >
                          <span>{isPending ? 'Authorizing...' : 'Authorize Service'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 2: Granted Scopes & Security */}
        {activeTab === 'permissions' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Security & OAuth 2.0 Compliance</h4>
                <p className="text-xs text-emerald-800 leading-relaxed mt-0.5">
                  ENEMIND uses standard Google Identity Services client tokens. Your Google credentials and passwords are never transmitted or stored on any intermediate server. You can revoke access individually at any time.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Active Authorization Scopes
              </h4>
              {permissions.length === 0 ? (
                <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-neutral-200">
                  <p className="text-xs font-medium text-neutral-500">
                    No permissions currently granted. Click "Connect Google Workspace" to authorize services.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {permissions.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-neutral-900">{p.service}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-200 text-neutral-700">
                            {p.scope.split('/').pop()}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">{p.description}</p>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 self-start sm:self-auto bg-emerald-100 px-2 py-0.5 rounded">
                        Authorized
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Audit Trail Logs */}
        {activeTab === 'audit' && (
          <div className="p-6 overflow-y-auto flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">Google Workspace Audit Trail</h4>
                <p className="text-xs text-neutral-500">
                  Immutable record of all actions performed with your connected Google account.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleExportAudit}
                  className="px-3 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export JSON</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded font-bold uppercase text-[10px] bg-neutral-200 text-neutral-800">
                        {log.service}
                      </span>
                      <span className="font-bold text-neutral-900">{log.action}</span>
                    </div>
                    <span className="text-[10px] text-neutral-400">
                      {new Date(log.timestamp).toLocaleTimeString()} · {new Date(log.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-neutral-700 font-sans">{log.purpose}</p>
                  {log.details && (
                    <p className="text-[11px] text-neutral-500 font-sans italic">{log.details}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
