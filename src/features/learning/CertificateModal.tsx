/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
  X,
  Award,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  QrCode,
  Sparkles,
} from 'lucide-react';
import { Certificate } from '../../types/learning';

interface CertificateModalProps {
  certificate: Certificate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  certificate,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !certificate) return null;

  const handleShare = () => {
    navigator.clipboard.writeText(certificate.verificationUrl);
    alert('Certificate verification link copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-neutral-950/80 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-neutral-200 text-neutral-900 my-4"
      >
        {/* Modal Controls Header */}
        <div className="p-4 bg-neutral-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>ENEMIND Verified Academic Credential</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl bg-white/10 transition-colors cursor-pointer"
              title="Share verification link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 text-neutral-400 hover:text-white rounded-xl bg-white/10 transition-colors cursor-pointer"
              title="Print Certificate"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-full bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 bg-linear-to-b from-neutral-50 via-white to-neutral-50 border-8 border-double border-neutral-200 m-4 rounded-2xl relative text-center space-y-6 print:m-0 print:border-none">
          {/* Top Emblem */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-neutral-900 text-amber-400 flex items-center justify-center border-4 border-amber-300 shadow-md">
              <Award className="w-8 h-8" />
            </div>
          </div>

          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-black text-neutral-400 block mb-1">
              ENEMIND UNIVERSITY & LEARNING ECOSYSTEM
            </span>
            <h1 className="text-xl sm:text-2xl font-black font-heading text-neutral-900 tracking-tight">
              CERTIFICATE OF COMPLETION
            </h1>
            <p className="text-xs text-neutral-500 mt-1">This official document certifies that</p>
          </div>

          {/* Student Name */}
          <div className="py-2 border-b-2 border-neutral-300 max-w-md mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900 italic">
              {certificate.studentName}
            </h2>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-neutral-500">has successfully completed all required modules for</p>
            <h3 className="text-base sm:text-lg font-bold font-heading text-emerald-900">
              {certificate.courseTitle}
            </h3>
            {certificate.gradeScore && (
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200 mt-2">
                Honors: {certificate.gradeScore}
              </span>
            )}
          </div>

          {/* Verified Skills */}
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2">
              Verified Mastered Competencies
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {certificate.skills.map((sk) => (
                <span
                  key={sk}
                  className="px-2.5 py-0.5 bg-neutral-100 text-neutral-800 rounded-md text-[11px] font-semibold"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Signatures & Verification Bar */}
          <div className="pt-6 border-t border-neutral-200 grid grid-cols-2 gap-6 text-left text-xs">
            <div>
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Instructor</p>
              <p className="font-bold text-neutral-900 mt-0.5">{certificate.providerName}</p>
              <p className="text-[10px] text-neutral-500">Verified Academic Provider</p>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider">Credential ID</p>
              <p className="font-mono font-bold text-neutral-900 mt-0.5">{certificate.certificateNumber}</p>
              <p className="text-[10px] text-neutral-500">
                Issued {new Date(certificate.issuedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Verification Link */}
          <div className="pt-2 text-center text-[10px] text-neutral-400">
            Verify authenticity at: <span className="font-mono text-neutral-600 underline">{certificate.verificationUrl}</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
